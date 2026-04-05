/**
 * ESLint Configuration — Next.js
 *
 * Uses native flat config format (ESLint v9+ / eslint-config-next v16+).
 *
 * Extends:
 *   - next/core-web-vitals: Next.js recommended rules + Core Web Vitals checks
 *   - next/typescript: TypeScript-aware rules for Next.js
 *   - prettier: Disables formatting rules that conflict with Prettier
 *
 * Requires: eslint (^9), eslint-config-next (^16), eslint-config-prettier
 * See: https://nextjs.org/docs/app/api-reference/config/eslint
 */

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,

  // Allow anonymous default exports in config files (next.config.ts, etc.)
  {
    files: ["*.config.mjs", ".prettierrc.mjs"],
    rules: {
      "import/no-anonymous-default-export": "off",
    },
  },

  // Files and directories to ignore
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "src/generated/**",
  ]),
]);

export default eslintConfig;
