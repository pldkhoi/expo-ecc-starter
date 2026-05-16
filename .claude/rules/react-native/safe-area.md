> This file extends [common/coding-style.md](../common/coding-style.md) with safe-area rules. See skill `safe-area-patterns` for the deep guide.

# Safe area rules

## Root provider

- Exactly ONE `SafeAreaProvider` in `app/_layout.tsx`. Wraps the Stack.
- Do NOT add a second provider in a group layout, modal, or nested screen.

## Preferred consumer

- `useSafeAreaInsets()` over `<SafeAreaView edges={...}>`. More control, no double padding.
- `SafeAreaView` allowed only for one-off scaffolding (e.g., a quick modal mock).

## Per-edge guidance

- `top` — only when the screen has no Stack header.
- `bottom` — only when the screen has no tab bar AND no Stack footer. Required for edge-to-edge Android.
- `left` / `right` — only for landscape / iPad layouts.

## Edge-to-edge Android

- `app.json` has `android.edgeToEdgeEnabled: true` by default. Account for `insets.bottom` on every screen with a sticky footer or floating action button.

## Modals

- Modals presented by Expo Router inherit the root provider. Read insets with `useSafeAreaInsets()` directly; do NOT wrap in another provider.

## Tests

- Render with `<SafeAreaProvider initialMetrics={{ ... }}>` so `useSafeAreaInsets` returns deterministic values.

## Anti-patterns

- Two `SafeAreaProvider`s in the tree
- `<SafeAreaView edges={['top','bottom']}>` inside a `<Tabs>` (doubles bottom padding)
- Hard-coding 44 / 47 / 34 for status bar / notch / home indicator
- Skipping `paddingBottom: insets.bottom` on Android with edge-to-edge enabled
- Calling `useSafeAreaInsets` outside a `SafeAreaProvider` — returns zeros silently
