# Bug Fix: Defeat Healing and Single Character Defeat

**Date**: October 23, 2025  
**Status**: ✅ Complete  
**Phase**: 11 (UI Implementation) - Bug Fixes

## Issues Identified

### Issue #1: No Healing After Defeat
**Problem**: When the player loses a battle, characters are not healed. Only victories trigger automatic healing between battles.

**Impact**: Players who lose battles must manually heal or enter the next battle with reduced HP, creating an unfair difficulty spiral.

### Issue #2: Single Character Game Stuck
**Problem**: When a player has only 1 character (no reserve team) and that character dies, the game could get stuck in an unclear state.

**Impact**: Players with a single character roster cannot properly experience defeat and return to the campaign map.

## Root Causes

### Issue #1 Root Cause
In `BattleResultsScreen.ts`, the healing logic was only triggered on victory:
```typescript
if (isVictory && stageNumber) {
  // Fully restore all characters after victory (heal HP and AP)
  uiState.saveData.roster.forEach(char => {
    fullyRestoreCharacter(char);
  });
  // ... other victory logic
}
```

Additionally, defeat was handled in `CombatScreen.ts` by returning directly to the campaign map without going through the battle results screen, bypassing any healing logic.

### Issue #2 Root Cause
The combat system in `combat.ts` already handled this correctly:
- When all active team members die, it checks for alive reserve members
- If `aliveReserve.length > 0`, sets `phase = 'team-wipe'` (offers swap)
- If `aliveReserve.length === 0`, sets `phase = 'defeat'` (immediate defeat)

However, the UI flow in `CombatScreen.ts` was bypassing the battle results screen on defeat, going straight back to campaign map.

## Solutions Implemented

### Fix #1: Unified Battle Results Flow
**File**: `src/ui/CombatScreen.ts`

Changed defeat handling to navigate to battle results screen instead of directly to campaign:

```typescript
} else if (combat.phase === 'defeat') {
  // Reset selected target on defeat
  selectedTarget = null;
  
  // Navigate to battle results to show defeat screen
  setTimeout(() => {
    EventBus.emit(GameEvents.COMBAT_END);
    ScreenManager.navigateTo('battleResults', { 
      combat, 
      uiState, 
      stage: stageNumber 
    });
  }, 1500);
}
```

**Before**: Defeat → Campaign Map (no healing, no battle results screen)  
**After**: Defeat → Battle Results Screen → Campaign Map (with healing)

### Fix #2: Healing on Both Victory and Defeat
**File**: `src/ui/BattleResultsScreen.ts`

Moved healing logic outside the victory-only condition:

```typescript
const continueBtn = createButton(
  isVictory ? '➡️ Continue' : '⬅️ Return to Campaign',
  () => {
    // Fully restore all characters after battle (heal HP and AP) - whether victory or defeat
    uiState.saveData.roster.forEach(char => {
      fullyRestoreCharacter(char);
    });
    
    if (isVictory && stageNumber) {
      // Mark stage as complete, save progress
      completeStage(...);
      showNotification('✅ Party fully healed! Progress saved!', 'success');
    } else {
      // Defeat - just save the healing
      saveGame(uiState.saveData);
      EventBus.emit(GameEvents.GAME_SAVED);
      showNotification('✅ Party fully healed!', 'success');
    }
    
    // Return to campaign map
    ScreenManager.navigateTo('campaignMap', { uiState });
  },
  'btn btn--primary btn--large'
);
```

**Key Changes**:
1. Healing now happens for **both** victory and defeat
2. Victory still records stage completion and XP/loot
3. Defeat now saves the post-healing state
4. Both paths show appropriate notifications

## Testing Scenarios

### Test Case 1: Defeat with Multiple Characters
1. Start battle with 2-3 active characters
2. Let all active characters die (with or without reserve)
3. **Expected**: Battle results screen shows defeat, all roster characters healed
4. **Verified**: ✅ Works correctly

### Test Case 2: Defeat with Single Character
1. Start new game with only 1 character in roster
2. Enter battle and let character die
3. **Expected**: Combat system sets `phase = 'defeat'`, navigates to battle results, character healed
4. **Verified**: ✅ Works correctly (combat.ts already handles this properly)

### Test Case 3: Victory Healing (Regression Check)
1. Win a battle
2. **Expected**: Characters healed, stage completed, progress saved
3. **Verified**: ✅ Still works as before

### Test Case 4: Reserve Swap Flow (Unchanged)
1. Active team dies but reserve has alive characters
2. **Expected**: Reserve swap dialog appears (unchanged behavior)
3. **Verified**: ✅ Not affected by changes

## Files Modified

1. **src/ui/CombatScreen.ts** (Line 598-611)
   - Changed defeat navigation from campaign map to battle results screen
   
2. **src/ui/BattleResultsScreen.ts** (Line 73-109)
   - Moved healing logic to execute for both victory and defeat
   - Added defeat-specific save and notification

## Game Design Impact

### Positive Changes
- **Fairer progression**: Players aren't punished twice for defeat (lose battle AND lose HP)
- **Consistent UX**: All battles end with the battle results screen
- **Better feedback**: Defeat screen shows what happened before returning to campaign
- **Single character viability**: Players can safely play with just 1 character

### No Breaking Changes
- Victory flow unchanged
- Reserve swap dialog still appears when appropriate
- XP and loot rewards still only given on victory
- Stage progression still only on victory

## Future Considerations

### Optional Penalties (Not Implemented)
If desired for balance, could add optional defeat penalties:
- Partial healing instead of full (e.g., 50% HP restore)
- Gold/resource cost for healing after defeat
- Equipment durability loss
- XP penalty

These can be added via game settings if needed.

## Related Documentation

- See `FEATURE_AUTO_HEAL_BETWEEN_BATTLES.md` for original healing implementation
- See `COMBAT_SCREEN_BUG_FIXES.md` for previous combat system fixes
- See `PHASE_11_COMBAT_SESSION.md` for combat screen development

---

**Bug Severity**: Medium (annoying but not game-breaking)  
**Fix Complexity**: Low (simple logic reorganization)  
**Impact**: High (improves player experience significantly)  
**Status**: ✅ **RESOLVED**
