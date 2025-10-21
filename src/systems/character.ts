/**
 * Character System
 * Character creation, stat management, and progression
 */

import type { Character, CharacterTypeName, CharacterStats, Equipment } from '../types';
import { CHARACTER_TYPES } from '../data/characterTypes';
import { calculateStatsAtLevel, calculateXpForLevel } from '../utils/formulas';
import { generateId } from '../utils/random';
import { calculateEquipmentBonuses } from './equipment';
import { calculateStatusEffectStatModifiers } from './statusEffects';

/**
 * Create a new character instance
 */
export function createCharacter(
  typeName: CharacterTypeName,
  level: number = 1,
  customName?: string
): Character {
  const characterType = CHARACTER_TYPES[typeName];
  const stats = calculateStatsAtLevel(
    characterType.baseStats,
    characterType.statGrowth,
    level
  );
  
  return {
    id: generateId(),
    type: typeName,
    name: customName || characterType.name,
    
    level,
    currentXp: 0,
    xpToNextLevel: calculateXpForLevel(level + 1),
    skillPoints: level - 1, // 1 skill point per level after level 1
    
    stats: { ...stats },
    
    currentAp: characterType.baseApRegen, // Start with base AP
    statusEffects: [],
    
    unlockedAbilities: [...characterType.startingAbilities],
    equippedAbilities: [...characterType.startingAbilities],
    
    equipment: {
      mainHand: null,
      offHand: null,
      head: null,
      chest: null,
      legs: null,
      neck: null,
      wrist1: null,
      wrist2: null,
    },
    
    skillTreeNodes: [],
    
    isAlive: true,
    isInActiveTeam: false,
  };
}

/**
 * Calculate character's current stats including equipment bonuses and status effects
 */
export function calculateCurrentStats(
  character: Character,
  equipmentInventory: Equipment[] = []
): CharacterStats {
  const baseStats = { ...character.stats };
  
  // Apply equipment bonuses (Phase 4)
  const equipmentBonuses = calculateEquipmentBonuses(character.equipment, equipmentInventory);
  
  // Apply equipment bonuses to stats
  Object.entries(equipmentBonuses).forEach(([stat, value]) => {
    if (stat === 'hp') {
      // HP bonus increases max HP
      baseStats.maxHp += value;
      // Also increase current HP proportionally if at max
      if (baseStats.hp === baseStats.maxHp - value) {
        baseStats.hp = baseStats.maxHp;
      }
    } else if (stat in baseStats) {
      (baseStats as any)[stat] += value;
    }
  });
  
  // Apply status effect modifiers (Phase 5)
  const { flatModifiers, multipliers } = calculateStatusEffectStatModifiers(character);
  
  // Apply flat modifiers first
  Object.entries(flatModifiers).forEach(([stat, value]) => {
    if (stat === 'hp') {
      baseStats.maxHp += value;
      if (value > 0) {
        // Increase current HP if max HP increased
        baseStats.hp = Math.min(baseStats.hp + value, baseStats.maxHp);
      }
    } else if (stat === 'apRegen') {
      // apRegen is handled separately in regenerateAp
      // Store it for future use if needed
    } else if (stat in baseStats) {
      (baseStats as any)[stat] += value;
    }
  });
  
  // Apply multipliers
  Object.entries(multipliers).forEach(([stat, multiplier]) => {
    if (stat === 'hp') {
      const hpRatio = baseStats.hp / baseStats.maxHp;
      baseStats.maxHp = Math.floor(baseStats.maxHp * multiplier);
      baseStats.hp = Math.floor(baseStats.maxHp * hpRatio);
    } else if (stat === 'apRegen') {
      // apRegen multiplier handled separately
    } else if (stat in baseStats) {
      (baseStats as any)[stat] = Math.floor((baseStats as any)[stat] * multiplier);
    }
  });
  
  // Ensure stats don't go below minimum values
  baseStats.hp = Math.max(0, baseStats.hp);
  baseStats.maxHp = Math.max(1, baseStats.maxHp);
  baseStats.atk = Math.max(0, baseStats.atk);
  baseStats.def = Math.max(0, baseStats.def);
  baseStats.mag = Math.max(0, baseStats.mag);
  baseStats.res = Math.max(0, baseStats.res);
  baseStats.spd = Math.max(1, baseStats.spd);
  baseStats.crt = Math.max(0, Math.min(100, baseStats.crt)); // Crit capped at 100%
  baseStats.eva = Math.max(0, Math.min(95, baseStats.eva));  // Eva capped at 95%
  baseStats.acc = Math.max(5, Math.min(100, baseStats.acc)); // Acc between 5-100%
  
  return baseStats;
}

/**
 * Regenerate AP for a character at turn start
 * Includes status effect modifiers to AP regen
 */
export function regenerateAp(character: Character): void {
  const characterType = CHARACTER_TYPES[character.type];
  let apRegen = characterType.baseApRegen;
  
  // Apply status effect modifiers to AP regen
  const { flatModifiers, multipliers } = calculateStatusEffectStatModifiers(character);
  
  if (flatModifiers.apRegen) {
    apRegen += flatModifiers.apRegen;
  }
  
  if (multipliers.apRegen) {
    apRegen = Math.floor(apRegen * multipliers.apRegen);
  }
  
  // Ensure minimum 1 AP regen
  apRegen = Math.max(1, apRegen);
  
  const newAp = Math.min(
    characterType.maxAp,
    character.currentAp + apRegen
  );
  character.currentAp = newAp;
}

/**
 * Consume AP for an ability
 * Returns true if successful, false if insufficient AP
 */
export function consumeAp(character: Character, amount: number): boolean {
  if (character.currentAp < amount) {
    return false;
  }
  character.currentAp -= amount;
  return true;
}

/**
 * Restore AP to a character
 */
export function restoreAp(character: Character, amount: number): void {
  const characterType = CHARACTER_TYPES[character.type];
  character.currentAp = Math.min(characterType.maxAp, character.currentAp + amount);
}

/**
 * Deal damage to a character
 * Returns true if character died
 */
export function damageCharacter(character: Character, damage: number): boolean {
  character.stats.hp = Math.max(0, character.stats.hp - damage);
  
  if (character.stats.hp === 0) {
    character.isAlive = false;
    return true;
  }
  
  return false;
}

/**
 * Heal a character
 * Returns actual healing amount (capped at maxHp)
 */
export function healCharacter(character: Character, healing: number): number {
  const oldHp = character.stats.hp;
  character.stats.hp = Math.min(character.stats.maxHp, character.stats.hp + healing);
  return character.stats.hp - oldHp;
}

/**
 * Award XP to a character and handle level ups
 * Returns number of levels gained
 */
export function awardXp(character: Character, xp: number): number {
  character.currentXp += xp;
  let levelsGained = 0;
  
  while (character.currentXp >= character.xpToNextLevel) {
    character.currentXp -= character.xpToNextLevel;
    character.level++;
    levelsGained++;
    
    // Level up: increase stats
    const characterType = CHARACTER_TYPES[character.type];
    const newStats = calculateStatsAtLevel(
      characterType.baseStats,
      characterType.statGrowth,
      character.level
    );
    
    // Update stats and fully heal
    const hpPercentage = character.stats.hp / character.stats.maxHp;
    character.stats = { ...newStats };
    character.stats.hp = Math.floor(character.stats.maxHp * hpPercentage); // Maintain HP %
    
    // Award skill point
    character.skillPoints++;
    
    // Update XP requirement for next level
    character.xpToNextLevel = calculateXpForLevel(character.level + 1);
  }
  
  return levelsGained;
}

/**
 * Revive a character (for reserve swap)
 */
export function reviveCharacter(character: Character): void {
  if (!character.isAlive && character.stats.hp === 0) {
    character.stats.hp = 1; // Revive with 1 HP
    character.isAlive = true;
  }
}

/**
 * Reset character to full HP and AP (for post-battle or debugging)
 */
export function fullyRestoreCharacter(character: Character): void {
  character.stats.hp = character.stats.maxHp;
  const characterType = CHARACTER_TYPES[character.type];
  character.currentAp = characterType.maxAp;
  character.isAlive = true;
}

/**
 * Check if character can use an ability
 */
export function canUseAbility(character: Character, abilityId: string, apCost: number): boolean {
  return (
    character.isAlive &&
    character.equippedAbilities.includes(abilityId) &&
    character.currentAp >= apCost
  );
}
