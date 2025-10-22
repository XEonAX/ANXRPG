import { ScreenManager, type ScreenContext } from './core/ScreenManager';
import { EventBus, GameEvents } from './core/EventBus';
import { 
  createElement, 
  createButton, 
  createHPBar, 
  showNotification
} from './core/UIHelpers';
import type { UIGameState } from './core/UIState';
import type { CombatState } from '../types/combat';
import type { Character } from '../types/character';
import type { Enemy } from '../types/enemy';
import type { Ability } from '../types/ability';
import { getAbility } from '../data/abilities';
import { 
  startCombat,
  getCurrentCombatant,
  executeAbility,
  endTurn,
  getRecentLog,
  swapReserveTeam,
  acceptDefeat
} from '../systems/combat';

/**
 * Render the combat screen
 */
export function renderCombat(context: ScreenContext): HTMLElement {
  const container = createElement('div', 'screen screen--combat');
  
  const uiState = context.uiState as UIGameState | undefined;
  const combatState = context.combat as CombatState | undefined;
  const stageNumber = context.stage as number | undefined;
  
  if (!uiState || !combatState) {
    container.innerHTML = '<p>Error: Invalid combat state</p>';
    return container;
  }
  
  // Start combat if in setup phase
  if (combatState.phase === 'setup') {
    startCombat(combatState);
  }
  
  // Combat header
  const header = createElement('div', 'combat-header');
  const title = createElement('h1', 'combat-header__title');
  title.textContent = `⚔️ Stage ${stageNumber || '?'} - Battle`;
  
  const roundInfo = createElement('div', 'combat-header__round');
  roundInfo.textContent = `Round ${combatState.roundNumber} | Turn ${combatState.currentTurn}`;
  
  header.appendChild(title);
  header.appendChild(roundInfo);
  
  // Main combat area (teams + action panel)
  const combatArea = createElement('div', 'combat-area');
  
  // Player team (left side)
  const playerSection = renderPlayerTeam(combatState, uiState);
  
  // Enemy team (right side)
  const enemySection = renderEnemyTeam(combatState);
  
  combatArea.appendChild(playerSection);
  combatArea.appendChild(enemySection);
  
  // Action panel (bottom - ability buttons)
  const actionPanel = renderActionPanel(combatState, uiState, stageNumber);
  
  // Combat log (scrolling message history)
  const logPanel = renderCombatLog(combatState);
  
  // Assemble screen
  container.appendChild(header);
  container.appendChild(combatArea);
  container.appendChild(actionPanel);
  container.appendChild(logPanel);
  
  // Check for victory/defeat after render
  checkCombatEnd(combatState, uiState, stageNumber);
  
  return container;
}

/**
 * Render player team section
 */
function renderPlayerTeam(combat: CombatState, _uiState: UIGameState): HTMLElement {
  const section = createElement('div', 'combat-team combat-team--player');
  
  const title = createElement('h2', 'combat-team__title');
  title.textContent = '👥 Your Team';
  section.appendChild(title);
  
  // Active team
  const activeContainer = createElement('div', 'combat-team__active');
  combat.playerTeam.forEach(char => {
    const card = renderCharacterCard(char, combat);
    activeContainer.appendChild(card);
  });
  section.appendChild(activeContainer);
  
  // Reserve team (collapsed sidebar)
  if (combat.reserveTeam.length > 0) {
    const reserveContainer = createElement('div', 'combat-team__reserve');
    const reserveTitle = createElement('h3', 'combat-team__reserve-title');
    reserveTitle.textContent = `Reserve (${combat.reserveTeam.length})`;
    reserveContainer.appendChild(reserveTitle);
    
    combat.reserveTeam.forEach(char => {
      const miniCard = createElement('div', 'combat-reserve-card');
      miniCard.textContent = `${char.name} (${char.stats.hp}/${char.stats.maxHp} HP)`;
      reserveContainer.appendChild(miniCard);
    });
    
    section.appendChild(reserveContainer);
  }
  
  return section;
}

/**
 * Render enemy team section
 */
function renderEnemyTeam(combat: CombatState): HTMLElement {
  const section = createElement('div', 'combat-team combat-team--enemy');
  
  const title = createElement('h2', 'combat-team__title');
  title.textContent = '💀 Enemies';
  section.appendChild(title);
  
  const enemyContainer = createElement('div', 'combat-team__active');
  combat.enemyTeam.forEach(enemy => {
    const card = renderEnemyCard(enemy, combat);
    enemyContainer.appendChild(card);
  });
  section.appendChild(enemyContainer);
  
  return section;
}

/**
 * Render character card with HP/AP/status
 */
function renderCharacterCard(char: Character, combat: CombatState): HTMLElement {
  const currentCombatant = getCurrentCombatant(combat);
  const isActive = currentCombatant?.id === char.id;
  
  const card = createElement('div', `combat-character-card${isActive ? ' combat-character-card--active' : ''}`);
  card.dataset.characterId = char.id;
  
  // Name and type
  const header = createElement('div', 'combat-character-card__header');
  const name = createElement('h3', 'combat-character-card__name');
  name.textContent = char.name;
  const type = createElement('span', 'combat-character-card__type');
  type.textContent = char.type;
  header.appendChild(name);
  header.appendChild(type);
  card.appendChild(header);
  
  // HP bar
  const hpBar = createHPBar(char.stats.hp, char.stats.maxHp);
  card.appendChild(hpBar);
  
  // AP display (manual creation)
  const apContainer = createElement('div', 'ap-bar-container');
  const apLabel = createElement('span', 'ap-bar-label');
  apLabel.textContent = 'AP:';
  const apText = createElement('span', 'ap-bar-text');
  apText.textContent = `${char.currentAp}/10`;
  apContainer.appendChild(apLabel);
  apContainer.appendChild(apText);
  card.appendChild(apContainer);
  
  // Status effects
  if (char.statusEffects && char.statusEffects.length > 0) {
    const statusContainer = createElement('div', 'combat-character-card__status');
    char.statusEffects.forEach(effect => {
      const statusBadge = createElement('span', 'status-badge');
      statusBadge.textContent = `${effect.name} (${effect.duration})`;
      statusBadge.title = effect.description || '';
      statusContainer.appendChild(statusBadge);
    });
    card.appendChild(statusContainer);
  }
  
  // Turn indicator
  if (isActive) {
    const indicator = createElement('div', 'combat-character-card__turn-indicator');
    indicator.textContent = '▶ YOUR TURN';
    card.appendChild(indicator);
  }
  
  return card;
}

/**
 * Render enemy card with HP/status
 */
function renderEnemyCard(enemy: Enemy, combat: CombatState): HTMLElement {
  const currentCombatant = getCurrentCombatant(combat);
  const isActive = currentCombatant?.id === enemy.id;
  
  const card = createElement('div', `combat-enemy-card${isActive ? ' combat-enemy-card--active' : ''}`);
  card.dataset.enemyId = enemy.id;
  
  // Name and level
  const header = createElement('div', 'combat-enemy-card__header');
  const name = createElement('h3', 'combat-enemy-card__name');
  name.textContent = enemy.name;
  const level = createElement('span', 'combat-enemy-card__level');
  level.textContent = `Lv ${enemy.level}`;
  header.appendChild(name);
  header.appendChild(level);
  card.appendChild(header);
  
  // HP bar (Enemy uses stats.hp for current HP)
  const hpBar = createHPBar(enemy.stats.hp, enemy.stats.maxHp);
  card.appendChild(hpBar);
  
  // Status effects
  if (enemy.statusEffects && enemy.statusEffects.length > 0) {
    const statusContainer = createElement('div', 'combat-enemy-card__status');
    enemy.statusEffects.forEach(effect => {
      const statusBadge = createElement('span', 'status-badge');
      statusBadge.textContent = `${effect.name} (${effect.duration})`;
      statusContainer.appendChild(statusBadge);
    });
    card.appendChild(statusContainer);
  }
  
  // Turn indicator
  if (isActive) {
    const indicator = createElement('div', 'combat-enemy-card__turn-indicator');
    indicator.textContent = '▶ ENEMY TURN';
    card.appendChild(indicator);
  }
  
  return card;
}

/**
 * Render action panel with ability buttons
 */
function renderActionPanel(combat: CombatState, uiState: UIGameState, stageNumber?: number): HTMLElement {
  const panel = createElement('div', 'combat-action-panel');
  
  const currentCombatant = getCurrentCombatant(combat);
  
  // If no current combatant or it's an enemy turn, show waiting message
  if (!currentCombatant || currentCombatant.type === 'enemy') {
    panel.innerHTML = '<p class="combat-action-panel__waiting">⏳ Enemy turn...</p>';
    
    // Auto-process enemy turn after a short delay
    if (currentCombatant?.type === 'enemy') {
      setTimeout(() => {
        processEnemyTurn(combat, uiState, stageNumber);
      }, 1000);
    }
    
    return panel;
  }
  
  // Player's turn - show abilities
  const character = currentCombatant.character!;
  
  const title = createElement('h3', 'combat-action-panel__title');
  title.textContent = `${character.name}'s Turn`;
  panel.appendChild(title);
  
  // Ability buttons
  const abilityContainer = createElement('div', 'combat-action-panel__abilities');
  
  character.equippedAbilities.forEach((abilityId: string) => {
    const ability = getAbility(abilityId);
    if (!ability) return;
    
    const canUse = character.currentAp >= ability.apCost;
    const btn = createAbilityButton(ability, character, combat, uiState, stageNumber, canUse);
    abilityContainer.appendChild(btn);
  });
  
  panel.appendChild(abilityContainer);
  
  // End turn button
  const endTurnBtn = createButton('🛑 End Turn', () => {
    endCharacterTurn(combat, uiState, stageNumber);
  }, 'btn btn--secondary combat-action-panel__end-turn');
  panel.appendChild(endTurnBtn);
  
  return panel;
}

/**
 * Create ability button with AP cost and targeting
 */
function createAbilityButton(
  ability: Ability, 
  character: Character, 
  combat: CombatState,
  uiState: UIGameState,
  stageNumber: number | undefined,
  canUse: boolean
): HTMLElement {
  const btn = createElement('button', `ability-btn${!canUse ? ' ability-btn--disabled' : ''}`);
  btn.disabled = !canUse;
  
  const nameSpan = createElement('span', 'ability-btn__name');
  nameSpan.textContent = ability.name;
  
  const costSpan = createElement('span', 'ability-btn__cost');
  costSpan.textContent = `${ability.apCost} AP`;
  
  btn.appendChild(nameSpan);
  btn.appendChild(costSpan);
  
  // Tooltip
  const dmgMult = ability.effects.damageMultiplier || 0;
  btn.title = `${ability.description}\nTarget: ${ability.targetType}\nDamage: ${dmgMult}x`;
  
  if (canUse) {
    btn.addEventListener('click', () => {
      handleAbilityClick(ability, character, combat, uiState, stageNumber);
    });
  }
  
  return btn;
}

/**
 * Handle ability button click - select target and execute
 */
function handleAbilityClick(
  ability: Ability,
  character: Character,
  combat: CombatState,
  uiState: UIGameState,
  stageNumber?: number
): void {
  // Determine targets based on ability type
  let targetIds: string[];
  
  switch (ability.targetType) {
    case 'self':
      targetIds = [character.id];
      break;
      
    case 'single-ally':
      // For now, target first ally (could add target selection UI later)
      targetIds = [combat.playerTeam.find(c => c.id !== character.id)?.id || character.id];
      break;
      
    case 'all-allies':
    case 'aoe-allies':
      // All player characters
      targetIds = combat.playerTeam.map(c => c.id);
      break;
      
    case 'all-enemies':
    case 'aoe-enemies':
      // All enemies
      targetIds = combat.enemyTeam.map(e => e.id);
      break;
      
    case 'single-enemy':
    default:
      // First living enemy (could add target selection UI later)
      targetIds = [combat.enemyTeam[0]?.id || ''];
      break;
  }
  
  // Execute ability (signature is: state, abilityId, targetIds)
  const result = executeAbility(combat, ability.id, targetIds);
  
  if (!result) {
    showNotification('❌ Failed to execute ability', 'error');
    return;
  }
  
  // Show results notification
  if (result.damageResults && result.damageResults.length > 0) {
    const totalDamage = result.damageResults.reduce((sum, r) => sum + r.damage, 0);
    showNotification(`💥 ${totalDamage} damage dealt!`, 'success');
  }
  
  if (result.healingResults && result.healingResults.length > 0) {
    const totalHealing = result.healingResults.reduce((sum, r) => sum + r.healing, 0);
    showNotification(`💚 ${totalHealing} HP restored!`, 'success');
  }
  
  // Re-render combat screen with updated state
  ScreenManager.updateContext({ combat, uiState, stage: stageNumber });
}

/**
 * End current character's turn
 */
function endCharacterTurn(combat: CombatState, uiState: UIGameState, stageNumber?: number): void {
  endTurn(combat);
  
  // Re-render to show next combatant
  ScreenManager.updateContext({ combat, uiState, stage: stageNumber });
}

/**
 * Process enemy turn (AI)
 */
function processEnemyTurn(combat: CombatState, uiState: UIGameState, stageNumber?: number): void {
  const currentCombatant = getCurrentCombatant(combat);
  if (!currentCombatant || currentCombatant.type !== 'enemy') {
    return;
  }
  
  const enemy = currentCombatant.enemy!;
  
  // Simple AI: use random ability on random player target
  if (enemy.abilities && enemy.abilities.length > 0) {
    const randomAbility = enemy.abilities[Math.floor(Math.random() * enemy.abilities.length)];
    const ability = getAbility(randomAbility);
    
    if (ability && enemy.currentAp >= ability.apCost) {
      let targetIds: string[];
      
      switch (ability.targetType) {
        case 'self':
          targetIds = [enemy.id];
          break;
        case 'all-enemies':
        case 'aoe-enemies':
          targetIds = combat.playerTeam.map(c => c.id);
          break;
        default:
          // Random player target
          const randomPlayer = combat.playerTeam[Math.floor(Math.random() * combat.playerTeam.length)];
          targetIds = [randomPlayer.id];
          break;
      }
      
      executeAbility(combat, randomAbility, targetIds);
    }
  }
  
  // End enemy turn
  endTurn(combat);
  
  // Re-render
  ScreenManager.updateContext({ combat, uiState, stage: stageNumber });
}

/**
 * Render combat log
 */
function renderCombatLog(combat: CombatState): HTMLElement {
  const logContainer = createElement('div', 'combat-log');
  
  const title = createElement('h3', 'combat-log__title');
  title.textContent = '📜 Combat Log';
  logContainer.appendChild(title);
  
  const messages = createElement('div', 'combat-log__messages');
  
  // Get recent log entries (last 20)
  const recentLog = getRecentLog(combat, 20);
  
  if (recentLog.length === 0) {
    const emptyMsg = createElement('p', 'combat-log__empty');
    emptyMsg.textContent = 'Combat starting...';
    messages.appendChild(emptyMsg);
  } else {
    recentLog.forEach(entry => {
      const msgDiv = createElement('div', `combat-log__entry combat-log__entry--${entry.type}`);
      
      const timestamp = createElement('span', 'combat-log__timestamp');
      timestamp.textContent = `[T${entry.turn}]`;
      
      const message = createElement('span', 'combat-log__message');
      message.textContent = entry.message;
      
      msgDiv.appendChild(timestamp);
      msgDiv.appendChild(message);
      messages.appendChild(msgDiv);
    });
    
    // Auto-scroll to bottom
    setTimeout(() => {
      messages.scrollTop = messages.scrollHeight;
    }, 0);
  }
  
  logContainer.appendChild(messages);
  
  return logContainer;
}

/**
 * Check if combat has ended (victory/defeat)
 */
function checkCombatEnd(combat: CombatState, uiState: UIGameState, stageNumber?: number): void {
  if (combat.phase === 'victory') {
    // Navigate to battle results
    setTimeout(() => {
      EventBus.emit(GameEvents.COMBAT_END);
      ScreenManager.navigateTo('battleResults', { 
        combat, 
        uiState, 
        stage: stageNumber 
      });
    }, 1500);
  } else if (combat.phase === 'defeat') {
    // Show defeat message
    setTimeout(() => {
      EventBus.emit(GameEvents.COMBAT_END);
      showNotification('💀 Defeat! Returning to campaign...', 'error');
      setTimeout(() => {
        ScreenManager.navigateTo('campaignMap', { uiState });
      }, 2000);
    }, 1500);
  } else if (combat.phase === 'team-wipe') {
    // Show reserve swap option
    showReserveSwapDialog(combat, uiState, stageNumber);
  }
}

/**
 * Show dialog for swapping to reserve team
 */
function showReserveSwapDialog(combat: CombatState, uiState: UIGameState, stageNumber?: number): void {
  const modal = createElement('div', 'modal modal--active');
  const content = createElement('div', 'modal__content');
  
  const title = createElement('h2', 'modal__title');
  title.textContent = '💀 Team Wiped!';
  
  const message = createElement('p', 'modal__message');
  message.textContent = `Your active team has been defeated. You have ${combat.reserveTeam.length} reserve characters available.`;
  
  const actions = createElement('div', 'modal__actions');
  
  const swapBtn = createButton('⚔️ Swap to Reserve', () => {
    swapReserveTeam(combat);
    document.body.removeChild(modal);
    ScreenManager.updateContext({ combat, uiState, stage: stageNumber });
  }, 'btn btn--primary');
  
  const defeatBtn = createButton('🏳️ Accept Defeat', () => {
    acceptDefeat(combat);
    document.body.removeChild(modal);
    ScreenManager.updateContext({ combat, uiState, stage: stageNumber });
  }, 'btn btn--danger');
  
  actions.appendChild(swapBtn);
  actions.appendChild(defeatBtn);
  
  content.appendChild(title);
  content.appendChild(message);
  content.appendChild(actions);
  modal.appendChild(content);
  
  document.body.appendChild(modal);
}
