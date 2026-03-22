/**
 * Lint-Staged Configuration (Flutter/Dart Projects)
 *
 * Runs analysis and formatting on staged Dart files only.
 * Triggered by the `.husky/pre-commit` hook.
 *
 * Requires: dart (included with Flutter SDK)
 *
 * See: https://github.com/lint-staged/lint-staged
 */

const config = {
  // Dart files — format, then run static analysis
  "*.dart": ["dart format", "dart analyze --fatal-infos"],

  // Non-code files — format with Prettier
  "*.{json,md,yml,yaml}": ["prettier --write"],
};

export default config;
