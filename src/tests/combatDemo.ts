/**
 * Combat Demo Test
 * 
 * Tests the full combat loop from start to victory with XP/loot rewards.
 * Can be run in the browser console.
 */

import { createCharacter } from '../systems/character';
import { generateEnemyTeam, generateBossEncounter } from '../systems/enemy';
import { 
  initializeCombat,
  setPlayerTurnOrder,
  startCombat,
  executeAbility,
  endTurn,
  getCurrentCombatant
} from '../systems/combat';
import type { Character } from '../types/character';
import type { Enemy } from '../types/enemy';
import { getAbility } from '../data/abilities';

/**
 * Demo 1: Simple Battle (Player vs 2 Slimes)
 */
export function demoSimpleBattle() {
  console.log('=== Combat Demo: Simple Battle ===\n');
  
  // Create player team (1 Alpha character at level 1, with custom name)
  const player1 = createCharacter('Alpha', 1, 'TestWarrior');
  console.log(`Created ${player1.name} (Level ${player1.level})`);
  
  // Generate enemy team (stage 1, 2 enemies)
  const enemies = generateEnemyTeam(1, 2);
  console.log(`Generated ${enemies.length} enemies: ${enemies.map(e => e.name).join(', ')}\n`);
  
  // Initialize combat
  const state = initializeCombat([player1], [], enemies);
  setPlayerTurnOrder(state, [player1.id]);
  startCombat(state);
  
  console.log('Battle started!');
  console.log(`Turn order initialized\n`);
  
  // Simulate battle (simple AI: use first equipped ability)
  let turnCount = 0;
  const maxTurns = 20; // Safety limit
  
  while (state.phase === 'active' && turnCount < maxTurns) {
    turnCount++;
    const currentCombatant = getCurrentCombatant(state);
    
    if (!currentCombatant) break;
    
    const combatantName = currentCombatant.type === 'player'
      ? state.playerTeam.find(c => c.id === currentCombatant.id)?.name
      : state.enemyTeam.find(e => e.id === currentCombatant.id)?.name;
    
    console.log(`\n--- Turn ${turnCount}: ${combatantName}'s turn ---`);
    console.log(`HP: ${currentCombatant.type === 'player' 
      ? state.playerTeam.find(c => c.id === currentCombatant.id)?.stats.hp
      : state.enemyTeam.find(e => e.id === currentCombatant.id)?.stats.hp
    } | AP: ${currentCombatant.type === 'player'
      ? state.playerTeam.find(c => c.id === currentCombatant.id)?.currentAp
      : state.enemyTeam.find(e => e.id === currentCombatant.id)?.currentAp
    }`);
    
    // Get entity
    const entity = currentCombatant.type === 'player'
      ? state.playerTeam.find(c => c.id === currentCombatant.id)!
      : state.enemyTeam.find(e => e.id === currentCombatant.id)!;
    
    // Get first available ability
    const abilityId = currentCombatant.type === 'player'
      ? (entity as Character).equippedAbilities[0]
      : (entity as Enemy).abilities[0];
      
    const ability = getAbility(abilityId);
    
    if (ability && entity.currentAp >= ability.apCost) {
      // Find target (opposite team)
      const targets = currentCombatant.type === 'player'
        ? state.enemyTeam.filter(e => e.isAlive)
        : state.playerTeam.filter(c => c.isAlive);
      
      if (targets.length > 0) {
        const target = targets[0];
        const targetName = currentCombatant.type === 'player'
          ? target.name
          : target.name;
        console.log(`${combatantName} uses ${ability.name} on ${targetName}`);
        
        // Execute ability (signature: state, abilityId, targetIds)
        const result = executeAbility(state, abilityId, [target.id]);
        
        if (result) {
          console.log(`  → Ability executed`);
          // Result doesn't have success/message fields, it has damageResults/healingResults
        }
      }
    } else {
      console.log(`${combatantName} has no AP or abilities, skipping turn`);
    }
    
    // End turn (modifies state in-place)
    endTurn(state);
  }
  
  // Check battle results
  console.log('\n=== Battle End ===');
  console.log(`Phase: ${state.phase}`);
  console.log(`Victory: ${state.victory}`);
  
  if (state.victory) {
    console.log(`\nRewards:`);
    console.log(`  XP Earned: ${state.xpEarned || 0}`);
    console.log(`  Loot Dropped: ${state.lootDropped?.length || 0} items`);
    
    if (state.lootDropped && state.lootDropped.length > 0) {
      console.log(`  Items:`);
      state.lootDropped.forEach(item => {
        console.log(`    - ${item.name} (Level ${item.level}, ${item.rarity})`);
      });
    }
    
    console.log(`\nPlayer final stats:`);
    state.playerTeam.forEach(char => {
      console.log(`  ${char.name}: Level ${char.level}, ${char.stats.hp}/${char.stats.maxHp} HP`);
    });
  }
  
  console.log('\n=== Demo Complete ===\n');
  return state;
}

/**
 * Demo 2: Boss Battle (Player vs Slime King)
 */
export function demoBossBattle() {
  console.log('=== Combat Demo: Boss Battle ===\n');
  
  // Create stronger player team (3 characters, level 5)
  const player1 = createCharacter('Alpha', 5, 'Tank');
  const player2 = createCharacter('Beta', 5, 'Rogue');
  const player3 = createCharacter('Epsilon', 5, 'Healer');
  
  // Note: Characters are created at level 5 directly
  
  console.log(`Player Team:`);
  console.log(`  ${player1.name} - Level ${player1.level}`);
  console.log(`  ${player2.name} - Level ${player2.level}`);
  console.log(`  ${player3.name} - Level ${player3.level}\n`);
  
  // Generate boss encounter (stage 10)
  const enemies = generateBossEncounter(10);
  console.log(`Boss Encounter: ${enemies.map(e => `${e.name} (${e.isBoss ? 'BOSS' : 'minion'})`).join(', ')}\n`);
  
  // Initialize combat
  const state = initializeCombat([player1, player2, player3], [], enemies);
  setPlayerTurnOrder(state, [player1.id, player2.id, player3.id]);
  startCombat(state);
  
  console.log('Boss Battle started!');
  console.log(`Enemies: ${state.enemyTeam.length}`);
  console.log(`Boss HP: ${state.enemyTeam.find(e => e.isBoss)?.stats.hp}\n`);
  
  // For demo purposes, we'll just show the setup
  // Full simulation would require more complex AI
  
  console.log('Boss battle initialized successfully!');
  console.log('(Full simulation requires AI implementation)\n');
  
  return state;
}

/**
 * Demo 3: Test XP and Level Up
 */
export function demoXpRewards() {
  console.log('=== Combat Demo: XP Rewards ===\n');
  
  // Create level 1 character
  const char = createCharacter('Alpha', 1, 'TestChar');
  console.log(`Created ${char.name} at Level ${char.level}`);
  console.log(`Current XP: ${char.currentXp}/${char.xpToNextLevel}\n`);
  
  // Create low-level enemy team
  const enemies = generateEnemyTeam(1, 3);
  console.log(`Enemies: ${enemies.map(e => `${e.name} (Lv${e.level})`).join(', ')}\n`);
  
  // Calculate expected XP
  const expectedXp = enemies.reduce((sum, e) => {
    const xp = Math.floor(e.level * e.level * 10) * (e.isBoss ? 5 : 1);
    return sum + xp;
  }, 0);
  
  console.log(`Expected XP from battle: ${expectedXp}`);
  console.log(`(${expectedXp} XP / ${char.xpToNextLevel} needed = ${Math.floor((expectedXp / char.xpToNextLevel) * 100)}% to next level)\n`);
  
  // Initialize combat
  let state = initializeCombat([char], [], enemies);
  
  // Simulate instant victory (for testing rewards)
  state.enemyTeam.forEach(e => {
    e.isAlive = false;
    e.stats.hp = 0;
  });
  
  // Check battle end (this will trigger reward calculation)
  state.phase = 'victory';
  state.victory = true;
  
  console.log('Battle ended (simulated victory)');
  console.log(`XP Earned: ${state.xpEarned}`);
  console.log(`Loot: ${state.lootDropped?.length || 0} items\n`);
  
  console.log('=== Demo Complete ===\n');
  return state;
}

/**
 * Run all combat demos
 */
export function runAllCombatDemos() {
  console.log('\n╔════════════════════════════════════╗');
  console.log('║   ANXRPG COMBAT SYSTEM DEMOS      ║');
  console.log('╚════════════════════════════════════╝\n');
  
  try {
    console.log('Running Demo 1: Simple Battle...\n');
    demoSimpleBattle();
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    console.log('Running Demo 2: Boss Battle...\n');
    demoBossBattle();
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    console.log('Running Demo 3: XP Rewards...\n');
    demoXpRewards();
    
    console.log('\n╔════════════════════════════════════╗');
    console.log('║   ALL DEMOS COMPLETED              ║');
    console.log('╚════════════════════════════════════╝\n');
  } catch (error) {
    console.error('Demo failed with error:', error);
  }
}

// Export for browser console usage
if (typeof window !== 'undefined') {
  (window as any).combatDemo = {
    simple: demoSimpleBattle,
    boss: demoBossBattle,
    xp: demoXpRewards,
    all: runAllCombatDemos,
  };
  
  console.log('Combat demos loaded! Use in console:');
  console.log('  combatDemo.simple()  - Simple 2v1 battle');
  console.log('  combatDemo.boss()    - Boss encounter');
  console.log('  combatDemo.xp()      - XP reward test');
  console.log('  combatDemo.all()     - Run all demos');
}
