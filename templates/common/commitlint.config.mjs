/**
 * Commitlint Configuration
 *
 * Enforces Conventional Commits format on all commit messages.
 * Runs via the `.husky/commit-msg` git hook.
 *
 * Valid formats:
 *   type: message            → e.g., "feat: add login page"
 *   type(scope): message     → e.g., "feat(auth): add login page"
 *
 * Requires: @commitlint/cli, @commitlint/config-conventional
 * See: https://commitlint.js.org
 */

/** @type {import("@commitlint/types").UserConfig} */
const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Restrict commit types to this explicit list (error level = 2)
    "type-enum": [
      2,
      "always",
      [
        "feat",     // New feature
        "fix",      // Bug fix
        "hotfix",   // Urgent production fix
        "chore",    // Tooling, config, or maintenance
        "docs",     // Documentation only
        "style",    // Formatting, no logic change
        "refactor", // Code restructuring without behavior change
        "test",     // Adding or fixing tests
        "build",    // Build system or dependency changes
        "ci",       // CI/CD configuration changes
        "revert",   // Reverting a previous commit
        "perf",     // Performance improvement
      ],
    ],

    // Scope must be kebab-case when provided (e.g., "feat(user-auth): ...")
    "scope-case": [2, "always", "kebab-case"],

    // Prevent PascalCase, StartCase, or UPPER_CASE in the subject line
    "subject-case": [2, "never", ["start-case", "pascal-case", "upper-case"]],
  },
};

export default config;
