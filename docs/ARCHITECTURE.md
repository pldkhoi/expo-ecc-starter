# Architecture

This document explains the folder layout, data flow, and state ownership so contributors can extend the codebase without inventing a parallel structure.

## Folder layout (intent)

| Folder               | What lives here                                                                                                  |
| -------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `app/`               | Expo Router routes only. No reusable components. `_layout.tsx` files are layouts; they have no URL of their own. |
| `app/(auth)/`        | Sign-in / sign-up screens. Visible only when `selectIsAuthenticated` is false.                                   |
| `app/(modal)/`       | Screens presented as modals via `presentation: 'modal'`.                                                         |
| `app/(tabs)/`        | Authenticated bottom-tab screens.                                                                                |
| `src/components/`    | Reusable presentational components shared across screens.                                                        |
| `src/components/ui/` | Themed UI primitives (Button, Card, Input, Spinner).                                                             |
| `src/hooks/`         | Custom hooks. File name `use-<name>.ts`, exported as `useName`.                                                  |
| `src/lib/`           | Pure utilities (api, query-client, secure-storage, validation, format-date). No React.                           |
| `src/providers/`     | React context providers that wrap the app (QueryProvider).                                                       |
| `src/stores/`        | Zustand stores. One slice per domain, file name `<domain>-store.ts`.                                             |
| `src/test-utils/`    | `renderWithProviders` and other helpers used only in tests.                                                      |
| `src/theme/`         | Theme definition (`theme.ts`), `theme-provider.tsx`, color palette.                                              |
| `assets/`            | Icons, splash, fonts.                                                                                            |

## Provider chain

The root layout (`app/_layout.tsx`) wraps the navigator in this order:

```
GestureHandlerRootView
  └── ErrorBoundary
      └── SafeAreaProvider
          └── ThemeProvider
              └── QueryProvider
                  └── Stack (with Stack.Protected auth gate)
```

Why this order:

- `GestureHandlerRootView` must be at the absolute root (gesture-handler 2 requires it).
- `ErrorBoundary` is high so it can catch render errors from every screen.
- `SafeAreaProvider` provides insets to every consumer downstream.
- `ThemeProvider` exposes the theme that the rest of the tree styles against.
- `QueryProvider` (TanStack Query) is innermost because its cache should live for the app lifetime but not above the theme (so devtools / overlays can pick up the theme).

## State ownership

| Kind of state                             | Where it lives                                  | Why                                                                      |
| ----------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------ |
| **URL / route params**                    | `useLocalSearchParams`                          | The router owns the URL — never duplicate it in a store.                 |
| **Server data**                           | TanStack Query (`useQuery`, `useMutation`)      | Built-in cache, stale-time, retry. Never store fetched lists in Zustand. |
| **Form state**                            | React Hook Form                                 | Field-level subscriptions; resolver wires Zod validation.                |
| **Auth identity (user + token)**          | `useAuthStore` (Zustand + secure-store persist) | Crosses many screens, must persist across launches, contains secrets.    |
| **Theme preference**                      | `ThemeProvider` (React context + AsyncStorage)  | Crosses every screen, no secrets, must persist.                          |
| **Local UI state (toggle, focus, hover)** | `useState` inside the component                 | Lifetime equals the component.                                           |
| **Cross-screen ephemeral**                | New Zustand slice in `src/stores/`              | When `useState` isn't enough.                                            |

If you find yourself reaching for Zustand to store a fetched API response — stop. Use TanStack Query.

## Data flow (example: sign-in)

```
User taps "Sign in"
  ↓
React Hook Form (Zod validation)
  ↓ valid?  no → render field errors
  ↓ yes
[your API call here — currently mock]
  ↓ success?  no → render submission error
  ↓ yes (returns user + token)
useAuthStore.signIn(user, token)
  ↓
zustand persist middleware writes to secure-store
  ↓
selectIsAuthenticated flips true
  ↓
<Stack.Protected guard={isAuthed}> swaps (auth) → (tabs)
  ↓
Expo Router transitions to /(tabs)
```

When replacing the mock with a real API call, wrap it in a `useMutation` so loading / error states live in TanStack Query.

## API layer

`src/lib/api.ts` exposes a small `fetch`-based wrapper:

- Base URL from `process.env.EXPO_PUBLIC_API_URL`.
- Auto-attaches `Authorization: Bearer <token>` from `useAuthStore` when present.
- 10s timeout via `AbortController`.
- Throws typed `ApiError` with `status`, `code`, `message`. Adds `isUnauthorized` / `isTimeout` / `isNetworkError` getters.
- `withAuth: false` lets you call public endpoints without leaking the user's token.

The TanStack Query default `retry` policy (`src/lib/query-client.ts`) inspects `ApiError`:

- 401 → no retry (token rotation is your job).
- 4xx → no retry.
- 5xx / network → up to 2 retries.

## Theming

`src/theme/theme.ts` exports a typed theme with `colors`, `spacing`, `radii`, `fontSizes`, `fontWeights`. Both `light` and `dark` modes share the same shape.

`ThemeProvider` resolves the active scheme from a preference (`system` | `light` | `dark`) and persists it to AsyncStorage under `theme.preference.v1`. Consumers call `useTheme()` and read `theme.colors.text`, `theme.spacing.md`, etc.

To rebrand: change the values in `src/theme/theme.ts` only — components consume tokens, not raw hex.

## Persistence

| Storage                                               | What goes here                                                                                          |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `expo-secure-store` (via `src/lib/secure-storage.ts`) | Auth token, refresh token, user record. Anything that's "if leaked, attacker can impersonate the user." |
| `AsyncStorage`                                        | Theme preference, TanStack Query cache, last-seen onboarding step. Non-sensitive.                       |
| In-memory only                                        | Form state, modal visibility, transient UI.                                                             |

Web fallback: `secureStorage` falls back to `window.localStorage` on web. This is **not** secure — never deploy a production web build that stores real secrets there. If you ship to web, design auth around HTTP-only cookies instead.

## Adding a new feature

1. **Route**: drop a file under `app/(tabs)/` (authenticated) or `app/(auth)/` (public). Use the right group.
2. **State**: decide where it lives using the table above. Default to component `useState` unless it must persist or cross screens.
3. **Data**: if you need to fetch, create a `use<Thing>` hook in `src/hooks/` that wraps `useQuery`.
4. **UI**: build with primitives from `src/components/ui/`. Add new primitives there if you genuinely need a reusable one.
5. **Test**: place the test in a sibling `__tests__/` directory using `renderWithProviders`.

## Anti-patterns to avoid

- `useState` inside `_layout.tsx` (forces full subtree re-render).
- `useEffect` redirect for auth (use `Stack.Protected`).
- Storing fetched lists + loading flags in Zustand (reinvents TanStack Query).
- Auth tokens in AsyncStorage (use SecureStore).
- Two `SafeAreaProvider`s in the tree (provider lives only at the root).
- Inline styles inside a `FlatList` row.
- `ScrollView` over a paginated list.
