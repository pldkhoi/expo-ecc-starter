---
description: "ECC: React Native hook rules"
alwaysApply: true
---
> This file extends [common/coding-style.md](../common/coding-style.md) with React Native hook rules.

# React Native hook rules

## File conventions

- Custom hook files: `src/hooks/use-<name>.ts` (kebab-case file, `use` prefix).
- Export a named function: `export function useThing()`. Default exports discouraged for hooks.
- One hook per file unless tightly coupled.

## Built-in hook discipline

- `useEffect` with `[]` for mount-only logic is fine; document why with a one-line comment if non-obvious.
- `useEffect` with no dependency array re-runs every render — banned unless intentional.
- Cleanup is mandatory for any subscription: `Keyboard.addListener`, `AppState.addEventListener`, `Linking.addEventListener`, `BackHandler.addEventListener`, `Animated` listeners.
- `useState` for data that the URL or a Zustand store already owns is a code smell; derive instead.

## Mobile-specific hooks

- `useSafeAreaInsets()` — called once per screen at the top. Don't call inside a child component that re-renders frequently.
- `useColorScheme()` — RN's built-in returns `'light' | 'dark' | null`. Coerce to a definite value at the boundary.
- `useWindowDimensions()` — re-renders on rotation. Use for responsive layouts; cache derived breakpoints with `useMemo` if expensive.
- `useFocusEffect` (from `expo-router`) — run an effect every time the screen is focused. Always return a cleanup function.

## Performance

- `useCallback` only when the callback is passed to a `React.memo` child or to a Reanimated worklet.
- `useMemo` only when computation > 1 ms AND inputs are stable.
- Random memoization adds re-render-check cost. Profile first.

## Subscriptions

- Wrap subscription effects in a stable `useEffect`; capture the subscription handle and remove on cleanup.
- For Reanimated shared values, no cleanup is needed; they're tied to the component lifecycle.

## Anti-patterns

- `useEffect(() => router.push('/somewhere'))` for redirects — use `Stack.Protected` or `initialRouteName`
- Calling `useSafeAreaInsets` inside a memoized child (insets re-renders the parent already)
- `useState` mirroring a Zustand store field — subscribe with a selector instead
- Listener `addEventListener` without `remove()` cleanup
- `useEffect(async () => { ... })` — effects can't return a Promise; wrap an inner async function
