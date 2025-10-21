/**
 * Enemy System Type Definitions
 */

import type { CharacterStats } from './character';
import type { StatusEffect } from './status';

export type EnemyTier = 
  | 1  // Slimes, Rats, Bats (Stages 1-10)
  | 2  // Goblins, Wolves, Skeletons (Stages 11-20)
  | 3  // Orcs, Trolls, Wraiths (Stages 21-30)
  | 4  // Demons, Dragons, Elementals (Stages 31-50)
  | 5  // Ancient Beasts, Titans (Stages 51-70)
  | 6  // Demigods, Celestials (Stages 71-90)
  | 7; // Gods, Primordials (Stages 91-100)

export type EnemyRole =
  | 'tank'
  | 'dps'
  | 'mage'
  | 'support'
  | 'boss';

export interface EnemyTemplate {
  id: string;
  name: string;
  tier: EnemyTier;
  role: EnemyRole;
  
  // Base stats (at tier level)
  baseStats: CharacterStats;
  
  // Stat scaling
  statGrowthPerLevel: Partial<CharacterStats>;
  
  // Abilities (by ID)
  abilities: string[];
  
  // AP system
  apRegen: number;
  maxAp: number;
  
  // Boss-specific
  isBoss: boolean;
  bossMultiplier?: number;      // Stat multiplier for bosses (typically 2.5)
  
  // Summon mechanics (for bosses)
  canSummon?: boolean;
  summonPool?: string[];        // Enemy IDs that can be summoned
  summonTriggers?: {
    type: 'hp-threshold' | 'turn-interval';
    value: number;              // HP % or turn count
  }[];
  maxSummons?: number;          // Max simultaneous summons (typically 2)
  
  // Loot
  equipmentDropChance: number;  // 0-1, max 1 item per enemy
  
  // Flavor
  description?: string;
}

export interface Enemy {
  // Identity
  id: string;                   // Unique instance ID
  templateId: string;           // Reference to EnemyTemplate
  name: string;
  tier: EnemyTier;
  role: EnemyRole;
  
  // Level
  level: number;
  
  // Combat stats
  stats: CharacterStats;
  currentAp: number;
  statusEffects: StatusEffect[];
  
  // Abilities
  abilities: string[];          // Ability IDs
  
  // Boss state
  isBoss: boolean;
  hasUsedSummon?: boolean[];    // Track which summon triggers used
  currentSummons?: string[];    // IDs of currently summoned minions
  
  // Flags
  isAlive: boolean;
  isSummoned: boolean;          // True if summoned by boss
}
