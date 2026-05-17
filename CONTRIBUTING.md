# Contributing

Thanks for your interest in improving this project. This guide covers the workflow, conventions, and tooling.

## Quick links

- [`CLAUDE.md`](CLAUDE.md) — workflow, stack, conventions, AI agent orchestration
- [`docs/SETUP.md`](docs/SETUP.md) — full developer setup
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — folder layout, data flow, state ownership
- [`docs/TESTING.md`](docs/TESTING.md) — unit + E2E testing guide
- [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) — community expectations
- [`SECURITY.md`](SECURITY.md) — vulnerability reporting policy

## Workflow (every non-trivial change)

1. **Plan** — open or claim an issue. For features, write a short plan in the PR description.
2. **Test first** — bug fixes always get a regression test; features come with happy-path + 1 edge case.
3. **Code** — surgical edits only, no unrelated cleanup.
4. **Verify** locally before pushing:

   ```bash
   bun type-check
   bun lint
   bun test:ci
   bun security:scan
   ```

5. **Commit** — Conventional Commits format (see below). Stage by filename. Never `--no-verify`.
6. **Pull request** — fill in the PR template, link the issue.

## Development setup

```bash
# Install Bun if missing
curl -fsSL https://bun.sh/install | bash

# Install deps
bun install

# Set up git hooks (husky)
bun run prepare

# Start the dev server
bun dev          # then press w / i / a
```

## Conventional Commits

```
<type>(<optional scope>): <imperative subject>

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`, `build`, `style`.

Examples:

```
feat(auth): add Stack.Protected gate for tabs route
fix(api): timeout fetch after 10s instead of hanging forever
docs(readme): add maestro smoke flow instructions
```

## Coding conventions

The authoritative list is in [`CLAUDE.md`](CLAUDE.md) and `.claude/rules/`. Highlights:

- **File names**: kebab-case (`use-auth.ts`, `themed-text.tsx`)
- **Component names**: PascalCase function components, no `React.FC`
- **Hooks**: `use` prefix, camelCase, file in `src/hooks/`
- **Stores**: one Zustand slice per domain in `src/stores/`, subscribed via selectors
- **Touchables**: `Pressable` with `accessibilityRole` + `accessibilityLabel`; touch target ≥ 44pt iOS / 48dp Android
- **Auth tokens**: `expo-secure-store` only, never AsyncStorage
- **EXPO*PUBLIC*\***: bundled into the JS shipped with every install — never assign a secret

## Testing

- Unit / component: Jest + `@testing-library/react-native`. Locate by role first.
- E2E: Maestro (`.maestro/`) by default; Detox (`e2e/`) when bridge inspection is required.
- Coverage target: 80% lines / branches for `src/` and `app/`.

See [`docs/TESTING.md`](docs/TESTING.md).

## Pre-commit hook

Husky runs `lint-staged` on every commit:

- `*.{ts,tsx}` → `eslint --fix` + `prettier --write`
- `*.{json,md,yaml,yml}` → `prettier --write`

If a hook fails, fix the underlying issue. Do not bypass with `--no-verify` — it is denied in `.claude/settings.json`.

## Pull request review checklist

Reviewers check:

- [ ] CI is green
- [ ] No `EXPO_PUBLIC_*` secret leaks
- [ ] New touchables are accessible
- [ ] New screens use `useSafeAreaInsets` (not double-wrap `SafeAreaView`)
- [ ] Lists use `FlatList` + `keyExtractor` (not `ScrollView` for unbounded data)
- [ ] `console.log` is guarded by `__DEV__`
- [ ] Documentation updated (CLAUDE.md, README.md, docs/\*) when behavior changes

## Adding a dependency

```bash
bunx expo install <pkg>   # picks SDK-compatible version
```

Avoid `bun add <pkg>` for runtime deps unless you know the package has no Expo constraint.

## Releasing

See [`docs/RELEASING.md`](docs/RELEASING.md).

## License

By contributing, you agree your contributions are licensed under the MIT License (see [`LICENSE`](LICENSE)).
