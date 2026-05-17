# Testing

Three layers, three runners:

| Layer              | Runner                                 | Where                                    |
| ------------------ | -------------------------------------- | ---------------------------------------- |
| Unit / component   | Jest + `@testing-library/react-native` | `src/**/__tests__/`, `app/**/__tests__/` |
| End-to-end (smoke) | Maestro                                | `.maestro/*.yaml`                        |
| End-to-end (deep)  | Detox (fallback)                       | `e2e/` (when needed)                     |

## Unit / component

Run:

```bash
bun test                  # watch mode
bun test:ci               # CI mode + coverage
bun test:coverage         # coverage without --ci
```

### Locate elements by role first

Proves accessibility from the test boundary. If a test can't find an element by role, neither can VoiceOver / TalkBack.

```tsx
import { renderWithProviders, screen } from '@/test-utils/render';
import { Button } from '@/components/ui/Button';

it('renders a button', () => {
  renderWithProviders(<Button label="Save" onPress={() => {}} />);
  expect(screen.getByRole('button', { name: 'Save' })).toBeOnTheScreen();
});
```

Fallback order:

1. `getByRole({ name })`
2. `getByLabelText(...)` (form fields)
3. `getByText(...)` (static, non-localized text)
4. `getByTestId(...)` (last resort)

### `renderWithProviders`

Wraps the component in `SafeAreaProvider` + `ThemeProvider` + a fresh `QueryClientProvider`. Use it for every component test:

```tsx
import { renderWithProviders, screen } from '@/test-utils/render';
```

Optional: pass your own `QueryClient` to seed test data.

### Resetting Zustand between tests

```ts
const initial = useAuthStore.getState();
beforeEach(() => useAuthStore.setState(initial, true));
```

### Mocking native modules

`expo-secure-store` is mocked under `__mocks__/expo-secure-store.ts` (in-memory). `expo-router`, `expo-image`, `expo-font` are auto-mocked by `jest-expo`.

For your own native modules, add a manual mock under `__mocks__/<package-name>.ts`.

### Coverage threshold

Configured in `jest.config.js`:

```js
coverageThreshold: {
  global: { lines: 60, branches: 50, functions: 60, statements: 60 }
}
```

Bumped to 60% to keep the first green run achievable. Raise toward 80% as the codebase grows.

### Anti-patterns

- Snapshot tests as the only assertion for a component.
- `setTimeout` in a test without `jest.useFakeTimers()`.
- Real network calls — mock at the module boundary.
- Shared mutable state without `beforeEach` reset.
- `getByTestId` everywhere — proves nothing about a11y.

## E2E with Maestro

Maestro flows live in `.maestro/`. Each `.yaml` is one user journey.

### Run

```bash
bun ios                            # or bun android, in a separate terminal
maestro test .maestro/smoke.yaml   # one flow
bun e2e:maestro                    # whole directory
```

### Tagging

```yaml
tags:
  - smoke
  - auth
```

```bash
maestro test --include-tags smoke .maestro/
```

### Conventions

- One business flow per file (`smoke.yaml`, `checkout.yaml`).
- Prefer `tapOn: "<visible label>"` over `id: "<testID>"` — proves accessibility.
- Keep flows under 30 seconds. Split long journeys.
- Use `clearState: true` on the first `launchApp` for tests that need a fresh install.

See `.maestro/README.md` and `.claude/skills/detox-e2e-patterns/SKILL.md` for the Maestro-vs-Detox decision tree.

## E2E with Detox (fallback)

Switch to Detox when Maestro can't cover the case:

- Need to mock the API client before the app starts.
- Need to inspect the bridge or a native module.
- Cross-process flow (notification kills app, deep link relaunches).

See `.claude/skills/detox-e2e-patterns/SKILL.md` for setup.

## TDD workflow

1. **RED** — write a failing test that describes the desired behavior.
2. **GREEN** — write the minimal code to make it pass.
3. **REFACTOR** — improve naming, structure, duplication. Re-run.

The `tdd-guide` agent enforces this when invoked.

## CI

`.github/workflows/ci.yml`:

```
lint → format:check → type-check → test:ci (coverage uploaded) → security:scan
```

A PR is mergeable when every step is green.
