---
name: expo-secure-store
description: SecureStore patterns for storing auth tokens, refresh tokens, and PII on iOS (Keychain) and Android (encrypted SharedPreferences). Covers API, size limits, Zustand integration, AsyncStorage migration, and what NOT to store. Use whenever storing any sensitive string on-device.
origin: ecc/expo
---

# expo-secure-store

`expo-secure-store` writes strings to the iOS Keychain and Android EncryptedSharedPreferences (AES-256-GCM). It is the only acceptable storage for auth tokens, refresh tokens, session IDs, and PII.

## API

```ts
import * as SecureStore from 'expo-secure-store';

await SecureStore.setItemAsync('access_token', token);
const token = await SecureStore.getItemAsync('access_token');
await SecureStore.deleteItemAsync('access_token');
```

All three return Promises. All three can throw — handle errors.

## When to use

| Data                                    | Storage                                 |
| --------------------------------------- | --------------------------------------- |
| Auth access token                       | SecureStore                             |
| Auth refresh token                      | SecureStore                             |
| Session cookie / ID                     | SecureStore                             |
| OAuth client secret (mobile-only flows) | SecureStore                             |
| User email, phone, address              | SecureStore                             |
| Theme preference                        | AsyncStorage                            |
| Last-opened tab                         | AsyncStorage                            |
| Recent search queries                   | AsyncStorage (if non-PII)               |
| Cached API response                     | AsyncStorage / TanStack Query persister |

If you're unsure, use SecureStore — the cost is a 2-byte difference in read latency.

## When NOT to use

- Payloads > 2 KB on iOS (Keychain item size soft-limit; reads start to slow above this). Split into chunks or store the bulk in AsyncStorage with a SecureStore-stored encryption key.
- Non-string data. Serialize with `JSON.stringify` first; SecureStore takes strings only.
- Cross-app sharing. SecureStore items are sandboxed per app.

## Zustand integration

See `zustand-store-patterns` for the full pattern. Short version:

```ts
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';

const secureStorage: StateStorage = {
  getItem: (name) => SecureStore.getItemAsync(name),
  setItem: (name, value) => SecureStore.setItemAsync(name, value),
  removeItem: (name) => SecureStore.deleteItemAsync(name),
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      setTokens: (a, r) => set({ accessToken: a, refreshToken: r }),
      clear: () => set({ accessToken: null, refreshToken: null }),
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => secureStorage),
      partialize: (s) => ({ accessToken: s.accessToken, refreshToken: s.refreshToken }),
    },
  ),
);
```

## Options

```ts
await SecureStore.setItemAsync('refresh_token', token, {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  requireAuthentication: false, // true = Face ID / fingerprint required to read
});
```

- `keychainAccessible` (iOS): `WHEN_UNLOCKED` (default), `WHEN_UNLOCKED_THIS_DEVICE_ONLY`, `AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY`. Use `*_THIS_DEVICE_ONLY` so backups (iCloud) don't carry the token to another device.
- `requireAuthentication`: prompts Face ID / fingerprint on every read. Reserve for high-value secrets (banking PIN, vault contents). Adds friction.

## Migration from AsyncStorage

If older code wrote tokens to AsyncStorage, migrate once on first run:

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const MIGRATION_KEY = 'auth_token_migrated_to_secure_store';

export async function migrateTokensIfNeeded(): Promise<void> {
  const done = await AsyncStorage.getItem(MIGRATION_KEY);
  if (done === '1') return;
  const legacyToken = await AsyncStorage.getItem('auth_token');
  if (legacyToken) {
    await SecureStore.setItemAsync('access_token', legacyToken);
    await AsyncStorage.removeItem('auth_token');
  }
  await AsyncStorage.setItem(MIGRATION_KEY, '1');
}
```

Run from the root layout's mount effect, gate UI behind it if necessary.

## Logout

Clear EVERY secure key explicitly. There is no "clear all" API:

```ts
await Promise.all([
  SecureStore.deleteItemAsync('access_token'),
  SecureStore.deleteItemAsync('refresh_token'),
  SecureStore.deleteItemAsync('user_id'),
]);
```

If you persist with Zustand `persist`, also clear the store: `useAuthStore.getState().clear()` and `useAuthStore.persist.clearStorage()`.

## Anti-patterns

| Anti-pattern                                                | Why it fails                                         |
| ----------------------------------------------------------- | ---------------------------------------------------- |
| `AsyncStorage.setItem('token', t)` for a JWT                | Plain-text on disk; root / debug bridge reads it     |
| Storing a 50 KB encrypted blob                              | Keychain becomes a perf bottleneck on read           |
| `requireAuthentication: true` on every read                 | User Face-IDs constantly; abandons the app           |
| Forgetting to clear on logout                               | Next user inherits the previous account's tokens     |
| Logging the result of `getItemAsync`                        | Token in stack trace / Sentry breadcrumb             |
| `await SecureStore.getItemAsync(...)` with no `try / catch` | Throws on first-run before the key exists; UI breaks |
