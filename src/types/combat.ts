/**
 * Combat System Type Definitions
 */

import type { Character } from './character';
import type { Enemy } from './enemy';

export type CombatantType = 'player' | 'enemy';

export interface Combatant {
  id: string;
  type: CombatantType;
  character?: Character;
  enemy?: Enemy;
}

export interface TurnOrder {
  combatants: Combatant[];
  currentIndex: number;
}

export type CombatActionType = 
  | 'ability'
  | 'end-turn'
  | 'swap-team';

export interface CombatAction {
  type: CombatActionType;
  actorId: string;
  abilityId?: string;
  targetIds?: string[];
}

export interface DamageResult {
  targetId: string;
  targetName: string;
  damage: number;
  isCritical: boolean;
  isMiss: boolean;
  damageType: 'physical' | 'magical' | 'true';
  statusEffectsApplied?: string[];  // Status effect names
}

export interface HealingResult {
  targetId: string;
  targetName: string;
  healing: number;
  overheal: number;               // Healing beyond max HP
}

export interface AbilityResult {
  abilityId: string;
  abilityName: string;
  actorId: string;
  actorName: string;
  apCost: number;
  
  damageResults?: DamageResult[];
  healingResults?: HealingResult[];
  
  // Special effects
  apRestored?: number;
  apDrained?: number;
  lifestealHealing?: number;
  
  deaths?: string[];              // IDs of combatants killed
}

export type CombatPhase = 
  | 'setup'           // Team selection, turn order determination
  | 'active'          // Combat in progress
  | 'team-wipe'       // Primary team wiped, offer reserve swap
  | 'victory'
  | 'defeat';

export interface CombatState {
  phase: CombatPhase;
  
  // Teams
  playerTeam: Character[];        // Active team (1-3)
  reserveTeam: Character[];       // Reserve team (up to 3)
  enemyTeam: Enemy[];             // Enemy team (1-3+)
  
  // Turn management
  turnOrder: TurnOrder;
  currentTurn: number;
  roundNumber: number;            // Combat round counter
  playerTurnOrder: string[];      // Player-defined order within team (set once at battle start)
  playerTurnOrderLocked: boolean; // True after first turn order set
  
  // Current action state
  currentActorId?: string;        // Character currently taking actions
  actionsThisTurn: CombatAction[]; // Actions taken in current turn
  turnInProgress: boolean;        // True if character is mid-turn (multi-action)
  
  // Combat log
  combatLog: CombatLogEntry[];
  
  // Results
  victory: boolean;
  xpEarned?: number;
  lootDropped?: string[];         // Equipment IDs
}

export type CombatLogEntryType = 
  | 'turn-start'
  | 'ability-use'
  | 'damage'
  | 'healing'
  | 'status-applied'
  | 'status-expired'
  | 'death'
  | 'summon'
  | 'team-swap'
  | 'victory'
  | 'defeat';

export interface CombatLogEntry {
  type: CombatLogEntryType;
  turn: number;
  timestamp: number;
  message: string;
  
  // Optional structured data for rendering
  actorId?: string;
  targetIds?: string[];
  abilityId?: string;
  statusEffectId?: string;
}
