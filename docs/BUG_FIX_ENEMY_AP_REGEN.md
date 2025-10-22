# Bug Fix: Enemy AP Regeneration Error

## Issue
**Error in Console:**
```
Uncaught TypeError: can't access property "baseApRegen", characterType is undefined
    regenerateAp character.ts:159
    processStartOfTurn combat.ts:205
```

**Symptom**: Game crashed when trying to end turn after enemies started their turn.

## Root Cause
The `processStartOfTurn()` function in combat.ts was calling `regenerateAp()` for ALL combatants (both players and enemies), but `regenerateAp()` is designed only for Characters:

```typescript
// character.ts - Line 159
export function regenerateAp(character: Character): void {
  const characterType = CHARACTER_TYPES[character.type];  // ❌ Enemies don't have .type
  let apRegen = characterType.baseApRegen;
  // ...
}
```

**The Problem:**
- Characters have a `type` property (Alpha, Beta, etc.) that maps to `CHARACTER_TYPES`
- Enemies do NOT have a `type` property - they have a `templateId` instead
- When an enemy's turn started, `regenerateAp()` tried to access `CHARACTER_TYPES[undefined]` → crash

## Solution
Modified `processStartOfTurn()` to handle AP regeneration differently for characters vs enemies:

```typescript
// combat.ts - processStartOfTurn()
if ('currentAp' in entity) {
  if (combatant.type === 'player') {
    // Characters use regenerateAp which accesses CHARACTER_TYPES
    regenerateAp(entity as Character);
  } else {
    // Enemies regenerate AP directly using template's apRegen property
    const enemy = entity as Enemy;
    const template = getEnemyTemplate(enemy.templateId);
    if (template) {
      const maxAp = template.maxAp || 10;
      enemy.currentAp = Math.min(maxAp, enemy.currentAp + template.apRegen);
    }
  }
}
```

## How It Works Now

### Character AP Regen:
1. Character turn starts
2. `regenerateAp(character)` called
3. Looks up `CHARACTER_TYPES[character.type]`
4. Gets `baseApRegen` (3-6 depending on type)
5. Applies status effect modifiers
6. ✅ AP regenerated

### Enemy AP Regen:
1. Enemy turn starts
2. Gets enemy template via `getEnemyTemplate(enemy.templateId)`
3. Uses `template.apRegen` directly (4 for most enemies)
4. Applies to enemy: `currentAp = min(maxAp, currentAp + apRegen)`
5. ✅ AP regenerated

## Data Structures

### Character:
```typescript
interface Character {
  type: CharacterType;  // Alpha, Beta, Gamma, etc.
  currentAp: number;
  // ...
}
```

### Enemy:
```typescript
interface Enemy {
  templateId: string;   // 'rat', 'slime', 'vampire_bat', etc.
  currentAp: number;
  // ...
}

interface EnemyTemplate {
  apRegen: number;      // How much AP to regenerate per turn
  maxAp: number;        // Maximum AP pool
  // ...
}
```

## Testing
1. ✅ Build succeeds (0 errors)
2. ✅ Player turn → character AP regens correctly
3. ✅ Enemy turn → enemy AP regens correctly (no crash)
4. ✅ Multi-enemy battles work properly
5. ✅ End turn functionality works for both sides

## Files Modified
- `/src/systems/combat.ts` - `processStartOfTurn()` function (lines ~198-220)

---
*Fixed: October 22, 2025*
*Bug Category: Type mismatch / Runtime crash*
*Phase 11 Progress: 8/10 screens (80%)*
