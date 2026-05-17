# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.3.1] - 2026-05-17

### Fixed

- **ci(security:scan)** — wrap the AgentShield invocation in `scripts/security-gate.sh` so that ecc-agentshield's unconditional exit code 2 on baselined CRITICAL findings is translated to exit 0 when the gate reports `Gate: PASSED — No regressions detected`. Real regressions (exit code 3) still fail the build. Root cause: `ecc-agentshield@1.4` exits 2 whenever `summary.critical > 0`, regardless of baseline status — and the project carries one false-positive CRITICAL (the `--no-verify` literal inside a `deny` rule in `.claude/settings.json`) that we keep deliberately as a security control.

## [0.3.0] - 2026-05-17

### Added

- **`bun security:scan`** — now compares against a committed baseline (`.agentshield/baseline.json`) via `--baseline … --gate`. CI fails only on NEW regressions; pre-existing ECC 2.0 metadata gaps and the `--no-verify` false positive (literal flag string inside the `deny` list) are recorded as known.
- **`bun security:scan:full`** — full AgentShield report including informational findings.
- **`bun security:scan:update-baseline`** — re-record the baseline after a real fix lands.
- **Interactive setup script** (`scripts/init-template.ts`) — rebrand the project in one command: name, slug, bundle IDs, scheme, primary color, optional git reset.
- **Theme system** (`src/theme/theme.ts`, `src/theme/theme-provider.tsx`, `src/hooks/use-theme.ts`) — typed theme tokens (colors, spacing, radii, fontSizes, fontWeights) with light / dark / system preference persisted in AsyncStorage.
- **Auth scaffold** (mock) — `src/lib/secure-storage.ts` (cross-platform expo-secure-store wrapper), `src/stores/auth-store.ts` (Zustand + persist), `app/(auth)/sign-in.tsx` and `app/(auth)/sign-up.tsx` (RHF + Zod), root-level `Stack.Protected` guard in `app/_layout.tsx`.
- **UI primitives** — `src/components/ui/{Button,Card,Input,Spinner}.tsx` with variants, sizes, accessibility props, 48dp+ touch targets.
- **Icons** — `src/components/icons.ts` re-exporting curated `lucide-react-native` icons for tree-shaking.
- **ErrorBoundary** (`src/components/error-boundary.tsx`) — dev red-box / prod friendly fallback, retry action.
- **Modal example** (`app/(modal)/example.tsx`) — demonstrates `presentation: 'modal'` + `router.dismiss()`.
- **Settings screen** (`app/(tabs)/settings.tsx`) — theme toggle, sign out, modal link, version.
- **API client** (`src/lib/api.ts`) — fetch wrapper with timeout, typed `ApiError`, auto Bearer token, opt-out via `withAuth: false`.
- **TanStack Query 5 + persisted cache** — `src/lib/query-client.ts`, `src/providers/query-provider.tsx`, sample hook `src/hooks/use-pokemon.ts`.
- **React Hook Form + Zod** — `src/lib/validation.ts` with shared `signInSchema` / `signUpSchema`.
- **Test infrastructure** — `jest.config.js`, `jest.setup.ts`, `__mocks__/expo-secure-store.ts`, `src/test-utils/render.tsx` (`renderWithProviders` helper). Coverage threshold seeded at 60%.
- **Sample tests** — Button, auth-store, api, validation, format-date, use-theme, sign-in screen.
- **Maestro smoke flow** — `.maestro/smoke.yaml` covers launch → sign in → tabs → sign out.
- **husky + lint-staged** pre-commit (`eslint --fix` + `prettier --write` on staged files).
- **IDE configs** — `.vscode/{settings,extensions}.json`, `.editorconfig`.
- **GitHub hygiene** — issue templates (bug, feature), PR template, `dependabot.yml` with grouped weekly updates.
- **Community files** — `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`.
- **Docs** — `docs/{ARCHITECTURE,SETUP,TESTING,RELEASING,DECISIONS}.md`.

### Changed

- `app/_layout.tsx` now wraps the tree in `GestureHandlerRootView → ErrorBoundary → SafeAreaProvider → ThemeProvider → QueryProvider` and uses `Stack.Protected` for auth gating.
- `app/(tabs)/_layout.tsx` swaps placeholder tab colors for theme tokens and adds lucide icons.
- `app/(tabs)/index.tsx` rewritten as a feature-tour home screen.
- `app/+not-found.tsx` polished with themed Button.
- `src/components/{ThemedText,ThemedView}.tsx` switched from `useThemeColor` to `useTheme()`.
- `src/hooks/use-color-scheme.ts` now delegates to the theme provider.
- `package.json` — extracted Jest config to `jest.config.js`, added scripts (`init`, `format`, `format:check`, `test:coverage`, `e2e:maestro`, `clean`, `prepare`), `lint-staged` config, deps for TanStack Query, RHF, Zod, lucide, AsyncStorage, husky, lint-staged.
- `.github/workflows/ci.yml` adds `format:check` step and uploads coverage as a CI artifact.
- `README.md` rewritten as a template-focused boilerplate guide.

### Removed

- `src/stores/counter-store.ts` and `app/(tabs)/explore.tsx` — replaced by richer sample code (auth flow, settings, modal).

## [0.2.0] - 2026-05-17

### Added

- MIT `LICENSE`
- GitHub Actions CI workflow (`.github/workflows/ci.yml`) — lint + type-check + test + security:scan on push and pull requests

### Changed

- Documentation portability — replaced hardcoded `/Users/dk/...` paths with a `git clone` + `export ECC=~/everything-claude-code` pattern across `CLAUDE.md`, `AGENTS.md`, `README.md`, and `.claude/README.md`
- Corrected ECC repository URL to `https://github.com/affaan-m/everything-claude-code` and plugin marketplace slug to `affaan-m/everything-claude-code`

## [0.1.0] - 2026-05-16

### Added

- Initial scaffold: Expo SDK 55 + Expo Router 6 + React 19.2 + React Native 0.83 + TypeScript 5.9 strict + Bun 1.3
- New Architecture (Fabric + TurboModules) and Hermes default on
- Expo Router 6 with typed routes (`experiments.typedRoutes: true`) and `Stack.Protected` auth gating pattern
- React Native Reanimated 4 (Worklets API)
- `react-native-safe-area-context`, `react-native-screens`, `react-native-gesture-handler` wired
- Expo modules: `expo-router`, `expo-secure-store`, `expo-image`, `expo-font`, `expo-linking`, `expo-splash-screen`, `expo-status-bar`, `expo-system-ui`, `expo-constants`
- Zustand 5 for global client state (SecureStore-backed persist pattern documented)
- `react-native-web` ~0.21 for web preview
- Jest + `jest-expo` preset + `@testing-library/react-native` + `@testing-library/jest-native` for unit testing
- ESLint 9 with `eslint-config-expo`
- Prettier 3 config
- `.claude/` plugin tree:
  - 15 specialist subagents (incl. `react-native-build-resolver`, `performance-optimizer`)
  - 15 slash commands
  - 22 skills (12 new RN/Expo-specific + 10 ECC reusable)
  - layered rules: `common/` + `typescript/` + `expo/` + `react-native/`
  - `pre:edit-write:expo-public-env-guard` hook that blocks secret-shaped values behind `EXPO_PUBLIC_*` env vars
  - `settings.json` with Bun / Expo / EAS / Detox / Maestro permissions and the guard hook wired
- `CLAUDE.md`, `AGENTS.md`, `RULES.md`, `SOUL.md` for AI-assisted development guidance
- `.env.example`, `.gitignore`, `.mcp.json` for the standard ECC MCP server set
- AgentShield (`ecc-agentshield`) wired via `bun run security:scan` / `security:fix`
