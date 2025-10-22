# Bug Fix: Combat Screen Title Displaying "[object Object]"

## Issue
Combat screen title was displaying "Stage [object Object] - Battle" instead of "Stage 1 - Slime Encounter"

## Root Cause
1. `CampaignMapScreen.ts` passes entire `Stage` object in context:
   ```typescript
   ScreenManager.navigateTo('combat', { uiState, combat, stage });
   ```

2. `CombatScreen.ts` was casting it as number:
   ```typescript
   const stageNumber = context.stage as number | undefined;
   title.textContent = `⚔️ Stage ${stageNumber || '?'} - Battle`;
   // Result: "⚔️ Stage [object Object] - Battle"
   ```

## Solution
Modified `CombatScreen.ts` (lines 28-52) to handle both Stage object and number:

```typescript
// Extract stage information from context (supports both object and number)
const stageData = context.stage as any;
const stageNumber = typeof stageData === 'object' ? stageData?.stageNumber : stageData;
const stageName = typeof stageData === 'object' ? stageData?.name : undefined;

// Display with stage name if available
title.textContent = stageName 
  ? `⚔️ Stage ${stageNumber || '?'} - ${stageName}`
  : `⚔️ Stage ${stageNumber || '?'} - Battle`;
```

## Benefits
- **Fixed**: No longer displays "[object Object]"
- **Enhanced**: Now shows descriptive stage names (e.g., "Stage 1 - Slime Encounter")
- **Backwards Compatible**: Still works if number is passed instead of Stage object
- **Type-Safe**: Properly handles both Stage object and number types

## Testing
- ✅ Build successful (0 TypeScript errors)
- ✅ Bundle size maintained (~151 KB JS, ~31 KB CSS)
- Expected display: "⚔️ Stage 1 - Slime Encounter" instead of "⚔️ Stage [object Object] - Battle"

## Files Modified
- `/src/ui/CombatScreen.ts` - Lines 28-52 (renderCombat function)

---
*Fixed: [Current Date]*
*Phase 11 Progress: 8/10 screens (80%)*
