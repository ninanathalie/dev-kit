# Conventions Guide

All projects bootstrapped with dev-kit follow these conventions to maintain consistency across teams and frameworks.

## File Naming — kebab-case

All file and folder names must use **kebab-case**: lowercase letters, numbers, and hyphens.

### Valid

```
user-profile.tsx
auth-service.ts
api-client.dart
app.config.mjs
.prettierrc.mjs
error-404.tsx
```

### Invalid

```
UserProfile.tsx       ← PascalCase
auth_service.ts       ← snake_case
ApiClient.dart        ← PascalCase
appConfig.mjs         ← camelCase
```

### Exceptions

These industry-standard names are always allowed regardless of casing:

- `README.md`, `LICENSE`, `CHANGELOG.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`
- `Makefile`, `Dockerfile`, `Procfile`, `CODEOWNERS`
- Files inside `ISSUE_TEMPLATE/` (GitHub requires this casing)
- Husky hooks (`pre-commit`, `commit-msg` — no extensions by convention)

### Enforcement

- **Pre-commit hook**: `scripts/check-kebab-case.sh` blocks commits with non-kebab-case file names
- **Flutter**: `analysis_options.yaml` enables the `file_names` lint rule

---

## Commit Messages — Conventional Commits

All commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/) format.

### Format

```
type(scope): message
```

- **type**: Required. See allowed types below.
- **scope**: Optional. Must be kebab-case (e.g., `auth`, `user-profile`).
- **message**: Required. Lowercase start, no period at the end.

### Allowed Types

| Type | Description |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `hotfix` | Urgent production fix |
| `chore` | Tooling, config, or maintenance |
| `docs` | Documentation only |
| `style` | Formatting, no logic change |
| `refactor` | Code restructuring without behavior change |
| `test` | Adding or fixing tests |
| `build` | Build system or dependency changes |
| `ci` | CI/CD configuration changes |
| `revert` | Reverting a previous commit |
| `perf` | Performance improvement |

### Examples

```bash
feat(auth): add login endpoint
fix(cart): resolve quantity overflow on checkout
chore: update eslint to v9
docs(api): add rate limiting section to readme
refactor(user-profile): extract validation logic
```

### Enforcement

- **Commit-msg hook**: `commitlint` validates every commit via `.husky/commit-msg`
- **Configuration**: `commitlint.config.mjs`

---

## Branch Naming

All branches must follow this pattern:

```
{type}/{PREFIX}-{number}
```

### Allowed Types

`feat`, `fix`, `hotfix`, `chore`, `docs`, `refactor`, `test`

### Examples

```
feat/ATLAS-12
fix/TEMPO-03
chore/BASE-01
docs/ATLAS-15
```

### Enforcement

- **GitHub Actions**: `branch-naming.yml` validates on every PR
- **Auto-creation**: When an issue is labeled `ready-for-dev`, the `create-branch.yml` workflow auto-creates a correctly named branch

### Label-to-Type Mapping (auto-creation)

| Issue Label | Branch Type |
|---|---|
| `bug` | `fix` |
| `chore` | `chore` |
| `documentation` | `docs` |
| `improvement` | `refactor` |
| _(default)_ | `feat` |

---

## PR Titles

PR titles follow the same format as commit messages:

```
type(scope): message
```

### Examples

```
feat(auth): add login endpoint
fix(cart): resolve quantity overflow on checkout
chore(deps): update eslint to v9
```

### Enforcement

- **GitHub Actions**: `pr-title.yml` validates on every PR opened/edited

---

## Branch Strategy

```
feature branch → develop → main/master
```

| Branch | Purpose |
|---|---|
| `main` / `master` | Production-ready releases |
| `develop` | Integration branch for completed features |
| `feat/PREFIX-XX` | Feature development |
| `fix/PREFIX-XX` | Bug fixes |
| `hotfix/PREFIX-XX` | Urgent production fixes |

### Rules

- Never push directly to `main`/`master` or `develop` — always use PRs
- Feature branches are created from `develop`
- PRs from feature branches target `develop`
- Release PRs from `develop` target `main`/`master`
