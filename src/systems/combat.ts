/**
 * Combat System
 * 
 * Manages turn-based combat flow:
 * - Turn order calculation (speed-based between teams)
 * - Player turn order selection (one-time at battle start)
 * - Multi-action support (sequential abilities with "end turn" option)
 * - Action resolution (attacks, abilities, healing)
 * - Team wipe detection and reserve swap
 * - Victory/defeat conditions
 */

import type { Character } from '../types/character';
import type { Enemy } from '../types/enemy';
import type { Equipment } from '../types/equipment';
import type { 
  CombatState, 
  CombatLogEntry,
  Combatant,
  TurnOrder,
  AbilityResult
} from '../types/combat';
import type { Ability } from '../types/ability';
import { 
  processStatusEffectTicks, 
  decrementStatusEffectDurations,
  isUnderControlEffect,
  applyStatusEffect,
  type CombatEntity
} from './statusEffects';
import { awardXp } from './character';
import { generateEquipment } from './equipment';
import { calculateEnemyXpReward, rollEquipmentDrop } from './enemy';
import { 
  calculateAoEDamage,
  calculateAoEHealing,
  calculateLifestealHealing
} from './damage';
import { consumeAp, regenerateAp, damageCharacter, healCharacter } from './character';
import { randomInt } from '../utils/random';
import { getAbility } from '../data/abilities';
import { 
  checkBossSummonTriggers,
  summonMinions,
  cleanupDeadSummons,
  getEnemyTemplate
} from './enemy';
import { shouldCountForRecruitment } from './recruitment';

/**
 * Initialize a new combat state
 */
export function initializeCombat(
  playerTeam: Character[],
  reserveTeam: Character[],
  enemyTeam: Enemy[]
): CombatState {
  return {
    phase: 'setup',
    playerTeam,
    reserveTeam,
    enemyTeam,
    turnOrder: {
      combatants: [],
      currentIndex: 0,
    },
    currentTurn: 0,
    roundNumber: 1,
    playerTurnOrder: [],
    playerTurnOrderLocked: false,
    actionsThisTurn: [],
    turnInProgress: false,
    combatLog: [],
    victory: false,
  };
}

/**
 * Calculate turn order based on speed
 * Sorts combatants by speed, with random tiebreaker
 */
export function calculateTurnOrder(state: CombatState): TurnOrder {
  const combatants: Combatant[] = [];
  
  // Add player characters
  state.playerTeam.forEach(char => {
    combatants.push({
      id: char.id,
      type: 'player',
      character: char,
    });
  });
  
  // Add enemies
  state.enemyTeam.forEach(enemy => {
    combatants.push({
      id: enemy.id,
      type: 'enemy',
      enemy: enemy,
    });
  });
  
  // Sort by speed (descending), with random tiebreaker
  combatants.sort((a, b) => {
    const speedA = a.character?.stats.spd || a.enemy?.stats.spd || 0;
    const speedB = b.character?.stats.spd || b.enemy?.stats.spd || 0;
    
    if (speedA === speedB) {
      return randomInt(0, 1) === 0 ? -1 : 1;
    }
    
    return speedB - speedA; // Higher speed goes first
  });
  
  return {
    combatants,
    currentIndex: 0,
  };
}

/**
 * Set player-defined turn order (one-time at battle start)
 */
export function setPlayerTurnOrder(
  state: CombatState,
  characterIds: string[]
): void {
  if (state.playerTurnOrderLocked) {
    throw new Error('Player turn order is already locked');
  }
  
  // Validate all IDs are in player team
  const validIds = characterIds.every(id => 
    state.playerTeam.some(char => char.id === id)
  );
  
  if (!validIds) {
    throw new Error('Invalid character IDs in turn order');
  }
  
  state.playerTurnOrder = characterIds;
  state.playerTurnOrderLocked = true;
  
  addCombatLog(state, {
    type: 'turn-start',
    turn: state.currentTurn,
    timestamp: Date.now(),
    message: 'Battle begins! Turn order set.',
  });
}

/**
 * Start combat - calculate initial turn order and begin
 */
export function startCombat(state: CombatState): void {
  if (state.phase !== 'setup') {
    throw new Error('Combat already started');
  }
  
  // Calculate turn order
  state.turnOrder = calculateTurnOrder(state);
  state.phase = 'active';
  state.currentTurn = 1;
  
  addCombatLog(state, {
    type: 'turn-start',
    turn: state.currentTurn,
    timestamp: Date.now(),
    message: `Round ${state.roundNumber} begins!`,
  });
  
  // Process start-of-turn effects for first combatant
  processStartOfTurn(state);
}

/**
 * Get the current active combatant
 */
export function getCurrentCombatant(state: CombatState): Combatant | null {
  if (state.turnOrder.combatants.length === 0) {
    return null;
  }
  
  return state.turnOrder.combatants[state.turnOrder.currentIndex];
}

/**
 * Get character or enemy from combatant
 */
export function getCombatantEntity(combatant: Combatant): Character | Enemy {
  return combatant.character || combatant.enemy!;
}

/**
 * Process start of turn effects
 */
function processStartOfTurn(state: CombatState): void {
  const combatant = getCurrentCombatant(state);
  if (!combatant) return;
  
  const entity = getCombatantEntity(combatant);
  
  // Regenerate AP
  if ('currentAp' in entity) {
    regenerateAp(entity as Character);
  }
  
  // Process status effect ticks (start of turn)
  const { damage, healing } = processStatusEffectTicks(entity, true);
  
  if (damage > 0) {
    damageCharacter(entity as Character, damage);
    addCombatLog(state, {
      type: 'damage',
      turn: state.currentTurn,
      timestamp: Date.now(),
      message: `${entity.name} takes ${damage} damage from status effects.`,
      targetIds: [entity.id],
    });
  }
  
  if (healing > 0) {
    healCharacter(entity as Character, healing);
    addCombatLog(state, {
      type: 'healing',
      turn: state.currentTurn,
      timestamp: Date.now(),
      message: `${entity.name} recovers ${healing} HP from status effects.`,
      targetIds: [entity.id],
    });
  }
  
  // Check if under control effect
  if (isUnderControlEffect(entity)) {
    addCombatLog(state, {
      type: 'status-applied',
      turn: state.currentTurn,
      timestamp: Date.now(),
      message: `${entity.name} is unable to act!`,
      actorId: entity.id,
    });
    
    // Skip turn
    endTurn(state);
  }
}

/**
 * Process end of turn effects
 */
function processEndOfTurn(state: CombatState): void {
  const combatant = getCurrentCombatant(state);
  if (!combatant) return;
  
  const entity = getCombatantEntity(combatant);
  
  // Process status effect ticks (end of turn)
  const { damage, healing } = processStatusEffectTicks(entity, false);
  
  if (damage > 0) {
    damageCharacter(entity as Character, damage);
    addCombatLog(state, {
      type: 'damage',
      turn: state.currentTurn,
      timestamp: Date.now(),
      message: `${entity.name} takes ${damage} damage from status effects.`,
      targetIds: [entity.id],
    });
  }
  
  if (healing > 0) {
    healCharacter(entity as Character, healing);
    addCombatLog(state, {
      type: 'healing',
      turn: state.currentTurn,
      timestamp: Date.now(),
      message: `${entity.name} recovers ${healing} HP from status effects.`,
      targetIds: [entity.id],
    });
  }
  
  // Decrement status effect durations
  decrementStatusEffectDurations(entity);
  
  // Check for expired effects
  const expiredEffects = entity.statusEffects.filter(e => e.duration === 0);
  expiredEffects.forEach(effect => {
    addCombatLog(state, {
      type: 'status-expired',
      turn: state.currentTurn,
      timestamp: Date.now(),
      message: `${effect.name} expired on ${entity.name}.`,
      actorId: entity.id,
      statusEffectId: effect.id,
    });
  });
}

/**
 * End current turn and advance to next combatant
 */
export function endTurn(state: CombatState): void {
  processEndOfTurn(state);
  
  // Clear turn state
  state.actionsThisTurn = [];
  state.turnInProgress = false;
  state.currentActorId = undefined;
  
  // Advance to next combatant
  state.turnOrder.currentIndex++;
  state.currentTurn++;
  
  // Check if we've completed a full round
  if (state.turnOrder.currentIndex >= state.turnOrder.combatants.length) {
    state.turnOrder.currentIndex = 0;
    state.roundNumber++;
    
    addCombatLog(state, {
      type: 'turn-start',
      turn: state.currentTurn,
      timestamp: Date.now(),
      message: `Round ${state.roundNumber} begins!`,
    });
  }
  
  // Remove dead combatants from turn order
  state.turnOrder.combatants = state.turnOrder.combatants.filter(c => {
    const entity = getCombatantEntity(c);
    return entity.isAlive;
  });
  
  // Check victory/defeat conditions
  checkBattleEnd(state);
  
  if (state.phase === 'active') {
    // Process start of next turn
    processStartOfTurn(state);
  }
}

/**
 * Execute an ability action
 */
export function executeAbility(
  state: CombatState,
  abilityId: string,
  targetIds: string[]
): AbilityResult | null {
  const combatant = getCurrentCombatant(state);
  if (!combatant) return null;
  
  const actor = getCombatantEntity(combatant);
  
  // Look up the ability
  const ability = getAbility(abilityId);
  if (!ability) {
    console.error(`Ability ${abilityId} not found`);
    return null;
  }
  
  // Check if actor has enough AP
  if ('currentAp' in actor && actor.currentAp < ability.apCost) {
    addCombatLog(state, {
      type: 'ability-use',
      turn: state.currentTurn,
      timestamp: Date.now(),
      message: `${actor.name} doesn't have enough AP for ${ability.name}!`,
      actorId: actor.id,
      abilityId,
    });
    return null;
  }
  
  // Consume AP
  if ('currentAp' in actor) {
    consumeAp(actor as Character, ability.apCost);
  }
  
  // Initialize result
  const result: AbilityResult = {
    abilityId,
    abilityName: ability.name,
    actorId: actor.id,
    actorName: actor.name,
    apCost: ability.apCost,
    damageResults: [],
    healingResults: [],
    deaths: [],
  };
  
  // Log ability usage
  addCombatLog(state, {
    type: 'ability-use',
    turn: state.currentTurn,
    timestamp: Date.now(),
    message: `${actor.name} uses ${ability.name}!`,
    actorId: actor.id,
    abilityId,
  });
  
  // Get targets based on target type
  const targets = resolveTargets(state, ability, targetIds, combatant.type);
  
  if (targets.length === 0) {
    addCombatLog(state, {
      type: 'ability-use',
      turn: state.currentTurn,
      timestamp: Date.now(),
      message: `No valid targets for ${ability.name}!`,
      actorId: actor.id,
      abilityId,
    });
    return result;
  }
  
  // Process damage effects
  if (ability.effects.damageMultiplier || ability.effects.flatDamage) {
    result.damageResults = calculateAoEDamage(actor, targets, ability);
    
    // Apply damage and check for deaths
    for (const damageResult of result.damageResults) {
      const target = targets.find(t => t.id === damageResult.targetId);
      if (!target) continue;
      
      if (damageResult.isMiss) {
        addCombatLog(state, {
          type: 'damage',
          turn: state.currentTurn,
          timestamp: Date.now(),
          message: `${actor.name}'s attack missed ${target.name}!`,
          actorId: actor.id,
          targetIds: [target.id],
        });
      } else {
        // Apply damage
        damageCharacter(target as Character, damageResult.damage);
        
        const critText = damageResult.isCritical ? ' **CRITICAL HIT!**' : '';
        addCombatLog(state, {
          type: 'damage',
          turn: state.currentTurn,
          timestamp: Date.now(),
          message: `${target.name} takes ${damageResult.damage} ${damageResult.damageType} damage!${critText}`,
          actorId: actor.id,
          targetIds: [target.id],
        });
        
        // Check if target died
        if (!target.isAlive) {
          result.deaths?.push(target.id);
          addCombatLog(state, {
            type: 'death',
            turn: state.currentTurn,
            timestamp: Date.now(),
            message: `${target.name} has been defeated!`,
            targetIds: [target.id],
          });
          
          // Clean up boss summon tracking if this was a summoned minion
          for (const enemy of state.enemyTeam) {
            if (enemy.isBoss) {
              cleanupDeadSummons(enemy, target.id);
            }
          }
        }
      }
    }
    
    // Check for boss summons after damage (HP threshold triggers)
    for (const enemy of state.enemyTeam) {
      if (enemy.isAlive && enemy.isBoss) {
        const template = getEnemyTemplate(enemy.templateId);
        if (template) {
          const minionTemplateIds = checkBossSummonTriggers(enemy, template);
          if (minionTemplateIds.length > 0) {
            const summonedMinions = summonMinions(enemy, minionTemplateIds);
            
            // Add minions to enemy team
            state.enemyTeam.push(...summonedMinions);
            
            // Add minions to turn order
            for (const minion of summonedMinions) {
              state.turnOrder.combatants.push({
                id: minion.id,
                type: 'enemy',
                enemy: minion,
              });
            }
            
            // Recalculate turn order to maintain speed-based sorting
            state.turnOrder = calculateTurnOrder(state);
            
            addCombatLog(state, {
              type: 'turn-start', // Use existing type
              turn: state.currentTurn,
              timestamp: Date.now(),
              message: `${enemy.name} summons reinforcements! ${summonedMinions.map(m => m.name).join(', ')} appear!`,
              actorId: enemy.id,
            });
          }
        }
      }
    }
    
    // Apply lifesteal if applicable
    if (ability.effects.lifesteal && result.damageResults.length > 0) {
      const totalDamage = result.damageResults.reduce((sum, dr) => sum + dr.damage, 0);
      const lifestealAmount = calculateLifestealHealing(totalDamage, ability.effects.lifesteal);
      result.lifestealHealing = lifestealAmount;
      
      healCharacter(actor as Character, lifestealAmount);
      
      addCombatLog(state, {
        type: 'healing',
        turn: state.currentTurn,
        timestamp: Date.now(),
        message: `${actor.name} heals for ${lifestealAmount} HP from lifesteal!`,
        actorId: actor.id,
      });
    }
  }
  
  // Process healing effects
  if (ability.effects.healingMultiplier || ability.effects.flatHealing) {
    const healAmount = ability.effects.flatHealing || 0;
    const healMult = ability.effects.healingMultiplier || 0;
    
    result.healingResults = calculateAoEHealing(actor, targets, healAmount, healMult);
    
    // Apply healing
    for (const healResult of result.healingResults) {
      const target = targets.find(t => t.id === healResult.targetId);
      if (!target) continue;
      
      healCharacter(target as Character, healResult.healing);
      
      addCombatLog(state, {
        type: 'healing',
        turn: state.currentTurn,
        timestamp: Date.now(),
        message: `${target.name} recovers ${healResult.healing} HP!`,
        targetIds: [target.id],
      });
    }
  }
  
  // Apply status effects
  if (ability.effects.statusEffects) {
    for (const statusEffect of ability.effects.statusEffects) {
      // Check chance
      const roll = randomInt(1, 100);
      if (roll <= statusEffect.chance) {
        for (const target of targets) {
          const { applied, message } = applyStatusEffect(target as CombatEntity, statusEffect.effect);
          
          if (applied) {
            addCombatLog(state, {
              type: 'status-applied',
              turn: state.currentTurn,
              timestamp: Date.now(),
              message,
              actorId: actor.id,
              targetIds: [target.id],
              statusEffectId: statusEffect.effect.id,
            });
          }
        }
      }
    }
  }
  
  // AP restore/drain
  if (ability.effects.apRestore) {
    result.apRestored = ability.effects.apRestore;
    if ('currentAp' in actor) {
      const character = actor as Character;
      const MAX_AP = 10; // Standard max AP pool
      character.currentAp = Math.min(
        MAX_AP,
        character.currentAp + ability.effects.apRestore
      );
      
      addCombatLog(state, {
        type: 'ability-use',
        turn: state.currentTurn,
        timestamp: Date.now(),
        message: `${actor.name} restores ${ability.effects.apRestore} AP!`,
        actorId: actor.id,
      });
    }
  }
  
  if (ability.effects.apDrain) {
    result.apDrained = ability.effects.apDrain;
    for (const target of targets) {
      if ('currentAp' in target) {
        const drained = Math.min((target as Character).currentAp, ability.effects.apDrain);
        (target as Character).currentAp -= drained;
        
        addCombatLog(state, {
          type: 'ability-use',
          turn: state.currentTurn,
          timestamp: Date.now(),
          message: `${target.name} loses ${drained} AP!`,
          targetIds: [target.id],
        });
      }
    }
  }
  
  state.actionsThisTurn.push({
    type: 'ability',
    actorId: actor.id,
    abilityId,
    targetIds,
  });
  
  return result;
}

/**
 * Resolve targets for an ability based on target type
 */
function resolveTargets(
  state: CombatState,
  ability: Ability,
  targetIds: string[],
  actorType: 'player' | 'enemy'
): (Character | Enemy)[] {
  const targets: (Character | Enemy)[] = [];
  
  switch (ability.targetType) {
    case 'self':
      // Target is the actor themselves
      const actor = getCurrentCombatant(state);
      if (actor) {
        targets.push(getCombatantEntity(actor));
      }
      break;
      
    case 'single-ally':
      // Single ally from player or enemy team
      if (actorType === 'player') {
        const ally = state.playerTeam.find(c => c.id === targetIds[0] && c.isAlive);
        if (ally) targets.push(ally);
      } else {
        const ally = state.enemyTeam.find(e => e.id === targetIds[0] && e.isAlive);
        if (ally) targets.push(ally);
      }
      break;
      
    case 'single-enemy':
      // Single enemy from opposing team
      if (actorType === 'player') {
        const enemy = state.enemyTeam.find(e => e.id === targetIds[0] && e.isAlive);
        if (enemy) targets.push(enemy);
      } else {
        const enemy = state.playerTeam.find(c => c.id === targetIds[0] && c.isAlive);
        if (enemy) targets.push(enemy);
      }
      break;
      
    case 'all-allies':
    case 'aoe-allies':
      // All allies
      if (actorType === 'player') {
        targets.push(...state.playerTeam.filter(c => c.isAlive));
      } else {
        targets.push(...state.enemyTeam.filter(e => e.isAlive));
      }
      break;
      
    case 'all-enemies':
    case 'aoe-enemies':
      // All enemies
      if (actorType === 'player') {
        targets.push(...state.enemyTeam.filter(e => e.isAlive));
      } else {
        targets.push(...state.playerTeam.filter(c => c.isAlive));
      }
      break;
  }
  
  return targets;
}

/**
 * Check if battle has ended (victory or defeat)
 */
function checkBattleEnd(state: CombatState): void {
  const aliveEnemies = state.enemyTeam.filter(e => e.isAlive);
  const alivePlayerChars = state.playerTeam.filter(c => c.isAlive);
  
  // Victory: all enemies defeated
  if (aliveEnemies.length === 0 && !state.victory) {
    state.phase = 'victory';
    state.victory = true;
    
    // Calculate total XP from all defeated enemies
    const totalXp = state.enemyTeam
      .filter(e => !e.isAlive)
      .reduce((sum, e) => sum + calculateEnemyXpReward(e), 0);
    
    // Award XP to all 6 characters (active + reserve)
    const allCharacters = [...state.playerTeam, ...state.reserveTeam];
    const levelUpMessages: string[] = [];
    
    for (const char of allCharacters) {
      const xpGained = awardXp(char, totalXp);
      if (xpGained > 0) {
        // Check if character leveled up
        const oldLevel = char.level;
        // awardXp already handles level-ups internally
        if (char.level > oldLevel) {
          levelUpMessages.push(`${char.name} reached level ${char.level}!`);
        }
      }
    }
    
    // Generate equipment drops (max 1 per enemy, can be 0)
    const loot: Equipment[] = [];
    for (const enemy of state.enemyTeam) {
      if (!enemy.isAlive && rollEquipmentDrop(enemy)) {
        const equipment = generateEquipment(enemy.level);
        loot.push(equipment);
      }
    }
    
    // Populate state fields
    state.xpEarned = totalXp;
    state.lootDropped = loot;
    
    // Add victory message to combat log
    addCombatLog(state, {
      type: 'victory',
      turn: state.currentTurn,
      timestamp: Date.now(),
      message: `Victory! Earned ${totalXp} XP and ${loot.length} item${loot.length !== 1 ? 's' : ''}!`,
    });
    
    // Add level-up notifications
    for (const message of levelUpMessages) {
      addCombatLog(state, {
        type: 'turn-start',
        turn: state.currentTurn,
        timestamp: Date.now(),
        message,
      });
    }
    
    // TODO: Auto-save trigger point - call saveGame(true) from game.ts here
    // when integrating with UI/game loop
    
    return;
  }
  
  // Check if player team wiped
  if (alivePlayerChars.length === 0) {
    // Check if reserve team available
    const aliveReserve = state.reserveTeam.filter(c => c.isAlive);
    
    if (aliveReserve.length > 0) {
      // Offer reserve swap
      state.phase = 'team-wipe';
      
      addCombatLog(state, {
        type: 'team-swap',
        turn: state.currentTurn,
        timestamp: Date.now(),
        message: 'Active team wiped! Reserve team can swap in.',
      });
    } else {
      // Defeat: no reserve available
      state.phase = 'defeat';
      state.victory = false;
      
      addCombatLog(state, {
        type: 'defeat',
        turn: state.currentTurn,
        timestamp: Date.now(),
        message: 'Defeat! All characters have fallen.',
      });
    }
  }
}

/**
 * Swap in reserve team
 */
export function swapReserveTeam(state: CombatState): void {
  if (state.phase !== 'team-wipe') {
    throw new Error('Can only swap reserve team after team wipe');
  }
  
  // Swap teams
  state.playerTeam = state.reserveTeam.filter(c => c.isAlive);
  state.reserveTeam = [];
  
  // Recalculate turn order
  state.turnOrder = calculateTurnOrder(state);
  state.phase = 'active';
  
  addCombatLog(state, {
    type: 'team-swap',
    turn: state.currentTurn,
    timestamp: Date.now(),
    message: 'Reserve team swaps in!',
  });
}

/**
 * Accept defeat (instead of swapping reserve)
 */
export function acceptDefeat(state: CombatState): void {
  if (state.phase !== 'team-wipe') {
    throw new Error('Can only accept defeat after team wipe');
  }
  
  state.phase = 'defeat';
  state.victory = false;
  
  addCombatLog(state, {
    type: 'defeat',
    turn: state.currentTurn,
    timestamp: Date.now(),
    message: 'Defeat accepted.',
  });
}

/**
 * Add entry to combat log
 */
export function addCombatLog(state: CombatState, entry: CombatLogEntry): void {
  state.combatLog.push(entry);
}

/**
 * Get combat log entries for current turn
 */
export function getCurrentTurnLog(state: CombatState): CombatLogEntry[] {
  return state.combatLog.filter(entry => entry.turn === state.currentTurn);
}

/**
 * Get recent combat log entries (last N entries)
 */
export function getRecentLog(state: CombatState, count: number = 10): CombatLogEntry[] {
  return state.combatLog.slice(-count);
}

/**
 * Check if combat victory should count toward recruitment progress
 * 
 * NOTE: This is called from the game loop (Phase 9) after combat ends.
 * The game loop has access to both CombatState and GameState and can
 * increment PlayerProgress.totalBattlesWon when appropriate.
 * 
 * @param stageNumber - The stage number of the completed battle
 * @returns true if victory should count for recruitment tracking
 */
export function shouldVictoryCountForRecruitment(stageNumber: number): boolean {
  return shouldCountForRecruitment(stageNumber);
}

