/**
 * Prettier Configuration
 *
 * Shared formatting rules for all JS/TS projects.
 * Works alongside ESLint (via eslint-config-prettier) to avoid conflicts.
 *
 * Applies to: Next.js, React, React Native, Vue.js
 * Does NOT apply to: Flutter/Dart (uses `dart format` instead)
 *
 * See: https://prettier.io/docs/en/options
 */

/** @type {import("prettier").Config} */
const config = {
  semi: true,              // Add semicolons at the end of statements
  singleQuote: false,      // Use double quotes ("example") over single quotes
  printWidth: 100,         // Wrap lines longer than 100 characters
  tabWidth: 2,             // 2-space indentation (matches .editorconfig)
  trailingComma: "es5",    // Add trailing commas where valid in ES5 (objects, arrays)
  bracketSpacing: true,    // Add spaces inside object literals: { foo: bar }
  arrowParens: "always",   // Always wrap arrow function params in parens: (x) => x
  endOfLine: "lf",         // Enforce Unix line endings (matches .editorconfig)
};

export default config;
