---
name: accessibility
description: Cross-platform accessibility entry point — iOS (VoiceOver) and Android (TalkBack). For React Native deep guidance, see `react-native-accessibility`. For a11y architecture, see the `a11y-architect` agent.
origin: ecc/expo
---

# Accessibility (mobile-first)

This is the entry skill. It surfaces the cross-platform principles and links to the deep guides. This repo targets mobile, so all examples are React Native; web is out of scope.

## POUR (Perceivable, Operable, Understandable, Robust)

The four pillars apply to mobile too:

- **Perceivable** — every meaningful UI element has a text alternative spoken to VoiceOver / TalkBack.
- **Operable** — every interactive element is reachable and usable via screen-reader gestures and external switches.
- **Understandable** — focus order matches reading order; state changes are announced.
- **Robust** — works with current VoiceOver / TalkBack and continues to work after OS updates.

## Platform-specific reference

| Topic            | iOS                                                        | Android                                      |
| ---------------- | ---------------------------------------------------------- | -------------------------------------------- |
| Screen reader    | VoiceOver                                                  | TalkBack                                     |
| Focus property   | `accessibilityElementsHidden`                              | `importantForAccessibility`                  |
| Live region      | (Use `AccessibilityInfo.announceForAccessibility`)         | `accessibilityLiveRegion`                    |
| Min touch target | 44 × 44 pt                                                 | 48 × 48 dp                                   |
| Custom roles     | `accessibilityRole` + traits via `accessibilityValue.text` | `accessibilityRole`                          |
| Reduce Motion    | Settings → Accessibility → Motion → Reduce Motion          | Settings → Accessibility → Remove animations |
| Test tool        | Accessibility Inspector (Xcode)                            | Accessibility Scanner (Play Store app)       |

## Quick checklist (per screen)

1. [ ] Every Pressable / Touchable has `accessibilityRole` AND `accessibilityLabel`.
2. [ ] Visible touch target ≥ 44pt iOS / 48dp Android (or `hitSlop` expands it).
3. [ ] Decorative images hidden: `accessibilityElementsHidden` (iOS) + `importantForAccessibility="no-hide-descendants"` (Android).
4. [ ] State changes announced via `AccessibilityInfo.announceForAccessibility('...')`.
5. [ ] Motion gated: `if (await AccessibilityInfo.isReduceMotionEnabled()) jump-to-final-state`.
6. [ ] Focus on screen mount lands on the heading.
7. [ ] All tests find interactive elements via `getByRole({ name })` — proves a11y from the test boundary.

## Deep guides

- `react-native-accessibility` — full props matrix, iOS/Android specifics, testing recipes.
- `a11y-architect` agent — applies these to a screen and produces the diff.

## Anti-patterns (mobile)

| Issue                                                   | Fix                                                      |
| ------------------------------------------------------- | -------------------------------------------------------- |
| Icon-only `Pressable` with no label                     | Add `accessibilityLabel="Close modal"`                   |
| `aria-label="..."` left over from web port              | Replace with `accessibilityLabel="..."`                  |
| Color-only state indicator (e.g., red border for error) | Pair with icon + `accessibilityState.invalid` / announce |
| Two nested `accessible={true}` wrappers                 | Pick one; the inner one wins by default                  |
| Reanimated transition without Reduce Motion gate        | Gate before kicking off `withTiming`                     |
