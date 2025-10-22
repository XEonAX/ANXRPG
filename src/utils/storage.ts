/**
 * Save/Load System - LocalStorage Persistence
 * 
 * Handles serialization, validation, and persistence of game state.
 */

import type { 
  SaveData, 
  SaveValidationResult,
  SaveSlotMetadata,
} from '../types/save';
import { 
  SAVE_VERSION, 
  SAVE_KEY, 
  AUTOSAVE_KEY,
  DEFAULT_GAME_SETTINGS,
  DEFAULT_PLAYER_STATISTICS,
} from '../types/save';

/**
 * Save game state to LocalStorage
 * 
 * @param saveData - Complete game state to save
 * @param isAutoSave - Whether this is an auto-save (uses separate key)
 * @returns Success status
 */
export function saveGame(saveData: SaveData, isAutoSave: boolean = false): boolean {
  try {
    // Update timestamp
    saveData.timestamp = Date.now();
    
    // Update version
    saveData.version = SAVE_VERSION;
    
    // Serialize to JSON
    const json = JSON.stringify(saveData);
    
    // Save to LocalStorage
    const key = isAutoSave ? AUTOSAVE_KEY : SAVE_KEY;
    localStorage.setItem(key, json);
    
    console.log(`[Storage] Game ${isAutoSave ? 'auto-' : ''}saved successfully`);
    return true;
  } catch (error) {
    console.error('[Storage] Failed to save game:', error);
    return false;
  }
}

/**
 * Load game state from LocalStorage
 * 
 * @param isAutoSave - Whether to load auto-save (vs manual save)
 * @returns Loaded save data, or null if not found/invalid
 */
export function loadGame(isAutoSave: boolean = false): SaveData | null {
  try {
    const key = isAutoSave ? AUTOSAVE_KEY : SAVE_KEY;
    const json = localStorage.getItem(key);
    
    if (!json) {
      console.log(`[Storage] No ${isAutoSave ? 'auto-' : ''}save data found`);
      return null;
    }
    
    // Parse JSON
    const data = JSON.parse(json) as SaveData;
    
    // Validate save data
    const validation = validateSaveData(data);
    
    if (!validation.isValid) {
      console.error('[Storage] Save data validation failed:', validation.errors);
      return null;
    }
    
    // Check if migration needed
    if (validation.needsMigration) {
      console.log('[Storage] Save data needs migration from version', validation.foundVersion);
      const migrated = migrateSaveData(data);
      
      if (!migrated) {
        console.error('[Storage] Save data migration failed');
        return null;
      }
      
      return migrated;
    }
    
    console.log(`[Storage] Game loaded successfully from ${isAutoSave ? 'auto-' : 'manual '}save`);
    return data;
    
  } catch (error) {
    console.error('[Storage] Failed to load game:', error);
    return null;
  }
}

/**
 * Check if a save exists
 * 
 * @param isAutoSave - Whether to check for auto-save
 * @returns True if save data exists
 */
export function hasSaveData(isAutoSave: boolean = false): boolean {
  const key = isAutoSave ? AUTOSAVE_KEY : SAVE_KEY;
  return localStorage.getItem(key) !== null;
}

/**
 * Delete save data
 * 
 * @param isAutoSave - Whether to delete auto-save
 * @returns Success status
 */
export function deleteSave(isAutoSave: boolean = false): boolean {
  try {
    const key = isAutoSave ? AUTOSAVE_KEY : SAVE_KEY;
    localStorage.removeItem(key);
    console.log(`[Storage] ${isAutoSave ? 'Auto-save' : 'Save'} deleted successfully`);
    return true;
  } catch (error) {
    console.error('[Storage] Failed to delete save:', error);
    return false;
  }
}

/**
 * Get save metadata without loading full save
 * 
 * @param isAutoSave - Whether to get auto-save metadata
 * @returns Save slot metadata or null
 */
export function getSaveMetadata(isAutoSave: boolean = false): SaveSlotMetadata | null {
  try {
    const key = isAutoSave ? AUTOSAVE_KEY : SAVE_KEY;
    const json = localStorage.getItem(key);
    
    if (!json) {
      return {
        slot: isAutoSave ? 0 : 1,
        hasData: false,
        lastSaved: 0,
        playtime: 0,
        highestLevel: 1,
        campaignProgress: 0,
        rosterSize: 0,
      };
    }
    
    const data = JSON.parse(json) as SaveData;
    
    // Calculate campaign progress percentage
    const completedStages = data.campaign.completedStages.size;
    const campaignProgress = (completedStages / 100) * 100;
    
    // Find highest level character
    const highestLevel = data.roster.reduce((max, char) => 
      Math.max(max, char.level), 1
    );
    
    return {
      slot: isAutoSave ? 0 : 1,
      hasData: true,
      lastSaved: data.timestamp,
      playtime: data.statistics.totalPlaytime,
      highestLevel,
      campaignProgress,
      rosterSize: data.roster.length,
    };
    
  } catch (error) {
    console.error('[Storage] Failed to get save metadata:', error);
    return null;
  }
}

/**
 * Validate save data structure
 * 
 * @param data - Save data to validate
 * @returns Validation result with errors/warnings
 */
export function validateSaveData(data: any): SaveValidationResult {
  const result: SaveValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    needsMigration: false,
    foundVersion: data?.version,
  };
  
  // Check if data exists
  if (!data) {
    result.isValid = false;
    result.errors.push('Save data is null or undefined');
    return result;
  }
  
  // Check version
  if (!data.version) {
    result.warnings.push('No version number found (legacy save?)');
    result.needsMigration = true;
  } else if (data.version !== SAVE_VERSION) {
    result.warnings.push(`Version mismatch: found ${data.version}, current ${SAVE_VERSION}`);
    result.needsMigration = true;
  }
  
  // Check required fields
  if (!data.roster || !Array.isArray(data.roster)) {
    result.isValid = false;
    result.errors.push('Missing or invalid roster data');
  }
  
  if (!data.campaign) {
    result.isValid = false;
    result.errors.push('Missing campaign data');
  }
  
  if (!data.inventory || !Array.isArray(data.inventory)) {
    result.isValid = false;
    result.errors.push('Missing or invalid inventory data');
  }
  
  if (!data.statistics) {
    result.warnings.push('Missing statistics data (will use defaults)');
  }
  
  if (!data.settings) {
    result.warnings.push('Missing settings data (will use defaults)');
  }
  
  // Validate roster size
  if (data.roster && data.roster.length > 6) {
    result.errors.push(`Invalid roster size: ${data.roster.length} (max 6)`);
    result.isValid = false;
  }
  
  // Validate character data structure
  if (data.roster && Array.isArray(data.roster)) {
    data.roster.forEach((char: any, index: number) => {
      if (!char.id) {
        result.errors.push(`Character ${index} missing ID`);
        result.isValid = false;
      }
      if (!char.name) {
        result.errors.push(`Character ${index} missing name`);
        result.isValid = false;
      }
      if (!char.type) {
        result.errors.push(`Character ${index} missing type`);
        result.isValid = false;
      }
      if (typeof char.level !== 'number' || char.level < 1) {
        result.errors.push(`Character ${index} has invalid level`);
        result.isValid = false;
      }
    });
  }
  
  return result;
}

/**
 * Migrate save data from older versions
 * 
 * @param data - Old save data
 * @returns Migrated save data or null if migration failed
 */
export function migrateSaveData(data: any): SaveData | null {
  try {
    console.log('[Storage] Migrating save data from version', data.version || 'unknown');
    
    // Create migrated save with current structure
    const migrated: SaveData = {
      version: SAVE_VERSION,
      timestamp: data.timestamp || Date.now(),
      roster: data.roster || [],
      campaign: data.campaign || { unlockedStages: [1], completedStages: [], currentStage: 1, victories: {} },
      inventory: data.inventory || [],
      statistics: data.statistics || { ...DEFAULT_PLAYER_STATISTICS },
      settings: data.settings || { ...DEFAULT_GAME_SETTINGS },
    };
    
    // Ensure settings have all current fields
    migrated.settings = {
      ...DEFAULT_GAME_SETTINGS,
      ...(data.settings || {}),
    };
    
    // Ensure statistics have all current fields
    migrated.statistics = {
      ...DEFAULT_PLAYER_STATISTICS,
      ...(data.statistics || {}),
    };
    
    console.log('[Storage] Migration successful');
    return migrated;
    
  } catch (error) {
    console.error('[Storage] Migration failed:', error);
    return null;
  }
}

/**
 * Export save data as downloadable JSON file
 * 
 * @param saveData - Save data to export
 * @param filename - Filename for download
 */
export function exportSaveToFile(saveData: SaveData, filename: string = 'anxrpg_save.json'): void {
  try {
    const json = JSON.stringify(saveData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    
    URL.revokeObjectURL(url);
    console.log('[Storage] Save data exported to file');
  } catch (error) {
    console.error('[Storage] Failed to export save:', error);
  }
}

/**
 * Import save data from JSON file
 * 
 * @param file - File object containing save data
 * @returns Promise resolving to save data or null
 */
export async function importSaveFromFile(file: File): Promise<SaveData | null> {
  try {
    const text = await file.text();
    const data = JSON.parse(text) as SaveData;
    
    const validation = validateSaveData(data);
    
    if (!validation.isValid) {
      console.error('[Storage] Imported save data is invalid:', validation.errors);
      return null;
    }
    
    if (validation.needsMigration) {
      return migrateSaveData(data);
    }
    
    console.log('[Storage] Save data imported successfully');
    return data;
    
  } catch (error) {
    console.error('[Storage] Failed to import save:', error);
    return null;
  }
}

/**
 * Clear all save data (manual and auto-save)
 */
export function clearAllSaves(): void {
  deleteSave(false); // Manual save
  deleteSave(true);  // Auto-save
  console.log('[Storage] All save data cleared');
}
