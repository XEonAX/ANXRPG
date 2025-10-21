/**
 * Character System Type Definitions
 */

import type { StatusEffect } from './status';

export type CharacterTypeName = 
  | 'Alpha'    // Paladin
  | 'Beta'     // Rogue
  | 'Gamma'    // Mage
  | 'Delta'    // Warrior
  | 'Epsilon'  // Cleric
  | 'Zeta';    // Berserker

export interface CharacterStats {
  hp: number;           // Current HP
  maxHp: number;        // Maximum HP
  atk: number;          // Attack (physical damage)
  def: number;          // Defense (physical reduction)
  mag: number;          // Magic (magical damage)
  res: number;          // Resistance (magical reduction)
  spd: number;          // Speed (turn order)
  crt: number;          // Critical hit chance %
  eva: number;          // Evasion/dodge chance %
  acc: number;          // Accuracy/hit chance %
}

export interface CharacterType {
  id: CharacterTypeName;
  name: string;
  description: string;
  role: string;
  
  // Base stats at level 1
  baseStats: CharacterStats;
  
  // Stat growth per level
  statGrowth: Omit<CharacterStats, 'hp' | 'maxHp'> & { maxHp: number };
  
  // AP system
  baseApRegen: number;      // AP regeneration per turn (3-6)
  maxAp: number;            // Maximum AP pool (typically 10)
  
  // Starting abilities (by ID)
  startingAbilities: string[];
}

export interface Character {
  // Identity
  id: string;                    // Unique instance ID
  type: CharacterTypeName;
  name: string;                  // Can be custom or generated
  
  // Level and progression
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  skillPoints: number;           // Unspent skill points
  
  // Current stats (base + equipment + buffs)
  stats: CharacterStats;
  
  // Combat state
  currentAp: number;
  statusEffects: StatusEffect[];
  
  // Abilities
  unlockedAbilities: string[];   // Ability IDs
  equippedAbilities: string[];   // Max 4 initially, can expand via skill tree
  
  // Equipment (slot name -> equipment ID)
  equipment: {
    mainHand: string | null;
    offHand: string | null;
    head: string | null;
    chest: string | null;
    legs: string | null;
    neck: string | null;
    wrist1: string | null;
    wrist2: string | null;
  };
  
  // Skill tree progression
  skillTreeNodes: {
    nodeId: string;
    pointsInvested: number;
  }[];
  
  // Flags
  isAlive: boolean;
  isInActiveTeam: boolean;       // Active vs reserve
}
