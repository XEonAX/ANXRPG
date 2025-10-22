# Feature Added: Auto-Healing Between Battles

**Date**: October 22, 2025  
**Issue**: No healing between battles - characters retained damage  
**Status**: ✅ IMPLEMENTED

---

## Problem

Players had no way to heal between battles:
- Characters retained HP damage from previous fights
- No rest/camp mechanic existed
- Would need to use Cleric healing DURING combat (inefficient)
- Could lead to death spiral (getting weaker each battle)

**Missing from Game Design**: The original GAME_DESIGN.md didn't specify between-battle healing mechanics.

---

## Solution

**Auto-restore all characters to full HP and AP after victory:**

```typescript
// In BattleResultsScreen.ts - Continue button handler
if (isVictory && stageNumber) {
  // Mark stage as complete
  completeStage(...);
  
  // NEW: Fully restore all characters after victory (heal HP and AP)
  uiState.saveData.roster.forEach(char => {
    fullyRestoreCharacter(char);
  });
  
  // Auto-save
  saveGame(uiState.saveData);
  
  // Updated notification
  showNotification('✅ Party fully healed! Progress saved!', 'success');
}
```

---

## How It Works

### After Victory:
1. ✅ XP awarded to all characters
2. ✅ Equipment loot added to inventory
3. ✅ **NEW: All characters fully restored (HP + AP)**
4. ✅ Progress saved
5. ✅ Notification: "Party fully healed! Progress saved!"

### What Gets Restored:
- **HP**: Set to `maxHp` (full health)
- **AP**: Set to `maxAp` (full action points)
- **isAlive**: Set to `true` (revives dead characters)
- **Applies to**: ALL 6 characters in roster (active + reserve)

### After Defeat:
- No healing (return to campaign map with current HP/AP)
- Players can retry with damaged team or swap characters

---

## Design Decision: Full Restore vs Partial

**Chosen**: Full restore (100% HP/AP) after victory

**Rationale**:
1. **Player-Friendly**: No tedious resource management between battles
2. **Strategic Focus**: Strategy is IN combat, not resource conservation
3. **Faster Gameplay**: Players can chain battles without downtime
4. **Consistent with Genre**: Most turn-based RPGs restore after battles
5. **No Rest Mechanic**: Game doesn't have a "camp" or "rest" system
6. **Preserves Challenge**: Difficulty is per-battle, not attrition-based

**Alternative Considered**: Partial restore (50% HP)
- Rejected: Adds tedium without strategic depth
- Would require adding rest/camp mechanics

---

## Implementation Details

### Function Used
```typescript
// From src/systems/character.ts
export function fullyRestoreCharacter(character: Character): void {
  character.stats.hp = character.stats.maxHp;
  const characterType = CHARACTER_TYPES[character.type];
  character.currentAp = characterType.maxAp;
  character.isAlive = true;
}
```

### When It Happens
- **Trigger**: Clicking "Continue" button on Battle Results screen after victory
- **Before**: Stage completion, loot distribution
- **After**: Auto-save, navigation to Campaign Map

### Files Modified
1. `src/ui/BattleResultsScreen.ts`:
   - Added import: `fullyRestoreCharacter`
   - Added restoration loop in continue button handler
   - Updated notification message

---

## User Experience

### Before (Broken)
```
Battle 1: Win with 50% HP remaining
Battle 2: Start with 50% HP → Harder
Battle 3: Start with 20% HP → Very hard
Battle 4: Death
```

### After (Fixed)
```
Battle 1: Win with 50% HP remaining → Fully healed!
Battle 2: Start with 100% HP → Normal difficulty
Battle 3: Start with 100% HP → Normal difficulty
Battle 4: Start with 100% HP → Normal difficulty
```

---

## Strategic Implications

### During Combat (Unchanged)
- HP management still critical
- Cleric healing still valuable
- Tank positioning still important
- Reserve swaps still strategic

### Between Battles (NEW)
- ✅ No attrition pressure
- ✅ Can experiment with strategies
- ✅ No penalty for close victories
- ✅ Encourages aggressive play

---

## Testing Checklist

✅ Win a battle → Click Continue → Check roster HP/AP (should be full)  
✅ Win with low HP → Verify full restore  
✅ Dead characters → Verify revival  
✅ Reserve characters → Verify they also get healed  
✅ Notification displays "Party fully healed!"  
✅ Auto-save includes restored HP/AP  
✅ Load save → Verify characters are fully healed  

---

## Future Enhancements (Optional)

If needed for balance, could add:
1. **Hard Mode**: 50% restore between battles
2. **Rest Mechanic**: Manual healing at campaign map (costs gold/time)
3. **Consumables**: Healing potions for between-battle use
4. **Inn System**: Pay to rest and heal

**Current Stance**: Full auto-restore is appropriate for base game difficulty.

---

## Documentation Updates

### Added to Game Design
Should add to GAME_DESIGN.md:
```markdown
### Between-Battle Healing
- After victory, all characters are fully restored (100% HP and AP)
- Dead characters are revived
- Applies to entire roster (active + reserve)
- No healing after defeat (encourages strategic retreat)
```

---

**Implemented**: October 22, 2025  
**Version**: 1.2.2  
**Impact**: Major QoL improvement, makes game more accessible  
**Build Status**: ✅ Compiles successfully (173.68 KB JS)
