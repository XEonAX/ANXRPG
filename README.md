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
**Phase**: Active Development - Phases 1-4 Complete ✅

- ✅ **Phase 1**: Project Foundation (Types & Structure)
- ✅ **Phase 2**: Character System (6 character types implemented)
- ✅ **Phase 3**: Ability System (24 abilities defined)
- ✅ **Phase 4**: Equipment System (8 slots, 7 rarity tiers)
- 🚧 **Phase 5**: Status Effects Engine (Next)

See the implementation plan for the complete 14-phase development roadmap.

## 📖 Documentation
- **[GAME_DESIGN.md](GAME_DESIGN.md)** - Complete game mechanics, formulas, and systems
- **[IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)** - 14-phase technical implementation roadmap
- **[.github/copilot-instructions.md](.github/copilot-instructions.md)** - AI coding agent guidelines

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
- **Formulas**: Damage calculation, stat scaling, XP curves, hit/miss mechanics
- **Utilities**: RNG system, formula library, ID generation

### Equipment System Features
- **8 Slots**: Main Hand, Off Hand, Head, Chest, Legs, Neck, Wrist×2
- **7 Rarity Tiers**: Basic, Common, Uncommon, Rare, Epic, Legendary, Mythic
- **Level Requirements**: Equipment drops at stage level, requires matching character level
- **Stat Bonuses**: Dynamic scaling (base value + level × growth rate × rarity multiplier)
- **Procedural Names**: "Mythic Worldbreaker Greatsword", "Rare Enchanted Amulet", etc.
- **Dual-Weapon Support**: Two-handed weapons occupy both hand slots

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
This project is in active development (Phases 1-3 complete). The core systems are established and ready for expansion. Contributions are welcome!

---

*Last Updated: October 21, 2025*

