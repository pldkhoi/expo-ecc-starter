> This file extends [common/patterns.md](../common/patterns.md) with React Native component rules.

# React Native component rules

## Touchables

- Prefer `Pressable` for any new touchable. `TouchableOpacity` is acceptable in legacy code but not for new code.
- Every touchable carries `accessibilityRole` AND `accessibilityLabel`. See [accessibility.md](./accessibility.md).
- Visible touch target ≥ 44pt iOS / 48dp Android. Use `hitSlop` to expand when the visual must be smaller.
- `Pressable` `style` accepts a function for pressed state — use it instead of separate `Animated.View` for simple feedback.

## Lists

- `FlatList` / `SectionList` for any data set that can grow.
- `ScrollView` only when item count is bounded AND known small (≤ 20).
- Never `ScrollView` over a dataset of unknown length — it renders every child immediately.

## Keyboard

- Wrap forms in `KeyboardAvoidingView` with `behavior={Platform.select({ ios: 'padding', android: undefined })}`.
- Android relies on `windowSoftInputMode="adjustResize"` (Expo default). Don't change unless you have a reason.
- For dismiss-on-tap-outside: wrap content in `Pressable` with `onPress={Keyboard.dismiss}`, `accessible={false}`.

## Styling

- Use `StyleSheet.create` for any style object referenced more than once OR inside a list item.
- Inline styles allowed for one-off layout tweaks (`<View style={{ marginTop: 8 }}>`); never inside a hot render path.
- No `width: '100%'` chained with `flex: 1` on the same view — it's a silent layout bug.
- Prefer `gap` over manual margins on flex children (RN 0.71+ supports `gap`).

## Components

- Function components only. No `React.FC`.
- One component per file when possible. Co-locate styles, helpers, and types in the same file.
- File name: kebab-case (e.g., `themed-text.tsx`); component name: PascalCase.

## Naming

- Screens (under `app/`) export a `default function ScreenName()`.
- Reusable components (under `src/components/`) export a named function: `export function ComponentName()`.
- Custom hooks: `use` prefix in camelCase.

## Cross-platform

- Use `Platform.select({ ios, android, default })` for small platform differences.
- Use `.ios.ts` / `.android.ts` file extensions only when divergence is structural (different libraries, different APIs).

## Anti-patterns

- `TouchableOpacity` for new CTAs
- `View` with `onTouchStart` (use Pressable)
- `ScrollView` over a paginated list
- Inline styles in `FlatList` rows
- Mixing `padding` and `margin` to space children when `gap` works
- One mega `Pressable` wrapping a deep tree — children become unreachable for VoiceOver
