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
import { getAbilityFlavorText, getEnemyFlavorText } from '../data/flavorText';
import { 
  startCombat,
  getCurrentCombatant,
  executeAbility,
  endTurn,
  swapReserveTeam,
  acceptDefeat,
  processEnemyAI
} from '../systems/combat';

// Selected target state - tracks which enemy is currently selected
let selectedTarget: string | null = null;

// Targeting state for click-to-target (kept for backwards compatibility)
let targetingState: {
  active: boolean;
  ability: Ability | null;
  character: Character | null;
  combat: CombatState | null;
  uiState: UIGameState | null;
  stageNumber: number | undefined;
} = {
  active: false,
  ability: null,
  character: null,
  combat: null,
  uiState: null,
  stageNumber: undefined,
};

/**
 * Render the combat screen
 */
export function renderCombat(context: ScreenContext): HTMLElement {
  const container = createElement('div', 'screen screen--combat');
  
  const uiState = context.uiState as UIGameState | undefined;
  const combatState = context.combat as CombatState | undefined;
  // Stage can be passed as either Stage object or number for backwards compatibility
  const stageData = context.stage as any;
  const stageNumber = typeof stageData === 'object' ? stageData?.stageNumber : stageData;
  const stageName = typeof stageData === 'object' ? stageData?.name : undefined;
  
  if (!uiState || !combatState) {
    container.innerHTML = '<p>Error: Invalid combat state</p>';
    return container;
  }
  
  // Start combat if in setup phase
  if (combatState.phase === 'setup') {
    startCombat(combatState);
  }
  
  // Auto-select first alive enemy if no target selected
  if (!selectedTarget || !combatState.enemyTeam.find(e => e.id === selectedTarget && e.isAlive)) {
    const firstAliveEnemy = combatState.enemyTeam.find(e => e.isAlive);
    selectedTarget = firstAliveEnemy?.id || null;
  }
  
  // Store state for click handlers (keep targeting state for uiState/stageNumber access)
  targetingState.combat = combatState;
  targetingState.uiState = uiState;
  targetingState.stageNumber = stageNumber;
  
  // Combat header
  const header = createElement('div', 'combat-header');
  const title = createElement('h1', 'combat-header__title');
  title.textContent = stageName 
    ? `⚔️ Stage ${stageNumber || '?'} - ${stageName}`
    : `⚔️ Stage ${stageNumber || '?'} - Battle`;
  
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
  const isSelected = selectedTarget === enemy.id;
  const isTargetable = enemy.isAlive;
  
  let cardClass = 'combat-enemy-card';
  if (isActive) cardClass += ' combat-enemy-card--active';
  if (isSelected && isTargetable) cardClass += ' combat-enemy-card--selected';
  if (!enemy.isAlive) cardClass += ' combat-enemy-card--dead';
  
  const card = createElement('div', cardClass);
  card.dataset.enemyId = enemy.id;
  
  // Add click handler for target selection (always enabled for alive enemies)
  if (isTargetable) {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      handleEnemyTargetClick(enemy.id, combat);
    });
  }
  
  // Name and level
  const header = createElement('div', 'combat-enemy-card__header');
  const name = createElement('h3', 'combat-enemy-card__name');
  name.textContent = enemy.name;
  const level = createElement('span', 'combat-enemy-card__level');
  level.textContent = `Lv ${enemy.level}`;
  header.appendChild(name);
  header.appendChild(level);
  card.appendChild(header);
  
  // Add flavor text tooltip
  const flavorText = getEnemyFlavorText(enemy.templateId || '');
  if (flavorText) {
    card.title = flavorText.description;
  }
  
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
  
  // Target selection indicator
  if (isSelected && isTargetable) {
    const targetIndicator = createElement('div', 'combat-enemy-card__target-indicator');
    targetIndicator.textContent = '🎯 SELECTED';
    card.appendChild(targetIndicator);
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
    
    // Enemy turns are handled automatically by the combat system
    // Do NOT auto-process here to avoid multiple turn advances
    
    return panel;
  }
  
  // Player's turn - show abilities
  const character = currentCombatant.character!;
  
  const title = createElement('h3', 'combat-action-panel__title');
  
  // Show current target
  if (selectedTarget) {
    const targetEnemy = combat.enemyTeam.find(e => e.id === selectedTarget);
    if (targetEnemy) {
      title.textContent = `${character.name}'s Turn | Target: ${targetEnemy.name}`;
    } else {
      title.textContent = `${character.name}'s Turn`;
    }
  } else {
    title.textContent = `${character.name}'s Turn`;
  }
  panel.appendChild(title);
  
  // Ability buttons
  const abilityContainer = createElement('div', 'combat-action-panel__abilities');
  
  character.equippedAbilities.forEach((abilityId: string, index: number) => {
    const ability = getAbility(abilityId);
    if (!ability) return;
    
    const canUse = character.currentAp >= ability.apCost;
    const shortcutKey = (index + 1).toString(); // 1, 2, 3, 4...
    const btn = createAbilityButton(ability, character, combat, uiState, stageNumber, canUse, shortcutKey);
    abilityContainer.appendChild(btn);
  });
  
  // End turn button - inline with abilities
  const endTurnBtn = createButton('🛑 End Turn (Enter)', () => {
    endCharacterTurn(combat, uiState, stageNumber);
  }, 'btn btn--secondary ability-btn');
  abilityContainer.appendChild(endTurnBtn);
  
  panel.appendChild(abilityContainer);
  
  // Setup keyboard shortcuts
  setupCombatKeyboardShortcuts(character, combat, uiState, stageNumber);
  
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
  canUse: boolean,
  shortcutKey?: string
): HTMLElement {
  const btn = createElement('button', `ability-btn${!canUse ? ' ability-btn--disabled' : ''}`);
  btn.disabled = !canUse;
  
  const nameSpan = createElement('span', 'ability-btn__name');
  nameSpan.textContent = ability.name;
  
  const costSpan = createElement('span', 'ability-btn__cost');
  costSpan.textContent = `${ability.apCost} AP`;
  
  btn.appendChild(nameSpan);
  btn.appendChild(costSpan);
  
  // Add keyboard shortcut indicator
  if (shortcutKey) {
    const shortcutSpan = createElement('span', 'ability-btn__shortcut');
    shortcutSpan.textContent = `[${shortcutKey}]`;
    btn.appendChild(shortcutSpan);
  }
  
  // Tooltip with flavor text
  const flavorText = getAbilityFlavorText(ability.id);
  const dmgMult = ability.effects.damageMultiplier || 0;
  const shortcutText = shortcutKey ? `\nShortcut: ${shortcutKey}` : '';
  
  if (flavorText) {
    btn.title = `${flavorText.description}\n\n${flavorText.effectDescription}\nAP Cost: ${ability.apCost} | Target: ${ability.targetType}${shortcutText}`;
  } else {
    btn.title = `${ability.description}\nTarget: ${ability.targetType}\nDamage: ${dmgMult}x${shortcutText}`;
  }
  
  if (canUse) {
    btn.addEventListener('click', () => {
      handleAbilityClick(ability, character, combat, uiState, stageNumber);
    });
  }
  
  return btn;
}

/**
 * Handle ability button click - execute on selected target
 */
function handleAbilityClick(
  ability: Ability,
  character: Character,
  combat: CombatState,
  uiState: UIGameState,
  stageNumber?: number
): void {
  let targetIds: string[];
  
  // Determine targets based on ability type
  switch (ability.targetType) {
    case 'single-enemy':
      // Use selected target
      if (selectedTarget && combat.enemyTeam.find(e => e.id === selectedTarget && e.isAlive)) {
        targetIds = [selectedTarget];
      } else {
        // Fallback to first alive enemy
        const firstAliveEnemy = combat.enemyTeam.find(e => e.isAlive);
        targetIds = firstAliveEnemy ? [firstAliveEnemy.id] : [];
      }
      break;
      
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
      // All alive enemies
      targetIds = combat.enemyTeam.filter(e => e.isAlive).map(e => e.id);
      break;
      
    default:
      // Fallback: first alive enemy
      const firstAliveEnemy = combat.enemyTeam.find(e => e.isAlive);
      targetIds = firstAliveEnemy ? [firstAliveEnemy.id] : [];
      break;
  }
  
  if (targetIds.length === 0) {
    showNotification('❌ No valid targets', 'error');
    return;
  }
  
  executeAbilityWithTargets(ability.id, targetIds, combat, uiState, stageNumber);
}

/**
 * Handle clicking on an enemy to select as target
 */
function handleEnemyTargetClick(enemyId: string, combat: CombatState): void {
  const enemy = combat.enemyTeam.find(e => e.id === enemyId);
  
  // Only allow selecting alive enemies
  if (!enemy || !enemy.isAlive) {
    return;
  }
  
  // Update selected target
  selectedTarget = enemyId;
  
  // Re-render to show updated selection
  const stageNumber = targetingState.stageNumber;
  const uiState = targetingState.uiState;
  
  if (uiState) {
    ScreenManager.updateContext({ combat, uiState, stage: stageNumber });
    showNotification(`🎯 Target: ${enemy.name}`, 'info');
  }
}

/**
 * Execute ability with specified targets
 */
function executeAbilityWithTargets(
  abilityId: string,
  targetIds: string[],
  combat: CombatState,
  uiState: UIGameState,
  stageNumber?: number
): void {
  // Get current combatant before executing ability
  const currentCombatant = getCurrentCombatant(combat);
  
  // Execute ability (signature is: state, abilityId, targetIds)
  const result = executeAbility(combat, abilityId, targetIds);
  
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
  
  // Check if combat ended after ability execution
  checkCombatEnd(combat, uiState, stageNumber);
  
  // Check if character should auto-end turn (0 AP or no usable abilities)
  if (combat.phase === 'active' && currentCombatant?.type === 'player') {
    const character = currentCombatant.character;
    if (character) {
      // Check if any equipped ability can be used with remaining AP
      const hasUsableAbility = character.equippedAbilities.some(abilityId => {
        const ability = getAbility(abilityId);
        return ability && character.currentAp >= ability.apCost;
      });
      
      // Auto-end turn if no usable abilities
      if (!hasUsableAbility) {
        const reason = character.currentAp === 0 
          ? '⚡ Out of AP - Turn ended automatically'
          : `⚡ No usable abilities (${character.currentAp} AP remaining) - Turn ended`;
        
        showNotification(reason, 'info');
        
        // Wait a moment for the notification to be visible, then end turn
        setTimeout(() => {
          endCharacterTurn(combat, uiState, stageNumber);
        }, 800);
        return; // Don't re-render yet, wait for auto-end turn
      }
    }
  }
  
  // Re-render combat screen with updated state (only if combat hasn't ended)
  if (combat.phase === 'active') {
    ScreenManager.updateContext({ combat, uiState, stage: stageNumber });
  }
}

/**
 * End current character's turn and process enemy turns with delays
 */
function endCharacterTurn(combat: CombatState, uiState: UIGameState, stageNumber?: number): void {
  endTurn(combat);
  
  // Check if combat ended
  checkCombatEnd(combat, uiState, stageNumber);
  
  // If combat ended, don't process enemy turns
  if (combat.phase !== 'active') {
    return;
  }
  
  // Process enemy turns with delays
  processEnemyTurns(combat, uiState, stageNumber);
}

/**
 * Process consecutive enemy turns with delays for visual feedback
 */
function processEnemyTurns(combat: CombatState, uiState: UIGameState, stageNumber?: number): void {
  const currentCombatant = getCurrentCombatant(combat);
  
  // If it's a player's turn now, just re-render
  if (!currentCombatant || currentCombatant.type === 'player') {
    ScreenManager.updateContext({ combat, uiState, stage: stageNumber });
    return;
  }
  
  // It's an enemy turn - show the enemy acting
  ScreenManager.updateContext({ combat, uiState, stage: stageNumber });
  
  // Wait 1 second, then execute enemy action
  setTimeout(() => {
    processEnemyAI(combat);
    
    // Wait another 0.5 seconds to show the result
    setTimeout(() => {
      endTurn(combat);
      
      // Check if combat ended
      checkCombatEnd(combat, uiState, stageNumber);
      
      // If still active, recursively process next turn (might be another enemy)
      if (combat.phase === 'active') {
        processEnemyTurns(combat, uiState, stageNumber);
      }
    }, 500);
  }, 1000);
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
  
  // Show all log entries (full combat history)
  const allLog = combat.combatLog;
  
  if (allLog.length === 0) {
    const emptyMsg = createElement('p', 'combat-log__empty');
    emptyMsg.textContent = 'Combat starting...';
    messages.appendChild(emptyMsg);
  } else {
    allLog.forEach(entry => {
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
    // Reset selected target on victory
    selectedTarget = null;
    
    // Clean up keyboard shortcuts
    cleanupCombatKeyboardShortcuts();
    
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
    // Reset selected target on defeat
    selectedTarget = null;
    
    // Clean up keyboard shortcuts
    cleanupCombatKeyboardShortcuts();
    
    // Navigate to battle results to show defeat screen
    setTimeout(() => {
      EventBus.emit(GameEvents.COMBAT_END);
      ScreenManager.navigateTo('battleResults', { 
        combat, 
        uiState, 
        stage: stageNumber 
      });
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
  // Check if modal already exists - prevent duplicates
  const existingOverlay = document.querySelector('.modal-overlay.modal-overlay--team-wipe');
  if (existingOverlay) {
    return; // Dialog already showing
  }
  
  // Count alive reserve characters
  const aliveReserveCount = combat.reserveTeam.filter(c => c.isAlive).length;
  
  // Create overlay wrapper
  const overlay = createElement('div', 'modal-overlay modal-overlay--team-wipe');
  
  const modal = createElement('div', 'modal');
  const header = createElement('div', 'modal__header');
  const title = createElement('h2', 'modal__title');
  title.textContent = '💀 Team Wiped!';
  header.appendChild(title);
  
  const body = createElement('div', 'modal__body');
  const message = createElement('p', 'modal__message');
  message.textContent = `Your active team has been defeated. You have ${aliveReserveCount} reserve character${aliveReserveCount !== 1 ? 's' : ''} available.`;
  body.appendChild(message);
  
  const footer = createElement('div', 'modal__footer');
  
  const swapBtn = createButton('⚔️ Swap to Reserve', () => {
    swapReserveTeam(combat);
    document.body.removeChild(overlay);
    ScreenManager.updateContext({ combat, uiState, stage: stageNumber });
  }, 'btn btn--primary btn--large');
  
  const defeatBtn = createButton('🏳️ Accept Defeat', () => {
    acceptDefeat(combat);
    document.body.removeChild(overlay);
    ScreenManager.updateContext({ combat, uiState, stage: stageNumber });
  }, 'btn btn--danger btn--large');
  
  footer.appendChild(swapBtn);
  footer.appendChild(defeatBtn);
  
  modal.appendChild(header);
  modal.appendChild(body);
  modal.appendChild(footer);
  overlay.appendChild(modal);
  
  document.body.appendChild(overlay);
}

/**
 * Setup keyboard shortcuts for combat actions
 */
let currentKeyboardHandler: ((e: KeyboardEvent) => void) | null = null;

function setupCombatKeyboardShortcuts(
  character: Character,
  combat: CombatState,
  uiState: UIGameState,
  stageNumber?: number
): void {
  // Remove previous handler if exists
  if (currentKeyboardHandler) {
    document.removeEventListener('keydown', currentKeyboardHandler);
  }
  
  // Create new handler
  currentKeyboardHandler = (e: KeyboardEvent) => {
    // Only handle shortcuts during player turn (not enemy turn or if combat ended)
    const currentCombatant = getCurrentCombatant(combat);
    if (!currentCombatant || currentCombatant.type === 'enemy' || combat.phase !== 'active') {
      return;
    }
    
    // Ignore if typing in an input field
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }
    
    // Number keys (1-4) for abilities
    if (e.key >= '1' && e.key <= '9') {
      const abilityIndex = parseInt(e.key) - 1;
      if (abilityIndex < character.equippedAbilities.length) {
        const abilityId = character.equippedAbilities[abilityIndex];
        const ability = getAbility(abilityId);
        
        if (ability && character.currentAp >= ability.apCost) {
          e.preventDefault();
          handleAbilityClick(ability, character, combat, uiState, stageNumber);
        }
      }
    }
    
    // Enter or Space to end turn
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      endCharacterTurn(combat, uiState, stageNumber);
    }
  };
  
  // Add the event listener
  document.addEventListener('keydown', currentKeyboardHandler);
}

// Clean up keyboard handler when combat ends
function cleanupCombatKeyboardShortcuts(): void {
  if (currentKeyboardHandler) {
    document.removeEventListener('keydown', currentKeyboardHandler);
    currentKeyboardHandler = null;
  }
}
