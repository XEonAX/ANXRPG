/**
 * Test: Ability Unlock on Level Up
 * Verifies that abilities are automatically unlocked when characters reach required levels
 */

import { createCharacter, awardXp } from '../systems/character';
import { calculateXpForLevel } from '../utils/formulas';

console.log('=== ABILITY AUTO-UNLOCK TEST ===\n');

// Create a level 1 Paladin
const paladin = createCharacter('Alpha', 1, 'Test Paladin');

console.log(`Created: ${paladin.name} (Level ${paladin.level})`);
console.log(`Starting abilities: ${paladin.unlockedAbilities.length}`);
console.log(`  - ${paladin.unlockedAbilities.join(', ')}\n`);

// Level up to 5
console.log('--- Leveling to 5 ---');
const xpToLevel5 = calculateXpForLevel(5) - calculateXpForLevel(1);
awardXp(paladin, xpToLevel5);
console.log(`Level ${paladin.level} - Unlocked abilities: ${paladin.unlockedAbilities.length}`);
console.log(`  - ${paladin.unlockedAbilities.join(', ')}`);
console.log(`Equipped: ${paladin.equippedAbilities.join(', ')}\n`);

// Level up to 10
console.log('--- Leveling to 10 ---');
const xpToLevel10 = calculateXpForLevel(10) - calculateXpForLevel(5);
awardXp(paladin, xpToLevel10);
console.log(`Level ${paladin.level} - Unlocked abilities: ${paladin.unlockedAbilities.length}`);
console.log(`  - ${paladin.unlockedAbilities.join(', ')}`);
console.log(`Equipped: ${paladin.equippedAbilities.join(', ')}\n`);

// Level up to 20
console.log('--- Leveling to 20 ---');
const xpToLevel20 = calculateXpForLevel(20) - calculateXpForLevel(10);
awardXp(paladin, xpToLevel20);
console.log(`Level ${paladin.level} - Unlocked abilities: ${paladin.unlockedAbilities.length}`);
console.log(`  - ${paladin.unlockedAbilities.join(', ')}`);
console.log(`Equipped: ${paladin.equippedAbilities.join(', ')}\n`);

// Test with a high-level character created directly
console.log('=== HIGH-LEVEL CHARACTER TEST ===\n');
const highLevelRogue = createCharacter('Beta', 25, 'Veteran Rogue');
console.log(`Created: ${highLevelRogue.name} (Level ${highLevelRogue.level})`);
console.log(`Unlocked abilities: ${highLevelRogue.unlockedAbilities.length}`);
console.log(`  - ${highLevelRogue.unlockedAbilities.join(', ')}`);

// Verify level up unlocks missed abilities
console.log('\n--- Leveling to 26 (should unlock any missed) ---');
const xpToLevel26 = calculateXpForLevel(26);
awardXp(highLevelRogue, xpToLevel26);
console.log(`Level ${highLevelRogue.level} - Unlocked abilities: ${highLevelRogue.unlockedAbilities.length}`);
console.log(`  - ${highLevelRogue.unlockedAbilities.join(', ')}\n`);

console.log('✅ Test complete!');
console.log('\nExpected behavior:');
console.log('- Level 1-4: 1 ability');
console.log('- Level 5-9: 2 abilities');
console.log('- Level 10-19: 3 abilities');
console.log('- Level 20+: 4 abilities');
