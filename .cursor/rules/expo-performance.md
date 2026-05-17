---
description: 'ECC: Expo / React Native performance rules'
alwaysApply: true
---

> This file extends [common/performance.md](../common/performance.md) with Expo / React Native performance rules.

# Expo / React Native performance rules

## Architecture

- `newArchEnabled: true` in `app.json` (default in SDK 55). Flip off only with documented reason and `bun run prebuild:clean`.
- Hermes default on. Verify with `typeof __HERMES_INTERNAL__ !== 'undefined'`.

## Targets

- Cold-start TTI on mid-range Android: < 2.0 s
- JS-thread sustained during scroll: ≥ 55 fps
- UI-thread sustained during animation: ≥ 58 fps
- Production JS bundle: < 2 MB gzipped per platform

## Bundle hygiene

- Run `npx expo export && du -sh dist/_expo/static/js` before every release. Track in CI.
- Import named (`import { format } from 'date-fns'`) not default whole-module (`import * as Lib`).
- Heavy libs (moment, full lodash) are banned. Use per-function imports or local helpers.

## Lists

- Always provide `keyExtractor` based on a stable ID (NOT index).
- `renderItem` defined OUTSIDE the screen body or memoized with `useCallback`.
- Row component wrapped in `React.memo`.
- Provide `getItemLayout` when row height is constant.
- Tune `initialNumToRender`, `windowSize`, `maxToRenderPerBatch` to the data size; defaults are wrong for short lists and very long lists.

## Images

- Use `expo-image`, not RN `Image`.
- Always set `width` + `height` explicitly.
- Always set `contentFit`.
- Set `cachePolicy="memory-disk"` for any repeated image.
- Pre-size source on the server. Never ship a 4000×4000 image into a 200×200 slot.

## Animation

- Reanimated 3 worklets for anything that runs every frame.
- Animated values via `useSharedValue`, NOT `useState`.
- `runOnJS` only when a worklet must call a JS function.
- Gate motion behind `AccessibilityInfo.isReduceMotionEnabled()`.

## Logs in release

- `console.log` and friends MUST be guarded by `if (__DEV__) { ... }` or removed before release.
- No `console.log` of tokens, passwords, PII, request bodies in any environment.

## Verification

- Run `bun type-check` and `bun lint` before commit.
- For perf-sensitive changes, measure with Perf Monitor (shake → Show Perf Monitor) on a real device before and after.
