---
description: 'ECC: Zustand state rules'
alwaysApply: true
---

> This file extends [common/patterns.md](../common/patterns.md) with Zustand state-management rules for React Native.

# Zustand state rules

## Layout

- One store per domain in `src/stores/`. File name: `<domain>-store.ts`. Export: `useDomainStore`.
- Slices pattern only when slices have a real interaction. Default: separate stores.

## Subscriptions

- Subscribe with a selector: `useStore((s) => s.field)`. NEVER destructure the whole store.
- For multi-field reads with shallow equality: `useStore(useShallow((s) => ({ a: s.a, b: s.b })))`.

## Mutations

- All updates go through `set`. Return a new object, never mutate inside the callback.
- For derived state, derive at the consumer, not in the store.

## Persistence

- Auth tokens, refresh tokens, session IDs, PII → `persist` middleware with `createJSONStorage(() => secureStorage)` where `secureStorage` wraps `expo-secure-store`.
- Non-sensitive preferences (theme, last tab, recent searches) → `createJSONStorage(() => AsyncStorage)`.
- Use `partialize` to avoid persisting transient or derived fields.

## What NOT to store

- Server state (fetched from API) → TanStack Query / SWR (install on demand).
- Form state → React Hook Form + Zod (install on demand).
- URL state → `useLocalSearchParams` + `router.setParams`.

## Testing

- Reset between tests:
  ```ts
  const initial = useStore.getState();
  beforeEach(() => useStore.setState(initial, true));
  ```
- Test store actions directly: `useStore.getState().increment()` then assert on `useStore.getState().count`.

## Anti-patterns

- Destructuring the whole store
- Mutating state inside `set` (e.g., `set((s) => { s.x = 1; return s; })`)
- Storing fetched server data + loading flags (reinvents TanStack Query badly)
- Auth tokens in AsyncStorage (use SecureStore)
- Cross-store reads inside selectors (derive at consumer instead)
