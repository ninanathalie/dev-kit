#!/bin/bash

# update.sh — Pull latest dev-kit templates into a target project.
#
# Run this script from inside a project that was bootstrapped with dev-kit.
# It compares your current files against the latest templates and lets you
# selectively apply updates.
#
# Usage:
#   bash /path/to/dev-kit/scripts/update.sh
#
# What it does:
#   1. Reads .dev-kit.yml to determine framework and config
#   2. Compares current project files against latest dev-kit templates
#   3. Shows a diff summary of what changed
#   4. Prompts before applying each change
#   5. Skips .dev-kit.yml (never overwritten — it's project-specific)
#
# Prerequisites:
#   - .dev-kit.yml must exist in the project root
#   - dev-kit repo must be accessible locally

set -e

# ─── Color output helpers ───────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

# ─── Resolve paths ──────────────────────────────────────────────────────────────
# DEV_KIT_DIR can be set by the CLI (npx) or derived from script path
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DEV_KIT_DIR="${DEV_KIT_DIR:-$(dirname "$SCRIPT_DIR")}"
TEMPLATES_DIR="$DEV_KIT_DIR/templates"
TARGET_DIR="$(pwd)"

# ─── Validate environment ───────────────────────────────────────────────────────
if [ ! -d "$TEMPLATES_DIR/common" ]; then
  echo -e "${RED}ERROR: Could not find dev-kit templates at $TEMPLATES_DIR${NC}"
  echo "Make sure you're running this script from the dev-kit repo."
  exit 1
fi

if [ ! -f "$TARGET_DIR/.dev-kit.yml" ]; then
  echo -e "${RED}ERROR: .dev-kit.yml not found in current directory.${NC}"
  echo "Run this script from inside a project bootstrapped with dev-kit."
  exit 1
fi

# ─── Read config ─────────────────────────────────────────────────────────────────
FRAMEWORK=$(grep '^framework:' "$TARGET_DIR/.dev-kit.yml" | sed 's/framework: *//' | tr -d '[:space:]')

if [ -z "$FRAMEWORK" ]; then
  echo -e "${RED}ERROR: Could not read framework from .dev-kit.yml${NC}"
  exit 1
fi

echo ""
echo -e "${BOLD}${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BOLD}${BLUE}  dev-kit — Update Templates${NC}"
echo -e "${BOLD}${BLUE}═══════════════════════════════════════════════════${NC}"
echo ""
echo -e "  ${BOLD}Project:${NC}   $TARGET_DIR"
echo -e "  ${BOLD}Framework:${NC} $FRAMEWORK"
echo -e "  ${BOLD}Source:${NC}    $DEV_KIT_DIR"
echo ""

# ─── Build file mapping ─────────────────────────────────────────────────────────
# Maps template source paths to target destination paths.
# Format: "source_path:dest_path"

declare -a FILE_MAP=()

# Common templates (framework-agnostic)
add_common_file() {
  local src="$1"
  local dest="$2"
  if [ -f "$TEMPLATES_DIR/common/$src" ]; then
    FILE_MAP+=("$TEMPLATES_DIR/common/$src:$TARGET_DIR/$dest")
  fi
}

add_common_file ".editorconfig" ".editorconfig"
add_common_file ".prettierrc.mjs" ".prettierrc.mjs"
add_common_file "commitlint.config.mjs" "commitlint.config.mjs"
add_common_file ".husky/pre-commit" ".husky/pre-commit"
add_common_file ".husky/commit-msg" ".husky/commit-msg"
add_common_file "scripts/check-kebab-case.sh" "scripts/check-kebab-case.sh"
add_common_file "scripts/create-issue.sh" "scripts/create-issue.sh"
add_common_file ".github/dependabot.yml" ".github/dependabot.yml"
add_common_file ".github/ISSUE_TEMPLATE/bug-report.yml" ".github/ISSUE_TEMPLATE/bug-report.yml"
add_common_file ".github/ISSUE_TEMPLATE/feature-request.yml" ".github/ISSUE_TEMPLATE/feature-request.yml"
add_common_file ".github/ISSUE_TEMPLATE/chore.yml" ".github/ISSUE_TEMPLATE/chore.yml"
add_common_file ".github/ISSUE_TEMPLATE/config.yml" ".github/ISSUE_TEMPLATE/config.yml"
add_common_file ".github/workflows/pr-title.yml" ".github/workflows/pr-title.yml"
add_common_file ".github/workflows/branch-naming.yml" ".github/workflows/branch-naming.yml"
add_common_file ".github/workflows/pr-autofill.yml" ".github/workflows/pr-autofill.yml"
add_common_file ".github/workflows/create-branch.yml" ".github/workflows/create-branch.yml"
add_common_file ".github/workflows/issue-auto-assign.yml" ".github/workflows/issue-auto-assign.yml"
add_common_file ".github/workflows/e2e.yml" ".github/workflows/e2e.yml"
add_common_file ".github/workflows/check-devkit-updates.yml" ".github/workflows/check-devkit-updates.yml"

# Lint-staged config (framework-specific source)
if [ "$FRAMEWORK" = "flutter" ]; then
  if [ -f "$TEMPLATES_DIR/flutter/lint-staged.config.mjs" ]; then
    FILE_MAP+=("$TEMPLATES_DIR/flutter/lint-staged.config.mjs:$TARGET_DIR/lint-staged.config.mjs")
  fi
else
  add_common_file "lint-staged.config.mjs" "lint-staged.config.mjs"
fi

# Framework-specific templates
add_framework_file() {
  local src="$1"
  local dest="$2"
  if [ -f "$TEMPLATES_DIR/$FRAMEWORK/$src" ]; then
    FILE_MAP+=("$TEMPLATES_DIR/$FRAMEWORK/$src:$TARGET_DIR/$dest")
  fi
}

add_framework_file ".github/workflows/ci.yml" ".github/workflows/ci.yml"
add_framework_file ".gitignore" ".gitignore"

if [ "$FRAMEWORK" = "flutter" ]; then
  add_framework_file "analysis_options.yaml" "analysis_options.yaml"
else
  add_framework_file "eslint.config.mjs" "eslint.config.mjs"
fi

# ─── Compare files ───────────────────────────────────────────────────────────────
echo -e "${BOLD}Comparing files...${NC}"
echo ""

declare -a MODIFIED=()
declare -a NEW=()
declare -a UNCHANGED=()

for entry in "${FILE_MAP[@]}"; do
  src="${entry%%:*}"
  dest="${entry##*:}"
  rel_dest="${dest#$TARGET_DIR/}"

  if [ ! -f "$dest" ]; then
    # File doesn't exist in target — it's new
    NEW+=("$rel_dest")
    echo -e "  ${GREEN}NEW${NC}        $rel_dest"
  elif ! diff -q "$src" "$dest" > /dev/null 2>&1; then
    # File exists but differs — it's modified
    MODIFIED+=("$entry")
    # Count lines changed
    changes=$(diff "$dest" "$src" | grep -c '^[<>]' || true)
    echo -e "  ${YELLOW}MODIFIED${NC}   $rel_dest ${DIM}($changes lines differ)${NC}"
  else
    UNCHANGED+=("$rel_dest")
    echo -e "  ${DIM}UNCHANGED  $rel_dest${NC}"
  fi
done

echo ""

# ─── Summary ─────────────────────────────────────────────────────────────────────
total_changes=$(( ${#MODIFIED[@]} + ${#NEW[@]} ))

if [ "$total_changes" -eq 0 ]; then
  echo -e "${GREEN}Everything is up to date! No changes needed.${NC}"
  echo ""
  exit 0
fi

echo -e "${BOLD}Summary:${NC} ${#NEW[@]} new, ${#MODIFIED[@]} modified, ${#UNCHANGED[@]} unchanged"
echo ""

# ─── Apply new files ────────────────────────────────────────────────────────────
if [ ${#NEW[@]} -gt 0 ]; then
  echo -e "${BOLD}New files to add:${NC}"
  for rel_dest in "${NEW[@]}"; do
    echo -e "  ${GREEN}+${NC} $rel_dest"
  done
  echo ""
  read -rp "Add all new files? (y/n): " add_new

  if [ "$add_new" = "y" ] || [ "$add_new" = "Y" ]; then
    for entry in "${FILE_MAP[@]}"; do
      src="${entry%%:*}"
      dest="${entry##*:}"
      rel_dest="${dest#$TARGET_DIR/}"

      for new_file in "${NEW[@]}"; do
        if [ "$rel_dest" = "$new_file" ]; then
          mkdir -p "$(dirname "$dest")"
          cp "$src" "$dest"
          echo -e "  ${GREEN}✓${NC} Added $rel_dest"
        fi
      done
    done
    echo ""
  fi
fi

# ─── Apply modified files ───────────────────────────────────────────────────────
if [ ${#MODIFIED[@]} -gt 0 ]; then
  echo -e "${BOLD}Modified files:${NC}"
  echo ""

  for entry in "${MODIFIED[@]}"; do
    src="${entry%%:*}"
    dest="${entry##*:}"
    rel_dest="${dest#$TARGET_DIR/}"

    echo -e "  ${YELLOW}─── $rel_dest ───${NC}"
    # Show a compact diff (unified format, 3 lines context)
    diff -u "$dest" "$src" --label "current" --label "latest" | head -40 || true
    echo ""

    read -rp "  Apply this change? (y/n/d for full diff): " choice
    case "$choice" in
      y|Y)
        cp "$src" "$dest"
        echo -e "  ${GREEN}✓${NC} Updated $rel_dest"
        ;;
      d|D)
        diff -u "$dest" "$src" --label "current" --label "latest" || true
        echo ""
        read -rp "  Apply this change? (y/n): " choice2
        if [ "$choice2" = "y" ] || [ "$choice2" = "Y" ]; then
          cp "$src" "$dest"
          echo -e "  ${GREEN}✓${NC} Updated $rel_dest"
        else
          echo -e "  ${DIM}Skipped $rel_dest${NC}"
        fi
        ;;
      *)
        echo -e "  ${DIM}Skipped $rel_dest${NC}"
        ;;
    esac
    echo ""
  done
fi

# ─── Done ────────────────────────────────────────────────────────────────────────
echo -e "${BOLD}${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${BOLD}${GREEN}  Update complete!${NC}"
echo -e "${BOLD}${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""
echo -e "  Review the changes and commit when ready."
echo ""
