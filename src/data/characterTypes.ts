/**
 * Character Type Definitions and Base Stats
 * Defines all 6 character types with their base stats and growth rates
 */

import type { CharacterType, CharacterTypeName } from '../types';

/**
 * Character type definitions for all 6 types
 * Stats are balanced according to character roles
 */
export const CHARACTER_TYPES: Record<CharacterTypeName, CharacterType> = {
  Alpha: {
    id: 'Alpha',
    name: 'Alpha (Paladin)',
    description: 'Tank/Off-Healer - High HP and DEF, defensive abilities with minor healing',
    role: 'Tank/Off-Healer',
    
    baseStats: {
      hp: 120,
      maxHp: 120,
      atk: 30,
      def: 50,
      mag: 25,
      res: 40,
      spd: 40,
      crt: 5,
      eva: 5,
      acc: 85,
    },
    
    statGrowth: {
      maxHp: 15,
      atk: 4,
      def: 8,
      mag: 3,
      res: 6,
      spd: 2,
      crt: 0.5,
      eva: 0.3,
      acc: 0.5,
    },
    
    baseApRegen: 3,
    maxAp: 10,
    
    startingAbilities: ['alpha_strike'], // Will be defined in Phase 3
  },
  
  Beta: {
    id: 'Beta',
    name: 'Beta (Rogue)',
    description: 'Critical Damage Dealer - Very high SPD and CRT, fast striker with evasion',
    role: 'Critical DPS',
    
    baseStats: {
      hp: 70,
      maxHp: 70,
      atk: 45,
      def: 25,
      mag: 20,
      res: 25,
      spd: 70,
      crt: 20,
      eva: 25,
      acc: 90,
    },
    
    statGrowth: {
      maxHp: 8,
      atk: 7,
      def: 3,
      mag: 2,
      res: 3,
      spd: 10,
      crt: 2,
      eva: 1.5,
      acc: 0.8,
    },
    
    baseApRegen: 6,
    maxAp: 10,
    
    startingAbilities: ['beta_slash'],
  },
  
  Gamma: {
    id: 'Gamma',
    name: 'Gamma (Mage)',
    description: 'AoE/Elemental Caster - High MAG, area damage and elemental effects',
    role: 'AoE Mage',
    
    baseStats: {
      hp: 60,
      maxHp: 60,
      atk: 20,
      def: 20,
      mag: 55,
      res: 45,
      spd: 50,
      crt: 10,
      eva: 10,
      acc: 95,
    },
    
    statGrowth: {
      maxHp: 6,
      atk: 2,
      def: 2,
      mag: 9,
      res: 7,
      spd: 4,
      crt: 1,
      eva: 0.8,
      acc: 0.3,
    },
    
    baseApRegen: 4,
    maxAp: 10,
    
    startingAbilities: ['gamma_bolt'],
  },
  
  Delta: {
    id: 'Delta',
    name: 'Delta (Warrior)',
    description: 'Physical Damage Dealer - High HP and ATK, reliable physical damage output',
    role: 'Physical DPS',
    
    baseStats: {
      hp: 100,
      maxHp: 100,
      atk: 50,
      def: 35,
      mag: 15,
      res: 30,
      spd: 55,
      crt: 12,
      eva: 8,
      acc: 88,
    },
    
    statGrowth: {
      maxHp: 12,
      atk: 8,
      def: 5,
      mag: 1,
      res: 4,
      spd: 5,
      crt: 1.5,
      eva: 0.5,
      acc: 0.7,
    },
    
    baseApRegen: 4,
    maxAp: 10,
    
    startingAbilities: ['delta_slash'],
  },
  
  Epsilon: {
    id: 'Epsilon',
    name: 'Epsilon (Cleric)',
    description: 'Pure Healer/Support - Medium stats, healing and buff support',
    role: 'Healer/Support',
    
    baseStats: {
      hp: 80,
      maxHp: 80,
      atk: 25,
      def: 30,
      mag: 50,
      res: 50,
      spd: 50,
      crt: 8,
      eva: 12,
      acc: 92,
    },
    
    statGrowth: {
      maxHp: 10,
      atk: 3,
      def: 4,
      mag: 8,
      res: 8,
      spd: 4,
      crt: 0.8,
      eva: 1,
      acc: 0.5,
    },
    
    baseApRegen: 5,
    maxAp: 10,
    
    startingAbilities: ['epsilon_smite'],
  },
  
  Zeta: {
    id: 'Zeta',
    name: 'Zeta (Berserker)',
    description: 'High Risk/High Reward - Massive damage with self-harm mechanics',
    role: 'Berserker DPS',
    
    baseStats: {
      hp: 90,
      maxHp: 90,
      atk: 60,
      def: 20,
      mag: 30,
      res: 25,
      spd: 60,
      crt: 18,
      eva: 15,
      acc: 80,
    },
    
    statGrowth: {
      maxHp: 10,
      atk: 10,
      def: 2,
      mag: 4,
      res: 3,
      spd: 7,
      crt: 2.5,
      eva: 1.2,
      acc: 0.6,
    },
    
    baseApRegen: 5,
    maxAp: 10,
    
    startingAbilities: ['zeta_rage'],
  },
};

/**
 * Get character type by name
 */
export function getCharacterType(typeName: CharacterTypeName): CharacterType {
  return CHARACTER_TYPES[typeName];
}

/**
 * Get all character type names
 */
export function getAllCharacterTypes(): CharacterTypeName[] {
  return Object.keys(CHARACTER_TYPES) as CharacterTypeName[];
}
