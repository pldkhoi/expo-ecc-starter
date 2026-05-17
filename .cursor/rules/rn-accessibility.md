---
description: 'ECC: Mobile accessibility rules'
alwaysApply: true
---

> This file extends [common/code-review.md](../common/code-review.md) with mobile accessibility rules. See skill `react-native-accessibility` for the deep guide.

# Mobile accessibility rules

## Mandatory props

Every interactive element (`Pressable`, `TouchableOpacity`, `Switch`, `Slider`, custom touchable wrappers) carries:

- `accessibilityRole` — `button`, `link`, `switch`, `tab`, `header`, etc.
- `accessibilityLabel` — short verb phrase. Required on icon-only elements; optional when visible text is descriptive.
- `accessibilityState` — `{ disabled, selected, checked, busy, expanded }` reflecting the live state.
- `accessibilityHint` — OPTIONAL. Only when the action isn't obvious from the label.

## Touch targets

- iOS: ≥ 44 × 44 points.
- Android: ≥ 48 × 48 dp.
- If visual must be smaller, expand with `hitSlop={{ top, bottom, left, right }}`.

## Decorative children

- Icons / images that are purely decorative are hidden from the a11y tree:
  - iOS: `accessibilityElementsHidden={true}`
  - Android: `importantForAccessibility="no-hide-descendants"`

## Announcements

- Status updates (toast, save success, validation error) call `AccessibilityInfo.announceForAccessibility('...')` for cross-platform announcement.
- Android can alternatively use `accessibilityLiveRegion="polite"` on the live element.

## Motion

- Before any non-decorative Reanimated transition: check `AccessibilityInfo.isReduceMotionEnabled()` and jump to the final state when true.

## Focus

- On screen mount, set focus on the heading via `findNodeHandle` + `AccessibilityInfo.setAccessibilityFocus`.
- Do NOT nest `accessible={true}` wrappers — they create duplicate focus stops.

## Testing

- Every interactive element MUST be locatable via `getByRole({ name })` in `@testing-library/react-native`. If a test can't find it, neither can VoiceOver / TalkBack.

## Anti-patterns

- Icon-only Pressable without `accessibilityLabel`
- `accessibilityHint` repeating the label
- Nested `accessible={true}` wrappers
- `accessibilityRole="button"` on a `<View>` with no onPress
- `aria-label` (web prop) left over from a port — use `accessibilityLabel`
- Forgetting `accessibilityState.disabled` on a disabled control
