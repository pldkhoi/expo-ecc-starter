export type ColorScheme = 'light' | 'dark';

export interface ThemeColors {
  text: string;
  textMuted: string;
  background: string;
  backgroundElevated: string;
  tint: string;
  tintForeground: string;
  border: string;
  icon: string;
  danger: string;
  dangerForeground: string;
  success: string;
  warning: string;
  overlay: string;
}

export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
} as const;
export type SpacingToken = keyof typeof spacing;

export const radii = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
} as const;
export type RadiusToken = keyof typeof radii;

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;
export type FontSizeToken = keyof typeof fontSizes;

export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;
export type FontWeightToken = keyof typeof fontWeights;

export const TINT_LIGHT = '#0a7ea4';
export const TINT_DARK = '#7ec8e3';

const colorsLight: ThemeColors = {
  text: '#11181C',
  textMuted: '#687076',
  background: '#ffffff',
  backgroundElevated: '#f6f8fa',
  tint: TINT_LIGHT,
  tintForeground: '#ffffff',
  border: '#e6e8eb',
  icon: '#687076',
  danger: '#dc2626',
  dangerForeground: '#ffffff',
  success: '#16a34a',
  warning: '#d97706',
  overlay: 'rgba(17, 24, 28, 0.4)',
};

const colorsDark: ThemeColors = {
  text: '#ECEDEE',
  textMuted: '#9BA1A6',
  background: '#151718',
  backgroundElevated: '#1f2123',
  tint: TINT_DARK,
  tintForeground: '#0a1116',
  border: '#27292c',
  icon: '#9BA1A6',
  danger: '#f87171',
  dangerForeground: '#1a0707',
  success: '#4ade80',
  warning: '#fbbf24',
  overlay: 'rgba(0, 0, 0, 0.55)',
};

export interface Theme {
  colors: ThemeColors;
  spacing: typeof spacing;
  radii: typeof radii;
  fontSizes: typeof fontSizes;
  fontWeights: typeof fontWeights;
}

export const themes: Record<ColorScheme, Theme> = {
  light: { colors: colorsLight, spacing, radii, fontSizes, fontWeights },
  dark: { colors: colorsDark, spacing, radii, fontSizes, fontWeights },
};
