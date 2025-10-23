# ANXRPG
A web-based turn-based fighting RPG with deep character progression, equipment systems, and 100 stages of increasingly difficult combat.

## 🎮 Game Status: **100% PLAYABLE ON ALL DEVICES!** 🎉

**Version 1.6.6 - Combat UI Polish** (Oct 23, 2025 - Late Evening):
- ✅ **Mobile Ability Buttons Optimized** - 21% narrower, less wasted space (110px on mobile, 100px on small screens)
- ✅ **End Turn Button Inline** - No longer takes entire row, saves ~50-60px vertical space
- ✅ **Better Mobile UX** - 3-4 abilities visible at once instead of 2-3

**Version 1.6.5 - Desktop Combat Fixed (CRITICAL)** (Oct 23, 2025 - Evening):
- ✅ **Combat Area Visibility Fixed** - Was literally invisible on desktop (characters/enemies barely visible)
- ✅ **Space Reallocation** - Combat area now gets 50-60% of screen (was ~20%), properly prioritized with `flex: 2-3`
- ✅ **Combat Log Reduced** - 200px → 150px (120px on large screens), action panel compacted
- ✅ **Desktop Now Playable** - Characters/enemies fully visible, minimal scrolling needed

**Version 1.6.4 & Earlier** (Oct 23, 2025):
- ✅ **Stackable Effects Fixed** - DOT/HOT now properly multiply (Poison: 10→20→30 damage/turn)
- ✅ **Team Persistence Fixed** - Active/Reserve assignments now save permanently
- ✅ **Full-Width UI** - Better screen utilization
- ✅ **UI Consistency** - Unified header styling across all screens (blue theme)
- ✅ **Test Coverage Added** - Stacking effects test passing

**Phase 12 COMPLETE!** Game juice and polish added:
- ✅ **Flavor Text** - Complete lore for all abilities, enemies, and equipment
- ✅ **CSS Animations** - 15+ animations for smooth, polished gameplay
- ✅ **Enhanced Tooltips** - Lore-rich descriptions throughout the game

**Phase 11 COMPLETE!** All UI screens implemented:
- ✅ Create characters and build teams
- ✅ Fight turn-based battles with working enemy AI
- ✅ Multi-action combat system with click-to-target
- ✅ Gain XP and loot equipment
- ✅ **Full inventory management** with filters and sorting
- ✅ Level up and unlock skill tree nodes
- ✅ **Complete settings screen** with 8 configurable options
- ✅ Save/load/export/import progress
- ✅ Auto-healing between battles
- ✅ 100-stage campaign with boss battles
- ✅ **Responsive design** - Works great on desktop AND mobile!

**Status**: Ready for final testing and deployment! Only 1 phase remains (Balance, Testing & Deployment)

## 🚀 Tech Stack
- **Build Tool**: Vite 5.x
- **Language**: TypeScript (strict mode, ES2022)
- **UI**: Pure vanilla TypeScript + semantic HTML (no frameworks)
- **Styling**: Complete CSS system with dark theme (1200+ lines)
- **Storage**: Browser LocalStorage with Set/Map serialization
- **Deployment**: Static site (GitHub Pages/Netlify ready)

## 📋 Current Status
**Phase**: Active Development - **Phase 12 COMPLETE!** ✅ (13/14 phases, ~92% overall)

### ✅ Completed Phases (13/14)
- ✅ **Phase 1**: Project Foundation (Types & Structure)
- ✅ **Phase 2**: Character System (6 character types with stats/leveling)
- ✅ **Phase 3**: Ability System (24 player + 40+ enemy abilities)
- ✅ **Phase 4**: Equipment System (8 slots, 7 rarity tiers, procedural generation)
- ✅ **Phase 5**: Status Effects System (26 effects, stacking, DOT/HOT, control)
- ✅ **Phase 6**: Combat Engine (Turn-based, multi-action, enemy AI, damage calculation)
- ✅ **Phase 7**: Enemy System (28 templates, 7 tiers, boss summons)
- ✅ **Phase 8**: Progression System (XP, skill trees with 120 nodes, recruitment)
- ✅ **Phase 9**: Campaign System (100 stages, boss battles, progressive unlocking)
- ✅ **Phase 10**: Save/Load System (LocalStorage, auto-save, import/export)
- ✅ **Phase 11**: UI Implementation (100% COMPLETE!)
- ✅ **Phase 12**: **Game Juice & Polish (COMPLETE!)** 🎉

### ✅ All 10 UI Screens Complete!
- ✅ UI Foundation (ScreenManager, EventBus, UIHelpers, UIState) - 835 lines
- ✅ Main Menu Screen (New/Continue/Load/Settings) - 271 lines
- ✅ Team Management Screen (Active/Reserve/Roster) - 338 lines
- ✅ Campaign Map Screen (100 stages, tier sections) - 264 lines
- ✅ Combat Screen (Turn-based, enemy AI, multi-action, click-to-target) - 660 lines
- ✅ Battle Results Screen (Victory/defeat, XP, loot, level-ups, auto-heal) - 197 lines
- ✅ Character Sheet Screen (Stats, equipment, skill tree) - 450 lines
- ✅ **Inventory Screen** (Filter, sort, equip/unequip) - 717 lines
- ✅ **Settings Screen** (8 settings, save mgmt, statistics) - 715 lines
- ✅ Complete CSS System (Dark theme, 2,754 lines)

**Total UI Code**: 8,955 lines (6,201 TypeScript + 2,754 CSS)

### ✅ Phase 12: Game Juice Complete!
- ✅ Flavor text system (500+ lines)
  - 24 ability descriptions with lore
  - 28 enemy descriptions with boss introductions
  - 7 equipment rarity tier descriptions
- ✅ CSS animations (261 lines)
  - Screen transitions and fades
  - Combat hit effects and pulses
  - Victory/defeat animations
  - Button hover effects
  - HP bar smooth transitions

### ⏳ Remaining Phase (1/14)
- ⏳ **Phase 13-14**: Balance, Testing & Deployment (FINAL!)

**Latest Achievements** (Oct 23, 2025 - Late Evening): 
- 🖥️📱 **Combat UI Optimizations!** Version 1.6.6 released
  - ✅ Mobile ability buttons 21% narrower (110px → 100px on small screens)
  - ✅ End Turn button now inline with abilities (saves vertical space)
  - ✅ Better mobile UX - 3-4 abilities visible at once
- 🖥️ **CRITICAL Desktop Fix!** Version 1.6.5 released (earlier evening)
  - ✅ Combat area was literally invisible on desktop - NOW FIXED
  - ✅ Space reallocation - combat gets 50-60% of screen (was ~20%)
  - ✅ Combat log reduced, action panel compacted
  - ✅ Game actually playable on desktop now!
- 🐛 **Critical Bug Fixes!** Version 1.6.4 released
  - ✅ Stackable effects now properly multiply (major game balance fix)
  - ✅ Team assignments persist across sessions (no data loss)
  - ✅ Full-width UI for better screen utilization
  - ✅ Unified header styling (blue theme consistency)
  - ✅ Test suite added for stacking effects
- 🎉 **Phase 12 COMPLETE!** Game juice and polish added (earlier today)
  - ✅ Flavor text system - Complete lore for all game content
  - ✅ CSS animations - 15+ animations for smooth gameplay
  - ✅ Enhanced tooltips - Lore-rich descriptions everywhere
  - ✅ Visual polish - Game feels alive with transitions
- 🎉 **Phase 11 COMPLETE!** All UI screens implemented (Oct 22)

**Build Size**: 223.68 KB JS (56.85 KB gzipped), 81.27 KB CSS (12.47 KB gzipped)

**Estimate to v1.0**: 1 session (~2-4 hours) - Just balance, testing, and deployment!

See the [Next Steps](NEXT_STEPS.md) and [Quick Start Guide](docs/QUICK_START_PHASE11_COMPLETE.md) for complete details.

## 📖 Documentation

### Getting Started
- **[QUICK_START_PHASE11_COMPLETE.md](docs/QUICK_START_PHASE11_COMPLETE.md)** - **START HERE!** How to play, what works now
- **[NEXT_STEPS.md](NEXT_STEPS.md)** - What's next (Phase 12: Game Juice)
- **[GAME_DESIGN.md](GAME_DESIGN.md)** - Complete game mechanics, formulas, and systems

### Development Documentation
- **[IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)** - 14-phase technical implementation roadmap
- **[CHANGELOG.md](CHANGELOG.md)** - Version history (now at v1.3.0 - Phase 11 Complete!)
- **[.github/copilot-instructions.md](.github/copilot-instructions.md)** - AI coding agent guidelines
- **[docs/PHASE_AUDIT.md](docs/PHASE_AUDIT.md)** - Phase completion tracking

### Implementation Summaries
- **[docs/SETTINGS_SCREEN_COMPLETE.md](docs/SETTINGS_SCREEN_COMPLETE.md)** - Settings implementation (Oct 22, 2025)
- **[docs/INVENTORY_SCREEN_COMPLETE.md](docs/INVENTORY_SCREEN_COMPLETE.md)** - Inventory implementation
- **[docs/CHARACTER_SHEET_COMPLETE.md](docs/CHARACTER_SHEET_COMPLETE.md)** - Character sheet implementation
- **[docs/COMBAT_SCREEN_BUG_FIXES.md](docs/COMBAT_SCREEN_BUG_FIXES.md)** - Combat fixes
- **[docs/SESSION_SUMMARY_OCT22_PHASE11_COMPLETE.md](docs/SESSION_SUMMARY_OCT22_PHASE11_COMPLETE.md)** - Phase 11 completion summary
- **[docs/](docs/)** - All phase summaries (Phases 5-11)

## 🧪 Play It Now!
```bash
npm install         # Install dependencies (first time only)
npm run dev         # Start dev server at http://localhost:5173
```

### How to Play
1. **Main Menu** → Click "✨ New Game"
2. **Select Character** → Choose from 6 types (Alpha/Beta/Gamma/Delta/Epsilon/Zeta)
3. **Team Management** → View your roster, build active team
4. **Campaign Map** → Select Stage 1 and click "Start Battle"
5. **Combat** → 
   - Click ability buttons (uses AP)
   - Click enemies to target them
   - Use multiple abilities per turn
   - Click "End Turn" when done
6. **Victory** → Get XP, loot, and full HP/AP restoration!
7. **Progress** → Continue through 100 stages

### Try These Features
- **Inventory** (🎒 button) → Filter/sort equipment, equip items on characters
- **Character Sheet** (click character card) → View stats, equipment, skill tree
- **Settings** (⚙️ button) → Configure 8 game options, export/import saves
- **Save/Load** → Your progress auto-saves after each battle

## 🎮 Overview
ANXRPG features 6 unique character types (Greek alphabet themed), a sophisticated Action Point combat system, equipment with level requirements, skill trees, and a comprehensive 100-stage campaign with boss battles every 10 stages.

## 🚀 Tech Stack
- **Build Tool**: Vite 5.x
- **Language**: TypeScript (strict mode, ES2022)
- **UI**: Pure semantic HTML (no frameworks)
- **Styling**: Minimal CSS
- **Storage**: Browser LocalStorage
- **Deployment**: Static site (GitHub Pages/Netlify ready)

## 📋 Current Status
**Phase**: Active Development - 5/14 Complete, 2 Partial (~45% Overall)

- ✅ **Phase 1**: Project Foundation (Types & Structure)
- ✅ **Phase 2**: Character System (6 character types, including `awardXp()`)
- ✅ **Phase 3**: Ability System (24 abilities defined)
- ✅ **Phase 4**: Equipment System (8 slots, 7 rarity tiers)
- ✅ **Phase 5**: Status Effects System (26 effects, stacking, DOT/HOT)
- 🟡 **Phase 6**: Combat Engine (85% - core functional, missing reward integration)
- � **Phase 7**: Enemy System (75% - templates + generation done, needs testing)
- 🟡 **Phase 8**: Progression (10% - `awardXp` exists, not integrated)

**Next Steps**: 
1. Complete Phase 6 rewards (integrate XP/equipment drops into combat victory)
2. Test Phase 7 enemy system (create demo battles, verify boss summons)
3. Build comprehensive combat test suite

See the [implementation plan](IMPLEMENTATION_PLAN.md) and [audit](docs/PHASE_AUDIT.md) for complete status.

## 📖 Documentation
## 📖 Documentation
- **[GAME_DESIGN.md](GAME_DESIGN.md)** - Complete game mechanics, formulas, and systems
- **[IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)** - 14-phase technical implementation roadmap
- **[CHANGELOG.md](CHANGELOG.md)** - Detailed version history and phase completion notes
- **[.github/copilot-instructions.md](.github/copilot-instructions.md)** - AI coding agent guidelines
- **[docs/PHASE_AUDIT.md](docs/PHASE_AUDIT.md)** - Accurate phase completion tracking (updated Oct 22, 2025)
- **[docs/](docs/)** - All phase-specific implementation summaries (Phases 5-10)
- **[TEST_SAVE_LOAD.md](TEST_SAVE_LOAD.md)** - Set/Map serialization bug fix documentation

## 🧪 Try It Now
```bash
npm install         # Install dependencies
npm run dev         # Start at http://localhost:5173 or :5174
```

**Then play the game!**
1. **Main Menu** → Click "New Game" → Select character type (Alpha/Beta/Gamma/Delta/Epsilon/Zeta)
2. **Team Management** → Build your team (active + reserve)
3. **Campaign Map** (🗺️ button) → Select Stage 1 or Stage 2
4. **FIGHT BATTLES!** → Turn-based combat with working enemy AI! 🎮
   - Use abilities (costs AP)
   - Click enemies to target them
   - Multi-action: use multiple abilities per turn
   - Enemies attack you!
   - Win and get XP/loot
5. **Battle Results** → See rewards, level-ups
6. **Character Sheet** → View stats, equipment, skill tree
7. **Repeat!** → Progress through 100 stages

**What You Can Do Right Now**:
- ✅ Create characters and build teams
- ✅ Fight turn-based battles
- ✅ Use multiple abilities per turn
- ✅ Target specific enemies
- ✅ Gain XP and loot equipment
- ✅ Level up and unlock skills
- ✅ Save/load your progress

**What's Missing**:
- ❌ Inventory management UI (can't equip items yet)
- ❌ Settings screen

## 🎯 Key Features (All Implemented!)
- **6 Character Types**: Alpha (Paladin), Beta (Rogue), Gamma (Mage), Delta (Warrior), Epsilon (Cleric), Zeta (Berserker) ✅
- **Multi-Action Combat**: Use multiple abilities per turn with AP management ✅
- **Enemy AI**: Enemies select and use abilities intelligently ✅
- **Click-to-Target**: Select specific enemies with visual feedback ✅
- **Reserve System**: Swap between active and reserve teams when wiped ✅
- **Equipment System**: 8 equipment slots with 7 rarity tiers ✅
- **Inventory Management**: Filter by slot/rarity/level, sort equipment, equip/unequip ✅
- **Skill Trees**: 120 nodes total (20 per character) with stat bonuses and abilities ✅
- **Progressive Recruitment**: Unlock new characters every 20 battle victories ✅
- **100 Stages**: 7 enemy tiers from Slimes to Gods, bosses every 10th stage ✅
- **Auto-Healing**: Full HP/AP restore after victories ✅
- **Save System**: Auto-save, manual save, export/import JSON ✅
- **Settings**: 8 configurable options, statistics dashboard, data management ✅
- **Complete UI**: All 10 screens functional with dark theme ✅

## 🛠️ Development Commands
```bash
npm install         # Install dependencies
npm run dev         # Start Vite dev server (http://localhost:5173)
npm run build       # Production build
npm run preview     # Preview production build
```

## 🎲 Core Mechanics Highlights

### Action Point (AP) System
- Base 3 AP/turn + character-specific regeneration (3-6 AP)
- Max 10 AP pool
- Abilities cost 1-4 AP typically
- Multi-action: use multiple abilities per turn

### Combat Formula
```typescript
Physical: (ATK * multiplier) - (DEF * 0.5)
Magical:  (MAG * multiplier) - (RES * 0.5)
Critical: 2x damage multiplier
Hit/Miss: clamp(ACC - (EVA * 0.5), 5, 95)
```

### Character Progression
- Equal XP to all 6 characters (active + reserve)
- 1 skill point per level for ~20-node skill trees
- Equipment drops at stage level, requires matching character level
- New character recruitment every 20 victories

## � Project Statistics

### Code Metrics
- **Total Lines**: ~16,000+ (all files)
- **UI Code**: 8,955 lines (6,201 TS + 2,754 CSS)
- **Core Systems**: ~6,000 lines TypeScript
- **Flavor Text**: 500+ lines (24 abilities, 28 enemies, 7 rarities)
- **Animations**: 261 lines CSS (15+ animations)
- **Build Size**: 203.55 KB JS (51.95 KB gzipped), 48.09 KB CSS (7.84 KB gzipped)

### Game Content
- **Character Types**: 6
- **Player Abilities**: 24
- **Enemy Abilities**: 40+
- **Enemy Templates**: 28 (21 regular + 7 bosses)
- **Skill Tree Nodes**: 120 (20 per character)
- **Stages**: 100 (7 tiers, 10 boss battles)
- **Status Effects**: 26
- **Equipment Slots**: 8
- **Rarity Tiers**: 7

### Development Progress
- **Completed Phases**: 13/14 (92%)
- **Remaining**: Balance, Testing & Deployment
- **Development Time**: ~22-27 hours across multiple sessions
- **Compile Errors**: 0
- **Known Bugs**: 0 (all critical bugs fixed)
## 🤝 Contributing
This project is in active development. **Phase 11 is COMPLETE!** All UI screens are functional. The game is fully playable and ready for polish. Contributions welcome!

See [docs/QUICK_START_PHASE11_COMPLETE.md](docs/QUICK_START_PHASE11_COMPLETE.md) for how to play and [NEXT_STEPS.md](NEXT_STEPS.md) for what's next.

## 📄 License
See [LICENSE](LICENSE) file for details.

---

*Last Updated: October 23, 2025 - Phase 12 COMPLETE (92%) - Game Fully Playable & Polished! 🎉*

