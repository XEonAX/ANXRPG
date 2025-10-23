/**
 * Save System Type Definitions
 * 
 * Defines the structure of save data for LocalStorage persistence.
 * Includes versioning for future migration support.
 */

import type { Character } from './character';
import type { Equipment } from './equipment';
import type { CampaignProgress } from './campaign';

/**
 * Complete save data structure
 */
export interface SaveData {
  /** Save data format version for migration support */
  version: string;
  
  /** Timestamp of when the save was created */
  timestamp: number;
  
  /** Player's character roster (max 6 characters) */
  roster: Character[];
  
  /** Campaign progression state */
  campaign: CampaignProgress;
  
  /** Shared equipment inventory (unlimited) */
  inventory: Equipment[];
  
  /** Player statistics for tracking */
  statistics: PlayerStatistics;
  
  /** Game settings and preferences */
  settings: GameSettings;
  
  /** Active team character IDs (1-3) */
  activeTeamIds: string[];
  
  /** Reserve team character IDs (up to 3) */
  reserveTeamIds: string[];
}

/**
 * Player statistics tracking
 */
export interface PlayerStatistics {
  /** Total battles fought */
  totalBattles: number;
  
  /** Total battles won */
  totalVictories: number;
  
  /** Total battles lost */
  totalDefeats: number;
  
  /** Total damage dealt across all battles */
  totalDamageDealt: number;
  
  /** Total healing done across all battles */
  totalHealingDone: number;
  
  /** Total enemies defeated */
  totalEnemiesDefeated: number;
  
  /** Total bosses defeated */
  totalBossesDefeated: number;
  
  /** Total equipment items obtained */
  totalEquipmentObtained: number;
  
  /** Highest level reached by any character */
  highestLevelReached: number;
  
  /** Total playtime in milliseconds */
  totalPlaytime: number;
}

/**
 * Game settings and preferences
 */
export interface GameSettings {
  /** Enable damage variance (±10%) */
  damageVariance: boolean;
  
  /** Combat animation speed (0.5-2.0 multiplier) */
  combatSpeed: number;
  
  /** Auto-save enabled */
  autoSave: boolean;
  
  /** Show damage numbers in combat */
  showDamageNumbers: boolean;
  
  /** Show detailed combat log */
  detailedCombatLog: boolean;
  
  /** Auto-hide low rarity equipment */
  autoHideLowRarityEquipment: boolean;
  
  /** Sound effects enabled */
  soundEnabled: boolean;
  
  /** Sound volume (0-1) */
  soundVolume: number;
}

/**
 * Save slot metadata (for multiple save slots in future)
 */
export interface SaveSlotMetadata {
  /** Slot number (1-3) */
  slot: number;
  
  /** Whether this slot has data */
  hasData: boolean;
  
  /** Timestamp of last save */
  lastSaved: number;
  
  /** Total playtime in this save */
  playtime: number;
  
  /** Highest level character in this save */
  highestLevel: number;
  
  /** Campaign progress percentage (0-100) */
  campaignProgress: number;
  
  /** Number of characters in roster */
  rosterSize: number;
}

/**
 * Save validation result
 */
export interface SaveValidationResult {
  /** Whether the save data is valid */
  isValid: boolean;
  
  /** Error messages if invalid */
  errors: string[];
  
  /** Warning messages (non-critical issues) */
  warnings: string[];
  
  /** Whether migration is needed */
  needsMigration: boolean;
  
  /** Version found in save data */
  foundVersion?: string;
}

/**
 * Default game settings
 */
export const DEFAULT_GAME_SETTINGS: GameSettings = {
  damageVariance: true,
  combatSpeed: 1.0,
  autoSave: true,
  showDamageNumbers: true,
  detailedCombatLog: true,
  autoHideLowRarityEquipment: false,
  soundEnabled: false, // Disabled by default (no sounds yet)
  soundVolume: 0.7,
};

/**
 * Default player statistics
 */
export const DEFAULT_PLAYER_STATISTICS: PlayerStatistics = {
  totalBattles: 0,
  totalVictories: 0,
  totalDefeats: 0,
  totalDamageDealt: 0,
  totalHealingDone: 0,
  totalEnemiesDefeated: 0,
  totalBossesDefeated: 0,
  totalEquipmentObtained: 0,
  highestLevelReached: 1,
  totalPlaytime: 0,
};

/**
 * Current save data version
 */
export const SAVE_VERSION = '1.0.0';

/**
 * LocalStorage key for save data
 */
export const SAVE_KEY = 'anxrpg_save';

/**
 * LocalStorage key for autosave data
 */
export const AUTOSAVE_KEY = 'anxrpg_autosave';
