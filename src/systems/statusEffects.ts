/**
 * Status Effects System
 * 
 * Manages all status effects (buffs, debuffs, DOT, HOT, control effects)
 * Handles application, stacking, duration tracking, and effect processing
 */

import type { Character } from '../types/character';
import type { StatusEffect, StatusEffectType } from '../types/status';

/**
 * Apply a status effect to a character
 * Handles stacking behavior and duration refresh
 */
export function applyStatusEffect(
  character: Character,
  effect: StatusEffect
): { applied: boolean; message: string } {
  // Check if character already has this effect
  const existingEffectIndex = character.statusEffects.findIndex(
    e => e.id === effect.id
  );

  if (existingEffectIndex !== -1) {
    const existingEffect = character.statusEffects[existingEffectIndex];

    // Handle stacking
    if (effect.stackable) {
      const maxStacks = effect.maxStacks || 99;
      const currentStacks = existingEffect.currentStacks || 1;

      if (currentStacks < maxStacks) {
        // Add a new stack
        existingEffect.currentStacks = currentStacks + 1;
        existingEffect.duration = effect.duration; // Refresh duration

        // Update stat modifiers based on stacks
        if (effect.statModifiers) {
          existingEffect.statModifiers = effect.statModifiers.map(mod => ({
            ...mod,
            value: mod.value * existingEffect.currentStacks!,
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
          message: `${effect.name} stacked on ${character.name} (${existingEffect.currentStacks} stacks)`,
        };
      } else {
        // Max stacks reached, just refresh duration
        existingEffect.duration = effect.duration;
        return {
          applied: true,
          message: `${effect.name} duration refreshed on ${character.name} (max stacks)`,
        };
      }
    } else {
      // Not stackable, refresh duration only
      existingEffect.duration = effect.duration;
      return {
        applied: true,
        message: `${effect.name} duration refreshed on ${character.name}`,
      };
    }
  } else {
    // New effect, add to character
    const newEffect: StatusEffect = {
      ...effect,
      currentStacks: effect.stackable ? 1 : undefined,
    };

    character.statusEffects.push(newEffect);

    return {
      applied: true,
      message: `${character.name} is now affected by ${effect.name}`,
    };
  }
}

/**
 * Remove a specific status effect from a character
 */
export function removeStatusEffect(
  character: Character,
  effectId: string
): { removed: boolean; message: string } {
  const index = character.statusEffects.findIndex(e => e.id === effectId);

  if (index !== -1) {
    const effect = character.statusEffects[index];
    character.statusEffects.splice(index, 1);

    return {
      removed: true,
      message: `${effect.name} removed from ${character.name}`,
    };
  }

  return {
    removed: false,
    message: `Effect not found on ${character.name}`,
  };
}

/**
 * Remove all status effects from a character
 */
export function clearAllStatusEffects(character: Character): void {
  character.statusEffects = [];
}

/**
 * Remove all status effects of a specific type from a character
 */
export function clearStatusEffectsByType(
  character: Character,
  type: StatusEffectType
): number {
  const initialCount = character.statusEffects.length;
  character.statusEffects = character.statusEffects.filter(e => e.type !== type);
  return initialCount - character.statusEffects.length;
}

/**
 * Process status effect ticks for a character
 * Handles DOT/HOT damage/healing and duration countdown
 * Call this at the start or end of a turn based on effect settings
 */
export function processStatusEffectTicks(
  character: Character,
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
  const effectsToProcess = character.statusEffects.filter(
    e => e.ticksAtTurnStart === atTurnStart
  );

  for (const effect of effectsToProcess) {
    // Apply DOT damage
    if (effect.damagePerTurn && effect.damagePerTurn > 0) {
      const damage = Math.floor(effect.damagePerTurn);
      totalDamage += damage;
      messages.push(
        `${character.name} takes ${damage} damage from ${effect.name}`
      );
    }

    // Apply HOT healing
    if (effect.healPerTurn && effect.healPerTurn > 0) {
      const healing = Math.floor(effect.healPerTurn);
      totalHealing += healing;
      messages.push(
        `${character.name} recovers ${healing} HP from ${effect.name}`
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
  character: Character
): string[] {
  const expiredMessages: string[] = [];

  // Decrement durations
  for (const effect of character.statusEffects) {
    effect.duration--;
  }

  // Remove expired effects
  const expiredEffects = character.statusEffects.filter(e => e.duration <= 0);
  character.statusEffects = character.statusEffects.filter(e => e.duration > 0);

  // Generate expiration messages
  for (const effect of expiredEffects) {
    expiredMessages.push(`${effect.name} expired on ${character.name}`);
  }

  return expiredMessages;
}

/**
 * Check if character has a specific status effect
 */
export function hasStatusEffect(
  character: Character,
  effectId: string
): boolean {
  return character.statusEffects.some(e => e.id === effectId);
}

/**
 * Check if character has any status effect of a specific type
 */
export function hasStatusEffectType(
  character: Character,
  type: StatusEffectType
): boolean {
  return character.statusEffects.some(e => e.type === type);
}

/**
 * Get a specific status effect from a character
 */
export function getStatusEffect(
  character: Character,
  effectId: string
): StatusEffect | undefined {
  return character.statusEffects.find(e => e.id === effectId);
}

/**
 * Get all status effects of a specific type
 */
export function getStatusEffectsByType(
  character: Character,
  type: StatusEffectType
): StatusEffect[] {
  return character.statusEffects.filter(e => e.type === type);
}

/**
 * Get the number of stacks for a specific status effect
 */
export function getEffectStacks(
  character: Character,
  effectId: string
): number {
  const effect = getStatusEffect(character, effectId);
  return effect?.currentStacks || 0;
}

/**
 * Check if character is under any control effect (stun, freeze, etc.)
 */
export function isUnderControlEffect(character: Character): boolean {
  return character.statusEffects.some(
    e => e.type === 'control' && e.preventActions
  );
}

/**
 * Get all active control effects preventing actions
 */
export function getActiveControlEffects(character: Character): StatusEffect[] {
  return character.statusEffects.filter(
    e => e.type === 'control' && e.preventActions
  );
}

/**
 * Calculate total stat modifiers from all status effects
 * Returns flat bonuses and multiplicative modifiers
 */
export function calculateStatusEffectStatModifiers(character: Character): {
  flatModifiers: Record<string, number>;
  multipliers: Record<string, number>;
} {
  const flatModifiers: Record<string, number> = {};
  const multipliers: Record<string, number> = {};

  for (const effect of character.statusEffects) {
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
export function getStatusEffectsSummary(character: Character): string[] {
  return character.statusEffects.map(effect => {
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
export function removeExpiredEffects(character: Character): number {
  const initialCount = character.statusEffects.length;
  character.statusEffects = character.statusEffects.filter(e => e.duration > 0);
  return initialCount - character.statusEffects.length;
}

/**
 * Reduce stacks of a specific status effect
 * Removes the effect entirely if stacks reach 0
 */
export function reduceEffectStacks(
  character: Character,
  effectId: string,
  amount: number = 1
): { removed: boolean; remainingStacks: number; message: string } {
  const effect = getStatusEffect(character, effectId);

  if (!effect) {
    return {
      removed: false,
      remainingStacks: 0,
      message: `Effect ${effectId} not found on ${character.name}`,
    };
  }

  if (!effect.stackable || !effect.currentStacks) {
    // Not a stackable effect, remove it entirely
    removeStatusEffect(character, effectId);
    return {
      removed: true,
      remainingStacks: 0,
      message: `${effect.name} removed from ${character.name}`,
    };
  }

  const newStacks = Math.max(0, effect.currentStacks - amount);

  if (newStacks === 0) {
    // All stacks consumed, remove effect
    removeStatusEffect(character, effectId);
    return {
      removed: true,
      remainingStacks: 0,
      message: `${effect.name} removed from ${character.name} (all stacks consumed)`,
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
      message: `${effect.name} reduced to ${newStacks} stacks on ${character.name}`,
    };
  }
}
