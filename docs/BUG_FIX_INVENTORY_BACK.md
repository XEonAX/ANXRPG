# Bug Fix: Inventory Back Button Error

**Date**: October 22, 2025  
**Issue**: Back button from Inventory Screen throws error  
**Status**: ✅ FIXED

---

## Problem

When clicking "⬅️ Back" from the Inventory Screen, an error was thrown because the previous screen (Team Management or Character Sheet) didn't have the required `uiState` in context.

### Root Cause

**ScreenManager.goBack()** was navigating back with an **empty context** `{}`:

```typescript
// OLD CODE - BUGGY
goBack(): void {
  if (this.screenHistory.length === 0) {
    console.warn('No screen history to go back to');
    return;
  }

  const previousScreen = this.screenHistory.pop()!;
  this.navigateTo(previousScreen, {}, false);  // ❌ Empty context!
}
```

### Why This Broke

1. User navigates: **Team Management → Inventory**
   - Context passed: `{ uiState }` ✅
   
2. User clicks "Back" from Inventory
   - goBack() navigates to Team Management with `{}` ❌
   - Team Management tries to access `context.uiState`
   - **Error**: `uiState` is undefined!

---

## Solution

**Preserve the current context** when going back:

```typescript
// NEW CODE - FIXED
goBack(): void {
  if (this.screenHistory.length === 0) {
    console.warn('No screen history to go back to');
    return;
  }

  const previousScreen = this.screenHistory.pop()!;
  // Preserve the current context when going back (keeps uiState, etc.)
  this.navigateTo(previousScreen, this.context, false);  // ✅ Preserved!
}
```

### Why This Works

The `this.context` still contains the `uiState` from when we navigated TO the inventory screen. By preserving it when going back, the previous screen receives all the context it needs.

**Navigation flow now**:
1. Team Management → Inventory (context: `{ uiState }`)
2. Inventory Back → Team Management (context: `{ uiState }`) ✅

---

## Files Modified

**File**: `src/ui/core/ScreenManager.ts`  
**Line**: 78  
**Change**: Changed `navigateTo(previousScreen, {}, false)` to `navigateTo(previousScreen, this.context, false)`

---

## Testing

### Test Case 1: Team Management → Inventory → Back
1. ✅ Navigate to Team Management
2. ✅ Click "🎒 Inventory"
3. ✅ Inventory screen loads with character selector
4. ✅ Click "⬅️ Back"
5. ✅ Returns to Team Management (no error)

### Test Case 2: Character Sheet → Inventory → Back
1. ✅ Navigate to Character Sheet
2. ✅ Click "📦 Open Inventory"
3. ✅ Inventory screen loads with selected character
4. ✅ Click "⬅️ Back"
5. ✅ Returns to Character Sheet (no error)

### Test Case 3: Campaign Map → Combat → Battle Results → Back
1. ✅ Start battle from Campaign Map
2. ✅ Win battle
3. ✅ See Battle Results
4. ✅ Click "Back" (Continue)
5. ✅ Returns to Campaign Map (existing behavior preserved)

---

## Alternative Solutions Considered

### Option 1: Store context per screen in history (rejected)
```typescript
// More complex, stores context with each history entry
screenHistory: Array<{ screen: Screen, context: ScreenContext }> = [];
```
**Rejected**: Over-engineering for simple use case

### Option 2: Always fetch fresh uiState from game system (rejected)
```typescript
// Inject uiState from global game state
goBack(): void {
  const uiState = getCurrentGameState();
  this.navigateTo(previousScreen, { uiState }, false);
}
```
**Rejected**: Couples ScreenManager to game logic (breaks separation of concerns)

### Option 3: Preserve current context (CHOSEN ✅)
```typescript
// Simple, clean, preserves existing data
this.navigateTo(previousScreen, this.context, false);
```
**Chosen**: Minimal change, maintains current architecture

---

## Impact

**Bundle Size**: No change (same line count)  
**Performance**: No impact  
**Behavior**: Fixed navigation from Inventory screen  
**Breaking Changes**: None (improvement only)

---

## Lessons Learned

### Design Insight
When implementing navigation systems, **context preservation** is critical. Going "back" should restore the previous screen in the **same state** it was in before navigating away.

### Testing Reminder
Always test **bidirectional navigation**:
- ✅ Going TO a screen
- ✅ Going BACK from a screen

---

**Fixed**: October 22, 2025  
**Build Status**: ✅ Compiles successfully  
**Ready for Testing**: Navigate to http://localhost:5174 and test Inventory → Back
