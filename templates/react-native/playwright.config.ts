/**
 * Playwright Configuration — React Native (Web)
 *
 * End-to-end testing for React Native Web builds only.
 * For native iOS/Android E2E testing, use Detox instead (out of scope for dev-kit).
 *
 * This config assumes you're using Expo with web support or React Native Web.
 *
 * Setup:
 *   1. npm install --save-dev @playwright/test
 *   2. npx playwright install
 *   3. Add to package.json scripts: "test:e2e": "playwright test"
 *
 * See: https://playwright.dev
 */

import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: process.env.CI
    ? [["html", { open: "never" }], ["github"]]
    : [["html", { open: "on-failure" }]],

  use: {
    // Expo web default port
    baseURL: "http://localhost:8081",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // Mobile viewports (more relevant for React Native Web)
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 7"] },
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 14"] },
    },
  ],

  webServer: {
    command: "npx expo start --web",
    url: "http://localhost:8081",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
