/**
 * Statistical Formula Utilities
 * All game formulas for damage, stats, XP, etc.
 */

import type { CharacterStats } from '../types';

/**
 * Calculate XP required for a given level
 * Uses exponential growth: 100 * level^2.5
 */
export function calculateXpForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.floor(100 * Math.pow(level, 2.5));
}

/**
 * Calculate total XP needed from level 1 to target level
 */
export function calculateTotalXpToLevel(targetLevel: number): number {
  let totalXp = 0;
  for (let level = 2; level <= targetLevel; level++) {
    totalXp += calculateXpForLevel(level);
  }
  return totalXp;
}

/**
 * Calculate character stats at a given level
 * Formula: baseStat + (level - 1) * growthRate
 */
export function calculateStatsAtLevel(
  baseStats: CharacterStats,
  statGrowth: Omit<CharacterStats, 'hp' | 'maxHp'> & { maxHp: number },
  level: number
): CharacterStats {
  const levelMultiplier = level - 1;
  
  return {
    hp: baseStats.maxHp + Math.floor(statGrowth.maxHp * levelMultiplier), // Will be set to maxHp
    maxHp: baseStats.maxHp + Math.floor(statGrowth.maxHp * levelMultiplier),
    atk: baseStats.atk + Math.floor(statGrowth.atk * levelMultiplier),
    def: baseStats.def + Math.floor(statGrowth.def * levelMultiplier),
    mag: baseStats.mag + Math.floor(statGrowth.mag * levelMultiplier),
    res: baseStats.res + Math.floor(statGrowth.res * levelMultiplier),
    spd: baseStats.spd + Math.floor(statGrowth.spd * levelMultiplier),
    crt: Math.min(100, baseStats.crt + statGrowth.crt * levelMultiplier),
    eva: Math.min(95, baseStats.eva + statGrowth.eva * levelMultiplier),
    acc: Math.min(100, baseStats.acc + statGrowth.acc * levelMultiplier),
  };
}

/**
 * Calculate physical damage
 * Formula: (ATK * multiplier) - (targetDEF * 0.5)
 */
export function calculatePhysicalDamage(
  attackerAtk: number,
  targetDef: number,
  multiplier: number,
  flatDamage: number = 0
): number {
  const baseDamage = (attackerAtk * multiplier) - (targetDef * 0.5) + flatDamage;
  return Math.max(1, Math.floor(baseDamage)); // Minimum 1 damage
}

/**
 * Calculate magical damage
 * Formula: (MAG * multiplier) - (targetRES * 0.5)
 */
export function calculateMagicalDamage(
  attackerMag: number,
  targetRes: number,
  multiplier: number,
  flatDamage: number = 0
): number {
  const baseDamage = (attackerMag * multiplier) - (targetRes * 0.5) + flatDamage;
  return Math.max(1, Math.floor(baseDamage)); // Minimum 1 damage
}

/**
 * Calculate healing amount
 * Formula: MAG * multiplier + flatHealing
 */
export function calculateHealing(
  healerMag: number,
  multiplier: number,
  flatHealing: number = 0
): number {
  return Math.max(1, Math.floor(healerMag * multiplier + flatHealing));
}

/**
 * Calculate hit chance
 * Formula: clamp(ACC - (EVA * 0.5), 5, 95)
 */
export function calculateHitChance(attackerAcc: number, targetEva: number): number {
  const hitChance = attackerAcc - (targetEva * 0.5);
  return Math.max(5, Math.min(95, hitChance));
}

/**
 * Check if attack is a critical hit
 * Returns true if random roll <= critical chance
 */
export function isCriticalHit(criticalChance: number, randomValue: number): boolean {
  return randomValue <= criticalChance;
}

/**
 * Apply critical multiplier to damage
 */
export function applyCriticalMultiplier(damage: number): number {
  return Math.floor(damage * 2.0);
}

/**
 * Apply optional damage variance (±10%)
 */
export function applyDamageVariance(damage: number, variance: number): number {
  const varianceMultiplier = 1 + (variance * 0.2 - 0.1); // Maps [0,1] to [0.9, 1.1]
  return Math.floor(damage * varianceMultiplier);
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Calculate enemy stat scaling
 * Formula: baseStat * (1.15 ^ stage)
 */
export function calculateEnemyStatScaling(baseStat: number, stage: number): number {
  return Math.floor(baseStat * Math.pow(1.15, stage));
}

/**
 * Apply boss multiplier to stats
 */
export function applyBossMultiplier(stat: number, multiplier: number = 2.5): number {
  return Math.floor(stat * multiplier);
}
