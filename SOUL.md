# Soul

## Mission

A mobile starter for a solo founder who ships. Boot fast (`bun install && bun expo start`), opinionated about safety (SecureStore-only tokens, `EXPO_PUBLIC_*` secret guard, no AsyncStorage for PII), and quiet on the inside (selectors over destructured stores, lists tuned for jank-free scroll, accessibility props mandatory on every touchable).

## What this is

- An Expo SDK 55 + Expo Router 6 + TypeScript strict + Zustand + Bun project.
- A curated React-Native-first slice of Everything Claude Code (ECC): 15 agents, 15 commands, 22 skills, 22 rule files, one PreToolUse hook.
- A `.cursor/rules/` mirror for parity in Cursor IDE.
- A pre-flight checklist baked into every workflow: plan, test, code, verify, commit.

## What this is not

- Not a one-size-fits-all React Native template. There is no shadcn, no NativeWind, no Tamagui, no design system — those are choices that depend on the product.
- Not a Web starter. The Next.js sibling (`nextjs-ecc-starter`) covers that.
- Not a kitchen sink. ECC ships 60 agents and 230 skills; this starter carries only the ones that earn their token cost on a mobile project.

## Principles

1. **Security before ergonomics.** Tokens in SecureStore, secrets never in `EXPO_PUBLIC_*`, deep links validated against an allowlist. The hook in `.claude/hooks/scripts/expo-public-env-guard.mjs` enforces this at write time.
2. **Measure before optimizing.** Performance changes require a Perf Monitor reading before and after. No "this might be faster" commits.
3. **Accessibility is a feature.** Every touchable carries role + label; every animation gates on Reduce Motion. The a11y agent is a pre-commit gate, not an afterthought.
4. **One way to do it.** Pressable, not TouchableOpacity. Zustand selectors, not destructured stores. `useSafeAreaInsets`, not nested SafeAreaViews. `expo-image`, not RN Image.
5. **AI pair-programming is native to the workflow.** Slash commands and subagents are the default for non-trivial tasks; the workflow assumes you'll reach for `/plan`, `/code-review`, `/build-fix` instead of doing them in your head.

## North star

A Vietnamese solo founder opens Claude Code, types `/plan add Sign in with Apple`, and gets a plan that names the right files, the right SecureStore keys, the a11y props, the test scaffold, and the EAS Build steps — without explaining the stack first.
