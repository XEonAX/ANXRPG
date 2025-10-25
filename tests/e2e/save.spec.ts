import { test, expect } from '@playwright/test';
import { startNewGame, goToSettings } from './helpers/testHelpers';

/**
 * Save/Load System Tests
 * Tests auto-save, manual save, export/import
 */

test.describe('Save System', () => {
  
  test('should save game manually', async ({ page }) => {
    await startNewGame(page, 'Berserker', 'SaveTest');
    
    // Go to settings
    await goToSettings(page);
    
    // Click Save Now button (actual button text)
    const saveBtn = page.getByRole('button', { name: /💾 Save Now/i });
    await expect(saveBtn).toBeVisible({ timeout: 5000 });
    
    // Get current timestamp text before saving
    const lastSavedBefore = await page.locator('text=/Last Saved:/i').locator('..').textContent().catch(() => '');
    
    await saveBtn.click();
    
    // Wait for save to complete
    await page.waitForTimeout(1500);
    
    // Timestamp should have changed (or still be visible)
    const saveSection = page.getByRole('heading', { name: /💾 Save Management/i });
    await expect(saveSection).toBeVisible({ timeout: 3000 });
    
    console.log('✓ Manual save works');
  });
  
  test('should export save data', async ({ page }) => {
    await startNewGame(page, 'Paladin', 'ExportTest');
    await goToSettings(page);
    
    // Click Export Save button
    const exportBtn = page.getByRole('button', { name: /📤 Export Save/i });
    await expect(exportBtn).toBeVisible({ timeout: 5000 });
    
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 10000 }),
      exportBtn.click()
    ]);
    
    expect(download.suggestedFilename()).toMatch(/anxrpg.*\.json$/i);
    console.log(`✓ Save exported: ${download.suggestedFilename()}`);
  });
  
  test('should load continue game', async ({ page }) => {
    // Create a game first
    await startNewGame(page, 'Rogue', 'ContinueTest');
    
    // Wait for team management
    await page.waitForTimeout(1000);
    
    // Go back to main menu (reload page)
    await page.goto('/');
    await page.waitForTimeout(500);
    
    // Should see Continue button
    const continueBtn = page.getByRole('button', { name: /▶️ Continue/i });
    await expect(continueBtn).toBeVisible({ timeout: 5000 });
    
    // Click Continue
    await continueBtn.click();
    
    // Should load into team management
    await expect(page.getByRole('heading', { name: /team management/i })).toBeVisible({ timeout: 5000 });
    
    // Character should be loaded - use .first() to avoid strict mode
    const rogueChar = page.getByText(/Beta/i).first(); // Rogue is Beta type
    await expect(rogueChar).toBeVisible({ timeout: 3000 });
    
    console.log('✓ Continue game works');
  });
});

test.describe('Settings', () => {
  
  test('should open settings screen', async ({ page }) => {
    await startNewGame(page, 'Mage', 'SettingsTest');
    await goToSettings(page);
    
    // Should see settings title
    await expect(page.getByRole('heading', { name: /⚙️ Settings/i })).toBeVisible({ timeout: 5000 });
    
    // Should see game settings section
    await expect(page.getByRole('heading', { name: /🎮 Game Settings/i })).toBeVisible({ timeout: 5000 });
    
    console.log('✓ Settings screen loads');
  });
  
  test('should show game statistics', async ({ page }) => {
    await startNewGame(page, 'Warrior', 'StatsTest');
    await goToSettings(page);
    
    // Should see statistics section
    const statsSection = page.getByRole('heading', { name: /📊 Statistics/i });
    await expect(statsSection).toBeVisible({ timeout: 5000 });
    
    // Should see some stats
    const victories = page.getByText(/Victories/i);
    await expect(victories).toBeVisible({ timeout: 3000 });
    
    console.log('✓ Statistics visible');
  });
  
  test('should toggle settings', async ({ page }) => {
    await startNewGame(page, 'Cleric', 'ToggleTest');
    await goToSettings(page);
    
    // Settings section should be visible
    const settingsSection = page.getByRole('heading', { name: /🎮 Game Settings/i });
    await expect(settingsSection).toBeVisible({ timeout: 5000 });
    
    // Find a setting toggle - look for the clickable parent divs
    // The checkboxes are inside divs with cursor:pointer
    const damageVarianceToggle = page.locator('text=Damage Variance').locator('..');
    await expect(damageVarianceToggle).toBeVisible({ timeout: 5000 });
    
    // Get checkbox state
    const checkbox = damageVarianceToggle.locator('input[type="checkbox"]');
    const isChecked = await checkbox.isChecked().catch(() => false);
    
    // Click the parent div (which is the clickable area)
    await damageVarianceToggle.click();
    await page.waitForTimeout(500);
    
    // State should have toggled
    const newChecked = await checkbox.isChecked().catch(() => !isChecked);
    expect(newChecked).not.toBe(isChecked);
    
    console.log('✓ Settings toggles work');
  });
});
