/**
 * Status Effects System Demo/Test
 * 
 * This file demonstrates and tests the status effects system
 * Run this in browser console to verify functionality
 */

import { createCharacter } from '../systems/character';
import {
  applyStatusEffect,
  processStatusEffectTicks,
  decrementStatusEffectDurations,
  calculateStatusEffectStatModifiers,
  hasStatusEffect,
  getEffectStacks,
  isUnderControlEffect,
  getStatusEffectsSummary,
} from '../systems/statusEffects';
import {
  ATTACK_BUFF,
  POISON,
  REGENERATION,
  STUN,
  BLOODLUST_BUFF,
  cloneStatusEffect,
} from '../data/statusEffects';

/**
 * Demo: Basic buff application
 */
export function demoBuffApplication() {
  console.log('=== Demo: Buff Application ===');
  
  const character = createCharacter('Alpha', 1);
  console.log('Initial ATK:', character.stats.atk);
  
  // Apply attack buff
  const result = applyStatusEffect(character, cloneStatusEffect(ATTACK_BUFF));
  console.log(result.message);
  
  // Calculate stats with buffs
  const modifiers = calculateStatusEffectStatModifiers(character);
  console.log('Flat ATK bonus:', modifiers.flatModifiers.atk);
  console.log('ATK multiplier:', modifiers.multipliers.atk);
  
  console.log('Active effects:', getStatusEffectsSummary(character));
  console.log('');
}

/**
 * Demo: DOT stacking
 */
export function demoDotStacking() {
  console.log('=== Demo: DOT Stacking ===');
  
  const character = createCharacter('Beta', 5);
  
  // Apply poison 3 times
  for (let i = 0; i < 3; i++) {
    const result = applyStatusEffect(character, cloneStatusEffect(POISON));
    console.log(`Stack ${i + 1}:`, result.message);
  }
  
  console.log('Poison stacks:', getEffectStacks(character, 'dot_poison'));
  
  // Process poison ticks
  const { damage } = processStatusEffectTicks(character, true);
  console.log('Poison damage dealt:', damage, 'HP');
  
  console.log('');
}

/**
 * Demo: HOT effects
 */
export function demoHealOverTime() {
  console.log('=== Demo: Heal Over Time ===');
  
  const character = createCharacter('Epsilon', 10);
  character.stats.hp = 50; // Reduce HP to see healing
  
  console.log('Initial HP:', character.stats.hp);
  
  // Apply regeneration
  applyStatusEffect(character, cloneStatusEffect(REGENERATION));
  
  // Simulate 3 turns
  for (let turn = 1; turn <= 3; turn++) {
    console.log(`\n--- Turn ${turn} ---`);
    
    const { healing, messages } = processStatusEffectTicks(character, true);
    messages.forEach(msg => console.log(msg));
    
    character.stats.hp = Math.min(character.stats.maxHp, character.stats.hp + healing);
    console.log('Current HP:', character.stats.hp);
    
    const expired = decrementStatusEffectDurations(character);
    expired.forEach(msg => console.log(msg));
  }
  
  console.log('');
}

/**
 * Demo: Control effects
 */
export function demoControlEffects() {
  console.log('=== Demo: Control Effects ===');
  
  const character = createCharacter('Gamma', 15);
  
  console.log('Can act?', !isUnderControlEffect(character));
  
  // Apply stun
  const result = applyStatusEffect(character, cloneStatusEffect(STUN));
  console.log(result.message);
  
  console.log('Can act?', !isUnderControlEffect(character));
  console.log('Is stunned?', hasStatusEffect(character, 'control_stun'));
  
  // Stun expires after 1 turn
  const expired = decrementStatusEffectDurations(character);
  console.log(expired[0]);
  
  console.log('Can act now?', !isUnderControlEffect(character));
  console.log('');
}

/**
 * Demo: Complex buff (Bloodlust)
 */
export function demoComplexBuff() {
  console.log('=== Demo: Complex Buff (Bloodlust) ===');
  
  const character = createCharacter('Zeta', 20);
  
  console.log('Base stats:');
  console.log('- ATK:', character.stats.atk);
  console.log('- DEF:', character.stats.def);
  console.log('- CRT:', character.stats.crt);
  
  // Apply bloodlust (increases ATK/CRT, decreases DEF)
  applyStatusEffect(character, cloneStatusEffect(BLOODLUST_BUFF));
  
  const { flatModifiers, multipliers } = calculateStatusEffectStatModifiers(character);
  
  console.log('\nBloodlust modifiers:');
  console.log('- ATK: +', flatModifiers.atk, ' × ', multipliers.atk);
  console.log('- DEF: ', flatModifiers.def, ' × ', multipliers.def);
  console.log('- CRT: +', flatModifiers.crt);
  
  console.log('\nActive effects:', getStatusEffectsSummary(character));
  console.log('');
}

/**
 * Demo: Full turn cycle
 */
export function demoFullTurnCycle() {
  console.log('=== Demo: Full Turn Cycle ===');
  
  const character = createCharacter('Delta', 12);
  character.stats.hp = 80; // Reduce HP
  
  // Apply various effects
  applyStatusEffect(character, cloneStatusEffect(ATTACK_BUFF));
  applyStatusEffect(character, cloneStatusEffect(POISON));
  applyStatusEffect(character, cloneStatusEffect(REGENERATION));
  
  console.log('Turn 0 - Effects applied');
  console.log('HP:', character.stats.hp);
  console.log('Active effects:', getStatusEffectsSummary(character));
  
  // Simulate 5 turns
  for (let turn = 1; turn <= 5; turn++) {
    console.log(`\n--- Turn ${turn} Start ---`);
    
    // Process effects that tick at turn start
    const { damage, healing, messages } = processStatusEffectTicks(character, true);
    messages.forEach(msg => console.log(msg));
    
    // Apply damage/healing
    character.stats.hp = Math.max(0, character.stats.hp - damage);
    character.stats.hp = Math.min(character.stats.maxHp, character.stats.hp + healing);
    console.log('HP after ticks:', character.stats.hp);
    
    // Character takes action here (simulated)
    console.log('(Character performs action...)');
    
    // End of turn: decrement durations
    const expired = decrementStatusEffectDurations(character);
    if (expired.length > 0) {
      console.log('\n--- Turn End ---');
      expired.forEach(msg => console.log(msg));
    }
    
    console.log('Remaining effects:', getStatusEffectsSummary(character));
  }
  
  console.log('\n=== Demo Complete ===\n');
}

/**
 * Run all demos
 */
export function runAllDemos() {
  demoBuffApplication();
  demoDotStacking();
  demoHealOverTime();
  demoControlEffects();
  demoComplexBuff();
  demoFullTurnCycle();
}

// Export for browser console usage
if (typeof window !== 'undefined') {
  (window as any).statusEffectsDemo = {
    runAllDemos,
    demoBuffApplication,
    demoDotStacking,
    demoHealOverTime,
    demoControlEffects,
    demoComplexBuff,
    demoFullTurnCycle,
  };
}
