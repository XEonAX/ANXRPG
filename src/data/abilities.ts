/**
 * Ability Definitions
 * Defines all 24 abilities for the 6 character types (4 abilities each)
 * 
 * IMPORTANT: These abilities are proposed and should be reviewed for balance
 */

import type { Ability } from '../types';

/**
 * Alpha (Paladin) Abilities - Tank/Off-Healer
 * Focus: Defensive abilities, taunts, minor healing
 */

const alphaStrike: Ability = {
  id: 'alpha_strike',
  name: 'Righteous Strike',
  description: 'A powerful melee attack that deals moderate damage.',
  apCost: 2,
  targetType: 'single-enemy',
  guaranteedHit: false,
  effects: {
    damageMultiplier: 1.2,
    damageType: 'physical',
  },
  requiredLevel: 1,
  characterTypes: ['Alpha'],
  flavorText: 'Strike with the fury of justice!',
};

const alphaDefend: Ability = {
  id: 'alpha_defend',
  name: 'Guardian\'s Blessing',
  description: 'Increases own DEF and heals for a small amount.',
  apCost: 3,
  targetType: 'self',
  guaranteedHit: true,
  effects: {
    flatHealing: 20,
    healingMultiplier: 0.5,
    statusEffects: [{
      chance: 100,
      effect: {
        id: 'def_buff',
        name: 'Defense Up',
        type: 'buff',
        description: 'Increased defense',
        duration: 3,
        ticksAtTurnStart: false,
        statModifiers: [{ stat: 'def', value: 20 }],
        stackable: false,
      },
    }],
  },
  requiredLevel: 5,
  characterTypes: ['Alpha'],
  flavorText: 'The shield protects all who stand behind it.',
};

const alphaSmite: Ability = {
  id: 'alpha_smite',
  name: 'Holy Smite',
  description: 'Deals magical damage and has a chance to stun the target.',
  apCost: 4,
  targetType: 'single-enemy',
  guaranteedHit: false,
  effects: {
    damageMultiplier: 1.5,
    damageType: 'magical',
    statusEffects: [{
      chance: 30,
      effect: {
        id: 'stun',
        name: 'Stunned',
        type: 'control',
        description: 'Cannot act',
        duration: 1,
        ticksAtTurnStart: true,
        preventActions: true,
        stackable: false,
      },
    }],
  },
  requiredLevel: 10,
  characterTypes: ['Alpha'],
  flavorText: 'Divine wrath descends upon the wicked!',
};

const alphaAura: Ability = {
  id: 'alpha_aura',
  name: 'Inspiring Aura',
  description: 'Heals all allies and grants a small ATK buff.',
  apCost: 4,
  targetType: 'all-allies',
  guaranteedHit: true,
  effects: {
    flatHealing: 15,
    healingMultiplier: 0.4,
    statusEffects: [{
      chance: 100,
      effect: {
        id: 'atk_buff',
        name: 'Attack Up',
        type: 'buff',
        description: 'Increased attack',
        duration: 2,
        ticksAtTurnStart: false,
        statModifiers: [{ stat: 'atk', value: 15 }],
        stackable: false,
      },
    }],
  },
  requiredLevel: 20,
  characterTypes: ['Alpha'],
  flavorText: 'Rally, warriors! Victory is at hand!',
};

/**
 * Beta (Rogue) Abilities - Critical DPS
 * Focus: High single-target damage, critical hits, evasion
 */

const betaSlash: Ability = {
  id: 'beta_slash',
  name: 'Quick Slash',
  description: 'A fast attack with increased critical chance.',
  apCost: 2,
  targetType: 'single-enemy',
  guaranteedHit: false,
  effects: {
    damageMultiplier: 1.0,
    damageType: 'physical',
    statusEffects: [{
      chance: 100,
      effect: {
        id: 'crit_up_self',
        name: 'Critical Focus',
        type: 'buff',
        description: 'Increased critical chance',
        duration: 1,
        ticksAtTurnStart: false,
        statModifiers: [{ stat: 'crt', value: 15 }],
        stackable: false,
      },
    }],
  },
  requiredLevel: 1,
  characterTypes: ['Beta'],
  flavorText: 'Swift as shadow, deadly as night.',
};

const betaBackstab: Ability = {
  id: 'beta_backstab',
  name: 'Backstab',
  description: 'A devastating critical strike that always hits and guarantees a critical.',
  apCost: 3,
  targetType: 'single-enemy',
  guaranteedHit: true,
  effects: {
    damageMultiplier: 2.0,
    damageType: 'physical',
  },
  requiredLevel: 5,
  characterTypes: ['Beta'],
  flavorText: 'They never see it coming.',
};

const betaSmokescreen: Ability = {
  id: 'beta_smokescreen',
  name: 'Smokescreen',
  description: 'Increases evasion dramatically for a short time.',
  apCost: 2,
  targetType: 'self',
  guaranteedHit: true,
  effects: {
    statusEffects: [{
      chance: 100,
      effect: {
        id: 'evasion_buff',
        name: 'Smokescreen',
        type: 'buff',
        description: 'Greatly increased evasion',
        duration: 2,
        ticksAtTurnStart: false,
        statModifiers: [{ stat: 'eva', value: 40 }],
        stackable: false,
      },
    }],
  },
  requiredLevel: 10,
  characterTypes: ['Beta'],
  flavorText: 'You can\'t hit what you can\'t see!',
};

const betaExecute: Ability = {
  id: 'beta_execute',
  name: 'Execute',
  description: 'Massive damage attack. Lower target HP = more damage.',
  apCost: 4,
  targetType: 'single-enemy',
  guaranteedHit: false,
  effects: {
    damageMultiplier: 2.5,
    damageType: 'physical',
  },
  requiredLevel: 20,
  characterTypes: ['Beta'],
  flavorText: 'The final cut.',
};

/**
 * Gamma (Mage) Abilities - AoE/Elemental
 * Focus: Area damage, elemental effects, crowd control
 */

const gammaBolt: Ability = {
  id: 'gamma_bolt',
  name: 'Arcane Bolt',
  description: 'Fires a magical projectile at a single enemy.',
  apCost: 2,
  targetType: 'single-enemy',
  guaranteedHit: true,
  effects: {
    damageMultiplier: 1.3,
    damageType: 'magical',
  },
  requiredLevel: 1,
  characterTypes: ['Gamma'],
  flavorText: 'Pure arcane energy, shaped by will.',
};

const gammaFireball: Ability = {
  id: 'gamma_fireball',
  name: 'Fireball',
  description: 'Hits all enemies with fire damage and applies burn.',
  apCost: 4,
  targetType: 'all-enemies',
  guaranteedHit: true,
  effects: {
    damageMultiplier: 0.9,
    damageType: 'magical',
    statusEffects: [{
      chance: 60,
      effect: {
        id: 'burn',
        name: 'Burning',
        type: 'dot',
        description: 'Taking fire damage over time',
        duration: 3,
        ticksAtTurnStart: true,
        damagePerTurn: 10,
        stackable: true,
        maxStacks: 3,
      },
    }],
  },
  requiredLevel: 5,
  characterTypes: ['Gamma'],
  flavorText: 'Feel the flames of destruction!',
};

const gammaFreeze: Ability = {
  id: 'gamma_freeze',
  name: 'Frost Nova',
  description: 'Freezes a single enemy, preventing actions for 1 turn.',
  apCost: 3,
  targetType: 'single-enemy',
  guaranteedHit: true,
  effects: {
    damageMultiplier: 0.8,
    damageType: 'magical',
    statusEffects: [{
      chance: 80,
      effect: {
        id: 'freeze',
        name: 'Frozen',
        type: 'control',
        description: 'Cannot act',
        duration: 1,
        ticksAtTurnStart: true,
        preventActions: true,
        stackable: false,
      },
    }],
  },
  requiredLevel: 10,
  characterTypes: ['Gamma'],
  flavorText: 'Ice claims another victim.',
};

const gammaMeteor: Ability = {
  id: 'gamma_meteor',
  name: 'Meteor Storm',
  description: 'Massive AoE damage to all enemies.',
  apCost: 4,
  targetType: 'all-enemies',
  guaranteedHit: true,
  effects: {
    damageMultiplier: 1.5,
    damageType: 'magical',
  },
  requiredLevel: 20,
  characterTypes: ['Gamma'],
  flavorText: 'The stars themselves rain down!',
};

/**
 * Delta (Warrior) Abilities - Physical DPS
 * Focus: Reliable physical damage, cleave attacks
 */

const deltaSlash: Ability = {
  id: 'delta_slash',
  name: 'Power Slash',
  description: 'A strong physical attack.',
  apCost: 2,
  targetType: 'single-enemy',
  guaranteedHit: false,
  effects: {
    damageMultiplier: 1.4,
    damageType: 'physical',
  },
  requiredLevel: 1,
  characterTypes: ['Delta'],
  flavorText: 'Steel meets flesh.',
};

const deltaCleave: Ability = {
  id: 'delta_cleave',
  name: 'Cleave',
  description: 'Attacks all enemies with moderate damage.',
  apCost: 3,
  targetType: 'all-enemies',
  guaranteedHit: false,
  effects: {
    damageMultiplier: 1.0,
    damageType: 'physical',
  },
  requiredLevel: 5,
  characterTypes: ['Delta'],
  flavorText: 'One swing, many foes!',
};

const deltaRend: Ability = {
  id: 'delta_rend',
  name: 'Rending Strike',
  description: 'Deals damage and applies a bleed effect.',
  apCost: 3,
  targetType: 'single-enemy',
  guaranteedHit: false,
  effects: {
    damageMultiplier: 1.3,
    damageType: 'physical',
    statusEffects: [{
      chance: 90,
      effect: {
        id: 'bleed',
        name: 'Bleeding',
        type: 'dot',
        description: 'Taking damage over time',
        duration: 3,
        ticksAtTurnStart: true,
        damagePerTurn: 15,
        stackable: true,
        maxStacks: 3,
      },
    }],
  },
  requiredLevel: 10,
  characterTypes: ['Delta'],
  flavorText: 'Let them bleed!',
};

const deltaRampage: Ability = {
  id: 'delta_rampage',
  name: 'Rampage',
  description: 'Massive single-target damage with bonus on low HP enemies.',
  apCost: 4,
  targetType: 'single-enemy',
  guaranteedHit: false,
  effects: {
    damageMultiplier: 2.2,
    damageType: 'physical',
  },
  requiredLevel: 20,
  characterTypes: ['Delta'],
  flavorText: 'Unstoppable fury!',
};

/**
 * Epsilon (Cleric) Abilities - Healer/Support
 * Focus: Healing, buffs, support
 */

const epsilonHeal: Ability = {
  id: 'epsilon_heal',
  name: 'Healing Light',
  description: 'Restores HP to a single ally.',
  apCost: 2,
  targetType: 'single-ally',
  guaranteedHit: true,
  effects: {
    healingMultiplier: 1.5,
    flatHealing: 25,
  },
  requiredLevel: 1,
  characterTypes: ['Epsilon'],
  flavorText: 'Divine grace flows through you.',
};

const epsilonRegen: Ability = {
  id: 'epsilon_regen',
  name: 'Regeneration',
  description: 'Applies healing over time to an ally.',
  apCost: 2,
  targetType: 'single-ally',
  guaranteedHit: true,
  effects: {
    statusEffects: [{
      chance: 100,
      effect: {
        id: 'regen',
        name: 'Regeneration',
        type: 'hot',
        description: 'Healing over time',
        duration: 3,
        ticksAtTurnStart: true,
        healPerTurn: 20,
        stackable: false,
      },
    }],
  },
  requiredLevel: 5,
  characterTypes: ['Epsilon'],
  flavorText: 'The light shall sustain you.',
};

const epsilonBless: Ability = {
  id: 'epsilon_bless',
  name: 'Divine Blessing',
  description: 'Buffs all allies with increased stats.',
  apCost: 3,
  targetType: 'all-allies',
  guaranteedHit: true,
  effects: {
    statusEffects: [{
      chance: 100,
      effect: {
        id: 'divine_blessing',
        name: 'Divine Blessing',
        type: 'buff',
        description: 'All stats increased',
        duration: 3,
        ticksAtTurnStart: false,
        statModifiers: [
          { stat: 'atk', value: 10 },
          { stat: 'def', value: 10 },
          { stat: 'mag', value: 10 },
          { stat: 'res', value: 10 },
        ],
        stackable: false,
      },
    }],
  },
  requiredLevel: 10,
  characterTypes: ['Epsilon'],
  flavorText: 'May the divine protect you all.',
};

const epsilonResurrection: Ability = {
  id: 'epsilon_resurrection',
  name: 'Mass Healing',
  description: 'Heals all allies for a large amount.',
  apCost: 4,
  targetType: 'all-allies',
  guaranteedHit: true,
  effects: {
    healingMultiplier: 1.2,
    flatHealing: 40,
  },
  requiredLevel: 20,
  characterTypes: ['Epsilon'],
  flavorText: 'None shall fall while I stand!',
};

/**
 * Zeta (Berserker) Abilities - High Risk/Reward
 * Focus: Massive damage, self-harm, lifesteal
 */

const zetaRage: Ability = {
  id: 'zeta_rage',
  name: 'Furious Strike',
  description: 'Powerful attack that deals damage to self.',
  apCost: 2,
  targetType: 'single-enemy',
  guaranteedHit: false,
  effects: {
    damageMultiplier: 1.8,
    damageType: 'physical',
  },
  requiredLevel: 1,
  characterTypes: ['Zeta'],
  flavorText: 'Pain is strength!',
};

const zetaBloodlust: Ability = {
  id: 'zeta_bloodlust',
  name: 'Bloodlust',
  description: 'Increase ATK and CRT but take more damage.',
  apCost: 2,
  targetType: 'self',
  guaranteedHit: true,
  effects: {
    statusEffects: [
      {
        chance: 100,
        effect: {
          id: 'bloodlust_buff',
          name: 'Bloodlust',
          type: 'buff',
          description: 'Increased ATK and CRT, decreased DEF',
          duration: 3,
          ticksAtTurnStart: false,
          statModifiers: [
            { stat: 'atk', value: 30 },
            { stat: 'crt', value: 20 },
            { stat: 'def', value: -20 },
          ],
          stackable: false,
        },
      },
    ],
  },
  requiredLevel: 5,
  characterTypes: ['Zeta'],
  flavorText: 'Blood for blood!',
};

const zetaDevour: Ability = {
  id: 'zeta_devour',
  name: 'Devouring Strike',
  description: 'Deals damage and heals for a percentage of damage dealt.',
  apCost: 3,
  targetType: 'single-enemy',
  guaranteedHit: false,
  effects: {
    damageMultiplier: 1.6,
    damageType: 'physical',
    lifesteal: 50, // 50% lifesteal
  },
  requiredLevel: 10,
  characterTypes: ['Zeta'],
  flavorText: 'Your pain fuels me!',
};

const zetaBerserk: Ability = {
  id: 'zeta_berserk',
  name: 'Berserk',
  description: 'Deals massive damage but costs HP. The lower your HP, the more damage.',
  apCost: 4,
  targetType: 'single-enemy',
  guaranteedHit: true,
  effects: {
    damageMultiplier: 3.0,
    damageType: 'physical',
  },
  requiredLevel: 20,
  characterTypes: ['Zeta'],
  flavorText: 'I AM RAGE INCARNATE!',
};

/**
 * Ability Registry
 * All abilities indexed by ID for easy lookup
 */
export const ABILITIES: Record<string, Ability> = {
  // Alpha abilities
  alpha_strike: alphaStrike,
  alpha_defend: alphaDefend,
  alpha_smite: alphaSmite,
  alpha_aura: alphaAura,
  
  // Beta abilities
  beta_slash: betaSlash,
  beta_backstab: betaBackstab,
  beta_smokescreen: betaSmokescreen,
  beta_execute: betaExecute,
  
  // Gamma abilities
  gamma_bolt: gammaBolt,
  gamma_fireball: gammaFireball,
  gamma_freeze: gammaFreeze,
  gamma_meteor: gammaMeteor,
  
  // Delta abilities
  delta_slash: deltaSlash,
  delta_cleave: deltaCleave,
  delta_rend: deltaRend,
  delta_rampage: deltaRampage,
  
  // Epsilon abilities
  epsilon_heal: epsilonHeal,
  epsilon_regen: epsilonRegen,
  epsilon_bless: epsilonBless,
  epsilon_resurrection: epsilonResurrection,
  
  // Zeta abilities
  zeta_rage: zetaRage,
  zeta_bloodlust: zetaBloodlust,
  zeta_devour: zetaDevour,
  zeta_berserk: zetaBerserk,
};

/**
 * Get ability by ID
 */
export function getAbility(abilityId: string): Ability | undefined {
  return ABILITIES[abilityId];
}

/**
 * Get all abilities for a character type
 */
export function getAbilitiesForCharacterType(characterType: string): Ability[] {
  return Object.values(ABILITIES).filter(ability => 
    ability.characterTypes?.includes(characterType)
  );
}
