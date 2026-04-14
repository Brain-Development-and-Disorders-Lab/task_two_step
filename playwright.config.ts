/**
 * @fileoverview Playwright configuration for automated testing
 *
 * Runs end-to-end tests in `tests/automated/` against a dedicated test app
 * served by webpack-dev-server on port 9999. Tests execute in headless Chromium,
 * making them suitable for CI/CD pipelines.
 *
 * Before running tests, install Playwright browsers once with:
 *   npx playwright install --with-deps chromium
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/automated',
  testMatch: '**/*.spec.ts',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: 'http://localhost:9999',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'off',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npx webpack serve --config webpack.test.config.js',
    url: 'http://localhost:9999',
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
