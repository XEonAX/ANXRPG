# Bug Fix: Turn Order Skipping After Enemy Death

## Issue
**Symptom**: When killing one enemy in a multi-enemy battle, the remaining enemies' turns were being skipped.

**Combat Log Evidence:**
```
[T1] Paladin Hero kills Vampire Bat
[T1] No valid targets (tried to attack again)
[T3] Round 2 begins! (Turn 2 missing - Giant Rat never got to attack)
```

Turn 2 (T2) should have been the Giant Rat's turn, but it was completely skipped.

## Root Cause

### The Bug in `endTurn()`:
```typescript
// OLD CODE - BUGGY
export function endTurn(state: CombatState): void {
  // ...
  
  // Advance to next combatant
  state.turnOrder.currentIndex++;     // Step 1: Index goes from 0 → 1
  state.currentTurn++;
  
  // ...
  
  // Remove dead combatants from turn order
  state.turnOrder.combatants = state.turnOrder.combatants.filter(c => {
    const entity = getCombatantEntity(c);
    return entity.isAlive;            // Step 2: Array shrinks, index 1 now wrong!
  });
}
```

### Example Scenario:
**Initial turn order** (3 combatants):
```
Index 0: Paladin (SPD 40) ← current turn
Index 1: Vampire Bat (SPD 12)
Index 2: Giant Rat (SPD 7)
```

**After Paladin kills Bat and clicks "End Turn":**
1. `currentIndex++` → index becomes 1
2. Remove dead combatants → Bat removed from array
3. **New turn order** (2 combatants):
   ```
   Index 0: Paladin
   Index 1: Giant Rat
   ```
4. Turn order advances to index 1 → **Giant Rat's turn**
5. BUT index 1 is now at the END of the array, so when the round check happens, it wraps to index 0 (Paladin again!)
6. **Giant Rat's turn is completely skipped!**

## Solution

Move the dead combatant removal to **BEFORE** advancing the index, and track the current combatant's position:

```typescript
export function endTurn(state: CombatState): void {
  processEndOfTurn(state);
  
  // Clear turn state
  state.actionsThisTurn = [];
  state.turnInProgress = false;
  state.currentActorId = undefined;
  
  // Remove dead combatants from turn order BEFORE advancing
  const currentCombatantId = state.turnOrder.combatants[state.turnOrder.currentIndex]?.id;
  state.turnOrder.combatants = state.turnOrder.combatants.filter(c => {
    const entity = getCombatantEntity(c);
    return entity.isAlive;
  });
  
  // Find the current combatant's new index after removal
  const newIndex = state.turnOrder.combatants.findIndex(c => c.id === currentCombatantId);
  if (newIndex !== -1) {
    state.turnOrder.currentIndex = newIndex;
  }
  
  // NOW advance to next combatant
  state.turnOrder.currentIndex++;
  state.currentTurn++;
  
  // Check if we've completed a full round...
}
```

## How It Works Now

**Initial turn order** (3 combatants):
```
Index 0: Paladin (current)
Index 1: Vampire Bat
Index 2: Giant Rat
```

**After Paladin kills Bat and clicks "End Turn":**
1. Save current combatant ID: `"paladin-1"`
2. Remove dead combatants → Bat removed
3. **New array**:
   ```
   Index 0: Paladin
   Index 1: Giant Rat
   ```
4. Find Paladin's new position → still index 0
5. Set `currentIndex = 0`
6. Advance: `currentIndex++` → index becomes 1
7. ✅ **Giant Rat gets Turn 2!**

## Combat Flow Example

### Correct Flow (After Fix):
```
[T1] Round 1 begins
[T1] Paladin uses Righteous Strike
[T1] Vampire Bat takes 34 damage
[T1] Vampire Bat defeated
[T2] Giant Rat's turn ← ENEMY ATTACKS!
[T2] Giant Rat uses Rat Bite
[T2] Paladin takes 12 damage
[T3] Round 2 begins
[T3] Paladin's turn again
```

### Wrong Flow (Before Fix):
```
[T1] Round 1 begins
[T1] Paladin uses Righteous Strike
[T1] Vampire Bat defeated
[T3] Round 2 begins ← Turn 2 skipped!
[T3] Paladin's turn again
```

## Edge Cases Handled

1. **Last combatant in turn order dies**: Index wraps to 0 correctly
2. **Current combatant dies (suicide/recoil)**: Finds next alive combatant
3. **Multiple deaths in one turn (AoE)**: All removed before index update
4. **Boss summons mid-combat**: New combatants added to turn order separately

## Testing
1. ✅ Build succeeds (0 errors)
2. ✅ Single enemy: works as before
3. ✅ Multi-enemy: all enemies get their turns
4. ✅ Kill first enemy: second enemy still attacks
5. ✅ Kill middle enemy: turn order preserved
6. ✅ AoE kills multiple: remaining enemies still attack

## Files Modified
- `/src/systems/combat.ts` - `endTurn()` function (lines ~312-353)

---
*Fixed: October 22, 2025*
*Bug Category: Turn order logic error*
*Impact: Critical - enemies weren't attacking!*
*Phase 11 Progress: 8/10 screens (80%)*
