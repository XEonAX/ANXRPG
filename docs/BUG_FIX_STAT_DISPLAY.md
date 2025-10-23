# Bug Fix: Stats Display (Character Sheet + Combat Screen)

**Date**: October 23, 2025  
**Type**: Bug Fix  
**Status**: ✅ Complete

## Issue

Both the Character Sheet and Combat Screen were displaying only base stats (stat × level) without showing bonuses from:
- Equipped items (8 equipment slots)
- Skill tree unlocks (stat bonuses from unlocked nodes)

This gave players inaccurate information about their character's actual combat effectiveness and made it impossible to see the impact of equipment and skill tree progression.

## Root Cause

The game had two separate issues:

1. **Character Sheet Display**: The `renderStatsSection()` function was reading `character.stats` directly instead of calling `calculateCurrentStats()` to show total stats with bonuses.

2. **Combat Stats (Core Issue)**: The `character.stats` property stored **base stats only**, calculated from character type + level. Equipment and skill tree bonuses were only calculated on-demand via `calculateCurrentStats()`, but never applied back to the character object. This meant:
   - Combat damage calculations used base stats
   - Combat screen displayed base stats
   - Equipment/skill tree bonuses only existed in temporary calculations

## Solution

### Part 1: Character Sheet Display Fix

**File**: `src/ui/CharacterSheetScreen.ts`

- Added `calculateCurrentStats()` call to get total stats including bonuses
- Created `formatStat()` helper to display: `Total (Base +Bonus)`
- Updated stats display to show both base and total values

### Part 2: Combat Stats Sync (Core Fix)

**Files Modified**: 
- `src/systems/character.ts` - Added `syncCharacterStats()` function
- `src/ui/CampaignMapScreen.ts` - Sync stats before combat
- `src/ui/CharacterSheetScreen.ts` - Sync stats when viewing

**Key Changes**:

1. **Fixed `calculateCurrentStats()`** (Line 66-72):
   ```typescript
   // OLD: Started with character.stats (base stats)
   const baseStats = { ...character.stats };
   
   // NEW: Recalculate from character type and level
   const characterType = CHARACTER_TYPES[character.type];
   const baseStats = calculateStatsAtLevel(
     characterType.baseStats,
     characterType.statGrowth,
     character.level
   );
   ```
   This ensures we always start from true base stats, not previously modified stats.

2. **Added `syncCharacterStats()` function** (Line 163-172):
   ```typescript
   export function syncCharacterStats(
     character: Character,
     equipmentInventory: Equipment[] = []
   ): void {
     const calculatedStats = calculateCurrentStats(character, equipmentInventory);
     const currentHp = character.stats.hp;
     character.stats = calculatedStats;
     character.stats.hp = Math.min(currentHp, calculatedStats.maxHp);
   }
   ```
   This updates the character's stats in-place with all bonuses applied, preserving current HP.

3. **Call sync before combat** (CampaignMapScreen.ts):
   ```typescript
   // Sync character stats with equipment bonuses before combat
   [...activeTeam, ...reserveTeam].forEach(character => {
     syncCharacterStats(character, uiState.saveData.inventory);
   });
   ```

4. **Call sync when viewing character sheet** (CharacterSheetScreen.ts):
   ```typescript
   // Sync character stats with current equipment and skill tree bonuses
   syncCharacterStats(character, uiState.saveData.inventory);
   ```

### Display Format

**Character Sheet - Before**:
```
ATK: 42
DEF: 74
```

**Character Sheet - After**:
```
ATK: 55 (42 +13)   ← Total with breakdown
DEF: 90 (74 +16)   ← Shows base + bonus
SPD: 46            ← No bonuses = just number
```

**Combat Screen - Before**:
- Used base stats for damage calculations
- Displayed base stats on character cards

**Combat Screen - After**:
- Uses total stats (with equipment/skill bonuses) for damage calculations
- Displays total stats on character cards
- Combat is now accurate to character's true power level

## Technical Details

### `calculateCurrentStats()` Function

This function (in `systems/character.ts`) applies bonuses in order:
1. **Base Stats**: Character stats at current level
2. **Skill Tree Bonuses**: Stat increases from unlocked nodes
3. **Equipment Bonuses**: Stat increases from equipped items (8 slots)
4. **Status Effects**: Temporary flat/multiplier modifiers
5. **Clamping**: Ensures stats stay within valid ranges

### Equipment System Integration

Equipment bonuses are calculated by `calculateEquipmentBonuses()`:
- Iterates through all 8 equipment slots
- Finds equipped items in inventory
- Sums all `statBonuses` arrays
- Returns total bonuses as `{ atk: X, def: Y, ... }`

### Skill Tree System Integration

Skill tree bonuses are calculated by `calculateSkillTreeBonuses()`:
- Iterates through `character.skillTreeNodes` (unlocked nodes)
- Finds nodes with `type: 'stat'`
- Sums all stat bonuses
- Returns `{ stats: { atk: X, maxHp: Y, ... }, unlockedAbilities: [...] }`

## Testing

✅ **Build Verification**: Successful (205.14 KB JS, 48.09 KB CSS)  
✅ **TypeScript**: Zero compilation errors  

**Manual Test Scenarios**:
1. ✅ Create character → stats show base values only
2. ✅ Equip items → Character Sheet shows bonuses, Combat uses bonuses
3. ✅ Unlock skill nodes → Stats reflect bonuses everywhere
4. ✅ Level up → Base stats increase, bonuses preserved
5. ✅ Enter combat → Character cards show total stats, damage calculations use total stats
6. ✅ Unequip items → Bonuses disappear, stats update correctly

## Impact

- **Combat Accuracy**: ✅ Damage calculations now use correct stats (with equipment/skill bonuses)
- **User Visibility**: ✅ Players see exact stats being used in combat
- **Balance Testing**: ✅ Equipment and skills now have visible impact
- **Player Experience**: ✅ Character progression feels meaningful and transparent

## Files Modified

**Core System**:
1. `src/systems/character.ts` - Fixed `calculateCurrentStats()`, added `syncCharacterStats()`

**UI Screens**:
2. `src/ui/CampaignMapScreen.ts` - Sync stats before combat starts
3. `src/ui/CharacterSheetScreen.ts` - Display bonuses, sync stats on view

**Documentation**:
4. `docs/BUG_FIX_STAT_DISPLAY.md` - This file

**Lines Changed**: ~60 lines across 3 files

## Related Systems

- **Character System** (`systems/character.ts`): Core stat management
  - `calculateCurrentStats()` - Compute total stats with all bonuses
  - `syncCharacterStats()` - Apply bonuses to character object in-place
  - `calculateStatsAtLevel()` - Get base stats for character type + level
- **Equipment System** (`systems/equipment.ts`): `calculateEquipmentBonuses()`
- **Skill Tree System** (`systems/skillTree.ts`): `calculateSkillTreeBonuses()`
- **Combat System** (`systems/combat.ts`): Uses character.stats for damage calculations
- **Damage System** (`systems/damage.ts`): Reads stats from character/enemy objects

## Architecture Notes

**Before Fix**:
```
Character.stats = base stats (level-dependent)
Combat reads character.stats → uses base stats ❌
```

**After Fix**:
```
Character.stats = base stats initially
syncCharacterStats() called before combat/display
  → Character.stats = base + equipment + skill tree ✅
Combat reads character.stats → uses total stats ✅
```

**When Stats Are Synced**:
- ✅ Before entering combat (CampaignMapScreen)
- ✅ When viewing character sheet (CharacterSheetScreen)
- ⚠️ NOT synced during normal gameplay (intentional - only sync when needed)

## Future Enhancements (Optional)

- Add color coding for bonuses (green for positive, red for negative)
- Show detailed breakdown tooltip (hover to see: "Base: X, Equipment: Y, Skills: Z")
- Display per-slot equipment contribution
- Highlight stats that changed after equipping/leveling

---

**Files Modified**: 1  
**Lines Changed**: ~40 lines (function signature + stat formatting logic)  
**Build Status**: ✅ Successful
