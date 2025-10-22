/**
 * Character Recruitment System
 * 
 * Handles unlocking new character slots based on battle victories.
 * Players can recruit new characters every 20 victories.
 */

import type { Character, CharacterTypeName } from '../types/character';
import { createCharacter } from './character';

/**
 * Recruitment milestone thresholds (battle victories needed)
 */
export const RECRUITMENT_MILESTONES = [20, 40, 60, 80, 100];

/**
 * Maximum number of characters in roster
 */
export const MAX_ROSTER_SIZE = 6;

/**
 * Minimum stage number for battles to count toward recruitment
 * (Excludes very early/trivial stages)
 */
export const MIN_STAGE_FOR_RECRUITMENT = 5;

/**
 * Check if player has unlocked a new recruitment slot
 * Returns the number of recruitment slots available (0-5)
 */
export function getAvailableRecruitments(totalBattleVictories: number): number {
  return RECRUITMENT_MILESTONES.filter(milestone => totalBattleVictories >= milestone).length;
}

/**
 * Check if player can recruit a new character right now
 */
export function canRecruitCharacter(
  totalBattleVictories: number,
  currentRosterSize: number
): boolean {
  const availableSlots = getAvailableRecruitments(totalBattleVictories);
  
  // Available slots are based on milestones, but max roster is 6 (starting char + 5 recruits)
  // At first recruitment (20 wins), roster goes from 1 to 2
  // At fifth recruitment (100 wins), roster is at 6 and needs retirement option
  
  return currentRosterSize < availableSlots + 1 && currentRosterSize < MAX_ROSTER_SIZE;
}

/**
 * Get the next recruitment milestone
 */
export function getNextRecruitmentMilestone(totalBattleVictories: number): number | null {
  for (const milestone of RECRUITMENT_MILESTONES) {
    if (totalBattleVictories < milestone) {
      return milestone;
    }
  }
  return null; // All milestones reached
}

/**
 * Get battles remaining until next recruitment
 */
export function getBattlesUntilNextRecruitment(totalBattleVictories: number): number | null {
  const nextMilestone = getNextRecruitmentMilestone(totalBattleVictories);
  return nextMilestone ? nextMilestone - totalBattleVictories : null;
}

/**
 * Recruit a new character
 * Creates a level 1 character of the specified type
 */
export function recruitCharacter(
  characterType: CharacterTypeName,
  customName?: string
): Character {
  return createCharacter(characterType, 1, customName);
}

/**
 * Check if player needs to retire a character (at 6th recruitment with full roster)
 */
export function needsRetirement(
  totalBattleVictories: number,
  currentRosterSize: number
): boolean {
  // At 100 victories (6th recruitment), if roster is full (6 characters), need retirement
  return totalBattleVictories >= RECRUITMENT_MILESTONES[4] && currentRosterSize >= MAX_ROSTER_SIZE;
}

/**
 * Retire a character from the roster
 * Returns the retired character for potential farewell message
 */
export function retireCharacter(
  roster: Character[],
  characterId: string
): Character | null {
  const index = roster.findIndex(char => char.id === characterId);
  
  if (index === -1) {
    return null;
  }
  
  const [retired] = roster.splice(index, 1);
  return retired;
}

/**
 * Get recruitment status summary
 */
export function getRecruitmentStatus(
  totalBattleVictories: number,
  currentRosterSize: number
): {
  milestonesReached: number;
  totalMilestones: number;
  canRecruit: boolean;
  needsRetirement: boolean;
  nextMilestone: number | null;
  battlesRemaining: number | null;
} {
  return {
    milestonesReached: getAvailableRecruitments(totalBattleVictories),
    totalMilestones: RECRUITMENT_MILESTONES.length,
    canRecruit: canRecruitCharacter(totalBattleVictories, currentRosterSize),
    needsRetirement: needsRetirement(totalBattleVictories, currentRosterSize),
    nextMilestone: getNextRecruitmentMilestone(totalBattleVictories),
    battlesRemaining: getBattlesUntilNextRecruitment(totalBattleVictories)
  };
}

/**
 * Check if a battle victory should count toward recruitment
 * (Excludes very early/trivial stages)
 */
export function shouldCountForRecruitment(stageNumber: number): boolean {
  return stageNumber >= MIN_STAGE_FOR_RECRUITMENT;
}

/**
 * Get a formatted message for recruitment unlock
 */
export function getRecruitmentUnlockMessage(milestone: number, milestonesReached: number): string {
  const ordinals = ['', '1st', '2nd', '3rd', '4th', '5th'];
  const ordinal = ordinals[milestonesReached] || `${milestonesReached}th`;
  
  if (milestonesReached === 5) {
    return `🎉 ${milestone} victories! ${ordinal} recruitment unlocked! (You may need to retire a character to make room)`;
  }
  
  return `🎉 ${milestone} victories! ${ordinal} recruitment unlocked! You can now add a new character to your roster.`;
}
