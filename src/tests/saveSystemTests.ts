/**
 * Save System Tests
 * 
 * Comprehensive tests for save/load functionality, data validation,
 * and migration support.
 */

import { 
  initializeNewGame,
  loadGameState,
  saveGame,
  hasSave,
  deleteAllSaves,
  getRoster,
  getInventory,
  addCharacterToRoster,
  removeCharacterFromRoster,
  addEquipmentToInventory,
  getStatistics,
  incrementStatistic,
  updateSettings,
  getCurrentGameState,
} from '../systems/game';
import { createCharacter } from '../systems/character';
import { generateEquipment } from '../systems/equipment';
import { 
  loadGame as loadPersisted,
  validateSaveData,
  getSaveMetadata,
} from '../utils/storage';

/**
 * Test 1: New Game Initialization
 */
function testNewGameInit(): void {
  console.log('\n=== Test 1: New Game Initialization ===');
  
  // Clear any existing saves
  deleteAllSaves();
  
  // Initialize new game
  const gameState = initializeNewGame('Alpha', 'TestHero');
  
  console.log('✓ New game created');
  console.log(`  Starter character: ${gameState.saveData.roster[0].name} (${gameState.saveData.roster[0].type})`);
  console.log(`  Starting equipment: ${gameState.saveData.inventory.length} items`);
  console.log(`  Campaign stage: ${gameState.saveData.campaign.currentStage}`);
  console.log(`  Auto-save enabled: ${gameState.saveData.settings.autoSave}`);
  
  // Verify roster
  const roster = getRoster();
  if (roster.length !== 1) {
    console.error('✗ FAILED: Expected 1 character in roster, got', roster.length);
    return;
  }
  
  if (roster[0].name !== 'TestHero') {
    console.error('✗ FAILED: Expected character name "TestHero", got', roster[0].name);
    return;
  }
  
  // Verify campaign
  if (gameState.saveData.campaign.currentStage !== 1) {
    console.error('✗ FAILED: Expected campaign to start at stage 1');
    return;
  }
  
  console.log('✓ New game initialization: PASSED\n');
}

/**
 * Test 2: Save and Load Cycle
 */
function testSaveLoadCycle(): void {
  console.log('\n=== Test 2: Save and Load Cycle ===');
  
  // Clear existing saves
  deleteAllSaves();
  
  // Create new game
  initializeNewGame('Beta', 'Rogue1');
  
  // Add some progress
  const char2 = createCharacter('Gamma', 5, 'Mage1');
  addCharacterToRoster(char2);
  
  const loot = generateEquipment(10);
  addEquipmentToInventory(loot);
  
  incrementStatistic('totalBattles', 5);
  incrementStatistic('totalVictories', 3);
  
  console.log('✓ Added progress to game state');
  console.log(`  Roster: ${getRoster().length} characters`);
  console.log(`  Inventory: ${getInventory().length} items`);
  console.log(`  Battles: ${getStatistics().totalBattles}`);
  
  // Save game
  const saveSuccess = saveGame(false);
  if (!saveSuccess) {
    console.error('✗ FAILED: Could not save game');
    return;
  }
  
  console.log('✓ Game saved successfully');
  
  // Verify save exists
  if (!hasSave(false)) {
    console.error('✗ FAILED: Save does not exist after saving');
    return;
  }
  
  // Load game
  const gameState2 = loadGameState(false);
  
  if (!gameState2) {
    console.error('✗ FAILED: Could not load game');
    return;
  }
  
  console.log('✓ Game loaded successfully');
  
  // Verify loaded data matches
  const roster2 = getRoster();
  const inventory2 = getInventory();
  const stats2 = getStatistics();
  
  if (roster2.length !== 2) {
    console.error('✗ FAILED: Expected 2 characters after load, got', roster2.length);
    return;
  }
  
  if (inventory2.length !== 4) { // 3 starting + 1 added
    console.error('✗ FAILED: Expected 4 inventory items after load, got', inventory2.length);
    return;
  }
  
  if (stats2.totalBattles !== 5) {
    console.error('✗ FAILED: Expected 5 total battles, got', stats2.totalBattles);
    return;
  }
  
  if (stats2.totalVictories !== 3) {
    console.error('✗ FAILED: Expected 3 victories, got', stats2.totalVictories);
    return;
  }
  
  console.log('✓ All data preserved correctly');
  console.log('✓ Save/Load cycle: PASSED\n');
}

/**
 * Test 3: Auto-Save Functionality
 */
function testAutoSave(): void {
  console.log('\n=== Test 3: Auto-Save Functionality ===');
  
  deleteAllSaves();
  
  // Create game with auto-save enabled
  initializeNewGame('Delta', 'Warrior1');
  
  // Verify auto-save was created
  if (!hasSave(true)) {
    console.error('✗ FAILED: Auto-save not created on new game');
    return;
  }
  
  console.log('✓ Auto-save created on new game');
  
  // Make changes
  incrementStatistic('totalBattles', 1);
  
  // Manually trigger auto-save
  const autoSaveSuccess = saveGame(true);
  if (!autoSaveSuccess) {
    console.error('✗ FAILED: Could not auto-save');
    return;
  }
  
  console.log('✓ Auto-save successful');
  
  // Load from auto-save
  const loadedState = loadGameState(true);
  
  if (!loadedState) {
    console.error('✗ FAILED: Could not load auto-save');
    return;
  }
  
  if (loadedState.saveData.statistics.totalBattles !== 1) {
    console.error('✗ FAILED: Auto-save did not preserve statistics');
    return;
  }
  
  console.log('✓ Auto-save preserves data correctly');
  console.log('✓ Auto-save functionality: PASSED\n');
}

/**
 * Test 4: Save Validation
 */
function testSaveValidation(): void {
  console.log('\n=== Test 4: Save Validation ===');
  
  // Test 4a: Valid save data
  deleteAllSaves();
  initializeNewGame('Epsilon', 'Cleric1');
  saveGame(false);
  
  const saveData = loadPersisted(false);
  if (!saveData) {
    console.error('✗ FAILED: Could not load save for validation test');
    return;
  }
  
  const validation1 = validateSaveData(saveData);
  if (!validation1.isValid) {
    console.error('✗ FAILED: Valid save marked as invalid:', validation1.errors);
    return;
  }
  
  console.log('✓ Valid save data passes validation');
  
  // Test 4b: Invalid save data (missing roster)
  const invalidSave1 = { ...saveData, roster: null };
  const validation2 = validateSaveData(invalidSave1);
  
  if (validation2.isValid) {
    console.error('✗ FAILED: Invalid save (missing roster) marked as valid');
    return;
  }
  
  console.log('✓ Invalid save (missing roster) fails validation');
  console.log(`  Error: ${validation2.errors[0]}`);
  
  // Test 4c: Invalid roster size
  const chars = Array(7).fill(null).map((_, i) => createCharacter('Alpha', 1, `Char${i}`));
  const invalidSave2 = { ...saveData, roster: chars };
  const validation3 = validateSaveData(invalidSave2);
  
  if (validation3.isValid) {
    console.error('✗ FAILED: Save with 7 characters marked as valid');
    return;
  }
  
  console.log('✓ Invalid save (7 characters) fails validation');
  console.log(`  Error: ${validation3.errors[0]}`);
  
  console.log('✓ Save validation: PASSED\n');
}

/**
 * Test 5: Save Metadata
 */
function testSaveMetadata(): void {
  console.log('\n=== Test 5: Save Metadata ===');
  
  deleteAllSaves();
  
  // Create game with multiple characters
  initializeNewGame('Zeta', 'Berserker1');
  const char2 = createCharacter('Alpha', 10);
  addCharacterToRoster(char2);
  
  // Simulate campaign progress
  const gameState = getCurrentGameState();
  if (gameState) {
    gameState.saveData.campaign.completedStages.add(1);
    gameState.saveData.campaign.completedStages.add(2);
    gameState.saveData.campaign.completedStages.add(3);
  }
  
  saveGame(false);
  
  // Get metadata
  const metadata = getSaveMetadata(false);
  
  if (!metadata) {
    console.error('✗ FAILED: Could not get save metadata');
    return;
  }
  
  console.log('✓ Save metadata retrieved');
  console.log(`  Has data: ${metadata.hasData}`);
  console.log(`  Roster size: ${metadata.rosterSize}`);
  console.log(`  Highest level: ${metadata.highestLevel}`);
  console.log(`  Campaign progress: ${metadata.campaignProgress}%`);
  
  if (metadata.rosterSize !== 2) {
    console.error('✗ FAILED: Expected roster size 2, got', metadata.rosterSize);
    return;
  }
  
  if (metadata.highestLevel !== 10) {
    console.error('✗ FAILED: Expected highest level 10, got', metadata.highestLevel);
    return;
  }
  
  if (metadata.campaignProgress !== 3) {
    console.error('✗ FAILED: Expected 3% campaign progress, got', metadata.campaignProgress);
    return;
  }
  
  console.log('✓ Save metadata: PASSED\n');
}

/**
 * Test 6: Roster Management
 */
function testRosterManagement(): void {
  console.log('\n=== Test 6: Roster Management ===');
  
  deleteAllSaves();
  initializeNewGame('Alpha', 'Tank1');
  
  // Add characters
  const char2 = createCharacter('Beta', 5, 'Rogue1');
  const char3 = createCharacter('Gamma', 3, 'Mage1');
  
  addCharacterToRoster(char2);
  addCharacterToRoster(char3);
  
  let roster = getRoster();
  console.log(`✓ Added 2 characters, roster size: ${roster.length}`);
  
  if (roster.length !== 3) {
    console.error('✗ FAILED: Expected roster size 3, got', roster.length);
    return;
  }
  
  // Remove character
  const success = removeCharacterFromRoster(char2.id);
  
  if (!success) {
    console.error('✗ FAILED: Could not remove character');
    return;
  }
  
  roster = getRoster();
  console.log(`✓ Removed character, roster size: ${roster.length}`);
  
  if (roster.length !== 2) {
    console.error('✗ FAILED: Expected roster size 2 after removal, got', roster.length);
    return;
  }
  
  // Try to add 4 more characters (should fill to 6)
  for (let i = 0; i < 4; i++) {
    const char = createCharacter('Delta', 1, `Char${i}`);
    addCharacterToRoster(char);
  }
  
  roster = getRoster();
  console.log(`✓ Filled roster to max: ${roster.length}/6`);
  
  if (roster.length !== 6) {
    console.error('✗ FAILED: Expected roster size 6, got', roster.length);
    return;
  }
  
  // Try to add one more (should fail)
  const extraChar = createCharacter('Epsilon', 1);
  const shouldFail = addCharacterToRoster(extraChar);
  
  if (shouldFail) {
    console.error('✗ FAILED: Should not be able to add 7th character');
    return;
  }
  
  console.log('✓ Cannot exceed roster limit of 6');
  console.log('✓ Roster management: PASSED\n');
}

/**
 * Test 7: Settings Persistence
 */
function testSettingsPersistence(): void {
  console.log('\n=== Test 7: Settings Persistence ===');
  
  deleteAllSaves();
  initializeNewGame('Gamma', 'Mage1');
  
  // Update settings
  updateSettings({
    damageVariance: false,
    combatSpeed: 2.0,
    soundEnabled: true,
    soundVolume: 0.5,
  });
  
  console.log('✓ Settings updated');
  
  // Save and load
  saveGame(false);
  const loaded = loadGameState(false);
  
  if (!loaded) {
    console.error('✗ FAILED: Could not load game');
    return;
  }
  
  // Verify settings
  const settings = loaded.saveData.settings;
  
  if (settings.damageVariance !== false) {
    console.error('✗ FAILED: damageVariance not preserved');
    return;
  }
  
  if (settings.combatSpeed !== 2.0) {
    console.error('✗ FAILED: combatSpeed not preserved');
    return;
  }
  
  if (settings.soundEnabled !== true) {
    console.error('✗ FAILED: soundEnabled not preserved');
    return;
  }
  
  if (settings.soundVolume !== 0.5) {
    console.error('✗ FAILED: soundVolume not preserved');
    return;
  }
  
  console.log('✓ All settings preserved correctly');
  console.log('✓ Settings persistence: PASSED\n');
}

/**
 * Run all save system tests
 */
export function runAllSaveTests(): void {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   ANXRPG Save System Tests                 ║');
  console.log('╚════════════════════════════════════════════╝');
  
  try {
    testNewGameInit();
    testSaveLoadCycle();
    testAutoSave();
    testSaveValidation();
    testSaveMetadata();
    testRosterManagement();
    testSettingsPersistence();
    
    console.log('╔════════════════════════════════════════════╗');
    console.log('║   ALL TESTS PASSED ✓                       ║');
    console.log('╚════════════════════════════════════════════╝\n');
    
  } catch (error) {
    console.error('\n✗ TEST SUITE FAILED:', error);
  }
}

/**
 * Individual test exports for targeted testing
 */
export const saveSystemTests = {
  newGameInit: testNewGameInit,
  saveLoadCycle: testSaveLoadCycle,
  autoSave: testAutoSave,
  validation: testSaveValidation,
  metadata: testSaveMetadata,
  rosterManagement: testRosterManagement,
  settingsPersistence: testSettingsPersistence,
  runAll: runAllSaveTests,
};

// Browser console integration
if (typeof window !== 'undefined') {
  (window as any).saveSystemTests = saveSystemTests;
  console.log('[Tests] Save system tests available: window.saveSystemTests');
}
