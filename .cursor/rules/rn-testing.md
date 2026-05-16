---
description: "ECC: React Native testing rules"
alwaysApply: true
---
> This file extends [common/testing.md](../common/testing.md) with React Native testing rules.

# React Native testing rules

## Test runner

- `jest` with `jest-expo` preset (configured in `package.json`).
- `@testing-library/react-native` for component tests.
- `@testing-library/jest-native` matchers (`.toBeOnTheScreen`, `.toBeDisabled`, etc.).

## Locate by role

- Find elements via `screen.getByRole({ name })` first. Proves accessibility from the test boundary.
- `getByText` allowed for static text that's unlikely to localize.
- `getByTestId` only when role/label lookup is genuinely insufficient.

## Coverage target

- 80% lines / branches for `src/` and `app/`.
- E2E (Maestro / Detox) does NOT count toward the unit coverage number.

## Fake timers

- Use `jest.useFakeTimers()` for any test that involves `setTimeout`, animations, or debounced state.
- Always reset with `jest.useRealTimers()` in `afterEach`.

## Snapshot tests

- Discouraged. They lock visual structure without asserting behavior. Prefer role/text queries.
- Acceptable for stable design-system primitives (Button, Card) when paired with a behavioral test.

## SafeAreaProvider in tests

```tsx
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 47, bottom: 34, left: 0, right: 0 } }}>
    {children}
  </SafeAreaProvider>
);

render(<Screen />, { wrapper });
```

## Zustand reset

```ts
const initial = useStore.getState();
beforeEach(() => useStore.setState(initial, true));
```

## Mocking native modules

- `expo-secure-store`, `expo-router`, `expo-image` are auto-mocked by `jest-expo`.
- For custom native modules, add a manual mock under `__mocks__/` matching the package name.

## E2E

- See `detox-e2e-patterns` and the `e2e-runner` agent.
- E2E tests live under `e2e/` (Detox) or `.maestro/` (Maestro). They are separate from `jest`.

## Anti-patterns

- Snapshot test as the only assertion for a component
- `setTimeout` in a test without `useFakeTimers`
- Real network calls — mock at the module boundary
- Shared mutable state between tests (no `beforeEach` reset)
- `getByTestId` everywhere — proves nothing about a11y
