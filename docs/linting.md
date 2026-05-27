# Linting & pre-commit checks

## Commands

| Script | Purpose |
|--------|---------|
| `npm run lint` | ESLint entire project (errors + warnings) |
| `npm run lint:errors` | ESLint errors only (`--quiet`) |
| `npm run lint:strict` | ESLint with zero warnings (full cleanup / CI goal) |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run typecheck` | `tsc --noEmit` on full project |
| `npm run validate` | `lint:strict` + `typecheck` |

## Pre-commit (Husky + lint-staged)

On every `git commit`, **staged** `*.ts` / `*.tsx` files must pass:

1. **ESLint** (`--fix --quiet`) — only **errors** in staged files block the commit (warnings are OK)

`lint-staged` does **not** run full-project `tsc` (imports pull in the whole app and fail on legacy errors elsewhere). Run `npm run typecheck` locally or in CI before release.

Unstaged files are not checked. Fix errors in files you touch before committing.

## TypeScript rules (highlights)

- No `any`
- `import type` for type-only imports
- No unused vars (prefix with `_` to ignore)
- `react-hooks/exhaustive-deps` as error
- Strict `===` (`eqeqeq`)

## Bypass (emergency only)

```bash
git commit --no-verify
```

Do not use routinely; CI should run `npm run validate` when added.
