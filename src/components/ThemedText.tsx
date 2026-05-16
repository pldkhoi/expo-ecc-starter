import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-color-scheme';

type ThemedTextType = 'default' | 'title' | 'subtitle' | 'link';

export type ThemedTextProps = TextProps & {
  type?: ThemedTextType;
};

export function ThemedText({ style, type = 'default', ...rest }: ThemedTextProps) {
  const color = useThemeColor('text');
  return <Text style={[{ color }, styles[type], style]} {...rest} />;
}

const styles = StyleSheet.create({
  default: { fontSize: 16, lineHeight: 24 },
  title: { fontSize: 28, fontWeight: '700', lineHeight: 34 },
  subtitle: { fontSize: 20, fontWeight: '600', lineHeight: 26 },
  link: { fontSize: 16, lineHeight: 24, color: '#0a7ea4' },
});
