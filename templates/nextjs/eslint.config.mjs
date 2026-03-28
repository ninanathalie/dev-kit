/**
 * ESLint Configuration — Next.js
 *
 * Uses flat config format (ESLint v9+).
 *
 * Extends:
 *   - next/core-web-vitals: Next.js recommended rules + Core Web Vitals checks
 *   - next/typescript: TypeScript-aware rules for Next.js
 *   - prettier: Disables formatting rules that conflict with Prettier
 *
 * Requires: eslint, eslint-config-next, eslint-config-prettier
 * See: https://nextjs.org/docs/app/api-reference/config/eslint
 */

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "prettier"
  ),
  {
    rules: {
      // Allow anonymous default exports in config files (next.config.ts, etc.)
      "import/no-anonymous-default-export": "off",
    },
  },
  {
    // Files and directories to ignore
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
];

export default eslintConfig;
