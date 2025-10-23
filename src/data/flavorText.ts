/**
 * Flavor Text Data
 * 
 * Provides lore, descriptions, and narrative flavor for:
 * - Abilities (24 player abilities)
 * - Equipment (7 rarity tiers with procedural templates)
 * - Enemies (28 enemy templates)
 */

import type { EquipmentRarity } from '../types/equipment';

// ============================================================================
// ABILITY FLAVOR TEXT
// ============================================================================

export interface AbilityFlavorText {
  id: string;
  description: string;
  effectDescription: string;
}

/**
 * Flavor text for all 24 player abilities
 */
export const abilityFlavorText: Record<string, AbilityFlavorText> = {
  // -------------------------------------------------------------------------
  // ALPHA (PALADIN) ABILITIES
  // -------------------------------------------------------------------------
  righteous_strike: {
    id: 'righteous_strike',
    description: 'A sanctified blow infused with holy power, punishing evil with divine wrath.',
    effectDescription: 'Deals physical damage to a single enemy.'
  },
  
  guardians_blessing: {
    id: 'guardians_blessing',
    description: 'Channel celestial light to mend wounds and restore vitality to an ally in need.',
    effectDescription: 'Heals a single ally for 50% of your MAG stat.'
  },
  
  holy_smite: {
    id: 'holy_smite',
    description: 'Call down a pillar of radiant fire that scorches all who stand against righteousness.',
    effectDescription: 'Deals magical damage to all enemies with holy power.'
  },
  
  inspiring_aura: {
    id: 'inspiring_aura',
    description: 'Your presence on the battlefield emboldens allies, filling them with courage and strength.',
    effectDescription: 'Grants +20% ATK and +20% DEF to all allies for 3 turns.'
  },

  // -------------------------------------------------------------------------
  // BETA (ROGUE) ABILITIES
  // -------------------------------------------------------------------------
  quick_slash: {
    id: 'quick_slash',
    description: 'A lightning-fast strike that finds the gap in armor before the enemy can react.',
    effectDescription: 'Deals physical damage to a single enemy. Guaranteed to hit.'
  },
  
  backstab: {
    id: 'backstab',
    description: 'Strike from the shadows, exploiting weakness with a critical blow aimed at vital organs.',
    effectDescription: 'Deals 2x physical damage to a single enemy. High critical chance.'
  },
  
  smokescreen: {
    id: 'smokescreen',
    description: 'Vanish in a cloud of acrid smoke, becoming a phantom on the battlefield.',
    effectDescription: 'Grants self +50% EVA for 3 turns, making you incredibly hard to hit.'
  },
  
  execute: {
    id: 'execute',
    description: 'A merciless finishing move that deals devastating damage to wounded targets.',
    effectDescription: 'Massive physical damage to a single enemy. Extra damage if target is below 50% HP.'
  },

  // -------------------------------------------------------------------------
  // GAMMA (MAGE) ABILITIES
  // -------------------------------------------------------------------------
  arcane_bolt: {
    id: 'arcane_bolt',
    description: 'A focused projectile of pure magical energy that never misses its mark.',
    effectDescription: 'Deals magical damage to a single enemy. Guaranteed to hit.'
  },
  
  fireball: {
    id: 'fireball',
    description: 'Conjure a sphere of roaring flames that explodes on impact, engulfing enemies in an inferno.',
    effectDescription: 'Deals fire damage to all enemies and may inflict Burn (3 turns).'
  },
  
  frost_nova: {
    id: 'frost_nova',
    description: 'Release a wave of absolute zero that freezes enemies in place, sapping their speed.',
    effectDescription: 'Deals ice damage to all enemies and reduces their SPD by 30% for 3 turns.'
  },
  
  meteor_storm: {
    id: 'meteor_storm',
    description: 'Tear holes in reality itself, summoning cosmic destruction upon your foes.',
    effectDescription: 'Devastating magical damage to all enemies. The ultimate destructive spell.'
  },

  // -------------------------------------------------------------------------
  // DELTA (WARRIOR) ABILITIES
  // -------------------------------------------------------------------------
  power_slash: {
    id: 'power_slash',
    description: 'A mighty overhead swing that channels raw strength into a single devastating blow.',
    effectDescription: 'Deals heavy physical damage to a single enemy.'
  },
  
  cleave: {
    id: 'cleave',
    description: 'Sweep your weapon in a wide arc, carving through multiple foes with brutal efficiency.',
    effectDescription: 'Deals physical damage to all enemies. Wide-range attack.'
  },
  
  rending_strike: {
    id: 'rending_strike',
    description: 'A vicious attack that tears through armor, leaving the target exposed and vulnerable.',
    effectDescription: 'Deals physical damage and reduces target DEF by 30% for 3 turns.'
  },
  
  rampage: {
    id: 'rampage',
    description: 'Unleash unbridled fury, striking repeatedly with increasing ferocity.',
    effectDescription: 'Multi-hit physical damage to all enemies with increasing power per hit.'
  },

  // -------------------------------------------------------------------------
  // EPSILON (CLERIC) ABILITIES
  // -------------------------------------------------------------------------
  healing_light: {
    id: 'healing_light',
    description: 'A gentle ray of restorative energy that closes wounds and eases pain.',
    effectDescription: 'Heals a single ally for a moderate amount based on your MAG stat.'
  },
  
  regeneration: {
    id: 'regeneration',
    description: 'Bestow divine vitality that gradually mends injuries over time.',
    effectDescription: 'Grants Regeneration to an ally, healing them each turn for 3 turns.'
  },
  
  divine_blessing: {
    id: 'divine_blessing',
    description: 'Call upon sacred powers to fortify an ally with protective wards.',
    effectDescription: 'Grants +30% DEF and +30% RES to an ally for 4 turns.'
  },
  
  mass_healing: {
    id: 'mass_healing',
    description: 'Channel a wave of pure life force that washes over your entire party.',
    effectDescription: 'Heals all allies for a significant amount. Party-wide restoration.'
  },

  // -------------------------------------------------------------------------
  // ZETA (BERSERKER) ABILITIES
  // -------------------------------------------------------------------------
  furious_strike: {
    id: 'furious_strike',
    description: 'Sacrifice control for raw power, dealing massive damage at great personal cost.',
    effectDescription: 'Heavy physical damage to a single enemy, but damages self for 10% max HP.'
  },
  
  bloodlust: {
    id: 'bloodlust',
    description: 'Embrace the thrill of battle, converting pain into unstoppable rage.',
    effectDescription: 'Grants self +40% ATK and +20% SPD for 3 turns, but reduces DEF by 20%.'
  },
  
  devouring_strike: {
    id: 'devouring_strike',
    description: 'A savage blow that feeds on the enemy\'s life force, converting death into vitality.',
    effectDescription: 'Physical damage to a single enemy. Heal self for 50% of damage dealt.'
  },
  
  berserk: {
    id: 'berserk',
    description: 'Abandon reason and restraint, becoming a whirlwind of destruction and chaos.',
    effectDescription: 'Massive physical damage to all enemies. Self takes damage equal to 20% max HP.'
  }
};

// ============================================================================
// EQUIPMENT FLAVOR TEXT
// ============================================================================

export interface EquipmentFlavorTemplate {
  prefix: string[];
  suffix: string[];
  description: string;
}

/**
 * Flavor text templates for equipment rarity tiers
 */
export const equipmentFlavorText: Record<EquipmentRarity, EquipmentFlavorTemplate> = {
  basic: {
    prefix: ['Worn', 'Simple', 'Common', 'Crude', 'Plain'],
    suffix: ['of Beginnings', 'of Apprentices', 'of Novices', 'of Training'],
    description: 'Basic equipment suitable for beginners. Functional but unremarkable.'
  },
  
  common: {
    prefix: ['Sturdy', 'Reliable', 'Standard', 'Quality', 'Practical'],
    suffix: ['of the Soldier', 'of Duty', 'of Service', 'of the Guard'],
    description: 'Well-crafted equipment used by professional warriors. Dependable in battle.'
  },
  
  uncommon: {
    prefix: ['Enchanted', 'Blessed', 'Enhanced', 'Reinforced', 'Mystic'],
    suffix: ['of Protection', 'of Power', 'of the Warrior', 'of Valor'],
    description: 'Equipment touched by magic, superior to mundane arms and armor.'
  },
  
  rare: {
    prefix: ['Ancient', 'Masterwork', 'Legendary', 'Exquisite', 'Fabled'],
    suffix: ['of Champions', 'of Glory', 'of Legend', 'of Heroes'],
    description: 'Exceptional equipment crafted by masters or imbued with powerful enchantments. Few possess such treasures.'
  },
  
  epic: {
    prefix: ['Celestial', 'Infernal', 'Dragonforged', 'Mythril', 'Adamantine'],
    suffix: ['of Titans', 'of the Gods', 'of Eternity', 'of Dominion'],
    description: 'Equipment forged from legendary materials or wielded by heroes of old. Each piece has a story written in blood and glory.'
  },
  
  legendary: {
    prefix: ['Godforged', 'Eternal', 'Primordial', 'Divine', 'Immortal'],
    suffix: ['of Ascension', 'of the Chosen', 'of Destiny', 'of Immortals'],
    description: 'Arms and armor touched by divinity itself. Legends speak of these items changing the fate of nations.'
  },
  
  mythic: {
    prefix: ['Worldbreaker', 'Starborn', 'Void-touched', 'Reality-Sundering', 'Universe-Forged'],
    suffix: ['of Creation', 'of Oblivion', 'of Infinity', 'Beyond Time'],
    description: 'Equipment that exists beyond mortal comprehension. To wield such power is to stand as equals with gods. Entire civilizations have risen and fallen in pursuit of a single piece.'
  }
};

/**
 * Generate flavor text for equipment based on rarity
 */
export function getEquipmentFlavorText(rarity: EquipmentRarity): string {
  const template = equipmentFlavorText[rarity];
  return template.description;
}

// ============================================================================
// ENEMY FLAVOR TEXT
// ============================================================================

export interface EnemyFlavorText {
  id: string;
  name: string;
  description: string;
  bossIntroduction?: string;
}

/**
 * Flavor text for all 28 enemy templates
 */
export const enemyFlavorText: Record<string, EnemyFlavorText> = {
  // -------------------------------------------------------------------------
  // TIER 1: SLIMES & CRITTERS (Stages 1-10)
  // -------------------------------------------------------------------------
  slime: {
    id: 'slime',
    name: 'Slime',
    description: 'A gelatinous blob that absorbs nutrients from unwary travelers. Weak individually, but their acidic touch can dissolve leather and flesh alike.',
  },
  
  rat: {
    id: 'rat',
    name: 'Giant Rat',
    description: 'Disease-ridden vermin grown to unnatural size in the depths. Their bite carries pestilence, and they travel in packs.',
  },
  
  bat: {
    id: 'bat',
    name: 'Cave Bat',
    description: 'Agile nocturnal predators with razor-sharp fangs. They strike from above with precision, draining the vitality of their prey.',
  },
  
  slime_king: {
    id: 'slime_king',
    name: 'Slime King',
    description: 'A massive gelatinous horror that has consumed countless victims. Its acidic core can dissolve armor and bone.',
    bossIntroduction: 'The cavern floor trembles as a towering mass of corrosive slime oozes into view. The Slime King has claimed this domain for centuries, and countless adventurers have been absorbed into its putrid mass.'
  },

  // -------------------------------------------------------------------------
  // TIER 2: GOBLINS & MONSTERS (Stages 11-20)
  // -------------------------------------------------------------------------
  goblin: {
    id: 'goblin',
    name: 'Goblin Warrior',
    description: 'Cunning and vicious creatures that fight in coordinated groups. Small in stature but deadly in numbers, wielding crude but effective weapons.',
  },
  
  wolf: {
    id: 'wolf',
    name: 'Dire Wolf',
    description: 'Savage predators with supernatural endurance and pack tactics. Their howl freezes the blood, and their fangs can crush steel.',
  },
  
  skeleton: {
    id: 'skeleton',
    name: 'Skeleton',
    description: 'Animated bones held together by dark magic. They feel no pain, no fear, only an eternal compulsion to destroy the living.',
  },
  
  goblin_chieftain: {
    id: 'goblin_chieftain',
    name: 'Goblin Chieftain',
    description: 'The cunning leader of a vast goblin tribe. Larger and smarter than its kin, it has survived countless battles through treachery and tactical brilliance.',
    bossIntroduction: 'War drums echo through the tunnels as the Goblin Chieftain emerges, adorned with trophies from fallen heroes. This warlord has united the goblin clans, and its ambitions grow with each victory.'
  },

  // -------------------------------------------------------------------------
  // TIER 3: ORCS & UNDEAD (Stages 21-30)
  // -------------------------------------------------------------------------
  orc: {
    id: 'orc',
    name: 'Orc Warrior',
    description: 'Brutal combatants who live for battle. Their strength is legendary, and they show no mercy to those weaker than themselves.',
  },
  
  troll: {
    id: 'troll',
    name: 'Troll',
    description: 'Massive creatures with regenerative abilities that allow them to recover from grievous wounds. Only fire or acid can permanently stop their healing.',
  },
  
  wraith: {
    id: 'wraith',
    name: 'Wraith',
    description: 'Incorporeal spirits of tormented souls, existing between life and death. They drain life force with a touch, leaving victims as hollow husks.',
  },
  
  orc_warlord: {
    id: 'orc_warlord',
    name: 'Orc Warlord',
    description: 'A champion of the orc hordes, whose strength is matched only by its savage ferocity. Many warriors have fallen to its massive blade.',
    bossIntroduction: 'The ground shakes with each step as the Orc Warlord strides into battle, a mountain of muscle and rage. Its roar alone has broken the spirits of entire armies.'
  },

  // -------------------------------------------------------------------------
  // TIER 4: DEMONS & DRAGONS (Stages 31-50)
  // -------------------------------------------------------------------------
  demon: {
    id: 'demon',
    name: 'Lesser Demon',
    description: 'Fiendish entities from the infernal planes, wielding dark magic and burning with hellfire. They delight in mortal suffering.',
  },
  
  dragon: {
    id: 'dragon',
    name: 'Young Dragon',
    description: 'Even in youth, dragons are apex predators with scales harder than steel and breath that incinerates all in its path.',
  },
  
  elemental: {
    id: 'elemental',
    name: 'Elemental',
    description: 'Living manifestations of pure elemental force - fire, ice, lightning, or earth given form and fury.',
  },
  
  shadow_dragon: {
    id: 'shadow_dragon',
    name: 'Shadow Dragon',
    description: 'An ancient wyrm corrupted by darkness, it commands both draconic might and shadow magic. Few have seen this beast and lived.',
    bossIntroduction: 'Darkness coalesces into form as the Shadow Dragon materializes, its scales absorbing all light. This ancient terror has ended kingdoms, and its very presence corrupts the air with dread and despair.'
  },

  // -------------------------------------------------------------------------
  // TIER 5: ANCIENT BEASTS (Stages 51-70)
  // -------------------------------------------------------------------------
  ancient_beast: {
    id: 'ancient_beast',
    name: 'Ancient Beast',
    description: 'Primordial creatures from the world\'s youth, when magic was wild and monsters ruled supreme. Their power defies comprehension.',
  },
  
  titan: {
    id: 'titan',
    name: 'Titan',
    description: 'Colossal beings from the age of creation, standing taller than mountains. Each Titan embodies a fundamental force of nature.',
  },
  
  void_beast: {
    id: 'void_beast',
    name: 'Void Beast',
    description: 'Aberrations from beyond reality, existing in spaces between dimensions. Their mere presence warps the laws of physics.',
  },
  
  titan_lord: {
    id: 'titan_lord',
    name: 'Titan Lord',
    description: 'The eldest and mightiest of the Titans, a being of such immense power that its footsteps reshape continents.',
    bossIntroduction: 'The earth itself splits apart as the Titan Lord awakens from its millennium-long slumber. This colossus predates civilization, and gods themselves once trembled before its might.'
  },

  // -------------------------------------------------------------------------
  // TIER 6: DEMIGODS (Stages 71-90)
  // -------------------------------------------------------------------------
  demigod: {
    id: 'demigod',
    name: 'Demigod',
    description: 'Offspring of divine and mortal unions, possessing power that bridges the gap between humanity and godhood. They wield divine authority with mortal ambition.',
  },
  
  celestial: {
    id: 'celestial',
    name: 'Celestial',
    description: 'Servants of higher powers, beings of pure cosmic energy who enforce the will of the divine. They are justice made manifest.',
  },
  
  fallen_angel: {
    id: 'fallen_angel',
    name: 'Fallen Angel',
    description: 'Once servants of light, now twisted by pride and ambition. They retain divine power but wield it for their own dark purposes.',
  },
  
  archon: {
    id: 'archon',
    name: 'Archon',
    description: 'The highest order of celestial beings, second only to gods themselves. Each Archon commands legions and embodies absolute divine law.',
    bossIntroduction: 'Reality bends as the Archon descends, its form radiating such pure celestial energy that lesser beings are blinded. This is judgment incarnate, an arbiter of cosmic law whose decisions have shaped the destiny of entire planes of existence.'
  },

  // -------------------------------------------------------------------------
  // TIER 7: GODS & PRIMORDIALS (Stages 91-100)
  // -------------------------------------------------------------------------
  god: {
    id: 'god',
    name: 'Lesser God',
    description: 'Divine beings who shaped the world with their will. To face a god is to challenge the fundamental forces of reality itself.',
  },
  
  primordial: {
    id: 'primordial',
    name: 'Primordial',
    description: 'The first beings to exist, predating even the gods. They are the raw chaos from which all creation emerged, and their power is absolute.',
  },
  
  world_eater: {
    id: 'world_eater',
    name: 'World Eater',
    description: 'An entity of cosmic horror that devours entire worlds, consuming matter and energy on a scale beyond mortal understanding.',
  },
  
  eternal_one: {
    id: 'eternal_one',
    name: 'The Eternal One',
    description: 'The ultimate adversary. A being that exists outside time, a fundamental force of the cosmos given consciousness and malice.',
    bossIntroduction: 'Time fractures. Space warps. The very fabric of existence tears as The Eternal One manifests. This is the end of all things, the ultimate test. Gods have fallen before its gaze. Universes have been unmade by its will. You stand now at the precipice of oblivion itself. Victory here means transcending mortality. Defeat means erasure from reality. This is the final battle - the end of all stories.'
  }
};

/**
 * Get flavor text for an enemy
 */
export function getEnemyFlavorText(enemyId: string): EnemyFlavorText | undefined {
  return enemyFlavorText[enemyId];
}

/**
 * Get boss introduction text for dramatic effect
 */
export function getBossIntroduction(enemyId: string): string | undefined {
  const flavorText = enemyFlavorText[enemyId];
  return flavorText?.bossIntroduction;
}

/**
 * Get ability flavor text
 */
export function getAbilityFlavorText(abilityId: string): AbilityFlavorText | undefined {
  return abilityFlavorText[abilityId];
}
