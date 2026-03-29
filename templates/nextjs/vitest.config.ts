/**
 * Vitest Configuration — Next.js
 *
 * Unit and integration testing for Next.js applications.
 *
 * Setup:
 *   1. npm install --save-dev vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
 *   2. Add to package.json scripts: "test": "vitest", "test:ci": "vitest run --coverage"
 *
 * Usage:
 *   npm test           — Run tests in watch mode (development)
 *   npm run test:ci    — Run tests once with coverage (CI)
 *
 * Note: Next.js-specific features (server components, API routes, middleware)
 * may require additional mocking. For those, consider @next/test or integration tests.
 *
 * See: https://vitest.dev
 */

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  resolve: {
    // Match the path alias from tsconfig.json: "@/*" → "./src/*"
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  test: {
    // Use jsdom to simulate a browser environment for React components
    environment: "jsdom",

    // Auto-import test utilities (describe, it, expect, vi) — no manual imports needed
    globals: true,

    // Setup files run before each test file
    // Add @testing-library/jest-dom matchers (toBeInTheDocument, etc.)
    setupFiles: ["./vitest.setup.ts"],

    // Include test files matching these patterns
    include: ["src/**/*.{test,spec}.{ts,tsx}"],

    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.{test,spec}.{ts,tsx}",
        "src/**/*.d.ts",
        "src/**/index.ts",
      ],
    },
  },
});
