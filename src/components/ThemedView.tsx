import { View, type ViewProps } from 'react-native';

import { useTheme } from '@/theme/theme-provider';

export type ThemedViewProps = ViewProps & {
  surface?: 'background' | 'elevated';
};

export function ThemedView({ style, surface = 'background', ...rest }: ThemedViewProps) {
  const { theme } = useTheme();
  const backgroundColor =
    surface === 'elevated' ? theme.colors.backgroundElevated : theme.colors.background;
  return <View style={[{ backgroundColor }, style]} {...rest} />;
}
