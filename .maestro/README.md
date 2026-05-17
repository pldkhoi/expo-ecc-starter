# Maestro flows

This directory holds YAML-based end-to-end test flows for [Maestro](https://maestro.mobile.dev/).

## Install the Maestro CLI

```bash
curl -fsSL "https://get.maestro.mobile.dev" | bash
```

Then verify:

```bash
maestro --version
```

## Run a flow

Build and start the app on a simulator or device first:

```bash
bun ios       # or bun android
```

Then in another terminal:

```bash
maestro test .maestro/smoke.yaml
```

Run the whole directory:

```bash
bun e2e:maestro
```

## Tagging

Flows declare `tags:` at the top. You can filter:

```bash
maestro test --include-tags smoke .maestro/
maestro test --exclude-tags slow .maestro/
```

## CI

Maestro Cloud is the easiest path:

```bash
maestro cloud --apiKey "$MAESTRO_API_KEY" --apk ./app.apk .maestro/
```

For local CI runners, you can spin up an iOS simulator or Android emulator and run `maestro test` directly. See <https://maestro.mobile.dev/getting-started/run-maestro-on-ci>.

## Flow conventions

- One business flow per file (`smoke.yaml`, `checkout.yaml`, `onboarding.yaml`).
- Add `tags:` so flows can be partitioned.
- Prefer `tapOn:` with the visible label or `accessibilityLabel` over `id:` — it stays readable and proves accessibility from the test boundary.
- Use `clearState: true` on `launchApp` for tests that must start from a fresh install.
- Keep flows under 30 seconds. Split long journeys into chained flows.

## When Maestro is not enough

Switch to Detox when you need:

- JS-side mocking (e.g. swap an API client with a stub before launch).
- Bridge inspection or native module introspection.
- Cross-process flows (a notification kills the app and a deep link relaunches it).

See `.claude/skills/detox-e2e-patterns/SKILL.md`.
