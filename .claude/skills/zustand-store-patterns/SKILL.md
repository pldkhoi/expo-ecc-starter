---
name: zustand-store-patterns
description: Zustand store organization for React Native — one slice per domain, selector-only subscriptions, SecureStore-backed persistence for sensitive data, slice composition, and test reset patterns. Use whenever creating, modifying, or testing a Zustand store.
origin: ecc/expo
---

# Zustand store patterns

Lightweight, no Provider, no Context bloat. Zustand v5 is the baseline.

## Layout

```
src/
└── stores/
    ├── auth-store.ts
    ├── settings-store.ts
    └── counter-store.ts
```

One slice per domain. Cross-domain dependencies → derive in a component or a custom hook, not in another store.

## Minimum store

```ts
import { create } from 'zustand';

type CounterState = {
  count: number;
  increment: () => void;
  reset: () => void;
};

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
  reset: () => set({ count: 0 }),
}));
```

## Selector usage (MANDATORY)

```tsx
// GOOD — selector subscribes to one field
const count = useCounterStore((s) => s.count);
const increment = useCounterStore((s) => s.increment);

// BAD — destructuring subscribes to the whole store
const { count, increment } = useCounterStore();
```

The bad version re-renders the component on every change to ANY field in the store, including unrelated fields you don't read.

For multi-field selectors with shallow equality:

```tsx
import { useShallow } from 'zustand/react/shallow';

const { a, b } = useCounterStore(useShallow((s) => ({ a: s.a, b: s.b })));
```

## Persistence

For non-sensitive data (UI preferences, recent searches), use AsyncStorage:

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (t) => set({ theme: t }),
    }),
    {
      name: 'settings',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
```

For SENSITIVE data (auth tokens, refresh tokens, PII), use SecureStore:

```ts
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';

const secureStorage: StateStorage = {
  getItem: (name) => SecureStore.getItemAsync(name),
  setItem: (name, value) => SecureStore.setItemAsync(name, value),
  removeItem: (name) => SecureStore.deleteItemAsync(name),
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      setTokens: (access, refresh) => set({ accessToken: access, refreshToken: refresh }),
      clear: () => set({ accessToken: null, refreshToken: null }),
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => secureStorage),
      partialize: (s) => ({ accessToken: s.accessToken, refreshToken: s.refreshToken }),
    },
  ),
);
```

`partialize` avoids persisting derived or transient fields.

## Slices pattern

Split a large store into slices that share a single create call:

```ts
import { create, type StateCreator } from 'zustand';

type AuthSlice = { token: string | null; signIn: (t: string) => void };
type SettingsSlice = { theme: 'light' | 'dark'; setTheme: (t: 'light' | 'dark') => void };

const authSlice: StateCreator<AuthSlice & SettingsSlice, [], [], AuthSlice> = (set) => ({
  token: null,
  signIn: (t) => set({ token: t }),
});

const settingsSlice: StateCreator<AuthSlice & SettingsSlice, [], [], SettingsSlice> = (set) => ({
  theme: 'light',
  setTheme: (t) => set({ theme: t }),
});

export const useAppStore = create<AuthSlice & SettingsSlice>()((...a) => ({
  ...authSlice(...a),
  ...settingsSlice(...a),
}));
```

Prefer one-store-per-domain unless slices have a real interaction. Don't over-engineer.

## Testing

Reset between tests:

```ts
import { useCounterStore } from '@/stores/counter-store';

const initial = useCounterStore.getState();

beforeEach(() => {
  useCounterStore.setState(initial, true); // second arg = replace, not merge
});
```

Test the store directly without rendering a component:

```ts
test('increment bumps count by 1', () => {
  useCounterStore.getState().increment();
  expect(useCounterStore.getState().count).toBe(1);
});
```

## When NOT to use Zustand

| Concern                         | Use instead                                                                         |
| ------------------------------- | ----------------------------------------------------------------------------------- |
| Server state (fetched from API) | TanStack Query / SWR — Zustand stores can't refetch, dedupe, or cache by query key. |
| Form state                      | React Hook Form + Zod                                                               |
| URL state (filters, pagination) | `useLocalSearchParams` + `router.setParams`                                         |
| Theme (read-only computed)      | Plain context or `useColorScheme`                                                   |

## Anti-patterns

| Anti-pattern                                                                | Why it fails                                            |
| --------------------------------------------------------------------------- | ------------------------------------------------------- |
| Destructuring whole store                                                   | Re-renders on every state change                        |
| Mutating state inside `set` callback (`set((s) => { s.x = 1; return s; })`) | Zustand expects a new object; mutation breaks selectors |
| Storing fetched data + loading flag in Zustand                              | Reinvents TanStack Query badly                          |
| Auth token in AsyncStorage (not SecureStore)                                | Plain-text on disk                                      |
| Multiple stores reading each other's state inside selectors                 | Subscribe race conditions; derive in components instead |
