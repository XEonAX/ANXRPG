# Feature: Auto-End Turn When Out of AP

**Date**: October 23, 2025  
**Status**: ✅ IMPLEMENTED

## Overview

Added automatic turn ending when a character runs out of AP during combat. This streamlines gameplay by removing the need to manually click "End Turn" when you've used all your action points.

## How It Works

When a player uses an ability that reduces their AP to exactly 0:
1. The ability executes normally
2. A notification appears: "⚡ Out of AP - Turn ended automatically"
3. After 800ms delay, the turn automatically ends
4. Combat proceeds to the next combatant

## User Experience

### Before
```
Character has 2 AP remaining
→ Uses 2 AP ability
→ Character now has 0 AP
→ All ability buttons grayed out
→ Player must manually click "End Turn"
```

### After
```
Character has 2 AP remaining
→ Uses 2 AP ability
→ Character now has 0 AP
→ Notification: "Out of AP - Turn ended automatically"
→ Turn ends after brief delay
→ Next combatant's turn begins
```

## Implementation Details

### Modified File
- `src/ui/CombatScreen.ts`

### Changes in `executeAbilityWithTargets()`
```typescript
// After ability execution, check if character has 0 AP
if (combat.phase === 'active' && currentCombatant?.type === 'player') {
  const character = currentCombatant.character;
  if (character && character.currentAp === 0) {
    // Show notification
    showNotification('⚡ Out of AP - Turn ended automatically', 'info');
    
    // Auto-end turn after 800ms delay
    setTimeout(() => {
      endCharacterTurn(combat, uiState, stageNumber);
    }, 800);
    return;
  }
}
```

## Why 800ms Delay?

The delay serves multiple purposes:
1. **Visual Feedback**: Gives player time to see the damage/healing notification
2. **User Awareness**: Shows the "Out of AP" notification clearly
3. **Smooth Transition**: Prevents jarring instant turn changes
4. **Combat Log**: Allows combat log to update before next turn

## Edge Cases Handled

✅ **Partial AP Use**: If character has 3 AP and uses 2 AP ability, turn continues normally (1 AP remaining)

✅ **Exact AP Use**: If character has 2 AP and uses 2 AP ability, turn auto-ends

✅ **Combat End**: If ability kills all enemies/causes victory, combat ends normally (no auto-end turn)

✅ **Enemy Turns**: Only applies to player turns, not enemy AI

✅ **Manual End Turn**: Player can still manually end turn if they have remaining AP

## Benefits

1. **Faster Combat Flow**: Reduces clicks needed per battle
2. **Better UX**: Intuitive - no point staying in a turn with no actions available
3. **Less Tedious**: Especially helpful in longer battles with many characters
4. **Clear Feedback**: Notification explains what happened

## Testing

To test this feature:
1. Start a battle with any character
2. Use abilities until exactly 0 AP remains
3. Verify notification appears
4. Verify turn ends automatically after ~800ms
5. Verify next combatant's turn begins

Example test scenario:
- Paladin (3 AP regen/turn)
- Turn 1: Use 2 AP ability → 1 AP left → turn continues
- Turn 1: Use 1 AP ability → 0 AP left → **AUTO-END TURN**

## Future Enhancements

Potential improvements:
- Add setting to toggle auto-end turn on/off
- Configurable delay duration
- Different notification styles for auto-end vs manual end
- Skip delay if player presses Enter/Space during wait period

## Related Features

- Multi-action combat system (Phase 6)
- AP regeneration system
- Combat UI (Phase 11)
- Keyboard shortcuts (1-9 for abilities, Enter to end turn)

---

*This feature completes the combat flow improvements for a smoother player experience!*
