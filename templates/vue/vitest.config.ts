/**
 * Vitest Configuration — Vue.js
 *
 * Unit and integration testing for Vue.js applications.
 *
 * Setup:
 *   1. npm install --save-dev vitest @vue/test-utils @testing-library/vue jsdom
 *   2. Add to package.json scripts: "test": "vitest", "test:ci": "vitest run --coverage"
 *
 * Note: The @vitejs/plugin-vue is typically already in your vite.config.ts.
 * Vitest extends the Vite config automatically, so Vue SFC transforms work out of the box.
 *
 * See: https://vitest.dev
 */

import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],

  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],

    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
      include: ["src/**/*.{ts,tsx,vue}"],
      exclude: [
        "src/**/*.{test,spec}.{ts,tsx}",
        "src/**/*.d.ts",
        "src/**/index.ts",
      ],
    },
  },
});
