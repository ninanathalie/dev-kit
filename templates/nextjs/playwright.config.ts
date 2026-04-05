/**
 * Playwright Configuration — Next.js
 *
 * End-to-end testing for Next.js applications.
 * Tests run in real browsers (Chromium, Firefox, WebKit).
 *
 * Setup:
 *   1. npm install --save-dev @playwright/test
 *   2. npx playwright install (downloads browser binaries)
 *   3. Add to package.json scripts: "test:e2e": "playwright test"
 *
 * Usage:
 *   npm run test:e2e             — Run all E2E tests
 *   npm run test:e2e -- --ui     — Open interactive UI mode
 *   npm run test:e2e -- --debug  — Debug with browser DevTools
 *
 * See: https://playwright.dev
 */

import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  // Directory containing E2E test files
  testDir: "./e2e",

  // Match test files
  testMatch: "**/*.spec.ts",

  // Run tests in parallel across files
  fullyParallel: true,

  // Fail the build on CI if test.only is left in source code
  forbidOnly: !!process.env.CI,

  // Retry failed tests (more retries in CI for flakiness)
  retries: process.env.CI ? 2 : 0,

  // Limit parallel workers in CI to avoid resource contention
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration
  reporter: process.env.CI
    ? [["html", { open: "never" }], ["github"]]
    : [["html", { open: "on-failure" }]],

  // Shared settings for all tests
  use: {
    // Base URL for relative navigation (e.g., page.goto("/dashboard"))
    baseURL: "http://localhost:3000",

    // Capture trace on first retry (for debugging failed tests in CI)
    trace: "on-first-retry",

    // Capture screenshot on failure
    screenshot: "only-on-failure",
  },

  // Browser configurations to test against
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },

    // Mobile viewports (uncomment to enable)
    // {
    //   name: "mobile-chrome",
    //   use: { ...devices["Pixel 7"] },
    // },
    // {
    //   name: "mobile-safari",
    //   use: { ...devices["iPhone 14"] },
    // },
  ],

  // Start the Next.js dev server before running tests
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
