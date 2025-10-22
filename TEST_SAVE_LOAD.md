# Save/Load Fix - Campaign Map Issue

## Problem Identified
The Campaign Map wasn't loading because `CampaignProgress` contains `Set<number>` and `Map<number, number>` which don't serialize properly with `JSON.stringify()`.

When saving:
```javascript
completedStages: Set([1, 2, 3])  // Becomes {} in JSON
victoriesPerStage: Map([[1, 5]]) // Becomes {} in JSON
```

## Solution Implemented
Modified `/src/utils/storage.ts`:

1. **saveGame()** - Convert Set/Map to arrays before serialization:
```typescript
const serializable = {
  ...saveData,
  campaign: {
    ...saveData.campaign,
    completedStages: Array.from(saveData.campaign.completedStages),
    victoriesPerStage: Array.from(saveData.campaign.victoriesPerStage.entries()),
  },
};
```

2. **loadGame()** - Restore Set/Map from arrays after parsing:
```typescript
if (data.campaign) {
  data.campaign.completedStages = new Set(data.campaign.completedStages || []);
  data.campaign.victoriesPerStage = new Map(data.campaign.victoriesPerStage || []);
}
```

3. **getSaveMetadata()** - Handle both array and Set formats
4. **migrateSaveData()** - Ensure proper Set/Map structures during migration

## Testing Instructions
1. Open http://localhost:5174 in browser
2. Open browser console (F12)
3. Clear old saves: `localStorage.clear()`
4. Refresh page
5. Click "New Game" and create a character
6. Navigate: Main Menu → Team Management → Campaign Map
7. Campaign map should now display all 100 stages!

## Files Modified
- `/src/utils/storage.ts` - Fixed Set/Map serialization
- `/src/ui/CampaignMapScreen.ts` - Added debug logging

## Next Steps
- Test save/load cycle (save game, reload page, continue)
- Verify campaign progress persists correctly
- Remove debug console.logs from CampaignMapScreen after verification
