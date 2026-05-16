# expo-ecc-starter

Expo SDK 55 starter with Everything Claude Code AI tooling tuned for React Native.

**Stack:** Expo SDK 55 · Expo Router 6 · React 19.2 · React Native 0.83 · TypeScript 5.9 strict · Zustand 5 · Bun 1.3 · AgentShield 1.4

**AI tooling:** 15 Claude Code agents · 15 slash commands · 22 skills · 23 rule files · 1 `EXPO_PUBLIC_*` secret-guard hook · Cursor IDE mirror

## Quickstart

```bash
bun install
cp .env.example .env.local

# Start Metro
bun expo start
#   press i  → iOS simulator
#   press a  → Android emulator
#   press w  → Web (fastest smoke test, no simulator needed)

# Verify
bun type-check
bun lint
bun test
bun security:scan
```

## What's inside

- [`CLAUDE.md`](CLAUDE.md) — single source of truth for the workflow, stack, conventions, agent orchestration, and `EXPO_PUBLIC_*` env policy.
- [`AGENTS.md`](AGENTS.md) — roster of the 15 curated agents, orchestration chains, SDK 55 breaking-change notes.
- [`RULES.md`](RULES.md) — top-level rules plus the React Native section linking each rule file.
- [`SOUL.md`](SOUL.md) — mission and principles.
- [`.claude/README.md`](.claude/README.md) — full inventory of the curated tooling and the `cp -R` recipe to pull more from ECC.
- [`.cursor/rules/`](.cursor/rules/) — flattened mirror of the rule files for Cursor IDE.

## Project layout

```
expo-ecc-starter/
├── app/                       # Expo Router file-based routes
│   ├── _layout.tsx            # Root Stack + SafeAreaProvider
│   ├── +not-found.tsx
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── index.tsx          # Home
│       └── explore.tsx        # FlatList + Zustand counter demo
├── src/
│   ├── components/            # Reusable UI (ThemedText, ThemedView)
│   ├── hooks/                 # Custom hooks (use-color-scheme, use-keyboard)
│   ├── lib/                   # Helpers (format-date)
│   ├── stores/                # Zustand stores (counter-store)
│   └── theme/                 # Color palette
├── assets/                    # icon, splash, adaptive icon, favicon
├── .claude/                   # Claude Code AI tooling (see .claude/README.md)
├── .cursor/                   # Cursor IDE rules mirror
├── .env.example               # Public + secret env split
├── .mcp.json                  # MCP servers (context7, github)
├── app.json                   # Expo config
├── babel.config.js
├── eslint.config.js
├── metro.config.js
├── package.json
├── tsconfig.json
└── .github/workflows/
    └── ci.yml                # lint + type-check + test + security:scan
```

## Conventions

- **File names:** kebab-case (`use-auth.ts`, `themed-text.tsx`). English only.
- **Components:** PascalCase function components.
- **Hooks:** `use-` prefix.
- **Screens:** under `app/` (Expo Router).
- **Reusable components:** under `src/components/`.
- **Imports:** `@/` alias (resolves to `./src/`).
- **State:** Zustand subscribed via selectors (`useStore((s) => s.field)`); auth tokens in `expo-secure-store`.
- **Touchables:** `Pressable` for new code; every touchable carries `accessibilityRole` + `accessibilityLabel`.

## Environment variables

- `EXPO_PUBLIC_*` is bundled into the JS shipped with every install. **Never** put a secret behind that prefix.
- The hook at `.claude/hooks/scripts/expo-public-env-guard.mjs` blocks Write / Edit / MultiEdit calls that try to.
- Server-only / EAS secrets: drop the prefix and read from a server you own, or use EAS Secrets.

## Adding a dependency

Use `bunx expo install <pkg>` (NOT `bun add <pkg>`) so Expo picks the SDK-compatible version. If you `bun add` by mistake, run `CI=1 npx expo install --fix` to heal versions.

## Native build (when you need it)

```bash
bun run prebuild          # generates ios/ and android/
bun ios                    # builds and runs on iOS simulator
bun android                # builds and runs on Android emulator
```

After hand-editing native code, switch to the "bare workflow" and stop running `expo prebuild` (or use `--clean` only when you confirm there's no hand-edited code to lose).

## E2E

Default: Maestro (zero-config YAML flows). Fallback: Detox (when JS mocking or bridge inspection is required).

```bash
maestro test .maestro/auth/login.yaml
```

See [`.claude/skills/detox-e2e-patterns/SKILL.md`](.claude/skills/detox-e2e-patterns/SKILL.md) for the Detox guide and the Maestro-vs-Detox decision tree.

## License

[MIT](LICENSE) — Copyright (c) 2026 Khoi Pham.
