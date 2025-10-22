# Feature: Click-to-Target Enemy Selection

## Overview
Implemented interactive enemy targeting system for single-target abilities. Players can now click on specific enemies to attack them, adding tactical depth to combat.

## How It Works

### Player Experience
1. **Click an ability button** (e.g., "Righteous Strike")
2. **Targeting mode activates**:
   - Enemy cards glow green with pulsing animation
   - Message appears: "🎯 Select target for [Ability Name]"
   - "🎯 Click to Target" appears on each alive enemy
   - Action panel shows "❌ Cancel Targeting" button
3. **Click an enemy** → ability executes on that target
4. **Or click "Cancel"** → returns to ability selection

### Visual Feedback
- **Targetable enemies**: Green glowing border with pulse animation
- **Hover effect**: Blue glow and scale increase (1.05x)
- **Dead enemies**: Greyed out (40% opacity, grayscale filter)
- **Cursor**: Changes to pointer on targetable enemies

## Implementation Details

### New State Management
```typescript
let targetingState: {
  active: boolean;
  ability: Ability | null;
  character: Character | null;
  combat: CombatState | null;
  uiState: UIGameState | null;
  stageNumber: number | undefined;
}
```

### Key Functions

#### `enterTargetingMode()`
- Sets targeting state
- Stores ability and character context
- Re-renders screen with targeting UI
- Shows notification: "🎯 Select a target"

#### `handleEnemyTargetClick(enemyId)`
- Validates targeting mode is active
- Executes ability on selected enemy
- Exits targeting mode automatically

#### `exitTargetingMode()`
- Clears targeting state
- Returns to normal ability selection

#### `executeAbilityWithTargets()`
- Shared execution function
- Handles ability execution
- Shows damage/healing notifications
- Checks for combat end
- Re-renders screen

### Modified Functions

**`handleAbilityClick()`**:
- Now checks if ability is `'single-enemy'` type
- Enters targeting mode instead of auto-executing
- Other ability types (AoE, self, ally) still auto-execute

**`renderEnemyCard()`**:
- Checks `targetingState.active` for targetable styling
- Adds click handler when targetable
- Shows "🎯 Click to Target" indicator
- Adds CSS classes: `--targetable`, `--dead`

**`renderActionPanel()`**:
- Shows targeting message when in targeting mode
- Displays "Cancel Targeting" button during targeting
- Hides ability buttons when targeting (simplifies UI)

## CSS Additions

### New Classes
```css
.combat-enemy-card--targetable {
  border-color: var(--success-color);
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.5);
  animation: targetPulse 1.5s ease-in-out infinite;
  transform: scale(1.02);
}

.combat-enemy-card--targetable:hover {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.7);
  transform: scale(1.05);
}

.combat-enemy-card--dead {
  opacity: 0.4;
  filter: grayscale(100%);
}

.combat-enemy-card__target-indicator {
  margin-top: var(--spacing-sm);
  padding: var(--spacing-xs);
  background: var(--success-color);
  color: var(--text-primary);
  text-align: center;
  font-weight: bold;
  font-size: var(--font-size-sm);
  border-radius: var(--radius-sm);
  animation: targetPulse 1.5s ease-in-out infinite;
}

@keyframes targetPulse {
  0%, 100% { 
    box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.5);
    opacity: 1;
  }
  50% { 
    box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.8);
    opacity: 0.9;
  }
}
```

## Ability Types Behavior

| Ability Type | Behavior |
|-------------|----------|
| `single-enemy` | **Click-to-target** - enters targeting mode |
| `all-enemies` / `aoe-enemies` | Auto-targets all alive enemies |
| `self` | Auto-targets caster |
| `single-ally` | Auto-targets first ally (future: click-to-target allies) |
| `all-allies` / `aoe-allies` | Auto-targets all player characters |

## Future Enhancements

### Potential Improvements
1. **Ally targeting**: Click-to-target for healing/buff abilities
2. **Keyboard shortcuts**: Number keys (1, 2, 3) to select enemies
3. **Enemy info tooltip**: Hover to see enemy stats/abilities
4. **Right-click cancel**: Cancel targeting with right-click
5. **Target preview**: Show damage prediction before confirming
6. **Target history**: Remember last targeted enemy for quick re-targeting

### Accessibility
- ✅ Visual feedback (color + animation)
- ✅ Clear cancel option
- ✅ No timing pressure (targeting persists until action)
- 🔄 Could add: Keyboard navigation (Tab to cycle targets, Enter to confirm)
- 🔄 Could add: Screen reader announcements

## Testing Scenarios

1. ✅ Single enemy battle: Click to target works
2. ✅ Multi-enemy battle: Can choose which enemy to attack
3. ✅ Cancel targeting: Returns to ability selection
4. ✅ Target dead enemy: Dead enemies not targetable
5. ✅ AoE abilities: Still auto-execute without targeting
6. ✅ Self-target abilities: Still auto-execute
7. ✅ Combat end during targeting: Exits targeting correctly

## Code Statistics
- **Lines Added**: ~150 lines TypeScript + 50 lines CSS
- **Functions Modified**: 3 (handleAbilityClick, renderEnemyCard, renderActionPanel)
- **Functions Added**: 4 (enterTargetingMode, handleEnemyTargetClick, exitTargetingMode, executeAbilityWithTargets)
- **CSS Classes Added**: 3 (--targetable, --dead, __target-indicator)

## Files Modified
- `/src/ui/CombatScreen.ts` - Targeting logic and UI
- `/src/style.css` - Targeting visual styles

---
*Feature Added: October 22, 2025*
*Type: UX Enhancement / Tactical Gameplay*
*Phase 11 Progress: 8/10 screens (80%)*
