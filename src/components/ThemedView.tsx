import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-color-scheme';

export type ThemedViewProps = ViewProps;

export function ThemedView({ style, ...rest }: ThemedViewProps) {
  const backgroundColor = useThemeColor('background');
  return <View style={[{ backgroundColor }, style]} {...rest} />;
}
