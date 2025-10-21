/**
 * Character System
 * Character creation, stat management, and progression
 */

import type { Character, CharacterTypeName, CharacterStats } from '../types';
import { CHARACTER_TYPES } from '../data/characterTypes';
import { calculateStatsAtLevel, calculateXpForLevel } from '../utils/formulas';
import { generateId } from '../utils/random';

/**
 * Create a new character instance
 */
export function createCharacter(
  typeName: CharacterTypeName,
  level: number = 1,
  customName?: string
): Character {
  const characterType = CHARACTER_TYPES[typeName];
  const stats = calculateStatsAtLevel(
    characterType.baseStats,
    characterType.statGrowth,
    level
  );
  
  return {
    id: generateId(),
    type: typeName,
    name: customName || characterType.name,
    
    level,
    currentXp: 0,
    xpToNextLevel: calculateXpForLevel(level + 1),
    skillPoints: level - 1, // 1 skill point per level after level 1
    
    stats: { ...stats },
    
    currentAp: characterType.baseApRegen, // Start with base AP
    statusEffects: [],
    
    unlockedAbilities: [...characterType.startingAbilities],
    equippedAbilities: [...characterType.startingAbilities],
    
    equipment: {
      mainHand: null,
      offHand: null,
      head: null,
      chest: null,
      legs: null,
      neck: null,
      wrist1: null,
      wrist2: null,
    },
    
    skillTreeNodes: [],
    
    isAlive: true,
    isInActiveTeam: false,
  };
}

/**
 * Calculate character's current stats including equipment bonuses
 * This will be expanded when equipment system is implemented
 */
export function calculateCurrentStats(character: Character): CharacterStats {
  // TODO: Add equipment stat bonuses in Phase 4
  // TODO: Add status effect modifiers in Phase 5
  return { ...character.stats };
}

/**
 * Regenerate AP for a character at turn start
 */
export function regenerateAp(character: Character): void {
  const characterType = CHARACTER_TYPES[character.type];
  const newAp = Math.min(
    characterType.maxAp,
    character.currentAp + characterType.baseApRegen
  );
  character.currentAp = newAp;
}

/**
 * Consume AP for an ability
 * Returns true if successful, false if insufficient AP
 */
export function consumeAp(character: Character, amount: number): boolean {
  if (character.currentAp < amount) {
    return false;
  }
  character.currentAp -= amount;
  return true;
}

/**
 * Restore AP to a character
 */
export function restoreAp(character: Character, amount: number): void {
  const characterType = CHARACTER_TYPES[character.type];
  character.currentAp = Math.min(characterType.maxAp, character.currentAp + amount);
}

/**
 * Deal damage to a character
 * Returns true if character died
 */
export function damageCharacter(character: Character, damage: number): boolean {
  character.stats.hp = Math.max(0, character.stats.hp - damage);
  
  if (character.stats.hp === 0) {
    character.isAlive = false;
    return true;
  }
  
  return false;
}

/**
 * Heal a character
 * Returns actual healing amount (capped at maxHp)
 */
export function healCharacter(character: Character, healing: number): number {
  const oldHp = character.stats.hp;
  character.stats.hp = Math.min(character.stats.maxHp, character.stats.hp + healing);
  return character.stats.hp - oldHp;
}

/**
 * Award XP to a character and handle level ups
 * Returns number of levels gained
 */
export function awardXp(character: Character, xp: number): number {
  character.currentXp += xp;
  let levelsGained = 0;
  
  while (character.currentXp >= character.xpToNextLevel) {
    character.currentXp -= character.xpToNextLevel;
    character.level++;
    levelsGained++;
    
    // Level up: increase stats
    const characterType = CHARACTER_TYPES[character.type];
    const newStats = calculateStatsAtLevel(
      characterType.baseStats,
      characterType.statGrowth,
      character.level
    );
    
    // Update stats and fully heal
    const hpPercentage = character.stats.hp / character.stats.maxHp;
    character.stats = { ...newStats };
    character.stats.hp = Math.floor(character.stats.maxHp * hpPercentage); // Maintain HP %
    
    // Award skill point
    character.skillPoints++;
    
    // Update XP requirement for next level
    character.xpToNextLevel = calculateXpForLevel(character.level + 1);
  }
  
  return levelsGained;
}

/**
 * Revive a character (for reserve swap)
 */
export function reviveCharacter(character: Character): void {
  if (!character.isAlive && character.stats.hp === 0) {
    character.stats.hp = 1; // Revive with 1 HP
    character.isAlive = true;
  }
}

/**
 * Reset character to full HP and AP (for post-battle or debugging)
 */
export function fullyRestoreCharacter(character: Character): void {
  character.stats.hp = character.stats.maxHp;
  const characterType = CHARACTER_TYPES[character.type];
  character.currentAp = characterType.maxAp;
  character.isAlive = true;
}

/**
 * Check if character can use an ability
 */
export function canUseAbility(character: Character, abilityId: string, apCost: number): boolean {
  return (
    character.isAlive &&
    character.equippedAbilities.includes(abilityId) &&
    character.currentAp >= apCost
  );
}
