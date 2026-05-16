export type ColorName = 'text' | 'background' | 'tint' | 'icon' | 'border';

type Palette = Record<ColorName, string>;

const tintLight = '#0a7ea4';
const tintDark = '#ffffff';

export const Colors: { light: Palette; dark: Palette } = {
  light: {
    text: '#11181C',
    background: '#ffffff',
    tint: tintLight,
    icon: '#687076',
    border: '#e6e8eb',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintDark,
    icon: '#9BA1A6',
    border: '#27292c',
  },
};
