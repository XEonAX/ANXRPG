# Bug Fix: Auto-Victory When All Enemies Defeated

## Issue
After defeating all enemies during a character's turn, the player still had to manually click "End Turn" to trigger victory. This created a poor UX where the battle was clearly won but required an extra click.

**User Report:**
```
Combat Log
[T1]Paladin Hero uses Righteous Strike!
[T1]Vampire Bat takes 34 physical damage!
[T1]Vampire Bat has been defeated!
[T1]Paladin Hero uses Righteous Strike!
[T1]No valid targets for Righteous Strike!
[T1]Paladin Hero uses Righteous Strike!
[T1]No valid targets for Righteous Strike!

"after all enemies are defeated, I still need to end turn?"
```

## Root Cause
The `checkCombatEnd()` function was only called:
1. Once after initial combat screen render (line 81)
2. After manually clicking "End Turn"

It was **NOT** called after:
- Ability execution (`handleAbilityClick`)
- Enemy turn completion (`processEnemyTurn`)

This meant the combat phase remained 'active' even when all enemies were defeated, requiring manual turn end.

## Solution
Added `checkCombatEnd()` calls after every action that could end combat:

### 1. After Ability Execution
```typescript
// In handleAbilityClick() - after ability execution
// Check if combat ended after ability execution
checkCombatEnd(combat, uiState, stageNumber);

// Re-render combat screen with updated state (only if combat hasn't ended)
if (combat.phase === 'active') {
  ScreenManager.updateContext({ combat, uiState, stage: stageNumber });
}
```

### 2. After Manual Turn End
```typescript
// In endCharacterTurn()
function endCharacterTurn(combat: CombatState, uiState: UIGameState, stageNumber?: number): void {
  endTurn(combat);
  
  // Check if combat ended
  checkCombatEnd(combat, uiState, stageNumber);
  
  // Re-render to show next combatant (only if combat hasn't ended)
  if (combat.phase === 'active') {
    ScreenManager.updateContext({ combat, uiState, stage: stageNumber });
  }
}
```

### 3. After Enemy Turn
```typescript
// In processEnemyTurn()
// End enemy turn
endTurn(combat);

// Check if combat ended after enemy turn
checkCombatEnd(combat, uiState, stageNumber);

// Re-render (only if combat hasn't ended)
if (combat.phase === 'active') {
  ScreenManager.updateContext({ combat, uiState, stage: stageNumber });
}
```

## Benefits
- ✅ **Instant Victory**: Battle ends immediately when last enemy is defeated
- ✅ **Better UX**: No need to manually end turn after victory is achieved
- ✅ **Prevents Errors**: Avoids "No valid targets" messages on abilities after victory
- ✅ **Consistent**: Works for player abilities, enemy abilities, and manual turn ends
- ✅ **Safe Re-renders**: Only re-renders if combat is still active (prevents navigation conflicts)

## Testing Scenarios
1. ✅ Player defeats all enemies with ability → auto-victory
2. ✅ Enemy defeats all players → auto-defeat/reserve swap
3. ✅ Player manually ends turn when enemies alive → normal flow continues
4. ✅ Multi-action: defeat enemies mid-turn → victory triggers immediately

## Files Modified
- `/src/ui/CombatScreen.ts`:
  - `handleAbilityClick()` - Added checkCombatEnd after ability execution
  - `endCharacterTurn()` - Added checkCombatEnd after manual turn end
  - `processEnemyTurn()` - Added checkCombatEnd after enemy turn

---
*Fixed: October 22, 2025*
*Phase 11 Progress: 8/10 screens (80%)*
