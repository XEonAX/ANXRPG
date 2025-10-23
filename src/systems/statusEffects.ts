/**
 * Status Effects System
 * 
 * Manages all status effects (buffs, debuffs, DOT, HOT, control effects)
 * Handles application, stacking, duration tracking, and effect processing
 */

import type { Character } from '../types/character';
import type { Enemy } from '../types/enemy';
import type { StatusEffect, StatusEffectType } from '../types/status';

// Type for entities that can have status effects
export type CombatEntity = Character | Enemy;

/**
 * Apply a status effect to a character or enemy
 * Handles stacking behavior and duration refresh
 */
export function applyStatusEffect(
  entity: CombatEntity,
  effect: StatusEffect
): { applied: boolean; message: string } {
  // Check if entity already has this effect
  const existingEffectIndex = entity.statusEffects.findIndex(
    e => e.id === effect.id
  );

  if (existingEffectIndex !== -1) {
    const existingEffect = entity.statusEffects[existingEffectIndex];

    // Handle stacking
    if (effect.stackable) {
      const maxStacks = effect.maxStacks || 99;
      const currentStacks = existingEffect.currentStacks || 1;

      if (currentStacks < maxStacks) {
        // Add a new stack
        existingEffect.currentStacks = currentStacks + 1;
        existingEffect.duration = effect.duration; // Refresh duration

        // Update stat modifiers based on stacks
        // Important: effect parameter contains the BASE values (per stack)
        if (effect.statModifiers) {
          existingEffect.statModifiers = effect.statModifiers.map(mod => ({
            stat: mod.stat,
            value: mod.value * existingEffect.currentStacks!,
            multiplier: mod.multiplier,
          }));
        }

        // Update DOT/HOT based on stacks
        if (effect.damagePerTurn) {
          existingEffect.damagePerTurn = effect.damagePerTurn * existingEffect.currentStacks!;
        }
        if (effect.healPerTurn) {
          existingEffect.healPerTurn = effect.healPerTurn * existingEffect.currentStacks!;
        }

        return {
          applied: true,
          message: `${effect.name} stacked on ${entity.name} (${existingEffect.currentStacks} stacks)`,
        };
      } else {
        // Max stacks reached, just refresh duration
        existingEffect.duration = effect.duration;
        return {
          applied: true,
          message: `${effect.name} duration refreshed on ${entity.name} (max stacks)`,
        };
      }
    } else {
      // Not stackable, refresh duration only
      existingEffect.duration = effect.duration;
      return {
        applied: true,
        message: `${effect.name} duration refreshed on ${entity.name}`,
      };
    }
  } else {
    // New effect, add to entity
    const newEffect: StatusEffect = {
      ...effect,
      currentStacks: effect.stackable ? 1 : undefined,
    };

    entity.statusEffects.push(newEffect);

    return {
      applied: true,
      message: `${entity.name} is now affected by ${effect.name}`,
    };
  }
}

/**
 * Remove a specific status effect from a character or enemy
 */
export function removeStatusEffect(
  entity: CombatEntity,
  effectId: string
): { removed: boolean; message: string } {
  const index = entity.statusEffects.findIndex(e => e.id === effectId);

  if (index !== -1) {
    const effect = entity.statusEffects[index];
    entity.statusEffects.splice(index, 1);

    return {
      removed: true,
      message: `${effect.name} removed from ${entity.name}`,
    };
  }

  return {
    removed: false,
    message: `Effect not found on ${entity.name}`,
  };
}

/**
 * Remove all status effects from a character
 */
export function clearAllStatusEffects(entity: CombatEntity): void {
  entity.statusEffects = [];
}

/**
 * Remove all status effects of a specific type from a character
 */
export function clearStatusEffectsByType(
  entity: CombatEntity,
  type: StatusEffectType
): number {
  const initialCount = entity.statusEffects.length;
  entity.statusEffects = entity.statusEffects.filter(e => e.type !== type);
  return initialCount - entity.statusEffects.length;
}

/**
 * Process status effect ticks for a character
 * Handles DOT/HOT damage/healing and duration countdown
 * Call this at the start or end of a turn based on effect settings
 */
export function processStatusEffectTicks(
  entity: CombatEntity,
  atTurnStart: boolean
): {
  damage: number;
  healing: number;
  messages: string[];
} {
  let totalDamage = 0;
  let totalHealing = 0;
  const messages: string[] = [];

  // Process effects that tick at the specified time
  const effectsToProcess = entity.statusEffects.filter(
    e => e.ticksAtTurnStart === atTurnStart
  );

  for (const effect of effectsToProcess) {
    // Apply DOT damage
    if (effect.damagePerTurn && effect.damagePerTurn > 0) {
      const damage = Math.floor(effect.damagePerTurn);
      totalDamage += damage;
      messages.push(
        `${entity.name} takes ${damage} damage from ${effect.name}`
      );
    }

    // Apply HOT healing
    if (effect.healPerTurn && effect.healPerTurn > 0) {
      const healing = Math.floor(effect.healPerTurn);
      totalHealing += healing;
      messages.push(
        `${entity.name} recovers ${healing} HP from ${effect.name}`
      );
    }
  }

  return {
    damage: totalDamage,
    healing: totalHealing,
    messages,
  };
}

/**
 * Decrement duration counters for all status effects
 * Remove expired effects
 * Call this at the end of each turn
 */
export function decrementStatusEffectDurations(
  entity: CombatEntity
): string[] {
  const expiredMessages: string[] = [];

  // Decrement durations
  for (const effect of entity.statusEffects) {
    effect.duration--;
  }

  // Remove expired effects
  const expiredEffects = entity.statusEffects.filter(e => e.duration <= 0);
  entity.statusEffects = entity.statusEffects.filter(e => e.duration > 0);

  // Generate expiration messages
  for (const effect of expiredEffects) {
    expiredMessages.push(`${effect.name} expired on ${entity.name}`);
  }

  return expiredMessages;
}

/**
 * Check if character has a specific status effect
 */
export function hasStatusEffect(
  entity: CombatEntity,
  effectId: string
): boolean {
  return entity.statusEffects.some(e => e.id === effectId);
}

/**
 * Check if character has any status effect of a specific type
 */
export function hasStatusEffectType(
  entity: CombatEntity,
  type: StatusEffectType
): boolean {
  return entity.statusEffects.some(e => e.type === type);
}

/**
 * Get a specific status effect from a character
 */
export function getStatusEffect(
  entity: CombatEntity,
  effectId: string
): StatusEffect | undefined {
  return entity.statusEffects.find(e => e.id === effectId);
}

/**
 * Get all status effects of a specific type
 */
export function getStatusEffectsByType(
  entity: CombatEntity,
  type: StatusEffectType
): StatusEffect[] {
  return entity.statusEffects.filter(e => e.type === type);
}

/**
 * Get the number of stacks for a specific status effect
 */
export function getEffectStacks(
  entity: CombatEntity,
  effectId: string
): number {
  const effect = getStatusEffect(entity, effectId);
  return effect?.currentStacks || 0;
}

/**
 * Check if character is under any control effect (stun, freeze, etc.)
 */
export function isUnderControlEffect(entity: CombatEntity): boolean {
  return entity.statusEffects.some(
    e => e.type === 'control' && e.preventActions
  );
}

/**
 * Get all active control effects preventing actions
 */
export function getActiveControlEffects(entity: CombatEntity): StatusEffect[] {
  return entity.statusEffects.filter(
    e => e.type === 'control' && e.preventActions
  );
}

/**
 * Calculate total stat modifiers from all status effects
 * Returns flat bonuses and multiplicative modifiers
 */
export function calculateStatusEffectStatModifiers(entity: CombatEntity): {
  flatModifiers: Record<string, number>;
  multipliers: Record<string, number>;
} {
  const flatModifiers: Record<string, number> = {};
  const multipliers: Record<string, number> = {};

  for (const effect of entity.statusEffects) {
    if (effect.statModifiers) {
      for (const modifier of effect.statModifiers) {
        const stat = modifier.stat;

        // Add flat bonuses
        if (modifier.value) {
          flatModifiers[stat] = (flatModifiers[stat] || 0) + modifier.value;
        }

        // Multiply multiplicative modifiers
        if (modifier.multiplier) {
          multipliers[stat] = (multipliers[stat] || 1.0) * modifier.multiplier;
        }
      }
    }
  }

  return { flatModifiers, multipliers };
}

/**
 * Get a summary of all active status effects on a character
 */
export function getStatusEffectsSummary(entity: CombatEntity): string[] {
  return entity.statusEffects.map(effect => {
    let summary = `${effect.name} (${effect.duration} turns)`;
    if (effect.currentStacks && effect.currentStacks > 1) {
      summary += ` x${effect.currentStacks}`;
    }
    return summary;
  });
}

/**
 * Remove expired status effects (duration <= 0)
 * This is a utility function that can be called manually
 */
export function removeExpiredEffects(entity: CombatEntity): number {
  const initialCount = entity.statusEffects.length;
  entity.statusEffects = entity.statusEffects.filter(e => e.duration > 0);
  return initialCount - entity.statusEffects.length;
}

/**
 * Reduce stacks of a specific status effect
 * Removes the effect entirely if stacks reach 0
 */
export function reduceEffectStacks(
  entity: CombatEntity,
  effectId: string,
  amount: number = 1
): { removed: boolean; remainingStacks: number; message: string } {
  const effect = getStatusEffect(entity, effectId);

  if (!effect) {
    return {
      removed: false,
      remainingStacks: 0,
      message: `Effect ${effectId} not found on ${entity.name}`,
    };
  }

  if (!effect.stackable || !effect.currentStacks) {
    // Not a stackable effect, remove it entirely
    removeStatusEffect(entity, effectId);
    return {
      removed: true,
      remainingStacks: 0,
      message: `${effect.name} removed from ${entity.name}`,
    };
  }

  const newStacks = Math.max(0, effect.currentStacks - amount);

  if (newStacks === 0) {
    // All stacks consumed, remove effect
    removeStatusEffect(entity, effectId);
    return {
      removed: true,
      remainingStacks: 0,
      message: `${effect.name} removed from ${entity.name} (all stacks consumed)`,
    };
  } else {
    // Update stacks
    effect.currentStacks = newStacks;

    // Update stat modifiers based on new stack count
    if (effect.statModifiers) {
      const baseEffect = { ...effect, currentStacks: 1 };
      effect.statModifiers = baseEffect.statModifiers!.map(mod => ({
        ...mod,
        value: mod.value * newStacks,
      }));
    }

    // Update DOT/HOT based on new stack count
    const baseEffect = { ...effect, currentStacks: 1 };
    if (baseEffect.damagePerTurn) {
      effect.damagePerTurn = baseEffect.damagePerTurn * newStacks;
    }
    if (baseEffect.healPerTurn) {
      effect.healPerTurn = baseEffect.healPerTurn * newStacks;
    }

    return {
      removed: false,
      remainingStacks: newStacks,
      message: `${effect.name} reduced to ${newStacks} stacks on ${entity.name}`,
    };
  }
}
