# dev-kit

A reusable development toolkit that bootstraps any project with standardized workflows, pre-commit hooks, linting configs, and GitHub automation — regardless of framework.

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
| **GitHub Workflows** | CI, PR validation, branch naming, auto-fill, issue automation |
| **Pre-commit Hooks** | Lint-staged, commitlint, kebab-case file name enforcement |
| **Linting Configs** | ESLint (JS/TS) or analysis_options (Flutter), Prettier |
| **Issue/PR Templates** | Bug report, feature request, chore, PR template |
| **Dependabot** | Automated dependency updates |
| **Setup Script** | Interactive bootstrapping for new projects |

## Quick Start

1. Clone this repo:
   ```bash
   git clone https://github.com/ninanathalie/dev-kit.git
   ```

2. From your target project directory, run the setup script:
   ```bash
   bash /path/to/dev-kit/scripts/setup.sh
   ```

3. The script will prompt you for:
   - **Framework** (nextjs, react, react-native, vue, flutter)
   - **Project prefix** (e.g., ATLAS, TEMPO)
   - **GitHub repo** (e.g., ninanathalie/atlas)
   - **GitHub Project board number**
   - **Assignee** (GitHub username)

4. It generates `.dev-kit.yml` and copies all relevant templates into your project.

## Project Structure

```
dev-kit/
├── README.md
├── templates/
│   ├── common/                        # Framework-agnostic (all projects)
│   │   ├── .dev-kit.example.yml
│   │   ├── .editorconfig
│   │   ├── .prettierrc.mjs
│   │   ├── commitlint.config.mjs
│   │   ├── .husky/
│   │   │   ├── pre-commit
│   │   │   └── commit-msg
│   │   ├── scripts/
│   │   │   └── check-kebab-case.sh
│   │   └── .github/
│   │       ├── dependabot.yml
│   │       ├── pull_request_template.md
│   │       ├── ISSUE_TEMPLATE/
│   │       │   ├── bug-report.yml
│   │       │   ├── feature-request.yml
│   │       │   └── chore.yml
│   │       └── workflows/
│   │           ├── pr-title.yml
│   │           ├── branch-naming.yml
│   │           ├── pr-autofill.yml
│   │           ├── create-branch.yml
│   │           └── issue-auto-assign.yml
│   ├── nextjs/                        # Next.js specific
│   │   ├── .gitignore
│   │   ├── eslint.config.mjs
│   │   └── .github/workflows/ci.yml
│   ├── react/                         # React (Vite) specific
│   │   ├── .gitignore
│   │   ├── eslint.config.mjs
│   │   └── .github/workflows/ci.yml
│   ├── react-native/                  # React Native specific
│   │   ├── .gitignore
│   │   ├── eslint.config.mjs
│   │   └── .github/workflows/ci.yml
│   ├── vue/                           # Vue.js specific
│   │   ├── .gitignore
│   │   ├── eslint.config.mjs
│   │   └── .github/workflows/ci.yml
│   └── flutter/                       # Flutter/Dart specific
│       ├── .gitignore
│       ├── analysis_options.yaml
│       └── .github/workflows/ci.yml
├── scripts/
│   └── setup.sh                       # Interactive setup script
└── docs/
    ├── workflows.md
    └── conventions.md
```

## Development Workflow

1. **Create issue** → via GitHub template or CLI script
2. **Label `ready-for-dev`** → branch auto-created (`feat/PREFIX-01`)
3. **Develop** → pre-commit hooks enforce lint, format, kebab-case, conventional commits
4. **Open PR** → auto-filled, validated, CI runs
5. **Merge** → issue auto-closed

## Conventions

- **File names**: kebab-case (`user-profile.tsx`, not `UserProfile.tsx`)
- **Branch names**: `{type}/{PREFIX}-{number}` (e.g., `feat/ATLAS-12`)
- **Commit messages**: `type(scope): message` (e.g., `feat(auth): add login endpoint`)
- **PR titles**: Same as commit message format

## License

MIT
