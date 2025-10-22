/**
 * Enemy Ability Definitions
 * 
 * Enemy abilities for all 7 tiers with role-specific abilities:
 * - Tank: Focus on defense, taunts, HP
 * - DPS: High damage, critical hits
 * - Mage: Magical damage, status effects
 * - Support: Buffs, debuffs, healing
 * - Boss: Powerful multi-effect abilities
 */

import type { Ability } from '../types';
import { cloneStatusEffect, POISON, BURN, BLEED, STUN, FREEZE, ATTACK_BUFF, DEFENSE_BUFF, SPEED_BUFF, ATTACK_DEBUFF, DEFENSE_DEBUFF, MAGIC_BUFF } from './statusEffects';

/**
 * ===========================
 * TIER 1 ABILITIES (Stages 1-10)
 * ===========================
 */

// Basic attacks for early enemies
const slimeTackle: Ability = {
  id: 'slime_tackle',
  name: 'Slime Tackle',
  description: 'A sticky tackle that deals light physical damage.',
  apCost: 2,
  targetType: 'single-enemy',
  guaranteedHit: false,
  effects: {
    damageMultiplier: 1.0,
    damageType: 'physical',
  },
  requiredLevel: 1,
};

const slimeAcid: Ability = {
  id: 'slime_acid',
  name: 'Acid Spray',
  description: 'Sprays corrosive acid that deals damage and may apply poison.',
  apCost: 3,
  targetType: 'single-enemy',
  guaranteedHit: false,
  effects: {
    damageMultiplier: 0.8,
    damageType: 'magical',
    statusEffects: [{
      chance: 40,
      effect: cloneStatusEffect(POISON),
    }],
  },
  requiredLevel: 1,
};

const ratBite: Ability = {
  id: 'rat_bite',
  name: 'Vicious Bite',
  description: 'A quick bite that deals damage and may cause bleeding.',
  apCost: 2,
  targetType: 'single-enemy',
  guaranteedHit: false,
  effects: {
    damageMultiplier: 1.1,
    damageType: 'physical',
    statusEffects: [{
      chance: 30,
      effect: cloneStatusEffect(BLEED),
    }],
  },
  requiredLevel: 1,
};

const ratSwarm: Ability = {
  id: 'rat_swarm',
  name: 'Swarm Attack',
  description: 'Calls nearby rats for a frenzied attack.',
  apCost: 4,
  targetType: 'aoe-enemies',
  guaranteedHit: false,
  effects: {
    damageMultiplier: 0.6,
    damageType: 'physical',
  },
  requiredLevel: 1,
};

const batShriek: Ability = {
  id: 'bat_shriek',
  name: 'Sonic Shriek',
  description: 'A piercing shriek that damages and may stun.',
  apCost: 3,
  targetType: 'aoe-enemies',
  guaranteedHit: false,
  effects: {
    damageMultiplier: 0.7,
    damageType: 'magical',
    statusEffects: [{
      chance: 25,
      effect: cloneStatusEffect(STUN),
    }],
  },
  requiredLevel: 1,
};

const batDive: Ability = {
  id: 'bat_dive',
  name: 'Dive Bomb',
  description: 'A fast dive attack with high evasion.',
  apCost: 2,
  targetType: 'single-enemy',
  guaranteedHit: false,
  effects: {
    damageMultiplier: 1.2,
    damageType: 'physical',
  },
  requiredLevel: 1,
};

/**
 * ===========================
 * TIER 2 ABILITIES (Stages 11-20)
 * ===========================
 */

const goblinStab: Ability = {
  id: 'goblin_stab',
  name: 'Rusty Dagger',
  description: 'A quick stab with a rusty blade.',
  apCost: 2,
  targetType: 'single-enemy',
  guaranteedHit: false,
  effects: {
    damageMultiplier: 1.2,
    damageType: 'physical',
    statusEffects: [{
      chance: 35,
      effect: cloneStatusEffect(POISON),
    }],
  },
  requiredLevel: 1,
};

const goblinRally: Ability = {
  id: 'goblin_rally',
  name: 'War Cry',
  description: 'Rallies allies, boosting attack power.',
  apCost: 3,
  targetType: 'all-allies',
  guaranteedHit: true,
  effects: {
    statusEffects: [{
      chance: 100,
      effect: cloneStatusEffect(ATTACK_BUFF),
    }],
  },
  requiredLevel: 1,
};

const wolfBite: Ability = {
  id: 'wolf_bite',
  name: 'Wolf Bite',
  description: 'A savage bite that causes heavy bleeding.',
  apCost: 2,
  targetType: 'single-enemy',
  guaranteedHit: false,
  effects: {
    damageMultiplier: 1.4,
    damageType: 'physical',
    statusEffects: [{
      chance: 50,
      effect: cloneStatusEffect(BLEED),
    }],
  },
  requiredLevel: 1,
};

const wolfHowl: Ability = {
  id: 'wolf_howl',
  name: 'Intimidating Howl',
  description: 'A frightening howl that reduces enemy attack.',
  apCost: 3,
  targetType: 'aoe-enemies',
  guaranteedHit: true,
  effects: {
    statusEffects: [{
      chance: 80,
      effect: cloneStatusEffect(ATTACK_DEBUFF),
    }],
  },
  requiredLevel: 1,
};

const skeletonSlash: Ability = {
  id: 'skeleton_slash',
  name: 'Bone Slash',
  description: 'Strikes with a bone weapon.',
  apCost: 2,
  targetType: 'single-enemy',
  guaranteedHit: false,
  effects: {
    damageMultiplier: 1.3,
    damageType: 'physical',
  },
  requiredLevel: 1,
};

const skeletonDefense: Ability = {
  id: 'skeleton_defense',
  name: 'Bony Shield',
  description: 'Raises defenses with bone armor.',
  apCost: 2,
  targetType: 'self',
  guaranteedHit: true,
  effects: {
    statusEffects: [{
      chance: 100,
      effect: cloneStatusEffect(DEFENSE_BUFF),
    }],
  },
  requiredLevel: 1,
};

/**
 * ===========================
 * TIER 3 ABILITIES (Stages 21-30)
 * ===========================
 */

const orcSmash: Ability = {
  id: 'orc_smash',
  name: 'Brutal Smash',
  description: 'A devastating overhead smash.',
  apCost: 3,
  targetType: 'single-enemy',
  guaranteedHit: false,
  effects: {
    damageMultiplier: 1.8,
    damageType: 'physical',
  },
  requiredLevel: 1,
};

const orcRage: Ability = {
  id: 'orc_rage',
  name: 'Berserker Rage',
  description: 'Enters a rage, boosting attack and speed.',
  apCost: 4,
  targetType: 'self',
  guaranteedHit: true,
  effects: {
    statusEffects: [
      {
        chance: 100,
        effect: cloneStatusEffect(ATTACK_BUFF),
      },
      {
        chance: 100,
        effect: cloneStatusEffect(SPEED_BUFF),
      },
    ],
  },
  requiredLevel: 1,
};

const trollRegeneration: Ability = {
  id: 'troll_regeneration',
  name: 'Troll Regeneration',
  description: 'Rapidly heals wounds.',
  apCost: 3,
  targetType: 'self',
  guaranteedHit: true,
  effects: {
    flatHealing: 40,
    healingMultiplier: 1.0,
  },
  requiredLevel: 1,
};

const trollClub: Ability = {
  id: 'troll_club',
  name: 'Club Swing',
  description: 'Swings a massive club at enemies.',
  apCost: 3,
  targetType: 'single-enemy',
  guaranteedHit: false,
  effects: {
    damageMultiplier: 1.6,
    damageType: 'physical',
    statusEffects: [{
      chance: 35,
      effect: cloneStatusEffect(STUN),
    }],
  },
  requiredLevel: 1,
};

const wraithTouch: Ability = {
  id: 'wraith_touch',
  name: 'Life Drain',
  description: 'Drains life force from the target.',
  apCost: 3,
  targetType: 'single-enemy',
  guaranteedHit: false,
  effects: {
    damageMultiplier: 1.2,
    damageType: 'magical',
    lifesteal: 50,
  },
  requiredLevel: 1,
};

const wraithCurse: Ability = {
  id: 'wraith_curse',
  name: 'Curse of Weakness',
  description: 'Curses an enemy, reducing their stats.',
  apCost: 3,
  targetType: 'single-enemy',
  guaranteedHit: true,
  effects: {
    statusEffects: [
      {
        chance: 100,
        effect: cloneStatusEffect(ATTACK_DEBUFF),
      },
      {
        chance: 100,
        effect: cloneStatusEffect(DEFENSE_DEBUFF),
      },
    ],
  },
  requiredLevel: 1,
};

/**
 * ===========================
 * TIER 4 ABILITIES (Stages 31-50)
 * ===========================
 */

const demonClaw: Ability = {
  id: 'demon_claw',
  name: 'Infernal Claw',
  description: 'A fiery claw attack that burns.',
  apCost: 3,
  targetType: 'single-enemy',
  guaranteedHit: false,
  effects: {
    damageMultiplier: 1.7,
    damageType: 'physical',
    statusEffects: [{
      chance: 60,
      effect: cloneStatusEffect(BURN),
    }],
  },
  requiredLevel: 1,
};

const demonFireball: Ability = {
  id: 'demon_fireball',
  name: 'Hellfire',
  description: 'Hurls a ball of infernal flames.',
  apCost: 4,
  targetType: 'aoe-enemies',
  guaranteedHit: false,
  effects: {
    damageMultiplier: 1.3,
    damageType: 'magical',
    statusEffects: [{
      chance: 40,
      effect: cloneStatusEffect(BURN),
    }],
  },
  requiredLevel: 1,
};

const dragonBreath: Ability = {
  id: 'dragon_breath',
  name: 'Dragon Breath',
  description: 'Breathes fire on all enemies.',
  apCost: 5,
  targetType: 'aoe-enemies',
  guaranteedHit: false,
  effects: {
    damageMultiplier: 1.5,
    damageType: 'magical',
    statusEffects: [{
      chance: 70,
      effect: cloneStatusEffect(BURN),
    }],
  },
  requiredLevel: 1,
};

const dragonClaw: Ability = {
  id: 'dragon_claw',
  name: 'Rending Claws',
  description: 'Tears through armor with powerful claws.',
  apCost: 3,
  targetType: 'single-enemy',
  guaranteedHit: false,
  effects: {
    damageMultiplier: 2.0,
    damageType: 'physical',
    statusEffects: [{
      chance: 50,
      effect: cloneStatusEffect(BLEED),
    }],
  },
  requiredLevel: 1,
};

const elementalBlast: Ability = {
  id: 'elemental_blast',
  name: 'Elemental Blast',
  description: 'Unleashes raw elemental energy.',
  apCost: 4,
  targetType: 'single-enemy',
  guaranteedHit: false,
  effects: {
    damageMultiplier: 2.2,
    damageType: 'magical',
  },
  requiredLevel: 1,
};

const elementalFreeze: Ability = {
  id: 'elemental_freeze',
  name: 'Freeze',
  description: 'Freezes an enemy solid.',
  apCost: 3,
  targetType: 'single-enemy',
  guaranteedHit: false,
  effects: {
    damageMultiplier: 0.8,
    damageType: 'magical',
    statusEffects: [{
      chance: 60,
      effect: cloneStatusEffect(FREEZE),
    }],
  },
  requiredLevel: 1,
};

/**
 * ===========================
 * TIER 5 ABILITIES (Stages 51-70)
 * ===========================
 */

const behemothRampage: Ability = {
  id: 'behemoth_rampage',
  name: 'Rampage',
  description: 'Charges through all enemies.',
  apCost: 5,
  targetType: 'aoe-enemies',
  guaranteedHit: false,
  effects: {
    damageMultiplier: 1.8,
    damageType: 'physical',
    statusEffects: [{
      chance: 40,
      effect: cloneStatusEffect(STUN),
    }],
  },
  requiredLevel: 1,
};

const titanSlam: Ability = {
  id: 'titan_slam',
  name: 'Titan Slam',
  description: 'Slams the ground with earth-shattering force.',
  apCost: 5,
  targetType: 'aoe-enemies',
  guaranteedHit: false,
  effects: {
    damageMultiplier: 1.9,
    damageType: 'physical',
    statusEffects: [{
      chance: 50,
      effect: cloneStatusEffect(STUN),
    }],
  },
  requiredLevel: 1,
};

const wyrmLightning: Ability = {
  id: 'wyrm_lightning',
  name: 'Lightning Strike',
  description: 'Calls down powerful lightning.',
  apCost: 4,
  targetType: 'aoe-enemies',
  guaranteedHit: false,
  effects: {
    damageMultiplier: 2.0,
    damageType: 'magical',
  },
  requiredLevel: 1,
};

/**
 * ===========================
 * TIER 6 ABILITIES (Stages 71-90)
 * ===========================
 */

const angelicSmite: Ability = {
  id: 'angelic_smite',
  name: 'Holy Smite',
  description: 'Divine wrath strikes down foes.',
  apCost: 4,
  targetType: 'single-enemy',
  guaranteedHit: true,
  effects: {
    damageMultiplier: 2.5,
    damageType: 'magical',
  },
  requiredLevel: 1,
};

const angelicBlessing: Ability = {
  id: 'angelic_blessing',
  name: 'Divine Blessing',
  description: 'Blesses self with divine power.',
  apCost: 3,
  targetType: 'self',
  guaranteedHit: true,
  effects: {
    flatHealing: 80,
    healingMultiplier: 1.5,
    statusEffects: [
      {
        chance: 100,
        effect: cloneStatusEffect(ATTACK_BUFF),
      },
      {
        chance: 100,
        effect: cloneStatusEffect(DEFENSE_BUFF),
      },
    ],
  },
  requiredLevel: 1,
};

const demigodStrike: Ability = {
  id: 'demigod_strike',
  name: 'God Strike',
  description: 'Strikes with divine strength.',
  apCost: 4,
  targetType: 'single-enemy',
  guaranteedHit: false,
  effects: {
    damageMultiplier: 2.8,
    damageType: 'physical',
  },
  requiredLevel: 1,
};

const celestialBeam: Ability = {
  id: 'celestial_beam',
  name: 'Celestial Beam',
  description: 'Fires a beam of pure celestial energy.',
  apCost: 5,
  targetType: 'aoe-enemies',
  guaranteedHit: false,
  effects: {
    damageMultiplier: 2.2,
    damageType: 'magical',
  },
  requiredLevel: 1,
};

/**
 * ===========================
 * TIER 7 ABILITIES (Stages 91-100)
 * ===========================
 */

const godlyWrath: Ability = {
  id: 'godly_wrath',
  name: 'Divine Wrath',
  description: 'Unleashes the full wrath of a god.',
  apCost: 6,
  targetType: 'aoe-enemies',
  guaranteedHit: true,
  effects: {
    damageMultiplier: 3.0,
    damageType: 'magical',
  },
  requiredLevel: 1,
};

const primordialCrush: Ability = {
  id: 'primordial_crush',
  name: 'Primordial Crush',
  description: 'The raw force of creation itself.',
  apCost: 5,
  targetType: 'single-enemy',
  guaranteedHit: false,
  effects: {
    damageMultiplier: 3.5,
    damageType: 'physical',
  },
  requiredLevel: 1,
};

const voidErasure: Ability = {
  id: 'void_erasure',
  name: 'Void Erasure',
  description: 'Erases existence itself.',
  apCost: 6,
  targetType: 'single-enemy',
  guaranteedHit: true,
  effects: {
    damageMultiplier: 4.0,
    damageType: 'magical',
  },
  requiredLevel: 1,
};

/**
 * ===========================
 * BOSS ABILITIES
 * ===========================
 */

const bossSummonMinions: Ability = {
  id: 'boss_summon',
  name: 'Summon Minions',
  description: 'Calls forth reinforcements.',
  apCost: 4,
  targetType: 'self',
  guaranteedHit: true,
  effects: {
    // Note: Actual summoning handled by boss summon system
    statusEffects: [{
      chance: 100,
      effect: cloneStatusEffect(ATTACK_BUFF),
    }],
  },
  requiredLevel: 1,
};

const bossEnrage: Ability = {
  id: 'boss_enrage',
  name: 'Enrage',
  description: 'Enters a furious rage at low HP.',
  apCost: 3,
  targetType: 'self',
  guaranteedHit: true,
  effects: {
    statusEffects: [
      {
        chance: 100,
        effect: cloneStatusEffect(ATTACK_BUFF),
      },
      {
        chance: 100,
        effect: cloneStatusEffect(SPEED_BUFF),
      },
      {
        chance: 100,
        effect: cloneStatusEffect(MAGIC_BUFF),
      },
    ],
  },
  requiredLevel: 1,
};

/**
 * ===========================
 * ABILITY EXPORTS
 * ===========================
 */

// Tier 1
export const TIER_1_ABILITIES = [
  slimeTackle, slimeAcid,
  ratBite, ratSwarm,
  batShriek, batDive,
];

// Tier 2
export const TIER_2_ABILITIES = [
  goblinStab, goblinRally,
  wolfBite, wolfHowl,
  skeletonSlash, skeletonDefense,
];

// Tier 3
export const TIER_3_ABILITIES = [
  orcSmash, orcRage,
  trollRegeneration, trollClub,
  wraithTouch, wraithCurse,
];

// Tier 4
export const TIER_4_ABILITIES = [
  demonClaw, demonFireball,
  dragonBreath, dragonClaw,
  elementalBlast, elementalFreeze,
];

// Tier 5
export const TIER_5_ABILITIES = [
  behemothRampage,
  titanSlam,
  wyrmLightning,
];

// Tier 6
export const TIER_6_ABILITIES = [
  angelicSmite, angelicBlessing,
  demigodStrike,
  celestialBeam,
];

// Tier 7
export const TIER_7_ABILITIES = [
  godlyWrath,
  primordialCrush,
  voidErasure,
];

// Boss abilities (used by all bosses)
export const BOSS_ABILITIES = [
  bossSummonMinions,
  bossEnrage,
];

// All enemy abilities
export const ALL_ENEMY_ABILITIES = [
  ...TIER_1_ABILITIES,
  ...TIER_2_ABILITIES,
  ...TIER_3_ABILITIES,
  ...TIER_4_ABILITIES,
  ...TIER_5_ABILITIES,
  ...TIER_6_ABILITIES,
  ...TIER_7_ABILITIES,
  ...BOSS_ABILITIES,
];

/**
 * Helper function to get abilities by enemy role
 */
export function getAbilitiesForEnemyRole(tier: number, role: 'tank' | 'dps' | 'mage' | 'support' | 'boss'): Ability[] {
  let tierAbilities: Ability[];
  
  switch (tier) {
    case 1:
      tierAbilities = TIER_1_ABILITIES;
      break;
    case 2:
      tierAbilities = TIER_2_ABILITIES;
      break;
    case 3:
      tierAbilities = TIER_3_ABILITIES;
      break;
    case 4:
      tierAbilities = TIER_4_ABILITIES;
      break;
    case 5:
      tierAbilities = TIER_5_ABILITIES;
      break;
    case 6:
      tierAbilities = TIER_6_ABILITIES;
      break;
    case 7:
      tierAbilities = TIER_7_ABILITIES;
      break;
    default:
      tierAbilities = TIER_1_ABILITIES;
  }
  
  if (role === 'boss') {
    // Bosses get tier abilities + boss-specific abilities
    return [...tierAbilities.slice(0, 2), ...BOSS_ABILITIES];
  }
  
  // Non-bosses get 2-3 abilities from their tier
  return tierAbilities.slice(0, 2);
}

/**
 * Get ability by ID
 */
export function getEnemyAbility(abilityId: string): Ability | undefined {
  return ALL_ENEMY_ABILITIES.find(a => a.id === abilityId);
}
