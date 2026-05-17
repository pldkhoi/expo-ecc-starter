# Setup

End-to-end setup for a new developer joining the project.

## Prerequisites

| Tool           | Version                          | Why                                |
| -------------- | -------------------------------- | ---------------------------------- |
| Bun            | ≥ 1.3                            | Package manager + script runner    |
| Node           | ≥ 20 (only for some legacy CLIs) | Most tooling now uses Bun directly |
| Xcode          | ≥ 16                             | iOS simulator + native builds      |
| Android Studio | Iguana or newer                  | Android emulator + SDK 34          |
| Watchman       | latest                           | Metro file watcher (macOS)         |
| JDK            | 17                               | Required by Gradle                 |

Install Bun:

```bash
curl -fsSL https://bun.sh/install | bash
```

Install Watchman (macOS):

```bash
brew install watchman
```

Install Expo CLI helpers (no global install required — use `bunx expo`).

## Clone & bootstrap

```bash
git clone <your-repo-url>
cd <your-repo>
bun install
bun run prepare       # sets up husky git hooks
cp .env.example .env.local
```

## Run

```bash
bun dev
# press w → web preview (fastest smoke test)
# press i → iOS simulator
# press a → Android emulator
```

For native builds (you've added a native module or want a release build):

```bash
bun run prebuild      # generates ios/ and android/
bun ios               # builds + runs on iOS simulator
bun android           # builds + runs on Android emulator
```

## Verify

Before opening a PR, run:

```bash
bun type-check
bun lint
bun format:check
bun test:ci
bun security:scan
```

CI runs the same commands.

## Environment variables

`.env.local` is gitignored and loaded by Expo at build time. Two categories:

- `EXPO_PUBLIC_*` — bundled into the JS shipped with every install. Use for **public** config (API base URL, feature flags). Never assign a secret.
- Anything else — server-only / EAS secrets. Drop the prefix and store in EAS Secrets (`eas secret:create`) or read from a server you own.

The pre-edit hook at `.claude/hooks/scripts/expo-public-env-guard.mjs` blocks accidental secret assignment to `EXPO_PUBLIC_*`.

## IDE

VS Code is the recommended IDE — open the workspace and accept the recommended extensions prompt. The repo ships `.vscode/settings.json` with format-on-save and ESLint flat-config support.

For Cursor: rules mirror lives at `.cursor/rules/`.

## AI tooling

This project ships Claude Code agents, skills, and commands under `.claude/`. After cloning, the tooling is already wired. Useful commands:

- `/plan` — write an implementation plan
- `/code-review` — review the current diff or a PR
- `/build-fix` — triage an Expo / RN build failure
- `/security-scan` — run AgentShield

See `CLAUDE.md` for the full workflow and `AGENTS.md` for the agent roster.

## Common issues

### Metro stuck on "Building JavaScript bundle"

```bash
bun expo start --clear
```

### Pods are out of date (after native install)

```bash
cd ios && pod install && cd ..
```

### TypeScript reports red squiggles after a fresh clone

```bash
bun type-check                  # forces a clean TS build
```

If types still look stale, restart the TS server in VS Code (Cmd+Shift+P → "TypeScript: Restart TS Server").

### Husky hooks don't run

```bash
bun run prepare
chmod +x .husky/pre-commit
```

### Maestro CLI not found

```bash
curl -fsSL "https://get.maestro.mobile.dev" | bash
```

## Next reading

- [`docs/ARCHITECTURE.md`](ARCHITECTURE.md) — folder layout, state ownership, provider chain
- [`docs/TESTING.md`](TESTING.md) — how to write and run tests
- [`docs/RELEASING.md`](RELEASING.md) — version bump + EAS Build
- [`CONTRIBUTING.md`](../CONTRIBUTING.md) — workflow + commit conventions
- [`CLAUDE.md`](../CLAUDE.md) — AI workflow and conventions
