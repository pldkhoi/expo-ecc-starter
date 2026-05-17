---
paths:
  - '**/*.ts'
  - '**/*.tsx'
  - '**/*.js'
  - '**/*.jsx'
---

# TypeScript/JavaScript Testing

> This file extends [common/testing.md](../common/testing.md) with TypeScript/JavaScript specific content. For React Native specifics, see also [react-native/testing.md](../react-native/testing.md).

## Unit / Component

- Jest with the `jest-expo` preset (configured in `package.json`).
- `@testing-library/react-native` for component rendering.
- Locate elements by role: `screen.getByRole('button', { name })`.

## E2E

- **Maestro** as the default E2E runner (YAML flows under `.maestro/`).
- **Detox** as the fallback when JS mocking / bridge inspection is required.
- See skill `detox-e2e-patterns` and the `e2e-runner` agent.

## Agent Support

- **e2e-runner** — Maestro-first, Detox-fallback E2E for React Native.
