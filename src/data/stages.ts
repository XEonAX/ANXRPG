/**
 * Campaign Stage Definitions
 * All 100 stages of the ANXRPG campaign
 */

import type { Stage } from '../types/campaign';

/**
 * All 100 campaign stages
 * - Stages 1-10: Tier 1 (Slimes & Rats)
 * - Stages 11-20: Tier 2 (Goblins & Wolves)
 * - Stages 21-30: Tier 3 (Orcs & Trolls)
 * - Stages 31-50: Tier 4 (Demons & Dragons)
 * - Stages 51-70: Tier 5 (Behemoths & Titans)
 * - Stages 71-90: Tier 6 (Fallen Angels & Demigods)
 * - Stages 91-100: Tier 7 (Gods & Primordials)
 * 
 * Every 10th stage is a boss stage
 */
export const STAGES: Stage[] = [
  // ========================================
  // TIER 1: STAGES 1-10 (Slimes & Rats)
  // ========================================
  {
    stageNumber: 1,
    name: "Slime Encounter",
    isBossStage: false,
    tier: 1,
    recommendedTeamSize: 1,
    enemyTeamSize: 1,
    enemyLevelRange: { min: 1, max: 1 },
    unlockRequirements: { previousStage: null },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "Your first encounter with the weak slimes of the forest."
  },
  {
    stageNumber: 2,
    name: "Double Trouble",
    isBossStage: false,
    tier: 1,
    recommendedTeamSize: 1,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 1, max: 2 },
    unlockRequirements: { previousStage: 1 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "Two slimes team up against you."
  },
  {
    stageNumber: 3,
    name: "Rat Infestation",
    isBossStage: false,
    tier: 1,
    recommendedTeamSize: 1,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 2, max: 3 },
    unlockRequirements: { previousStage: 2 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "Rats scurry from the shadows."
  },
  {
    stageNumber: 4,
    name: "Swarm Attack",
    isBossStage: false,
    tier: 1,
    recommendedTeamSize: 2,
    enemyTeamSize: 3,
    enemyLevelRange: { min: 2, max: 4 },
    unlockRequirements: { previousStage: 3 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "A full swarm of slimes and rats attack!"
  },
  {
    stageNumber: 5,
    name: "Bat Cave",
    isBossStage: false,
    tier: 1,
    recommendedTeamSize: 2,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 3, max: 5 },
    unlockRequirements: { previousStage: 4 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "Bats dive from the ceiling of a dark cave."
  },
  {
    stageNumber: 6,
    name: "Mixed Menace",
    isBossStage: false,
    tier: 1,
    recommendedTeamSize: 2,
    enemyTeamSize: 3,
    enemyLevelRange: { min: 4, max: 6 },
    unlockRequirements: { previousStage: 5 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "Slimes, rats, and bats work together."
  },
  {
    stageNumber: 7,
    name: "Forest Depths",
    isBossStage: false,
    tier: 1,
    recommendedTeamSize: 2,
    enemyTeamSize: 3,
    enemyLevelRange: { min: 5, max: 7 },
    unlockRequirements: { previousStage: 6 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "Venture deeper into the dangerous forest."
  },
  {
    stageNumber: 8,
    name: "Ambush!",
    isBossStage: false,
    tier: 1,
    recommendedTeamSize: 3,
    enemyTeamSize: 3,
    enemyLevelRange: { min: 6, max: 8 },
    unlockRequirements: { previousStage: 7 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "An ambush awaits you around the bend."
  },
  {
    stageNumber: 9,
    name: "Pre-Boss Challenge",
    isBossStage: false,
    tier: 1,
    recommendedTeamSize: 3,
    enemyTeamSize: 3,
    enemyLevelRange: { min: 7, max: 9 },
    unlockRequirements: { previousStage: 8 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "The guardian's minions sense your approach."
  },
  {
    stageNumber: 10,
    name: "The Slime King",
    isBossStage: true,
    tier: 1,
    recommendedTeamSize: 3,
    enemyTeamSize: 1,
    bossTemplateId: 'slime_king',
    enemyLevelRange: { min: 10, max: 10 },
    unlockRequirements: { previousStage: 9 },
    rewardModifiers: { xpMultiplier: 1.5, dropChanceMultiplier: 2.0 },
    description: "Face the mighty Slime King, ruler of the forest!"
  },

  // ========================================
  // TIER 2: STAGES 11-20 (Goblins & Wolves)
  // ========================================
  {
    stageNumber: 11,
    name: "Goblin Scouts",
    isBossStage: false,
    tier: 2,
    recommendedTeamSize: 2,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 10, max: 11 },
    unlockRequirements: { previousStage: 10 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "Goblin scouts patrol the hills."
  },
  {
    stageNumber: 12,
    name: "Wolf Pack",
    isBossStage: false,
    tier: 2,
    recommendedTeamSize: 2,
    enemyTeamSize: 3,
    enemyLevelRange: { min: 11, max: 12 },
    unlockRequirements: { previousStage: 11 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "A pack of wolves hunts in coordination."
  },
  {
    stageNumber: 13,
    name: "Skeleton Warriors",
    isBossStage: false,
    tier: 2,
    recommendedTeamSize: 2,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 12, max: 13 },
    unlockRequirements: { previousStage: 12 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "Undead warriors rise from ancient graves."
  },
  {
    stageNumber: 14,
    name: "Goblin Ambush",
    isBossStage: false,
    tier: 2,
    recommendedTeamSize: 3,
    enemyTeamSize: 3,
    enemyLevelRange: { min: 13, max: 14 },
    unlockRequirements: { previousStage: 13 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "Goblins spring a trap!"
  },
  {
    stageNumber: 15,
    name: "Cursed Graveyard",
    isBossStage: false,
    tier: 2,
    recommendedTeamSize: 3,
    enemyTeamSize: 3,
    enemyLevelRange: { min: 14, max: 15 },
    unlockRequirements: { previousStage: 14 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "Skeletons guard the cursed graveyard."
  },
  {
    stageNumber: 16,
    name: "Alpha Wolf",
    isBossStage: false,
    tier: 2,
    recommendedTeamSize: 3,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 15, max: 16 },
    unlockRequirements: { previousStage: 15 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "An alpha wolf leads its pack."
  },
  {
    stageNumber: 17,
    name: "Goblin Raiders",
    isBossStage: false,
    tier: 2,
    recommendedTeamSize: 3,
    enemyTeamSize: 3,
    enemyLevelRange: { min: 16, max: 17 },
    unlockRequirements: { previousStage: 16 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "Goblin raiders attack the village."
  },
  {
    stageNumber: 18,
    name: "Undead Horde",
    isBossStage: false,
    tier: 2,
    recommendedTeamSize: 3,
    enemyTeamSize: 3,
    enemyLevelRange: { min: 17, max: 18 },
    unlockRequirements: { previousStage: 17 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "An undead horde marches forth."
  },
  {
    stageNumber: 19,
    name: "Chieftain's Guards",
    isBossStage: false,
    tier: 2,
    recommendedTeamSize: 3,
    enemyTeamSize: 3,
    enemyLevelRange: { min: 18, max: 19 },
    unlockRequirements: { previousStage: 18 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "The chieftain's elite guards block your path."
  },
  {
    stageNumber: 20,
    name: "The Goblin Chieftain",
    isBossStage: true,
    tier: 2,
    recommendedTeamSize: 3,
    enemyTeamSize: 1,
    bossTemplateId: 'goblin_chieftain',
    enemyLevelRange: { min: 20, max: 20 },
    unlockRequirements: { previousStage: 19 },
    rewardModifiers: { xpMultiplier: 1.5, dropChanceMultiplier: 2.0 },
    description: "Challenge the Goblin Chieftain in his throne room!"
  },

  // ========================================
  // TIER 3: STAGES 21-30 (Orcs & Trolls)
  // ========================================
  {
    stageNumber: 21,
    name: "Orc Warband",
    isBossStage: false,
    tier: 3,
    recommendedTeamSize: 3,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 20, max: 21 },
    unlockRequirements: { previousStage: 20 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "A brutal orc warband approaches."
  },
  {
    stageNumber: 22,
    name: "Troll Bridge",
    isBossStage: false,
    tier: 3,
    recommendedTeamSize: 3,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 21, max: 22 },
    unlockRequirements: { previousStage: 21 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "Trolls guard a crucial bridge."
  },
  {
    stageNumber: 23,
    name: "Wraith Haunt",
    isBossStage: false,
    tier: 3,
    recommendedTeamSize: 3,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 22, max: 23 },
    unlockRequirements: { previousStage: 22 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "Wraiths haunt the abandoned fortress."
  },
  {
    stageNumber: 24,
    name: "Orc Raiding Party",
    isBossStage: false,
    tier: 3,
    recommendedTeamSize: 3,
    enemyTeamSize: 3,
    enemyLevelRange: { min: 23, max: 24 },
    unlockRequirements: { previousStage: 23 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "An orc raiding party pillages the countryside."
  },
  {
    stageNumber: 25,
    name: "Troll Den",
    isBossStage: false,
    tier: 3,
    recommendedTeamSize: 3,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 24, max: 25 },
    unlockRequirements: { previousStage: 24 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "Enter the foul-smelling troll den."
  },
  {
    stageNumber: 26,
    name: "Spectral Legion",
    isBossStage: false,
    tier: 3,
    recommendedTeamSize: 3,
    enemyTeamSize: 3,
    enemyLevelRange: { min: 25, max: 26 },
    unlockRequirements: { previousStage: 25 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "A legion of wraiths blocks your advance."
  },
  {
    stageNumber: 27,
    name: "Orc Fortress",
    isBossStage: false,
    tier: 3,
    recommendedTeamSize: 3,
    enemyTeamSize: 3,
    enemyLevelRange: { min: 26, max: 27 },
    unlockRequirements: { previousStage: 26 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "Assault the orc fortress."
  },
  {
    stageNumber: 28,
    name: "Regenerating Trolls",
    isBossStage: false,
    tier: 3,
    recommendedTeamSize: 3,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 27, max: 28 },
    unlockRequirements: { previousStage: 27 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "Trolls with powerful regeneration abilities."
  },
  {
    stageNumber: 29,
    name: "Warlord's Elite",
    isBossStage: false,
    tier: 3,
    recommendedTeamSize: 3,
    enemyTeamSize: 3,
    enemyLevelRange: { min: 28, max: 29 },
    unlockRequirements: { previousStage: 28 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "The warlord's elite guard prepares for battle."
  },
  {
    stageNumber: 30,
    name: "The Orc Warlord",
    isBossStage: true,
    tier: 3,
    recommendedTeamSize: 3,
    enemyTeamSize: 1,
    bossTemplateId: 'orc_warlord',
    enemyLevelRange: { min: 30, max: 30 },
    unlockRequirements: { previousStage: 29 },
    rewardModifiers: { xpMultiplier: 1.5, dropChanceMultiplier: 2.0 },
    description: "Face the terrifying Orc Warlord!"
  },

  // ========================================
  // TIER 4: STAGES 31-50 (Demons & Dragons)
  // ========================================
  {
    stageNumber: 31,
    name: "Demonic Incursion",
    isBossStage: false,
    tier: 4,
    recommendedTeamSize: 3,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 30, max: 31 },
    unlockRequirements: { previousStage: 30 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "Demons pour through a rift in reality."
  },
  {
    stageNumber: 32,
    name: "Young Dragons",
    isBossStage: false,
    tier: 4,
    recommendedTeamSize: 3,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 31, max: 32 },
    unlockRequirements: { previousStage: 31 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "Young dragons test their might."
  },
  {
    stageNumber: 33,
    name: "Fire Elementals",
    isBossStage: false,
    tier: 4,
    recommendedTeamSize: 3,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 32, max: 33 },
    unlockRequirements: { previousStage: 32 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "Living flames bar your path."
  },
  {
    stageNumber: 34,
    name: "Demon Warband",
    isBossStage: false,
    tier: 4,
    recommendedTeamSize: 3,
    enemyTeamSize: 3,
    enemyLevelRange: { min: 33, max: 34 },
    unlockRequirements: { previousStage: 33 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "A full warband of demons attacks."
  },
  {
    stageNumber: 35,
    name: "Dragon's Lair Entrance",
    isBossStage: false,
    tier: 4,
    recommendedTeamSize: 3,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 34, max: 35 },
    unlockRequirements: { previousStage: 34 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "Dragons guard the entrance to their lair."
  },
  {
    stageNumber: 36,
    name: "Infernal Flames",
    isBossStage: false,
    tier: 4,
    recommendedTeamSize: 3,
    enemyTeamSize: 3,
    enemyLevelRange: { min: 35, max: 36 },
    unlockRequirements: { previousStage: 35 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "Navigate through fields of living fire."
  },
  {
    stageNumber: 37,
    name: "Demon Ritual",
    isBossStage: false,
    tier: 4,
    recommendedTeamSize: 3,
    enemyTeamSize: 3,
    enemyLevelRange: { min: 36, max: 37 },
    unlockRequirements: { previousStage: 36 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "Interrupt a demonic summoning ritual."
  },
  {
    stageNumber: 38,
    name: "Twin Drakes",
    isBossStage: false,
    tier: 4,
    recommendedTeamSize: 3,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 37, max: 38 },
    unlockRequirements: { previousStage: 37 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "Two young dragons coordinate their attacks."
  },
  {
    stageNumber: 39,
    name: "Demon Lord's Herald",
    isBossStage: false,
    tier: 4,
    recommendedTeamSize: 3,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 38, max: 39 },
    unlockRequirements: { previousStage: 38 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "The Demon Lord's herald announces his arrival."
  },
  {
    stageNumber: 40,
    name: "The Demon Lord",
    isBossStage: true,
    tier: 4,
    recommendedTeamSize: 3,
    enemyTeamSize: 1,
    bossTemplateId: 'demon_lord',
    enemyLevelRange: { min: 40, max: 40 },
    unlockRequirements: { previousStage: 39 },
    rewardModifiers: { xpMultiplier: 1.5, dropChanceMultiplier: 2.0 },
    description: "Confront the mighty Demon Lord!"
  },
  // Stages 41-50 continue Tier 4
  {
    stageNumber: 41,
    name: "Post-Demon Chaos",
    isBossStage: false,
    tier: 4,
    recommendedTeamSize: 3,
    enemyTeamSize: 3,
    enemyLevelRange: { min: 40, max: 41 },
    unlockRequirements: { previousStage: 40 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "The demon's forces scatter but remain dangerous."
  },
  {
    stageNumber: 42,
    name: "Volcanic Drakes",
    isBossStage: false,
    tier: 4,
    recommendedTeamSize: 3,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 41, max: 42 },
    unlockRequirements: { previousStage: 41 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "Dragons born from volcanic fury."
  },
  {
    stageNumber: 43,
    name: "Elemental Convergence",
    isBossStage: false,
    tier: 4,
    recommendedTeamSize: 3,
    enemyTeamSize: 3,
    enemyLevelRange: { min: 42, max: 43 },
    unlockRequirements: { previousStage: 42 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "Multiple elementals unite against you."
  },
  {
    stageNumber: 44,
    name: "Demon Remnants",
    isBossStage: false,
    tier: 4,
    recommendedTeamSize: 3,
    enemyTeamSize: 3,
    enemyLevelRange: { min: 43, max: 44 },
    unlockRequirements: { previousStage: 43 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "Remaining demon forces regroup."
  },
  {
    stageNumber: 45,
    name: "Dragon Nest",
    isBossStage: false,
    tier: 4,
    recommendedTeamSize: 3,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 44, max: 45 },
    unlockRequirements: { previousStage: 44 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "Invade a dragon nesting ground."
  },
  {
    stageNumber: 46,
    name: "Inferno",
    isBossStage: false,
    tier: 4,
    recommendedTeamSize: 3,
    enemyTeamSize: 3,
    enemyLevelRange: { min: 45, max: 46 },
    unlockRequirements: { previousStage: 45 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "Battle through an elemental inferno."
  },
  {
    stageNumber: 47,
    name: "Demon Elite",
    isBossStage: false,
    tier: 4,
    recommendedTeamSize: 3,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 46, max: 47 },
    unlockRequirements: { previousStage: 46 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "The demon elite guard emerges."
  },
  {
    stageNumber: 48,
    name: "Ancient Dragon Territory",
    isBossStage: false,
    tier: 4,
    recommendedTeamSize: 3,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 47, max: 48 },
    unlockRequirements: { previousStage: 47 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "Trespass into ancient dragon territory."
  },
  {
    stageNumber: 49,
    name: "Elder Dragon's Lair",
    isBossStage: false,
    tier: 4,
    recommendedTeamSize: 3,
    enemyTeamSize: 3,
    enemyLevelRange: { min: 48, max: 49 },
    unlockRequirements: { previousStage: 48 },
    rewardModifiers: { xpMultiplier: 1.0, dropChanceMultiplier: 1.0 },
    description: "Approach the Elder Dragon's lair."
  },
  {
    stageNumber: 50,
    name: "The Elder Dragon",
    isBossStage: true,
    tier: 5,
    recommendedTeamSize: 3,
    enemyTeamSize: 1,
    bossTemplateId: 'elder_dragon',
    enemyLevelRange: { min: 50, max: 50 },
    unlockRequirements: { previousStage: 49 },
    rewardModifiers: { xpMultiplier: 1.5, dropChanceMultiplier: 2.0 },
    description: "Face the legendary Elder Dragon!"
  },

  // ========================================
  // TIER 5: STAGES 51-70 (Behemoths & Titans)
  // ========================================
  {
    stageNumber: 51,
    name: "Ancient Behemoth",
    isBossStage: false,
    tier: 5,
    recommendedTeamSize: 3,
    enemyTeamSize: 1,
    enemyLevelRange: { min: 50, max: 51 },
    unlockRequirements: { previousStage: 50 },
    rewardModifiers: { xpMultiplier: 1.1, dropChanceMultiplier: 1.1 },
    description: "A behemoth of ancient times awakens."
  },
  {
    stageNumber: 52,
    name: "Stone Titans",
    isBossStage: false,
    tier: 5,
    recommendedTeamSize: 3,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 51, max: 52 },
    unlockRequirements: { previousStage: 51 },
    rewardModifiers: { xpMultiplier: 1.1, dropChanceMultiplier: 1.1 },
    description: "Giants of living stone march to war."
  },
  {
    stageNumber: 53,
    name: "Storm Wyrm",
    isBossStage: false,
    tier: 5,
    recommendedTeamSize: 3,
    enemyTeamSize: 1,
    enemyLevelRange: { min: 52, max: 53 },
    unlockRequirements: { previousStage: 52 },
    rewardModifiers: { xpMultiplier: 1.1, dropChanceMultiplier: 1.1 },
    description: "A wyrm born from the storm itself."
  },
  {
    stageNumber: 54,
    name: "Behemoth Rampage",
    isBossStage: false,
    tier: 5,
    recommendedTeamSize: 3,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 53, max: 54 },
    unlockRequirements: { previousStage: 53 },
    rewardModifiers: { xpMultiplier: 1.1, dropChanceMultiplier: 1.1 },
    description: "Multiple behemoths on a rampage."
  },
  {
    stageNumber: 55,
    name: "Titan Fortress",
    isBossStage: false,
    tier: 5,
    recommendedTeamSize: 3,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 54, max: 55 },
    unlockRequirements: { previousStage: 54 },
    rewardModifiers: { xpMultiplier: 1.1, dropChanceMultiplier: 1.1 },
    description: "Stone titans defend their ancient fortress."
  },
  {
    stageNumber: 56,
    name: "Tempest Wyrms",
    isBossStage: false,
    tier: 5,
    recommendedTeamSize: 3,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 55, max: 56 },
    unlockRequirements: { previousStage: 55 },
    rewardModifiers: { xpMultiplier: 1.1, dropChanceMultiplier: 1.1 },
    description: "A pair of storm wyrms attack together."
  },
  {
    stageNumber: 57,
    name: "Primordial Behemoth",
    isBossStage: false,
    tier: 5,
    recommendedTeamSize: 3,
    enemyTeamSize: 1,
    enemyLevelRange: { min: 56, max: 57 },
    unlockRequirements: { previousStage: 56 },
    rewardModifiers: { xpMultiplier: 1.1, dropChanceMultiplier: 1.1 },
    description: "An even more ancient behemoth emerges."
  },
  {
    stageNumber: 58,
    name: "Titan Council",
    isBossStage: false,
    tier: 5,
    recommendedTeamSize: 3,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 57, max: 58 },
    unlockRequirements: { previousStage: 57 },
    rewardModifiers: { xpMultiplier: 1.1, dropChanceMultiplier: 1.1 },
    description: "The titan council gathers."
  },
  {
    stageNumber: 59,
    name: "Hurricane Wyrm",
    isBossStage: false,
    tier: 5,
    recommendedTeamSize: 3,
    enemyTeamSize: 1,
    enemyLevelRange: { min: 58, max: 59 },
    unlockRequirements: { previousStage: 58 },
    rewardModifiers: { xpMultiplier: 1.1, dropChanceMultiplier: 1.1 },
    description: "A wyrm of hurricane strength appears."
  },
  {
    stageNumber: 60,
    name: "The Titan King (Unofficial)",
    isBossStage: false,
    tier: 5,
    recommendedTeamSize: 3,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 59, max: 60 },
    unlockRequirements: { previousStage: 59 },
    rewardModifiers: { xpMultiplier: 1.2, dropChanceMultiplier: 1.2 },
    description: "Elite titans guard the path forward."
  },
  // Stages 61-70
  {
    stageNumber: 61,
    name: "Colossal Behemoth",
    isBossStage: false,
    tier: 5,
    recommendedTeamSize: 3,
    enemyTeamSize: 1,
    enemyLevelRange: { min: 60, max: 61 },
    unlockRequirements: { previousStage: 60 },
    rewardModifiers: { xpMultiplier: 1.1, dropChanceMultiplier: 1.1 },
    description: "A behemoth of colossal proportions."
  },
  {
    stageNumber: 62,
    name: "Obsidian Titans",
    isBossStage: false,
    tier: 5,
    recommendedTeamSize: 3,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 61, max: 62 },
    unlockRequirements: { previousStage: 61 },
    rewardModifiers: { xpMultiplier: 1.1, dropChanceMultiplier: 1.1 },
    description: "Titans forged from obsidian."
  },
  {
    stageNumber: 63,
    name: "Cataclysm Wyrm",
    isBossStage: false,
    tier: 5,
    recommendedTeamSize: 3,
    enemyTeamSize: 1,
    enemyLevelRange: { min: 62, max: 63 },
    unlockRequirements: { previousStage: 62 },
    rewardModifiers: { xpMultiplier: 1.1, dropChanceMultiplier: 1.1 },
    description: "A wyrm that brings cataclysm."
  },
  {
    stageNumber: 64,
    name: "Behemoth Duo",
    isBossStage: false,
    tier: 5,
    recommendedTeamSize: 3,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 63, max: 64 },
    unlockRequirements: { previousStage: 63 },
    rewardModifiers: { xpMultiplier: 1.1, dropChanceMultiplier: 1.1 },
    description: "Two behemoths coordinate attacks."
  },
  {
    stageNumber: 65,
    name: "Diamond Titan",
    isBossStage: false,
    tier: 5,
    recommendedTeamSize: 3,
    enemyTeamSize: 1,
    enemyLevelRange: { min: 64, max: 65 },
    unlockRequirements: { previousStage: 64 },
    rewardModifiers: { xpMultiplier: 1.1, dropChanceMultiplier: 1.1 },
    description: "A nearly indestructible diamond titan."
  },
  {
    stageNumber: 66,
    name: "Apocalypse Wyrms",
    isBossStage: false,
    tier: 5,
    recommendedTeamSize: 3,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 65, max: 66 },
    unlockRequirements: { previousStage: 65 },
    rewardModifiers: { xpMultiplier: 1.1, dropChanceMultiplier: 1.1 },
    description: "Wyrms of apocalyptic power."
  },
  {
    stageNumber: 67,
    name: "Behemoth King",
    isBossStage: false,
    tier: 5,
    recommendedTeamSize: 3,
    enemyTeamSize: 1,
    enemyLevelRange: { min: 66, max: 67 },
    unlockRequirements: { previousStage: 66 },
    rewardModifiers: { xpMultiplier: 1.1, dropChanceMultiplier: 1.1 },
    description: "The king of all behemoths."
  },
  {
    stageNumber: 68,
    name: "Titan Army",
    isBossStage: false,
    tier: 5,
    recommendedTeamSize: 3,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 67, max: 68 },
    unlockRequirements: { previousStage: 67 },
    rewardModifiers: { xpMultiplier: 1.1, dropChanceMultiplier: 1.1 },
    description: "An army of titans marches."
  },
  {
    stageNumber: 69,
    name: "Ragnarok Wyrm",
    isBossStage: false,
    tier: 5,
    recommendedTeamSize: 3,
    enemyTeamSize: 1,
    enemyLevelRange: { min: 68, max: 69 },
    unlockRequirements: { previousStage: 68 },
    rewardModifiers: { xpMultiplier: 1.1, dropChanceMultiplier: 1.1 },
    description: "The wyrm that brings the end of days."
  },
  {
    stageNumber: 70,
    name: "The Archangel",
    isBossStage: true,
    tier: 6,
    recommendedTeamSize: 3,
    enemyTeamSize: 1,
    bossTemplateId: 'archangel',
    enemyLevelRange: { min: 70, max: 70 },
    unlockRequirements: { previousStage: 69 },
    rewardModifiers: { xpMultiplier: 1.5, dropChanceMultiplier: 2.0 },
    description: "Face the divine Archangel!"
  },

  // ========================================
  // TIER 6: STAGES 71-90 (Fallen Angels & Demigods)
  // ========================================
  {
    stageNumber: 71,
    name: "Fallen Angel",
    isBossStage: false,
    tier: 6,
    recommendedTeamSize: 3,
    enemyTeamSize: 1,
    enemyLevelRange: { min: 70, max: 71 },
    unlockRequirements: { previousStage: 70 },
    rewardModifiers: { xpMultiplier: 1.2, dropChanceMultiplier: 1.2 },
    description: "A fallen angel seeks redemption through battle."
  },
  {
    stageNumber: 72,
    name: "Demigod Warriors",
    isBossStage: false,
    tier: 6,
    recommendedTeamSize: 3,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 71, max: 72 },
    unlockRequirements: { previousStage: 71 },
    rewardModifiers: { xpMultiplier: 1.2, dropChanceMultiplier: 1.2 },
    description: "Warriors with divine blood test your worth."
  },
  {
    stageNumber: 73,
    name: "Celestial Guardian",
    isBossStage: false,
    tier: 6,
    recommendedTeamSize: 3,
    enemyTeamSize: 1,
    enemyLevelRange: { min: 72, max: 73 },
    unlockRequirements: { previousStage: 72 },
    rewardModifiers: { xpMultiplier: 1.2, dropChanceMultiplier: 1.2 },
    description: "A guardian from the celestial realm."
  },
  {
    stageNumber: 74,
    name: "Fallen Duo",
    isBossStage: false,
    tier: 6,
    recommendedTeamSize: 3,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 73, max: 74 },
    unlockRequirements: { previousStage: 73 },
    rewardModifiers: { xpMultiplier: 1.2, dropChanceMultiplier: 1.2 },
    description: "Two fallen angels fight in tandem."
  },
  {
    stageNumber: 75,
    name: "Demigod Champion",
    isBossStage: false,
    tier: 6,
    recommendedTeamSize: 3,
    enemyTeamSize: 1,
    enemyLevelRange: { min: 74, max: 75 },
    unlockRequirements: { previousStage: 74 },
    rewardModifiers: { xpMultiplier: 1.2, dropChanceMultiplier: 1.2 },
    description: "The champion of demigods."
  },
  {
    stageNumber: 76,
    name: "Celestial Protectors",
    isBossStage: false,
    tier: 6,
    recommendedTeamSize: 3,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 75, max: 76 },
    unlockRequirements: { previousStage: 75 },
    rewardModifiers: { xpMultiplier: 1.2, dropChanceMultiplier: 1.2 },
    description: "Protectors of the celestial gates."
  },
  {
    stageNumber: 77,
    name: "Corrupted Angel",
    isBossStage: false,
    tier: 6,
    recommendedTeamSize: 3,
    enemyTeamSize: 1,
    enemyLevelRange: { min: 76, max: 77 },
    unlockRequirements: { previousStage: 76 },
    rewardModifiers: { xpMultiplier: 1.2, dropChanceMultiplier: 1.2 },
    description: "An angel corrupted by dark power."
  },
  {
    stageNumber: 78,
    name: "Demigod Elite",
    isBossStage: false,
    tier: 6,
    recommendedTeamSize: 3,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 77, max: 78 },
    unlockRequirements: { previousStage: 77 },
    rewardModifiers: { xpMultiplier: 1.2, dropChanceMultiplier: 1.2 },
    description: "The elite guard of the demigods."
  },
  {
    stageNumber: 79,
    name: "Heaven's Wrath",
    isBossStage: false,
    tier: 6,
    recommendedTeamSize: 3,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 78, max: 79 },
    unlockRequirements: { previousStage: 78 },
    rewardModifiers: { xpMultiplier: 1.2, dropChanceMultiplier: 1.2 },
    description: "Face the wrath of heaven."
  },
  {
    stageNumber: 80,
    name: "The God of War (Minor)",
    isBossStage: false,
    tier: 6,
    recommendedTeamSize: 3,
    enemyTeamSize: 1,
    enemyLevelRange: { min: 79, max: 80 },
    unlockRequirements: { previousStage: 79 },
    rewardModifiers: { xpMultiplier: 1.3, dropChanceMultiplier: 1.3 },
    description: "A minor god of war tests your might."
  },
  // Stages 81-90
  {
    stageNumber: 81,
    name: "Fallen Archangel",
    isBossStage: false,
    tier: 6,
    recommendedTeamSize: 3,
    enemyTeamSize: 1,
    enemyLevelRange: { min: 80, max: 81 },
    unlockRequirements: { previousStage: 80 },
    rewardModifiers: { xpMultiplier: 1.2, dropChanceMultiplier: 1.2 },
    description: "An archangel who fell from grace."
  },
  {
    stageNumber: 82,
    name: "Demigod Phalanx",
    isBossStage: false,
    tier: 6,
    recommendedTeamSize: 3,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 81, max: 82 },
    unlockRequirements: { previousStage: 81 },
    rewardModifiers: { xpMultiplier: 1.2, dropChanceMultiplier: 1.2 },
    description: "A phalanx of demigod warriors."
  },
  {
    stageNumber: 83,
    name: "Supreme Guardian",
    isBossStage: false,
    tier: 6,
    recommendedTeamSize: 3,
    enemyTeamSize: 1,
    enemyLevelRange: { min: 82, max: 83 },
    unlockRequirements: { previousStage: 82 },
    rewardModifiers: { xpMultiplier: 1.2, dropChanceMultiplier: 1.2 },
    description: "The supreme celestial guardian."
  },
  {
    stageNumber: 84,
    name: "Angelic Council",
    isBossStage: false,
    tier: 6,
    recommendedTeamSize: 3,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 83, max: 84 },
    unlockRequirements: { previousStage: 83 },
    rewardModifiers: { xpMultiplier: 1.2, dropChanceMultiplier: 1.2 },
    description: "The council of fallen angels."
  },
  {
    stageNumber: 85,
    name: "Demigod General",
    isBossStage: false,
    tier: 6,
    recommendedTeamSize: 3,
    enemyTeamSize: 1,
    enemyLevelRange: { min: 84, max: 85 },
    unlockRequirements: { previousStage: 84 },
    rewardModifiers: { xpMultiplier: 1.2, dropChanceMultiplier: 1.2 },
    description: "The general of the demigod army."
  },
  {
    stageNumber: 86,
    name: "Celestial Twins",
    isBossStage: false,
    tier: 6,
    recommendedTeamSize: 3,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 85, max: 86 },
    unlockRequirements: { previousStage: 85 },
    rewardModifiers: { xpMultiplier: 1.2, dropChanceMultiplier: 1.2 },
    description: "Twin guardians of immense power."
  },
  {
    stageNumber: 87,
    name: "Dark Seraphim",
    isBossStage: false,
    tier: 6,
    recommendedTeamSize: 3,
    enemyTeamSize: 1,
    enemyLevelRange: { min: 86, max: 87 },
    unlockRequirements: { previousStage: 86 },
    rewardModifiers: { xpMultiplier: 1.2, dropChanceMultiplier: 1.2 },
    description: "A seraphim corrupted by darkness."
  },
  {
    stageNumber: 88,
    name: "Demigod Kings",
    isBossStage: false,
    tier: 6,
    recommendedTeamSize: 3,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 87, max: 88 },
    unlockRequirements: { previousStage: 87 },
    rewardModifiers: { xpMultiplier: 1.2, dropChanceMultiplier: 1.2 },
    description: "Kings among the demigods."
  },
  {
    stageNumber: 89,
    name: "Divine Judgment",
    isBossStage: false,
    tier: 6,
    recommendedTeamSize: 3,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 88, max: 89 },
    unlockRequirements: { previousStage: 88 },
    rewardModifiers: { xpMultiplier: 1.2, dropChanceMultiplier: 1.2 },
    description: "Face divine judgment."
  },
  {
    stageNumber: 90,
    name: "The World Destroyer (Awakening)",
    isBossStage: false,
    tier: 6,
    recommendedTeamSize: 3,
    enemyTeamSize: 1,
    enemyLevelRange: { min: 89, max: 90 },
    unlockRequirements: { previousStage: 89 },
    rewardModifiers: { xpMultiplier: 1.3, dropChanceMultiplier: 1.3 },
    description: "The World Destroyer stirs from slumber."
  },

  // ========================================
  // TIER 7: STAGES 91-100 (Lesser Gods & Primordials)
  // ========================================
  {
    stageNumber: 91,
    name: "Lesser God of War",
    isBossStage: false,
    tier: 7,
    recommendedTeamSize: 3,
    enemyTeamSize: 1,
    enemyLevelRange: { min: 90, max: 91 },
    unlockRequirements: { previousStage: 90 },
    rewardModifiers: { xpMultiplier: 1.3, dropChanceMultiplier: 1.3 },
    description: "A true god enters the fray."
  },
  {
    stageNumber: 92,
    name: "Primordial Titans",
    isBossStage: false,
    tier: 7,
    recommendedTeamSize: 3,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 91, max: 92 },
    unlockRequirements: { previousStage: 91 },
    rewardModifiers: { xpMultiplier: 1.3, dropChanceMultiplier: 1.3 },
    description: "Titans from the dawn of time."
  },
  {
    stageNumber: 93,
    name: "Void Entity",
    isBossStage: false,
    tier: 7,
    recommendedTeamSize: 3,
    enemyTeamSize: 1,
    enemyLevelRange: { min: 92, max: 93 },
    unlockRequirements: { previousStage: 92 },
    rewardModifiers: { xpMultiplier: 1.3, dropChanceMultiplier: 1.3 },
    description: "An entity from the void between worlds."
  },
  {
    stageNumber: 94,
    name: "Twin Gods",
    isBossStage: false,
    tier: 7,
    recommendedTeamSize: 3,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 93, max: 94 },
    unlockRequirements: { previousStage: 93 },
    rewardModifiers: { xpMultiplier: 1.3, dropChanceMultiplier: 1.3 },
    description: "Two lesser gods unite against you."
  },
  {
    stageNumber: 95,
    name: "Primordial Chaos",
    isBossStage: false,
    tier: 7,
    recommendedTeamSize: 3,
    enemyTeamSize: 1,
    enemyLevelRange: { min: 94, max: 95 },
    unlockRequirements: { previousStage: 94 },
    rewardModifiers: { xpMultiplier: 1.3, dropChanceMultiplier: 1.3 },
    description: "Chaos incarnate from the beginning of time."
  },
  {
    stageNumber: 96,
    name: "Void Incarnate",
    isBossStage: false,
    tier: 7,
    recommendedTeamSize: 3,
    enemyTeamSize: 1,
    enemyLevelRange: { min: 95, max: 96 },
    unlockRequirements: { previousStage: 95 },
    rewardModifiers: { xpMultiplier: 1.3, dropChanceMultiplier: 1.3 },
    description: "The void takes physical form."
  },
  {
    stageNumber: 97,
    name: "God Pantheon",
    isBossStage: false,
    tier: 7,
    recommendedTeamSize: 3,
    enemyTeamSize: 2,
    enemyLevelRange: { min: 96, max: 97 },
    unlockRequirements: { previousStage: 96 },
    rewardModifiers: { xpMultiplier: 1.3, dropChanceMultiplier: 1.3 },
    description: "A pantheon of lesser gods."
  },
  {
    stageNumber: 98,
    name: "Primordial Emperor",
    isBossStage: false,
    tier: 7,
    recommendedTeamSize: 3,
    enemyTeamSize: 1,
    enemyLevelRange: { min: 97, max: 98 },
    unlockRequirements: { previousStage: 97 },
    rewardModifiers: { xpMultiplier: 1.3, dropChanceMultiplier: 1.3 },
    description: "The emperor of primordial beings."
  },
  {
    stageNumber: 99,
    name: "Herald of the End",
    isBossStage: false,
    tier: 7,
    recommendedTeamSize: 3,
    enemyTeamSize: 1,
    enemyLevelRange: { min: 98, max: 99 },
    unlockRequirements: { previousStage: 98 },
    rewardModifiers: { xpMultiplier: 1.5, dropChanceMultiplier: 1.5 },
    description: "The herald announces the final battle."
  },
  {
    stageNumber: 100,
    name: "The World Destroyer",
    isBossStage: true,
    tier: 7,
    recommendedTeamSize: 3,
    enemyTeamSize: 1,
    bossTemplateId: 'world_destroyer',
    enemyLevelRange: { min: 100, max: 100 },
    unlockRequirements: { previousStage: 99 },
    rewardModifiers: { xpMultiplier: 2.0, dropChanceMultiplier: 3.0 },
    description: "Face the ultimate challenge: The World Destroyer!"
  }
];

/**
 * Get stage by number
 */
export function getStage(stageNumber: number): Stage | null {
  return STAGES.find(s => s.stageNumber === stageNumber) || null;
}

/**
 * Get all stages in a tier
 */
export function getStagesByTier(tier: number): Stage[] {
  return STAGES.filter(s => s.tier === tier);
}

/**
 * Get all boss stages
 */
export function getBossStages(): Stage[] {
  return STAGES.filter(s => s.isBossStage);
}

/**
 * Check if a stage number is a boss stage
 */
export function isBossStage(stageNumber: number): boolean {
  return stageNumber % 10 === 0;
}

/**
 * Get the next stage after a given stage number
 */
export function getNextStage(currentStage: number): Stage | null {
  return getStage(currentStage + 1);
}

/**
 * Get the previous stage before a given stage number
 */
export function getPreviousStage(currentStage: number): Stage | null {
  if (currentStage <= 1) return null;
  return getStage(currentStage - 1);
}
