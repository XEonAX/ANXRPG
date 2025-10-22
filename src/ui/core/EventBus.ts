/**
 * Event Bus - Simple pub/sub system for UI events
 * Decouples components and enables reactive updates
 */

type EventCallback = (...args: any[]) => void;

/**
 * Global event bus for application-wide events
 */
class EventBusClass {
  private listeners = new Map<string, EventCallback[]>();

  /**
   * Subscribe to an event
   * @param event - Event name
   * @param callback - Function to call when event is emitted
   * @returns Unsubscribe function
   */
  on(event: string, callback: EventCallback): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }

    this.listeners.get(event)!.push(callback);

    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  /**
   * Unsubscribe from an event
   */
  off(event: string, callback: EventCallback): void {
    const callbacks = this.listeners.get(event);
    if (!callbacks) return;

    const index = callbacks.indexOf(callback);
    if (index !== -1) {
      callbacks.splice(index, 1);
    }
  }

  /**
   * Emit an event
   */
  emit(event: string, ...args: any[]): void {
    const callbacks = this.listeners.get(event);
    if (!callbacks) return;

    callbacks.forEach(callback => {
      try {
        callback(...args);
      } catch (error) {
        console.error(`Error in event listener for '${event}':`, error);
      }
    });
  }

  /**
   * Subscribe to an event only once
   */
  once(event: string, callback: EventCallback): void {
    const wrappedCallback = (...args: any[]) => {
      callback(...args);
      this.off(event, wrappedCallback);
    };

    this.on(event, wrappedCallback);
  }

  /**
   * Clear all listeners for an event
   */
  clearEvent(event: string): void {
    this.listeners.delete(event);
  }

  /**
   * Clear all listeners
   */
  clearAll(): void {
    this.listeners.clear();
  }
}

// Singleton instance
export const EventBus = new EventBusClass();

/**
 * Common game events
 */
export const GameEvents = {
  // Game state
  GAME_LOADED: 'game:loaded',
  GAME_SAVED: 'game:saved',
  GAME_RESET: 'game:reset',

  // Combat
  COMBAT_START: 'combat:start',
  COMBAT_END: 'combat:end',
  TURN_START: 'turn:start',
  TURN_END: 'turn:end',
  ABILITY_USED: 'ability:used',
  DAMAGE_DEALT: 'damage:dealt',
  HEALING_DONE: 'healing:done',

  // Character
  CHARACTER_LEVEL_UP: 'character:levelUp',
  CHARACTER_RECRUITED: 'character:recruited',
  SKILL_UNLOCKED: 'skill:unlocked',
  EQUIPMENT_CHANGED: 'equipment:changed',

  // Campaign
  STAGE_UNLOCKED: 'stage:unlocked',
  STAGE_COMPLETED: 'stage:completed',

  // UI
  SCREEN_CHANGE: 'screen:change',
  NOTIFICATION_SHOW: 'notification:show',
  MODAL_OPEN: 'modal:open',
  MODAL_CLOSE: 'modal:close'
} as const;
