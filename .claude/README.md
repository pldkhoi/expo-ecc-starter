# `.claude/` — curated Claude Code assets for an Expo SDK 55 + React Native project

This folder ships a React-Native-focused subset of [Everything Claude Code](https://github.com/affaan-m/everything-claude-code) (ECC). The full ECC plugin has 60 agents, 230 skills, 75 slash commands, and a deep hook stack — most of it is irrelevant to a React Native app (Swift / Kotlin / Flutter / Java / Django / FastAPI / etc.). This curated set keeps the context window slim and focused on mobile.

## Inventory

### Slash commands (15) — `commands/`

- `plan.md` — restate requirements, assess risks, produce step-by-step plan
- `aside.md` — quick side-question without polluting the working context
- `code-review.md` — review the current diff or a PR
- `build-fix.md` — Expo / React Native build triage via `react-native-build-resolver`
- `feature-dev.md` — guided feature development flow
- `refactor-clean.md` — code cleanup and refactoring
- `skill-create.md` — generate `SKILL.md` from recent git activity
- `learn.md` — extract reusable patterns from the current session
- `checkpoint.md` — commit a workflow checkpoint
- `security-scan.md` — run AgentShield against the repo
- `test-coverage.md` — coverage reporting
- `harness-audit.md` — score the repo's AI-agent setup
- `ecc-guide.md` — interactive docs navigator for ECC
- `auto-update.md` — pull latest ECC into your plugin tree
- `cost-report.md` — token / cost report

### Agents (15) — `agents/`

See `../AGENTS.md` for orchestration chains. Quick list:

- **Generic** — `planner`, `code-architect`, `code-explorer`, `refactor-cleaner`, `doc-updater`, `docs-lookup`, `typescript-reviewer`, `tdd-guide`, `silent-failure-hunter`
- **React Native-tuned** — `code-reviewer`, `a11y-architect`, `e2e-runner`, `performance-optimizer`, `security-reviewer`
- **New** — `react-native-build-resolver` (Metro / Expo prebuild / EAS / Reanimated babel / JDK / Pods triage)

### Skills (22) — `skills/`

| Skill                            | Source    | Notes                                                     |
| -------------------------------- | --------- | --------------------------------------------------------- |
| `accessibility/`                 | rewritten | Mobile-first entry; links to deep guides                  |
| `react-native-accessibility/`    | new       | Full a11y props matrix + iOS/Android specifics            |
| `react-native-performance/`      | new       | FlatList, memoization, expo-image, Reanimated, Hermes     |
| `expo-router-patterns/`          | new       | File-based routes, typed routes, deep links, modals       |
| `zustand-store-patterns/`        | new       | Selectors mandatory, SecureStore-backed persist           |
| `safe-area-patterns/`            | new       | Root provider once, useSafeAreaInsets preferred           |
| `expo-secure-store/`             | new       | Token storage, Keychain / EncryptedSharedPrefs, migration |
| `detox-e2e-patterns/`            | new       | Detox setup, selectors, flake handling, vs Maestro        |
| `api-design/`                    | ECC       | REST patterns (when adding a backend)                     |
| `api-connector-builder/`         | ECC       | Third-party API integration                               |
| `architecture-decision-records/` | ECC       | ADR workflow                                              |
| `agent-architecture-audit/`      | ECC       | Audit your AI-agent harness                               |
| `coding-standards/`              | ECC       | Generic standards                                         |
| `error-handling/`                | ECC       | Typed errors, retries, circuit breakers                   |
| `tdd-workflow/`                  | ECC       | TDD discipline                                            |
| `verification-loop/`             | ECC       | Verification gates after a change                         |
| `security-review/`               | ECC       | Security review checklist                                 |
| `security-scan/`                 | ECC       | AgentShield workflow                                      |
| `frontend-patterns/`             | ECC       | Generic frontend patterns                                 |
| `design-system/`                 | ECC       | Design system principles                                  |
| `bun-runtime/`                   | ECC       | Bun-specific patterns                                     |
| `git-workflow/`                  | ECC       | Git best practices                                        |
| `documentation-lookup/`          | ECC       | Doc lookup workflow                                       |

### Rules — `rules/`

- `common/` — security baseline, git workflow, agent conventions, generic coding style (ECC)
- `typescript/` — TypeScript-specific (ECC)
- `expo/`
  - `expo-router.md` — file-based routing conventions
  - `performance.md` — Hermes, New Architecture, bundle hygiene
- `react-native/`
  - `components.md` — Pressable preferred, list discipline, styling
  - `hooks.md` — custom hook conventions, subscription cleanup
  - `state-zustand.md` — selectors mandatory, SecureStore-backed persist
  - `accessibility.md` — mobile a11y mandatory props
  - `safe-area.md` — provider rules, per-edge guidance
  - `testing.md` — Jest + @testing-library/react-native, fake timers

### Hook — `hooks/scripts/expo-public-env-guard.mjs`

Wired in `settings.json`. Blocks `Write` / `Edit` / `MultiEdit` calls that would assign a secret-looking value to an `EXPO_PUBLIC_*` env var. Expo inlines `EXPO_PUBLIC_*` into the JS bundle that ships with every install — secrets behind that prefix are an immediate leak.

The guard matches:

- Known secret prefixes: `sk_`, `pk_live_`, `AKIA`, `ghp_`, `gho_`, `sk-ant-api03-`, `sk-ant-`, `sk-proj-`, `glpat-`, `xoxb-`, `xoxp-`, `xapp-`, `hf_`, `nvapi-`, `EAACE`, `EAAG`, …
- High-entropy tokens (≥40 alphanumeric chars with mixed case / digits)
- Words like `secret`, `private_key`, `service_role`, `jwt_secret`, `api_key`, `password`

### Settings — `settings.json`

- **Allow** — common `bun`, `bun expo`, `npx expo`, `eas`, `detox`, `maestro`, `git`, `gh`, `ls` / `grep` / `find` operations
- **Deny** — `rm -rf /*`, `git push --force`, `git reset --hard`, `git commit --no-verify`, `sudo`, piped-curl-to-shell
- **Hook** — `pre:edit-write:expo-public-env-guard` (above)

> **Known AgentShield false positive:** `bun security:scan` flags the literal `--no-verify` token inside the `deny` block of `settings.json` as a CRITICAL finding. This is intentional — we are explicitly DENYING that flag, not allowing it. The scanner's regex doesn't differentiate. Leave as-is; do NOT remove the deny rule.

## Adding more ECC assets

Need something not curated? Clone [Everything Claude Code](https://github.com/affaan-m/everything-claude-code) and copy what you need:

```bash
# One-time: clone ECC anywhere on disk
git clone https://github.com/affaan-m/everything-claude-code.git ~/everything-claude-code

# Then point ECC at your clone and copy assets in
export ECC=~/everything-claude-code

# A skill
cp -R "$ECC/skills/<skill-name>" .claude/skills/

# An agent
cp "$ECC/agents/<agent-name>.md" .claude/agents/

# A command
cp "$ECC/commands/<command-name>.md" .claude/commands/
```

If you `expo prebuild` and start writing custom native modules, consider pulling these:

```bash
cp -R "$ECC/skills/swiftui-patterns" .claude/skills/
cp -R "$ECC/skills/swift-concurrency-6-2" .claude/skills/
cp -R "$ECC/skills/kotlin-patterns" .claude/skills/
cp -R "$ECC/skills/compose-multiplatform-patterns" .claude/skills/
```

Or install ECC as a Claude Code plugin:

```text
/plugin marketplace add affaan-m/everything-claude-code
/plugin install ecc
```

That installs the full 365-asset stack without touching this repo.

## Project conventions

The repo-level `CLAUDE.md` is the single source of truth for the workflow (Plan → Test → Code → Verify → Commit) and the stack. The `.cursor/rules/` directory mirrors the engineering rules for the Cursor IDE.
