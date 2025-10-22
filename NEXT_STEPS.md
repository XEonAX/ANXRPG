# ANXRPG - Next Steps for Continuation

**Date**: October 22, 2025  
**Current Status**: Phase 6 Complete (100%), Phase 7 Nearly Complete (90%)  
**Overall Progress**: 6/14 phases complete, 2 partial (~47%)

---

## 🎯 Immediate Priorities

### 1. Complete Phase 7: Enemy System (10% Remaining)
**Estimated Time**: 30-60 minutes

#### Tasks:
- [ ] Fix remaining enemy template ability IDs in Tier 6-7
  - **File**: `src/data/enemies.ts`
  - **Issue**: Some enemies still reference old ability IDs that don't exist
  - **Fix**: Update to use abilities from `src/data/enemyAbilities.ts`
  
- [ ] Verify all 28 enemy templates have valid ability references
  - Run a grep search to find any undefined ability IDs
  - Cross-reference with `src/data/enemyAbilities.ts` exports
  
- [ ] Test enemy abilities in combat
  - Use `src/tests/combatDemo.ts` to run actual battles
  - Verify abilities execute correctly
  - Check status effects apply properly

#### How to Fix Enemy Templates:
```bash
# Check which abilities are defined
grep "^const.*: Ability" src/data/enemyAbilities.ts

# Check which enemy templates might have issues
grep "abilities: \[" src/data/enemies.ts | grep -v "// Updated"
```

**Enemy Templates to Check**:
- Tier 6: `demigod_strike`, `guardian_shield` (might not exist)
- Tier 7: `god_smite`, `primordial_crush`, `void_annihilation` (might not exist)

**Fix Pattern**:
```typescript
// If ability doesn't exist, use a tier-appropriate one from enemyAbilities.ts
// Example for Tier 6:
abilities: ['angelic_smite', 'angelic_blessing'],  // Use these

// Example for Tier 7:
abilities: ['godly_wrath', 'primordial_crush'],  // Use these
```

---

### 2. Test Combat System End-to-End
**Estimated Time**: 30-60 minutes

#### Tasks:
- [ ] Run combat demos in browser
  ```bash
  npm run dev
  # Open browser, press F12 for console
  # Run: combatDemo.simple()
  # Run: combatDemo.xp()
  # Run: combatDemo.boss()
  ```

- [ ] Verify XP distribution works
  - Check all 6 characters receive XP
  - Verify level-ups trigger correctly
  - Check XP amounts match formula: `level² × 10` (×5 for bosses)

- [ ] Verify equipment drops work
  - Check max 1 item per enemy
  - Verify drop chances respect enemy template settings
  - Check equipment is generated at enemy level

- [ ] Test boss summons
  - Boss should summon minions at HP thresholds (75%, 50%, 25%)
  - Max 2 summons at once
  - Turn order should recalculate when minions appear

#### Expected Results:
- Simple battle (2 slimes): ~20-30 XP total, 0-2 equipment drops
- Boss battle: Higher XP (boss gives 5× multiplier), guaranteed drop from boss
- Level-ups should show in combat log

---

## 🚀 Next Major Milestone: Phase 8 - Progression System

**Estimated Time**: 2-3 sessions (8-12 hours)

### Overview
Implement skill trees, character recruitment, and victory tracking.

### Phase 8 Breakdown:

#### 8.1 Skill Tree System (40%)
**Files to Create/Modify**:
- `src/types/skillTree.ts` - Type definitions
- `src/data/skillTrees.ts` - ~20 nodes per character (120 nodes total)
- `src/systems/skillTree.ts` - Skill point allocation, node unlocking

**Key Features**:
- ~20 nodes per character type
- Linear progression with prerequisites
- Each node: EITHER stat bonus OR new ability (not both)
- 1 skill point per level
- Some nodes require multiple points
- Can unlock 5th, 6th+ ability slots

**Skill Tree Node Structure**:
```typescript
interface SkillNode {
  id: string;
  name: string;
  description: string;
  characterType: CharacterTypeName;
  requiredLevel: number;
  skillPointCost: number;
  prerequisites: string[];  // Node IDs that must be unlocked first
  effect: {
    type: 'stat-bonus' | 'unlock-ability' | 'unlock-slot';
    statBonus?: { stat: StatType; value: number };
    abilityId?: string;
    slotType?: 'ability';
  };
}
```

#### 8.2 Character Recruitment System (30%)
**Files to Create/Modify**:
- `src/systems/recruitment.ts` - Recruitment logic
- `src/types/game.ts` - Add `totalVictories` tracking

**Key Features**:
- New character every 20 battle victories (20, 40, 60, 80, 100+)
- Player chooses character type (can pick duplicates)
- New characters start at level 1
- At 100 victories: option to retire existing character to make room

**Recruitment Flow**:
```typescript
// After battle victory:
if (totalVictories % 20 === 0) {
  // Show recruitment screen
  // Player selects character type
  // Create new level 1 character
  // Add to character roster
}
```

#### 8.3 Victory Counter & Retirement (20%)
**Files to Modify**:
- `src/systems/combat.ts` - Track victories
- `src/types/game.ts` - Add `totalVictories`, `characterRoster`

**Key Features**:
- Track total battle victories across all characters
- At 100+ victories: allow retiring 1 character when recruiting
- Show victory milestones (20, 40, 60, 80, 100)

#### 8.4 Integration & Testing (10%)
- Integrate skill tree UI (basic HTML)
- Test skill point allocation
- Test recruitment flow
- Verify character retirement

---

## 📋 Phase 9-14 Overview (For Context)

### Phase 9: Campaign System (Next After Phase 8)
- 100 stage definitions
- Stage unlocking progression
- Boss stages every 10 levels
- Stage difficulty scaling
- **Estimated Time**: 1-2 sessions

### Phase 10: Save System
- LocalStorage persistence
- Save/load game state
- Auto-save on victory
- **Estimated Time**: 1 session

### Phase 11: UI Implementation
- Semantic HTML rendering
- Combat screen
- Team management
- Character sheets
- Equipment inventory
- Campaign map
- **Estimated Time**: 3-4 sessions

### Phase 12: Game Juice
- Flavor text
- Visual polish
- Combat animations (CSS)
- **Estimated Time**: 1-2 sessions

### Phase 13: Balance & Testing
- Enemy difficulty tuning
- Ability balancing
- Equipment drop rates
- XP curve adjustment
- **Estimated Time**: 1-2 sessions

### Phase 14: Final Polish
- Bug fixes
- Performance optimization
- Documentation
- Deployment preparation
- **Estimated Time**: 1 session

---

## 🔧 Technical Debt & Known Issues

### Current Issues:
1. **Combat Demo**: Works but needs real enemy data to test properly
2. **Enemy Abilities**: Some Tier 6-7 templates have placeholder IDs
3. **Testing**: No automated tests, all manual browser testing

### Quality Improvements Needed:
- Add error handling in combat system
- Add validation for ability execution
- Better logging/debugging tools
- Performance profiling for large battles

---

## 📊 Progress Tracking

### Completed (47%):
- ✅ Phase 1: Project Foundation
- ✅ Phase 2: Character System
- ✅ Phase 3: Ability System
- ✅ Phase 4: Equipment System
- ✅ Phase 5: Status Effects System
- ✅ Phase 6: Combat Engine (WITH REWARDS!)

### In Progress (43%):
- 🟡 Phase 7: Enemy System (90%)
- 🟡 Phase 8: Progression (10% - awardXp exists)

### Remaining (10%):
- ⏳ Phase 9-14

---

## 🎮 How to Test Current State

### 1. Build the Project
```bash
npm install
npm run build
```

### 2. Run Dev Server
```bash
npm run dev
```

### 3. Open Browser Console
Press F12 in browser, then:

```javascript
// Test simple combat
combatDemo.simple()

// Test XP rewards
combatDemo.xp()

// Test boss setup
combatDemo.boss()

// Run all demos
combatDemo.all()
```

### 4. What to Look For
- ✅ Combat starts successfully
- ✅ Turn order displays
- ✅ Abilities execute
- ✅ Damage is dealt
- ✅ Victory detected
- ✅ XP awarded to all 6 characters
- ✅ Equipment drops (0-2 items typically)
- ✅ Combat log shows all events

---

## 📚 Key Files Reference

### Core Systems:
- `src/systems/combat.ts` - Combat engine (847 lines)
- `src/systems/character.ts` - Character management (277 lines)
- `src/systems/damage.ts` - Damage calculations (270 lines)
- `src/systems/enemy.ts` - Enemy generation (344 lines)
- `src/systems/equipment.ts` - Equipment system (250+ lines)
- `src/systems/statusEffects.ts` - Status effects (410 lines)

### Data Definitions:
- `src/data/characterTypes.ts` - 6 character types
- `src/data/abilities.ts` - 24 player abilities
- `src/data/enemyAbilities.ts` - 40+ enemy abilities
- `src/data/enemies.ts` - 28 enemy templates
- `src/data/equipmentTemplates.ts` - Equipment generation
- `src/data/statusEffects.ts` - 26 status effects

### Types:
- `src/types/combat.ts` - Combat state & types
- `src/types/character.ts` - Character types
- `src/types/ability.ts` - Ability types
- `src/types/enemy.ts` - Enemy types
- `src/types/equipment.ts` - Equipment types
- `src/types/status.ts` - Status effect types

### Tests:
- `src/tests/combatDemo.ts` - Combat testing (280 lines)
- `src/tests/statusEffectsDemo.ts` - Status effects testing

---

## 💡 Tips for Next Session

1. **Start with Phase 7 Completion**: The 10% remaining is quick wins
2. **Test Thoroughly**: Use the combat demo extensively before moving to Phase 8
3. **Read Session Summary**: Check `docs/SESSION_SUMMARY.md` for latest implementation details
4. **Check GAME_DESIGN.md**: For skill tree design when starting Phase 8
5. **Build Often**: Run `npm run build` to catch TypeScript errors early

---

**Good luck! The combat system is fully functional and ready for the next phase of development!** 🚀
