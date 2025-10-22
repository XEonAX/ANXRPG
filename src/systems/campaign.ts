/**
 * Campaign System
 * Manages stage progression, unlocking, and campaign state
 */

import type { Character } from '../types/character';
import type { Enemy } from '../types/enemy';
import type { Equipment } from '../types/equipment';
import type { 
  Stage, 
  CampaignProgress, 
  StageResult, 
  StageInfo 
} from '../types/campaign';
import { STAGES, getStage, isBossStage as checkBossStage } from '../data/stages';
import { 
  generateEnemyTeam, 
  generateBossEncounter, 
  createEnemy,
  calculateEnemyXpReward 
} from './enemy';
import { generateEquipment } from './equipment';

/**
 * Initialize campaign progress for a new game
 */
export function initializeCampaignProgress(): CampaignProgress {
  return {
    highestStageUnlocked: 1,
    completedStages: new Set<number>(),
    currentStage: 1,
    totalVictories: 0,
    victoriesPerStage: new Map<number, number>()
  };
}

/**
 * Get current stage configuration
 */
export function getCurrentStage(progress: CampaignProgress): Stage | null {
  return getStage(progress.currentStage);
}

/**
 * Check if a stage can be accessed
 */
export function canAccessStage(
  stageNumber: number, 
  progress: CampaignProgress,
  characters: Character[]
): { canAccess: boolean; reason?: string } {
  // Stage doesn't exist
  const stage = getStage(stageNumber);
  if (!stage) {
    return { canAccess: false, reason: 'Stage does not exist' };
  }

  // Stage not unlocked yet
  if (stageNumber > progress.highestStageUnlocked) {
    return { canAccess: false, reason: 'Stage is locked' };
  }

  // Check minimum level requirement
  if (stage.unlockRequirements.minLevel) {
    const hasLevelRequirement = characters.some(
      char => char.level >= stage.unlockRequirements.minLevel!
    );
    if (!hasLevelRequirement) {
      return { 
        canAccess: false, 
        reason: `Requires at least one character at level ${stage.unlockRequirements.minLevel}` 
      };
    }
  }

  return { canAccess: true };
}

/**
 * Get detailed information about a stage
 */
export function getStageInfo(
  stageNumber: number,
  progress: CampaignProgress,
  characters: Character[]
): StageInfo | null {
  const stage = getStage(stageNumber);
  if (!stage) return null;

  const isUnlocked = stageNumber <= progress.highestStageUnlocked;
  const isCompleted = progress.completedStages.has(stageNumber);
  const clearCount = progress.victoriesPerStage.get(stageNumber) || 0;
  const accessCheck = canAccessStage(stageNumber, progress, characters);

  return {
    stage,
    isUnlocked,
    isCompleted,
    clearCount,
    canAccess: accessCheck.canAccess,
    lockReason: accessCheck.reason
  };
}

/**
 * Unlock the next stage in sequence
 */
export function unlockNextStage(progress: CampaignProgress): number | null {
  const nextStageNumber = progress.highestStageUnlocked + 1;
  
  // Check if next stage exists
  if (nextStageNumber > 100) {
    return null; // Campaign complete
  }

  progress.highestStageUnlocked = nextStageNumber;
  return nextStageNumber;
}

/**
 * Set the current stage the player is viewing/attempting
 */
export function setCurrentStage(
  progress: CampaignProgress,
  stageNumber: number
): boolean {
  // Can only set current stage to unlocked stages
  if (stageNumber > progress.highestStageUnlocked || stageNumber < 1) {
    return false;
  }

  progress.currentStage = stageNumber;
  return true;
}

/**
 * Generate enemy team for a stage
 */
export function generateStageEnemies(stage: Stage): Enemy[] {
  // Boss stages use boss encounter generation
  if (stage.isBossStage && stage.bossTemplateId) {
    return generateBossEncounter(stage.stageNumber);
  }

  // Normal stages generate random enemy teams
  const enemyLevel = stage.enemyLevelRange.min + 
    Math.floor(Math.random() * (stage.enemyLevelRange.max - stage.enemyLevelRange.min + 1));

  // Use specific enemy templates if provided
  if (stage.enemyTemplateIds && stage.enemyTemplateIds.length > 0) {
    // Generate team from specific templates
    return stage.enemyTemplateIds.slice(0, stage.enemyTeamSize).map((templateId, index) => {
      return createEnemy(templateId, enemyLevel + index, false);
    });
  }

  // Otherwise generate random team for the tier
  return generateEnemyTeam(
    stage.stageNumber,
    stage.enemyTeamSize,
    stage.enemyLevelRange.max - stage.enemyLevelRange.min
  );
}

/**
 * Calculate total XP reward for completing a stage
 * (includes stage modifiers)
 */
export function calculateStageXpReward(
  stage: Stage,
  enemies: Enemy[]
): number {
  // Base XP from all enemies
  const baseXp = enemies.reduce((sum, enemy) => {
    return sum + calculateEnemyXpReward(enemy);
  }, 0);

  // Apply stage XP multiplier
  return Math.floor(baseXp * stage.rewardModifiers.xpMultiplier);
}

/**
 * Generate equipment drops for a stage
 * (applies stage drop chance modifiers)
 */
export function generateStageEquipment(
  stage: Stage,
  enemies: Enemy[]
): Equipment[] {
  const drops: Equipment[] = [];

  for (const enemy of enemies) {
    // Simple drop chance: stage multiplier affects probability
    // Base 20% chance per enemy, modified by stage multiplier
    const baseDropChance = 0.2;
    const modifiedDropChance = baseDropChance * stage.rewardModifiers.dropChanceMultiplier;
    
    // Roll with modified chance
    if (Math.random() < modifiedDropChance) {
      // Generate equipment at enemy's level
      const equipment = generateEquipment(enemy.level);
      drops.push(equipment);
    }
  }

  return drops;
}

/**
 * Process stage completion and update progress
 */
export function completeStage(
  progress: CampaignProgress,
  stageNumber: number,
  victory: boolean,
  xpEarned: number,
  lootDropped: Equipment[]
): StageResult {
  const stage = getStage(stageNumber);
  if (!stage) {
    throw new Error(`Invalid stage number: ${stageNumber}`);
  }

  // Check if this is first time clearing
  const firstTimeClear = !progress.completedStages.has(stageNumber);

  if (victory) {
    // Mark stage as completed
    progress.completedStages.add(stageNumber);

    // Increment victory counter for this stage
    const currentCount = progress.victoriesPerStage.get(stageNumber) || 0;
    progress.victoriesPerStage.set(stageNumber, currentCount + 1);

    // Increment total victories (for recruitment tracking)
    // Only count stages 5+ for recruitment (as per game design)
    if (stageNumber >= 5) {
      progress.totalVictories++;
    }

    // Unlock next stage on first clear
    let nextStageUnlocked: number | undefined;
    if (firstTimeClear && stageNumber === progress.highestStageUnlocked) {
      const unlocked = unlockNextStage(progress);
      if (unlocked) {
        nextStageUnlocked = unlocked;
      }
    }

    return {
      stageNumber,
      victory: true,
      xpEarned,
      lootDropped,
      firstTimeClear,
      nextStageUnlocked
    };
  } else {
    // Defeat - no progression changes
    return {
      stageNumber,
      victory: false,
      xpEarned: 0,
      lootDropped: [],
      firstTimeClear: false
    };
  }
}

/**
 * Get list of all unlocked stages
 */
export function getUnlockedStages(progress: CampaignProgress): Stage[] {
  return STAGES.filter(stage => stage.stageNumber <= progress.highestStageUnlocked);
}

/**
 * Get list of completed stages
 */
export function getCompletedStages(progress: CampaignProgress): Stage[] {
  return STAGES.filter(stage => progress.completedStages.has(stage.stageNumber));
}

/**
 * Check if campaign is complete (all 100 stages cleared)
 */
export function isCampaignComplete(progress: CampaignProgress): boolean {
  return progress.completedStages.size === 100;
}

/**
 * Get campaign completion percentage
 */
export function getCampaignCompletionPercentage(progress: CampaignProgress): number {
  return (progress.completedStages.size / 100) * 100;
}

/**
 * Get total victories for a specific stage (farming count)
 */
export function getStageVictoryCount(
  progress: CampaignProgress,
  stageNumber: number
): number {
  return progress.victoriesPerStage.get(stageNumber) || 0;
}

/**
 * Check if player can retry a stage (always true for unlocked stages)
 */
export function canRetryStage(
  progress: CampaignProgress,
  stageNumber: number
): boolean {
  return stageNumber <= progress.highestStageUnlocked && stageNumber >= 1;
}

/**
 * Get campaign summary for display
 */
export function getCampaignSummary(progress: CampaignProgress): {
  currentStage: number;
  highestUnlocked: number;
  stagesCompleted: number;
  totalStages: number;
  completionPercentage: number;
  totalVictories: number;
  isCampaignComplete: boolean;
} {
  return {
    currentStage: progress.currentStage,
    highestUnlocked: progress.highestStageUnlocked,
    stagesCompleted: progress.completedStages.size,
    totalStages: 100,
    completionPercentage: getCampaignCompletionPercentage(progress),
    totalVictories: progress.totalVictories,
    isCampaignComplete: isCampaignComplete(progress)
  };
}

/**
 * Reset campaign progress (for new game)
 */
export function resetCampaignProgress(): CampaignProgress {
  return initializeCampaignProgress();
}

/**
 * Get stages by tier (for display/filtering)
 */
export function getStagesByTier(tier: number): Stage[] {
  return STAGES.filter(stage => stage.tier === tier);
}

/**
 * Get next boss stage after current stage
 */
export function getNextBossStage(currentStage: number): Stage | null {
  const nextBossNumber = Math.ceil((currentStage + 1) / 10) * 10;
  if (nextBossNumber > 100) return null;
  return getStage(nextBossNumber);
}

/**
 * Check if a stage number is a boss stage
 */
export function isBossStage(stageNumber: number): boolean {
  return checkBossStage(stageNumber);
}
