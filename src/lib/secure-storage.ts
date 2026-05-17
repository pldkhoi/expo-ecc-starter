import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import type { StateStorage } from 'zustand/middleware';

/**
 * Cross-platform secure-storage wrapper compatible with Zustand's `createJSONStorage`.
 *
 * - iOS: Keychain
 * - Android: EncryptedSharedPreferences (Keystore-backed)
 * - Web: `window.localStorage` (NOT secure — never ship a production web build that stores secrets here)
 *
 * Use this for auth tokens, refresh tokens, and PII. Use AsyncStorage for non-sensitive
 * preferences (theme, last tab, cached query results).
 */
export const secureStorage: StateStorage = {
  getItem: async (name) => {
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined') return null;
      return window.localStorage.getItem(name);
    }
    try {
      return await SecureStore.getItemAsync(name);
    } catch {
      return null;
    }
  },
  setItem: async (name, value) => {
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined') return;
      window.localStorage.setItem(name, value);
      return;
    }
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name) => {
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined') return;
      window.localStorage.removeItem(name);
      return;
    }
    await SecureStore.deleteItemAsync(name);
  },
};
