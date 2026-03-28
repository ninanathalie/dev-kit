/**
 * ESLint Configuration — Vue.js
 *
 * Uses flat config format (ESLint v9+).
 *
 * Extends:
 *   - eslint/recommended: Core ESLint rules
 *   - typescript-eslint: TypeScript-aware linting
 *   - vue/vue3-recommended: Vue 3 recommended rules (includes essential + strongly-recommended)
 *   - prettier: Disables formatting rules that conflict with Prettier
 *
 * Note: The vue-eslint-parser is required so ESLint can parse .vue single-file components.
 * TypeScript inside <script lang="ts"> blocks is handled by typescript-eslint's parser.
 *
 * Requires: eslint, typescript-eslint, eslint-plugin-vue,
 *           vue-eslint-parser, eslint-config-prettier
 * See: https://eslint.vuejs.org
 */

import js from "@eslint/js";
import tseslint from "typescript-eslint";
import vue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  // Core ESLint recommended rules
  js.configs.recommended,

  // TypeScript recommended rules
  ...tseslint.configs.recommended,

  // Vue 3 recommended rules
  ...vue.configs["flat/recommended"],

  // Configure vue-eslint-parser to use typescript-eslint for <script lang="ts"> blocks
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        sourceType: "module",
      },
    },
  },

  // Prettier — disables rules that conflict with formatting
  prettier,

  // Files and directories to ignore
  {
    ignores: ["dist/**", "build/**"],
  }
);
