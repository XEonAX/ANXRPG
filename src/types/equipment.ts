/**
 * Equipment System Type Definitions
 */

import type { StatModifierType } from './status';

export type EquipmentSlot = 
  | 'mainHand'
  | 'offHand'
  | 'head'
  | 'chest'
  | 'legs'
  | 'neck'
  | 'wrist1'
  | 'wrist2';

export type EquipmentType =
  | 'weapon-single'    // Single-handed weapon
  | 'weapon-dual'      // Two-handed weapon (occupies both hands)
  | 'shield'
  | 'helmet'
  | 'armor'
  | 'pants'
  | 'amulet'
  | 'bracer';

export type EquipmentRarity = 
  | 'basic'
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'legendary'
  | 'mythic';

export interface EquipmentStatBonus {
  stat: StatModifierType;
  value: number;
  isPercentage?: boolean;    // True for % bonus, false for flat
}

export interface Equipment {
  id: string;
  name: string;
  description: string;
  
  // Equipment properties
  type: EquipmentType;
  slot: EquipmentSlot;
  rarity: EquipmentRarity;
  
  // Level requirement
  level: number;             // Must match character level to equip
  
  // Stat bonuses
  statBonuses: EquipmentStatBonus[];
  
  // Special effects (optional)
  specialEffects?: {
    description: string;
    effectId?: string;       // For programmatic effects
  }[];
  
  // Visual/flavor
  flavorText?: string;
}

export interface EquipmentTemplate {
  baseType: EquipmentType;
  slot: EquipmentSlot;
  namePrefixes: string[];     // "Rusty", "Iron", "Mythril"
  nameSuffixes: string[];     // "Sword", "Blade", "Greataxe"
  
  // Stat scaling per level
  statScaling: {
    stat: StatModifierType;
    baseValue: number;        // At level 1
    growthRate: number;       // Per level increase
  }[];
}
