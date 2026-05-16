---
name: safe-area-patterns
description: SafeAreaProvider patterns for Expo Router — root provider once, per-edge insets via useSafeAreaInsets, edge-to-edge Android handling, and the SafeAreaView vs insets decision. Use when adding any screen that touches the device edges (header, footer, tab bar, modal).
origin: ecc/expo
---

# Safe area patterns

iOS has a notch / Dynamic Island. Android has gesture nav + edge-to-edge surfaces. `react-native-safe-area-context` exposes both as a single API.

## Root provider — once, only once

```tsx
// app/_layout.tsx
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
```

Do NOT wrap a second `SafeAreaProvider` around a modal, group layout, or nested screen. Modals presented by Expo Router inherit the root provider.

## Two ways to consume insets

### 1. `useSafeAreaInsets()` (preferred)

```tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Screen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom, flex: 1 }}>
      ...
    </View>
  );
}
```

Pros: full control per-edge, no double padding in nested layouts, composable with `KeyboardAvoidingView`.

### 2. `<SafeAreaView edges={['top']}>` (legacy)

```tsx
import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView edges={['top']} style={{ flex: 1 }}>
  ...
</SafeAreaView>
```

Pros: concise. Cons: nesting two `SafeAreaView`s double-pads silently; less ergonomic when only one edge is needed.

**Default to `useSafeAreaInsets`.** Use `SafeAreaView` only for one-off wrappers (e.g., a quick modal scaffold).

## Per-edge guidance

| Edge | Apply when |
|---|---|
| `top` | Screen has its own header (no Expo Router header). Skip when `headerShown: true`. |
| `bottom` | Screen has no tab bar AND no Stack header. Edge-to-edge Android nav uses this. |
| `left` / `right` | Landscape + iPad. Rarely needed in portrait phone-only apps. |

A screen inside a Tabs layout usually only needs `top`; the tab bar handles `bottom`.

## Edge-to-edge Android (SDK 53+)

`app.json` enables it by default:

```json
"android": { "edgeToEdgeEnabled": true }
```

With edge-to-edge on, the app draws under the gesture-nav area. You MUST account for `insets.bottom`:

```tsx
const insets = useSafeAreaInsets();
return (
  <View style={{ flex: 1, paddingBottom: insets.bottom }}>
    <Footer />
  </View>
);
```

Skipping this puts the gesture nav over the bottom of your UI.

## Keyboard + safe area

`KeyboardAvoidingView` plays nicely with insets:

```tsx
import { KeyboardAvoidingView, Platform } from 'react-native';

const insets = useSafeAreaInsets();

<KeyboardAvoidingView
  behavior={Platform.select({ ios: 'padding', android: undefined })}
  keyboardVerticalOffset={insets.top}
  style={{ flex: 1 }}
>
  ...
</KeyboardAvoidingView>
```

On Android, the soft keyboard already pushes content via `android:windowSoftInputMode="adjustResize"` (Expo default), so `behavior={undefined}` is correct.

## Modals

Modals presented by Expo Router (`presentation: 'modal'`) live inside the root `SafeAreaProvider`. Just call `useSafeAreaInsets()` inside the modal screen — no second provider.

## Tab bars

Expo Router's `<Tabs>` reads insets internally to position the tab bar above the gesture nav. You only need to handle `bottom` in tab screens if you have a floating button or sticky footer.

## Testing

```tsx
import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const wrap = (ui: React.ReactElement) => (
  <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 47, bottom: 34, left: 0, right: 0 } }}>
    {ui}
  </SafeAreaProvider>
);

test('renders with iPhone 15 insets', () => {
  render(wrap(<Screen />));
});
```

`initialMetrics` avoids the async `useSafeAreaInsets` returning `{ 0, 0, 0, 0 }` on first render in tests.

## Anti-patterns

| Anti-pattern | Why it fails |
|---|---|
| Two `SafeAreaProvider` wrappers (root + modal) | Modal child reads inner provider, which has stale insets |
| `<SafeAreaView edges={['top','bottom']}>` inside a `<Tabs>` | Doubles the bottom padding (Tabs already handles it) |
| Hard-coding 44 / 47 / 34 for status bar / notch / home indicator | Wrong on Dynamic Island devices and Android |
| Skipping `paddingBottom: insets.bottom` on edge-to-edge Android | Gesture nav overlaps the UI |
| `useSafeAreaInsets()` called in a non-Provider tree | Returns `{ top: 0, bottom: 0, left: 0, right: 0 }` silently |
