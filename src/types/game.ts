/**
 * Game State and Campaign Type Definitions
 */

import type { Character } from './character';
import type { Equipment } from './equipment';
import type { CombatState } from './combat';

export interface StageDefinition {
  stageNumber: number;
  name: string;
  description: string;
  
  // Enemy composition
  enemyTemplateIds: string[];
  enemyLevels: number[];        // Level for each enemy
  
  // Boss stage
  isBossStage: boolean;
  
  // Rewards
  baseXpReward: number;
  guaranteedDrops?: string[];   // Equipment IDs
}

export interface PlayerProgress {
  // Stage progression
  currentStage: number;
  highestStageCleared: number;
  totalBattlesWon: number;      // For recruitment tracking
  
  // Recruitment
  characterRecruitments: number; // How many times recruited (max 6)
  nextRecruitmentAt: number;     // Battle count for next recruitment
  
  // Statistics
  totalBattles: number;
  totalDefeats: number;
  totalDamageDealt: number;
  totalDamageTaken: number;
}

export interface GameState {
  // Version for save compatibility
  version: string;
  
  // Player data
  playerProgress: PlayerProgress;
  
  // Character roster (max 6)
  characters: Character[];
  
  // Team composition
  activeTeamIds: string[];      // 1-3 character IDs
  reserveTeamIds: string[];     // Up to 3 character IDs
  
  // Inventory
  equipment: Equipment[];
  hiddenEquipmentIds: string[]; // Equipment marked as hidden
  
  // Current combat (if in battle)
  currentCombat: CombatState | null;
  
  // Settings
  settings: {
    damageVarianceEnabled: boolean;
    autoSaveEnabled: boolean;
    combatLogMaxEntries: number;
  };
  
  // Metadata
  saveTimestamp: number;
  playtimeSeconds: number;
}
