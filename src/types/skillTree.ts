/**
 * Skill Tree System Type Definitions
 * 
 * Each character type has ~20 skill tree nodes arranged in a linear progression path.
 * Nodes provide EITHER stat bonuses OR ability unlocks (never both).
 * Some nodes require multiple skill points to unlock.
 */

import type { CharacterTypeName } from './character';

export type SkillNodeType = 'stat' | 'ability' | 'abilitySlot';

/**
 * Stat bonuses that can be granted by skill nodes
 */
export interface SkillNodeStatBonus {
  maxHp?: number;
  atk?: number;
  def?: number;
  mag?: number;
  res?: number;
  spd?: number;
  crt?: number;     // Percentage points
  eva?: number;     // Percentage points
  acc?: number;     // Percentage points
}

/**
 * Skill tree node definition
 */
export interface SkillNode {
  id: string;                          // Unique node ID (e.g., 'alpha_node_1')
  name: string;                        // Display name
  description: string;                 // What this node does
  
  // Node type and effect
  type: SkillNodeType;
  
  // For 'stat' type nodes
  statBonus?: SkillNodeStatBonus;
  
  // For 'ability' type nodes
  abilityId?: string;                  // Ability ID to unlock
  
  // For 'abilitySlot' type nodes (expands equipped ability slots)
  abilitySlotIncrease?: number;        // Number of additional slots (typically 1)
  
  // Requirements
  requiredLevel: number;               // Minimum character level
  requiredNodes: string[];             // Prerequisite node IDs (must be unlocked first)
  skillPointCost: number;              // Skill points needed to unlock (1-3 typically)
  
  // Visual positioning (for future UI)
  row: number;                         // Tier/row in skill tree
  column: number;                      // Position within row
}

/**
 * Complete skill tree for a character type
 */
export interface SkillTree {
  characterType: CharacterTypeName;
  nodes: SkillNode[];
  maxAbilitySlots: number;             // Maximum ability slots achievable (typically 6-7)
}

/**
 * Character's progress in a skill tree
 * (Stored in Character.skillTreeNodes array)
 */
export interface SkillNodeProgress {
  nodeId: string;
  pointsInvested: number;              // 0 to skillPointCost (unlocked when equal)
}

/**
 * Helper type for calculating total bonuses from skill tree
 */
export interface SkillTreeBonuses {
  stats: SkillNodeStatBonus;
  unlockedAbilities: string[];
  additionalAbilitySlots: number;
}
