# Agents — Expo SDK 55 starter

> **Heads up — Expo SDK 55 has breaking changes**
>
> - **Expo Router 6** — `Stack.Protected` for auth gating, typed routes stable behind `experiments.typedRoutes: true`, `+not-found.tsx` syntax for 404.
> - **React 19.2 + RN 0.83** — `use(...)`, `<Context.Provider>` shorthand, `forwardRef` no longer needed for many cases.
> - **New Architecture default on** — Fabric + TurboModules. Some legacy native modules still need patching; the `react-native-build-resolver` agent walks the fallback path.
> - **Hermes default on** — bytecode pre-compiled at build time.
> - **react-native-reanimated 4** — Worklets API; v3 worklets still work but the new shared-element API is v4-only.
>
> Read the [Expo SDK 55 changelog](https://expo.dev/changelog) before authoring native module integrations or upgrading dependencies.

## Roster (15 agents)

| Agent | Purpose | When to use |
|---|---|---|
| `planner` | Implementation planning | Complex features, refactors, anything beyond a 2-file change |
| `code-architect` | System design | Choosing between approaches, drawing boundaries between modules |
| `code-explorer` | Read and explain code | Onboarding to an unfamiliar area, debugging where you don't know where to start |
| `code-reviewer` (mobile-tuned) | Code quality + RN/Expo anti-patterns | After writing or modifying any `.ts` / `.tsx`, before staging |
| `typescript-reviewer` | TypeScript-specific issues | Strict-mode violations, type narrowing, generics |
| `a11y-architect` (mobile-tuned) | iOS / Android a11y | Any new touchable, screen, list, modal, animated transition |
| `e2e-runner` (mobile-tuned) | Maestro-first / Detox fallback E2E | Critical user flows, auth, deep links, navigation |
| `performance-optimizer` (mobile-tuned) | JS / UI thread, FlatList, Hermes, bundle | Jank, slow cold start, scroll stutters, bundle bloat |
| `security-reviewer` (mobile-tuned) | Mobile-first then OWASP | Before commits touching auth, tokens, WebView, permissions, native modules, deep links |
| `tdd-guide` | RED → GREEN → REFACTOR | New features, bug fixes, refactors |
| `refactor-cleaner` | Dead code removal | Maintenance passes; only YOUR changes' dead code |
| `doc-updater` | Doc maintenance | Updating CLAUDE.md, AGENTS.md, README, CHANGELOG |
| `docs-lookup` | Find docs for a library / API | When the task references a third-party API |
| `silent-failure-hunter` | Catch errors that don't throw | Unexpected behavior with no error in logs |
| `react-native-build-resolver` (new) | Metro / Expo prebuild / EAS / Reanimated / JDK / Pods triage | Build is broken |

## Orchestration chains

### Pre-commit gate (always)

```
code-reviewer
  → typescript-reviewer
  → a11y-architect            (if any touchable or screen changed)
  → e2e-runner                (if .maestro/ or e2e/ changed)
  → security-reviewer         (always; fast-path is short on clean changes)
```

Resolve every CRITICAL and HIGH before commit. Resolve MEDIUM when feasible.

### New feature

```
code-architect           (only if architectural decision is involved)
  → planner
  → tdd-guide
  → implement
  → pre-commit gate
```

### Build broken

```
/build-fix
  → react-native-build-resolver
  → re-run failing build
```

### Debug

```
code-explorer
  → silent-failure-hunter
  → refactor-cleaner (only after the root cause is fixed)
```

### Performance regression

```
performance-optimizer
  (measure → hypothesize → minimal change → re-measure)
```

## Parallel agent execution

Spawn agents in parallel when their work is independent. Example for a feature touching auth + a new screen + an API client:

```text
Parallel:
  - security-reviewer on the auth flow
  - a11y-architect on the new screen
  - api-connector-builder (skill) for the API client pattern
```

Sequential when one agent's output feeds another (e.g., `code-architect` produces a plan that `planner` then expands).

## Immediate agent usage (no user prompt needed)

1. Complex feature request → `planner`.
2. Code just written / modified → `code-reviewer`.
3. Bug fix or new feature → `tdd-guide`.
4. Architectural decision (which lib, which pattern) → `code-architect`.
5. Build error → `react-native-build-resolver` via `/build-fix`.

## Adding more agents

```bash
# One-time: clone ECC anywhere on disk
git clone https://github.com/affaan-m/everything-claude-code.git ~/everything-claude-code

# Then copy agents in
export ECC=~/everything-claude-code
cp "$ECC/agents/<agent-name>.md" .claude/agents/
```

[Everything Claude Code](https://github.com/affaan-m/everything-claude-code) ships 60+ agents total. Useful adds when you grow:

- `database-reviewer` — when you add Prisma / Drizzle / Supabase
- `network-architect` — when adding push notifications, WebSockets
- `mle-reviewer` — when integrating on-device ML
- `harmonyos-app-resolver` — only for HarmonyOS
- `swift-reviewer` / `kotlin-reviewer` — only after `expo prebuild` and writing custom native code
