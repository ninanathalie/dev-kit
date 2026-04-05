/**
 * ESLint Configuration — React Native
 *
 * Uses flat config format (ESLint v9+).
 *
 * Extends:
 *   - eslint/recommended: Core ESLint rules
 *   - typescript-eslint: TypeScript-aware linting
 *   - react-hooks: Enforces Rules of Hooks
 *   - react/jsx-runtime: Supports the new JSX transform
 *   - prettier: Disables formatting rules that conflict with Prettier
 *
 * Note: React Native does not use a bundler like Vite, so no build-specific
 * ignores are needed. Metro bundler output is not typically in the project root.
 *
 * Requires: eslint, typescript-eslint, eslint-plugin-react-hooks,
 *           eslint-plugin-react, eslint-config-prettier
 */

import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import react from "eslint-plugin-react";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  // Core ESLint recommended rules
  js.configs.recommended,

  // TypeScript recommended rules
  ...tseslint.configs.recommended,

  // React JSX runtime support
  {
    ...react.configs.flat["jsx-runtime"],
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  // React Hooks rules
  {
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: reactHooks.configs.recommended.rules,
  },

  // Prettier — disables rules that conflict with formatting
  prettier,

  // Files and directories to ignore
  {
    ignores: ["android/**", "ios/**", ".expo/**"],
  }
);
