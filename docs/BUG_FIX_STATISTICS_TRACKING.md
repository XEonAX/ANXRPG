# Bug Fix: Statistics Tracking Not Working

## Problem
The Settings screen showed all statistics as 0, even after completing battles. Statistics like `totalBattles`, `totalVictories`, `totalDamageDealt`, etc. were never being updated. Additionally, defeats were not persisting after battles.

## Root Causes
1. **Missing Statistics Updates**: The `BattleResultsScreen.ts` was not updating the player statistics (`SaveData.statistics`) after battles. It was only updating campaign progress but completely skipping statistics tracking.

2. **Save Synchronization Issue**: The game was only saving to manual save (not auto-save) after battles, but then loading from auto-save later, causing statistics to revert to old values.

## Solution
Added comprehensive statistics tracking to the `processResults()` function in `BattleResultsScreen.ts`:

### Statistics Now Tracked:
1. **Total Battles** - Incremented after every battle (victory or defeat)
2. **Total Victories** - Incremented on victory
3. **Total Defeats** - Incremented on defeat
4. **Enemies Defeated** - Counts defeated enemies (checks `enemy.isAlive`)
5. **Bosses Defeated** - Incremented on boss battles (stage % 10 === 0)
6. **Equipment Obtained** - Tracks loot drops count
7. **Highest Level Reached** - Updates from roster's highest level
8. **Total Damage Dealt** - Parsed from combat log messages
9. **Total Healing Done** - Parsed from combat log messages

### Implementation Details:
- Statistics update happens in `processResults()` before save
- Damage/healing are parsed from combat log messages using regex:
  - Damage: `"[Target] takes X damage!"` format
  - Healing: `"[Target] recovers X HP!"` or `"[Name] heals for X HP from lifesteal!"` formats
- Only player character actions count toward damage/healing stats
  - Damage: Checks if `actorId` belongs to player team
  - Healing abilities: Checks if `targetIds` include player characters
  - Lifesteal: Checks if `actorId` belongs to player team
- Works for both victory and defeat outcomes
- **Saves to BOTH manual save and auto-save** to prevent data loss:
  ```typescript
  saveGame(uiState.saveData, false); // Manual save
  saveGame(uiState.saveData, true);  // Auto-save
  ```
- This ensures statistics persist regardless of which save is loaded later

## Testing
1. Start a new game or continue existing save
2. Complete a battle (win or lose)
3. Open Settings screen
4. Verify Statistics section shows non-zero values

## Files Modified
- `/src/ui/BattleResultsScreen.ts`
  - Added statistics tracking to `processResults()` function
  - Tracks 10 different statistics per battle
  - Parses combat log for damage/healing values

## Related Types
- `PlayerStatistics` interface in `/src/types/save.ts`
- `CombatLogEntry` interface in `/src/types/combat.ts`
- `Enemy` interface in `/src/types/enemy.ts`

## Status
✅ **Fixed and Tested** - Statistics now properly track all battle metrics

---

*Fixed: October 23, 2025*
