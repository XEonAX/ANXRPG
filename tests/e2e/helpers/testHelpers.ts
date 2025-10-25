import { Page, expect } from '@playwright/test';

/**
 * Shared test helper functions for ANXRPG automated tests
 */

/**
 * Start a new game with a specific character type
 */
export async function startNewGame(
  page: Page,
  characterType: 'Paladin' | 'Rogue' | 'Mage' | 'Warrior' | 'Cleric' | 'Berserker',
  _characterName?: string // Name is auto-generated, parameter kept for API compatibility
): Promise<void> {
  // Go to main menu
  await page.goto('/');
  
  // Click New Game button
  await page.getByRole('button', { name: /new game/i }).click();
  
  // Wait for character selection modal
  await expect(page.getByText(/choose.*starting character/i)).toBeVisible({ timeout: 5000 });
  
  // Map character types to their emojis for precise selection
  const emojiMap: Record<string, string> = {
    'Paladin': '🛡️',
    'Rogue': '🗡️',
    'Mage': '🔮',
    'Warrior': '⚔️',
    'Cleric': '✨',
    'Berserker': '🪓'
  };
  
  // Click the character type card using emoji + name for precision
  const emoji = emojiMap[characterType];
  await page.locator('.character-type-card').filter({ hasText: `${emoji} ${characterType}` }).click();
  
  // Wait for team management screen to load
  await expect(page.getByText(/team management/i)).toBeVisible({ timeout: 10000 });
}

/**
 * Navigate to campaign map
 */
export async function goToCampaign(page: Page): Promise<void> {
  await page.getByRole('button', { name: /campaign/i }).click();
  await expect(page.getByText(/campaign/i)).toBeVisible({ timeout: 5000 });
}

/**
 * Start a specific stage battle
 */
export async function startBattle(page: Page, stageNumber: number): Promise<void> {
  // Find and click the stage card (must be clickable - unlocked)
  // Stage cards show the stage number prominently
  const stageCard = page.locator('.stage-card--clickable').filter({ 
    has: page.locator(`.stage-card__number:has-text("${stageNumber}")`)
  }).first();
  
  await stageCard.scrollIntoViewIfNeeded();
  await stageCard.click();
  
  // Wait for combat screen to load
  await expect(page.getByText(/round.*turn/i)).toBeVisible({ timeout: 5000 });
}

/**
 * Play through a battle automatically using simple AI
 * Returns true if victory, false if defeat
 */
export async function playBattle(page: Page, maxTurns: number = 150): Promise<boolean> {
  let actionsTaken = 0;
  
  while (actionsTaken < maxTurns) {
    // Check if battle already ended - look for the victory/defeat HEADINGS, not just text
    const victoryVisible = await page.getByRole('heading', { name: /victory/i }).isVisible().catch(() => false);
    const defeatVisible = await page.getByRole('heading', { name: /defeat/i }).isVisible().catch(() => false);
    
    if (victoryVisible || defeatVisible) {
      console.log(`  [playBattle] Battle ended: ${victoryVisible ? 'VICTORY' : 'DEFEAT'} (actions: ${actionsTaken})`);
      return victoryVisible;
    }
    
    // Check if it's player's turn
    const yourTurn = await page.getByText(/your turn/i).isVisible().catch(() => false);
    
    if (yourTurn) {
      console.log(`  [playBattle] Player turn (action ${actionsTaken})`);
      
      // Find ability buttons - they have " AP" in the text and a hotkey number
      const abilityBtns = page.locator('button').filter({ hasText: /\d+ AP/ });
      const abilityCount = await abilityBtns.count();
      console.log(`  [playBattle] Found ${abilityCount} ability buttons`);
      
      if (abilityCount > 0) {
        // Try to use first available ability
        // Check if button is disabled (not enough AP)
        const firstBtn = abilityBtns.first();
        const isDisabled = await firstBtn.isDisabled().catch(() => true);
        const btnText = await firstBtn.textContent().catch(() => 'unknown');
        console.log(`  [playBattle] First ability: "${btnText}", disabled: ${isDisabled}`);
        
        if (!isDisabled) {
          console.log(`  [playBattle] Clicking ability...`);
          await firstBtn.click();
          actionsTaken++;
          // Wait for action animation and potential victory screen
          await page.waitForTimeout(2000);
          
          // Check immediately if victory happened
          const quickVictoryCheck = await page.getByRole('heading', { name: /victory/i }).isVisible().catch(() => false);
          if (quickVictoryCheck) {
            console.log(`  [playBattle] Victory detected after ability!`);
            return true;
          }
          
          // After using an ability, check if we're still on our turn
          // If so, continue the loop to potentially use another ability or end turn
          continue;
        } else {
          // Button is disabled (not enough AP) - end turn
          console.log(`  [playBattle] Ability disabled, ending turn...`);
          const endTurnBtn = page.getByRole('button', { name: /end turn/i });
          if (await endTurnBtn.isVisible().catch(() => false)) {
            await endTurnBtn.click();
            actionsTaken++;
            await page.waitForTimeout(3000);
          }
        }
      } else {
        // No abilities available - end turn
        console.log(`  [playBattle] No abilities found, ending turn...`);
        const endTurnBtn = page.getByRole('button', { name: /end turn/i });
        if (await endTurnBtn.isVisible().catch(() => false)) {
          await endTurnBtn.click();
          actionsTaken++;
          // Wait longer after ending turn for enemies to act
          await page.waitForTimeout(3000);
        } else {
          console.log(`  [playBattle] WARNING: No end turn button found!`);
          await page.waitForTimeout(1000);
        }
      }
    } else {
      console.log(`  [playBattle] Waiting for player turn... (action ${actionsTaken})`);
      // Not player's turn - wait for enemy actions
      await page.waitForTimeout(2000);
    }
  }
  
  // Timeout - check final state one more time
  console.log(`  [playBattle] TIMEOUT after ${actionsTaken} actions`);
  return await page.getByRole('heading', { name: /victory/i }).isVisible().catch(() => false);
}

/**
 * Complete a battle and return to campaign
 */
export async function completeBattle(page: Page): Promise<boolean> {
  const victory = await playBattle(page);
  
  if (victory) {
    // Click Continue from battle results
    const continueBtn = page.getByRole('button', { name: /continue|back/i }).first();
    await continueBtn.click();
    await page.waitForTimeout(1000);
  }
  
  return victory;
}

/**
 * Navigate to inventory screen
 */
export async function goToInventory(page: Page): Promise<void> {
  const inventoryBtn = page.getByRole('button', { name: /inventory/i });
  await inventoryBtn.click();
  // Use unique heading to avoid strict mode violation
  await expect(page.getByRole('heading', { name: /equipment inventory/i })).toBeVisible({ timeout: 5000 });
}

/**
 * Navigate to settings screen
 */
export async function goToSettings(page: Page): Promise<void> {
  // First check if we're already on main menu
  const settingsOnMenu = page.getByRole('button', { name: /⚙️ Settings/i });
  const isOnMenu = await settingsOnMenu.isVisible().catch(() => false);
  
  if (!isOnMenu) {
    // Navigate to menu first (from team/campaign/etc)
    const menuBtn = page.getByRole('button', { name: /📋 Menu/i });
    const hasMenuBtn = await menuBtn.isVisible().catch(() => false);
    
    if (hasMenuBtn) {
      await menuBtn.click();
      await page.waitForTimeout(500);
    }
  }
  
  // Now click settings
  const settingsBtn = page.getByRole('button', { name: /⚙️ Settings/i });
  await settingsBtn.click();
  // Use unique heading to avoid strict mode violation
  await expect(page.getByRole('heading', { name: /⚙️ Settings/i })).toBeVisible({ timeout: 5000 });
}

/**
 * Use console commands for faster test setup
 */
export async function useConsoleCommand(page: Page, command: string): Promise<void> {
  await page.evaluate((cmd) => {
    // @ts-ignore - playtest is a global
    eval(cmd);
  }, command);
  // Wait a moment for any async operations
  await page.waitForTimeout(100);
}

/**
 * Grant victories using console helper
 */
export async function grantVictories(page: Page, count: number): Promise<void> {
  await useConsoleCommand(page, `window.playtest.grantVictories(${count})`);
  await page.waitForTimeout(500); // Wait for UI to update
}

/**
 * Level up character using console helper
 */
export async function levelUpCharacter(page: Page, index: number, levels: number): Promise<void> {
  await useConsoleCommand(page, `window.playtest.levelUp(${index}, ${levels})`);
  await page.waitForTimeout(500); // Wait for UI to update
}
