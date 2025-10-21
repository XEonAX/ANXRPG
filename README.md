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
**Phase**: Documentation - Implementation not yet started

This project is currently in the planning and documentation phase. See the implementation plan for the 14-phase development roadmap.

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

## 🛠️ Development Commands (Future)
```bash
npm run dev         # Start Vite dev server
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

## 📄 License
See [LICENSE](LICENSE) file for details.

## 🤝 Contributing
This project is currently in the documentation phase. Implementation contributions will be welcome once the initial codebase is established.

---

*Last Updated: October 21, 2025*

