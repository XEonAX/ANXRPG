/**
 * Test to verify stackable status effects properly stack their effects
 */

import { createCharacter } from '../systems/character';
import { applyStatusEffect } from '../systems/statusEffects';
import { POISON, BURN, cloneStatusEffect } from '../data/statusEffects';

console.log('\n=== STACKABLE STATUS EFFECTS TEST ===\n');

const character = createCharacter('Alpha', 1, 'Test Character');

console.log('Character created:', character.name);
console.log('Initial HP:', character.stats.maxHp);
console.log('\n--- Testing POISON Stacking ---');

// Apply poison first time (10 dmg/turn)
const result1 = applyStatusEffect(character, cloneStatusEffect(POISON));
console.log('1st application:', result1.message);
console.log('Expected damage/turn: 10');
console.log('Actual damage/turn:', character.statusEffects[0]?.damagePerTurn);
console.log('Stacks:', character.statusEffects[0]?.currentStacks);

// Apply poison second time (should stack to 20 dmg/turn)
const result2 = applyStatusEffect(character, cloneStatusEffect(POISON));
console.log('\n2nd application:', result2.message);
console.log('Expected damage/turn: 20 (2 stacks × 10)');
console.log('Actual damage/turn:', character.statusEffects[0]?.damagePerTurn);
console.log('Stacks:', character.statusEffects[0]?.currentStacks);

// Apply poison third time (should stack to 30 dmg/turn)
const result3 = applyStatusEffect(character, cloneStatusEffect(POISON));
console.log('\n3rd application:', result3.message);
console.log('Expected damage/turn: 30 (3 stacks × 10)');
console.log('Actual damage/turn:', character.statusEffects[0]?.damagePerTurn);
console.log('Stacks:', character.statusEffects[0]?.currentStacks);

console.log('\n--- Testing BURN Stacking ---');

const character2 = createCharacter('Beta', 1, 'Test Character 2');

// Apply burn first time (15 dmg/turn)
const burn1 = applyStatusEffect(character2, cloneStatusEffect(BURN));
console.log('1st application:', burn1.message);
console.log('Expected damage/turn: 15');
console.log('Actual damage/turn:', character2.statusEffects[0]?.damagePerTurn);
console.log('Stacks:', character2.statusEffects[0]?.currentStacks);

// Apply burn second time (should stack to 30 dmg/turn)
const burn2 = applyStatusEffect(character2, cloneStatusEffect(BURN));
console.log('\n2nd application:', burn2.message);
console.log('Expected damage/turn: 30 (2 stacks × 15)');
console.log('Actual damage/turn:', character2.statusEffects[0]?.damagePerTurn);
console.log('Stacks:', character2.statusEffects[0]?.currentStacks);

// Verify original templates are not modified
console.log('\n--- Verifying Template Integrity ---');
console.log('POISON template damagePerTurn (should be 10):', POISON.damagePerTurn);
console.log('BURN template damagePerTurn (should be 15):', BURN.damagePerTurn);
console.log('POISON template currentStacks (should be undefined):', POISON.currentStacks);
console.log('BURN template currentStacks (should be undefined):', BURN.currentStacks);

console.log('\n=== TEST COMPLETE ===\n');

if (character.statusEffects[0]?.damagePerTurn === 30 &&
    character.statusEffects[0]?.currentStacks === 3 &&
    character2.statusEffects[0]?.damagePerTurn === 30 &&
    character2.statusEffects[0]?.currentStacks === 2 &&
    POISON.damagePerTurn === 10 &&
    BURN.damagePerTurn === 15 &&
    POISON.currentStacks === undefined &&
    BURN.currentStacks === undefined) {
  console.log('✅ ALL TESTS PASSED!');
  console.log('✅ Stackable effects now properly multiply their effects!');
  console.log('✅ Template objects are not mutated!');
} else {
  console.log('❌ TESTS FAILED - Check the output above');
}
