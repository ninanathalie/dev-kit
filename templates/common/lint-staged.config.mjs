/**
 * Lint-Staged Configuration (JS/TS Projects)
 *
 * Runs linting and formatting on staged files only (not the entire codebase).
 * Triggered by the `.husky/pre-commit` hook.
 *
 * For JS/TS projects: Next.js, React, React Native, Vue.js
 * For Flutter: see lint-staged.flutter.config.mjs
 *
 * See: https://github.com/lint-staged/lint-staged
 */

const config = {
  // JS/TS files — run ESLint with auto-fix, then format with Prettier
  "*.{ts,tsx,js,jsx}": ["eslint --fix --cache --max-warnings=0 --no-warn-ignored", "prettier --write"],

  // Non-code files — format only (no linting needed)
  "*.{json,css,md,mjs,cjs,yml,yaml}": ["prettier --write"],
};

export default config;
