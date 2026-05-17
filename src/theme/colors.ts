import { themes, type ThemeColors } from '@/theme/theme';

export type ColorName = keyof ThemeColors;

export const Colors = {
  light: themes.light.colors,
  dark: themes.dark.colors,
} as const;
