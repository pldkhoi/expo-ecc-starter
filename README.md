# expo-ecc-starter

A production-ready Expo SDK 55 boilerplate with auth scaffold, data layer, theme system, sample tests, and Claude Code AI tooling wired in.

**Stack:** Expo SDK 55 · Expo Router 6 · React 19.2 · React Native 0.83 · TypeScript 5.9 strict · Zustand 5 · TanStack Query 5 · React Hook Form + Zod · Bun 1.3 · AgentShield 1.4

[![CI](https://github.com/affaan-m/everything-claude-code/actions/workflows/ci.yml/badge.svg)](https://github.com/affaan-m/everything-claude-code/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2055-000020.svg?logo=expo)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)

## Quickstart

```bash
# 1. Clone the template
bunx degit affaan-m/everything-claude-code/expo-ecc-starter my-app
cd my-app

# 2. Install dependencies and rebrand
bun install
bun init                  # interactive: name, bundle ID, scheme, primary color

# 3. Run
bun dev                   # press w (web), i (iOS), or a (Android)
```

## What is included

### Stack

- **Routing**: Expo Router 6 with typed routes, `Stack.Protected` auth gating, file-based layouts
- **State**: Zustand 5 + selectors, persistence via `expo-secure-store` (auth) and AsyncStorage (theme)
- **Data**: TanStack Query 5 + persisted cache + retry strategy that honors auth/HTTP semantics
- **Forms**: React Hook Form + Zod, with shared schemas in `src/lib/validation.ts`
- **UI**: themed primitives (`Button`, `Card`, `Input`, `Spinner`) + lucide icons + safe-area aware screens
- **Errors**: root-level `<ErrorBoundary>` with a dev red-box / prod friendly fallback

### Features

- **Auth**: mock sign-in / sign-up screens, `useAuthStore` with secure-store persistence, route-level guard
- **Theme**: light / dark / system preference, persisted, hot-swappable in Settings tab
- **Modal example**: dedicated `(modal)` group demonstrating `presentation: 'modal'` + `router.dismiss()`
- **404**: `+not-found.tsx` with deep-link safety

### Developer experience

- TypeScript strict + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes`
- ESLint 9 flat config (`eslint-config-expo`) + Prettier 3 + EditorConfig
- husky + lint-staged pre-commit (eslint --fix + prettier --write on staged files)
- VS Code workspace settings (format-on-save, recommended extensions)
- GitHub templates: bug report, feature request, PR template
- Dependabot: weekly grouped updates for Expo, TanStack, testing libs
- CI: lint + type-check + format-check + tests + coverage upload + AgentShield scan
- `bun init` rewrites the project identity in one command

### Testing

- Jest 29 + `jest-expo` preset + `@testing-library/react-native`
- Provider-wrapping `renderWithProviders` helper in `src/test-utils/`
- Sample tests for Button, auth store, API client, validation schemas, theme provider, sign-in screen
- Coverage threshold: 60% (raise to 80% as the codebase grows)
- Maestro `.maestro/smoke.yaml` covers launch → sign in → tabs → sign out

### AI tooling (Claude Code)

- 15 specialized agents (`code-reviewer`, `a11y-architect`, `e2e-runner`, `react-native-build-resolver`, …)
- 15 slash commands (`/plan`, `/code-review`, `/build-fix`, `/feature-dev`, …)
- 23 skills (Expo Router, SafeArea, Zustand, RN performance, Detox patterns, …)
- 1 pre-edit hook that blocks `EXPO_PUBLIC_*` secret leakage
- AgentShield (`ecc-agentshield`) wired into `bun security:scan`
- Cursor IDE mirror under `.cursor/rules/`

## Project structure

```
expo-ecc-starter/
├── app/                       Expo Router routes
│   ├── _layout.tsx            Root: providers + Stack.Protected auth gate
│   ├── +not-found.tsx
│   ├── (auth)/                Auth group (sign-in, sign-up)
│   ├── (modal)/               Modal group (example)
│   └── (tabs)/                Tabs group (home, settings)
├── src/
│   ├── components/            Reusable components
│   │   ├── ui/                Button, Card, Input, Spinner
│   │   ├── icons.ts           Curated lucide re-exports
│   │   ├── error-boundary.tsx
│   │   ├── ThemedText.tsx
│   │   └── ThemedView.tsx
│   ├── hooks/                 Custom hooks
│   ├── lib/                   api, query-client, secure-storage, validation, format-date
│   ├── providers/             QueryProvider
│   ├── stores/                Zustand stores (auth-store)
│   ├── test-utils/            renderWithProviders helper
│   └── theme/                 theme, theme-provider, colors
├── assets/                    icon, splash, adaptive-icon, favicon
├── docs/                      ARCHITECTURE, SETUP, TESTING, RELEASING, DECISIONS
├── scripts/                   init-template.ts (project rebrand)
├── __mocks__/                 jest manual mocks (expo-secure-store)
├── .maestro/                  E2E smoke flow
├── .claude/                   Claude Code agents, commands, skills, rules, hooks
├── .github/                   workflows + issue/PR templates + dependabot
├── .husky/                    pre-commit hook (lint-staged)
├── .vscode/                   workspace settings + recommended extensions
└── jest.config.js, jest.setup.ts
```

## Scripts

| Command                                                             | What it does                                                                   |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `bun init`                                                          | Interactive: rename project, set bundle IDs, primary color, optional git reset |
| `bun dev`                                                           | `expo start` — Metro on port 8081 (press `w`/`i`/`a`)                          |
| `bun ios` / `bun android` / `bun web`                               | Platform-specific dev start                                                    |
| `bun lint` / `bun lint:fix`                                         | ESLint (read-only / autofix)                                                   |
| `bun format` / `bun format:check`                                   | Prettier (write / verify)                                                      |
| `bun type-check`                                                    | `tsc --noEmit`                                                                 |
| `bun test`                                                          | Jest watch mode                                                                |
| `bun test:ci`                                                       | Jest with coverage (used by CI)                                                |
| `bun test:coverage`                                                 | Jest with coverage, no CI flag                                                 |
| `bun e2e:maestro`                                                   | Run all `.maestro/` flows                                                      |
| `bun security:scan` / `bun security:scan:full` / `bun security:fix` | AgentShield (high-severity gate / full report / autofix)                       |
| `bun run prebuild` / `bun run prebuild:clean`                       | Expo prebuild (generate ios/android)                                           |
| `bun clean`                                                         | Wipe `.expo`, `dist`, `node_modules`, native folders, coverage                 |

When adding a dependency, use `bunx expo install <pkg>` (NOT `bun add <pkg>`) so Expo picks the SDK-compatible version.

## Customization checklist

After `bun init`:

- [ ] Replace placeholder icon, splash, adaptive icon in `assets/` (1024×1024 PNGs)
- [ ] Edit `src/theme/theme.ts` to set your brand palette
- [ ] Swap the mock `signIn` in `app/(auth)/sign-in.tsx` with a real network call
- [ ] Point `EXPO_PUBLIC_API_URL` in `.env.local` at your backend
- [ ] Update `.maestro/smoke.yaml`'s `appId` to your bundle ID
- [ ] Replace this `README.md` with your project README (the `bun init` script does this automatically)
- [ ] Decide on a license — `LICENSE` ships MIT; replace if your project differs

## Documentation

- [`CLAUDE.md`](CLAUDE.md) — workflow, conventions, AI agent orchestration
- [`AGENTS.md`](AGENTS.md) — full agent roster
- [`RULES.md`](RULES.md) — top-level rules
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — folder layout rationale, data flow
- [`docs/SETUP.md`](docs/SETUP.md) — new-developer onboarding
- [`docs/TESTING.md`](docs/TESTING.md) — unit + E2E guide
- [`docs/RELEASING.md`](docs/RELEASING.md) — version bump + EAS Build
- [`docs/DECISIONS.md`](docs/DECISIONS.md) — architecture decision log
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — workflow + commit conventions
- [`SECURITY.md`](SECURITY.md) — vulnerability reporting
- [`.claude/README.md`](.claude/README.md) — AI tooling inventory

## Environment variables

- `EXPO_PUBLIC_*` is bundled into the JS that ships with every install. **Never** assign a secret behind that prefix.
- The pre-edit hook at `.claude/hooks/scripts/expo-public-env-guard.mjs` blocks Write / Edit calls that try to.
- Server-only / EAS secrets: drop the prefix and read from a server you own, or store in EAS Secrets.

See [`.env.example`](.env.example).

## Adding more ECC assets

This starter ships a curated subset of [Everything Claude Code](https://github.com/affaan-m/everything-claude-code). When you need a skill, agent, or command that is not here:

```bash
# One-time: clone ECC anywhere on disk
git clone https://github.com/affaan-m/everything-claude-code.git ~/everything-claude-code

# Point ECC at your clone and copy assets in
export ECC=~/everything-claude-code
cp -R "$ECC/skills/<skill-name>" .claude/skills/
cp "$ECC/agents/<agent-name>.md" .claude/agents/
cp "$ECC/commands/<command-name>.md" .claude/commands/
```

Or install ECC as a Claude Code plugin (`/plugin marketplace add affaan-m/everything-claude-code` then `/plugin install ecc`) to pull in all 230+ skills, 60+ agents, and 75+ commands.

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md). Pull requests are welcome.

## License

[MIT](LICENSE) — Copyright (c) 2026 Khoi Pham.
