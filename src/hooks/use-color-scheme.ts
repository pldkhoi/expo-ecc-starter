import { useTheme } from '@/theme/theme-provider';
import type { ColorName } from '@/theme/colors';
import type { ColorScheme } from '@/theme/theme';

/**
 * Convenience hook: returns the currently effective color scheme.
 * Delegates to {@link useTheme}, which also exposes `theme`, `preference`, and setters.
 */
export function useColorScheme(): ColorScheme {
  return useTheme().colorScheme;
}

/** Returns the color value for a token in the current theme. */
export function useThemeColor(name: ColorName): string {
  return useTheme().theme.colors[name];
}
