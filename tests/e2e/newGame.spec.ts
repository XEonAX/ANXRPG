import { test, expect } from '@playwright/test';
import { startNewGame, goToCampaign, startBattle, completeBattle } from './helpers/testHelpers';

/**
 * New Game Flow Tests
 * Tests character creation and early game progression
 */

test.describe('New Game - Character Creation', () => {
  
  test('should create game with Rogue (Beta)', async ({ page }) => {
    await startNewGame(page, 'Rogue', 'TestRogue');
    
    // Should be in Team Management
    await expect(page.getByText(/team management/i)).toBeVisible();
    // Check for character type (Beta) instead of custom name - use .first() to avoid strict mode
    await expect(page.getByText(/beta/i).first()).toBeVisible();
  });
  
  test('should create game with Paladin (Alpha)', async ({ page }) => {
    await startNewGame(page, 'Paladin', 'TestPaladin');
    
    await expect(page.getByText(/team management/i)).toBeVisible();
    await expect(page.getByText(/alpha/i).first()).toBeVisible();
  });
  
  test('should create game with Mage (Gamma)', async ({ page }) => {
    await startNewGame(page, 'Mage', 'TestMage');
    
    await expect(page.getByText(/team management/i)).toBeVisible();
    await expect(page.getByText(/gamma/i).first()).toBeVisible();
  });
});

test.describe('Early Game Progression', () => {
  
  test('Rogue should complete stages 1-3', async ({ page }) => {
    await startNewGame(page, 'Rogue', 'EarlyRogue');
    await goToCampaign(page);
    
    // Play first 3 stages
    for (let stage = 1; stage <= 3; stage++) {
      console.log(`Testing Stage ${stage}...`);
      
      await startBattle(page, stage);
      const victory = await completeBattle(page);
      
      expect(victory).toBe(true);
      console.log(`  ✅ Stage ${stage} completed`);
    }
  });
  
  test('Warrior should complete stages 1-3', async ({ page }) => {
    await startNewGame(page, 'Warrior', 'EarlyWarrior');
    await goToCampaign(page);
    
    // Play first 3 stages
    for (let stage = 1; stage <= 3; stage++) {
      await startBattle(page, stage);
      const victory = await completeBattle(page);
      
      expect(victory).toBe(true);
    }
  });
});

test.describe('Character Type Balance', () => {
  
  const characterTypes: Array<'Paladin' | 'Rogue' | 'Mage' | 'Warrior' | 'Cleric' | 'Berserker'> = [
    'Paladin', 'Rogue', 'Mage', 'Warrior', 'Cleric', 'Berserker'
  ];
  
  for (const charType of characterTypes) {
    test(`${charType} should beat Stage 1`, async ({ page }) => {
      await startNewGame(page, charType, `Test${charType}`);
      await goToCampaign(page);
      await startBattle(page, 1);
      
      const victory = await completeBattle(page);
      expect(victory).toBe(true);
    });
  }
});
