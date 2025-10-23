# Team Assignment Fix - Unassigned Characters

**Date**: October 23, 2025  
**Status**: ✅ Fixed  
**Issue**: Characters in roster but not assigned to Active/Reserve teams

## Problem

User had 6 characters in roster but only 4 assigned to teams:
- Active Team: 3/3 (full)
- Reserve Team: 1/3 (2 empty slots)
- Unassigned: 2 Zeta characters at level 1

**Root Cause**: When recruiting characters, if the reserve team is already full (3/3), new characters are added to the roster but remain unassigned. The Team Management UI had no way to assign these unassigned characters to teams.

## Solution

Enhanced the Team Management screen to:
1. **Detect unassigned characters** (in roster but not in activeTeamIds or reserveTeamIds)
2. **Show assignment buttons** for unassigned characters
3. **Add to Active Team** button (if active team has space)
4. **Add to Reserve Team** button (if reserve team has space)

## Changes Made

### TeamManagementScreen.ts

#### 1. Modified Character Card Rendering
```typescript
// Old: Only showed swap buttons for active/reserve characters
if (location === 'active' || location === 'reserve') {
  const swapBtn = createButton(...)
}

// New: Shows swap OR assign buttons based on character status
if (location === 'active' || location === 'reserve') {
  // Swap buttons for assigned characters
} else if (location === 'roster') {
  // Check if character is unassigned
  const isUnassigned = !uiState.activeTeamIds.includes(character.id) && 
                       !uiState.reserveTeamIds.includes(character.id);
  
  if (isUnassigned) {
    // Show "To Active" button if active team has space
    // Show "To Reserve" button if reserve team has space
  }
}
```

#### 2. Added New Handler Function
```typescript
function handleAssignToTeam(
  characterId: string, 
  targetTeam: 'active' | 'reserve', 
  uiState: UIGameState
): void
```

**Function Logic**:
- Find character in roster
- Verify character is not already assigned
- Check if target team has space (< 3 characters)
- Add character ID to appropriate team array
- Show success notification
- Refresh screen

## User Instructions

To assign your 2 unassigned Zeta characters:

1. **Go to Team Management** (you're already there!)
2. **Scroll to Full Roster section** (bottom)
3. **Find the 2 level-1 Zeta characters** (they're unassigned)
4. **Click "⬆️ To Active"** or **"⬇️ To Reserve"** buttons
5. Characters will appear in the selected team immediately

## UI Changes

### Before
```
Roster Character Card (Unassigned):
[Character Name] Lv X
HP: XXX/XXX
AP: X/10
[👁️ View]  <-- Only option
```

### After
```
Roster Character Card (Unassigned):
[Character Name] Lv X
HP: XXX/XXX
AP: X/10
[⬆️ To Active] [⬇️ To Reserve] [👁️ View]  <-- Assignment options!
```

### For Assigned Characters
```
Roster Character Card (Already Assigned):
[Character Name] Lv X
HP: XXX/XXX
AP: X/10
[👁️ View]  <-- No assign buttons shown
```

## Edge Cases Handled

1. **Team Full**: If target team is full, shows warning notification
2. **Already Assigned**: If character is already on a team, shows warning
3. **Character Not Found**: Error notification if character ID invalid
4. **Multiple Unassigned**: Both buttons show if both teams have space

## Related Systems

- **Recruitment System**: New characters now properly show assignment options if recruited when reserve is full
- **Swap System**: Existing swap functionality unchanged, works alongside new assignment feature
- **Save System**: Team assignments auto-save through UIState

## Testing Checklist

✅ Build succeeds without TypeScript errors  
✅ Hot-reload updated the page  
⏳ Manual test: Click "To Reserve" on unassigned Zeta characters  
⏳ Verify characters move to Reserve Team section  
⏳ Verify buttons disappear after assignment  

## Files Modified

1. **src/ui/TeamManagementScreen.ts**
   - Modified `renderCharacterCard()` button logic
   - Added `handleAssignToTeam()` function
   - +40 lines

---

**Fix Time**: ~15 minutes  
**Severity**: Medium (blocked user from using recruited characters)  
**User Impact**: Can now properly organize full 6-character roster into teams
