/**
 * Status Effect Templates
 * 
 * Predefined common status effects used by abilities
 * These can be cloned and customized when applying to characters
 */

import type { StatusEffect } from '../types/status';

/**
 * Clone a status effect template for application
 */
export function cloneStatusEffect(effect: StatusEffect): StatusEffect {
  return {
    ...effect,
    statModifiers: effect.statModifiers ? [...effect.statModifiers] : undefined,
  };
}

// ============================================================================
// BUFF EFFECTS (Positive stat modifiers)
// ============================================================================

export const ATTACK_BUFF: StatusEffect = {
  id: 'buff_attack',
  name: 'Attack Up',
  type: 'buff',
  description: 'Increased attack power',
  duration: 3,
  ticksAtTurnStart: false,
  stackable: false,
  statModifiers: [
    {
      stat: 'atk',
      value: 20,
      multiplier: 1.25,
    },
  ],
};

export const DEFENSE_BUFF: StatusEffect = {
  id: 'buff_defense',
  name: 'Defense Up',
  type: 'buff',
  description: 'Increased defense',
  duration: 3,
  ticksAtTurnStart: false,
  stackable: false,
  statModifiers: [
    {
      stat: 'def',
      value: 20,
      multiplier: 1.25,
    },
  ],
};

export const MAGIC_BUFF: StatusEffect = {
  id: 'buff_magic',
  name: 'Magic Up',
  type: 'buff',
  description: 'Increased magic power',
  duration: 3,
  ticksAtTurnStart: false,
  stackable: false,
  statModifiers: [
    {
      stat: 'mag',
      value: 20,
      multiplier: 1.25,
    },
  ],
};

export const RESISTANCE_BUFF: StatusEffect = {
  id: 'buff_resistance',
  name: 'Resistance Up',
  type: 'buff',
  description: 'Increased magic resistance',
  duration: 3,
  ticksAtTurnStart: false,
  stackable: false,
  statModifiers: [
    {
      stat: 'res',
      value: 20,
      multiplier: 1.25,
    },
  ],
};

export const SPEED_BUFF: StatusEffect = {
  id: 'buff_speed',
  name: 'Haste',
  type: 'buff',
  description: 'Increased speed',
  duration: 3,
  ticksAtTurnStart: false,
  stackable: false,
  statModifiers: [
    {
      stat: 'spd',
      value: 15,
      multiplier: 1.3,
    },
  ],
};

export const CRITICAL_BUFF: StatusEffect = {
  id: 'buff_critical',
  name: 'Critical Up',
  type: 'buff',
  description: 'Increased critical hit chance',
  duration: 3,
  ticksAtTurnStart: false,
  stackable: false,
  statModifiers: [
    {
      stat: 'crt',
      value: 15,
    },
  ],
};

export const EVASION_BUFF: StatusEffect = {
  id: 'buff_evasion',
  name: 'Evasion Up',
  type: 'buff',
  description: 'Increased evasion chance',
  duration: 3,
  ticksAtTurnStart: false,
  stackable: false,
  statModifiers: [
    {
      stat: 'eva',
      value: 20,
    },
  ],
};

export const ACCURACY_BUFF: StatusEffect = {
  id: 'buff_accuracy',
  name: 'Accuracy Up',
  type: 'buff',
  description: 'Increased hit accuracy',
  duration: 3,
  ticksAtTurnStart: false,
  stackable: false,
  statModifiers: [
    {
      stat: 'acc',
      value: 15,
    },
  ],
};

// ============================================================================
// DEBUFF EFFECTS (Negative stat modifiers)
// ============================================================================

export const ATTACK_DEBUFF: StatusEffect = {
  id: 'debuff_attack',
  name: 'Attack Down',
  type: 'debuff',
  description: 'Decreased attack power',
  duration: 3,
  ticksAtTurnStart: false,
  stackable: false,
  statModifiers: [
    {
      stat: 'atk',
      value: -15,
      multiplier: 0.75,
    },
  ],
};

export const DEFENSE_DEBUFF: StatusEffect = {
  id: 'debuff_defense',
  name: 'Defense Down',
  type: 'debuff',
  description: 'Decreased defense',
  duration: 3,
  ticksAtTurnStart: false,
  stackable: false,
  statModifiers: [
    {
      stat: 'def',
      value: -15,
      multiplier: 0.75,
    },
  ],
};

export const MAGIC_DEBUFF: StatusEffect = {
  id: 'debuff_magic',
  name: 'Magic Down',
  type: 'debuff',
  description: 'Decreased magic power',
  duration: 3,
  ticksAtTurnStart: false,
  stackable: false,
  statModifiers: [
    {
      stat: 'mag',
      value: -15,
      multiplier: 0.75,
    },
  ],
};

export const RESISTANCE_DEBUFF: StatusEffect = {
  id: 'debuff_resistance',
  name: 'Resistance Down',
  type: 'debuff',
  description: 'Decreased magic resistance',
  duration: 3,
  ticksAtTurnStart: false,
  stackable: false,
  statModifiers: [
    {
      stat: 'res',
      value: -15,
      multiplier: 0.75,
    },
  ],
};

export const SPEED_DEBUFF: StatusEffect = {
  id: 'debuff_speed',
  name: 'Slow',
  type: 'debuff',
  description: 'Decreased speed',
  duration: 3,
  ticksAtTurnStart: false,
  stackable: false,
  statModifiers: [
    {
      stat: 'spd',
      value: -15,
      multiplier: 0.7,
    },
  ],
};

// ============================================================================
// DAMAGE OVER TIME (DOT) EFFECTS
// ============================================================================

export const POISON: StatusEffect = {
  id: 'dot_poison',
  name: 'Poison',
  type: 'dot',
  description: 'Taking poison damage each turn',
  duration: 4,
  ticksAtTurnStart: true,
  stackable: true,
  maxStacks: 5,
  damagePerTurn: 10,
};

export const BURN: StatusEffect = {
  id: 'dot_burn',
  name: 'Burn',
  type: 'dot',
  description: 'Taking fire damage each turn',
  duration: 3,
  ticksAtTurnStart: true,
  stackable: true,
  maxStacks: 3,
  damagePerTurn: 15,
};

export const BLEED: StatusEffect = {
  id: 'dot_bleed',
  name: 'Bleed',
  type: 'dot',
  description: 'Taking bleed damage each turn',
  duration: 5,
  ticksAtTurnStart: true,
  stackable: true,
  maxStacks: 5,
  damagePerTurn: 8,
};

export const CURSE: StatusEffect = {
  id: 'dot_curse',
  name: 'Curse',
  type: 'dot',
  description: 'Taking dark damage each turn',
  duration: 6,
  ticksAtTurnStart: true,
  stackable: false,
  damagePerTurn: 12,
};

// ============================================================================
// HEAL OVER TIME (HOT) EFFECTS
// ============================================================================

export const REGENERATION: StatusEffect = {
  id: 'hot_regeneration',
  name: 'Regeneration',
  type: 'hot',
  description: 'Recovering HP each turn',
  duration: 5,
  ticksAtTurnStart: true,
  stackable: true,
  maxStacks: 3,
  healPerTurn: 20,
};

export const BLESSED: StatusEffect = {
  id: 'hot_blessed',
  name: 'Blessed',
  type: 'hot',
  description: 'Receiving divine healing each turn',
  duration: 4,
  ticksAtTurnStart: true,
  stackable: false,
  healPerTurn: 25,
};

// ============================================================================
// CONTROL EFFECTS
// ============================================================================

export const STUN: StatusEffect = {
  id: 'control_stun',
  name: 'Stunned',
  type: 'control',
  description: 'Cannot take any actions',
  duration: 1,
  ticksAtTurnStart: false,
  stackable: false,
  preventActions: true,
};

export const FREEZE: StatusEffect = {
  id: 'control_freeze',
  name: 'Frozen',
  type: 'control',
  description: 'Frozen solid, cannot act',
  duration: 2,
  ticksAtTurnStart: false,
  stackable: false,
  preventActions: true,
};

export const SLEEP: StatusEffect = {
  id: 'control_sleep',
  name: 'Sleep',
  type: 'control',
  description: 'Sleeping, cannot act (breaks on damage)',
  duration: 3,
  ticksAtTurnStart: false,
  stackable: false,
  preventActions: true,
};

export const PETRIFY: StatusEffect = {
  id: 'control_petrify',
  name: 'Petrified',
  type: 'control',
  description: 'Turned to stone, cannot act',
  duration: 2,
  ticksAtTurnStart: false,
  stackable: false,
  preventActions: true,
  statModifiers: [
    {
      stat: 'def',
      value: 50,
      multiplier: 2.0,
    },
  ],
};

// ============================================================================
// SPECIAL COMBINATION EFFECTS
// ============================================================================

export const BLOODLUST_BUFF: StatusEffect = {
  id: 'special_bloodlust',
  name: 'Bloodlust',
  type: 'buff',
  description: 'Increased attack and critical rate, but reduced defense',
  duration: 3,
  ticksAtTurnStart: false,
  stackable: false,
  statModifiers: [
    {
      stat: 'atk',
      value: 30,
      multiplier: 1.5,
    },
    {
      stat: 'crt',
      value: 20,
    },
    {
      stat: 'def',
      value: -20,
      multiplier: 0.7,
    },
  ],
};

export const BERSERK: StatusEffect = {
  id: 'special_berserk',
  name: 'Berserk',
  type: 'buff',
  description: 'Massively increased attack but greatly reduced defense',
  duration: 2,
  ticksAtTurnStart: false,
  stackable: false,
  statModifiers: [
    {
      stat: 'atk',
      value: 50,
      multiplier: 2.0,
    },
    {
      stat: 'def',
      value: -30,
      multiplier: 0.5,
    },
  ],
};

export const DIVINE_BLESSING: StatusEffect = {
  id: 'special_divine_blessing',
  name: 'Divine Blessing',
  type: 'buff',
  description: 'Blessed with increased stats and regeneration',
  duration: 4,
  ticksAtTurnStart: true,
  stackable: false,
  healPerTurn: 15,
  statModifiers: [
    {
      stat: 'atk',
      value: 15,
      multiplier: 1.2,
    },
    {
      stat: 'def',
      value: 15,
      multiplier: 1.2,
    },
    {
      stat: 'res',
      value: 15,
      multiplier: 1.2,
    },
  ],
};

// ============================================================================
// EFFECT COLLECTIONS
// ============================================================================

export const ALL_BUFFS = [
  ATTACK_BUFF,
  DEFENSE_BUFF,
  MAGIC_BUFF,
  RESISTANCE_BUFF,
  SPEED_BUFF,
  CRITICAL_BUFF,
  EVASION_BUFF,
  ACCURACY_BUFF,
];

export const ALL_DEBUFFS = [
  ATTACK_DEBUFF,
  DEFENSE_DEBUFF,
  MAGIC_DEBUFF,
  RESISTANCE_DEBUFF,
  SPEED_DEBUFF,
];

export const ALL_DOTS = [POISON, BURN, BLEED, CURSE];

export const ALL_HOTS = [REGENERATION, BLESSED];

export const ALL_CONTROL_EFFECTS = [STUN, FREEZE, SLEEP, PETRIFY];

export const ALL_SPECIAL_EFFECTS = [BLOODLUST_BUFF, BERSERK, DIVINE_BLESSING];

export const ALL_STATUS_EFFECTS = [
  ...ALL_BUFFS,
  ...ALL_DEBUFFS,
  ...ALL_DOTS,
  ...ALL_HOTS,
  ...ALL_CONTROL_EFFECTS,
  ...ALL_SPECIAL_EFFECTS,
];
