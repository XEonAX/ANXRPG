# ANXRPG - AI Coding Agent Instructions

## Project Overview
ANXRPG is a web-based turn-based fighting RPG with deep character progression, 6 character types, 100 stages, and comprehensive equipment/skill systems. Built with **Vite + TypeScript**, no frameworks, pure semantic HTML UI, and LocalStorage persistence.

## Architecture & Tech Stack
- **Build**: Vite 5.x with TypeScript strict mode (ES2022 target)
- **Frontend**: Pure TypeScript + semantic HTML (no React/Vue/etc.)
- **Styling**: Minimal CSS (add later)
- **Storage**: Browser LocalStorage for save data
- **Deployment**: Static site (GitHub Pages/Netlify ready)

## Project Structure (Planned)
```
src/
├── types/          # TypeScript interfaces (character, equipment, ability, enemy, combat, status)
├── systems/        # Core engines (combat, damage, progression, equipment, campaign, statusEffects)
├── data/           # Static definitions (characterTypes, abilities, equipment, enemies, stages)
├── ui/             # UI rendering modules (combat, team, character, campaign, messages)
└── utils/          # Helpers (random, formulas, nameGenerator, storage)
```

## Critical Game Mechanics

### Character System (6 Types)
- **Alpha (Paladin)**: Tank/Off-Healer, +3 AP/turn
- **Beta (Rogue)**: Crit DPS, +6 AP/turn, high SPD
- **Gamma (Mage)**: AoE/Elemental, +4 AP/turn
- **Delta (Warrior)**: Physical DPS, +4 AP/turn
- **Epsilon (Cleric)**: Healer/Support, +5 AP/turn
- **Zeta (Berserker)**: High Risk/Reward, +5 AP/turn

**Stats**: HP, ATK, DEF, MAG, RES, SPD, CRT (crit %), EVA (dodge %), ACC (accuracy %)

### Combat Flow
1. **Turn Order**: Speed-based between teams, player chooses order within team (one-time at battle start)
2. **Multi-Action**: Characters use multiple abilities per turn if AP available
   - Sequential ability selection → "end turn" option → AP tracking
3. **AP System**: Base 3 AP/turn + character-specific regen, max 10 AP pool
4. **Reserve System**: When active team (1-3 chars) wiped → swap reserve (up to 3) at next round start
   - Player can accept defeat instead of swapping
   - Reserve HP/AP preserved across battles

### Damage Formulas (CRITICAL)
```typescript
// Physical: (ATK * abilityMultiplier) - (targetDEF * 0.5)
// Magical:  (MAG * abilityMultiplier) - (targetRES * 0.5)
// Critical: Multiply final damage by 2.0 if random(1,100) <= CRT
// Hit/Miss: hitChance = clamp(ACC - (EVA * 0.5), 5, 95)
//   - Some abilities have guaranteed hit flag (ignore ACC/EVA)
// Optional Variance: ±10% (can be disabled)
```

### Equipment System
- **8 Slots**: Main Hand, Off Hand, Head, Chest, Legs, Neck, Wrist×2
- **Equipment Levels**: Drop at stage number, require matching character level to equip
- **Drops**: Max 1 per enemy defeated (can be 0)
- **Storage**: Unlimited inventory, UI option to hide unwanted items

### Skill Trees (MANDATORY)
- ~20 nodes per character type, linear progression
- 1 skill point per level up, some nodes need multiple points
- Each node: EITHER stat bonus OR new ability (not both)
- Can unlock 5th, 6th+ ability slots

### Progression
- **Leveling**: Equal XP to all 6 characters (active + reserve) after victory
- **Recruitment**: Every 20 battle victories → choose new character (duplicates allowed)
  - At 100 victories: option to retire existing character
  - New recruits start at level 1
- **Stages**: 100 total, bosses every 10th stage

### Enemy System
- **Team Size**: 1-3 enemies, flexible levels (e.g., 3×level 1 at stage 5)
- **Boss Summons**: Solo boss → summon up to 2 minions at HP thresholds/turns
- **7 Tiers**: Slimes→Rats (1-10) → Goblins (11-20) → ... → Gods (91-100)

## Development Conventions

### TypeScript Patterns
- **Strict mode required** - all types explicit, no `any`
- Use `interface` for data shapes, `type` for unions/intersections
- Character types use Greek alphabet naming: Alpha, Beta, Gamma, etc.
- Status effects use enum/union types for type safety

### Data Flow
1. `data/` defines static templates (character types, abilities, enemy templates)
2. `systems/` contains stateful engines (combat state, progression, equipment manager)
3. `ui/` renders game state to HTML (no business logic)
4. `utils/storage.ts` handles serialization/deserialization

### Code Organization Rules
- Combat logic in `systems/combat.ts` - handles turn order, action resolution
- Damage calculation isolated in `systems/damage.ts` - applies formulas from design doc
- Status effects managed in `systems/statusEffects.ts` - handles duration, stacking, expiration
- Equipment bonuses applied in `systems/equipment.ts` - modifies character stats
- Campaign progression in `systems/campaign.ts` - stage unlocking, victory tracking

### Naming Conventions
- **Types**: PascalCase (`CharacterType`, `AbilityEffect`)
- **Functions**: camelCase (`calculateDamage`, `applyStatusEffect`)
- **Constants**: UPPER_SNAKE_CASE for configs (`MAX_AP_POOL`, `BASE_AP_REGEN`)
- **Interfaces**: Prefix with `I` if distinguishing from class (`ICharacter` vs `Character`)

### UI/HTML Conventions
**Semantic HTML Structure**: No frameworks, pure HTML rendered by TypeScript

#### Component Organization Pattern
```typescript
// ui/combat.ts - Example structure
export function renderCombatScreen(gameState: GameState): HTMLElement {
  const container = document.createElement('div');
  container.className = 'combat-screen';
  
  container.appendChild(renderTeamPanel(gameState.playerTeam));
  container.appendChild(renderEnemyPanel(gameState.enemies));
  container.appendChild(renderActionPanel(gameState.activeCharacter));
  container.appendChild(renderCombatLog(gameState.combatLog));
  
  return container;
}
```

#### HTML Element Guidelines
- **Class naming**: BEM-style preferred (`combat-screen__team-panel--active`)
- **Data attributes**: Use for game state tracking (`data-character-id="alpha-1"`)
- **Accessibility**: Always include ARIA labels for screen readers
- **Event delegation**: Attach listeners to parent containers, not individual buttons

#### Standard UI Components
```html
<!-- Character Card -->
<div class="character-card" data-character-id="${char.id}">
  <h3 class="character-card__name">${char.name}</h3>
  <div class="character-card__stats">
    <progress class="hp-bar" value="${char.hp}" max="${char.maxHp}"></progress>
    <span class="hp-text">${char.hp}/${char.maxHp} HP</span>
    <div class="ap-counter">${char.currentAP}/${char.maxAP} AP</div>
  </div>
  <div class="character-card__abilities">...</div>
  <div class="character-card__status-effects">...</div>
</div>

<!-- Action Button -->
<button class="action-btn" 
        data-action-type="ability" 
        data-ability-id="${ability.id}"
        data-ap-cost="${ability.apCost}">
  ${ability.name} (${ability.apCost} AP)
</button>

<!-- Combat Message -->
<div class="combat-log__message combat-log__message--${messageType}">
  <span class="timestamp">[Turn ${turnNumber}]</span>
  <span class="message-text">${messageText}</span>
</div>
```

#### Screen Layout Architecture
1. **Main Menu**: Character selection, load game, new game
2. **Team Management**: Active team (1-3), reserve (up to 3), swap UI
3. **Character Sheet**: Stats table, equipment slots grid, abilities list, skill tree
4. **Equipment Inventory**: Filterable list, equip/unequip actions, hide toggle
5. **Campaign Map**: Stage list with progress indicators, locked/unlocked states
6. **Combat Screen**: Split layout (player left, enemies right), action bar bottom, log sidebar
7. **Battle Results**: Victory/defeat message, rewards list, level-up notifications

## Key Development Workflows

### Running the Project
```bash
npm run dev         # Start Vite dev server
npm run build       # Production build
npm run preview     # Test production build
```

### Adding New Character Type
1. Define in `data/characterTypes.ts` with base stats + AP regen
2. Create 4 abilities in `data/abilities.ts` (unlock at levels 1, 5, 10, 20)
3. Design skill tree (~20 nodes) with stat bonuses OR abilities
4. Update character factory in `systems/character.ts`

### Adding New Ability
**⚠️ Important**: While the game design specifies 4 abilities per character type (24 total), specific abilities are not yet defined. When creating abilities:
1. **Ask the user for approval** on proposed ability concepts before implementing
2. Design abilities that fit character archetypes (e.g., Paladin = defensive/healing, Rogue = fast/critical-focused)
3. Balance AP costs with power level (1-4 AP typical)
4. Ensure variety in target types and effects per character

```typescript
// In data/abilities.ts
{
  id: 'ability_id',
  name: 'Ability Name',
  apCost: 3,
  targetType: 'single' | 'aoe' | 'self' | 'ally',
  guaranteedHit: boolean,  // true = ignore ACC/EVA
  damageType: 'physical' | 'magical',
  damageMultiplier: 1.5,
  statusEffects: [...],
  description: 'Flavor text'
}
```

### Implementing Boss Battle
1. Define boss template in `data/enemies.ts` with enhanced stats (×2.5 multiplier)
2. Add summon triggers in boss AI logic:
   - HP thresholds (75%, 50%, 25%)
   - Turn intervals (every X turns)
   - Max 2 minions summoned simultaneously
3. Summoned minions = standard enemies (weaker than boss)

## Common Pitfalls & Solutions

### ❌ Don't: Mix combat logic in UI rendering
```typescript
// Bad: ui/combat.ts
function renderAttack(attacker, target) {
  const damage = attacker.atk - target.def; // NO
  target.hp -= damage;
}
```
✅ **Do**: Keep UI pure, call system functions
```typescript
// Good: ui/combat.ts
function renderAttack(attacker, target) {
  const result = combatSystem.executeAttack(attacker, target);
  displayDamageMessage(result.damage);
}
```

### ❌ Don't: Hardcode formulas outside systems/damage.ts
✅ **Do**: Centralize all damage/stat calculations in `systems/damage.ts` and `utils/formulas.ts`

### ❌ Don't: Forget hit/miss checks
✅ **Do**: Always check `guaranteedHit` flag → use ACC/EVA formula if false → AP consumed regardless

### ❌ Don't: Create equipment without level requirements
✅ **Do**: Equipment level = stage number it drops from, must match char level to equip

## Testing Strategy

### Manual Testing Workflow (Browser-Based)
Since ANXRPG is a browser game with no automated test framework:
1. **Dev Server**: Run `npm run dev` and test in browser console
2. **Console Logging**: Add strategic `console.log()` for debugging game state
3. **LocalStorage Inspection**: Use browser DevTools → Application → Local Storage to verify saves
4. **State Snapshots**: Log entire game state before/after critical actions

### Critical Test Scenarios
1. **Combat Loop**: Single battle start → multiple abilities per turn → victory/defeat
2. **Multi-Action**: Verify AP deduction, "end turn" option, AP regen next turn
3. **Reserve Swap**: Active team wipe → reserve swap prompt → accept defeat option
4. **Hit/Miss**: ACC/EVA formula working, guaranteed hit abilities always land
5. **Critical Hits**: CRT% proc, damage multiplied (not additive)
6. **Boss Summons**: Summon at HP thresholds, max 2 minions enforced

### Save/Load System Testing
```typescript
// Test save persistence
1. Complete stage → verify auto-save triggers
2. Check LocalStorage key structure
3. Close browser → reopen → verify state restored
4. Test save data migration/validation with corrupted data

// Debug saves in console
localStorage.getItem('anxrpg_save') // View raw save data
JSON.parse(localStorage.getItem('anxrpg_save')) // Inspect structure
```

### Performance Checkpoints
- **Large Numbers**: Test damage calculations at level 100 (millions of damage)
- **Inventory Size**: Verify UI performance with 100+ equipment items
- **Battle Log**: Ensure combat messages don't cause memory leaks over long battles

## Phase Status (Reference IMPLEMENTATION_PLAN.md and docs/PHASE_AUDIT.md)
**Current Status**: Active Development - 12/14 phases complete (~85% overall)  
**Game Status**: ✅ **100% PLAYABLE WITH COMPLETE UI!** 🎮✨

Development follows 14-phase plan:
1. ✅ Project setup (Vite + TS) - **COMPLETE**
2. ✅ Character system (6 types) - **COMPLETE**
3. ✅ Ability system (24 player + 40+ enemy abilities) - **COMPLETE**
4. ✅ Equipment system (8 slots) - **COMPLETE**
5. ✅ Status effects engine - **COMPLETE**
6. ✅ Combat engine (turn-based + multi-action + enemy AI) - **COMPLETE**
7. ✅ Enemy system (7 tiers + bosses) - **COMPLETE**
8. ✅ Progression (leveling + skill trees + recruitment) - **COMPLETE**
9. ✅ Campaign (100 stages) - **COMPLETE**
10. ✅ Save system (LocalStorage) - **COMPLETE**
11. ✅ UI implementation (semantic HTML) - **100% COMPLETE** 🎉
12. ⏳ Game juice (flavor text - optional)
13. ⏳ Balance & testing
14. ⏳ Final polish

**When implementing**: Reference phase details in IMPLEMENTATION_PLAN.md for task breakdowns.

**Phase 11 Progress (10/10 screens complete - ALL DONE!)**:
- ✅ UI Foundation (ScreenManager, EventBus, UIHelpers, UIState) - 835 lines
- ✅ Main Menu (New/Continue/Load) - 271 lines
- ✅ Team Management (Active/Reserve/Roster) - 338 lines
- ✅ Campaign Map (100 stages, tier sections) - 264 lines
- ✅ **Combat Screen** (Turn-based, enemy AI, multi-action, click-to-target) - 660 lines **WORKING!**
- ✅ Battle Results (XP, loot, level-ups, auto-heal) - 197 lines
- ✅ Character Sheet (Stats, equipment, skill tree) - 450 lines
- ✅ **Inventory Screen** (Filter, sort, equip/unequip) - 717 lines
- ✅ **Settings Screen** (8 settings, save management, statistics) - 715 lines
- ✅ CSS System (Dark theme, 2,754 lines)

**Recent Additions (Oct 22-23, 2025)**:
- ✅ Auto-healing after victories
- ✅ Inventory Screen with filtering and equipment comparison
- ✅ Settings Screen with save management and game statistics
- ✅ Fixed enemy turn skipping - enemies now attack correctly!
- ✅ Updated `getAbility()` to check enemy ability database
- ✅ Fixed auto-victory trigger
- ✅ Added click-to-target feature with animations
- See `docs/SETTINGS_SCREEN_COMPLETE.md` and `docs/COMBAT_SCREEN_BUG_FIXES.md` for details

## Game Design Reference
See `GAME_DESIGN.md` for:
- Complete ability lists
- Enemy tier progression details
- Status effect catalog
- Equipment tier names (Wooden → Godforged → Worldbreaker)
- Damage formulas and stat calculations
- Campaign structure (100 stages, 7 tiers)

## Quick Reference: What's Implemented

**Complete Systems** (12 phases):
- Type system (9 modules)
- 6 character types with balanced stats
- 24 player abilities + 40+ enemy abilities
- Equipment system (8 slots, 7 rarity tiers, procedural generation)
- Status effects (26 effects, stacking, DOT/HOT, control)
- Combat engine (turn-based, multi-action, enemy AI, damage calculation)
- Enemy system (28 templates, 7 tiers, boss summons)
- Progression (XP, leveling, 120 skill tree nodes, recruitment every 20 victories)
- Campaign (100 stages, boss battles every 10th, progressive unlocking)
- Save/load (LocalStorage, auto-save, import/export)
- UI (10/10 screens: Menu, Team, Campaign, Combat, Results, Character Sheet, Inventory, Settings, CSS) **ALL DONE!**

**Remaining Work**:
- Phase 12: Game Juice (optional flavor text)
- Phase 13-14: Balance, testing, and final polish

---

*Instructions Version: 1.3*  
*Last Updated: October 23, 2025*  
*For questions on mechanics, always reference GAME_DESIGN.md first*
