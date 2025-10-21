/**
 * Damage Calculation System
 * 
 * Handles all damage and healing calculations according to game formulas:
 * - Physical: (ATK * mult) - (DEF * 0.5)
 * - Magical: (MAG * mult) - (RES * 0.5)
 * - Critical: Multiply final damage by 2.0
 * - Hit/Miss: clamp(ACC - (EVA * 0.5), 5, 95)
 * - Optional variance: ±10%
 */

import type { Character } from '../types/character';
import type { Enemy } from '../types/enemy';
import type { Ability } from '../types/ability';
import type { DamageResult, HealingResult } from '../types/combat';
import { randomInt, randomFloat } from '../utils/random';

export interface DamageCalculationOptions {
  enableVariance?: boolean;       // Enable ±10% random variance
  guaranteedHit?: boolean;        // Override hit/miss calculation
  criticalOverride?: boolean;     // Force critical hit
}

/**
 * Calculate physical damage
 */
export function calculatePhysicalDamage(
  attackerAtk: number,
  targetDef: number,
  multiplier: number = 1.0,
  options: DamageCalculationOptions = {}
): number {
  const baseDamage = (attackerAtk * multiplier) - (targetDef * 0.5);
  let damage = Math.max(1, baseDamage); // Minimum 1 damage
  
  // Apply variance if enabled
  if (options.enableVariance) {
    const variance = randomFloat(0.9, 1.1);
    damage = Math.floor(damage * variance);
  }
  
  return Math.max(1, Math.floor(damage));
}

/**
 * Calculate magical damage
 */
export function calculateMagicalDamage(
  attackerMag: number,
  targetRes: number,
  multiplier: number = 1.0,
  options: DamageCalculationOptions = {}
): number {
  const baseDamage = (attackerMag * multiplier) - (targetRes * 0.5);
  let damage = Math.max(1, baseDamage); // Minimum 1 damage
  
  // Apply variance if enabled
  if (options.enableVariance) {
    const variance = randomFloat(0.9, 1.1);
    damage = Math.floor(damage * variance);
  }
  
  return Math.max(1, Math.floor(damage));
}

/**
 * Calculate hit chance based on accuracy and evasion
 */
export function calculateHitChance(accuracy: number, evasion: number): number {
  const hitChance = accuracy - (evasion * 0.5);
  return Math.max(5, Math.min(95, hitChance));
}

/**
 * Check if attack hits
 */
export function checkHit(
  accuracy: number,
  evasion: number,
  guaranteedHit: boolean = false
): boolean {
  if (guaranteedHit) {
    return true;
  }
  
  const hitChance = calculateHitChance(accuracy, evasion);
  const roll = randomInt(1, 100);
  return roll <= hitChance;
}

/**
 * Check if attack is critical
 */
export function checkCritical(
  criticalChance: number,
  forceCritical: boolean = false
): boolean {
  if (forceCritical) {
    return true;
  }
  
  const roll = randomInt(1, 100);
  return roll <= criticalChance;
}

/**
 * Apply critical multiplier to damage
 */
export function applyCriticalMultiplier(damage: number): number {
  return Math.floor(damage * 2.0);
}

/**
 * Calculate damage from attacker to target using an ability
 */
export function calculateAbilityDamage(
  attacker: Character | Enemy,
  target: Character | Enemy,
  ability: Ability,
  options: DamageCalculationOptions = {}
): DamageResult {
  const targetId = target.id;
  const targetName = target.name;
  
  // Check hit/miss first
  const hits = checkHit(
    attacker.stats.acc,
    target.stats.eva,
    options.guaranteedHit ?? ability.guaranteedHit
  );
  
  if (!hits) {
    return {
      targetId,
      targetName,
      damage: 0,
      isCritical: false,
      isMiss: true,
      damageType: ability.effects.damageType || 'physical',
    };
  }
  
  // Calculate base damage
  let damage = 0;
  const damageType = ability.effects.damageType || 'physical';
  
  if (damageType === 'physical') {
    damage = calculatePhysicalDamage(
      attacker.stats.atk,
      target.stats.def,
      ability.effects.damageMultiplier || 0,
      options
    );
  } else if (damageType === 'magical') {
    damage = calculateMagicalDamage(
      attacker.stats.mag,
      target.stats.res,
      ability.effects.damageMultiplier || 0,
      options
    );
  } else if (damageType === 'true') {
    // True damage ignores defense
    damage = Math.floor(
      attacker.stats.atk * (ability.effects.damageMultiplier || 1.0)
    );
  }
  
  // Add flat damage if specified
  if (ability.effects.flatDamage) {
    damage += ability.effects.flatDamage;
  }
  
  // Check for critical hit
  const isCritical = checkCritical(
    attacker.stats.crt,
    options.criticalOverride
  );
  
  if (isCritical) {
    damage = applyCriticalMultiplier(damage);
  }
  
  // Collect status effects that will be applied
  const statusEffectsApplied = ability.effects.statusEffects
    ?.map(se => se.effect.name);
  
  return {
    targetId,
    targetName,
    damage: Math.max(1, damage),
    isCritical,
    isMiss: false,
    damageType,
    statusEffectsApplied,
  };
}

/**
 * Calculate healing from caster to target
 */
export function calculateHealing(
  _caster: Character | Enemy,
  target: Character | Enemy,
  baseHealing: number,
  multiplier: number = 1.0,
  options: DamageCalculationOptions = {}
): HealingResult {
  let healing = Math.floor(baseHealing * multiplier);
  
  // Apply variance if enabled
  if (options.enableVariance) {
    const variance = randomFloat(0.9, 1.1);
    healing = Math.floor(healing * variance);
  }
  
  healing = Math.max(1, healing);
  
  // Calculate overheal
  const targetMaxHp = target.stats.hp;
  const targetCurrentHp = 'currentHp' in target ? (target as Character).stats.hp : targetMaxHp;
  const actualHealing = Math.min(healing, targetMaxHp - targetCurrentHp);
  const overheal = healing - actualHealing;
  
  return {
    targetId: target.id,
    targetName: target.name,
    healing: actualHealing,
    overheal: Math.max(0, overheal),
  };
}

/**
 * Calculate lifesteal healing (percentage of damage dealt)
 */
export function calculateLifestealHealing(
  damage: number,
  lifestealPercent: number
): number {
  return Math.floor(damage * (lifestealPercent / 100));
}

/**
 * Calculate damage for area of effect abilities
 */
export function calculateAoEDamage(
  attacker: Character | Enemy,
  targets: (Character | Enemy)[],
  ability: Ability,
  options: DamageCalculationOptions = {}
): DamageResult[] {
  return targets.map(target => 
    calculateAbilityDamage(attacker, target, ability, options)
  );
}

/**
 * Calculate healing for area of effect abilities
 */
export function calculateAoEHealing(
  caster: Character | Enemy,
  targets: (Character | Enemy)[],
  baseHealing: number,
  multiplier: number = 1.0,
  options: DamageCalculationOptions = {}
): HealingResult[] {
  return targets.map(target => 
    calculateHealing(caster, target, baseHealing, multiplier, options)
  );
}
