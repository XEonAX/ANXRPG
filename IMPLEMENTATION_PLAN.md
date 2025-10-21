# ANXRPG - Technical Implementation Plan

## Project Structure

```
ANXRPG/
├── src/
│   ├── main.ts                 # Entry point
│   ├── game.ts                 # Main game loop and state management
│   ├── types/
│   │   ├── character.ts        # Character type definitions
│   │   ├── equipment.ts        # Equipment type definitions
│   │   ├── ability.ts          # Ability type definitions
│   │   ├── enemy.ts            # Enemy type definitions
│   │   ├── combat.ts           # Combat-related types
│   │   └── status.ts           # Status effect types
│   ├── systems/
│   │   ├── character.ts        # Character creation and management
│   │   ├── combat.ts           # Combat engine
│   │   ├── damage.ts           # Damage calculation
│   │   ├── statusEffects.ts    # Status effect engine
│   │   ├── progression.ts      # Leveling and XP
│   │   ├── equipment.ts        # Equipment management
│   │   └── campaign.ts         # Stage and campaign management
│   ├── data/
│   │   ├── characterTypes.ts   # 6 character type definitions
│   │   ├── abilities.ts        # All ability definitions
│   │   ├── equipment.ts        # Equipment templates
│   │   ├── enemies.ts          # Enemy templates
│   │   └── stages.ts           # Campaign stage definitions
│   ├── ui/
│   │   ├── combat.ts           # Combat UI rendering
│   │   ├── team.ts             # Team management UI
│   │   ├── character.ts        # Character sheet UI
│   │   ├── campaign.ts         # Campaign/stage select UI
│   │   └── messages.ts         # Combat message generation
│   ├── utils/
│   │   ├── random.ts           # RNG utilities
│   │   ├── formulas.ts         # Stat calculation formulas
│   │   ├── nameGenerator.ts    # Procedural name generation
│   │   └── storage.ts          # Save/load system
│   └── styles/
│       └── main.css            # Minimal styling (future)
├── index.html                  # Main HTML file
├── package.json
├── tsconfig.json
├── vite.config.ts
├── GAME_DESIGN.md              # Game design document
└── IMPLEMENTATION_PLAN.md      # This file
```

## Implementation Phases

### Phase 1: Project Foundation (Day 1)
**Goal**: Set up development environment and core type system

#### Tasks
1. Initialize Vite project with TypeScript
2. Configure TypeScript for strict mode
3. Set up basic HTML structure
4. Define all core TypeScript types/interfaces:
   - Character stats and properties
   - Equipment slots and items
   - Abilities and effects
   - Status effects
   - Combat state
   - Game state

**Deliverable**: Compiling TypeScript project with complete type definitions

---

### Phase 2: Character System (Day 1-2)
**Goal**: Implement character creation, stats, and the 6 character types

#### Tasks
1. Create base character class/interface
2. Implement stat calculation system
3. Define all 6 character types with base stats:
   - Alpha (Paladin)
   - Beta (Rogue)
   - Gamma (Mage)
   - Delta (Warrior)
   - Epsilon (Cleric)
   - Zeta (Berserker)
4. Implement character factory function
5. Create stat scaling formulas for leveling
6. Add AP regeneration logic per character type

**Deliverable**: Ability to create any of the 6 character types with proper stats

---

### Phase 3: Ability System (Day 2)
**Goal**: Define and implement abilities for all character types

#### Tasks
1. Create ability execution engine
2. Define 4 abilities per character type (24 abilities total):
   - Ability costs (AP)
   - Damage/healing formulas
   - Status effects applied
   - Target selection (single/AoE/self/ally)
3. Implement ability unlock system (level gates)
4. Create ability effect resolver

**Deliverable**: All 24 abilities defined and executable

---

### Phase 4: Equipment System (Day 2-3)
**Goal**: Implement equipment slots, items, and stat modifications

#### Tasks
1. Create equipment slot manager (8 slots)
2. Implement equipment stat bonus application
3. Define equipment templates by tier:
   - Weapons (single-hand, dual-hand)
   - Armor (head, chest, legs)
   - Accessories (neck, wrist x2)
4. Create equipment level requirements
5. Implement procedural equipment naming
6. Add equipment equip/unequip logic
7. Integrate equipment bonuses into character stats

**Deliverable**: Characters can equip items and receive stat bonuses

---

### Phase 5: Status Effect System (Day 3)
**Goal**: Implement buffs, debuffs, and afflictions

#### Tasks
1. Create status effect manager
2. Implement effect types:
   - Stat modifiers (ATK up, DEF down, etc.)
   - DOT effects (poison, burn)
   - Control effects (stun, freeze)
   - Regeneration effects
3. Add effect duration tracking
4. Implement effect stacking
5. Create effect tick/update logic
6. Add effect expiration handling

**Deliverable**: Status effects can be applied, tick each turn, and expire

---

### Phase 6: Combat Engine (Day 3-4)
**Goal**: Build the core turn-based combat system

#### Tasks
1. Create combat state manager
2. Implement turn order calculation (speed-based)
3. Add player turn order selection UI
4. Create action resolution system:
   - Attack execution
   - Ability usage
   - Target selection
5. Implement damage calculation:
   - Physical damage (ATK vs DEF)
   - Magical damage (MAG vs RES)
   - Critical hits
   - Evasion/accuracy
6. Add AP management per turn
7. Create team wipe detection
8. Implement reserve team swap
9. Add victory/defeat conditions
10. Build combat log system

**Deliverable**: Complete functional combat from start to victory/defeat

---

### Phase 7: Enemy System (Day 4)
**Goal**: Create enemies with scaling and variety

#### Tasks
1. Create enemy templates for each tier (7 tiers)
2. Define enemy character classes
3. Implement enemy stat scaling formulas
4. Create boss enemy variants (enhanced stats/abilities)
5. Add enemy AI for ability selection
6. Implement enemy team composition
7. Create procedural enemy name generation

**Deliverable**: Diverse enemies across all 7 tiers with proper scaling

---

### Phase 8: Progression System (Day 4-5)
**Goal**: Implement leveling, XP, and skill trees

#### Tasks
1. Create XP calculation and distribution
2. Implement level-up system:
   - Stat increases per level
   - XP requirements per level
3. Add ability unlock tracking
4. Create skill tree system (basic):
   - Skill nodes per character type
   - Skill point allocation
   - Passive bonuses
5. Implement starting character selection
6. Add character recruitment system (campaign integration)

**Deliverable**: Characters gain XP, level up, and unlock abilities

---

### Phase 9: Campaign System (Day 5)
**Goal**: Build 100-stage campaign structure

#### Tasks
1. Create stage definition system
2. Define all 100 stages:
   - Normal stages (90)
   - Boss stages (10)
3. Implement stage progression logic
4. Add stage unlock system
5. Create enemy composition per stage
6. Implement reward distribution (XP, equipment)
7. Add stage retry functionality
8. Create farming mechanics (replay stages)

**Deliverable**: 100-stage campaign with progression

---

### Phase 10: Save System (Day 5-6)
**Goal**: Persistent game state via LocalStorage

#### Tasks
1. Create serialization for game state:
   - Character roster
   - Equipment inventory
   - Stage progress
   - Team composition
2. Implement save to LocalStorage
3. Implement load from LocalStorage
4. Add auto-save after battles
5. Create new game initialization
6. Add save data validation/migration

**Deliverable**: Game progress persists across sessions

---

### Phase 11: UI Implementation (Day 6-7)
**Goal**: Create semantic HTML interface for all game screens

#### Tasks
1. **Character Selection Screen**
   - Display 6 character types
   - Show starting stats
   - Selection interface
2. **Team Management Screen**
   - Active team (1-3 characters)
   - Reserve team (up to 3 characters)
   - Swap interface
3. **Character Sheet Screen**
   - Stats display
   - Equipment slots
   - Abilities list
   - Status effects
4. **Equipment Screen**
   - Inventory display
   - Equip/unequip interface
   - Item comparison
5. **Combat Screen**
   - Team display (HP, AP, status)
   - Enemy display
   - Turn order indicator
   - Action selection (abilities)
   - Combat log
   - Target selection
6. **Campaign Screen**
   - Stage list
   - Current progress
   - Stage info
   - Start battle button
7. **Battle Results Screen**
   - Victory/defeat message
   - XP gained
   - Loot acquired
   - Level up notifications

**Deliverable**: Complete playable HTML UI

---

### Phase 12: Game Juice & Polish (Day 7-8)
**Goal**: Add flavor text, messages, and feel-good elements

#### Tasks
1. Create message template system
2. Write combat flavor text:
   - Attack descriptions
   - Critical hit messages
   - Dodge/miss reactions
   - Killing blow descriptions
3. Add character-specific combat barks
4. Create ability flavor descriptions
5. Write equipment flavor text
6. Add enemy encounter introductions
7. Create victory/defeat narratives
8. Implement damage number formatting (e.g., "1,234,567 damage!")
9. Add status effect application messages
10. Create level-up celebration text

**Deliverable**: Juicy, engaging combat experience

---

### Phase 13: Balance & Testing (Day 8-9)
**Goal**: Tune numbers and test progression curve

#### Tasks
1. Balance character base stats
2. Tune damage formulas
3. Adjust level scaling curves
4. Balance enemy difficulty per stage
5. Test full playthrough (1-100 stages)
6. Adjust equipment stat bonuses
7. Balance ability costs and effects
8. Fine-tune boss difficulty spikes

**Deliverable**: Balanced progression from stage 1 to 100

---

### Phase 14: Final Polish (Day 9-10)
**Goal**: Bug fixes and final touches

#### Tasks
1. Fix any bugs found during testing
2. Optimize performance
3. Add loading states
4. Improve error handling
5. Add input validation
6. Write README documentation
7. Add game instructions/tutorial
8. Final playtesting

**Deliverable**: Polished, playable game ready for deployment

---

## Key Formulas & Calculations

### Stat Scaling
```typescript
// Level up stat increase
newStat = baseStat + (level * growthRate)

// Character-specific growth rates
Alpha (Paladin):
  - HP: 100 + (level * 15)
  - DEF: 50 + (level * 8)
  - ATK: 30 + (level * 4)
  
Beta (Rogue):
  - HP: 60 + (level * 8)
  - SPD: 70 + (level * 10)
  - CRT: 20 + (level * 2)
  
// etc...
```

### Damage Calculation
```typescript
// Physical Damage
baseDamage = (ATK * abilityMultiplier) - (targetDEF * 0.5)
finalDamage = baseDamage * critMultiplier * randomVariance(0.9, 1.1)

// Magical Damage
baseDamage = (MAG * abilityMultiplier) - (targetRES * 0.5)
finalDamage = baseDamage * critMultiplier * randomVariance(0.9, 1.1)

// Critical Hit
if (random(1, 100) <= CRT) {
  critMultiplier = 2.0
}
```

### XP Requirements
```typescript
// Exponential growth
xpForLevel(level) = Math.floor(100 * Math.pow(level, 2.5))

// Levels 1-10: ~100-3162 XP
// Levels 10-50: ~3162-279,508 XP
// Levels 50-100: Millions of XP
```

### Enemy Scaling
```typescript
// Enemy stats scale with stage
enemyStat = baseStat * Math.pow(1.15, stage)

// Boss multiplier
if (isBoss) {
  enemyStat *= 2.5
}
```

## Tech Stack Details

### Dependencies
```json
{
  "devDependencies": {
    "typescript": "^5.2.0",
    "vite": "^5.0.0"
  }
}
```

### TypeScript Configuration
- Strict mode enabled
- ES2022 target
- DOM lib included
- Module: ESNext

### Build Output
- Static HTML/CSS/JS bundle
- Deployable to any static host (GitHub Pages, Netlify, Vercel)

---

## Development Workflow

1. **Build**: `npm run dev` - Start dev server
2. **Type Check**: `npm run type-check` - Verify TypeScript
3. **Build Production**: `npm run build` - Generate static files
4. **Preview**: `npm run preview` - Test production build

---

## Next Steps

Once implementation plan is approved:
1. Initialize Vite project
2. Set up TypeScript configuration
3. Create basic HTML structure
4. Begin Phase 1: Type definitions

---

*Plan Version: 1.0*
*Estimated Timeline: 10 days for MVP*
*Last Updated: October 21, 2025*
