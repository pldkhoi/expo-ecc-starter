# Architecture decisions

Append-only log. Each entry uses the [ADR](https://adr.github.io/) format. Newest at the top.

---

## ADR-0006: Mock auth shipped in the template

**Date**: 2026-05-17
**Status**: Accepted

### Context

A template that ships only "infrastructure for auth" forces every adopter to invent the same UI. A template that ships a real auth integration locks adopters into one vendor (Clerk, Auth0, Supabase, custom).

### Decision

Ship a fully wired mock auth flow: sign-in / sign-up screens with React Hook Form + Zod, an `useAuthStore` Zustand slice persisted via `expo-secure-store`, and `Stack.Protected` gating at the root. The `signIn` function returns after a 800ms delay with a fake user + token.

### Consequences

- Adopters get an immediately usable app on first run.
- Replacing the mock with a real backend is a single function swap (`signIn` in `app/(auth)/sign-in.tsx` and `sign-up.tsx`).
- We avoid taking a side on which auth provider to use.

---

## ADR-0005: TanStack Query for server state, Zustand for client state

**Date**: 2026-05-17
**Status**: Accepted

### Context

Mixing server state and client state in the same store (a common Zustand anti-pattern) reinvents caching, retry, and stale-time logic badly.

### Decision

- Server state (anything fetched from a backend) → TanStack Query 5.
- Client state (auth identity, theme, ephemeral UI) → Zustand 5.
- Form state → React Hook Form.
- URL state → `useLocalSearchParams`.

### Consequences

- Two libraries instead of one — adopters must understand both.
- Each library does what it is best at, so each store stays small and each query stays focused.
- TanStack Query's persist plugin gives us offline-first caching without writing it ourselves.

---

## ADR-0004: husky + lint-staged for pre-commit, not bypass-able

**Date**: 2026-05-17
**Status**: Accepted

### Context

A pre-commit hook that runs the whole test suite is slow enough to be bypassed; one that runs nothing protects nothing.

### Decision

`lint-staged` runs `eslint --fix` + `prettier --write` only on staged files. `--no-verify` is in the deny list at `.claude/settings.json` so AI sessions can't bypass it.

### Consequences

- Local commits stay fast (subsecond on small diffs).
- CI still re-runs the same checks across the whole repo as a backstop.
- Humans can technically bypass with `git -c "core.hooksPath=/dev/null" commit`, but the friction surfaces the intent.

---

## ADR-0003: One `SafeAreaProvider` at the root

**Date**: 2026-05-17
**Status**: Accepted

### Context

Multiple `SafeAreaProvider` instances in the tree return zero insets and cause silent layout bugs.

### Decision

Exactly one `SafeAreaProvider` in `app/_layout.tsx`. All screens use `useSafeAreaInsets()` for per-edge values; `<SafeAreaView edges={...}>` is reserved for quick mockups.

### Consequences

- Edge-to-edge Android works correctly.
- No double padding inside tabs or modals.
- A new screen can read insets without provider scaffolding.

---

## ADR-0002: Expo Router 6 `Stack.Protected` for auth gating

**Date**: 2026-05-17
**Status**: Accepted

### Context

`useEffect(() => router.replace(...))` redirects cause a render flash, race conditions, and infinite loops if dependencies are wrong.

### Decision

Use `<Stack.Protected guard={isAuthed}>` at the root layout. Expo Router resolves which screen matches the current guard state and transitions automatically.

### Consequences

- No `useEffect` redirect loops.
- Deep links to `/(tabs)` while unauthenticated bounce to `/(auth)/sign-in` automatically.
- Adopters must understand the `Stack.Protected` API — but it's documented in the official Expo Router docs and `.claude/rules/expo/expo-router.md`.

---

## ADR-0001: Bun as the package manager and runner

**Date**: 2026-05-16
**Status**: Accepted

### Context

Bun is faster than npm/yarn/pnpm for install and script execution, and ships a built-in test runner. It is supported by Expo SDK 55 out of the box.

### Decision

Use Bun 1.3+ for installs, scripts, and the init script. Lockfile is `bun.lock` (committed).

### Consequences

- Faster CI (~30% faster install) and local dev loop.
- A handful of CLIs still expect npm/yarn — use `bunx` or fall back to `npm` when truly needed (rare).
- Adopters new to Bun have a one-line install (`curl -fsSL https://bun.sh/install | bash`).

---

## How to add an ADR

Add the new entry **at the top** with the next sequential number. Keep entries short (under 200 words). One decision per entry. Don't edit accepted ADRs — supersede them with a new entry that references the old one.
