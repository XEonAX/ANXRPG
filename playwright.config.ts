import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for ANXRPG automated playtesting
 * Uses Chrome/Chromium by default
 */
export default defineConfig({
  testDir: './tests/e2e',
  
  // Run tests in files in parallel
  fullyParallel: false,
  
  // Fail fast - stop on first failure
  maxFailures: 1,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Test timeout (30 seconds is reasonable for game tests)
  timeout: 30000,    
  
  // Reporter to use
  reporter: 'html',
  
  // Shared settings for all projects
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: 'http://localhost:5173',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Reduced timeout for faster feedback
    actionTimeout: 10000, // 10 seconds instead of 30
    navigationTimeout: 10000,
    
    // Run tests in headed mode (visible browser)
    headless: false,
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Run your local dev server before starting the tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
