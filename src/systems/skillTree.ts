/**
 * Skill Tree System
 * 
 * Handles skill node unlocking, prerequisite checking, and bonus calculation.
 */

import type { Character } from '../types/character';
import type { SkillNode, SkillTreeBonuses, SkillNodeStatBonus, SkillNodeProgress } from '../types/skillTree';
import { getSkillTree, getSkillNode } from '../data/skillTrees';

/**
 * Check if a character can unlock a specific skill node
 */
export function canUnlockNode(character: Character, nodeId: string): {
  canUnlock: boolean;
  reason?: string;
} {
  const node = getSkillNode(character.type, nodeId);
  
  if (!node) {
    return { canUnlock: false, reason: 'Node not found' };
  }
  
  // Check if already fully unlocked
  const progress = character.skillTreeNodes.find(p => p.nodeId === nodeId);
  if (progress && progress.pointsInvested >= node.skillPointCost) {
    return { canUnlock: false, reason: 'Already unlocked' };
  }
  
  // Check level requirement
  if (character.level < node.requiredLevel) {
    return { canUnlock: false, reason: `Requires level ${node.requiredLevel}` };
  }
  
  // Check skill points available
  const pointsNeeded = progress 
    ? node.skillPointCost - progress.pointsInvested 
    : node.skillPointCost;
    
  if (character.skillPoints < pointsNeeded) {
    return { canUnlock: false, reason: `Requires ${pointsNeeded} skill point(s)` };
  }
  
  // Check prerequisite nodes
  for (const requiredNodeId of node.requiredNodes) {
    const reqProgress = character.skillTreeNodes.find(p => p.nodeId === requiredNodeId);
    const reqNode = getSkillNode(character.type, requiredNodeId);
    
    if (!reqProgress || !reqNode || reqProgress.pointsInvested < reqNode.skillPointCost) {
      return { canUnlock: false, reason: `Requires prerequisite node: ${reqNode?.name || requiredNodeId}` };
    }
  }
  
  return { canUnlock: true };
}

/**
 * Unlock a skill node (invest 1 skill point)
 * Returns true if successfully unlocked, false otherwise
 */
export function unlockSkillNode(character: Character, nodeId: string): boolean {
  const check = canUnlockNode(character, nodeId);
  if (!check.canUnlock) {
    return false;
  }
  
  const node = getSkillNode(character.type, nodeId);
  if (!node) {
    return false;
  }
  
  // Find existing progress or create new
  let progress = character.skillTreeNodes.find(p => p.nodeId === nodeId);
  
  if (!progress) {
    progress = { nodeId, pointsInvested: 0 };
    character.skillTreeNodes.push(progress);
  }
  
  // Invest 1 skill point
  progress.pointsInvested++;
  character.skillPoints--;
  
  // If node is now fully unlocked, add ability to unlocked list if it's an ability node
  if (progress.pointsInvested >= node.skillPointCost && node.type === 'ability' && node.abilityId) {
    if (!character.unlockedAbilities.includes(node.abilityId)) {
      character.unlockedAbilities.push(node.abilityId);
    }
  }
  
  return true;
}

/**
 * Get all nodes that can currently be unlocked by the character
 */
export function getAvailableNodes(character: Character): SkillNode[] {
  const tree = getSkillTree(character.type);
  if (!tree) {
    return [];
  }
  
  return tree.nodes.filter(node => {
    const check = canUnlockNode(character, node.id);
    return check.canUnlock;
  });
}

/**
 * Get all nodes that are fully unlocked
 */
export function getUnlockedNodes(character: Character): SkillNode[] {
  const tree = getSkillTree(character.type);
  if (!tree) {
    return [];
  }
  
  return tree.nodes.filter(node => {
    const progress = character.skillTreeNodes.find(p => p.nodeId === node.id);
    return progress && progress.pointsInvested >= node.skillPointCost;
  });
}

/**
 * Calculate total bonuses from all unlocked skill tree nodes
 */
export function calculateSkillTreeBonuses(character: Character): SkillTreeBonuses {
  const bonuses: SkillTreeBonuses = {
    stats: {},
    unlockedAbilities: [],
    additionalAbilitySlots: 0
  };
  
  const tree = getSkillTree(character.type);
  if (!tree) {
    return bonuses;
  }
  
  // Process each unlocked node
  for (const node of tree.nodes) {
    const progress = character.skillTreeNodes.find(p => p.nodeId === node.id);
    
    // Only apply bonuses if node is fully unlocked
    if (!progress || progress.pointsInvested < node.skillPointCost) {
      continue;
    }
    
    if (node.type === 'stat' && node.statBonus) {
      // Accumulate stat bonuses
      for (const [stat, value] of Object.entries(node.statBonus)) {
        const currentValue = bonuses.stats[stat as keyof SkillNodeStatBonus] || 0;
        bonuses.stats[stat as keyof SkillNodeStatBonus] = currentValue + value;
      }
    } else if (node.type === 'ability' && node.abilityId) {
      // Add ability to unlocked list
      if (!bonuses.unlockedAbilities.includes(node.abilityId)) {
        bonuses.unlockedAbilities.push(node.abilityId);
      }
    } else if (node.type === 'abilitySlot' && node.abilitySlotIncrease) {
      // Add ability slot increases
      bonuses.additionalAbilitySlots += node.abilitySlotIncrease;
    }
  }
  
  return bonuses;
}

/**
 * Get maximum number of ability slots for a character (base 4 + skill tree bonuses)
 */
export function getMaxAbilitySlots(character: Character): number {
  const bonuses = calculateSkillTreeBonuses(character);
  return 4 + bonuses.additionalAbilitySlots; // Base 4 + skill tree additions
}

/**
 * Get all abilities that are unlocked through skill tree
 */
export function getSkillTreeAbilities(character: Character): string[] {
  const bonuses = calculateSkillTreeBonuses(character);
  return bonuses.unlockedAbilities;
}

/**
 * Get node progress (how many points invested)
 */
export function getNodeProgress(character: Character, nodeId: string): SkillNodeProgress | null {
  return character.skillTreeNodes.find(p => p.nodeId === nodeId) || null;
}

/**
 * Check if a node is fully unlocked
 */
export function isNodeUnlocked(character: Character, nodeId: string): boolean {
  const node = getSkillNode(character.type, nodeId);
  if (!node) {
    return false;
  }
  
  const progress = getNodeProgress(character, nodeId);
  return progress !== null && progress.pointsInvested >= node.skillPointCost;
}

/**
 * Get total skill points invested in the skill tree
 */
export function getTotalSkillPointsInvested(character: Character): number {
  return character.skillTreeNodes.reduce((total, progress) => {
    return total + progress.pointsInvested;
  }, 0);
}

/**
 * Get skill tree summary for display
 */
export function getSkillTreeSummary(character: Character): {
  unlockedNodes: number;
  totalNodes: number;
  skillPointsInvested: number;
  skillPointsAvailable: number;
  maxAbilitySlots: number;
  skillTreeAbilities: number;
} {
  const tree = getSkillTree(character.type);
  const unlockedNodes = getUnlockedNodes(character);
  const bonuses = calculateSkillTreeBonuses(character);
  
  return {
    unlockedNodes: unlockedNodes.length,
    totalNodes: tree?.nodes.length || 0,
    skillPointsInvested: getTotalSkillPointsInvested(character),
    skillPointsAvailable: character.skillPoints,
    maxAbilitySlots: getMaxAbilitySlots(character),
    skillTreeAbilities: bonuses.unlockedAbilities.length
  };
}

/**
 * Reset all skill points (for testing or potential respec feature)
 * Returns the number of skill points refunded
 */
export function resetSkillTree(character: Character): number {
  const pointsRefunded = getTotalSkillPointsInvested(character);
  
  // Clear all progress
  character.skillTreeNodes = [];
  
  // Refund skill points
  character.skillPoints += pointsRefunded;
  
  // Remove skill tree abilities from unlocked list
  const skillTreeAbilities = getSkillTreeAbilities(character);
  character.unlockedAbilities = character.unlockedAbilities.filter(
    abilityId => !skillTreeAbilities.includes(abilityId)
  );
  
  return pointsRefunded;
}
