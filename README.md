# ANXRPG
A web-based turn-based fighting RPG with deep character progression, equipment systems, and 100 stages of increasingly difficult combat.

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
**Phase**: Active Development - Phases 1-6 Complete ✅ (43% Complete)

- ✅ **Phase 1**: Project Foundation (Types & Structure)
- ✅ **Phase 2**: Character System (6 character types implemented)
- ✅ **Phase 3**: Ability System (24 abilities defined)
- ✅ **Phase 4**: Equipment System (8 slots, 7 rarity tiers)
- ✅ **Phase 5**: Status Effects System (26 effects, stacking, DOT/HOT)
- ✅ **Phase 6**: Combat Engine (Turn-based, multi-action, damage calculations)
- 🚧 **Phase 7**: Enemy System (Next)

See the [implementation plan](IMPLEMENTATION_PLAN.md) for the complete 14-phase development roadmap.

## 📖 Documentation
- **[GAME_DESIGN.md](GAME_DESIGN.md)** - Complete game mechanics, formulas, and systems
- **[IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)** - 14-phase technical implementation roadmap
- **[CHANGELOG.md](CHANGELOG.md)** - Detailed version history and phase completion notes
- **[.github/copilot-instructions.md](.github/copilot-instructions.md)** - AI coding agent guidelines
- **[docs/](docs/)** - Phase-specific implementation summaries

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

### Completed Systems
- **Type Definitions**: Complete type system with 7 core modules (status, character, ability, equipment, enemy, combat, game)
- **Character Types**: All 6 character types with balanced base stats and growth rates
- **Abilities**: 24 abilities (4 per character type) with varied effects and targeting
- **Equipment System**: 8 equipment slots, 7 rarity tiers, procedural generation with level scaling
- **Status Effects**: 26 predefined effects with stacking, DOT/HOT, control, and stat modifiers
- **Combat Engine**: Turn-based combat with multi-action, damage calculations, ability execution, and team management
- **Damage System**: Physical/magical damage, critical hits, hit/miss mechanics, lifesteal, AoE support
- **Formulas**: Damage calculation, stat scaling, XP curves, hit/miss mechanics
- **Utilities**: RNG system, formula library, ID generation

### Combat System Features
- **Turn-Based System**: Speed-based turn order with one-time player character ordering
- **Multi-Action Combat**: Use multiple abilities per turn with AP tracking
- **Damage Formulas**: `(ATK × mult) - (DEF × 0.5)` for physical, `(MAG × mult) - (RES × 0.5)` for magical
- **Critical Hits**: 2× damage multiplier on CRT% proc
- **Hit/Miss Mechanics**: `clamp(ACC - (EVA × 0.5), 5, 95)` hit chance
- **Status Integration**: DOT/HOT processing, control effects, stat modifiers
- **Reserve System**: Team wipe detection with reserve swap or accept defeat
- **Combat Log**: Comprehensive event tracking for all combat actions
- **Ability Execution**: Full damage, healing, status effects, AP restore/drain support

### Equipment System Features
- **8 Slots**: Main Hand, Off Hand, Head, Chest, Legs, Neck, Wrist×2
- **7 Rarity Tiers**: Basic, Common, Uncommon, Rare, Epic, Legendary, Mythic
- **Level Requirements**: Equipment drops at stage level, requires matching character level
- **Stat Bonuses**: Dynamic scaling (base value + level × growth rate × rarity multiplier)
- **Procedural Names**: "Mythic Worldbreaker Greatsword", "Rare Enchanted Amulet", etc.
- **Dual-Weapon Support**: Two-handed weapons occupy both hand slots

### Status Effects System Features
- **26 Predefined Effects**: Buffs, debuffs, DOT, HOT, control effects, special effects
- **Stacking Mechanics**: Stackable effects accumulate (with max stacks), non-stackable refresh duration
- **Stat Modifiers**: Both flat bonuses (+20 ATK) and multiplicative modifiers (×1.25 ATK)
- **Turn-Based Processing**: Effects tick at turn start or end with automatic duration tracking
- **Control Effects**: Stun, freeze, sleep, petrify prevent character actions
- **DOT/HOT**: Damage/healing over time with stacking support (Poison, Burn, Bleed, Regeneration)

### Character Types Implemented
| Type | Role | HP (Lv1) | AP/Turn | Key Stats |
|------|------|----------|---------|-----------|
| Alpha (Paladin) | Tank/Healer | 120 | +3 | High DEF, Medium ATK |
| Beta (Rogue) | Crit DPS | 70 | +6 | High SPD/CRT, Low DEF |
| Gamma (Mage) | AoE Caster | 60 | +4 | High MAG/RES, Low HP |
| Delta (Warrior) | Physical DPS | 100 | +4 | High ATK, Medium DEF |
| Epsilon (Cleric) | Healer/Support | 80 | +5 | High MAG/RES, Balanced |
| Zeta (Berserker) | High Risk DPS | 90 | +5 | Very High ATK, Low DEF |

## 🤝 Contributing
This project is in active development (Phases 1-6 complete, 43% done). The core combat system is now functional and ready for enemy system implementation. Contributions are welcome!

---

*Last Updated: October 22, 2025*

