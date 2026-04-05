/**
 * ESLint Configuration — React (Vite)
 *
 * Uses flat config format (ESLint v9+).
 *
 * Extends:
 *   - eslint/recommended: Core ESLint rules
 *   - typescript-eslint: TypeScript-aware linting
 *   - react-hooks: Enforces Rules of Hooks
 *   - react/jsx-runtime: Supports the new JSX transform (no need to import React)
 *   - prettier: Disables formatting rules that conflict with Prettier
 *
 * Requires: eslint, typescript-eslint, eslint-plugin-react-hooks,
 *           eslint-plugin-react, eslint-config-prettier
 * See: https://eslint.org/docs/latest/use/configure/configuration-files
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

  // React JSX runtime support (no need to import React in every file)
  {
    ...react.configs.flat["jsx-runtime"],
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  // React Hooks rules (enforces Rules of Hooks)
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
    ignores: ["dist/**", "build/**"],
  }
);
