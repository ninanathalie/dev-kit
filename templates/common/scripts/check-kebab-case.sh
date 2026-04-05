#!/bin/bash

# check-kebab-case.sh — Validates that all staged file names follow kebab-case.
#
# Runs as part of the pre-commit hook to prevent files with invalid names
# from being committed (e.g., UserProfile.tsx, my_component.dart).
#
# Rules:
#   - File names must be lowercase
#   - Words separated by hyphens (kebab-case)
#   - Dots allowed for extensions and config files (e.g., .gitignore, app.config.mjs)
#   - Leading dots allowed for hidden/config files (e.g., .eslintrc, .prettierrc)
#   - Numbers allowed (e.g., error-404.tsx)
#
# Exceptions (always allowed):
#   - README.md, LICENSE, Makefile, Dockerfile, Procfile
#   - CHANGELOG.md, CONTRIBUTING.md, CODE_OF_CONDUCT.md
#   - ISSUE_TEMPLATE/ directory (GitHub requires this casing)
#   - .husky/ hooks (pre-commit, commit-msg — no extensions)
#
# Usage:
#   bash scripts/check-kebab-case.sh

# List of file name patterns that are exempt from kebab-case enforcement.
# These are industry-standard names that require specific casing.
EXCEPTIONS=(
  "README.md"
  "README"
  "LICENSE"
  "LICENSE.md"
  "Makefile"
  "Dockerfile"
  "Procfile"
  "CHANGELOG.md"
  "CONTRIBUTING.md"
  "CODE_OF_CONDUCT.md"
  "CODEOWNERS"
  "analysis_options.yaml"
)

# Directories where file casing is dictated by external tools (e.g., GitHub)
EXCEPTION_DIRS=(
  "ISSUE_TEMPLATE"
)

# Track whether any violations were found
has_error=false

# Use NUL-delimited output (-z) to safely handle file paths with spaces/special chars.
# Read staged files (added, copied, modified, renamed — excludes deleted).
while IFS= read -r -d '' file; do
  # Extract just the file name (no directory path)
  filename=$(basename "$file")
  dirpath=$(dirname "$file")

  # Skip exception files (exact match on file name)
  skip=false
  for exception in "${EXCEPTIONS[@]}"; do
    if [ "$filename" = "$exception" ]; then
      skip=true
      break
    fi
  done
  [ "$skip" = true ] && continue

  # Skip files inside exception directories (fixed-string match)
  for exception_dir in "${EXCEPTION_DIRS[@]}"; do
    if echo "$dirpath" | grep -Fq "$exception_dir"; then
      skip=true
      break
    fi
  done
  [ "$skip" = true ] && continue

  # Skip husky hook files (they have no extension by convention)
  if echo "$dirpath" | grep -Fq ".husky"; then
    continue
  fi

  # Validate: file name must be kebab-case.
  # Allowed pattern: optional leading dot, lowercase letters, numbers, hyphens,
  # and dots (for multi-part extensions like .config.mjs)
  if ! echo "$filename" | grep -qE '^\.?[a-z0-9]+([.-][a-z0-9]+)*(\.[a-z0-9]+)*$'; then
    echo "ERROR: File name is not kebab-case: $file"
    echo "       Expected: lowercase letters, numbers, hyphens, and dots (for extensions)"
    echo "       Example:  user-profile.tsx, app.config.mjs"
    echo ""
    has_error=true
  fi
done < <(git diff --cached --name-only --diff-filter=ACMR -z)

if [ "$has_error" = true ]; then
  echo "──────────────────────────────────────────────────────"
  echo "Commit blocked: Fix the file names above to kebab-case."
  echo "──────────────────────────────────────────────────────"
  exit 1
fi
