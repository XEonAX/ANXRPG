# ANXRPG
A web## 📋 Current Status
**Phase**: Active Development - 8/14 Complete (~57% Overall)

- ✅ **Phase 1**: Project Foundation (Types & Structure)
- ✅ **Phase 2**: Character System (6 character types)
- ✅ **Phase 3**: Ability System (24 player abilities + 40+ enemy abilities)
- ✅ **Phase 4**: Equipment System (8 slots, 7 rarity tiers)
- ✅ **Phase 5**: Status Effects System (26 effects, stacking, DOT/HOT)
- ✅ **Phase 6**: Combat Engine (Turn-based, multi-action, XP/loot rewards)
- ✅ **Phase 7**: Enemy System (28 templates, 40+ abilities, boss summons)
- ✅ **Phase 8**: Progression System (Skill trees + Recruitment) - **JUST COMPLETED!**

**Latest Achievement**: Phase 8 is now 100% complete! Skill tree system with 120 nodes across all 6 character types, recruitment system (every 20 victories), and full integration with character stats.

**Next Steps**: 
1. Begin Phase 9: Campaign system (100 stages)
2. Phase 10: Save/Load system (LocalStorage)
3. Phase 11: UI implementation (semantic HTML)

See the [implementation plan](IMPLEMENTATION_PLAN.md) and [Phase 8 summary](docs/PHASE_8_SUMMARY.md) for complete details.fighting RPG with deep character progression, equipment systems, and 100 stages of increasingly difficult combat.

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
- **[GAME_DESIGN.md](GAME_DESIGN.md)** - Complete game mechanics, formulas, and systems
- **[IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)** - 14-phase technical implementation roadmap
- **[CHANGELOG.md](CHANGELOG.md)** - Detailed version history and phase completion notes
- **[.github/copilot-instructions.md](.github/copilot-instructions.md)** - AI coding agent guidelines
- **[docs/PHASE_8_SUMMARY.md](docs/PHASE_8_SUMMARY.md)** - Latest: Phase 8 implementation details
- **[docs/PHASE_AUDIT.md](docs/PHASE_AUDIT.md)** - Accurate phase completion tracking
- **[docs/](docs/)** - All phase-specific implementation summaries

## 🎯 Key Features (Planned)
- **6 Character Types**: Alpha (Paladin), Beta (Rogue), Gamma (Mage), Delta (Warrior), Epsilon (Cleric), Zeta (Berserker)
- **Multi-Action Combat**: Use multiple abilities per turn with AP management
- **Reserve System**: Swap between active and reserve teams when wiped
- **Equipment System**: 8 equipment slots with level requirements
- **Skill Trees**: ~20 nodes per character with stat bonuses or new abilities
- **Progressive Recruitment**: Unlock new characters every 20 battle victories
- **100 Stages**: 7 enemy tiers from Slimes to Gods, bosses every 10th stage
- **Save System**: LocalStorage persistence

## 🛠️ Development Commands
```bash
npm install         # Install dependencies
npm run dev         # Start Vite dev server
npm run build       # Production build
npm run preview     # Preview production build
npm run type-check  # TypeScript type checking
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

## 📄 License
See [LICENSE](LICENSE) file for details.

## 📊 Implementation Progress

### Completed Systems (Phase 8 - v0.8.0)
- **Type Definitions**: 7 core modules + skill tree types
- **Character Types**: All 6 types with balanced stats and growth rates
- **Abilities**: 24 player abilities + 40+ enemy abilities
- **Equipment System**: 8 slots, 7 rarity tiers, procedural generation
- **Status Effects**: 26 effects with stacking, DOT/HOT, control
- **Combat Engine**: Turn-based multi-action with full reward integration
- **Enemy System**: 28 templates (21 regular + 7 bosses), boss summons
- **Skill Trees**: 120 nodes across 6 character types (~20 each)
- **Recruitment System**: Victory-based unlocks (every 20 wins, max 6 roster)
- **Damage System**: Physical/magical, crits, hit/miss, lifesteal
- **Formulas**: Damage, stat scaling, XP curves, hit/miss
- **Utilities**: RNG, formula library, ID generation

### Skill Tree System (Phase 8)
- **120 Total Nodes**: ~20 nodes per character type (14 stat nodes, 2-3 ability slot unlocks, 3-4 multi-point nodes)
- **Linear Progression**: Prerequisite system ensures logical unlock order
- **Node Types**: Stat bonuses (HP, ATK, DEF, etc.), ability slot unlocks (5th/6th), multi-point investments
- **Integration**: Skill bonuses apply before equipment bonuses in stat calculation
- **Balance**: Each character has 1-2 grandmaster nodes requiring multiple skill points

### Recruitment System (Phase 8)
- **Victory Milestones**: Unlock recruitment at 20, 40, 60, 80, 100 battle victories
- **Max Roster**: 6 characters total (active + reserve)
- **Retirement Option**: At 100 victories, can retire existing character to recruit new one
- **Starting Level**: All new recruits start at level 1 regardless of team progress
- **Character Choice**: Player selects from all 6 character types at each milestone
- **Turn-Based System**: Speed-based turn order with one-time player character ordering
- **Multi-Action Combat**: Use multiple abilities per turn with AP tracking
- **Damage Formulas**: `(ATK × mult) - (DEF × 0.5)` for physical, `(MAG × mult) - (RES × 0.5)` for magical
- **Critical Hits**: 2× damage multiplier on CRT% proc
- **Hit/Miss Mechanics**: `clamp(ACC - (EVA × 0.5), 5, 95)` hit chance
- **Status Integration**: DOT/HOT processing, control effects, stat modifiers
- **Reserve System**: Team wipe detection with reserve swap or accept defeat
- **Combat Log**: Comprehensive event tracking for all combat actions
- **Ability Execution**: Full damage, healing, status effects, AP restore/drain support

### Combat System Features
- **8 Slots**: Main Hand, Off Hand, Head, Chest, Legs, Neck, Wrist×2
- **7 Rarity Tiers**: Basic, Common, Uncommon, Rare, Epic, Legendary, Mythic
- **Level Requirements**: Equipment drops at stage level, requires matching character level
- **Stat Bonuses**: Dynamic scaling (base value + level × growth rate × rarity multiplier)
- **Procedural Names**: "Mythic Worldbreaker Greatsword", "Rare Enchanted Amulet", etc.
- **Dual-Weapon Support**: Two-handed weapons occupy both hand slots

### Equipment System Features
- **26 Predefined Effects**: Buffs, debuffs, DOT, HOT, control effects, special effects
- **Stacking Mechanics**: Stackable effects accumulate (with max stacks), non-stackable refresh duration
- **Stat Modifiers**: Both flat bonuses (+20 ATK) and multiplicative modifiers (×1.25 ATK)
- **Turn-Based Processing**: Effects tick at turn start or end with automatic duration tracking
- **Control Effects**: Stun, freeze, sleep, petrify prevent character actions
- **DOT/HOT**: Damage/healing over time with stacking support (Poison, Burn, Bleed, Regeneration)

### Status Effects System Features
| Type | Role | HP (Lv1) | AP/Turn | Key Stats |
|------|------|----------|---------|-----------|
| Alpha (Paladin) | Tank/Healer | 120 | +3 | High DEF, Medium ATK |
| Beta (Rogue) | Crit DPS | 70 | +6 | High SPD/CRT, Low DEF |
| Gamma (Mage) | AoE Caster | 60 | +4 | High MAG/RES, Low HP |
| Delta (Warrior) | Physical DPS | 100 | +4 | High ATK, Medium DEF |
| Epsilon (Cleric) | Healer/Support | 80 | +5 | High MAG/RES, Balanced |
| Zeta (Berserker) | High Risk DPS | 90 | +5 | Very High ATK, Low DEF |

## 🤝 Contributing
This project is in active development (8 phases complete, ~57% done). **Phase 8 just completed!** Skill tree system (120 nodes) and recruitment system fully functional. Ready for Phase 9 (Campaign System). Contributions are welcome!

See [docs/PHASE_8_SUMMARY.md](docs/PHASE_8_SUMMARY.md) for the latest implementation details.

---

*Last Updated: October 22, 2025 - Phase 8 Complete (v0.8.0)!*

