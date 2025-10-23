# Bug Fix: Stackable Status Effects Now Properly Multiply Effects

**Date**: October 23, 2025  
**Status**: ✅ Fixed and Verified

## Problem

Stackable status effects (like Poison, Burn, Regeneration) were only extending their duration when re-applied, **not multiplying their actual effects**. For example:
- Poison stack 1: 10 damage/turn ✓
- Poison stack 2: Still 10 damage/turn ❌ (should be 20)
- Poison stack 3: Still 10 damage/turn ❌ (should be 30)

## Root Cause

Two interconnected issues were discovered:

### Issue 1: Template Object Mutation
In `combat.ts`, when applying status effects from abilities, the code was passing the effect object **directly from the ability template** without cloning it:

```typescript
// OLD - BUGGY CODE
const { applied, message } = applyStatusEffect(
  target as CombatEntity, 
  statusEffect.effect  // ❌ Passing template directly!
);
```

This meant that when `applyStatusEffect` modified the effect object (adding `currentStacks`, updating values), it was **mutating the shared template object** that all future applications would use.

### Issue 2: Stacking Calculation Logic
The stacking logic in `statusEffects.ts` assumed it was receiving a fresh base effect each time, but due to Issue 1, it was receiving the already-modified template. This caused the multiplication to use incorrect base values.

## Solution

### Fix 1: Clone Effects Before Application (combat.ts)
Added import for `cloneStatusEffect` and clone the effect before passing to `applyStatusEffect`:

```typescript
// NEW - CORRECT CODE
import { cloneStatusEffect } from '../data/statusEffects';

// Later in the code...
const effectClone = cloneStatusEffect(statusEffect.effect);
const { applied, message } = applyStatusEffect(
  target as CombatEntity, 
  effectClone  // ✅ Passing a fresh clone!
);
```

### Fix 2: Clarify Stacking Logic (statusEffects.ts)
Updated the stacking logic to be more explicit that it expects base values:

```typescript
// Update stat modifiers based on stacks
// Important: effect parameter contains the BASE values (per stack)
if (effect.statModifiers) {
  existingEffect.statModifiers = effect.statModifiers.map(mod => ({
    stat: mod.stat,
    value: mod.value * existingEffect.currentStacks!,
    multiplier: mod.multiplier,
  }));
}

// Update DOT/HOT based on stacks
if (effect.damagePerTurn) {
  existingEffect.damagePerTurn = effect.damagePerTurn * existingEffect.currentStacks!;
}
if (effect.healPerTurn) {
  existingEffect.healPerTurn = effect.healPerTurn * existingEffect.currentStacks!;
}
```

## Verification

Created `src/tests/stackingTest.ts` to verify the fix:

### Test Results
```
=== STACKABLE STATUS EFFECTS TEST ===

--- Testing POISON Stacking ---
1st application: 10 damage/turn, 1 stack ✅
2nd application: 20 damage/turn, 2 stacks ✅
3rd application: 30 damage/turn, 3 stacks ✅

--- Testing BURN Stacking ---
1st application: 15 damage/turn, 1 stack ✅
2nd application: 30 damage/turn, 2 stacks ✅

--- Verifying Template Integrity ---
POISON template: 10 damage/turn (unchanged) ✅
BURN template: 15 damage/turn (unchanged) ✅
Template currentStacks: undefined (unchanged) ✅

✅ ALL TESTS PASSED!
```

## Impact

This fix affects all stackable status effects:

### Damage Over Time (DOT)
- **Poison** (max 5 stacks): Now properly scales from 10 → 50 damage/turn
- **Burn** (max 3 stacks): Now properly scales from 15 → 45 damage/turn
- **Bleed** (max 5 stacks): Now properly scales from 8 → 40 damage/turn

### Heal Over Time (HOT)
- **Regeneration** (max 3 stacks): Now properly scales from 20 → 60 healing/turn

### Stat Modifiers
Stackable buffs/debuffs with stat modifiers will now properly multiply their effects (if any are implemented in the future).

## Files Changed

1. **src/systems/combat.ts**
   - Added import for `cloneStatusEffect`
   - Clone status effects before applying them

2. **src/systems/statusEffects.ts**
   - Added clarifying comments about base values
   - Fixed TypeScript typing for stat modifier mapping

3. **src/tests/stackingTest.ts** (new)
   - Comprehensive test for stacking behavior
   - Verifies template integrity

## Game Balance Impact

This is a **significant buff** to DOT/HOT-based strategies:
- Characters/enemies with DOT abilities are now much more powerful when they can stack effects
- Multi-turn fights become more dangerous as DOT stacks accumulate
- May need to rebalance enemy HP or DOT base damage values

### Affected Character Types
- **Gamma (Mage)**: Likely has elemental DOT abilities
- **Epsilon (Cleric)**: Benefits from Regeneration stacking
- **Beta (Rogue)**: May have poison/bleed abilities

### Affected Enemies
Any enemy with stackable DOT abilities will now be significantly more threatening if they can apply effects multiple times.

## Testing Recommendations

1. ✅ Unit test verification (stackingTest.ts passes)
2. ⏳ Play through early stages to verify game balance
3. ⏳ Test boss battles with DOT-heavy characters
4. ⏳ Verify enemy DOT abilities don't become too overpowered
5. ⏳ Check that max stacks enforcement works (e.g., Poison caps at 5)

## Related Systems

- **Status Effects System** (`systems/statusEffects.ts`)
- **Combat System** (`systems/combat.ts`)
- **Damage Calculation** (DOT damage is applied via `processStatusEffectTicks`)
- **UI Display** (status effect badges should show stack count)

---

*This fix ensures stackable status effects work as originally designed, making DOT/HOT strategies viable and strategic.*
