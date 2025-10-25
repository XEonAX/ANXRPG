/**
 * Console Helper Functions for Manual Playtesting
 * 
 * These functions are available in the browser console to help with manual playtesting.
 * Access via: window.playtest.*
 */

import { 
  initializeNewGame, 
  getCurrentGameState, 
  getRoster,
  incrementStatistic
} from '../systems/game';
import type { CharacterTypeName } from '../types/character';

/**
 * Playtest helper utilities
 */
export const playtestHelpers = {
  /**
   * Quick start a new game with a specific character
   */
  quickStart(characterType: CharacterTypeName = 'Beta', name?: string): void {
    const displayName = name || `Test${characterType}`;
    initializeNewGame(characterType, displayName);
    console.log(`✅ New game started with ${displayName} (${characterType})`);
    console.log('📊 Use playtest.showStats() to view current state');
  },

  /**
   * Show current game statistics
   */
  showStats(): void {
    const state = getCurrentGameState();
    if (!state) {
      console.log('❌ No active game. Use playtest.quickStart() first.');
      return;
    }

    const roster = getRoster();
    const stats = state.saveData.statistics;
    const campaign = state.saveData.campaign;

    console.log('=== GAME STATE ===');
    console.log(`📊 Battles: ${stats.totalVictories}W / ${stats.totalBattles}T (${((stats.totalVictories / stats.totalBattles) * 100).toFixed(1)}% win rate)`);
    console.log(`🎯 Stage Progress: ${campaign.currentStage} / ${campaign.highestStageUnlocked}`);
    console.log(`👥 Roster: ${roster.length} characters`);
    console.log(`⚔️ Damage Dealt: ${stats.totalDamageDealt.toLocaleString()}`);
    console.log(`💚 Healing Done: ${stats.totalHealingDone.toLocaleString()}`);
    console.log(`🎒 Equipment: ${state.saveData.inventory.length} items`);
    
    console.log('\n=== CHARACTERS ===');
    roster.forEach((char, i) => {
      console.log(`${i + 1}. ${char.name} (${char.type}) - Level ${char.level}`);
      console.log(`   HP: ${char.stats.hp}/${char.stats.maxHp}, AP: ${char.currentAp}/10`);
      console.log(`   XP: ${char.currentXp}/${char.xpToNextLevel}`);
    });
  },

  /**
   * Level up a character (cheat for testing)
   */
  levelUp(characterIndex: number = 0, levels: number = 1): void {
    const roster = getRoster();
    if (characterIndex >= roster.length) {
      console.log(`❌ Character ${characterIndex} not found. Use 0-${roster.length - 1}`);
      return;
    }

    const char = roster[characterIndex];
    for (let i = 0; i < levels; i++) {
      char.currentXp += char.xpToNextLevel;
    }

    console.log(`✅ ${char.name} leveled up ${levels} time(s) to level ${char.level}`);
  },

  /**
   * Grant victories (for testing recruitment)
   */
  grantVictories(count: number = 20): void {
    for (let i = 0; i < count; i++) {
      incrementStatistic('totalVictories', 1);
      incrementStatistic('totalBattles', 1);
    }

    const state = getCurrentGameState();
    if (state) {
      console.log(`✅ Granted ${count} victories. Total: ${state.saveData.statistics.totalVictories}`);
      if (state.saveData.statistics.totalVictories % 20 === 0) {
        console.log('🎉 Recruitment available!');
      }
    }
  },

  /**
   * Full HP/AP restore (cheat for testing)
   */
  fullHeal(): void {
    const roster = getRoster();
    roster.forEach(char => {
      char.stats.hp = char.stats.maxHp;
      char.currentAp = 10; // Max AP is always 10
    });
    console.log('✅ All characters fully healed!');
  },

  /**
   * Show all available helper functions
   */
  help(): void {
    console.log('=== PLAYTEST HELPERS ===\n');
    console.log('playtest.quickStart(type?, name?)  - Start new game');
    console.log('  Types: Alpha, Beta, Gamma, Delta, Epsilon, Zeta');
    console.log('  Example: playtest.quickStart("Beta", "TestChar")');
    console.log('');
    console.log('playtest.showStats()                - Show game state');
    console.log('playtest.levelUp(index?, levels?)   - Level up character');
    console.log('  Example: playtest.levelUp(0, 10)  - Level up 1st char by 10');
    console.log('');
    console.log('playtest.grantVictories(count?)     - Add victories (for recruitment)');
    console.log('  Example: playtest.grantVictories(20)');
    console.log('');
    console.log('playtest.fullHeal()                 - Restore all HP/AP');
    console.log('playtest.help()                     - Show this help');
  }
};

// Expose to window for console access
if (typeof window !== 'undefined') {
  (window as any).playtest = playtestHelpers;
  console.log('✅ Playtest helpers loaded! Type playtest.help() for commands.');
}
