/**
 * Campaign System Types
 * Defines stages, progression, and campaign state
 */

/**
 * Stage configuration for a single stage in the campaign
 */
export interface Stage {
  /** Stage number (1-100) */
  stageNumber: number;
  
  /** Stage name/title */
  name: string;
  
  /** Is this a boss stage? (every 10th stage) */
  isBossStage: boolean;
  
  /** Enemy tier (1-7) for this stage */
  tier: number;
  
  /** Recommended team size (1-3) */
  recommendedTeamSize: number;
  
  /** Enemy team size (1-3, bosses are solo) */
  enemyTeamSize: number;
  
  /** Specific enemy template IDs to use (optional, overrides random generation) */
  enemyTemplateIds?: string[];
  
  /** Boss template ID for boss stages */
  bossTemplateId?: string;
  
  /** Enemy level range for this stage */
  enemyLevelRange: {
    min: number;
    max: number;
  };
  
  /** Difficulty modifiers (multipliers for enemy stats) */
  difficultyModifiers?: {
    hpMultiplier?: number;
    attackMultiplier?: number;
    defenseMultiplier?: number;
  };
  
  /** Requirements to unlock this stage */
  unlockRequirements: {
    /** Previous stage that must be completed */
    previousStage: number | null;
    
    /** Minimum character level required */
    minLevel?: number;
  };
  
  /** Reward modifiers */
  rewardModifiers: {
    /** XP multiplier (default 1.0) */
    xpMultiplier: number;
    
    /** Equipment drop chance multiplier (default 1.0) */
    dropChanceMultiplier: number;
  };
  
  /** Flavor text for stage introduction */
  description?: string;
}

/**
 * Campaign progression tracking
 */
export interface CampaignProgress {
  /** Highest stage number unlocked (1-100) */
  highestStageUnlocked: number;
  
  /** Stages that have been completed at least once */
  completedStages: Set<number>;
  
  /** Current stage the player is on/viewing */
  currentStage: number;
  
  /** Total victories across all stages (for recruitment tracking) */
  totalVictories: number;
  
  /** Victory count per stage (for tracking farming) */
  victoriesPerStage: Map<number, number>;
}

/**
 * Stage result after battle completion
 */
export interface StageResult {
  /** Stage number that was completed */
  stageNumber: number;
  
  /** Was the battle won? */
  victory: boolean;
  
  /** Total XP earned */
  xpEarned: number;
  
  /** Equipment dropped */
  lootDropped: any[]; // Equipment[] when imported
  
  /** Was this a first-time clear? */
  firstTimeClear: boolean;
  
  /** Next stage unlocked (if any) */
  nextStageUnlocked?: number;
}

/**
 * Stage information for display
 */
export interface StageInfo {
  /** Stage configuration */
  stage: Stage;
  
  /** Is this stage unlocked? */
  isUnlocked: boolean;
  
  /** Is this stage completed? */
  isCompleted: boolean;
  
  /** How many times has this stage been cleared? */
  clearCount: number;
  
  /** Can the player access this stage now? */
  canAccess: boolean;
  
  /** Reason if stage cannot be accessed */
  lockReason?: string;
}
