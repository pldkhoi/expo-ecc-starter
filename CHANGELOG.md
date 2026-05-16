# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
