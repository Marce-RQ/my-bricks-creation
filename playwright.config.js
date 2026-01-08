import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  timeout: 15_000,
  expect: {
    timeout: 10_000, // Assertions timeout
  },

  testDir: './tests',
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }]],

  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
  },

  projects: [
    // Setup project - runs first
    {
      name: 'setup',
      testMatch: '**/auth-setup.js',
    },

    // ADMIN TESTS - use authenticated state
    {
      name: 'admin tests',
      testMatch: '**/admin/*.spec.js',
      testIgnore: '**/adminLogin.spec.js',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'tests/.auth/admin.json',
      },
      dependencies: ['setup'],
    },

    // Login tests - no authentication needed
    {
      name: 'login tests',
      testMatch: '**/adminLogin.spec.js',
      use: { ...devices['Desktop Chrome'] },
    },

    // User tests - no authentication needed
    {
      name: 'user tests',
      testMatch: '**/user/*.spec.js',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Test against mobile viewports. */
  // {
  //   name: 'Mobile Chrome',
  //   use: { ...devices['Pixel 5'] },
  // },
  // {
  //   name: 'Mobile Safari',
  //   use: { ...devices['iPhone 12'] },
  // },

  /* Test against branded browsers. */
  // {
  //   name: 'Microsoft Edge',
  //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
  // },
  // {
  //   name: 'Google Chrome',
  //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
  // },

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
  },
});
