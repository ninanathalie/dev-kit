/**
 * Jest Configuration — React Native
 *
 * Unit and integration testing for React Native applications.
 * Jest is the standard for React Native — required by React Native Testing Library
 * and the official RN test runner.
 *
 * Setup:
 *   1. npm install --save-dev jest @types/jest ts-jest @testing-library/react-native @testing-library/jest-native
 *   2. Add to package.json scripts: "test": "jest", "test:ci": "jest --ci --coverage"
 *
 * For Expo:
 *   npx expo install jest-expo @testing-library/react-native
 *   Use preset: "jest-expo" instead of "react-native"
 *
 * See: https://jestjs.io/docs/tutorial-react-native
 */

import type { Config } from "jest";

const config: Config = {
  // Use the React Native preset (transforms JSX, handles native modules)
  // For Expo projects, change to: "jest-expo"
  preset: "react-native",

  // Transform TypeScript files with ts-jest
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },

  // File extensions to resolve (in order of priority)
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  // Match test files
  testMatch: ["**/__tests__/**/*.{ts,tsx}", "**/*.{test,spec}.{ts,tsx}"],

  // Path alias mapping (match tsconfig paths)
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  // Setup files — run after Jest is initialized
  setupFilesAfterSetup: ["@testing-library/jest-native/extend-expect"],

  // Mock native modules that don't work in Node.js
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|@react-native|@react-navigation)/)",
  ],

  // Coverage configuration
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/index.ts",
  ],

  coverageReporters: ["text", "lcov", "html"],
};

export default config;
