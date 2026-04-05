# dev-kit

A reusable development toolkit that bootstraps any project with standardized workflows, pre-commit hooks, linting configs, testing, Docker, error monitoring, and GitHub automation — regardless of framework.

## Supported Frameworks

- **Next.js**
- **React** (Vite)
- **React Native**
- **Vue.js**
- **Flutter** (Dart)

## What's Included

| Component | Description |
|---|---|
| `.dev-kit.yml` | Per-project config (prefix, repo, assignee, framework) |
| **GitHub Workflows** | CI, PR validation, branch naming, auto-fill, issue automation, E2E, update checker |
| **Pre-commit Hooks** | Lint-staged, commitlint, kebab-case file name enforcement |
| **Linting Configs** | ESLint (JS/TS) or analysis_options (Flutter), Prettier |
| **Unit Testing** | Vitest (Next.js, React, Vue), Jest (React Native), built-in (Flutter) |
| **E2E Testing** | Playwright (all web frameworks), integration_test (Flutter) |
| **Docker** | Dockerfile, docker-compose, nginx (Next.js, React, Vue) |
| **Error Monitoring** | Sentry integration templates for all frameworks |
| **Issue/PR Templates** | Bug report, feature request, chore (YAML form-based) |
| **Dependabot** | Automated dependency updates (npm, GitHub Actions, pub) |
| **Setup Script** | Interactive bootstrapping for new projects |
| **Update Script** | Selective template updates with diff preview |
| **CLI (npx)** | `npx @ninanathalie/dev-kit init` / `update` / `create-issue` |

## Installation

### Via npx (recommended for JS/TS projects)

No installation needed — run directly:

```bash
npx @ninanathalie/dev-kit init
```

### Via bash scripts (Flutter or without npm)

```bash
git clone https://github.com/ninanathalie/dev-kit.git
bash /path/to/dev-kit/scripts/setup.sh
```

## Quick Start

### 1. Bootstrap a New Project

```bash
# Using npx
npx @ninanathalie/dev-kit init

# Or using bash
bash /path/to/dev-kit/scripts/setup.sh
```

The script will prompt you for:
- **Framework** (nextjs, react, react-native, vue, flutter)
- **Project prefix** (e.g., ATLAS, TEMPO)
- **GitHub repo** (e.g., ninanathalie/atlas)
- **GitHub Project board number**
- **Assignee** (GitHub username)
- **Main branch** (default: main)
- **Development branch** (default: develop)

It generates `.dev-kit.yml` and copies all relevant templates into your project.

### 2. Update an Existing Project

When dev-kit templates are updated, pull the latest changes:

```bash
# Using npx
npx @ninanathalie/dev-kit update

# Or using bash
bash /path/to/dev-kit/scripts/update.sh
```

The script compares your files against the latest templates, shows a diff, and lets you accept or skip each change individually. Projects also get a `check-devkit-updates.yml` workflow that runs weekly and opens an issue if updates are available.

### 3. Create Issues from the Terminal

```bash
# Using npx
npx @ninanathalie/dev-kit create-issue --type feat --title "add user authentication"

# Or using bash
bash scripts/create-issue.sh --type feat --title "add user authentication"
bash scripts/create-issue.sh --type fix --title "login redirect broken" --labels "bug,priority-high"
```

Issues are auto-assigned and added to your project board.

## Project Structure

```
dev-kit/
├── README.md
├── package.json                       # npm package config (@ninanathalie/dev-kit)
├── bin/
│   └── dev-kit.js                     # CLI entry point (npx support)
├── .github/
│   └── workflows/                     # Dev-kit's own CI (self-sustained)
│       ├── ci.yml                     #   Kebab-case, shellcheck, yamllint
│       ├── pr-title.yml               #   PR title validation
│       └── branch-naming.yml          #   Branch name validation
├── templates/
│   ├── common/                        # Framework-agnostic (all projects)
│   │   ├── .dev-kit.example.yml
│   │   ├── .editorconfig
│   │   ├── .prettierrc.mjs
│   │   ├── .env.sentry.example
│   │   ├── commitlint.config.mjs
│   │   ├── lint-staged.config.mjs
│   │   ├── .husky/
│   │   │   ├── pre-commit
│   │   │   └── commit-msg
│   │   ├── scripts/
│   │   │   ├── check-kebab-case.sh
│   │   │   └── create-issue.sh
│   │   └── .github/
│   │       ├── dependabot.yml
│   │       ├── ISSUE_TEMPLATE/
│   │       │   ├── bug-report.yml
│   │       │   ├── feature-request.yml
│   │       │   ├── chore.yml
│   │       │   └── config.yml
│   │       └── workflows/
│   │           ├── pr-title.yml
│   │           ├── branch-naming.yml
│   │           ├── pr-autofill.yml
│   │           ├── create-branch.yml
│   │           ├── issue-auto-assign.yml
│   │           ├── e2e.yml
│   │           └── check-devkit-updates.yml
│   ├── nextjs/                        # Next.js specific
│   │   ├── .gitignore
│   │   ├── eslint.config.mjs
│   │   ├── vitest.config.ts
│   │   ├── vitest.setup.ts
│   │   ├── playwright.config.ts
│   │   ├── sentry.config.ts
│   │   ├── Dockerfile
│   │   ├── .dockerignore
│   │   ├── docker-compose.yml
│   │   └── .github/workflows/ci.yml
│   ├── react/                         # React (Vite) specific
│   │   ├── .gitignore
│   │   ├── eslint.config.mjs
│   │   ├── vitest.config.ts
│   │   ├── vitest.setup.ts
│   │   ├── playwright.config.ts
│   │   ├── sentry.config.ts
│   │   ├── Dockerfile
│   │   ├── .dockerignore
│   │   ├── docker-compose.yml
│   │   ├── nginx.conf
│   │   └── .github/workflows/ci.yml
│   ├── react-native/                  # React Native specific
│   │   ├── .gitignore
│   │   ├── eslint.config.mjs
│   │   ├── jest.config.ts
│   │   ├── playwright.config.ts
│   │   ├── sentry.config.ts
│   │   └── .github/workflows/ci.yml
│   ├── vue/                           # Vue.js specific
│   │   ├── .gitignore
│   │   ├── eslint.config.mjs
│   │   ├── vitest.config.ts
│   │   ├── vitest.setup.ts
│   │   ├── playwright.config.ts
│   │   ├── sentry.config.ts
│   │   ├── Dockerfile
│   │   ├── .dockerignore
│   │   ├── docker-compose.yml
│   │   ├── nginx.conf
│   │   └── .github/workflows/ci.yml
│   └── flutter/                       # Flutter/Dart specific
│       ├── .gitignore
│       ├── analysis_options.yaml
│       ├── lint-staged.config.mjs
│       ├── sentry-config.dart
│       └── .github/workflows/ci.yml
├── scripts/
│   ├── setup.sh                       # Interactive setup script
│   └── update.sh                      # Selective template updater
└── docs/
    ├── workflows.md
    └── conventions.md
```

## Development Workflow

```
1. Create issue     → via GitHub template or CLI script
2. Label ready      → add "ready-for-dev" label → branch auto-created
3. Develop          → pre-commit hooks enforce lint, format, kebab-case, commits
4. Open PR          → auto-filled description, validated title/branch, CI runs
5. Merge            → issue auto-closed, project board updated
```

## CI per Framework

| Framework | CI Steps |
|---|---|
| **Next.js** | Type check → ESLint → Build |
| **React** | Type check → ESLint → Build |
| **React Native** | Type check → ESLint |
| **Vue** | vue-tsc → ESLint → Build |
| **Flutter** | dart analyze → flutter test → flutter build |

## Testing

| Framework | Unit Testing | E2E Testing |
|---|---|---|
| **Next.js** | Vitest | Playwright |
| **React** | Vitest | Playwright |
| **React Native** | Jest | Playwright (web) / Detox (native) |
| **Vue** | Vitest | Playwright |
| **Flutter** | flutter test (built-in) | integration_test (built-in) |

## Docker

Available for web-deployable frameworks (React Native and Flutter use native build tooling):

| Framework | Production Setup | Dev Command |
|---|---|---|
| **Next.js** | Multi-stage → standalone Node.js | `docker compose --profile dev up` |
| **React** | Multi-stage → nginx | `docker compose --profile dev up` |
| **Vue** | Multi-stage → nginx | `docker compose --profile dev up` |

## Error Monitoring (Sentry)

Each framework has a ready-to-use Sentry config. Free tier: 5,000 errors/month.

```bash
# Add your DSN to .env (see .env.sentry.example for variable names per framework)
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/0   # Next.js
VITE_SENTRY_DSN=https://your-dsn@sentry.io/0          # React / Vue
```

## Conventions

- **File names**: kebab-case (`user-profile.tsx`, not `UserProfile.tsx`)
- **Branch names**: `{type}/{PREFIX}-{number}` (e.g., `feat/ATLAS-12`)
- **Commit messages**: `type(scope): message` (e.g., `feat(auth): add login endpoint`)
- **PR titles**: Same as commit message format

See [docs/conventions.md](docs/conventions.md) for full details.

## Keeping Projects Updated

Projects bootstrapped with dev-kit check for updates automatically via the `check-devkit-updates.yml` workflow (runs weekly). When updates are detected, an issue is opened in your project repo.

To manually update:

```bash
# Using npx
npx @ninanathalie/dev-kit update

# Or using bash
bash /path/to/dev-kit/scripts/update.sh
```

## License

MIT
