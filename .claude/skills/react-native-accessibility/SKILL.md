---
name: react-native-accessibility
description: Deep guide to React Native accessibility API — props matrix, iOS UIAccessibilityTraits, Android importantForAccessibility, touch targets, AccessibilityInfo, Reduce Motion, and testing recipes. Use whenever adding a new touchable, list row, screen, or animated transition.
origin: ecc/expo
---

# React Native accessibility

This skill is the reference for the mobile a11y API. For high-level architecture, see the `a11y-architect` agent.

## Props matrix

| Prop | What it does | Required for |
|---|---|---|
| `accessible` | Marks the view as a single a11y element. Children are not exposed individually. | Grouping a card or row |
| `accessibilityLabel` | Spoken name. Overrides children text. | Icon-only buttons, decorative-text overrides |
| `accessibilityHint` | Spoken AFTER label. Use sparingly. | Non-obvious actions |
| `accessibilityRole` | Semantic role. | EVERY interactive element |
| `accessibilityState` | Dynamic state. | Disabled, selected, checked, expanded, busy |
| `accessibilityValue` | Range / quantity. | Sliders, progress |
| `accessibilityActions` + `onAccessibilityAction` | Custom verbs (activate, longpress, increment, decrement, escape, magicTap). | Custom controls |
| `accessibilityElementsHidden` (iOS) | Hide subtree from VoiceOver. | Decorative wrappers / icons |
| `importantForAccessibility` (Android) | `auto` / `yes` / `no` / `no-hide-descendants` | TalkBack visibility |
| `accessibilityLiveRegion` (Android) | Announce updates: `none` / `polite` / `assertive`. | Toast-like surfaces |

## Roles cheat sheet

`button`, `link`, `header`, `image`, `text`, `search`, `tab`, `switch`, `adjustable` (slider), `none`, `summary`, `imagebutton`, `keyboardkey`, `radio`, `checkbox`, `progressbar`, `menu`, `menuitem`.

If your custom control doesn't map to one of these, use `none` and rely on a clear label + actions.

## Touch targets

- iOS: ≥ 44 × 44 points
- Android: ≥ 48 × 48 dp

If visual must be smaller (e.g., a 24×24 icon button in a compact toolbar):

```tsx
<Pressable
  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
  style={{ width: 24, height: 24 }}
>
```

`hitSlop` expands the touch area without changing layout.

## Cross-platform announcement

```ts
import { AccessibilityInfo } from 'react-native';

AccessibilityInfo.announceForAccessibility('Saved');
```

Works on both iOS and Android. Use for toast-like notifications, validation errors, optimistic updates.

## Reduce Motion gating

```ts
const reduceMotion = await AccessibilityInfo.isReduceMotionEnabled();
if (reduceMotion) {
  setOpacity(1);                  // jump to final state
} else {
  opacity.value = withTiming(1, { duration: 200 });
}
```

There's also `useReduceMotion()` hook from `react-native-reanimated` if you're already on RA3.

## Focus management

On screen mount, focus the heading so screen readers don't read the tab bar first:

```tsx
import { useRef, useEffect } from 'react';
import { AccessibilityInfo, findNodeHandle, Text } from 'react-native';

const titleRef = useRef<Text>(null);

useEffect(() => {
  const handle = findNodeHandle(titleRef.current);
  if (handle != null) AccessibilityInfo.setAccessibilityFocus(handle);
}, []);

return <Text ref={titleRef} accessibilityRole="header">Profile</Text>;
```

## Grouping

```tsx
<Pressable
  accessible
  accessibilityRole="button"
  accessibilityLabel={`${article.title}, by ${article.author}, ${article.minutes} minute read`}
>
  <Image source={article.cover} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" />
  <Text>{article.title}</Text>
  <Text>{article.author}</Text>
  <Text>{article.minutes} min</Text>
</Pressable>
```

VoiceOver hits this once, reads the label, done. Without `accessible`, it would hit each Text + the Image separately.

## Testing

```tsx
import { render, screen, fireEvent } from '@testing-library/react-native';

test('increment button has correct a11y', () => {
  render(<Counter initial={0} />);
  const button = screen.getByRole('button', { name: /increment counter/i });
  expect(button).toBeOnTheScreen();
  fireEvent.press(button);
  expect(screen.getByRole('button', { name: /current value 1/i })).toBeOnTheScreen();
});
```

Locate by role + accessible name. If you can't find the element this way, your a11y is incomplete.

## Anti-patterns

| Issue | Why it fails |
|---|---|
| `accessibilityLabel` repeating visible text verbatim | Redundant for sighted-with-screen-reader; OK if visible text is non-semantic (e.g., emoji). |
| `accessibilityHint` repeating the label | TalkBack reads both; slow. |
| Nested `accessible={true}` wrappers | Creates two focus stops; VoiceOver hits both. |
| `<View accessibilityRole="button">` without a Pressable | Announces "button" but tap does nothing. |
| Hiding interactive children with `accessibilityElementsHidden` | They become unreachable. Hide decorative children only. |
| Forgetting `accessibilityState.disabled` on a disabled Pressable | VoiceOver says "button" — user taps, nothing happens, no feedback. |
| Using `aria-label` (web ARIA) instead of `accessibilityLabel` | Web prop, ignored in native. |
