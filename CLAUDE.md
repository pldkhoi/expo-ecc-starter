# expo-ecc-starter — Claude Code project guide

Expo SDK 55 (Expo Router 6) + React Native 0.83 + React 19 + TypeScript strict + Zustand 5 + Bun, wired with a React-Native-focused curation of [Everything Claude Code (ECC)](https://github.com/everything-claude-code) plugin assets and AgentShield for AI-agent security scanning.

> See `AGENTS.md` for the Expo SDK 55 breaking-change notes (Expo Router 6, New Architecture default on, Hermes) that apply to every code-writing pass.

## Session start

1. `git log --oneline -5` — orient.
2. Read only the files the current task touches (no speculative pre-loading).
3. Prefer slash commands and agents in `.claude/` over manual reasoning.

## Workflow (MANDATORY)

Every non-trivial task follows this order. Skipping a step requires an explicit reason in chat.

1. **Plan** — `/plan` or a TodoWrite list. State assumptions, files to read / edit, and the success check.
2. **Test** — write or update tests first. Bug fixes always get a regression test (`@testing-library/react-native` for components; Maestro / Detox for E2E flows).
3. **Code** — implement against the plan and the failing tests. Surgical edits only.
4. **Verify** — `bun type-check`, `bun lint`, `bun test`, `bun security:scan`. For UI changes, run `bun expo start` and exercise the screen on web (`w`) or a simulator (`i`/`a`). Capture proof (screenshot, log) when relevant.
5. **Commit** — only after step 4 is green. Stage by name (no `-A` / `.`). Never `--no-verify`. Don't push unless asked.

## Tech stack

- **Expo SDK 55** (Expo Router 6, New Architecture default on, Hermes default)
- **React 19.2** + **React Native 0.83.6**
- **TypeScript 5.9** strict (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)
- **Zustand 5** for client state
- **react-native-safe-area-context 5**, **react-native-reanimated 4**, **react-native-screens 4**, **react-native-gesture-handler 2**
- **expo-image** (preferred over RN Image), **expo-secure-store** (tokens), **expo-router** (typed routes)
- **ESLint 9** flat config (`eslint-config-expo`)
- **Jest 29** + **jest-expo** preset + **@testing-library/react-native 13**
- **Bun 1.3** package manager / runner
- **AgentShield 1.4** for AI-agent security audits
- **Maestro** for E2E (default); **Detox** as fallback

## Path alias

`@/*` → `./src/*` (configured in `tsconfig.json`).

## Environment variables

- `.env.local` for local development.
- **Public** variables (bundled into the JS that ships with every install) MUST be prefixed `EXPO_PUBLIC_`.
- **Never** assign a secret-looking value to an `EXPO_PUBLIC_*` var. The `pre:edit-write:expo-public-env-guard` hook in `.claude/settings.json` blocks the write.
- Server-only / EAS secrets: drop the prefix and read from a server you own, OR store in EAS Secrets for build time.
- See `.env.example` for the split.

## Key commands

```bash
bun dev                  # = bun expo start (Metro on port 8081)
bun ios                  # iOS simulator
bun android              # Android emulator
bun web                  # web target (Metro)
bun lint                 # ESLint
bun type-check           # tsc --noEmit
bun test                 # Jest watch
bun test:ci              # Jest with coverage
bun security:scan        # AgentShield scan of .claude/ + repo
bun security:fix         # AgentShield auto-fix where supported
bun run prebuild         # Expo prebuild (generates ios/ + android/)
bun run prebuild:clean   # Prebuild --clean (wipes hand-edited native)
```

When adding a dependency, use `bunx expo install <pkg>` (NOT `bun add <pkg>`) so Expo picks the SDK-compatible version.

## Claude Code assets (`.claude/`)

| Folder | Contents |
|---|---|
| `.claude/commands/` | 15 slash commands (plan, code-review, build-fix, security-scan, etc.) |
| `.claude/agents/` | 15 specialist subagents (9 generic + 5 mobile-tuned + 1 new) |
| `.claude/skills/` | 22 skills (15 generic ECC + 7 new mobile skills) |
| `.claude/rules/` | common + typescript + expo + react-native rule files |
| `.claude/hooks/scripts/expo-public-env-guard.mjs` | `EXPO_PUBLIC_*` secret guard hook |
| `.claude/settings.json` | permissions + hook wiring |
| `.claude/README.md` | full inventory and orchestration notes |

See `.claude/README.md` for the full inventory and the `cp -R` recipe for pulling more from ECC.

## Most-used slash commands

- `/plan` — restate requirements, surface risks, step-by-step plan
- `/aside` — quick side-question without polluting the working context
- `/code-review` — review the current diff or a PR
- `/build-fix` — Expo / RN build triage via `react-native-build-resolver`
- `/security-scan` — run AgentShield against the repo
- `/feature-dev` — guided feature development flow
- `/checkpoint` — commit a workflow checkpoint
- `/skill-create` — generate a new `SKILL.md` from recent git activity
- `/learn` — extract reusable patterns from the current session
- `/harness-audit` — score the repo's AI-agent setup
- `/ecc-guide` — interactive docs navigator for ECC
- `/auto-update` — pull latest ECC into your plugin tree
- `/cost-report` — token / cost report

## Agent orchestration

- **Pre-commit gate (engineering):** `code-reviewer` → `typescript-reviewer` → `a11y-architect` (any new touchable / screen) → `e2e-runner` (if `.maestro/` or `e2e/` changed) → `security-reviewer`
- **Architecture decisions:** `code-architect`
- **Build broken:** `/build-fix` (delegates to `react-native-build-resolver`)
- **Debug:** `code-explorer` → `silent-failure-hunter` → `refactor-cleaner`
- **Performance regression:** `performance-optimizer`
- **New feature:** `code-architect` → `tdd-guide` → implement → pre-commit gate
- **TDD discipline:** `tdd-guide`
- **Docs drift:** `doc-updater` / `docs-lookup`

See `AGENTS.md` for the full agent roster and the per-agent "when to use" notes.

## Conventions

- **File names:** kebab-case (`use-auth.ts`, `themed-text.tsx`). English only.
- **Component names:** PascalCase function components, no `React.FC`.
- **Hooks:** `use` prefix in camelCase function name, kebab-case file name.
- **Screens:** under `app/` (Expo Router file-based routing).
- **Reusable components:** under `src/components/`.
- **Custom hooks:** under `src/hooks/`.
- **Zustand stores:** under `src/stores/`, one slice per domain, file name `<domain>-store.ts`.
- **Imports:** use `@/` alias, never `../../`.
- **Styling:** `StyleSheet.create` for any reused style; inline allowed for one-off layout tweaks; never inline inside a list row.
- **Touchables:** `Pressable` for new code; every touchable carries `accessibilityRole` + `accessibilityLabel`; touch target ≥ 44pt iOS / 48dp Android.
- **State:** Zustand subscribed with selectors (NEVER destructure the whole store).
- **Server state:** TanStack Query / SWR when added; do NOT store in Zustand.
- **Forms:** React Hook Form + Zod when first needed.
- **URL state:** `useLocalSearchParams` + `router.setParams`.

## Known guardrails

- **No `--no-verify`** on commits.
- **No `git push --force`** to `main`.
- **No `git reset --hard`**.
- **`pre:edit-write:expo-public-env-guard`** blocks `EXPO_PUBLIC_*` secret leaks.
- **No `eval` / `Function(...)` on user input.**
- **Auth tokens go to `expo-secure-store`**, not AsyncStorage.

## Notes on Expo SDK 55

- New Architecture is default on (`app.json: newArchEnabled: true`). If a library breaks, flip it off and run `bun run prebuild:clean`; document the reason.
- Hermes is default on. Verify with `typeof __HERMES_INTERNAL__ !== 'undefined'`.
- Expo Router 6 — typed routes are stable behind `experiments.typedRoutes: true`. Use `Stack.Protected` for auth gating instead of `useEffect` redirects.

## Adding more ECC assets

If you need a skill, agent, or command that wasn't curated into this starter, copy it from `/Users/dk/Documents/GitHub/everything-claude-code/` into `.claude/`:

```bash
ECC=/Users/dk/Documents/GitHub/everything-claude-code
cp -R "$ECC/skills/<skill-name>" .claude/skills/
cp "$ECC/agents/<agent-name>.md" .claude/agents/
cp "$ECC/commands/<command-name>.md" .claude/commands/
```

Or install ECC as a Claude Code plugin (`/plugin marketplace add everything-claude-code` then `/plugin install ecc`) to get all 230 skills + 60 agents + 75 commands + full hook stack.
