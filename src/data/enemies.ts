/**
 * Enemy Templates and Definitions
 * 
 * Defines enemy templates for all 7 tiers (stages 1-100)
 * Each tier has 3-5 enemy types with different roles
 */

import type { EnemyTemplate, EnemyTier } from '../types/enemy';

/**
 * TIER 1: Slimes, Rats, Bats (Stages 1-10)
 * Basic enemies with low stats
 */

export const SLIME_TEMPLATE: EnemyTemplate = {
  id: 'slime',
  name: 'Slime',
  tier: 1,
  role: 'tank',
  baseStats: {
    maxHp: 50,
    hp: 50,
    atk: 5,
    def: 8,
    mag: 2,
    res: 6,
    spd: 3,
    crt: 5,
    eva: 5,
    acc: 85,
  },
  statGrowthPerLevel: {
    maxHp: 5,
    atk: 0.5,
    def: 1,
    mag: 0.2,
    res: 0.8,
    spd: 0.3,
  },
  abilities: ['slime_tackle', 'slime_acid'], // Updated with new enemy abilities
  apRegen: 3,
  maxAp: 10,
  isBoss: false,
  equipmentDropChance: 0.3,
  description: 'A gelatinous creature that absorbs damage.',
};

export const RAT_TEMPLATE: EnemyTemplate = {
  id: 'rat',
  name: 'Giant Rat',
  tier: 1,
  role: 'dps',
  baseStats: {
    maxHp: 35,
    hp: 35,
    atk: 8,
    def: 4,
    mag: 1,
    res: 3,
    spd: 7,
    crt: 12,
    eva: 10,
    acc: 88,
  },
  statGrowthPerLevel: {
    maxHp: 3,
    atk: 1,
    def: 0.4,
    mag: 0.1,
    res: 0.3,
    spd: 0.7,
    crt: 0.5,
  },
  abilities: ['rat_bite', 'rat_swarm'],
  apRegen: 4,
  maxAp: 10,
  isBoss: false,
  equipmentDropChance: 0.25,
  description: 'A disease-ridden rodent with sharp teeth.',
};

export const BAT_TEMPLATE: EnemyTemplate = {
  id: 'bat',
  name: 'Vampire Bat',
  tier: 1,
  role: 'dps',
  baseStats: {
    maxHp: 30,
    hp: 30,
    atk: 6,
    def: 3,
    mag: 3,
    res: 4,
    spd: 10,
    crt: 10,
    eva: 15,
    acc: 90,
  },
  statGrowthPerLevel: {
    maxHp: 2.5,
    atk: 0.6,
    def: 0.3,
    mag: 0.4,
    res: 0.4,
    spd: 1,
    eva: 0.3,
  },
  abilities: ['bat_shriek', 'bat_dive'], // Updated with new enemy abilities
  apRegen: 4,
  maxAp: 10,
  isBoss: false,
  equipmentDropChance: 0.2,
  description: 'A swift flying creature that drains life.',
};

export const SLIME_KING_TEMPLATE: EnemyTemplate = {
  id: 'slime_king',
  name: 'Slime King',
  tier: 1,
  role: 'boss',
  baseStats: {
    maxHp: 150,
    hp: 150,
    atk: 12,
    def: 18,
    mag: 6,
    res: 15,
    spd: 5,
    crt: 8,
    eva: 5,
    acc: 90,
  },
  statGrowthPerLevel: {
    maxHp: 15,
    atk: 1.5,
    def: 2,
    mag: 0.6,
    res: 1.5,
    spd: 0.4,
  },
  abilities: ['slime_tackle', 'slime_acid', 'boss_summon', 'boss_enrage'], // Boss abilities
  apRegen: 5,
  maxAp: 12,
  isBoss: true,
  bossMultiplier: 2.5,
  canSummon: true,
  summonPool: ['slime'],
  summonTriggers: [
    { type: 'hp-threshold', value: 50 },
  ],
  maxSummons: 2,
  equipmentDropChance: 1.0,
  description: 'The ruler of all slimes, massive and nearly indestructible.',
};

/**
 * TIER 2: Goblins, Wolves, Skeletons (Stages 11-20)
 * Low-mid level enemies with basic tactics
 */

export const GOBLIN_TEMPLATE: EnemyTemplate = {
  id: 'goblin',
  name: 'Goblin',
  tier: 2,
  role: 'dps',
  baseStats: {
    maxHp: 60,
    hp: 60,
    atk: 12,
    def: 8,
    mag: 4,
    res: 6,
    spd: 8,
    crt: 15,
    eva: 12,
    acc: 88,
  },
  statGrowthPerLevel: {
    maxHp: 5,
    atk: 1.2,
    def: 0.7,
    mag: 0.4,
    res: 0.6,
    spd: 0.8,
    crt: 0.5,
  },
  abilities: ['goblin_stab', 'goblin_rally'], // Updated with new enemy abilities
  apRegen: 4,
  maxAp: 10,
  isBoss: false,
  equipmentDropChance: 0.35,
  description: 'A cunning creature with crude weapons.',
};

export const WOLF_TEMPLATE: EnemyTemplate = {
  id: 'wolf',
  name: 'Dire Wolf',
  tier: 2,
  role: 'dps',
  baseStats: {
    maxHp: 70,
    hp: 70,
    atk: 15,
    def: 10,
    mag: 2,
    res: 8,
    spd: 12,
    crt: 18,
    eva: 14,
    acc: 92,
  },
  statGrowthPerLevel: {
    maxHp: 6,
    atk: 1.5,
    def: 0.9,
    mag: 0.2,
    res: 0.7,
    spd: 1.2,
    crt: 0.6,
  },
  abilities: ['wolf_bite', 'wolf_howl'],
  apRegen: 5,
  maxAp: 10,
  isBoss: false,
  equipmentDropChance: 0.3,
  description: 'A ferocious predator that hunts in packs.',
};

export const SKELETON_TEMPLATE: EnemyTemplate = {
  id: 'skeleton',
  name: 'Skeleton Warrior',
  tier: 2,
  role: 'tank',
  baseStats: {
    maxHp: 80,
    hp: 80,
    atk: 10,
    def: 15,
    mag: 5,
    res: 12,
    spd: 6,
    crt: 8,
    eva: 8,
    acc: 85,
  },
  statGrowthPerLevel: {
    maxHp: 7,
    atk: 1,
    def: 1.5,
    mag: 0.5,
    res: 1.2,
    spd: 0.5,
  },
  abilities: ['skeleton_slash', 'skeleton_defense'], // Updated with new enemy abilities
  apRegen: 3,
  maxAp: 10,
  isBoss: false,
  equipmentDropChance: 0.4,
  description: 'An animated pile of bones wielding rusty weapons.',
};

export const GOBLIN_CHIEFTAIN_TEMPLATE: EnemyTemplate = {
  id: 'goblin_chieftain',
  name: 'Goblin Chieftain',
  tier: 2,
  role: 'boss',
  baseStats: {
    maxHp: 200,
    hp: 200,
    atk: 25,
    def: 18,
    mag: 10,
    res: 15,
    spd: 10,
    crt: 20,
    eva: 15,
    acc: 92,
  },
  statGrowthPerLevel: {
    maxHp: 18,
    atk: 2,
    def: 1.5,
    mag: 0.8,
    res: 1.2,
    spd: 0.8,
    crt: 0.6,
  },
  abilities: ['goblin_stab', 'goblin_rally', 'boss_summon', 'boss_enrage'], // Boss abilities
  apRegen: 5,
  maxAp: 12,
  isBoss: true,
  bossMultiplier: 2.5,
  canSummon: true,
  summonPool: ['goblin'],
  summonTriggers: [
    { type: 'hp-threshold', value: 75 },
    { type: 'hp-threshold', value: 40 },
  ],
  maxSummons: 2,
  equipmentDropChance: 1.0,
  description: 'The leader of a goblin warband, cunning and ruthless.',
};

/**
 * TIER 3: Orcs, Trolls, Wraiths (Stages 21-30)
 * Mid-level enemies with higher stats
 */

export const ORC_TEMPLATE: EnemyTemplate = {
  id: 'orc',
  name: 'Orc Warrior',
  tier: 3,
  role: 'dps',
  baseStats: {
    maxHp: 100,
    hp: 100,
    atk: 22,
    def: 15,
    mag: 5,
    res: 12,
    spd: 8,
    crt: 15,
    eva: 8,
    acc: 88,
  },
  statGrowthPerLevel: {
    maxHp: 8,
    atk: 2,
    def: 1.2,
    mag: 0.4,
    res: 1,
    spd: 0.6,
  },
  abilities: ['orc_smash', 'orc_rage'], // Updated
  apRegen: 4,
  maxAp: 10,
  isBoss: false,
  equipmentDropChance: 0.4,
  description: 'A brutal warrior with immense physical strength.',
};

export const TROLL_TEMPLATE: EnemyTemplate = {
  id: 'troll',
  name: 'Cave Troll',
  tier: 3,
  role: 'tank',
  baseStats: {
    maxHp: 140,
    hp: 140,
    atk: 18,
    def: 22,
    mag: 4,
    res: 18,
    spd: 5,
    crt: 8,
    eva: 5,
    acc: 82,
  },
  statGrowthPerLevel: {
    maxHp: 12,
    atk: 1.5,
    def: 2,
    mag: 0.3,
    res: 1.8,
    spd: 0.4,
  },
  abilities: ['troll_club', 'troll_regeneration'], // Updated
  apRegen: 3,
  maxAp: 10,
  isBoss: false,
  equipmentDropChance: 0.45,
  description: 'A massive creature with incredible regenerative abilities.',
};

export const WRAITH_TEMPLATE: EnemyTemplate = {
  id: 'wraith',
  name: 'Wraith',
  tier: 3,
  role: 'mage',
  baseStats: {
    maxHp: 80,
    hp: 80,
    atk: 10,
    def: 10,
    mag: 25,
    res: 20,
    spd: 10,
    crt: 12,
    eva: 18,
    acc: 90,
  },
  statGrowthPerLevel: {
    maxHp: 6,
    atk: 0.8,
    def: 0.8,
    mag: 2.2,
    res: 1.8,
    spd: 0.9,
    eva: 0.5,
  },
  abilities: ['wraith_touch', 'wraith_curse'], // Updated
  apRegen: 5,
  maxAp: 10,
  isBoss: false,
  equipmentDropChance: 0.35,
  description: 'A spectral entity that drains life force.',
};

export const ORC_WARLORD_TEMPLATE: EnemyTemplate = {
  id: 'orc_warlord',
  name: 'Orc Warlord',
  tier: 3,
  role: 'boss',
  baseStats: {
    maxHp: 280,
    hp: 280,
    atk: 45,
    def: 32,
    mag: 12,
    res: 25,
    spd: 10,
    crt: 18,
    eva: 10,
    acc: 90,
  },
  statGrowthPerLevel: {
    maxHp: 22,
    atk: 3,
    def: 2.2,
    mag: 0.8,
    res: 1.8,
    spd: 0.7,
  },
  abilities: ['orc_smash', 'orc_rage', 'boss_summon', 'boss_enrage'], // Boss abilities
  apRegen: 6,
  maxAp: 12,
  isBoss: true,
  bossMultiplier: 2.5,
  canSummon: true,
  summonPool: ['orc', 'goblin'],
  summonTriggers: [
    { type: 'hp-threshold', value: 60 },
    { type: 'hp-threshold', value: 25 },
  ],
  maxSummons: 2,
  equipmentDropChance: 1.0,
  description: 'A legendary orc commander who leads through fear and strength.',
};

/**
 * TIER 4: Demons, Dragons, Elementals (Stages 31-50)
 * High-level enemies with magical abilities
 */

export const DEMON_TEMPLATE: EnemyTemplate = {
  id: 'demon',
  name: 'Lesser Demon',
  tier: 4,
  role: 'mage',
  baseStats: {
    maxHp: 120,
    hp: 120,
    atk: 18,
    def: 15,
    mag: 32,
    res: 25,
    spd: 12,
    crt: 15,
    eva: 12,
    acc: 92,
  },
  statGrowthPerLevel: {
    maxHp: 9,
    atk: 1.4,
    def: 1.2,
    mag: 2.5,
    res: 2,
    spd: 1,
  },
  abilities: ['demon_claw', 'demon_fireball'], // Updated
  apRegen: 5,
  maxAp: 10,
  isBoss: false,
  equipmentDropChance: 0.5,
  description: 'A creature from the infernal planes, wielding dark magic.',
};

export const YOUNG_DRAGON_TEMPLATE: EnemyTemplate = {
  id: 'young_dragon',
  name: 'Young Dragon',
  tier: 4,
  role: 'dps',
  baseStats: {
    maxHp: 180,
    hp: 180,
    atk: 35,
    def: 28,
    mag: 28,
    res: 28,
    spd: 10,
    crt: 20,
    eva: 10,
    acc: 90,
  },
  statGrowthPerLevel: {
    maxHp: 14,
    atk: 2.8,
    def: 2.2,
    mag: 2.2,
    res: 2.2,
    spd: 0.8,
  },
  abilities: ['dragon_breath', 'dragon_claw'],
  apRegen: 5,
  maxAp: 12,
  isBoss: false,
  equipmentDropChance: 0.6,
  description: 'A dragon in its youth, still growing into its fearsome power.',
};

export const FIRE_ELEMENTAL_TEMPLATE: EnemyTemplate = {
  id: 'fire_elemental',
  name: 'Fire Elemental',
  tier: 4,
  role: 'mage',
  baseStats: {
    maxHp: 100,
    hp: 100,
    atk: 15,
    def: 12,
    mag: 38,
    res: 30,
    spd: 14,
    crt: 18,
    eva: 15,
    acc: 92,
  },
  statGrowthPerLevel: {
    maxHp: 7,
    atk: 1.2,
    def: 1,
    mag: 3,
    res: 2.5,
    spd: 1.2,
  },
  abilities: ['elemental_blast', 'elemental_freeze'], // Updated
  apRegen: 5,
  maxAp: 10,
  isBoss: false,
  equipmentDropChance: 0.45,
  description: 'Living fire given form and consciousness.',
};

export const DEMON_LORD_TEMPLATE: EnemyTemplate = {
  id: 'demon_lord',
  name: 'Demon Lord',
  tier: 4,
  role: 'boss',
  baseStats: {
    maxHp: 400,
    hp: 400,
    atk: 40,
    def: 35,
    mag: 70,
    res: 60,
    spd: 14,
    crt: 22,
    eva: 15,
    acc: 95,
  },
  statGrowthPerLevel: {
    maxHp: 28,
    atk: 2.8,
    def: 2.5,
    mag: 4.5,
    res: 4,
    spd: 1,
  },
  abilities: ['demon_claw', 'demon_fireball', 'boss_summon', 'boss_enrage'], // Boss abilities
  apRegen: 7,
  maxAp: 14,
  isBoss: true,
  bossMultiplier: 2.5,
  canSummon: true,
  summonPool: ['demon', 'fire_elemental'],
  summonTriggers: [
    { type: 'hp-threshold', value: 70 },
    { type: 'hp-threshold', value: 35 },
  ],
  maxSummons: 2,
  equipmentDropChance: 1.0,
  description: 'A powerful demon commanding legions of lesser fiends.',
};

/**
 * TIER 5: Ancient Beasts, Titans (Stages 51-70)
 * Very high stats, multiple abilities
 */

export const ANCIENT_BEHEMOTH_TEMPLATE: EnemyTemplate = {
  id: 'ancient_behemoth',
  name: 'Ancient Behemoth',
  tier: 5,
  role: 'tank',
  baseStats: {
    maxHp: 250,
    hp: 250,
    atk: 45,
    def: 50,
    mag: 20,
    res: 45,
    spd: 8,
    crt: 12,
    eva: 5,
    acc: 88,
  },
  statGrowthPerLevel: {
    maxHp: 18,
    atk: 3.2,
    def: 3.5,
    mag: 1.5,
    res: 3.2,
    spd: 0.5,
  },
  abilities: ['behemoth_rampage', 'titan_slam'], // Updated (reusing slam)
  apRegen: 5,
  maxAp: 12,
  isBoss: false,
  equipmentDropChance: 0.6,
  description: 'A colossal creature from a bygone age.',
};

export const STONE_TITAN_TEMPLATE: EnemyTemplate = {
  id: 'stone_titan',
  name: 'Stone Titan',
  tier: 5,
  role: 'tank',
  baseStats: {
    maxHp: 300,
    hp: 300,
    atk: 50,
    def: 60,
    mag: 25,
    res: 55,
    spd: 6,
    crt: 10,
    eva: 3,
    acc: 85,
  },
  statGrowthPerLevel: {
    maxHp: 22,
    atk: 3.5,
    def: 4,
    mag: 1.8,
    res: 3.8,
    spd: 0.4,
  },
  abilities: ['titan_slam', 'titan_slam'], // Updated (placeholder - using same ability twice)
  apRegen: 4,
  maxAp: 12,
  isBoss: false,
  equipmentDropChance: 0.65,
  description: 'A living mountain of stone and earth.',
};

export const STORM_WYRM_TEMPLATE: EnemyTemplate = {
  id: 'storm_wyrm',
  name: 'Storm Wyrm',
  tier: 5,
  role: 'mage',
  baseStats: {
    maxHp: 200,
    hp: 200,
    atk: 40,
    def: 35,
    mag: 65,
    res: 50,
    spd: 16,
    crt: 22,
    eva: 18,
    acc: 94,
  },
  statGrowthPerLevel: {
    maxHp: 14,
    atk: 2.8,
    def: 2.5,
    mag: 4.5,
    res: 3.5,
    spd: 1.3,
  },
  abilities: ['wyrm_lightning', 'wyrm_lightning'], // Updated (placeholder)
  apRegen: 6,
  maxAp: 12,
  isBoss: false,
  equipmentDropChance: 0.7,
  description: 'A serpentine dragon that commands the storm.',
};

export const ELDER_DRAGON_TEMPLATE: EnemyTemplate = {
  id: 'elder_dragon',
  name: 'Elder Dragon',
  tier: 5,
  role: 'boss',
  baseStats: {
    maxHp: 600,
    hp: 600,
    atk: 80,
    def: 70,
    mag: 80,
    res: 70,
    spd: 14,
    crt: 25,
    eva: 15,
    acc: 95,
  },
  statGrowthPerLevel: {
    maxHp: 38,
    atk: 5,
    def: 4.5,
    mag: 5,
    res: 4.5,
    spd: 1,
  },
  abilities: ['dragon_breath', 'dragon_claw', 'boss_summon', 'boss_enrage'], // Boss abilities
  apRegen: 7,
  maxAp: 15,
  isBoss: true,
  bossMultiplier: 2.5,
  canSummon: true,
  summonPool: ['young_dragon', 'fire_elemental'],
  summonTriggers: [
    { type: 'hp-threshold', value: 75 },
    { type: 'hp-threshold', value: 50 },
    { type: 'hp-threshold', value: 25 },
  ],
  maxSummons: 2,
  equipmentDropChance: 1.0,
  description: 'An ancient dragon of legendary power and wisdom.',
};

/**
 * TIER 6: Demigods, Celestials (Stages 71-90)
 * Extremely powerful enemies nearing godlike strength
 */

export const FALLEN_ANGEL_TEMPLATE: EnemyTemplate = {
  id: 'fallen_angel',
  name: 'Fallen Angel',
  tier: 6,
  role: 'mage',
  baseStats: {
    maxHp: 280,
    hp: 280,
    atk: 60,
    def: 50,
    mag: 85,
    res: 75,
    spd: 18,
    crt: 25,
    eva: 20,
    acc: 96,
  },
  statGrowthPerLevel: {
    maxHp: 18,
    atk: 4,
    def: 3.5,
    mag: 5.5,
    res: 5,
    spd: 1.4,
  },
  abilities: ['angelic_smite', 'angelic_blessing'], // Updated
  apRegen: 6,
  maxAp: 12,
  isBoss: false,
  equipmentDropChance: 0.75,
  description: 'A celestial being corrupted by darkness.',
};

export const DEMIGOD_WARRIOR_TEMPLATE: EnemyTemplate = {
  id: 'demigod_warrior',
  name: 'Demigod Warrior',
  tier: 6,
  role: 'dps',
  baseStats: {
    maxHp: 350,
    hp: 350,
    atk: 90,
    def: 65,
    mag: 50,
    res: 60,
    spd: 16,
    crt: 28,
    eva: 18,
    acc: 95,
  },
  statGrowthPerLevel: {
    maxHp: 22,
    atk: 6,
    def: 4.5,
    mag: 3.5,
    res: 4,
    spd: 1.2,
  },
  abilities: ['demigod_strike', 'demigod_fury'],
  apRegen: 5,
  maxAp: 12,
  isBoss: false,
  equipmentDropChance: 0.8,
  description: 'The offspring of a mortal and a deity, wielding divine power.',
};

export const CELESTIAL_GUARDIAN_TEMPLATE: EnemyTemplate = {
  id: 'celestial_guardian',
  name: 'Celestial Guardian',
  tier: 6,
  role: 'tank',
  baseStats: {
    maxHp: 400,
    hp: 400,
    atk: 70,
    def: 85,
    mag: 65,
    res: 80,
    spd: 12,
    crt: 20,
    eva: 12,
    acc: 92,
  },
  statGrowthPerLevel: {
    maxHp: 26,
    atk: 4.5,
    def: 5.5,
    mag: 4.2,
    res: 5.2,
    spd: 0.9,
  },
  abilities: ['guardian_shield', 'guardian_retribution'],
  apRegen: 5,
  maxAp: 12,
  isBoss: false,
  equipmentDropChance: 0.85,
  description: 'A divine protector sworn to defend the heavens.',
};

export const ARCHANGEL_TEMPLATE: EnemyTemplate = {
  id: 'archangel',
  name: 'Archangel',
  tier: 6,
  role: 'boss',
  baseStats: {
    maxHp: 800,
    hp: 800,
    atk: 100,
    def: 90,
    mag: 120,
    res: 110,
    spd: 18,
    crt: 30,
    eva: 22,
    acc: 98,
  },
  statGrowthPerLevel: {
    maxHp: 45,
    atk: 6.5,
    def: 6,
    mag: 7.5,
    res: 7,
    spd: 1.3,
  },
  abilities: ['angel_smite', 'angel_judgment', 'archangel_divine_wrath', 'boss_roar'],
  apRegen: 7,
  maxAp: 15,
  isBoss: true,
  bossMultiplier: 2.5,
  canSummon: true,
  summonPool: ['fallen_angel', 'celestial_guardian'],
  summonTriggers: [
    { type: 'hp-threshold', value: 66 },
    { type: 'hp-threshold', value: 33 },
  ],
  maxSummons: 2,
  equipmentDropChance: 1.0,
  description: 'A supreme celestial being of immense power and righteousness.',
};

/**
 * TIER 7: Gods, Primordials (Stages 91-100)
 * Ultimate enemies with godlike powers
 */

export const LESSER_GOD_TEMPLATE: EnemyTemplate = {
  id: 'lesser_god',
  name: 'Lesser God',
  tier: 7,
  role: 'mage',
  baseStats: {
    maxHp: 450,
    hp: 450,
    atk: 100,
    def: 80,
    mag: 130,
    res: 120,
    spd: 20,
    crt: 30,
    eva: 25,
    acc: 98,
  },
  statGrowthPerLevel: {
    maxHp: 28,
    atk: 6.5,
    def: 5.5,
    mag: 8,
    res: 7.5,
    spd: 1.5,
  },
  abilities: ['god_smite', 'god_wrath'],
  apRegen: 7,
  maxAp: 14,
  isBoss: false,
  equipmentDropChance: 0.9,
  description: 'A deity of minor domain, yet still possessing divine power.',
};

export const PRIMORDIAL_TITAN_TEMPLATE: EnemyTemplate = {
  id: 'primordial_titan',
  name: 'Primordial Titan',
  tier: 7,
  role: 'tank',
  baseStats: {
    maxHp: 600,
    hp: 600,
    atk: 120,
    def: 110,
    mag: 90,
    res: 100,
    spd: 14,
    crt: 25,
    eva: 10,
    acc: 95,
  },
  statGrowthPerLevel: {
    maxHp: 35,
    atk: 7.5,
    def: 7,
    mag: 5.5,
    res: 6.5,
    spd: 1,
  },
  abilities: ['primordial_crush', 'primordial_earthquake'],
  apRegen: 6,
  maxAp: 14,
  isBoss: false,
  equipmentDropChance: 0.95,
  description: 'A being from the dawn of creation, embodying raw primal force.',
};

export const VOID_ENTITY_TEMPLATE: EnemyTemplate = {
  id: 'void_entity',
  name: 'Void Entity',
  tier: 7,
  role: 'mage',
  baseStats: {
    maxHp: 400,
    hp: 400,
    atk: 90,
    def: 70,
    mag: 150,
    res: 130,
    spd: 22,
    crt: 35,
    eva: 28,
    acc: 99,
  },
  statGrowthPerLevel: {
    maxHp: 24,
    atk: 5.5,
    def: 4.5,
    mag: 9,
    res: 8,
    spd: 1.6,
  },
  abilities: ['void_annihilation', 'void_drain'],
  apRegen: 8,
  maxAp: 14,
  isBoss: false,
  equipmentDropChance: 1.0,
  description: 'A creature from beyond reality, incomprehensible and terrifying.',
};

export const WORLD_DESTROYER_TEMPLATE: EnemyTemplate = {
  id: 'world_destroyer',
  name: 'World Destroyer',
  tier: 7,
  role: 'boss',
  baseStats: {
    maxHp: 1200,
    hp: 1200,
    atk: 150,
    def: 130,
    mag: 180,
    res: 160,
    spd: 20,
    crt: 35,
    eva: 25,
    acc: 99,
  },
  statGrowthPerLevel: {
    maxHp: 60,
    atk: 9,
    def: 8,
    mag: 10,
    res: 9.5,
    spd: 1.4,
  },
  abilities: ['god_smite', 'god_wrath', 'destroyer_apocalypse', 'boss_roar'],
  apRegen: 8,
  maxAp: 16,
  isBoss: true,
  bossMultiplier: 2.5,
  canSummon: true,
  summonPool: ['lesser_god', 'void_entity'],
  summonTriggers: [
    { type: 'hp-threshold', value: 80 },
    { type: 'hp-threshold', value: 60 },
    { type: 'hp-threshold', value: 40 },
    { type: 'hp-threshold', value: 20 },
  ],
  maxSummons: 2,
  equipmentDropChance: 1.0,
  description: 'The ultimate threat to existence itself, a being of apocalyptic power.',
};

/**
 * Enemy Template Registry
 * Organized by tier for easy lookup
 */

export const ENEMY_TEMPLATES_BY_TIER: Record<number, EnemyTemplate[]> = {
  1: [SLIME_TEMPLATE, RAT_TEMPLATE, BAT_TEMPLATE],
  2: [GOBLIN_TEMPLATE, WOLF_TEMPLATE, SKELETON_TEMPLATE],
  3: [ORC_TEMPLATE, TROLL_TEMPLATE, WRAITH_TEMPLATE],
  4: [DEMON_TEMPLATE, YOUNG_DRAGON_TEMPLATE, FIRE_ELEMENTAL_TEMPLATE],
  5: [ANCIENT_BEHEMOTH_TEMPLATE, STONE_TITAN_TEMPLATE, STORM_WYRM_TEMPLATE],
  6: [FALLEN_ANGEL_TEMPLATE, DEMIGOD_WARRIOR_TEMPLATE, CELESTIAL_GUARDIAN_TEMPLATE],
  7: [LESSER_GOD_TEMPLATE, PRIMORDIAL_TITAN_TEMPLATE, VOID_ENTITY_TEMPLATE],
};

export const BOSS_TEMPLATES_BY_TIER: Record<number, EnemyTemplate> = {
  1: SLIME_KING_TEMPLATE,
  2: GOBLIN_CHIEFTAIN_TEMPLATE,
  3: ORC_WARLORD_TEMPLATE,
  4: DEMON_LORD_TEMPLATE,
  5: ELDER_DRAGON_TEMPLATE,
  6: ARCHANGEL_TEMPLATE,
  7: WORLD_DESTROYER_TEMPLATE,
};

/**
 * Get all enemy templates
 */
export function getAllEnemyTemplates(): EnemyTemplate[] {
  const allEnemies: EnemyTemplate[] = [];
  
  for (let tier = 1; tier <= 7; tier++) {
    allEnemies.push(...ENEMY_TEMPLATES_BY_TIER[tier]);
    allEnemies.push(BOSS_TEMPLATES_BY_TIER[tier]);
  }
  
  return allEnemies;
}

/**
 * Get enemy template by ID
 */
export function getEnemyTemplate(id: string): EnemyTemplate | undefined {
  return getAllEnemyTemplates().find(template => template.id === id);
}

/**
 * Get random enemy template for tier
 */
export function getRandomEnemyTemplateForTier(tier: number): EnemyTemplate {
  const templates = ENEMY_TEMPLATES_BY_TIER[tier as EnemyTier];
  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * Get boss template for tier
 */
export function getBossTemplateForTier(tier: number): EnemyTemplate {
  return BOSS_TEMPLATES_BY_TIER[tier as EnemyTier];
}
