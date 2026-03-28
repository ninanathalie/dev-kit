# Workflows Guide

All GitHub Actions workflows provided by dev-kit. These are copied into your project during setup and read configuration from `.dev-kit.yml`.

---

## CI Workflow (`ci.yml`)

**Framework-specific** — each framework has its own CI workflow.

| Trigger | PR to `develop`, `main`, or `master` |
|---|---|
| Concurrency | Cancels in-progress runs on the same branch |

### Steps by Framework

| Framework | Steps |
|---|---|
| **Next.js** | `tsc --noEmit` → `eslint` → `npm run build` |
| **React** | `tsc --noEmit` → `eslint` → `npm run build` |
| **React Native** | `tsc --noEmit` → `eslint` |
| **Vue** | `vue-tsc --noEmit` → `eslint` → `npm run build` |
| **Flutter** | `dart analyze` → `flutter test` → `flutter build apk` |

---

## PR Title Validation (`pr-title.yml`)

Validates that PR titles follow Conventional Commits format.

| Trigger | PR opened, edited, or synchronized |
|---|---|
| Target branches | `develop`, `main`, `master` |

### Valid Formats

```
type: message
type(scope): message
```

### On Failure

Outputs an error with the expected format, allowed types, and scope rules.

---

## Branch Naming Validation (`branch-naming.yml`)

Validates that the PR source branch follows the naming convention.

| Trigger | PR opened or synchronized |
|---|---|
| Target branches | `develop`, `main`, `master` |
| Config | Reads `project-prefix` from `.dev-kit.yml` |

### Expected Format

```
{type}/{PREFIX}-{number}
```

Skips validation for base branches (`develop`, `main`, `master`).

---

## PR Auto-Fill (`pr-autofill.yml`)

Automates PR housekeeping when a PR is opened or reopened.

| Trigger | PR opened or reopened |
|---|---|
| Skips | Forked PRs (read-only token limitation) |
| Config | Reads `project-prefix`, `assignee`, `github-project-number` from `.dev-kit.yml` |

### What It Does

1. Extracts issue number from branch name (e.g., `feat/ATLAS-12` → `#12`)
2. Auto-generates PR description:
   - Summary with linked issue title
   - Changes list from commit messages
   - File change stats
   - `Closes #<number>` link
3. Assigns the PR to the configured author
4. Copies labels from the linked issue to the PR
5. Adds the PR to the configured GitHub Project board

---

## Create Branch from Issue (`create-branch.yml`)

Auto-creates a feature branch when an issue is labeled `ready-for-dev`.

| Trigger | Issue labeled with `ready-for-dev` |
|---|---|
| Config | Reads `project-prefix` and `branches.development` from `.dev-kit.yml` |

### How It Works

1. Reads the project prefix from `.dev-kit.yml`
2. Determines branch type from issue labels (see [conventions](conventions.md#label-to-type-mapping-auto-creation))
3. Creates branch `{type}/{PREFIX}-{zero-padded-number}` from the development branch
4. Comments on the issue with checkout instructions
5. Skips if the branch already exists

---

## Issue Auto-Assign (`issue-auto-assign.yml`)

Automatically assigns new issues and adds them to the project board.

| Trigger | Issue opened |
|---|---|
| Config | Reads `assignee` and `github-project-number` from `.dev-kit.yml` |

### What It Does

1. Assigns the issue to the configured author
2. Adds the issue to the configured GitHub Project board

This ensures every issue — whether created via GitHub UI, CLI, or API — is always assigned and tracked.

---

## Dependabot (`dependabot.yml`)

Automated dependency update PRs.

| Schedule | Weekly on Mondays |
|---|---|
| Target branch | `develop` |
| PR limit | 10 (npm) |

### Ecosystems

| Ecosystem | Commit prefix | For |
|---|---|---|
| `npm` | `build(deps):` | JS/TS projects |
| `github-actions` | `ci(deps):` | All projects |
| `pub` | `build(deps):` | Flutter (uncommented by setup script) |

---

## CLI Script: Create Issue (`scripts/create-issue.sh`)

Create GitHub issues from the terminal with auto-assignment and project board integration.

### Usage

```bash
bash scripts/create-issue.sh --type feat --title "add user authentication"
bash scripts/create-issue.sh --type fix --title "login redirect broken" --labels "bug,priority-high"
bash scripts/create-issue.sh --type chore --title "update deps" --body "Bump all to latest"
```

### Options

| Flag | Required | Description |
|---|---|---|
| `--type` | Yes | Issue type (feat, fix, chore, docs, etc.) |
| `--title` | Yes | Issue title |
| `--body` | No | Issue description |
| `--labels` | No | Comma-separated labels (auto-mapped from type if omitted) |

### Auto-Mapped Labels

| Type | Default Label |
|---|---|
| `feat` | `enhancement` |
| `fix` / `hotfix` | `bug` |
| `docs` | `documentation` |
| `chore` | `chore` |

### Configuration

Reads from `.dev-kit.yml`:
- `github-repo` — target repository
- `assignee` — always assigned to this user
- `github-project-number` — added to this project board
