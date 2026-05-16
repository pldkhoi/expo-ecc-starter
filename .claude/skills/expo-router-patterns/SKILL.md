---
name: expo-router-patterns
description: File-based routing patterns for Expo Router 6. Covers route layouts, group segments, dynamic routes, typed routes, deep links, modals, and splash/redirect flows. Use whenever creating, restructuring, or debugging files under `app/`.
origin: ecc/expo
---

# Expo Router 6 patterns

Expo Router 6 ships with SDK 55. Routes are file-based under `app/`. Everything else (stacks, tabs, modals, params) follows from the file tree.

## File conventions

| File | Role |
|---|---|
| `app/_layout.tsx` | Root layout. Wraps `SafeAreaProvider`, providers, theme. |
| `app/(group)/_layout.tsx` | Group layout. The parens are NOT in the URL. |
| `app/index.tsx` | `/` |
| `app/about.tsx` | `/about` |
| `app/users/[id].tsx` | `/users/123` — dynamic single segment |
| `app/blog/[...slug].tsx` | `/blog/a/b/c` — catch-all |
| `app/+not-found.tsx` | 404 / unmatched route |
| `app/+html.tsx` | Web-only HTML wrapper |

## Group layouts

Use parens to wrap several routes under one layout WITHOUT adding a URL segment:

```
app/
├── _layout.tsx           ← Stack
├── (tabs)/
│   ├── _layout.tsx       ← Tabs
│   ├── index.tsx         ← /
│   └── explore.tsx       ← /explore
└── (modal)/
    └── settings.tsx      ← /settings (presented as modal)
```

## Typed routes

Enable in `app.json`:

```json
"experiments": { "typedRoutes": true }
```

Routes become type-safe:

```tsx
import { Link, router } from 'expo-router';

router.push('/users/[id]', { id: '123' });    // typed
<Link href="/about">About</Link>;             // typed
```

`useLocalSearchParams<{ id: string }>()` returns typed params. ALWAYS narrow — params are strings; coerce with `Number()` or a schema.

## Modals

Two ways:

1. **Group layout**:
   ```tsx
   // app/(modal)/_layout.tsx
   import { Stack } from 'expo-router';
   export default function ModalLayout() {
     return <Stack screenOptions={{ presentation: 'modal' }} />;
   }
   ```

2. **Per-screen** in the parent Stack:
   ```tsx
   <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
   ```

Prefer (2) when only one screen is modal — fewer files.

## Auth gating

Use `Stack.Protected` (SDK 55 / Router 6):

```tsx
// app/_layout.tsx
import { Stack } from 'expo-router';
import { useAuthStore } from '@/stores/auth-store';

export default function RootLayout() {
  const isAuthed = useAuthStore((s) => s.isAuthed);
  return (
    <Stack>
      <Stack.Protected guard={isAuthed}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
      <Stack.Protected guard={!isAuthed}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}
```

When `guard` flips, Router transitions to the other branch automatically. No `useEffect(() => router.push(...))` redirect race.

## Splash + initial redirect

```tsx
// app/_layout.tsx
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({ /* ... */ });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;
  return <Stack />;
}
```

## Deep links

Configure scheme in `app.json`:

```json
"scheme": "eccstarter"
```

Then `eccstarter://users/123` opens `app/users/[id].tsx`.

Validate before navigating:

```tsx
import * as Linking from 'expo-linking';

const ALLOWED_PATHS = new Set(['users', 'invites', 'reset-password']);

Linking.addEventListener('url', ({ url }) => {
  const { hostname, path } = Linking.parse(url);
  const segment = (path ?? '').split('/').filter(Boolean)[0] ?? '';
  if (!ALLOWED_PATHS.has(segment)) return;
  router.push(url.replace(/^.+?:\/\//, '/') as never);
});
```

NEVER pass an unvalidated URL into a WebView.

## Anti-patterns

| Issue | Why it fails |
|---|---|
| `useState` in `_layout.tsx` | Re-renders every child route. Use Zustand. |
| Duplicated routes for web vs native | Maintenance burden. Use platform extensions only when behavior truly diverges. |
| `useEffect(() => { router.push(...) }, [])` for redirect | Race against mount. Use `Stack.Protected` or set `initialRouteName`. |
| Returning JSX from a `_layout.tsx` that wraps the `<Slot />` in something with padding | Padding affects every route. Hard to override. |
| Treating `useLocalSearchParams` as typed without `experiments.typedRoutes` | Params are `string | string[] | undefined` — narrow explicitly. |
