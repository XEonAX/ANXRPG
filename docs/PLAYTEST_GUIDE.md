# ANXRPG - Playtest Guide

**Date**: October 24, 2025  
**Purpose**: Manual playtesting checklist for final balance and bug testing

## 🎯 Quick Start

```bash
npm run dev
```

Open http://localhost:5173 in your browser

## 📋 Playtest Checklist

### 1. New Game Flow (15 minutes)

Test each character type through early game:

#### Test Alpha (Paladin)
- [ ] Click "New Game"
- [ ] Select **Alpha** character
- [ ] Name: "TestAlpha"
- [ ] **Expected**: Tank with Guardian's Blessing (heal ability)
- [ ] Play through Stages 1-5
- [ ] **Check**: Can survive thanks to healing
- [ ] **Check**: Battles feel fair (not too easy/hard)
- [ ] **Check**: Equipment drops regularly (1-2 items per stage)

#### Test Beta (Rogue)
- [ ] Start new game, select **Beta**
- [ ] Name: "TestBeta"
- [ ] **Expected**: High speed, high crit rate
- [ ] Play through Stages 1-5
- [ ] **Check**: Goes first most turns
- [ ] **Check**: Critical hits happen frequently (~30-40%)
- [ ] **Check**: Battles end quickly due to damage

#### Test Gamma (Mage)
- [ ] Start new game, select **Gamma**
- [ ] Name: "TestGamma"
- [ ] **Expected**: AoE abilities (Fireball, Frost Nova)
- [ ] Play through Stages 1-5
- [ ] **Check**: Can hit multiple enemies at once
- [ ] **Check**: Meteor Storm (unlocks at level 5) is powerful
- [ ] **Check**: Low HP makes positioning important

#### Test Delta (Warrior)
- [ ] Start new game, select **Delta**
- [ ] Name: "TestDelta"
- [ ] **Expected**: High damage, reliable physical attacks
- [ ] Play through Stages 1-5
- [ ] **Check**: Consistent damage output
- [ ] **Check**: Rampage (unlocks later) hits hard
- [ ] **Check**: Balanced difficulty

#### Test Epsilon (Cleric)
- [ ] Start new game, select **Epsilon**
- [ ] Name: "TestEpsilon"  
- [ ] **Expected**: Pure healer with support
- [ ] Play through Stages 1-5
- [ ] **Check**: Healing Light keeps HP topped off
- [ ] **Check**: Can heal allies (when you recruit more)
- [ ] **Check**: Lower damage balanced by survivability

#### Test Zeta (Berserker)
- [ ] Start new game, select **Zeta**
- [ ] Name: "TestZeta"
- [ ] **Expected**: High risk/reward, self-damage
- [ ] Play through Stages 1-5
- [ ] **Check**: Furious Strike deals good damage
- [ ] **Check**: Bloodlust/Berserk have self-harm trade-offs
- [ ] **Check**: Exciting but dangerous playstyle

---

### 2. Combat System (10 minutes)

Pick ONE character, test combat mechanics:

#### Multi-Action System
- [ ] Start battle with 10 AP
- [ ] Use 2-3 abilities in one turn
- [ ] **Check**: AP deducts correctly
- [ ] **Check**: "End Turn" button appears
- [ ] **Check**: Can click "End Turn" with AP remaining
- [ ] **Check**: AP regenerates next turn

#### Enemy AI
- [ ] Let enemies take turns
- [ ] **Check**: Enemies use abilities intelligently
- [ ] **Check**: Enemies target low-HP characters when smart
- [ ] **Check**: Enemies don't waste AP on impossible actions
- [ ] **Check**: Turn delays work (1.5s per enemy action)

#### Click-to-Target
- [ ] Use single-target ability (e.g., Quick Slash)
- [ ] **Check**: Can click different enemies
- [ ] **Check**: Visual feedback shows selected target
- [ ] **Check**: Ability hits the clicked enemy
- [ ] **Check**: No bugs with targeting

#### Status Effects
- [ ] Use ability that applies status (e.g., Frost Nova = slow)
- [ ] **Check**: Status icon appears on enemy
- [ ] **Check**: Status effect actually works (enemy slowed)
- [ ] **Check**: Duration decrements each turn
- [ ] **Check**: Effect expires after duration ends

#### Victory/Defeat
- [ ] Win a battle
- [ ] **Check**: Victory screen shows XP and loot
- [ ] **Check**: All characters healed to full HP/AP
- [ ] **Check**: Can continue to next stage
- [ ] Intentionally lose a battle (let enemies kill you)
- [ ] **Check**: Defeat screen appears
- [ ] **Check**: Can retry battle

---

### 3. Progression (15 minutes)

#### Leveling
- [ ] Win 3-5 battles
- [ ] **Check**: XP bar fills up
- [ ] **Check**: Level up notification appears
- [ ] **Check**: Stats increase (view Character Sheet)
- [ ] **Check**: Skill point granted

#### Skill Tree
- [ ] Open Character Sheet (click character card)
- [ ] Click "Skill Tree" tab
- [ ] Spend skill point on a node
- [ ] **Check**: Node unlocks properly
- [ ] **Check**: Stat bonus applies (if stat node)
- [ ] **Check**: Ability unlocks (if ability node)
- [ ] **Check**: Cannot unlock locked nodes

#### Equipment
- [ ] Win battles, collect equipment
- [ ] Open Inventory (🎒 button)
- [ ] Filter by rarity
- [ ] Sort by level
- [ ] **Check**: Filtering works
- [ ] **Check**: Sorting works
- [ ] Equip item on character
- [ ] **Check**: Stat bonuses apply
- [ ] **Check**: Old item unequipped
- [ ] View Character Sheet
- [ ] **Check**: Stats updated with equipment bonus

#### Recruitment
- [ ] Play until 20 victories (or set `gameState.statistics.battlesWon = 19` in console)
- [ ] Win one more battle
- [ ] **Check**: Recruitment screen appears
- [ ] **Check**: Can choose from 6 character types
- [ ] **Check**: New character starts at level 1
- [ ] **Check**: Can name new character
- [ ] **Check**: New character added to roster

---

### 4. Team Management (10 minutes)

#### Active/Reserve Teams
- [ ] Recruit 2nd character
- [ ] Go to Team Management
- [ ] **Check**: Can assign to Active team
- [ ] **Check**: Can assign to Reserve team
- [ ] **Check**: Max 3 active, max 3 reserve
- [ ] Drag character from Active to Reserve
- [ ] **Check**: Drag-and-drop works
- [ ] **Check**: Team assignments persist after save/load

#### Reserve Swap
- [ ] Start battle with Active team
- [ ] Intentionally let all Active members die
- [ ] **Check**: Reserve swap dialog appears
- [ ] **Check**: Shows correct reserve team count
- [ ] Click "Swap Reserve Team"
- [ ] **Check**: Reserve becomes Active
- [ ] **Check**: Can continue battle
- [ ] OR Click "Accept Defeat"
- [ ] **Check**: Returns to Campaign Map

---

### 5. Campaign Progression (10 minutes)

#### Stage Unlocking
- [ ] Beat Stage 1
- [ ] **Check**: Stage 2 unlocks
- [ ] **Check**: Stage 3 still locked
- [ ] Beat Stage 2
- [ ] **Check**: Stage 3 unlocks
- [ ] **Check**: Can replay Stage 1 or 2

#### Boss Battles
- [ ] Progress to Stage 10
- [ ] **Check**: Boss badge shows on stage
- [ ] Start Stage 10 battle
- [ ] **Check**: Boss appears (Slime King)
- [ ] **Check**: Boss has higher stats than normal enemies
- [ ] **Check**: Boss may summon minions at HP thresholds
- [ ] **Check**: Boss battle feels challenging

#### Difficulty Scaling
- [ ] Play through Stages 1-20
- [ ] **Check**: Enemies get progressively harder
- [ ] **Check**: Later stages require strategy
- [ ] **Check**: Not too hard (can progress with skill)
- [ ] **Check**: Not too easy (requires thought)

---

### 6. Save System (5 minutes)

#### Auto-Save
- [ ] Win a battle
- [ ] **Check**: "Game auto-saved!" notification
- [ ] Close browser tab
- [ ] Reopen game
- [ ] Click "Continue"
- [ ] **Check**: Progress restored

#### Manual Save
- [ ] Go to Settings (⚙️ button)
- [ ] Click "Save Game"
- [ ] **Check**: Success notification

#### Export/Import
- [ ] In Settings, click "Export Save"
- [ ] **Check**: JSON file downloads
- [ ] Click "Import Save"
- [ ] Select the exported JSON
- [ ] **Check**: Game state restored

#### Clear Data
- [ ] In Settings, scroll to "Data Management"
- [ ] Click "Clear All Data"
- [ ] Confirm twice
- [ ] **Check**: All progress erased
- [ ] **Check**: Main Menu shows "New Game" only

---

### 7. UI/UX (5 minutes)

#### Responsive Design
- [ ] Resize browser window to mobile size (375px)
- [ ] **Check**: Combat screen readable
- [ ] **Check**: Ability buttons fit
- [ ] **Check**: Can scroll horizontally if needed
- [ ] Resize to desktop (1920px)
- [ ] **Check**: Combat area uses full space
- [ ] **Check**: No wasted whitespace

#### Navigation
- [ ] Test all screen transitions:
  - Main Menu → Team Management
  - Team Management → Campaign Map
  - Campaign Map → Combat
  - Combat → Battle Results → Campaign
  - Character Sheet → Inventory → Settings
- [ ] **Check**: All transitions smooth
- [ ] **Check**: Back buttons work
- [ ] **Check**: No broken navigation

#### Visual Polish
- [ ] Check HP bars
- [ ] **Check**: Color-coded (green/yellow/red)
- [ ] **Check**: Smooth transitions
- [ ] Check combat log
- [ ] **Check**: Scrollable
- [ ] **Check**: Color-coded messages
- [ ] Check animations
- [ ] **Check**: Fade-ins work
- [ ] **Check**: No jarring animations

---

### 8. Edge Cases (5 minutes)

#### Inventory Management
- [ ] Collect 50+ equipment items
- [ ] Open Inventory
- [ ] **Check**: Performance still good
- [ ] **Check**: Scrolling smooth
- [ ] Toggle "Hide Low Rarity"
- [ ] **Check**: Common/Uncommon items hidden

#### Large Numbers
- [ ] Cheat character to level 50 (console: `getRoster()[0].level = 50`)
- [ ] Start battle
- [ ] **Check**: Damage numbers display correctly
- [ ] **Check**: No number overflow bugs

#### Empty Teams
- [ ] Try to start battle with empty Active team
- [ ] **Check**: Prevented or handled gracefully

#### Ability Spam
- [ ] Use same ability 5 times in one turn (if enough AP)
- [ ] **Check**: Works correctly
- [ ] **Check**: No duplicate animations

---

## 🐛 Common Issues to Watch For

### Combat Issues
- ❌ Abilities not deducting AP
- ❌ Enemies not attacking
- ❌ Turn order skipping players
- ❌ Status effects not expiring
- ❌ HP bars not updating

### Progression Issues
- ❌ XP not distributed to all characters
- ❌ Skill points not granted on level up
- ❌ Equipment bonuses not applying
- ❌ Recruitment not triggering at 20 wins

### UI Issues
- ❌ Screens not loading
- ❌ Buttons not clickable
- ❌ Text overlapping
- ❌ Images not loading
- ❌ Scroll bars missing

### Save/Load Issues
- ❌ Progress not saving
- ❌ Teams resetting
- ❌ Equipment disappearing
- ❌ Statistics not tracking

---

## 📊 Balance Targets

### Early Game (Stages 1-10)
- **Win Rate**: 80-100% (should be forgiving)
- **Battle Length**: 3-8 turns average
- **Death Rate**: Players should rarely die

### Mid Game (Stages 11-30)
- **Win Rate**: 60-80% (requires some strategy)
- **Battle Length**: 5-12 turns average
- **Death Rate**: Occasional deaths expected

### Boss Battles
- **Win Rate**: 50-70% (challenging but fair)
- **Battle Length**: 10-20 turns
- **Retries**: 1-3 retries expected for first-timers

### Ability Balance
- **AP Costs**: 2-4 AP typical
- **Damage**: Basic abilities ~1.0-1.5x stat multiplier
- **Ultimate abilities**: ~2.5-4.0x stat multiplier

### Equipment Drop Rates
- **Common**: ~60% of drops
- **Uncommon**: ~25% of drops
- **Rare**: ~10% of drops
- **Epic+**: ~5% of drops

---

## ✅ Test Results Template

Copy this to track your testing:

```
# Playtest Results - [Date]

## Character Types Tested
- [ ] Alpha - Win rate: __%, Notes: ____
- [ ] Beta - Win rate: __%, Notes: ____
- [ ] Gamma - Win rate: __%, Notes: ____
- [ ] Delta - Win rate: __%, Notes: ____
- [ ] Epsilon - Win rate: __%, Notes: ____
- [ ] Zeta - Win rate: __%, Notes: ____

## Systems Tested
- [ ] Combat - Issues: ____
- [ ] Progression - Issues: ____
- [ ] Equipment - Issues: ____
- [ ] Team Management - Issues: ____
- [ ] Save/Load - Issues: ____

## Bugs Found
1. ____
2. ____
3. ____

## Balance Issues
1. ____
2. ____

## Overall Assessment
- Playability: __/10
- Balance: __/10
- Polish: __/10
- Fun: __/10

## Ready for Release?
- [ ] YES - Ship it!
- [ ] NO - Fix: ____
```

---

**Next Step**: Run through this guide manually, track results, and report any issues!
