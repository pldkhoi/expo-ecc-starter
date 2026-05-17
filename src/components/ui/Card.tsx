import { Platform, StyleSheet, View, type ViewProps } from 'react-native';

import { useTheme } from '@/theme/theme-provider';

export interface CardProps extends ViewProps {
  padding?: 'sm' | 'md' | 'lg' | 'none';
  elevation?: 'none' | 'sm' | 'md';
}

const PADDING = { none: 0, sm: 8, md: 16, lg: 24 } as const;

export function Card({ style, padding = 'md', elevation = 'sm', children, ...rest }: CardProps) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: theme.colors.backgroundElevated,
          borderColor: theme.colors.border,
          borderRadius: theme.radii.lg,
          padding: PADDING[padding],
        },
        elevation !== 'none' && elevationStyle(elevation),
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

function elevationStyle(level: 'sm' | 'md') {
  if (Platform.OS === 'android') {
    return { elevation: level === 'md' ? 4 : 2 } as const;
  }
  if (Platform.OS === 'ios') {
    return level === 'md'
      ? ({
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 12,
        } as const)
      : ({
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 6,
        } as const);
  }
  return {};
}

const styles = StyleSheet.create({
  base: {
    borderWidth: StyleSheet.hairlineWidth,
  },
});
