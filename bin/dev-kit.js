#!/usr/bin/env node

/**
 * dev-kit CLI — Bootstrap, update, and manage dev-kit templates.
 *
 * Usage:
 *   npx @ninanathalie/dev-kit init           — Bootstrap a new project
 *   npx @ninanathalie/dev-kit update         — Update templates in current project
 *   npx @ninanathalie/dev-kit create-issue   — Create a GitHub issue
 *   npx @ninanathalie/dev-kit --version      — Show version
 *   npx @ninanathalie/dev-kit --help         — Show help
 */

import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync, existsSync } from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = resolve(__dirname, "..");
const SCRIPTS_DIR = resolve(ROOT_DIR, "scripts");

// ─── Parse arguments ────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const command = args[0];

// ─── Version ────────────────────────────────────────────────────────────────────
if (command === "--version" || command === "-v") {
  const pkg = JSON.parse(readFileSync(resolve(ROOT_DIR, "package.json"), "utf-8"));
  console.log(`dev-kit v${pkg.version}`);
  process.exit(0);
}

// ─── Help ───────────────────────────────────────────────────────────────────────
if (!command || command === "--help" || command === "-h") {
  console.log(`
  dev-kit — A reusable development toolkit

  Usage:
    npx @ninanathalie/dev-kit <command> [options]

  Commands:
    init            Bootstrap a new project with dev-kit templates
    update          Update templates in current project (shows diff, selective apply)
    create-issue    Create a GitHub issue (reads .dev-kit.yml for config)

  Options:
    --version, -v   Show version
    --help, -h      Show this help message

  Create Issue Options:
    --type <type>   Issue type: feat, fix, chore, docs, refactor, test (required)
    --title <text>  Issue title (required)
    --body <text>   Issue description (optional)
    --labels <list> Comma-separated labels (optional)

  Examples:
    npx @ninanathalie/dev-kit init
    npx @ninanathalie/dev-kit update
    npx @ninanathalie/dev-kit create-issue --type feat --title "add auth"
  `);
  process.exit(0);
}

// ─── Run a bash script ──────────────────────────────────────────────────────────
function runScript(scriptName, scriptArgs = []) {
  const scriptPath = resolve(SCRIPTS_DIR, scriptName);

  if (!existsSync(scriptPath)) {
    console.error(`Error: Script not found: ${scriptPath}`);
    process.exit(1);
  }

  const child = spawn("bash", [scriptPath, ...scriptArgs], {
    stdio: "inherit",
    cwd: process.cwd(),
    env: { ...process.env, DEV_KIT_DIR: ROOT_DIR },
  });

  child.on("close", (code) => {
    process.exit(code ?? 0);
  });

  child.on("error", (err) => {
    console.error(`Error running ${scriptName}: ${err.message}`);
    process.exit(1);
  });
}

// ─── Commands ───────────────────────────────────────────────────────────────────
switch (command) {
  case "init":
    runScript("setup.sh");
    break;

  case "update":
    runScript("update.sh");
    break;

  case "create-issue":
    runScript("create-issue.sh", args.slice(1));
    break;

  default:
    console.error(`Unknown command: ${command}`);
    console.error('Run "npx @ninanathalie/dev-kit --help" for available commands.');
    process.exit(1);
}
