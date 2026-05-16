---
name: detox-e2e-patterns
description: Detox E2E test patterns for Expo apps — setup with dev client builds, element matching by testID / accessibilityLabel / text, waitFor timeouts, flake handling, CI runners, and the Maestro-vs-Detox decision sidebar. Use when Maestro YAML cannot cover the test (JS mocking, bridge inspection, cross-process flow).
origin: ecc/expo
---

# Detox E2E patterns

Use Detox when Maestro is insufficient: in-process JS mocking, deep bridge inspection, mid-test module stubs, or tests that share fixtures with Jest.

For everything else, Maestro YAML is faster to write and runs in CI cheaper. See the `e2e-runner` agent for the decision tree.

## Setup

```bash
bun add -D detox @types/detox jest-circus
npx detox init -r jest
```

Detox needs a development client binary (the production build strips its hooks). Use EAS:

```bash
eas build --profile development --platform ios
eas build --profile development --platform android
```

`eas.json`:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": { "simulator": true },
      "android": { "buildType": "apk" }
    }
  }
}
```

## File layout

```
e2e/
├── jest.config.js
├── helpers.ts
├── login.test.ts
└── checkout.test.ts
.detoxrc.js
```

## `.detoxrc.js` (abridged)

```js
module.exports = {
  testRunner: { args: { config: 'e2e/jest.config.js' }, jest: { setupTimeout: 120000 } },
  apps: {
    'ios.dev': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/eccstarter.app',
      build: 'xcodebuild ... (omitted)',
    },
    'android.dev': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
    },
  },
  devices: {
    simulator: { type: 'ios.simulator', device: { type: 'iPhone 15' } },
    emulator: { type: 'android.emulator', device: { avdName: 'Pixel_6_API_34' } },
  },
  configurations: {
    'ios.sim.dev': { device: 'simulator', app: 'ios.dev' },
    'android.emu.dev': { device: 'emulator', app: 'android.dev' },
  },
};
```

## Selectors

```ts
import { by, element } from 'detox';

element(by.id('submit'));               // matches testID="submit"
element(by.label('Open settings'));     // matches accessibilityLabel
element(by.text('Continue'));           // matches visible text
```

Priority: `by.id` > `by.label` > `by.text`. Text matching is fragile against localization.

## Async waits

```ts
import { waitFor, element, by } from 'detox';

await waitFor(element(by.id('home-screen')))
  .toBeVisible()
  .withTimeout(8000);
```

Never use `await new Promise((r) => setTimeout(r, 2000))` — that's flake fuel.

## Example: login

```ts
import { by, device, element, expect, waitFor } from 'detox';

describe('Login', () => {
  beforeAll(async () => {
    await device.launchApp({ delete: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('lands on home after valid credentials', async () => {
    await element(by.text('Sign in')).tap();
    await element(by.id('email')).typeText('demo@example.com');
    await element(by.id('password')).typeText('correct-horse-battery-staple');
    await element(by.text('Continue')).tap();
    await waitFor(element(by.id('home-screen'))).toBeVisible().withTimeout(8000);
  });

  it('shows error on wrong password', async () => {
    await element(by.text('Sign in')).tap();
    await element(by.id('email')).typeText('demo@example.com');
    await element(by.id('password')).typeText('nope');
    await element(by.text('Continue')).tap();
    await waitFor(element(by.id('login-error'))).toBeVisible().withTimeout(4000);
  });
});
```

## Flake handling

- `await device.launchApp({ delete: true })` once per `describe` clears Keychain + AsyncStorage.
- `await device.reloadReactNative()` between tests is faster than relaunch.
- `await device.disableSynchronization()` ONLY when the app legitimately polls forever (e.g., a live socket). Re-enable after with `enableSynchronization()`.
- If a test still flakes, the test is wrong — fix the test, don't add retries.

## Mocking

Detox lets you mock modules at the JS layer via Metro at build time:

```js
// metro.config.js (Detox-specific build)
config.resolver.sourceExts.push('e2e.js', 'e2e.ts');
```

Then `useAuth.e2e.ts` is picked over `useAuth.ts` for Detox builds. Use sparingly — over-mocked E2E is an integration test in disguise.

## CI

| Platform | Runner | Notes |
|---|---|---|
| iOS | macOS (GitHub Actions `macos-14`) | Slowest; cache derived data |
| Android | Linux + KVM (`ubuntu-22.04` with `enable-kvm`) | Faster boot than macOS Android emu |

Total budget: aim for < 10 min per platform on a 5-test suite.

## Maestro vs Detox (sidebar)

| Aspect | Maestro | Detox |
|---|---|---|
| Test format | YAML | JS / TS |
| Setup time | minutes | hours |
| Dev client build needed | no | yes |
| Mock JS modules mid-test | no | yes |
| Cross-process (Safari → app deep link) | yes | partial |
| Recording | `maestro studio` | none |
| Default for this repo | yes | escalation only |

## Anti-patterns

| Anti-pattern | Fix |
|---|---|
| Hardcoded `setTimeout` waits | `waitFor(...).toBeVisible().withTimeout(MS)` |
| `by.id` matching an index (`by.id('button-2')`) | Use stable IDs; if data-driven, encode the data key (`by.id('row-task-42')`) |
| Test that depends on previous test's state | `device.launchApp({ delete: true })` between tests |
| Asserting on a localized string with multi-locale CI | Lock the locale or assert by `by.id` |
| Running against production build | Detox hooks are stripped; build a dev client |
