/**
 * Game State Management System
 * 
 * Handles game initialization, save/load, and global game state.
 */

import type { SaveData, GameSettings, PlayerStatistics } from '../types/save';
import type { Character, CharacterTypeName } from '../types/character';
import type { Equipment } from '../types/equipment';
import { createCharacter } from './character';
import { generateStartingEquipment } from './equipment';
import { initializeCampaignProgress } from './campaign';
import { 
  saveGame as persistSave, 
  loadGame as loadPersisted,
  hasSaveData,
  clearAllSaves,
} from '../utils/storage';
import { 
  DEFAULT_GAME_SETTINGS, 
  DEFAULT_PLAYER_STATISTICS,
  SAVE_VERSION,
} from '../types/save';

/**
 * Global game state
 */
export interface GameState {
  /** Current save data */
  saveData: SaveData;
  
  /** Whether the game is currently running */
  isRunning: boolean;
  
  /** Session start time (for playtime tracking) */
  sessionStartTime: number;
  
  /** Last auto-save timestamp */
  lastAutoSave: number;
}

/**
 * Current game state (singleton)
 */
let currentGameState: GameState | null = null;

/**
 * Initialize a new game
 * 
 * @param starterCharacterType - Character type for first character
 * @param characterName - Name for first character (optional, will generate if not provided)
 * @returns New game state
 */
export function initializeNewGame(
  starterCharacterType: CharacterTypeName = 'Alpha',
  characterName?: string
): GameState {
  console.log('[Game] Initializing new game...');
  
  // Create starting character at level 1
  const starterChar = createCharacter(starterCharacterType, 1, characterName);
  
  // Generate starting equipment for character
  const startingEquipment = generateStartingEquipment(starterCharacterType);
  
  // Create initial save data
  const saveData: SaveData = {
    version: SAVE_VERSION,
    timestamp: Date.now(),
    roster: [starterChar],
    campaign: initializeCampaignProgress(),
    inventory: startingEquipment,
    statistics: { ...DEFAULT_PLAYER_STATISTICS },
    settings: { ...DEFAULT_GAME_SETTINGS },
    activeTeamIds: [starterChar.id], // Starter character in active team
    reserveTeamIds: [], // Empty reserve initially
  };
  
  // Create game state
  currentGameState = {
    saveData,
    isRunning: true,
    sessionStartTime: Date.now(),
    lastAutoSave: 0,
  };
  
  console.log(`[Game] New game started with ${starterChar.name} (${starterChar.type})`);
  
  // Initial save
  if (saveData.settings.autoSave) {
    saveGame(true); // Auto-save
  }
  
  return currentGameState;
}

/**
 * Load game from save data
 * 
 * @param isAutoSave - Whether to load from auto-save
 * @returns Loaded game state or null if load failed
 */
export function loadGameState(isAutoSave: boolean = false): GameState | null {
  console.log(`[Game] Loading game from ${isAutoSave ? 'auto-save' : 'manual save'}...`);
  
  const saveData = loadPersisted(isAutoSave);
  
  if (!saveData) {
    console.error('[Game] Failed to load game');
    return null;
  }
  
  // Create game state from loaded save
  currentGameState = {
    saveData,
    isRunning: true,
    sessionStartTime: Date.now(),
    lastAutoSave: Date.now(),
  };
  
  console.log(`[Game] Game loaded successfully (${saveData.roster.length} characters, stage ${saveData.campaign.currentStage})`);
  
  return currentGameState;
}

/**
 * Save current game state
 * 
 * @param isAutoSave - Whether this is an auto-save
 * @returns Success status
 */
export function saveGame(isAutoSave: boolean = false): boolean {
  if (!currentGameState) {
    console.error('[Game] Cannot save - no active game state');
    return false;
  }
  
  // Update playtime before saving
  updatePlaytime();
  
  const success = persistSave(currentGameState.saveData, isAutoSave);
  
  if (success && isAutoSave) {
    currentGameState.lastAutoSave = Date.now();
  }
  
  return success;
}

/**
 * Check if a save exists
 * 
 * @param isAutoSave - Whether to check for auto-save
 * @returns True if save exists
 */
export function hasSave(isAutoSave: boolean = false): boolean {
  return hasSaveData(isAutoSave);
}

/**
 * Delete all save data
 */
export function deleteAllSaves(): void {
  clearAllSaves();
  console.log('[Game] All saves deleted');
}

/**
 * Get current game state
 * 
 * @returns Current game state or null if no game loaded
 */
export function getCurrentGameState(): GameState | null {
  return currentGameState;
}

/**
 * Get current roster
 * 
 * @returns Character roster
 */
export function getRoster(): Character[] {
  if (!currentGameState) {
    return [];
  }
  return currentGameState.saveData.roster;
}

/**
 * Get shared equipment inventory
 * 
 * @returns Equipment inventory
 */
export function getInventory(): Equipment[] {
  if (!currentGameState) {
    return [];
  }
  return currentGameState.saveData.inventory;
}

/**
 * Add character to roster
 * 
 * @param character - Character to add
 * @returns Success status
 */
export function addCharacterToRoster(character: Character): boolean {
  if (!currentGameState) {
    console.error('[Game] Cannot add character - no active game');
    return false;
  }
  
  if (currentGameState.saveData.roster.length >= 6) {
    console.error('[Game] Cannot add character - roster full (max 6)');
    return false;
  }
  
  currentGameState.saveData.roster.push(character);
  console.log(`[Game] Added ${character.name} to roster (${currentGameState.saveData.roster.length}/6)`);
  
  return true;
}

/**
 * Remove character from roster
 * 
 * @param characterId - ID of character to remove
 * @returns Success status
 */
export function removeCharacterFromRoster(characterId: string): boolean {
  if (!currentGameState) {
    console.error('[Game] Cannot remove character - no active game');
    return false;
  }
  
  const index = currentGameState.saveData.roster.findIndex(c => c.id === characterId);
  
  if (index === -1) {
    console.error('[Game] Character not found in roster:', characterId);
    return false;
  }
  
  const removed = currentGameState.saveData.roster.splice(index, 1)[0];
  console.log(`[Game] Removed ${removed.name} from roster (${currentGameState.saveData.roster.length}/6)`);
  
  return true;
}

/**
 * Add equipment to inventory
 * 
 * @param equipment - Equipment item to add
 */
export function addEquipmentToInventory(equipment: Equipment): void {
  if (!currentGameState) {
    console.error('[Game] Cannot add equipment - no active game');
    return;
  }
  
  currentGameState.saveData.inventory.push(equipment);
  currentGameState.saveData.statistics.totalEquipmentObtained++;
  
  console.log(`[Game] Added ${equipment.name} to inventory (${currentGameState.saveData.inventory.length} items)`);
}

/**
 * Remove equipment from inventory
 * 
 * @param equipmentId - ID of equipment to remove
 * @returns Success status
 */
export function removeEquipmentFromInventory(equipmentId: string): boolean {
  if (!currentGameState) {
    console.error('[Game] Cannot remove equipment - no active game');
    return false;
  }
  
  const index = currentGameState.saveData.inventory.findIndex(e => e.id === equipmentId);
  
  if (index === -1) {
    console.error('[Game] Equipment not found in inventory:', equipmentId);
    return false;
  }
  
  const removed = currentGameState.saveData.inventory.splice(index, 1)[0];
  console.log(`[Game] Removed ${removed.name} from inventory`);
  
  return true;
}

/**
 * Get game settings
 * 
 * @returns Current game settings
 */
export function getSettings(): GameSettings {
  if (!currentGameState) {
    return { ...DEFAULT_GAME_SETTINGS };
  }
  return currentGameState.saveData.settings;
}

/**
 * Update game settings
 * 
 * @param settings - Partial settings to update
 */
export function updateSettings(settings: Partial<GameSettings>): void {
  if (!currentGameState) {
    console.error('[Game] Cannot update settings - no active game');
    return;
  }
  
  currentGameState.saveData.settings = {
    ...currentGameState.saveData.settings,
    ...settings,
  };
  
  console.log('[Game] Settings updated');
}

/**
 * Get player statistics
 * 
 * @returns Current player statistics
 */
export function getStatistics(): PlayerStatistics {
  if (!currentGameState) {
    return { ...DEFAULT_PLAYER_STATISTICS };
  }
  return currentGameState.saveData.statistics;
}

/**
 * Update player statistics
 * 
 * @param stats - Partial statistics to update
 */
export function updateStatistics(stats: Partial<PlayerStatistics>): void {
  if (!currentGameState) {
    console.error('[Game] Cannot update statistics - no active game');
    return;
  }
  
  currentGameState.saveData.statistics = {
    ...currentGameState.saveData.statistics,
    ...stats,
  };
}

/**
 * Increment a numeric statistic
 * 
 * @param stat - Statistic name to increment
 * @param amount - Amount to add (default 1)
 */
export function incrementStatistic(
  stat: keyof PlayerStatistics,
  amount: number = 1
): void {
  if (!currentGameState) {
    return;
  }
  
  const currentValue = currentGameState.saveData.statistics[stat] as number;
  (currentGameState.saveData.statistics[stat] as number) = currentValue + amount;
}

/**
 * Update playtime based on session time
 */
export function updatePlaytime(): void {
  if (!currentGameState) {
    return;
  }
  
  const sessionDuration = Date.now() - currentGameState.sessionStartTime;
  currentGameState.saveData.statistics.totalPlaytime += sessionDuration;
  
  // Reset session timer
  currentGameState.sessionStartTime = Date.now();
}

/**
 * Check if auto-save should trigger
 * 
 * @param interval - Auto-save interval in milliseconds (default 5 minutes)
 * @returns True if auto-save should trigger
 */
export function shouldAutoSave(interval: number = 5 * 60 * 1000): boolean {
  if (!currentGameState) {
    return false;
  }
  
  if (!currentGameState.saveData.settings.autoSave) {
    return false;
  }
  
  const timeSinceLastSave = Date.now() - currentGameState.lastAutoSave;
  return timeSinceLastSave >= interval;
}

/**
 * Trigger auto-save if needed
 * 
 * @returns True if auto-save was performed
 */
export function tryAutoSave(): boolean {
  if (shouldAutoSave()) {
    return saveGame(true);
  }
  return false;
}

/**
 * End current game session
 */
export function endGameSession(): void {
  if (!currentGameState) {
    return;
  }
  
  // Update playtime
  updatePlaytime();
  
  // Auto-save if enabled
  if (currentGameState.saveData.settings.autoSave) {
    saveGame(true);
  }
  
  currentGameState.isRunning = false;
  console.log('[Game] Game session ended');
}

/**
 * Reset game (for new game)
 */
export function resetGame(): void {
  currentGameState = null;
  console.log('[Game] Game state reset');
}
