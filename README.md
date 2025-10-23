# ANXRPG
A web-based turn-based fighting RPG with deep character progression, equipment systems, and 100 stages of increasingly difficult combat.

## 🎮 Game Status: **FULLY PLAYABLE!** 🎉

**Version 2.0.0 - Public Release** (October 2025)

ANXRPG is a complete, fully playable turn-based RPG featuring:
- ✅ **6 Unique Character Types** - Each with distinct abilities and playstyles
- ✅ **100-Stage Campaign** - Progress through 7 enemy tiers with epic boss battles
- ✅ **Deep Combat System** - Multi-action turn-based battles with AP management
- ✅ **Equipment & Progression** - 8 equipment slots, skill trees, and character recruitment
- ✅ **Full UI Experience** - Complete interface with inventory, character sheets, and settings
- ✅ **Mobile-Friendly** - Responsive design works great on all devices
- ✅ **Save System** - Auto-save, manual save, and import/export functionality

## 🚀 Tech Stack
- **Build Tool**: Vite 7.x
- **Language**: TypeScript (strict mode, ES2022)
- **UI**: Pure vanilla TypeScript + semantic HTML (no frameworks)
- **Styling**: Complete CSS system with dark theme
- **Storage**: Browser LocalStorage with Set/Map serialization
- **Deployment**: Static site (GitHub Pages/Netlify ready)

## 🎯 Key Features
- **6 Character Types**: Alpha (Paladin), Beta (Rogue), Gamma (Mage), Delta (Warrior), Epsilon (Cleric), Zeta (Berserker)
- **Multi-Action Combat**: Use multiple abilities per turn with AP management
- **Smart Enemy AI**: Enemies select and use abilities intelligently
- **Click-to-Target**: Select specific enemies with visual feedback
- **Reserve System**: Swap between active and reserve teams when defeated
- **Equipment System**: 8 equipment slots with 7 rarity tiers and procedural generation
- **Inventory Management**: Filter by slot/rarity/level, sort equipment, equip/unequip
- **Skill Trees**: 120 nodes total (20 per character) with stat bonuses and abilities
- **Progressive Recruitment**: Unlock new characters every 20 battle victories
- **100 Stages**: 7 enemy tiers from Slimes to Gods, bosses every 10th stage
- **Auto-Healing**: Full HP/AP restore after victories
- **Save System**: Auto-save, manual save, export/import JSON
- **Settings**: 8 configurable options, statistics dashboard, data management
- **Responsive Design**: Works beautifully on desktop and mobile devices

## 🧪 Play It Now!
```bash
npm install         # Install dependencies (first time only)
npm run dev         # Start dev server at http://localhost:5173
```

### How to Play
1. **Main Menu** → Click "✨ New Game"
2. **Select Character** → Choose from 6 types (Paladin, Rogue, Mage, Warrior, Cleric, Berserker)
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

##  Core Mechanics

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

## 📊 Project Statistics

### Code Metrics
- **Total Lines**: ~17,000+ (all files)
- **UI Code**: 8,955 lines (6,201 TS + 2,754 CSS)
- **Core Systems**: ~6,000 lines TypeScript
- **Flavor Text**: 500+ lines (24 abilities, 28 enemies, 7 rarities)
- **Animations**: 261 lines CSS (15+ animations)
- **Build Size**: 223.68 KB JS (56.85 KB gzipped), 81.27 KB CSS (12.47 KB gzipped)

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

## 🛠️ Development Commands
```bash
npm install         # Install dependencies
npm run dev         # Start Vite dev server (http://localhost:5173)
npm run build       # Production build
npm run preview     # Preview production build
npm run type-check  # TypeScript type checking
```
## 📖 Documentation
- **[GAME_DESIGN.md](GAME_DESIGN.md)** - Complete game mechanics, formulas, and systems
- **[IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)** - Technical implementation roadmap
- **[CHANGELOG.md](CHANGELOG.md)** - Version history and release notes
- **[docs/](docs/)** - Development documentation and session summaries

## 🤝 Contributing
This project is open source and contributions are welcome! Feel free to:
- Report bugs or suggest features via GitHub Issues
- Submit pull requests with improvements
- Share feedback on game balance and design

## 📄 License
See [LICENSE](LICENSE) file for details.

---

*Built with ❤️ using Vite + TypeScript • No frameworks, pure vanilla JS*

