import { ScreenManager, type ScreenContext } from './core/ScreenManager';
import { EventBus, GameEvents } from './core/EventBus';
import { createElement, createButton, showNotification, formatNumber } from './core/UIHelpers';
import type { UIGameState } from './core/UIState';
import type { CombatState } from '../types/combat';
import type { Equipment } from '../types/equipment';
import { saveGame } from '../utils/storage';
import { completeStage } from '../systems/campaign';
import { fullyRestoreCharacter } from '../systems/character';

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
  
  // Continue button
  const actions = createElement('div', 'battle-results__actions');
  const continueBtn = createButton(
    isVictory ? '➡️ Continue' : '⬅️ Return to Campaign',
    () => {
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
        saveGame(uiState.saveData);
        EventBus.emit(GameEvents.GAME_SAVED);
        
        // Emit stage completion event
        EventBus.emit(GameEvents.STAGE_COMPLETED, stageNumber);
        
        showNotification('✅ Party fully healed! Progress saved!', 'success');
      } else {
        // Defeat - just save the healing
        saveGame(uiState.saveData);
        EventBus.emit(GameEvents.GAME_SAVED);
        
        showNotification('✅ Party fully healed!', 'success');
      }
      
      // Return to campaign map
      ScreenManager.navigateTo('campaignMap', { uiState });
    },
    'btn btn--primary btn--large'
  );
  actions.appendChild(continueBtn);
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
