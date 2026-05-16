---
description: Diagnose and fix an Expo / React Native build failure. Delegates to the react-native-build-resolver agent and walks the npx expo-doctor triage path.
---

# /build-fix

The build is broken. You will identify the failure, run the relevant triage step, apply the smallest possible fix, and re-run until green.

## Step 1: Capture the error

If the user already pasted an error, use that. Otherwise:

```bash
bun expo start 2>&1 | tail -50
# or for native:
bun ios 2>&1 | tail -100
bun android 2>&1 | tail -100
```

## Step 2: Run expo-doctor first

```bash
npx expo-doctor
```

If `expo-doctor` reports anything:

```bash
CI=1 npx expo install --fix
```

Then re-run the failing build. Most version-drift problems are solved here.

## Step 3: Delegate to the agent

If `expo-doctor` is clean but the build still fails, delegate to `react-native-build-resolver`:

> Use the `react-native-build-resolver` agent with the full error message and the relevant `package.json` / `babel.config.js` / `app.json` excerpts.

The agent's triage covers:

1. `npx expo-doctor` (already done)
2. Metro "Unable to resolve module"
3. Reanimated babel-plugin order
4. Expo prebuild conflicts
5. CocoaPods (iOS)
6. JDK / Gradle (Android)
7. New Architecture compatibility
8. EAS Build log spelunking

## Step 4: Apply the minimum fix

- Touch the smallest possible set of files.
- Do NOT bump Expo SDK as a "fix."
- Do NOT `rm -rf node_modules` as a first step.
- Re-run the failing command and confirm green.

## Step 5: Verify

```bash
bun type-check
bun lint
bun expo start         # boots
```

If all three pass, the fix is complete. Commit with `fix(build): <one-line cause and fix>`.

## When to escalate to the user

- The fix requires removing a library (need user consent).
- The fix requires disabling `newArchEnabled` (worth a discussion).
- The fix needs an Expo SDK upgrade (out of scope for build-fix).
