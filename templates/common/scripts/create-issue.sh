#!/bin/bash

# create-issue.sh — Create a GitHub issue from the terminal.
#
# Reads .dev-kit.yml from the project root to auto-fill:
#   - Repository (github-repo)
#   - Assignee (assignee)
#   - Project board number (github-project-number)
#
# Usage:
#   bash scripts/create-issue.sh --type feat --title "add user auth" [--body "description"] [--labels "enhancement,priority-high"]
#
# Options:
#   --type     Issue type: feat, fix, chore, docs, refactor, test (required)
#   --title    Issue title (required)
#   --body     Issue description (optional)
#   --labels   Comma-separated labels (optional)
#
# Prerequisites:
#   - GitHub CLI (gh) must be installed and authenticated
#   - .dev-kit.yml must exist in the project root
#
# Examples:
#   bash scripts/create-issue.sh --type feat --title "add user authentication"
#   bash scripts/create-issue.sh --type fix --title "login redirect broken" --labels "bug,priority-high"
#   bash scripts/create-issue.sh --type chore --title "update dependencies" --body "Bump all deps to latest"

set -e

# ─── Color output helpers ───────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# ─── Locate .dev-kit.yml ────────────────────────────────────────────────────────
# Walk up from the current directory to find the project root
find_config() {
  local dir="$PWD"
  while [ "$dir" != "/" ]; do
    if [ -f "$dir/.dev-kit.yml" ]; then
      echo "$dir/.dev-kit.yml"
      return 0
    fi
    dir=$(dirname "$dir")
  done
  return 1
}

CONFIG_FILE=$(find_config)
if [ -z "$CONFIG_FILE" ]; then
  echo -e "${RED}ERROR: .dev-kit.yml not found in any parent directory.${NC}"
  echo "Run this script from within a project that has been set up with dev-kit."
  exit 1
fi

echo -e "${GREEN}Found config:${NC} $CONFIG_FILE"

# ─── Read config values ─────────────────────────────────────────────────────────
REPO=$(grep '^github-repo:' "$CONFIG_FILE" | sed 's/github-repo: *//' | tr -d '[:space:]')
ASSIGNEE=$(grep '^assignee:' "$CONFIG_FILE" | sed 's/assignee: *//' | tr -d '[:space:]')
PROJECT_NUMBER=$(grep '^github-project-number:' "$CONFIG_FILE" | sed 's/github-project-number: *//' | tr -d '[:space:]')

if [ -z "$REPO" ] || [ -z "$ASSIGNEE" ] || [ -z "$PROJECT_NUMBER" ]; then
  echo -e "${RED}ERROR: Missing required fields in .dev-kit.yml${NC}"
  echo "Required: github-repo, assignee, github-project-number"
  exit 1
fi

# ─── Parse arguments ────────────────────────────────────────────────────────────
TYPE=""
TITLE=""
BODY=""
LABELS=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --type)   TYPE="$2";   shift 2 ;;
    --title)  TITLE="$2";  shift 2 ;;
    --body)   BODY="$2";   shift 2 ;;
    --labels) LABELS="$2"; shift 2 ;;
    *)
      echo -e "${RED}ERROR: Unknown option: $1${NC}"
      echo "Usage: bash create-issue.sh --type <type> --title <title> [--body <body>] [--labels <labels>]"
      exit 1
      ;;
  esac
done

# ─── Validate required arguments ────────────────────────────────────────────────
VALID_TYPES=("feat" "fix" "hotfix" "chore" "docs" "style" "refactor" "test" "build" "ci" "revert" "perf")

if [ -z "$TYPE" ]; then
  echo -e "${RED}ERROR: --type is required${NC}"
  echo "Valid types: ${VALID_TYPES[*]}"
  exit 1
fi

# Check if type is valid
type_valid=false
for valid_type in "${VALID_TYPES[@]}"; do
  if [ "$TYPE" = "$valid_type" ]; then
    type_valid=true
    break
  fi
done

if [ "$type_valid" = false ]; then
  echo -e "${RED}ERROR: Invalid type: $TYPE${NC}"
  echo "Valid types: ${VALID_TYPES[*]}"
  exit 1
fi

if [ -z "$TITLE" ]; then
  echo -e "${RED}ERROR: --title is required${NC}"
  exit 1
fi

# ─── Check prerequisites ────────────────────────────────────────────────────────
if ! command -v gh &> /dev/null; then
  echo -e "${RED}ERROR: GitHub CLI (gh) is not installed.${NC}"
  echo "Install it: https://cli.github.com/"
  exit 1
fi

if ! gh auth status &> /dev/null; then
  echo -e "${RED}ERROR: GitHub CLI is not authenticated.${NC}"
  echo "Run: gh auth login"
  exit 1
fi

# ─── Map type to default label ──────────────────────────────────────────────────
# Auto-add a label based on the issue type (if no labels provided)
default_label() {
  case "$1" in
    feat)     echo "enhancement" ;;
    fix)      echo "bug" ;;
    hotfix)   echo "bug" ;;
    docs)     echo "documentation" ;;
    chore)    echo "chore" ;;
    *)        echo "" ;;
  esac
}

if [ -z "$LABELS" ]; then
  LABELS=$(default_label "$TYPE")
fi

# ─── Create the issue ───────────────────────────────────────────────────────────
echo ""
echo -e "${YELLOW}Creating issue...${NC}"
echo "  Repo:     $REPO"
echo "  Title:    $TITLE"
echo "  Assignee: $ASSIGNEE"
echo "  Labels:   ${LABELS:-none}"
echo ""

# Build the gh command
GH_CMD="gh issue create --repo \"$REPO\" --title \"$TITLE\" --assignee \"$ASSIGNEE\""

if [ -n "$BODY" ]; then
  GH_CMD="$GH_CMD --body \"$BODY\""
fi

if [ -n "$LABELS" ]; then
  GH_CMD="$GH_CMD --label \"$LABELS\""
fi

# Execute and capture the issue URL
ISSUE_URL=$(eval "$GH_CMD" 2>&1)

if [ $? -ne 0 ]; then
  echo -e "${RED}ERROR: Failed to create issue${NC}"
  echo "$ISSUE_URL"
  exit 1
fi

echo -e "${GREEN}Issue created:${NC} $ISSUE_URL"

# ─── Add issue to project board ─────────────────────────────────────────────────
echo -e "${YELLOW}Adding to project board #${PROJECT_NUMBER}...${NC}"

# Extract repo owner from the repo string (owner/repo → owner)
REPO_OWNER=$(echo "$REPO" | cut -d'/' -f1)

gh project item-add "$PROJECT_NUMBER" \
  --owner "$REPO_OWNER" \
  --url "$ISSUE_URL" 2>&1

if [ $? -ne 0 ]; then
  echo -e "${RED}WARNING: Failed to add issue to project board.${NC}"
  echo "You may need to add it manually."
else
  echo -e "${GREEN}Added to project board #${PROJECT_NUMBER}${NC}"
fi

# ─── Done ────────────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}Done!${NC} Issue created and assigned to $ASSIGNEE."
