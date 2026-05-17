# Security Policy

## Supported versions

Only the `main` branch and the latest tagged release receive security updates.

## Reporting a vulnerability

**Do not open a public issue for security problems.**

Report privately via one of these channels:

1. GitHub Security Advisory (preferred): use the "Report a vulnerability" button on the repository's Security tab.
2. Email the maintainer with the subject prefix `[SECURITY]`.

Please include:

- A clear description of the issue and its impact.
- A minimal reproduction (steps, code snippet, or PoC repo).
- Affected versions / commit SHA.
- Your suggested remediation, if any.

You should receive an acknowledgement within 72 hours and a triage outcome within 7 days.

## Disclosure timeline

- **Day 0** — report received, acknowledged within 72 hours.
- **Day 1–7** — triage and impact assessment.
- **Day 7–30** — fix developed, reviewed, and tested.
- **Day 30** — coordinated disclosure with patched release and CVE filing (when applicable).

Critical issues can be disclosed faster by mutual agreement.

## Scope

In scope:

- Application code in this repository (`app/`, `src/`, `scripts/`).
- Build, CI, and dependency configuration.
- `.claude/` AI tooling configuration if it can leak secrets or enable unauthorized actions.

Out of scope:

- Vulnerabilities in third-party dependencies (please report upstream).
- Issues in Expo, React Native, or Bun themselves (report to the upstream maintainers).
- Self-XSS or social-engineering attacks against users.

## Best practices we follow

- Auth tokens stored in `expo-secure-store` (Keychain / EncryptedSharedPreferences).
- `EXPO_PUBLIC_*` env var guard hook prevents accidental secret leakage to the JS bundle (`.claude/hooks/scripts/expo-public-env-guard.mjs`).
- AgentShield scans the repo on every CI run (`bun security:scan`).
- Dependabot watches dependencies weekly.
- ESLint flat config + TypeScript strict mode catch common bug classes at build time.

Thank you for helping keep the project and its users safe.
