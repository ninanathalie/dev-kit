/**
 * Vitest Configuration — React (Vite)
 *
 * Unit and integration testing for React/Vite applications.
 *
 * Setup:
 *   1. npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom
 *   2. Add to package.json scripts: "test": "vitest", "test:ci": "vitest run --coverage"
 *
 * Note: Since Vite is already the bundler, Vitest uses the same config and
 * transforms — no extra plugins needed (unlike Next.js which needs @vitejs/plugin-react).
 *
 * See: https://vitest.dev
 */

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],

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
