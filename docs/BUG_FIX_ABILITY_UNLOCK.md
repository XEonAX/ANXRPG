# Bug Fix: Ability Auto-Unlock on Level Up

**Date**: October 23, 2025  
**Issue**: Characters only knew their starting ability despite leveling past the required levels for additional abilities  
**Status**: ✅ FIXED

## Problem Description

Players reported that after playing over 20 battles and leveling up significantly, their Paladin (Alpha) character still only knew "Righteous Strike" (the starting ability at level 1).

### Root Cause

The ability system had a disconnect between design and implementation:

1. **Abilities defined with level requirements**:
   - Level 1: Righteous Strike (alpha_strike)
   - Level 5: Guardian's Blessing (alpha_defend)
   - Level 10: Holy Smite (alpha_smite)
   - Level 20: Inspiring Aura (alpha_aura)

2. **BUT**: The `awardXp()` function in `character.ts` did NOT check for and unlock new abilities when characters leveled up.

3. **AND**: Skill tree nodes only provided stat bonuses and ability slot increases, not the base ability unlocks.

This meant characters would level up but never gain access to their higher-level abilities!

## Solution

Modified `src/systems/character.ts` to add automatic ability unlocking:

### Changes Made

1. **Added new function** `unlockAbilitiesByLevel()`:
   - Checks all abilities for the character's type
   - Unlocks any abilities where `requiredLevel <= character.level`
   - Automatically equips newly unlocked abilities if slots available

2. **Modified** `awardXp()`:
   - Now calls `unlockAbilitiesByLevel()` after each level up
   - Ensures abilities are unlocked immediately when level requirement is met

3. **Added imports**:
   - `getAbilitiesForCharacterType` from abilities data
   - `getMaxAbilitySlots` from skill tree system

## How It Works Now

When a character levels up:
1. Stats increase based on growth rates
2. Skill point is awarded
3. **NEW**: Check all abilities for the character type
4. **NEW**: Unlock any abilities with `requiredLevel <= current level`
5. **NEW**: Auto-equip newly unlocked abilities if slots available

## For Existing Save Games

**IMPORTANT**: If you have an existing save with characters above level 5/10/20:

### Option 1: Let them level up once more
- The next time your character gains a level, ALL abilities they should have will unlock
- Example: Level 22 Paladin gains 1 more level → unlocks all 4 abilities at once

### Option 2: Manual console fix (Advanced)
Open browser console and run:
```javascript
// Get your game state
const gameState = JSON.parse(localStorage.getItem('anxrpg_save'));

// Fix each character
gameState.roster.forEach(char => {
  // Import needed (you'll need to do this in the game context)
  // This will be fixed automatically on next level up
});
```

### Option 3: Start a new game (Recommended)
- Most reliable way to ensure all abilities unlock properly
- Characters will now gain abilities at levels 1, 5, 10, and 20

## Testing

To verify the fix works:

1. Start a new game or load existing save
2. Level up a character to level 5
3. Check Character Sheet → should see 2 abilities unlocked
4. Level to 10 → 3 abilities
5. Level to 20 → all 4 base abilities unlocked

## Future Enhancements

Potential improvements for later:
- Add visual notification when new abilities are unlocked
- Show "NEW!" badge on newly unlocked abilities in UI
- Add ability preview showing what unlocks at which level
- Consider adding ability unlock nodes in skill trees for 5th/6th abilities

## Related Files

- `src/systems/character.ts` - Core fix applied here
- `src/data/abilities.ts` - Ability definitions with requiredLevel
- `src/data/characterTypes.ts` - Starting abilities defined here
- `src/systems/skillTree.ts` - Ability slot increases

## All Character Ability Unlock Levels

### Alpha (Paladin)
- Level 1: Righteous Strike
- Level 5: Guardian's Blessing
- Level 10: Holy Smite
- Level 20: Inspiring Aura

### Beta (Rogue)
- Level 1: Quick Slash
- Level 5: Backstab
- Level 10: Smokescreen
- Level 20: Execute

### Gamma (Mage)
- Level 1: Arcane Bolt
- Level 5: Fireball
- Level 10: Frost Nova
- Level 20: Meteor Storm

### Delta (Warrior)
- Level 1: Power Slash
- Level 5: Cleave
- Level 10: Rending Strike
- Level 20: Rampage

### Epsilon (Cleric)
- Level 1: Healing Light
- Level 5: Regeneration
- Level 10: Divine Blessing
- Level 20: Mass Healing

### Zeta (Berserker)
- Level 1: Furious Strike
- Level 5: Bloodlust
- Level 10: Devouring Strike
- Level 20: Berserk

---

*This fix ensures the progression system works as designed - characters gain new abilities as they level up!*
