/**
 * Phase 8 Test Scenarios
 * 
 * Tests for skill tree system and recruitment mechanics.
 * Run in browser console after loading the game.
 */

import { createCharacter } from '../systems/character';
import { 
  unlockSkillNode, 
  canUnlockNode, 
  getAvailableNodes,
  calculateSkillTreeBonuses,
  getMaxAbilitySlots,
  getSkillTreeSummary,
  isNodeUnlocked
} from '../systems/skillTree';
import { 
  getRecruitmentStatus,
  recruitCharacter,
  retireCharacter,
  getRecruitmentUnlockMessage,
  shouldCountForRecruitment
} from '../systems/recruitment';
import type { Character } from '../types';

/**
 * Test 1: Skill Tree Unlocking
 */
function testSkillTreeUnlocking() {
  console.log('\n=== TEST 1: Skill Tree Unlocking ===');
  
  // Create level 10 Alpha with 9 skill points
  const alpha = createCharacter('Alpha', 10);
  console.log(`Created ${alpha.name} (Level ${alpha.level}) with ${alpha.skillPoints} skill points`);
  
  // Get available nodes
  const availableNodes = getAvailableNodes(alpha);
  console.log(`Available nodes: ${availableNodes.length}`);
  console.log(`First available: ${availableNodes[0]?.name} (${availableNodes[0]?.description})`);
  
  // Try unlocking first node
  const firstNode = 'alpha_hp_1';
  const canUnlock = canUnlockNode(alpha, firstNode);
  console.log(`Can unlock ${firstNode}? ${canUnlock.canUnlock} ${canUnlock.reason || ''}`);
  
  const success = unlockSkillNode(alpha, firstNode);
  console.log(`Unlock ${firstNode}: ${success ? 'SUCCESS' : 'FAILED'}`);
  console.log(`Skill points remaining: ${alpha.skillPoints}`);
  console.log(`Node unlocked: ${isNodeUnlocked(alpha, firstNode)}`);
  
  // Check bonuses
  const bonuses = calculateSkillTreeBonuses(alpha);
  console.log(`Skill tree bonuses:`, bonuses.stats);
  
  return alpha;
}

/**
 * Test 2: Skill Tree Stat Bonuses
 */
function testSkillTreeStatBonuses() {
  console.log('\n=== TEST 2: Skill Tree Stat Bonuses ===');
  
  // Create level 50 Beta with 49 skill points
  const beta = createCharacter('Beta', 50);
  console.log(`Created ${beta.name} (Level ${beta.level}) with ${beta.skillPoints} skill points`);
  
  const beforeStats = { ...beta.stats };
  console.log(`Base stats before:`, {
    maxHp: beforeStats.maxHp,
    atk: beforeStats.atk,
    spd: beforeStats.spd,
    crt: beforeStats.crt
  });
  
  // Unlock first 10 nodes manually
  const nodesToUnlock = [
    'beta_spd_1', 'beta_crt_1', 'beta_eva_1', 'beta_atk_1',
    'beta_acc_1', 'beta_crt_2', 'beta_spd_2', 'beta_ability_5',
    'beta_atk_2', 'beta_eva_2'
  ];
  
  let unlockedCount = 0;
  for (const nodeId of nodesToUnlock) {
    if (unlockSkillNode(beta, nodeId)) {
      unlockedCount++;
    }
  }
  
  console.log(`Unlocked ${unlockedCount} nodes`);
  console.log(`Skill points remaining: ${beta.skillPoints}`);
  
  // Calculate bonuses
  const bonuses = calculateSkillTreeBonuses(beta);
  console.log(`Total stat bonuses:`, bonuses.stats);
  console.log(`Additional ability slots: ${bonuses.additionalAbilitySlots}`);
  console.log(`Max ability slots: ${getMaxAbilitySlots(beta)}`);
  
  // Get summary
  const summary = getSkillTreeSummary(beta);
  console.log(`Skill tree summary:`, summary);
  
  return beta;
}

/**
 * Test 3: Ability Slot Unlocking
 */
function testAbilitySlotUnlocking() {
  console.log('\n=== TEST 3: Ability Slot Unlocking ===');
  
  // Create level 100 character with all skill points
  const gamma = createCharacter('Gamma', 100);
  console.log(`Created ${gamma.name} (Level ${gamma.level}) with ${gamma.skillPoints} skill points`);
  
  console.log(`Starting ability slots: ${getMaxAbilitySlots(gamma)}`);
  
  // Unlock nodes up to first ability slot (gamma_ability_5 at level 30)
  const pathTo5thSlot = [
    'gamma_mag_1', 'gamma_res_1', 'gamma_hp_1', 'gamma_mag_2',
    'gamma_acc_1', 'gamma_res_2', 'gamma_spd_1', 'gamma_ability_5'
  ];
  
  for (const nodeId of pathTo5thSlot) {
    unlockSkillNode(gamma, nodeId);
  }
  
  console.log(`After unlocking 5th slot node: ${getMaxAbilitySlots(gamma)} slots`);
  
  // Unlock path to 6th slot
  const pathTo6thSlot = [
    'gamma_mag_3', 'gamma_hp_2', 'gamma_res_3', 'gamma_def_1',
    'gamma_acc_2', 'gamma_mag_4', 'gamma_ability_6'
  ];
  
  for (const nodeId of pathTo6thSlot) {
    unlockSkillNode(gamma, nodeId);
  }
  
  console.log(`After unlocking 6th slot node: ${getMaxAbilitySlots(gamma)} slots`);
  console.log(`Skill points remaining: ${gamma.skillPoints}`);
  
  return gamma;
}

/**
 * Test 4: Recruitment System
 */
function testRecruitmentSystem() {
  console.log('\n=== TEST 4: Recruitment System ===');
  
  // Simulate different victory counts
  const victoryCounts = [0, 15, 20, 35, 40, 85, 100];
  
  for (const victories of victoryCounts) {
    const status = getRecruitmentStatus(victories, 1); // Starting with 1 character
    console.log(`\nVictories: ${victories}`);
    console.log(`  Milestones reached: ${status.milestonesReached}/${status.totalMilestones}`);
    console.log(`  Can recruit: ${status.canRecruit}`);
    console.log(`  Next milestone: ${status.nextMilestone || 'All reached'}`);
    console.log(`  Battles remaining: ${status.battlesRemaining || 'N/A'}`);
    
    if (status.canRecruit) {
      console.log(`  ✅ Can recruit new character!`);
    }
  }
  
  // Test recruitment message
  console.log('\n Recruitment unlock messages:');
  console.log(`  20 wins: ${getRecruitmentUnlockMessage(20, 1)}`);
  console.log(`  40 wins: ${getRecruitmentUnlockMessage(40, 2)}`);
  console.log(` 100 wins: ${getRecruitmentUnlockMessage(100, 5)}`);
}

/**
 * Test 5: Character Recruitment and Retirement
 */
function testRecruitmentAndRetirement() {
  console.log('\n=== TEST 5: Character Recruitment and Retirement ===');
  
  // Create initial roster
  const roster: Character[] = [
    createCharacter('Alpha', 10, 'Tank Alpha')
  ];
  
  console.log(`Starting roster size: ${roster.length}`);
  console.log(`Starting character: ${roster[0].name} (${roster[0].type})`);
  
  // Recruit new characters
  const newBeta = recruitCharacter('Beta', 'Speedy Beta');
  roster.push(newBeta);
  console.log(`Recruited: ${newBeta.name} (Level ${newBeta.level})`);
  
  const newGamma = recruitCharacter('Gamma');
  roster.push(newGamma);
  console.log(`Recruited: ${newGamma.name} (Level ${newGamma.level})`);
  
  console.log(`Roster size: ${roster.length}`);
  
  // Test retirement
  console.log(`\nRetiring ${roster[1].name}...`);
  const retired = retireCharacter(roster, roster[1].id);
  
  if (retired) {
    console.log(`Successfully retired: ${retired.name}`);
    console.log(`Roster size after retirement: ${roster.length}`);
  } else {
    console.log(`Failed to retire character`);
  }
}

/**
 * Test 6: Stage Counting for Recruitment
 */
function testStageCountingForRecruitment() {
  console.log('\n=== TEST 6: Stage Counting for Recruitment ===');
  
  const stages = [1, 2, 3, 4, 5, 6, 10, 20, 50, 100];
  
  for (const stage of stages) {
    const counts = shouldCountForRecruitment(stage);
    console.log(`Stage ${stage}: ${counts ? '✅ Counts' : '❌ Does not count'}`);
  }
}

/**
 * Test 7: XP and Level-Up Integration
 */
function testXpAndLevelUp() {
  console.log('\n=== TEST 7: XP and Level-Up Integration ===');
  
  const delta = createCharacter('Delta', 1);
  console.log(`Created ${delta.name} (Level ${delta.level})`);
  console.log(`Current XP: ${delta.currentXp} / ${delta.xpToNextLevel}`);
  console.log(`Skill points: ${delta.skillPoints}`);
  
  // Simulate awarding XP (this would happen in combat)
  // Note: awardXp is already integrated into combat system
  console.log(`\n(XP awarding happens automatically in combat system)`);
  console.log(`See combat.ts checkBattleEnd() for integration`);
  
  const summary = getSkillTreeSummary(delta);
  console.log(`\nSkill tree summary:`, summary);
}

/**
 * Run all Phase 8 tests
 */
export function runPhase8Tests() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   ANXRPG PHASE 8 INTEGRATION TESTS    ║');
  console.log('╚════════════════════════════════════════╝');
  
  try {
    testSkillTreeUnlocking();
    testSkillTreeStatBonuses();
    testAbilitySlotUnlocking();
    testRecruitmentSystem();
    testRecruitmentAndRetirement();
    testStageCountingForRecruitment();
    testXpAndLevelUp();
    
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║     ALL TESTS COMPLETED SUCCESSFULLY   ║');
    console.log('╚════════════════════════════════════════╝');
    
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error);
  }
}

// Export individual tests
export const phase8Tests = {
  all: runPhase8Tests,
  skillTreeUnlocking: testSkillTreeUnlocking,
  skillTreeStats: testSkillTreeStatBonuses,
  abilitySlots: testAbilitySlotUnlocking,
  recruitment: testRecruitmentSystem,
  recruitRetire: testRecruitmentAndRetirement,
  stageCounting: testStageCountingForRecruitment,
  xpIntegration: testXpAndLevelUp
};

// Make available in browser console
if (typeof window !== 'undefined') {
  (window as any).phase8Tests = phase8Tests;
}
