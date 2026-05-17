# Releasing

End-to-end checklist for cutting a release and building installable binaries with EAS.

## 1. Prepare the branch

```bash
git checkout main
git pull --ff-only
bun install
bun type-check
bun lint
bun test:ci
bun security:scan
```

All green? Continue.

## 2. Bump versions

Two version numbers live in this project:

- `package.json` → npm-style semver (consumed by tooling).
- `app.json` → user-facing app version + `runtimeVersion` for EAS Update.

```bash
# Patch / minor / major — match what changed
npm version --no-git-tag-version patch
# Then mirror in app.json's expo.version manually (and bump iOS buildNumber / Android versionCode).
```

For EAS Update users, also bump `runtimeVersion` when native code changed.

## 3. Update CHANGELOG

Add an entry under the new version using [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format:

```md
## [1.2.0] - 2026-05-17

### Added

- New onboarding flow with progress indicator.

### Changed

- Auth tokens now rotate on every refresh.

### Fixed

- iOS keyboard no longer covers the sign-in form on small devices.
```

## 4. Commit + tag

```bash
git add package.json app.json CHANGELOG.md
git commit -m "release: v1.2.0"
git tag v1.2.0
git push origin main --tags
```

## 5. Build with EAS

Install EAS CLI once:

```bash
bun add -g eas-cli
eas login
```

Configure profiles (`eas.json` — create on first run):

```bash
eas build:configure
```

Build:

```bash
eas build --platform ios --profile production
eas build --platform android --profile production
```

To submit to the App Store / Play Store:

```bash
eas submit --platform ios
eas submit --platform android
```

## 6. EAS Update (OTA)

For JS-only changes, ship via `eas update`:

```bash
eas update --branch production --message "v1.2.0 patch: copy fixes + analytics"
```

Notes:

- `runtimeVersion` must match the installed binary. If you bumped native code, you must also ship a new binary.
- Test the update on the matching binary before promoting.

## 7. Verify

- Install the production build from TestFlight / Play Console internal track.
- Run the Maestro smoke flow against it.
- Watch crash reporting (Sentry / Bugsnag if wired) for the first 24 hours.

## 8. Rollback

If a JS-only release misbehaves:

```bash
eas update:rollback --branch production
```

If a binary release misbehaves, halt the rollout in App Store Connect / Play Console and ship a hotfix.

## Versioning policy

This project follows [SemVer](https://semver.org/):

- **MAJOR** — breaking change to public API or stored data format.
- **MINOR** — backward-compatible feature.
- **PATCH** — backward-compatible bug fix or copy change.

## Pre-release tags

Use `-rc.1`, `-beta.1`, `-alpha.1` suffixes for non-production builds:

```bash
npm version --no-git-tag-version 1.3.0-rc.1
```
