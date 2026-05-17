import { StyleSheet, Text, type TextProps } from 'react-native';

import { useTheme } from '@/theme/theme-provider';

type ThemedTextType = 'default' | 'title' | 'subtitle' | 'link' | 'muted';

export type ThemedTextProps = TextProps & {
  type?: ThemedTextType;
};

export function ThemedText({ style, type = 'default', ...rest }: ThemedTextProps) {
  const { theme } = useTheme();
  const colorByType: Record<ThemedTextType, string> = {
    default: theme.colors.text,
    title: theme.colors.text,
    subtitle: theme.colors.text,
    link: theme.colors.tint,
    muted: theme.colors.textMuted,
  };
  return <Text style={[{ color: colorByType[type] }, styles[type], style]} {...rest} />;
}

const styles = StyleSheet.create({
  default: { fontSize: 16, lineHeight: 24 },
  title: { fontSize: 28, fontWeight: '700', lineHeight: 34 },
  subtitle: { fontSize: 20, fontWeight: '600', lineHeight: 26 },
  link: { fontSize: 16, lineHeight: 24 },
  muted: { fontSize: 14, lineHeight: 20 },
});
