import { ScreenManager, type ScreenContext } from './core/ScreenManager';
import { EventBus, GameEvents } from './core/EventBus';
import { createElement, createButton, showNotification, formatNumber } from './core/UIHelpers';
import type { UIGameState } from './core/UIState';
import type { CombatState } from '../types/combat';
import type { Equipment } from '../types/equipment';
import { saveGame } from '../utils/storage';
import { completeStage } from '../systems/campaign';
import { fullyRestoreCharacter } from '../systems/character';
import { canRecruitCharacter } from '../systems/recruitment';

/**
 * Render the battle results screen showing victory/defeat, rewards, and level-ups
 */
export function renderBattleResults(context: ScreenContext): HTMLElement {
  const container = createElement('div', 'screen screen--battle-results');
  
  const uiState = context.uiState as UIGameState | undefined;
  const combat = context.combat as CombatState | undefined;
  const stageNumber = context.stage as number | undefined;
  
  if (!uiState || !combat) {
    container.innerHTML = '<p>Error: Invalid battle results state</p>';
    return container;
  }
  
  const isVictory = combat.phase === 'victory';
  
  // Header
  const header = createElement('div', `battle-results__header battle-results__header--${isVictory ? 'victory' : 'defeat'}`);
  const title = createElement('h1', 'battle-results__title');
  title.textContent = isVictory ? '🎉 VICTORY!' : '💀 DEFEAT';
  header.appendChild(title);
  
  if (stageNumber && isVictory) {
    const stageInfo = createElement('p', 'battle-results__stage');
    stageInfo.textContent = `Stage ${stageNumber} Complete!`;
    header.appendChild(stageInfo);
  }
  
  container.appendChild(header);
  
  if (isVictory) {
    // XP Rewards Section
    const xpSection = renderXPSection(combat, uiState);
    container.appendChild(xpSection);
    
    // Loot Section
    if (combat.lootDropped && combat.lootDropped.length > 0) {
      const lootSection = renderLootSection(combat.lootDropped, uiState);
      container.appendChild(lootSection);
    }
    
    // Level-up notifications
    const levelUpsSection = renderLevelUps(uiState);
    if (levelUpsSection) {
      container.appendChild(levelUpsSection);
    }
  }
  
  // Process results and healing
  const processResults = () => {
    // Update statistics
    const stats = uiState.saveData.statistics;
    
    // Always increment total battles
    stats.totalBattles++;
    
    if (isVictory) {
      // Update victory statistics
      stats.totalVictories++;
      
      // Update enemies defeated count (all enemies should be dead in victory)
      const enemiesDefeated = combat.enemyTeam.filter(e => !e.isAlive).length;
      stats.totalEnemiesDefeated += enemiesDefeated;
      
      // Check if this was a boss battle (stage is multiple of 10)
      if (stageNumber && stageNumber % 10 === 0) {
        stats.totalBossesDefeated++;
      }
      
      // Update equipment obtained
      if (combat.lootDropped && combat.lootDropped.length > 0) {
        stats.totalEquipmentObtained += combat.lootDropped.length;
      }
      
      // Update highest level reached
      const highestLevel = Math.max(...uiState.saveData.roster.map(c => c.level));
      if (highestLevel > stats.highestLevelReached) {
        stats.highestLevelReached = highestLevel;
      }
    } else {
      // Update defeat statistics
      stats.totalDefeats++;
    }
    
    // Calculate total damage dealt and healing done from combat log
    if (combat.combatLog) {
      combat.combatLog.forEach(entry => {
        if (entry.type === 'damage' && entry.actorId) {
          // Check if actor is player character
          const isPlayerCharacter = [...combat.playerTeam, ...combat.reserveTeam]
            .some(c => c.id === entry.actorId);
          
          if (isPlayerCharacter) {
            // Parse damage from message (format: "[Target] takes X damage!")
            const damageMatch = entry.message.match(/takes\s+(\d+(?:,\d+)*)\s+/i);
            if (damageMatch) {
              const damage = parseInt(damageMatch[1].replace(/,/g, ''), 10);
              stats.totalDamageDealt += damage;
            }
          }
        } else if (entry.type === 'healing') {
          // Healing can come from abilities (has actorId) or lifesteal
          // For lifesteal: "[Name] heals for X HP from lifesteal!" (actorId is the healer)
          // For healing abilities: "[Target] recovers X HP!" (no actorId, but targetIds)
          
          // Check if this is a player-initiated healing
          let isPlayerHealing = false;
          
          if (entry.actorId) {
            // Lifesteal healing - check if actor is player
            isPlayerHealing = [...combat.playerTeam, ...combat.reserveTeam]
              .some(c => c.id === entry.actorId);
          } else if (entry.targetIds && entry.targetIds.length > 0) {
            // Healing ability - check if target is player character
            // (player abilities heal player targets)
            isPlayerHealing = [...combat.playerTeam, ...combat.reserveTeam]
              .some(c => entry.targetIds?.includes(c.id));
          }
          
          if (isPlayerHealing) {
            // Parse healing from messages:
            // "[Name] heals for X HP from lifesteal!"
            // "[Target] recovers X HP!"
            const healMatch = entry.message.match(/(?:heals for|recovers)\s+(\d+(?:,\d+)*)\s+HP/i);
            if (healMatch) {
              const healing = parseInt(healMatch[1].replace(/,/g, ''), 10);
              stats.totalHealingDone += healing;
            }
          }
        }
      });
    }
    
    // Fully restore all characters after battle (heal HP and AP) - whether victory or defeat
    uiState.saveData.roster.forEach(char => {
      fullyRestoreCharacter(char);
    });
    
    if (isVictory && stageNumber) {
      // Mark stage as complete
      completeStage(
        uiState.saveData.campaign,
        stageNumber,
        true, // victory
        combat.xpEarned || 0,
        combat.lootDropped || []
      );
      
      // Auto-save
      saveGame(uiState.saveData, false); // Save to manual save
      saveGame(uiState.saveData, true);  // Save to auto-save
      EventBus.emit(GameEvents.GAME_SAVED);
      
      // Emit stage completion event
      EventBus.emit(GameEvents.STAGE_COMPLETED, stageNumber);
      
      showNotification('✅ Party fully healed! Progress saved!', 'success');
    } else {
      // Defeat - just save the healing and statistics
      saveGame(uiState.saveData, false); // Save to manual save
      saveGame(uiState.saveData, true);  // Save to auto-save
      EventBus.emit(GameEvents.GAME_SAVED);
      
      showNotification('✅ Party fully healed!', 'success');
    }
  };
  
  // Continue to next battle handler
  const handleNextBattle = () => {
    cleanupBattleResultsKeyboardShortcuts();
    processResults();
    
    // Check if recruitment is available after victory
    if (isVictory) {
      const victories = uiState.saveData.statistics.totalVictories;
      const rosterSize = uiState.saveData.roster.length;
      
      if (canRecruitCharacter(victories, rosterSize)) {
        // Show recruitment screen
        ScreenManager.navigateTo('recruitment', { 
          uiState, 
          milestone: victories,
          returnToStage: stageNumber ? stageNumber + 1 : undefined
        });
        return;
      }
    }
    
    // Go to next stage (current stage + 1)
    if (isVictory && stageNumber) {
      const nextStageNumber = stageNumber + 1;
      if (nextStageNumber <= 100) {
        ScreenManager.navigateTo('campaignMap', { uiState, autoStartStage: nextStageNumber });
      } else {
        // All stages complete!
        showNotification('🎉 Congratulations! All stages complete!', 'success');
        ScreenManager.navigateTo('campaignMap', { uiState });
      }
    } else {
      // Defeat - go back to campaign
      ScreenManager.navigateTo('campaignMap', { uiState });
    }
  };
  
  // Back to campaign handler
  const handleBackToCampaign = () => {
    cleanupBattleResultsKeyboardShortcuts();
    processResults();
    
    // Check if recruitment is available after victory
    if (isVictory) {
      const victories = uiState.saveData.statistics.totalVictories;
      const rosterSize = uiState.saveData.roster.length;
      
      if (canRecruitCharacter(victories, rosterSize)) {
        // Show recruitment screen
        ScreenManager.navigateTo('recruitment', { 
          uiState, 
          milestone: victories,
          returnToStage: undefined // Don't auto-start next stage
        });
        return;
      }
    }
    
    // Return to campaign map
    ScreenManager.navigateTo('campaignMap', { uiState });
  };
  
  // Action buttons
  const actions = createElement('div', 'battle-results__actions');
  
  if (isVictory && stageNumber && stageNumber < 100) {
    // Victory: Show "Next Battle" as primary and "Back to Campaign" as secondary
    const nextBattleBtn = createButton(
      '⚔️ Next Battle (Enter)',
      handleNextBattle,
      'btn btn--primary btn--large'
    );
    
    const backBtn = createButton(
      '🗺️ Back to Campaign (Esc)',
      handleBackToCampaign,
      'btn btn--secondary btn--large'
    );
    
    actions.appendChild(nextBattleBtn);
    actions.appendChild(backBtn);
    
    // Setup keyboard shortcuts with both handlers
    setupBattleResultsKeyboardShortcuts(handleNextBattle, handleBackToCampaign);
  } else {
    // Defeat or final stage: Only show "Back to Campaign"
    const backBtn = createButton(
      '⬅️ Back to Campaign (Enter)',
      handleBackToCampaign,
      'btn btn--primary btn--large'
    );
    
    actions.appendChild(backBtn);
    
    // Setup keyboard shortcuts with single handler
    setupBattleResultsKeyboardShortcuts(handleBackToCampaign, handleBackToCampaign);
  }
  
  container.appendChild(actions);
  
  return container;
}

/**
 * Render XP rewards section
 */
function renderXPSection(combat: CombatState, _uiState: UIGameState): HTMLElement {
  const section = createElement('div', 'battle-results__section');
  
  const title = createElement('h2', 'battle-results__section-title');
  title.textContent = '⭐ Experience Gained';
  section.appendChild(title);
  
  const xpEarned = combat.xpEarned || 0;
  const totalXP = createElement('p', 'battle-results__xp-total');
  totalXP.textContent = `+${formatNumber(xpEarned)} XP (split equally among all characters)`;
  section.appendChild(totalXP);
  
  // Show XP for each character
  const charactersContainer = createElement('div', 'battle-results__characters');
  
  // Get all characters (active + reserve)
  const allCharacters = [...combat.playerTeam, ...combat.reserveTeam];
  const xpPerChar = Math.floor(xpEarned / allCharacters.length);
  
  allCharacters.forEach(char => {
    const charCard = createElement('div', 'battle-results__character-card');
    
    const charName = createElement('span', 'battle-results__character-name');
    charName.textContent = char.name;
    
    const charXP = createElement('span', 'battle-results__character-xp');
    charXP.textContent = `+${formatNumber(xpPerChar)} XP`;
    
    const charLevel = createElement('span', 'battle-results__character-level');
    charLevel.textContent = `Lv ${char.level}`;
    
    charCard.appendChild(charName);
    charCard.appendChild(charXP);
    charCard.appendChild(charLevel);
    
    charactersContainer.appendChild(charCard);
  });
  
  section.appendChild(charactersContainer);
  
  return section;
}

/**
 * Render loot section
 */
function renderLootSection(loot: Equipment[], uiState: UIGameState): HTMLElement {
  const section = createElement('div', 'battle-results__section');
  
  const title = createElement('h2', 'battle-results__section-title');
  title.textContent = '🎁 Equipment Dropped';
  section.appendChild(title);
  
  const lootContainer = createElement('div', 'battle-results__loot');
  
  loot.forEach(item => {
    const itemCard = createElement('div', `battle-results__loot-item rarity-${item.rarity.toLowerCase()}`);
    
    const itemName = createElement('span', 'battle-results__loot-name');
    itemName.textContent = item.name;
    
    const itemRarity = createElement('span', 'battle-results__loot-rarity');
    itemRarity.textContent = item.rarity;
    
    const itemSlot = createElement('span', 'battle-results__loot-slot');
    itemSlot.textContent = item.slot;
    
    const itemLevel = createElement('span', 'battle-results__loot-level');
    itemLevel.textContent = `Lv ${item.level}`;
    
    itemCard.appendChild(itemName);
    itemCard.appendChild(itemRarity);
    itemCard.appendChild(itemSlot);
    itemCard.appendChild(itemLevel);
    
    lootContainer.appendChild(itemCard);
  });
  
  section.appendChild(lootContainer);
  
  // Add loot to inventory
  loot.forEach(item => {
    uiState.saveData.inventory.push(item);
  });
  
  return section;
}

/**
 * Render level-up notifications
 * Note: This is a simplified version - actual leveling happens in combat system
 */
function renderLevelUps(_uiState: UIGameState): HTMLElement | null {
  // Check if any characters leveled up during combat
  // This would need to be tracked in the combat system
  // For now, return null as level-ups are handled elsewhere
  
  // TODO: Track level-ups in combat state and display here
  // const leveledUpChars = combat.levelUps || [];
  
  return null;
}

/**
 * Setup keyboard shortcuts for battle results screen
 */
let currentBattleResultsKeyboardHandler: ((e: KeyboardEvent) => void) | null = null;

function setupBattleResultsKeyboardShortcuts(
  handleEnter: () => void,
  handleEscape: () => void
): void {
  // Remove previous handler if exists
  if (currentBattleResultsKeyboardHandler) {
    document.removeEventListener('keydown', currentBattleResultsKeyboardHandler);
  }
  
  // Create new handler
  currentBattleResultsKeyboardHandler = (e: KeyboardEvent) => {
    // Ignore if typing in an input field
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }
    
    // Enter to continue to next battle
    if (e.key === 'Enter') {
      e.preventDefault();
      handleEnter();
    }
    
    // Escape to go back to campaign
    if (e.key === 'Escape') {
      e.preventDefault();
      handleEscape();
    }
  };
  
  // Add the event listener
  document.addEventListener('keydown', currentBattleResultsKeyboardHandler);
}

/**
 * Clean up keyboard shortcuts when leaving battle results
 */
function cleanupBattleResultsKeyboardShortcuts(): void {
  if (currentBattleResultsKeyboardHandler) {
    document.removeEventListener('keydown', currentBattleResultsKeyboardHandler);
    currentBattleResultsKeyboardHandler = null;
  }
}
