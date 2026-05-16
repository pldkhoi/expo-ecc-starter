import { useColorScheme as useRNColorScheme } from 'react-native';

import { Colors, type ColorName } from '@/theme/colors';

export function useColorScheme(): 'light' | 'dark' {
  const scheme = useRNColorScheme();
  return scheme === 'dark' ? 'dark' : 'light';
}

export function useThemeColor(name: ColorName): string {
  const scheme = useColorScheme();
  return Colors[scheme][name];
}
