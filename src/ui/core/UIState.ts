/**
 * Global UI State Management
 * Manages runtime game state for the UI layer
 */

import type { SaveData } from '../../types/save';
import type { Character } from '../../types/character';
import { EventBus, GameEvents } from './EventBus';

/**
 * Runtime game state (not persisted in saves)
 */
export interface UIGameState {
  /** Save data */
  saveData: SaveData;
  
  /** Active team character IDs (1-3) */
  activeTeamIds: string[];
  
  /** Reserve team character IDs (up to 3) */
  reserveTeamIds: string[];
}

/**
 * Current UI game state (singleton)
 */
let currentUIState: UIGameState | null = null;

/**
 * Initialize UI state from save data
 */
export function initializeUIState(saveData: SaveData): UIGameState {
  // Use team IDs from save data, with fallback for legacy saves
  let activeTeamIds = saveData.activeTeamIds || [];
  let reserveTeamIds = saveData.reserveTeamIds || [];
  
  // Fallback for legacy saves without team assignments
  if (activeTeamIds.length === 0 && reserveTeamIds.length === 0 && saveData.roster.length > 0) {
    activeTeamIds = [saveData.roster[0].id];
    reserveTeamIds = saveData.roster.slice(1, 4).map((c: Character) => c.id);
    
    // Update save data with initial team assignments
    saveData.activeTeamIds = activeTeamIds;
    saveData.reserveTeamIds = reserveTeamIds;
  }
  
  currentUIState = {
    saveData,
    activeTeamIds,
    reserveTeamIds
  };
  
  return currentUIState;
}

/**
 * Get current UI state
 */
export function getCurrentUIState(): UIGameState | null {
  return currentUIState;
}

/**
 * Update save data in UI state
 */
export function updateSaveData(saveData: SaveData): void {
  if (currentUIState) {
    currentUIState.saveData = saveData;
    EventBus.emit(GameEvents.GAME_SAVED);
  }
}

/**
 * Get active team characters
 */
export function getActiveTeam(): Character[] {
  if (!currentUIState) return [];
  return currentUIState.saveData.roster.filter((c: Character) => 
    currentUIState!.activeTeamIds.includes(c.id)
  );
}

/**
 * Get reserve team characters
 */
export function getReserveTeam(): Character[] {
  if (!currentUIState) return [];
  return currentUIState.saveData.roster.filter((c: Character) => 
    currentUIState!.reserveTeamIds.includes(c.id)
  );
}

/**
 * Move character between active and reserve
 */
export function swapCharacter(
  characterId: string,
  fromTeam: 'active' | 'reserve'
): boolean {
  if (!currentUIState) return false;
  
  const sourceIds = fromTeam === 'active' 
    ? currentUIState.activeTeamIds 
    : currentUIState.reserveTeamIds;
  const targetIds = fromTeam === 'active' 
    ? currentUIState.reserveTeamIds 
    : currentUIState.activeTeamIds;
  
  const index = sourceIds.indexOf(characterId);
  if (index === -1) return false;
  
  if (targetIds.length >= 3) return false;
  
  sourceIds.splice(index, 1);
  targetIds.push(characterId);
  
  // Sync to save data
  currentUIState.saveData.activeTeamIds = [...currentUIState.activeTeamIds];
  currentUIState.saveData.reserveTeamIds = [...currentUIState.reserveTeamIds];
  
  return true;
}

/**
 * Add character to active team
 */
export function addToActiveTeam(characterId: string): boolean {
  if (!currentUIState) return false;
  if (currentUIState.activeTeamIds.length >= 3) return false;
  if (currentUIState.activeTeamIds.includes(characterId)) return false;
  
  // Remove from reserve if present
  const reserveIndex = currentUIState.reserveTeamIds.indexOf(characterId);
  if (reserveIndex !== -1) {
    currentUIState.reserveTeamIds.splice(reserveIndex, 1);
  }
  
  currentUIState.activeTeamIds.push(characterId);
  
  // Sync to save data
  currentUIState.saveData.activeTeamIds = [...currentUIState.activeTeamIds];
  currentUIState.saveData.reserveTeamIds = [...currentUIState.reserveTeamIds];
  
  return true;
}

/**
 * Add character to reserve team
 */
export function addToReserveTeam(characterId: string): boolean {
  if (!currentUIState) return false;
  if (currentUIState.reserveTeamIds.length >= 3) return false;
  if (currentUIState.reserveTeamIds.includes(characterId)) return false;
  
  // Remove from active if present
  const activeIndex = currentUIState.activeTeamIds.indexOf(characterId);
  if (activeIndex !== -1) {
    currentUIState.activeTeamIds.splice(activeIndex, 1);
  }
  
  currentUIState.reserveTeamIds.push(characterId);
  
  // Sync to save data
  currentUIState.saveData.activeTeamIds = [...currentUIState.activeTeamIds];
  currentUIState.saveData.reserveTeamIds = [...currentUIState.reserveTeamIds];
  
  return true;
}
