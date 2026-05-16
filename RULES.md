# Rules

## Must Always

- Delegate to specialized agents for domain tasks.
- Write tests before implementation and verify critical paths.
- Validate inputs and keep security checks intact.
- Prefer immutable updates over mutating shared state.
- Follow established repository patterns before inventing new ones.
- Keep contributions focused, reviewable, and well-described.

## Must Never

- Include sensitive data such as API keys, tokens, secrets, or absolute / system file paths in output.
- Submit untested changes.
- Bypass security checks or validation hooks.
- Duplicate existing functionality without a clear reason.
- Ship code without checking the relevant test suite.

## Agent Format

- Agents live in `.claude/agents/*.md`.
- Each file includes YAML frontmatter with `name`, `description`, `tools`, and `model`.
- File names are lowercase with hyphens and must match the agent name.
- Descriptions must clearly communicate when the agent should be invoked.

## Skill Format

- Skills live in `.claude/skills/<name>/SKILL.md`.
- Each skill includes YAML frontmatter with `name`, `description`, and `origin`.
- Use `origin: ECC` for first-party skills, `origin: ecc/expo` for this starter's mobile additions, and `origin: community` for imported ones.
- Skill bodies should include practical guidance, tested examples, and a clear "When to Use" / "Anti-patterns" section.

## Hook Format

- Hooks use matcher-driven JSON registration in `.claude/settings.json` and Node entry points under `.claude/hooks/scripts/`.
- Matchers should be specific (e.g., `Write|Edit|MultiEdit`) instead of catch-alls (`*`).
- Exit `1` only when blocking is intentional; otherwise exit `0` with the `{ "decision": "block", "reason": "..." }` envelope.
- Error and info messages must be actionable — name the violation, name the fix.

## Commit Style

- Conventional commits: `feat(scope):`, `fix(scope):`, `docs:`, `test:`, `refactor:`, `chore:`, `perf:`, `ci:`.
- Keep changes modular; one logical change per commit.
- Explain user-facing impact in the PR summary, not in commit titles.

## React Native section

Mobile-specific rules that complement the cross-platform ones above. Each links to its file under `.claude/rules/`.

| Rule | File | One-line summary |
|---|---|---|
| Components | [react-native/components.md](.claude/rules/react-native/components.md) | Pressable preferred; FlatList over ScrollView; StyleSheet.create for reused styles |
| Hooks | [react-native/hooks.md](.claude/rules/react-native/hooks.md) | `use-` prefix kebab-case file; subscription cleanup mandatory; measure before memoizing |
| State (Zustand) | [react-native/state-zustand.md](.claude/rules/react-native/state-zustand.md) | One store per domain; selectors mandatory; SecureStore-backed persist for tokens |
| Accessibility | [react-native/accessibility.md](.claude/rules/react-native/accessibility.md) | Every touchable carries role + label; 44pt iOS / 48dp Android; announce status updates |
| Safe area | [react-native/safe-area.md](.claude/rules/react-native/safe-area.md) | One root SafeAreaProvider; useSafeAreaInsets preferred over SafeAreaView component |
| Testing | [react-native/testing.md](.claude/rules/react-native/testing.md) | Jest + @testing-library/react-native; locate by role; fake timers for animations |
| Expo Router | [expo/expo-router.md](.claude/rules/expo/expo-router.md) | File-based routes; typed routes on; Stack.Protected for auth; no state in _layout |
| Expo perf | [expo/performance.md](.claude/rules/expo/performance.md) | Hermes on; New Arch on; expo-image; FlatList tuning; bundle < 2 MB gzipped |
