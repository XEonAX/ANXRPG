# ANXRPG - Game Design Document

## Overview
A turn-based fighting RPG with deep character progression, equipment systems, and 100 stages of increasingly difficult combat.

## Core Mechanics

### Combat System
- **Team Composition**: 1-3 active characters, up to 3 reserve characters (6 total max)
- **Turn Order**: Based on Speed/Agility stat between teams, but player chooses order within their team (one-time ordering at battle start)
- **Multi-Action**: Characters can use multiple abilities in one turn if they have enough AP
- **Victory Condition**: Defeat all enemies
- **Defeat Condition**: All team members (active + reserve) are downed, or player accepts defeat
- **Reserve System**: 
  - When entire active team is downed, reserve team can swap in at the start of the next round
  - Reserve characters retain their current HP/AP state when swapping
  - Player can choose to accept defeat instead of swapping
  - Manual swaps only allowed when primary team is wiped

### Action Points (AP) System
- **Base Regeneration**: 3 AP per turn
- **Max AP Pool**: 10 AP
- **Character-Specific Regen**:
  - Alpha (Paladin): +3 AP/turn
  - Beta (Rogue): +6 AP/turn
  - Gamma (Mage): +4 AP/turn
  - Delta (Warrior): +4 AP/turn
  - Epsilon (Cleric): +5 AP/turn
  - Zeta (Berserker): +5 AP/turn
- **Modifiers**: Equipment and afflictions can affect AP regeneration
- **Usage**: Players decide how much AP to spend each turn
- **Abilities**: Each ability costs different AP amounts (1-4 AP typically)

### Character System

#### Character Types (6 Total)
1. **Alpha (Paladin)** - Tank/Off-Healer
   - High HP, High DEF, Low SPD
   - AP Regen: +3/turn
   - Role: Frontline tank with defensive abilities and minor healing

2. **Beta (Rogue)** - Critical Damage Dealer
   - Medium HP, Low DEF, Very High SPD
   - AP Regen: +6/turn
   - Role: Fast striker with high critical rate and evasion

3. **Gamma (Mage)** - AoE/Elemental Caster
   - Low HP, Low DEF, Medium SPD
   - AP Regen: +4/turn
   - Role: Area damage and elemental effects

4. **Delta (Warrior)** - Physical Damage Dealer
   - High HP, Medium DEF, Medium SPD
   - AP Regen: +4/turn
   - Role: Reliable physical damage output

5. **Epsilon (Cleric)** - Pure Healer/Support
   - Medium HP, Medium DEF, Medium SPD
   - AP Regen: +5/turn
   - Role: Healing and buff support

6. **Zeta (Berserker)** - High Risk/High Reward
   - Medium HP, Low DEF, High SPD
   - AP Regen: +5/turn
   - Role: Massive damage with self-harm mechanics

#### Base Stats
- **HP (Hit Points)**: Health pool
- **ATK (Attack)**: Physical damage output
- **DEF (Defense)**: Damage reduction
- **MAG (Magic)**: Magical damage output
- **RES (Resistance)**: Magic damage reduction
- **SPD (Speed)**: Turn order priority
- **CRT (Critical)**: Critical hit chance % (multiplies final damage on proc)
- **EVA (Evasion)**: Dodge chance % (attacks can miss, AP still consumed)
- **ACC (Accuracy)**: Hit chance % (vs target EVA, abilities can have guaranteed hit)

**Note**: Hit/miss formula uses ACC vs EVA calculation for optimal gameplay balance

#### Abilities
- Each character has **4 ability slots**
- Abilities unlock as character levels up:
  - Ability 1: Available from level 1
  - Ability 2: Unlocks at level 5
  - Ability 3: Unlocks at level 10
  - Ability 4: Unlocks at level 20
- Each ability has an AP cost
- Characters can use multiple abilities per turn if they have sufficient AP
  - Abilities chosen one at a time with option to "end turn"
  - Turn continues until AP exhausted or player ends turn

**Note on Ability Design**: Specific abilities for each character type are not yet defined. When designing abilities, they should:
- Fit character archetypes (e.g., Paladin = defensive/healing, Rogue = fast/critical-focused)
- Balance AP costs (1-4 AP typical) with power level
- Include variety in target types (single, AoE, self, ally) and effects
- Some abilities should have guaranteed hit flag (ignore ACC/EVA)

- **Skill Tree**: Character-type-specific progression paths
  - ~20 nodes per character type
  - Nodes unlock in sequence (linear progression)
  - 1 skill point awarded per level up
  - Some nodes require multiple points to unlock
  - Each node provides EITHER stat bonus OR new ability (not both)
  - Skill tree can grant 5th, 6th+ ability slots

### Equipment System

#### Equipment Slots (Standard)
- **Main Hand**: Single-handed weapon or item
- **Off Hand**: Single-handed weapon/shield or item (OR one dual-handed weapon in both hands)
- **Head**: Helmet/hat
- **Chest**: Armor/top
- **Legs**: Pants/bottom
- **Neck**: Amulet/necklace (1 slot)
- **Wrist**: Bracers/bracelets (2 slots)

**Total**: 8 equipment slots at base level

#### Late Game Equipment Expansion
At extremely high levels, additional equipment slots unlock (exact mechanics TBD)

#### Equipment Properties
- Level requirements
- **Equipment Levels**: 
  - Equipment drops at a level matching the stage number
  - Equipment level gates equipping (must match character level)
  - Equipment levels affect stats with linear scaling
- Stat bonuses (HP, ATK, DEF, etc.)
- Special effects (AP regen, status resistance, etc.)
- Rarity tiers
- No durability/breaking - permanent once earned
- **Inventory**: Unlimited stockpile capacity
- **UI**: Option to hide unwanted equipment (no discard needed)

### Progression System

#### Experience & Leveling
- **Starting Level**: 1
- **EXP Source**: Battle victories only
- **EXP Distribution**: Equally among all 6 characters (active + reserve)
- **Level Up Benefits**:
  - All stats increase (scaling formulas per character type)
  - 1 skill point awarded (some nodes require multiple points)
  - New abilities unlock at specific levels (5, 10, 20)
  - Skill tree progression points
- **Scaling**: Small stats and damage at low levels → gigantic numbers at extreme levels

#### Equipment Acquisition
- Earned from battle victories
- **Drop Rate**: Max 1 equipment per enemy defeated (can be 0)
- Better equipment from harder battles/bosses
- Procedurally named equipment (e.g., "Iron Sword", "Mythril Blade", "Godslayer Greatsword")

#### Starting Conditions
- Player selects 1 character from 6 types
- Starting level: 1
- Basic starting equipment for chosen character type
- **Character Recruitment**: New characters unlock based on total battles WON
  - Unlock schedule: Every 20 battle victories (20, 40, 60, 80, 100 wins)
  - Player chooses which character type to recruit
  - Duplicate character types allowed (e.g., two Alphas)
  - At 6th unlock (100 battles): Option to retire one existing character for new recruit
  - Recruited characters start at level 1
  - **Battle Counting**: All victorious battles count, including farming same stage (excludes very early/trivial stages)
  - Helps players who get stuck at difficult stages

### Status Effects System

#### Effect Types
- **Buffs**: Stat increases, damage boosts
- **Debuffs**: Stat decreases, damage reduction
- **Afflictions**: Poison, burn, stun, freeze, etc.
- **Duration**: X turns (specified per effect)
- **Stacking**: Effects can stack (multiple of same type)

#### Application
- From abilities
- From equipment special effects
- From enemy attacks

### Enemy System

#### Enemy Tiers (Progression)
1. **Tier 1**: Slimes, Rats, Bats (Stages 1-10)
2. **Tier 2**: Goblins, Wolves, Skeletons (Stages 11-20)
3. **Tier 3**: Orcs, Trolls, Wraiths (Stages 21-30)
4. **Tier 4**: Demons, Dragons, Elementals (Stages 31-50)
5. **Tier 5**: Ancient Beasts, Titans (Stages 51-70)
6. **Tier 6**: Demigods, Celestials (Stages 71-90)
7. **Tier 7**: Gods, Primordials (Stages 91-100)

#### Enemy Character Classes
Enemies also have character classes (similar to player types):
- Enemy Tanks, Enemy Rogues, Enemy Mages, etc.
- Boss enemies have enhanced abilities and stats

#### Enemy Team Composition
- **Team Size**: 1-3 enemies per battle
- **Scaling**: Enemy count and levels flexible per stage (can have 3 level 1 enemies at stage 5)
- **Boss Battles**: 
  - Bosses appear solo initially
  - Can summon up to 2 minions during combat
  - Summon triggers:
    - At specific HP thresholds (e.g., 75%, 50%, 25%)
    - Multiple times per battle
    - Every X turns
  - Summoned minions are standard enemies (weaker than boss)

#### Scaling
- Stats and damage scale dramatically from Tier 1 to Tier 7
- Boss enemies significantly stronger than normal enemies in same tier

### Campaign Structure

#### Stage System
- **Total Stages**: 100
- **Stage Types**:
  - Normal stages: Standard enemy encounters
  - Boss stages: Every 10th stage (10, 20, 30... 100) features a boss battle
- **Progression**: Linear - must clear stage N to unlock stage N+1
- **Retry System**: Can replay cleared stages at same or lower tier for EXP/equipment farming
- **Defeat Handling**: Must retry battle after defeat

#### Save System
- Auto-save after each stage completion
- Saves to browser LocalStorage
- Persists:
  - Character roster and levels
  - Equipment inventory
  - Stage progress
  - Current team composition

## Game Juice Elements

### Combat Messages
- Critical hits with special flavor text
- Dodge/miss reactions
- Overkill damage descriptions
- Status effect application messages
- Death animations/descriptions
- Victory celebrations

### Text Descriptions
- Interesting ability descriptions
- Dramatic battle narration
- Character-specific combat barks
- Equipment flavor text
- Enemy encounter introductions

### Visual Feedback (Text-Based)
- Damage numbers with modifiers
- Status effect indicators
- Turn order display
- HP/AP bars (ASCII or HTML progress bars)
- Battle log with color coding

## Technical Stack

- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: CSS (minimal, to be added later)
- **UI**: Pure semantic HTML
- **Deployment**: Static website
- **Storage**: LocalStorage for save data

## Key Formulas & Calculations

### Damage Calculation
```typescript
// Physical Damage
baseDamage = (ATK * abilityMultiplier) - (targetDEF * 0.5)
finalDamage = baseDamage * critMultiplier * randomVariance (OPTIONAL)

// Magical Damage
baseDamage = (MAG * abilityMultiplier) - (targetRES * 0.5)
finalDamage = baseDamage * critMultiplier * randomVariance (OPTIONAL)

// Critical Hit
if (random(1, 100) <= CRT) {
  critMultiplier = 2.0
}

// Random Variance (OPTIONAL - can be disabled for consistency)
randomVariance = random(0.9, 1.1) // ±10%

// Hit/Miss Calculation
// Use formula: hitChance = clamp(ACC - (EVA * 0.5), 5, 95)
// Or alternative: hitChance = (100 * ACC) / (ACC + EVA)
// Some abilities can have guaranteed hit (100% accuracy)
```

## Procedural Naming Conventions

### Characters
- Greek alphabet: Alpha, Beta, Gamma, Delta, Epsilon, Zeta, Eta, Theta, Iota, Kappa, Lambda, Mu, Nu, Xi, Omicron, Pi, Rho, Sigma, Tau, Upsilon, Phi, Chi, Psi, Omega
- Up to 24 unique character types possible

### Equipment Tiers (Example)
- Basic: Wooden, Rusty, Tattered
- Common: Iron, Leather, Bronze
- Uncommon: Steel, Chainmail, Silver
- Rare: Mithril, Enchanted, Blessed
- Epic: Dragonbone, Celestial, Infernal
- Legendary: Godforged, Eternal, Primordial
- Mythic: Worldbreaker, Starborn, Void-touched

### Enemy Names
Procedural generation combining tier + type + modifier

## Phase 1 Implementation Scope

### Must Have
1. ✅ Project setup with Vite + TypeScript
2. ✅ Core character system (6 types with stats)
3. ✅ Combat system (turn-based, AP usage, multi-action)
4. ✅ Basic abilities (4 per character type)
5. ✅ Equipment system (8 slots, leveled equipment)
6. ✅ Enemy system (basic tier scaling, 1-3 enemies, boss summons)
7. ✅ Level up and EXP
8. ✅ Status effects engine
9. ✅ Campaign structure (100 stages)
10. ✅ Save/load system
11. ✅ Basic semantic HTML UI
12. ✅ Basic skill tree system (passive bonuses and/or abilities)
13. ✅ Character recruitment system (battle count based)
14. ✅ Hit/miss mechanics (ACC vs EVA)

### Nice to Have (Future)
- Advanced skill tree UI with visual node graph
- Advanced equipment effects
- Particle/animation effects
- Sound effects
- Achievement system
- Multiple save slots
- Character recruitment story events
- Equipment crafting/upgrading
- Equipment comparison tooltips

## Development Priorities

1. **Core Systems First**: Stats, combat, abilities
2. **Single Battle Loop**: Get one battle working perfectly
3. **Progression**: Leveling and equipment
4. **Content**: All 6 characters, enemy variety
5. **Campaign**: Stage system and save
6. **Polish**: Game juice and flavor text
7. **UI**: Semantic HTML interface

---

*Document Version: 1.0*
*Last Updated: October 21, 2025*
