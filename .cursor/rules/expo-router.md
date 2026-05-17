---
description: 'ECC: Expo Router 6 conventions'
alwaysApply: true
---

> This file extends [common/coding-style.md](../common/coding-style.md) with Expo Router 6 conventions.

# Expo Router 6 conventions

Apply these rules to every file under `app/`.

## File layout

- Routes live ONLY under `app/`. Components and hooks live under `src/`.
- `_layout.tsx` files are layouts; they do not have their own URL.
- Group segments use parentheses: `(tabs)`, `(modal)`, `(auth)`. The parens are stripped from the URL.
- Dynamic segments: `[id].tsx`, catch-all `[...slug].tsx`.
- 404: `+not-found.tsx`.

## Typed routes

- Keep `experiments.typedRoutes: true` in `app.json`. `Link href` and `router.push` are then type-checked.
- Narrow `useLocalSearchParams<{ id: string }>()` explicitly. Coerce strings to other types (`Number()`, schema parse) before use.

## State in layouts

- Do NOT use `useState` in `_layout.tsx`. Layouts re-render their entire subtree on state change.
- Use Zustand for cross-screen state. Read it in the screens that need it, not in the layout.

## Modals

- Prefer the per-screen `options={{ presentation: 'modal' }}` over a `(modal)` group when only one screen is modal.
- Modals inherit the root `SafeAreaProvider`. Do NOT wrap a modal in a second provider.

## Auth gating

- Use `Stack.Protected guard={isAuthed}` for auth gates. Do not redirect from a `useEffect`.
- Read `isAuthed` from a Zustand store with a selector.

## Deep links

- Validate inbound deep link paths against an allowlist before navigating.
- Never pass a user-controlled URL to a WebView.
- Universal Links / App Links require `assetlinks.json` (Android) or associated-domain entitlement (iOS). Verify these before relying on them.

## Splash

- Call `SplashScreen.preventAutoHideAsync()` at module scope in `_layout.tsx`.
- Call `SplashScreen.hideAsync()` only after fonts and critical bootstrapping resolve.
- Return `null` while not ready — don't render an empty Stack.

## Anti-patterns

- `useState` in `_layout.tsx`
- `useEffect(() => { router.push(...) }, [])` for redirects
- Duplicate web / native route files when behavior is identical
- Treating `useLocalSearchParams` as already-typed without `experiments.typedRoutes`
- WebView source from `useLocalSearchParams` or deep link URL
