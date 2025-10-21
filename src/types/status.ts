/**
 * Status Effect System Type Definitions
 */

export type StatusEffectType =
  | 'buff'
  | 'debuff'
  | 'dot'      // Damage over time
  | 'hot'      // Heal over time
  | 'control'  // Stun, freeze, etc.
  | 'regen';   // Resource regeneration

export type StatModifierType =
  | 'hp'
  | 'atk'
  | 'def'
  | 'mag'
  | 'res'
  | 'spd'
  | 'crt'
  | 'eva'
  | 'acc'
  | 'apRegen';

export interface StatusEffect {
  id: string;
  name: string;
  type: StatusEffectType;
  description: string;
  duration: number;           // Turns remaining
  ticksAtTurnStart: boolean;  // True = start of turn, false = end of turn
  
  // Stat modifications
  statModifiers?: {
    stat: StatModifierType;
    value: number;            // Flat bonus/penalty
    multiplier?: number;      // Multiplicative modifier (1.0 = no change)
  }[];
  
  // DOT/HOT effects
  damagePerTurn?: number;
  healPerTurn?: number;
  
  // Control effects
  preventActions?: boolean;   // Stun, freeze
  
  // Stacking behavior
  stackable: boolean;
  maxStacks?: number;
  currentStacks?: number;
  
  // Visual/flavor
  icon?: string;
}
