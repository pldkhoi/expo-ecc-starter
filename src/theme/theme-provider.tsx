import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

import { themes, type ColorScheme, type Theme } from '@/theme/theme';

export type ThemePreference = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'theme.preference.v1';

interface ThemeContextValue {
  theme: Theme;
  colorScheme: ColorScheme;
  preference: ThemePreference;
  isDark: boolean;
  setPreference: (preference: ThemePreference) => void;
  toggleColorScheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
  defaultPreference?: ThemePreference;
}

export function ThemeProvider({ children, defaultPreference = 'system' }: ThemeProviderProps) {
  const systemScheme = useRNColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>(defaultPreference);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (cancelled) return;
        if (value === 'light' || value === 'dark' || value === 'system') {
          setPreferenceState(value);
        }
      })
      .catch(() => {
        // Storage read failed (e.g. first run on web with cleared storage). Keep default.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const colorScheme: ColorScheme = useMemo(() => {
    if (preference === 'light' || preference === 'dark') return preference;
    return systemScheme === 'dark' ? 'dark' : 'light';
  }, [preference, systemScheme]);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {
      // Persisting is best-effort; UI already updated optimistically.
    });
  }, []);

  const toggleColorScheme = useCallback(() => {
    setPreference(colorScheme === 'dark' ? 'light' : 'dark');
  }, [colorScheme, setPreference]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: themes[colorScheme],
      colorScheme,
      preference,
      isDark: colorScheme === 'dark',
      setPreference,
      toggleColorScheme,
    }),
    [colorScheme, preference, setPreference, toggleColorScheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('useTheme must be used within a <ThemeProvider>.');
  }
  return value;
}
