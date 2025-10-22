/**
 * ANXRPG - Main Entry Point
 * Phase 11: UI Implementation
 */

import './style.css';
import { ScreenManager } from './ui/core/ScreenManager';
import { EventBus, GameEvents } from './ui/core/EventBus';
import { renderMainMenu } from './ui/MainMenuScreen';
import { renderTeamManagement } from './ui/TeamManagementScreen';
import { renderCampaignMap } from './ui/CampaignMapScreen';
import { renderCombat } from './ui/CombatScreen';
import { renderBattleResults } from './ui/BattleResultsScreen';
import { renderCharacterSheet } from './ui/CharacterSheetScreen';
import { renderInventory } from './ui/InventoryScreen';
import { renderSettings } from './ui/SettingsScreen';

// Development: Make test functions available in console
import {
  demoSimpleBattle,
  demoBossBattle,
  demoXpRewards,
  runAllCombatDemos
} from './tests/combatDemo';
import { phase8Tests } from './tests/phase8Tests';
import { CHARACTER_TYPES } from './data/characterTypes';
import { ABILITIES } from './data/abilities';

console.log('╔════════════════════════════════════════╗');
console.log('║      ANXRPG - Production Build        ║');
console.log('║        Phase 11: UI Complete!         ║');
console.log('╚════════════════════════════════════════╝');
console.log('\n📊 System Status:');
console.log('✅ Phase 1-10: All Core Systems Complete (71%)');
console.log('🎨 Phase 11: UI Implementation (IN PROGRESS)');
console.log('⏳ Phase 12-14: Polish, Balance, Testing\n');

// Make test functions available globally (development only)
if (typeof window !== 'undefined') {
  (window as any).combatDemo = {
    simple: demoSimpleBattle,
    boss: demoBossBattle,
    xp: demoXpRewards,
    all: runAllCombatDemos
  };
  (window as any).phase8Tests = phase8Tests;
  (window as any).CHARACTER_TYPES = CHARACTER_TYPES;
  (window as any).ABILITIES = ABILITIES;
  
  console.log('🧪 Test suites available in console:');
  console.log('  - combatDemo.all()');
  console.log('  - phase8Tests.all()\n');
}

// ═══════════════════════════════════════════════════════════
// Initialize UI
// ═══════════════════════════════════════════════════════════

const app = document.querySelector<HTMLElement>('#app');

if (!app) {
  console.error('❌ Failed to find #app element!');
} else {
  // Initialize Screen Manager
  ScreenManager.initialize(app);
  
  // Register screens
  ScreenManager.registerScreen('mainMenu', renderMainMenu);
  ScreenManager.registerScreen('teamManagement', renderTeamManagement);
  ScreenManager.registerScreen('campaignMap', renderCampaignMap);
  ScreenManager.registerScreen('combat', renderCombat);
  ScreenManager.registerScreen('battleResults', renderBattleResults);
  ScreenManager.registerScreen('characterSheet', renderCharacterSheet);
  ScreenManager.registerScreen('inventory', renderInventory);
  ScreenManager.registerScreen('settings', renderSettings);
  
  // Event listeners
  EventBus.on(GameEvents.GAME_LOADED, (gameState) => {
    console.log('📥 Game loaded:', gameState);
  });
  
  EventBus.on(GameEvents.GAME_SAVED, () => {
    console.log('💾 Game saved!');
  });
  
  // Start at main menu
  ScreenManager.navigateTo('mainMenu');
  
  console.log('✅ ANXRPG UI initialized successfully!');
  console.log('🎮 Navigate to: Main Menu\n');
}
