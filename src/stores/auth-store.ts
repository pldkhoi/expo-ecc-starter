import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { secureStorage } from '@/lib/secure-storage';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  hydrated: boolean;
  signIn: (user: AuthUser, token: string) => void;
  signOut: () => void;
  _setHydrated: () => void;
}

/**
 * Auth store backed by `expo-secure-store` (iOS Keychain / Android EncryptedSharedPreferences).
 *
 * Replace `signIn` with a real network call (or wire it inside a TanStack Query
 * `useMutation`) and pass the returned user + token into `signIn`. Avoid putting
 * server state (loading flags, fetched lists) in this store — that belongs to TanStack Query.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      hydrated: false,
      signIn: (user, token) => set({ user, token }),
      signOut: () => set({ user: null, token: null }),
      _setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: 'auth.v1',
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        state?._setHydrated();
      },
    },
  ),
);

export const selectIsAuthenticated = (state: AuthState): boolean => Boolean(state.token);
export const selectAuthHydrated = (state: AuthState): boolean => state.hydrated;
