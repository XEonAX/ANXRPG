# Bug Fix: Team Assignments Now Persist Between Sessions

**Date**: October 23, 2025  
**Status**: ✅ Fixed and Verified

## Problem

Team assignments (active team vs reserve team) were not being saved to LocalStorage. When players:
1. Arranged their characters into active/reserve teams
2. Saved the game
3. Reloaded the page or continued their game

All team assignments would be **reset to defaults** (first character active, next 3 in reserve), losing the player's carefully arranged team composition.

## Root Cause

The `activeTeamIds` and `reserveTeamIds` arrays were stored only in the **runtime UIState** (`src/ui/core/UIState.ts`), but were **not part of the SaveData structure** (`src/types/save.ts`). This meant:

1. Team assignments existed only in memory during the current session
2. When saving to LocalStorage, team IDs were not included
3. When loading a save, new team IDs were generated using default logic
4. Player's team arrangements were permanently lost

## Solution

### Changes Made

#### 1. Added Team IDs to SaveData Type (`src/types/save.ts`)
```typescript
export interface SaveData {
  // ... existing fields ...
  
  /** Active team character IDs (1-3) */
  activeTeamIds: string[];
  
  /** Reserve team character IDs (up to 3) */
  reserveTeamIds: string[];
}
```

#### 2. Initialize Team IDs in New Game (`src/systems/game.ts`)
```typescript
const saveData: SaveData = {
  // ... existing fields ...
  activeTeamIds: [starterChar.id], // Starter in active
  reserveTeamIds: [], // Empty reserve initially
};
```

#### 3. Updated UIState Initialization (`src/ui/core/UIState.ts`)
- Now uses team IDs from save data instead of generating new ones
- Includes fallback for legacy saves without team assignments
- Automatically migrates old saves to new format

```typescript
export function initializeUIState(saveData: SaveData): UIGameState {
  let activeTeamIds = saveData.activeTeamIds || [];
  let reserveTeamIds = saveData.reserveTeamIds || [];
  
  // Fallback for legacy saves
  if (activeTeamIds.length === 0 && reserveTeamIds.length === 0) {
    activeTeamIds = [saveData.roster[0].id];
    reserveTeamIds = saveData.roster.slice(1, 4).map(c => c.id);
    // Update save data
    saveData.activeTeamIds = activeTeamIds;
    saveData.reserveTeamIds = reserveTeamIds;
  }
  // ...
}
```

#### 4. Synced Team Changes to SaveData
All functions that modify team assignments now sync back to saveData:

**UIState Functions:**
- `swapCharacter()` - Syncs after swapping
- `addToActiveTeam()` - Syncs after adding
- `addToReserveTeam()` - Syncs after adding

**TeamManagementScreen:**
- Added `syncTeamIdsToSaveData()` helper function
- All drag-drop operations sync team IDs
- Button-based team assignments sync team IDs

**RecruitmentScreen:**
- New recruits added to reserve now sync to saveData

#### 5. Storage Migration (`src/utils/storage.ts`)
Updated `migrateSaveData()` to handle legacy saves:
```typescript
// Determine team assignments (with fallback for legacy saves)
let activeTeamIds = data.activeTeamIds || [];
let reserveTeamIds = data.reserveTeamIds || [];

// Fallback for legacy saves
if (activeTeamIds.length === 0 && data.roster.length > 0) {
  activeTeamIds = [data.roster[0].id];
  reserveTeamIds = data.roster.slice(1, 4).map(c => c.id);
}
```

## Files Modified

1. **src/types/save.ts**
   - Added `activeTeamIds` and `reserveTeamIds` to SaveData interface

2. **src/systems/game.ts**
   - Initialize team IDs in `initializeNewGame()`

3. **src/ui/core/UIState.ts**
   - Updated `initializeUIState()` to use saved team IDs
   - Added sync calls to `swapCharacter()`, `addToActiveTeam()`, `addToReserveTeam()`

4. **src/ui/TeamManagementScreen.ts**
   - Added `syncTeamIdsToSaveData()` helper
   - Updated all drag-drop handlers in `handleDrop()`
   - Updated `handleAssignToTeam()` to sync

5. **src/ui/RecruitmentScreen.ts**
   - Added sync when adding new recruit to reserve

6. **src/utils/storage.ts**
   - Updated `migrateSaveData()` to handle legacy saves

## Backward Compatibility

✅ **Full backward compatibility maintained!**

Legacy saves (without team IDs) are automatically migrated:
1. First character goes to active team
2. Characters 2-4 go to reserve team
3. Remaining characters stay unassigned
4. Migration happens transparently on load
5. Next save will include team IDs

## Testing Checklist

- [x] New game: Team assignments persist
- [x] Drag-drop: Changes saved to LocalStorage
- [x] Button swaps: Changes saved to LocalStorage
- [x] Recruitment: New characters stay in reserve
- [x] Legacy saves: Auto-migrate without errors
- [x] Page reload: Team composition preserved
- [x] Manual save/load: Teams preserved correctly

## Verification Steps

To verify the fix works:

1. **Start new game** → Arrange teams → Save
2. **Reload page** → Load game → Teams should match arrangement ✓
3. **Move characters** between active/reserve → Save
4. **Reload page** → Load game → Changes should persist ✓
5. **Check LocalStorage** in DevTools:
   ```json
   {
     "activeTeamIds": ["char-id-1", "char-id-2"],
     "reserveTeamIds": ["char-id-3"]
   }
   ```

## Impact

- **No data loss**: Players' team compositions are now permanently saved
- **Better UX**: No frustration from losing team arrangements
- **Strategic depth**: Players can plan long-term team compositions
- **Quality of life**: Teams stay organized across sessions

## Related Issues

This fix also ensures:
- Combat system uses correct team composition
- Reserve swaps work correctly across sessions
- Character sheet navigation shows correct team status
- Campaign battles use intended team setup

---

*Team assignments are now a first-class part of the save system, ensuring players' strategic decisions are preserved.*
