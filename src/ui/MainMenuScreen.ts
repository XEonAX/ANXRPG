/**
 * Main Menu Screen
 * Entry point of the game with New Game, Continue, and Load options
 */

import { ScreenManager, type ScreenContext } from './core/ScreenManager';
import { EventBus, GameEvents } from './core/EventBus';
import { createElement, createButton, showNotification } from './core/UIHelpers';
import { initializeUIState } from './core/UIState';
import { hasSaveData, loadGame } from '../utils/storage';
import { initializeNewGame } from '../systems/game';
import type { CharacterTypeName } from '../types/character';

/**
 * Render the main menu screen
 */
export function renderMainMenu(_context: ScreenContext): HTMLElement {
  const container = createElement('div', 'screen screen--main-menu');
  
  // Title section
  const header = createElement('header', 'main-menu__header');
  const title = createElement('h1', 'main-menu__title');
  title.textContent = '🎮 ANXRPG';
  const subtitle = createElement('p', 'main-menu__subtitle');
  subtitle.textContent = 'Turn-Based Fighting RPG';
  header.appendChild(title);
  header.appendChild(subtitle);
  
  // Version info
  const version = createElement('div', 'main-menu__version');
  version.textContent = 'v2.0.0';
  header.appendChild(version);
  
  container.appendChild(header);
  
  // Menu buttons section
  const menu = createElement('div', 'main-menu__buttons');
  
  // Check for existing save
  const hasAutoSave = hasSaveData(true);
  const hasManualSave = hasSaveData(false);
  
  // Continue button (auto-save)
  if (hasAutoSave) {
    const continueBtn = createButton(
      '▶️ Continue',
      () => handleContinue(),
      'btn btn--primary btn--large'
    );
    menu.appendChild(continueBtn);
  }
  
  // New Game button
  const newGameBtn = createButton(
    '✨ New Game',
    () => showNewGameDialog(),
    `btn btn--${hasAutoSave ? 'secondary' : 'primary'} btn--large`
  );
  menu.appendChild(newGameBtn);
  
  // Load Game button
  if (hasManualSave) {
    const loadBtn = createButton(
      '📂 Load Game',
      () => handleLoadGame(),
      'btn btn--secondary btn--large'
    );
    menu.appendChild(loadBtn);
  }
  
  // Settings button (accessible even without a save)
  const settingsBtn = createButton(
    '⚙️ Settings',
    () => {
      // If we have a save, load it for settings screen
      let uiState = null;
      if (hasAutoSave) {
        const saveData = loadGame(true);
        if (saveData) {
          uiState = initializeUIState(saveData);
        }
      }
      
      // Navigate to settings (works even without save)
      if (uiState) {
        ScreenManager.navigateTo('settings', { uiState });
      } else {
        // Create a default state for settings screen
        const defaultSave = initializeNewGame('Alpha', 'Default').saveData;
        uiState = initializeUIState(defaultSave);
        ScreenManager.navigateTo('settings', { uiState });
      }
    },
    'btn btn--secondary btn--large'
  );
  menu.appendChild(settingsBtn);
  
  container.appendChild(menu);
  
  // Footer with game info
  const footer = createElement('footer', 'main-menu__footer');
  footer.innerHTML = `
    <p class="game-info">
      <strong>Features:</strong> 6 Character Types • 100 Stages • Skill Trees • Boss Battles
    </p>
    <p class="credits">
      Built with Vite + TypeScript • No frameworks, pure vanilla JS
    </p>
    <p class="github-link">
      <a href="https://github.com/XEonAX/ANXRPG" target="_blank" rel="noopener noreferrer">Made with love ❤️ by <s>AEonAX</s> Claude Sonnet 4.5</a>
    </p>
  `;
  container.appendChild(footer);
  
  return container;
}

/**
 * Handle continue (load auto-save)
 */
function handleContinue(): void {
  const saveData = loadGame(true);
  
  if (!saveData) {
    showNotification('Auto-save not found!', 'error');
    return;
  }
  
  // Initialize UI state from save data
  const uiState = initializeUIState(saveData);
  
  // Emit event with save data
  EventBus.emit(GameEvents.GAME_LOADED, saveData);
  // Note: Notification removed as it obstructs navigation buttons
  
  // Navigate to team management with UI state
  ScreenManager.navigateTo('teamManagement', { uiState });
}

/**
 * Handle load game (load manual save)
 */
function handleLoadGame(): void {
  const saveData = loadGame(false);
  
  if (!saveData) {
    showNotification('Save file not found!', 'error');
    return;
  }
  
  // Initialize UI state from save data
  const uiState = initializeUIState(saveData);
  
  EventBus.emit(GameEvents.GAME_LOADED, saveData);
  // Note: Notification removed as it obstructs navigation buttons
  
  // Navigate to team management with UI state
  ScreenManager.navigateTo('teamManagement', { uiState });
}

/**
 * Show new game character selection dialog
 */
function showNewGameDialog(): void {
  const container = createElement('div', 'new-game-dialog');
  
  const intro = createElement('p', 'new-game-dialog__intro');
  intro.textContent = 'Choose your starting character type:';
  container.appendChild(intro);
  
  // Character type selection
  const characterTypes: Array<{
    type: CharacterTypeName;
    name: string;
    description: string;
    emoji: string;
  }> = [
    {
      type: 'Alpha' as CharacterTypeName,
      name: 'Paladin',
      description: 'Tank/Off-Healer with +3 AP/turn. High DEF and healing abilities.',
      emoji: '🛡️'
    },
    {
      type: 'Beta' as CharacterTypeName,
      name: 'Rogue',
      description: 'Critical DPS with +6 AP/turn. High SPD and crit chance.',
      emoji: '🗡️'
    },
    {
      type: 'Gamma' as CharacterTypeName,
      name: 'Mage',
      description: 'AoE/Elemental DPS with +4 AP/turn. Powerful magic attacks.',
      emoji: '🔮'
    },
    {
      type: 'Delta' as CharacterTypeName,
      name: 'Warrior',
      description: 'Physical DPS with +4 AP/turn. Strong physical attacks.',
      emoji: '⚔️'
    },
    {
      type: 'Epsilon' as CharacterTypeName,
      name: 'Cleric',
      description: 'Healer/Support with +5 AP/turn. Team healing and buffs.',
      emoji: '✨'
    },
    {
      type: 'Zeta' as CharacterTypeName,
      name: 'Berserker',
      description: 'High Risk/Reward with +5 AP/turn. Massive damage output.',
      emoji: '🪓'
    }
  ];
  
  const grid = createElement('div', 'character-type-grid');
  
  characterTypes.forEach(({ type, name, description, emoji }) => {
    const card = createElement('div', 'character-type-card');
    card.innerHTML = `
      <div class="character-type-card__emoji">${emoji}</div>
      <div class="character-type-card__name">${name}</div>
      <div class="character-type-card__type">${type}</div>
      <div class="character-type-card__description">${description}</div>
    `;
    
    card.addEventListener('click', () => {
      startNewGame(type, name);
    });
    
    grid.appendChild(card);
  });
  
  container.appendChild(grid);
  
  // Create modal
  const modal = createElement('div', 'modal-overlay');
  const modalContent = createElement('div', 'modal');
  
  const header = createElement('div', 'modal__header');
  const title = createElement('h2', 'modal__title');
  title.textContent = 'New Game';
  header.appendChild(title);
  
  const body = createElement('div', 'modal__body');
  body.appendChild(container);
  
  const footer = createElement('div', 'modal__footer');
  const cancelBtn = createButton(
    'Cancel',
    () => modal.remove(),
    'btn btn--secondary'
  );
  footer.appendChild(cancelBtn);
  
  modalContent.appendChild(header);
  modalContent.appendChild(body);
  modalContent.appendChild(footer);
  modal.appendChild(modalContent);
  
  // Close on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
  
  document.body.appendChild(modal);
}

/**
 * Start a new game with the selected character type
 */
function startNewGame(characterType: CharacterTypeName, characterName: string): void {
  // Close modal
  const modal = document.querySelector('.modal-overlay');
  if (modal) modal.remove();
  
  // Show loading notification
  showNotification('Starting new game...', 'info', 1000);
  
  // Initialize new game
  setTimeout(() => {
    const gameState = initializeNewGame(characterType, `${characterName} Hero`);
    
    // Initialize UI state from new game
    const uiState = initializeUIState(gameState.saveData);
    
    EventBus.emit(GameEvents.GAME_LOADED, gameState.saveData);
    // Note: Welcome notification removed as it obstructs navigation buttons
    
    // Navigate to team management with UI state
    ScreenManager.navigateTo('teamManagement', { uiState });
  }, 300);
}
