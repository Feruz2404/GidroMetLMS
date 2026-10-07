import { existsSync } from 'node:fs'
import { defineConfig, devices } from '@playwright/test'

if (existsSync('.env')) process.loadEnvFile('.env')

const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost:3000'

/**
 * End-to-end suite. Requires a migrated database filled with the demo seed
 * (`npm run db:seed:demo`); tests change data, so re-seed before a clean run.
 * Reuses a running server (dev or production) on the base URL, otherwise
 * starts the standalone build with `npm start`.
 */
export default defineConfig({
  testDir: 'e2e',
  // The suite shares one database, so tests run serially for determinism.
  workers: 1,
  fullyParallel: false,
  timeout: 90_000,
  expect: { timeout: 15_000 },
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    locale: 'uz-UZ',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } }, grepInvert: /@mobile/ },
    { name: 'mobile', use: { ...devices['Pixel 7'] }, grep: /@mobile/ },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : { command: 'npm run start', url: `${baseURL}/api/health`, reuseExistingServer: true, timeout: 180_000 },
})
