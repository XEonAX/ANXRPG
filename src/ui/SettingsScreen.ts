/**
 * Settings Screen - Game Settings and Data Management
 * 
 * Provides:
 * - Game settings toggles (damage variance, combat speed, etc.)
 * - Save/load management (manual save, export/import)
 * - Data management (clear all data with confirmation)
 * - Statistics display
 * - Credits and version info
 */

import { ScreenManager, type ScreenContext } from './core/ScreenManager';
import { EventBus } from './core/EventBus';
import { showNotification, showConfirm } from './core/UIHelpers';
import { 
  saveGame, 
  exportSaveToFile, 
  importSaveFromFile, 
  clearAllSaves, 
  getSaveMetadata,
} from '../utils/storage';
import { DEFAULT_GAME_SETTINGS, SAVE_VERSION } from '../types/save';

/**
 * Render Settings Screen
 */
export function renderSettings(context: ScreenContext): HTMLElement {
  const uiState = context.uiState;
  if (!uiState) {
    throw new Error('UIState not found in context');
  }
  
  const container = document.createElement('div');
  container.className = 'settings-screen';
  
  // Header
  const header = document.createElement('div');
  header.className = 'settings-screen__header';
  header.innerHTML = `
    <h1>⚙️ Settings</h1>
    <p>Configure game preferences and manage save data</p>
  `;
  container.appendChild(header);
  
  // Content wrapper for scrolling
  const content = document.createElement('div');
  content.className = 'settings-screen__content';
  
  // Game Settings Section
  content.appendChild(renderGameSettingsSection(uiState));
  
  // Save Management Section
  content.appendChild(renderSaveManagementSection(uiState));
  
  // Statistics Section
  content.appendChild(renderStatisticsSection(uiState));
  
  // Data Management Section
  content.appendChild(renderDataManagementSection());
  
  // Credits Section
  content.appendChild(renderCreditsSection());
  
  container.appendChild(content);
  
  // Footer with back button
  const footer = document.createElement('div');
  footer.className = 'settings-screen__footer';
  
  const backBtn = document.createElement('button');
  backBtn.className = 'btn btn--secondary';
  backBtn.textContent = '← Back to Main Menu';
  backBtn.addEventListener('click', () => {
    ScreenManager.goBack();
  });
  
  footer.appendChild(backBtn);
  container.appendChild(footer);
  
  return container;
}

/**
 * Render Game Settings Section
 */
function renderGameSettingsSection(uiState: any): HTMLElement {
  const section = document.createElement('div');
  section.className = 'settings-section';
  
  const title = document.createElement('h2');
  title.className = 'settings-section__title';
  title.textContent = '🎮 Game Settings';
  section.appendChild(title);
  
  const settings = uiState.saveData.settings;
  
  // Damage Variance Toggle
  section.appendChild(createToggleSetting(
    'Damage Variance',
    'Enable ±10% random damage variance',
    settings.damageVariance,
    (value) => {
      settings.damageVariance = value;
      saveGame(uiState.saveData);
      showNotification('Damage variance ' + (value ? 'enabled' : 'disabled'), 'success');
    }
  ));
  
  // Show Damage Numbers Toggle
  section.appendChild(createToggleSetting(
    'Show Damage Numbers',
    'Display damage values in combat',
    settings.showDamageNumbers,
    (value) => {
      settings.showDamageNumbers = value;
      saveGame(uiState.saveData);
      showNotification('Damage numbers ' + (value ? 'enabled' : 'disabled'), 'success');
    }
  ));
  
  // Detailed Combat Log Toggle
  section.appendChild(createToggleSetting(
    'Detailed Combat Log',
    'Show all combat calculations and effects',
    settings.detailedCombatLog,
    (value) => {
      settings.detailedCombatLog = value;
      saveGame(uiState.saveData);
      showNotification('Detailed combat log ' + (value ? 'enabled' : 'disabled'), 'success');
    }
  ));
  
  // Auto-Save Toggle
  section.appendChild(createToggleSetting(
    'Auto-Save',
    'Automatically save after battles and stage completion',
    settings.autoSave,
    (value) => {
      settings.autoSave = value;
      saveGame(uiState.saveData);
      showNotification('Auto-save ' + (value ? 'enabled' : 'disabled'), 'success');
    }
  ));
  
  // Auto-Hide Low Rarity Equipment Toggle
  section.appendChild(createToggleSetting(
    'Auto-Hide Low Rarity Equipment',
    'Automatically hide Common and Uncommon equipment in inventory',
    settings.autoHideLowRarityEquipment,
    (value) => {
      settings.autoHideLowRarityEquipment = value;
      saveGame(uiState.saveData);
      showNotification('Low rarity auto-hide ' + (value ? 'enabled' : 'disabled'), 'success');
    }
  ));
  
  // Combat Speed Slider
  section.appendChild(createSliderSetting(
    'Combat Speed',
    'Animation speed multiplier (0.5x - 2.0x)',
    settings.combatSpeed,
    0.5,
    2.0,
    0.1,
    (value) => {
      settings.combatSpeed = value;
      saveGame(uiState.saveData);
      showNotification(`Combat speed set to ${value.toFixed(1)}x`, 'success');
    }
  ));
  
  // Sound Enabled Toggle
  section.appendChild(createToggleSetting(
    'Sound Effects',
    'Enable sound effects (coming soon)',
    settings.soundEnabled,
    (value) => {
      settings.soundEnabled = value;
      saveGame(uiState.saveData);
      showNotification('Sound effects ' + (value ? 'enabled' : 'disabled'), 'success');
    }
  ));
  
  // Sound Volume Slider (only show if sound enabled)
  if (settings.soundEnabled) {
    section.appendChild(createSliderSetting(
      'Sound Volume',
      'Volume level (0% - 100%)',
      settings.soundVolume,
      0,
      1.0,
      0.1,
      (value) => {
        settings.soundVolume = value;
        saveGame(uiState.saveData);
        showNotification(`Volume set to ${Math.round(value * 100)}%`, 'success');
      }
    ));
  }
  
  // Reset to Defaults Button
  const resetBtn = document.createElement('button');
  resetBtn.className = 'btn btn--secondary settings-section__reset-btn';
  resetBtn.textContent = '↺ Reset to Defaults';
  resetBtn.addEventListener('click', async () => {
    const confirmed = await showConfirm(
      'Reset all game settings to default values?',
      'This will not affect your save data.'
    );
    
    if (confirmed) {
      uiState.saveData.settings = { ...DEFAULT_GAME_SETTINGS };
      saveGame(uiState.saveData);
      showNotification('Settings reset to defaults', 'success');
      
      // Re-render settings screen
      const newScreen = renderSettings(uiState);
      const screenContainer = document.querySelector('.screen-container');
      if (screenContainer) {
        screenContainer.innerHTML = '';
        screenContainer.appendChild(newScreen);
      }
    }
  });
  
  section.appendChild(resetBtn);
  
  return section;
}

/**
 * Render Save Management Section
 */
function renderSaveManagementSection(uiState: any): HTMLElement {
  const section = document.createElement('div');
  section.className = 'settings-section';
  
  const title = document.createElement('h2');
  title.className = 'settings-section__title';
  title.textContent = '💾 Save Management';
  section.appendChild(title);
  
  // Save Info Display
  const metadata = getSaveMetadata(false);
  
  const infoDiv = document.createElement('div');
  infoDiv.className = 'save-info';
  
  if (metadata && metadata.hasData) {
    const lastSaved = new Date(metadata.lastSaved);
    const playtimeHours = Math.floor(metadata.playtime / 3600000);
    const playtimeMinutes = Math.floor((metadata.playtime % 3600000) / 60000);
    
    infoDiv.innerHTML = `
      <div class="save-info__row">
        <span class="save-info__label">Last Saved:</span>
        <span class="save-info__value">${lastSaved.toLocaleString()}</span>
      </div>
      <div class="save-info__row">
        <span class="save-info__label">Playtime:</span>
        <span class="save-info__value">${playtimeHours}h ${playtimeMinutes}m</span>
      </div>
      <div class="save-info__row">
        <span class="save-info__label">Campaign Progress:</span>
        <span class="save-info__value">${metadata.campaignProgress.toFixed(0)}% (${metadata.rosterSize} characters)</span>
      </div>
      <div class="save-info__row">
        <span class="save-info__label">Highest Level:</span>
        <span class="save-info__value">Level ${metadata.highestLevel}</span>
      </div>
    `;
  } else {
    infoDiv.innerHTML = '<p class="save-info__empty">No save data found</p>';
  }
  
  section.appendChild(infoDiv);
  
  // Save Management Buttons
  const btnGroup = document.createElement('div');
  btnGroup.className = 'settings-section__btn-group';
  
  // Manual Save Button
  const saveBtn = document.createElement('button');
  saveBtn.className = 'btn btn--primary';
  saveBtn.textContent = '💾 Save Now';
  saveBtn.addEventListener('click', () => {
    const success = saveGame(uiState.saveData);
    if (success) {
      showNotification('✅ Game saved successfully!', 'success');
      
      // Re-render to update save info
      const newScreen = renderSettings(uiState);
      const screenContainer = document.querySelector('.screen-container');
      if (screenContainer) {
        screenContainer.innerHTML = '';
        screenContainer.appendChild(newScreen);
      }
    } else {
      showNotification('❌ Failed to save game', 'error');
    }
  });
  btnGroup.appendChild(saveBtn);
  
  // Export Save Button
  const exportBtn = document.createElement('button');
  exportBtn.className = 'btn btn--secondary';
  exportBtn.textContent = '📤 Export Save';
  exportBtn.addEventListener('click', () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `anxrpg_save_${timestamp}.json`;
    exportSaveToFile(uiState.saveData, filename);
    showNotification(`✅ Save exported as ${filename}`, 'success');
  });
  btnGroup.appendChild(exportBtn);
  
  // Import Save Button
  const importBtn = document.createElement('button');
  importBtn.className = 'btn btn--secondary';
  importBtn.textContent = '📥 Import Save';
  importBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.addEventListener('change', async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const confirmed = await showConfirm(
        'Import save file?',
        'This will overwrite your current save data!'
      );
      
      if (!confirmed) return;
      
      const imported = await importSaveFromFile(file);
      
      if (imported) {
        // Update UI state with imported data
        uiState.saveData = imported;
        saveGame(imported);
        
        showNotification('✅ Save imported successfully!', 'success');
        
        // Navigate to main menu
        EventBus.emit('saveLoaded', imported);
        ScreenManager.navigateTo('mainMenu', { uiState });
      } else {
        showNotification('❌ Failed to import save (invalid file)', 'error');
      }
    });
    
    input.click();
  });
  btnGroup.appendChild(importBtn);
  
  section.appendChild(btnGroup);
  
  return section;
}

/**
 * Render Statistics Section
 */
function renderStatisticsSection(uiState: any): HTMLElement {
  const section = document.createElement('div');
  section.className = 'settings-section';
  
  const title = document.createElement('h2');
  title.className = 'settings-section__title';
  title.textContent = '📊 Statistics';
  section.appendChild(title);
  
  const stats = uiState.saveData.statistics;
  
  const statsGrid = document.createElement('div');
  statsGrid.className = 'stats-grid';
  
  // Win Rate
  const winRate = stats.totalBattles > 0 
    ? ((stats.totalVictories / stats.totalBattles) * 100).toFixed(1)
    : '0.0';
  
  const statsData = [
    { label: 'Total Battles', value: stats.totalBattles.toLocaleString() },
    { label: 'Victories', value: stats.totalVictories.toLocaleString(), className: 'stats-grid__value--success' },
    { label: 'Defeats', value: stats.totalDefeats.toLocaleString(), className: 'stats-grid__value--error' },
    { label: 'Win Rate', value: `${winRate}%`, className: 'stats-grid__value--primary' },
    { label: 'Enemies Defeated', value: stats.totalEnemiesDefeated.toLocaleString() },
    { label: 'Bosses Defeated', value: stats.totalBossesDefeated.toLocaleString(), className: 'stats-grid__value--legendary' },
    { label: 'Total Damage Dealt', value: stats.totalDamageDealt.toLocaleString() },
    { label: 'Total Healing Done', value: stats.totalHealingDone.toLocaleString() },
    { label: 'Equipment Obtained', value: stats.totalEquipmentObtained.toLocaleString() },
    { label: 'Highest Level', value: stats.highestLevelReached.toString() },
  ];
  
  statsData.forEach(({ label, value, className }) => {
    const statItem = document.createElement('div');
    statItem.className = 'stats-grid__item';
    
    const labelEl = document.createElement('span');
    labelEl.className = 'stats-grid__label';
    labelEl.textContent = label;
    
    const valueEl = document.createElement('span');
    valueEl.className = `stats-grid__value ${className || ''}`;
    valueEl.textContent = value;
    
    statItem.appendChild(labelEl);
    statItem.appendChild(valueEl);
    statsGrid.appendChild(statItem);
  });
  
  section.appendChild(statsGrid);
  
  return section;
}

/**
 * Render Data Management Section
 */
function renderDataManagementSection(): HTMLElement {
  const section = document.createElement('div');
  section.className = 'settings-section settings-section--danger';
  
  const title = document.createElement('h2');
  title.className = 'settings-section__title';
  title.textContent = '⚠️ Data Management';
  section.appendChild(title);
  
  const warning = document.createElement('p');
  warning.className = 'settings-section__warning';
  warning.textContent = 'Danger Zone: These actions cannot be undone!';
  section.appendChild(warning);
  
  // Clear All Data Button
  const clearBtn = document.createElement('button');
  clearBtn.className = 'btn btn--danger';
  clearBtn.textContent = '🗑️ Clear All Data';
  clearBtn.addEventListener('click', async () => {
    const confirmed = await showConfirm(
      'Delete ALL save data?',
      'This will permanently delete your save, settings, and statistics. This cannot be undone!'
    );
    
    if (confirmed) {
      // Double confirmation for safety
      const doubleConfirmed = await showConfirm(
        'Are you absolutely sure?',
        'Type YES in your mind and confirm to proceed.'
      );
      
      if (doubleConfirmed) {
        clearAllSaves();
        showNotification('All data cleared', 'success');
        
        // Navigate to main menu (which will show "New Game" option)
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    }
  });
  
  section.appendChild(clearBtn);
  
  return section;
}

/**
 * Render Credits Section
 */
function renderCreditsSection(): HTMLElement {
  const section = document.createElement('div');
  section.className = 'settings-section settings-section--credits';
  
  const title = document.createElement('h2');
  title.className = 'settings-section__title';
  title.textContent = 'ℹ️ About';
  section.appendChild(title);
  
  const credits = document.createElement('div');
  credits.className = 'credits';
  credits.innerHTML = `
    <div class="credits__item">
      <strong>ANXRPG</strong>
      <span>A Next-Gen RPG Experience</span>
    </div>
    <div class="credits__item">
      <strong>Version</strong>
      <span>${SAVE_VERSION}</span>
    </div>
    <div class="credits__item">
      <strong>Built With</strong>
      <span>TypeScript + Vite</span>
    </div>
    <div class="credits__item">
      <strong>Character Types</strong>
      <span>6 (Alpha, Beta, Gamma, Delta, Epsilon, Zeta)</span>
    </div>
    <div class="credits__item">
      <strong>Total Stages</strong>
      <span>100</span>
    </div>
    <div class="credits__item">
      <strong>License</strong>
      <span>MIT</span>
    </div>
    <div class="credits__footer">
      <p>Thank you for playing! 🎮</p>
    </div>
  `;
  
  section.appendChild(credits);
  
  return section;
}

/**
 * Create a toggle setting control
 */
function createToggleSetting(
  label: string,
  description: string,
  initialValue: boolean,
  onChange: (value: boolean) => void
): HTMLElement {
  const setting = document.createElement('div');
  setting.className = 'setting-item setting-item--toggle';
  
  const info = document.createElement('div');
  info.className = 'setting-item__info';
  
  const labelEl = document.createElement('label');
  labelEl.className = 'setting-item__label';
  labelEl.textContent = label;
  
  const desc = document.createElement('p');
  desc.className = 'setting-item__description';
  desc.textContent = description;
  
  info.appendChild(labelEl);
  info.appendChild(desc);
  
  const control = document.createElement('div');
  control.className = 'setting-item__control';
  
  const toggle = document.createElement('label');
  toggle.className = 'toggle-switch';
  
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.checked = initialValue;
  input.addEventListener('change', () => {
    onChange(input.checked);
  });
  
  const slider = document.createElement('span');
  slider.className = 'toggle-switch__slider';
  
  toggle.appendChild(input);
  toggle.appendChild(slider);
  control.appendChild(toggle);
  
  setting.appendChild(info);
  setting.appendChild(control);
  
  return setting;
}

/**
 * Create a slider setting control
 */
function createSliderSetting(
  label: string,
  description: string,
  initialValue: number,
  min: number,
  max: number,
  step: number,
  onChange: (value: number) => void
): HTMLElement {
  const setting = document.createElement('div');
  setting.className = 'setting-item setting-item--slider';
  
  const info = document.createElement('div');
  info.className = 'setting-item__info';
  
  const labelEl = document.createElement('label');
  labelEl.className = 'setting-item__label';
  labelEl.textContent = label;
  
  const desc = document.createElement('p');
  desc.className = 'setting-item__description';
  desc.textContent = description;
  
  info.appendChild(labelEl);
  info.appendChild(desc);
  
  const control = document.createElement('div');
  control.className = 'setting-item__control';
  
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.className = 'slider';
  slider.min = min.toString();
  slider.max = max.toString();
  slider.step = step.toString();
  slider.value = initialValue.toString();
  
  const valueDisplay = document.createElement('span');
  valueDisplay.className = 'slider__value';
  
  // Format value display based on type
  const formatValue = (val: number): string => {
    if (max <= 1) {
      return `${Math.round(val * 100)}%`;
    }
    return `${val.toFixed(1)}x`;
  };
  
  valueDisplay.textContent = formatValue(initialValue);
  
  slider.addEventListener('input', () => {
    const value = parseFloat(slider.value);
    valueDisplay.textContent = formatValue(value);
  });
  
  slider.addEventListener('change', () => {
    const value = parseFloat(slider.value);
    onChange(value);
  });
  
  control.appendChild(slider);
  control.appendChild(valueDisplay);
  
  setting.appendChild(info);
  setting.appendChild(control);
  
  return setting;
}
