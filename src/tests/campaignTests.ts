/**
 * Campaign System Tests
 * Tests for stage progression, unlocking, and campaign management
 */

import {
  initializeCampaignProgress,
  getCurrentStage,
  canAccessStage,
  unlockNextStage,
  setCurrentStage,
  generateStageEnemies,
  calculateStageXpReward,
  generateStageEquipment,
  completeStage,
  getStageVictoryCount,
  getCampaignSummary,
  isBossStage,
  getNextBossStage
} from '../systems/campaign';
import { createCharacter } from '../systems/character';

/**
 * Test 1: Campaign Initialization
 */
function testCampaignInitialization() {
  console.log('\n=== TEST 1: Campaign Initialization ===');
  
  const progress = initializeCampaignProgress();
  
  console.log('✓ Campaign initialized');
  console.log(`  Highest stage unlocked: ${progress.highestStageUnlocked}`);
  console.log(`  Current stage: ${progress.currentStage}`);
  console.log(`  Completed stages: ${progress.completedStages.size}`);
  console.log(`  Total victories: ${progress.totalVictories}`);
  
  // Assertions
  if (progress.highestStageUnlocked !== 1) {
    console.error('✗ FAIL: Should start with stage 1 unlocked');
    return false;
  }
  if (progress.currentStage !== 1) {
    console.error('✗ FAIL: Should start on stage 1');
    return false;
  }
  if (progress.completedStages.size !== 0) {
    console.error('✗ FAIL: Should have no completed stages');
    return false;
  }
  if (progress.totalVictories !== 0) {
    console.error('✗ FAIL: Should have 0 victories');
    return false;
  }
  
  console.log('✓ PASS: Campaign initialization works correctly\n');
  return true;
}

/**
 * Test 2: Stage Unlocking Progression
 */
function testStageUnlocking() {
  console.log('\n=== TEST 2: Stage Unlocking Progression ===');
  
  const progress = initializeCampaignProgress();
  const testCharacters = [createCharacter('Alpha', 1)];
  
  // Should only have access to stage 1
  const stage1Access = canAccessStage(1, progress, testCharacters);
  const stage2Access = canAccessStage(2, progress, testCharacters);
  
  console.log(`Stage 1 access: ${stage1Access.canAccess}`);
  console.log(`Stage 2 access: ${stage2Access.canAccess} (${stage2Access.reason || 'locked'})`);
  
  // Complete stage 1
  completeStage(progress, 1, true, 100, []);
  
  console.log(`\nAfter completing stage 1:`);
  console.log(`  Highest unlocked: ${progress.highestStageUnlocked}`);
  console.log(`  Completed: ${Array.from(progress.completedStages)}`);
  console.log(`  Total victories: ${progress.totalVictories}`);
  
  // Now stage 2 should be unlocked
  const stage2AccessAfter = canAccessStage(2, progress, testCharacters);
  console.log(`Stage 2 access now: ${stage2AccessAfter.canAccess}`);
  
  if (!stage2AccessAfter.canAccess) {
    console.error('✗ FAIL: Stage 2 should be unlocked after completing stage 1');
    return false;
  }
  
  console.log('✓ PASS: Stage unlocking works correctly\n');
  return true;
}

/**
 * Test 3: Boss Stage Detection
 */
function testBossStageDetection() {
  console.log('\n=== TEST 3: Boss Stage Detection ===');
  
  const bossStages = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const normalStages = [1, 5, 15, 25, 35, 45, 55, 65, 75, 85, 95, 99];
  
  console.log('Boss stages (should all be true):');
  for (const stage of bossStages) {
    const isBoss = isBossStage(stage);
    console.log(`  Stage ${stage}: ${isBoss}`);
    if (!isBoss) {
      console.error(`✗ FAIL: Stage ${stage} should be a boss stage`);
      return false;
    }
  }
  
  console.log('\nNormal stages (should all be false):');
  for (const stage of normalStages) {
    const isBoss = isBossStage(stage);
    console.log(`  Stage ${stage}: ${isBoss}`);
    if (isBoss) {
      console.error(`✗ FAIL: Stage ${stage} should NOT be a boss stage`);
      return false;
    }
  }
  
  console.log('✓ PASS: Boss stage detection works correctly\n');
  return true;
}

/**
 * Test 4: Enemy Generation for Stages
 */
function testEnemyGeneration() {
  console.log('\n=== TEST 4: Enemy Generation for Stages ===');
  
  const progress = initializeCampaignProgress();
  
  // Test normal stage
  const stage1 = getCurrentStage(progress)!;
  const enemies1 = generateStageEnemies(stage1);
  console.log(`Stage 1 enemies: ${enemies1.length} enemies`);
  console.log(`  Names: ${enemies1.map(e => `${e.name} (Lv${e.level})`).join(', ')}`);
  
  if (enemies1.length < 1 || enemies1.length > 3) {
    console.error('✗ FAIL: Should generate 1-3 enemies');
    return false;
  }
  
  // Unlock stages up to boss stage
  for (let i = 1; i < 10; i++) {
    unlockNextStage(progress);
  }
  setCurrentStage(progress, 10);
  
  // Test boss stage
  const stage10 = getCurrentStage(progress)!;
  const enemies10 = generateStageEnemies(stage10);
  console.log(`\nStage 10 (BOSS) enemies: ${enemies10.length} enemies`);
  console.log(`  Names: ${enemies10.map(e => `${e.name} (Lv${e.level}, Boss: ${e.isBoss})`).join(', ')}`);
  
  if (!enemies10[0].isBoss) {
    console.error('✗ FAIL: Boss stage should have boss enemy');
    return false;
  }
  
  console.log('✓ PASS: Enemy generation works correctly\n');
  return true;
}

/**
 * Test 5: XP and Reward Calculation
 */
function testRewardCalculation() {
  console.log('\n=== TEST 5: XP and Reward Calculation ===');
  
  const progress = initializeCampaignProgress();
  const stage1 = getCurrentStage(progress)!;
  const enemies = generateStageEnemies(stage1);
  
  const xp = calculateStageXpReward(stage1, enemies);
  const loot = generateStageEquipment(stage1, enemies);
  
  console.log(`Stage 1 rewards:`);
  console.log(`  Enemies: ${enemies.length}`);
  console.log(`  Total XP: ${xp}`);
  console.log(`  Equipment drops: ${loot.length} items`);
  if (loot.length > 0) {
    loot.forEach(item => {
      console.log(`    - ${item.name} (Lv${item.level}, ${item.slot})`);
    });
  }
  
  if (xp <= 0) {
    console.error('✗ FAIL: Should award XP');
    return false;
  }
  
  // Test boss stage rewards (should have multipliers)
  for (let i = 1; i < 10; i++) unlockNextStage(progress);
  setCurrentStage(progress, 10);
  const stage10 = getCurrentStage(progress)!;
  const bossEnemies = generateStageEnemies(stage10);
  const bossXp = calculateStageXpReward(stage10, bossEnemies);
  const bossLoot = generateStageEquipment(stage10, bossEnemies);
  
  console.log(`\nStage 10 (BOSS) rewards:`);
  console.log(`  Total XP: ${bossXp} (with 1.5× multiplier)`);
  console.log(`  Equipment drops: ${bossLoot.length} items (with 2.0× multiplier)`);
  
  if (bossXp <= xp) {
    console.log('  WARNING: Boss XP should typically be higher than normal stage');
  }
  
  console.log('✓ PASS: Reward calculation works correctly\n');
  return true;
}

/**
 * Test 6: Stage Completion and Victory Tracking
 */
function testStageCompletion() {
  console.log('\n=== TEST 6: Stage Completion and Victory Tracking ===');
  
  const progress = initializeCampaignProgress();
  
  console.log('Initial state:');
  console.log(`  Total victories: ${progress.totalVictories}`);
  console.log(`  Completed stages: ${progress.completedStages.size}`);
  
  // Complete stages 1-4 (shouldn't count for recruitment)
  for (let stage = 1; stage <= 4; stage++) {
    const result = completeStage(progress, stage, true, 100, []);
    console.log(`\nStage ${stage} completed (first clear: ${result.firstTimeClear})`);
    console.log(`  Total victories: ${progress.totalVictories} (stages < 5 don't count)`);
  }
  
  if (progress.totalVictories !== 0) {
    console.error('✗ FAIL: Stages 1-4 should not count for recruitment victories');
    return false;
  }
  
  // Complete stage 5 (should count)
  const result5 = completeStage(progress, 5, true, 100, []);
  console.log(`\nStage 5 completed`);
  console.log(`  Total victories: ${progress.totalVictories} (should be 1)`);
  console.log(`  Next stage unlocked: ${result5.nextStageUnlocked || 'none'}`);
  
  if (progress.totalVictories < 1) {
    console.error('✗ FAIL: Stage 5 should count for recruitment');
    return false;
  }
  
  // Replay stage 5 (farming)
  const replayResult = completeStage(progress, 5, true, 100, []);
  console.log(`\nStage 5 replayed (first clear: ${replayResult.firstTimeClear})`);
  console.log(`  Total victories: ${progress.totalVictories} (should be 2)`);
  console.log(`  Stage 5 clear count: ${getStageVictoryCount(progress, 5)}`);
  console.log(`  Next stage unlocked: ${replayResult.nextStageUnlocked || 'none (already unlocked)'}`);
  
  if (getStageVictoryCount(progress, 5) !== 2) {
    console.error('✗ FAIL: Should track farming victories');
    return false;
  }
  
  console.log('✓ PASS: Stage completion tracking works correctly\n');
  return true;
}

/**
 * Test 7: Campaign Summary and Progress Tracking
 */
function testCampaignSummary() {
  console.log('\n=== TEST 7: Campaign Summary and Progress Tracking ===');
  
  const progress = initializeCampaignProgress();
  
  // Complete first 10 stages
  for (let stage = 1; stage <= 10; stage++) {
    completeStage(progress, stage, true, 100, []);
  }
  
  const summary = getCampaignSummary(progress);
  
  console.log('Campaign Summary after 10 stages:');
  console.log(`  Current stage: ${summary.currentStage}`);
  console.log(`  Highest unlocked: ${summary.highestUnlocked}`);
  console.log(`  Stages completed: ${summary.stagesCompleted} / ${summary.totalStages}`);
  console.log(`  Completion: ${summary.completionPercentage}%`);
  console.log(`  Total victories: ${summary.totalVictories}`);
  console.log(`  Campaign complete: ${summary.isCampaignComplete}`);
  
  if (summary.stagesCompleted !== 10) {
    console.error('✗ FAIL: Should have 10 completed stages');
    return false;
  }
  
  if (summary.completionPercentage !== 10) {
    console.error('✗ FAIL: Should be 10% complete');
    return false;
  }
  
  if (summary.isCampaignComplete) {
    console.error('✗ FAIL: Campaign should not be complete');
    return false;
  }
  
  // Test next boss stage detection
  const nextBoss = getNextBossStage(10);
  console.log(`\nNext boss stage after 10: ${nextBoss?.stageNumber || 'none'} (${nextBoss?.name || ''})`);
  
  if (nextBoss?.stageNumber !== 20) {
    console.error('✗ FAIL: Next boss should be stage 20');
    return false;
  }
  
  console.log('✓ PASS: Campaign summary works correctly\n');
  return true;
}

/**
 * Run all campaign tests
 */
export function runCampaignTests() {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   CAMPAIGN SYSTEM TEST SUITE               ║');
  console.log('╚════════════════════════════════════════════╝');
  
  const tests = [
    testCampaignInitialization,
    testStageUnlocking,
    testBossStageDetection,
    testEnemyGeneration,
    testRewardCalculation,
    testStageCompletion,
    testCampaignSummary
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      if (test()) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.error(`✗ TEST ERROR: ${error}`);
      failed++;
    }
  }
  
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║   TEST RESULTS                             ║');
  console.log('╚════════════════════════════════════════════╝');
  console.log(`✓ Passed: ${passed}`);
  console.log(`✗ Failed: ${failed}`);
  console.log(`Total: ${tests.length}`);
  
  if (failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! Campaign system is working correctly.');
  } else {
    console.log('\n⚠️  SOME TESTS FAILED. Check output above for details.');
  }
  
  return { passed, failed, total: tests.length };
}

// Make available in browser console
if (typeof window !== 'undefined') {
  (window as any).campaignTests = {
    runAll: runCampaignTests,
    test1: testCampaignInitialization,
    test2: testStageUnlocking,
    test3: testBossStageDetection,
    test4: testEnemyGeneration,
    test5: testRewardCalculation,
    test6: testStageCompletion,
    test7: testCampaignSummary
  };
  console.log('Campaign tests loaded. Run campaignTests.runAll() to test.');
}
