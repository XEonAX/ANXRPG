/**
 * Ability System Type Definitions
 */

import type { StatusEffect } from './status';

export type TargetType = 
  | 'self'
  | 'single-ally'
  | 'single-enemy'
  | 'all-allies'
  | 'all-enemies'
  | 'aoe-enemies'      // Area of effect on enemies
  | 'aoe-allies';      // Area of effect on allies

export type DamageType = 
  | 'physical'
  | 'magical'
  | 'true';            // Ignores defense/resistance

export interface AbilityEffect {
  // Damage/healing
  damageMultiplier?: number;       // Multiplies ATK or MAG
  damageType?: DamageType;
  flatDamage?: number;             // Fixed damage value
  healingMultiplier?: number;      // Multiplies MAG for healing
  flatHealing?: number;            // Fixed healing value
  
  // Status effects to apply
  statusEffects?: {
    effect: StatusEffect;
    chance: number;               // 0-100, probability to apply
  }[];
  
  // Special effects
  lifesteal?: number;              // % of damage dealt returned as HP
  apRestore?: number;              // Restore AP to self
  apDrain?: number;                // Drain AP from target
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  
  // Cost and targeting
  apCost: number;
  targetType: TargetType;
  
  // Hit mechanics
  guaranteedHit: boolean;          // If true, ignores ACC/EVA
  
  // Effects
  effects: AbilityEffect;
  
  // Unlock requirements
  requiredLevel?: number;
  requiredSkillNode?: string;
  
  // Character type restriction (optional)
  characterTypes?: string[];       // If set, only these types can use it
  
  // Visual/flavor
  flavorText?: string;
}
