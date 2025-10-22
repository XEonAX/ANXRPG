# Bug Fix: Auto-Victory Complete Fix (Combat System)

## Issue
Even with UI-level `checkCombatEnd()` calls, battles were not auto-ending when all enemies were defeated. Players still had to manually click "End Turn" after victory.

**Root Cause Discovery:**
The UI was calling `checkCombatEnd()` which checks `combat.phase === 'victory'`, but the **combat system** (`executeAbility()`) was not calling `checkBattleEnd()` to actually SET `phase = 'victory'`.

## The Two-Layer Problem

### Layer 1: UI (Already Fixed)
**File**: `/src/ui/CombatScreen.ts`

Added `checkCombatEnd()` calls after:
- Ability execution (`handleAbilityClick`)
- Manual turn end (`endCharacterTurn`)
- Enemy turn (`processEnemyTurn`)

This checks IF combat has ended and navigates to results screen.

### Layer 2: Combat System (NEW FIX)
**File**: `/src/systems/combat.ts`

**Problem**: `executeAbility()` did NOT call `checkBattleEnd()` after executing an ability. The battle end check only happened in `endTurn()`, which required manual "End Turn" click.

**Solution**: Added `checkBattleEnd(state)` at the end of `executeAbility()`:

```typescript
// In executeAbility() function - after all ability effects processed
state.actionsThisTurn.push({
  type: 'ability',
  actorId: actor.id,
  abilityId,
  targetIds,
});

// Check if battle ended after ability execution (e.g., all enemies defeated)
checkBattleEnd(state);  // <-- NEW LINE

return result;
```

## How It Works Now

### When Player Defeats Last Enemy:
1. `executeAbility()` processes damage
2. Enemy `isAlive = false`
3. **NEW**: `checkBattleEnd()` detects all enemies dead
4. Sets `combat.phase = 'victory'`
5. UI's `checkCombatEnd()` detects phase change
6. Navigates to Battle Results screen (1.5s delay)
7. ✅ **No "End Turn" needed!**

### When Enemy Defeats Last Player:
1. `executeAbility()` processes damage
2. Character `isAlive = false`
3. **NEW**: `checkBattleEnd()` detects all players dead
4. Sets `combat.phase = 'team-wipe'` or `'defeat'`
5. UI triggers reserve swap dialog or defeat screen
6. ✅ **Instant response!**

## Code Changes

### `/src/systems/combat.ts` (Line ~618)
```diff
  state.actionsThisTurn.push({
    type: 'ability',
    actorId: actor.id,
    abilityId,
    targetIds,
  });
  
+ // Check if battle ended after ability execution (e.g., all enemies defeated)
+ checkBattleEnd(state);
  
  return result;
}
```

### `/src/ui/CombatScreen.ts` (Already Fixed Previously)
```typescript
// In handleAbilityClick() - Line ~398
checkCombatEnd(combat, uiState, stageNumber);

// In endCharacterTurn() - Line ~410
checkCombatEnd(combat, uiState, stageNumber);

// In processEnemyTurn() - Line ~462
checkCombatEnd(combat, uiState, stageNumber);
```

## Testing
1. ✅ Build succeeds (0 errors)
2. ✅ Player defeats all enemies mid-turn → auto-victory
3. ✅ Enemy defeats all players → auto-defeat/reserve swap
4. ✅ Multi-action combat → victory triggers on final blow
5. ✅ No more "No valid targets" messages after victory

## Impact
- **User Experience**: Battles now feel polished and responsive
- **Code Quality**: Victory detection happens at correct layer (combat system)
- **Consistency**: Works for all ability types and situations
- **Performance**: No impact (single function call after each ability)

---
*Fixed: October 22, 2025*
*Files Modified: 2 (combat.ts, CombatScreen.ts)*
*Phase 11 Progress: 8/10 screens (80%)*
