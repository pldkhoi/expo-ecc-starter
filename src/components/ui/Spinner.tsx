import { ActivityIndicator, type ActivityIndicatorProps } from 'react-native';

import { useTheme } from '@/theme/theme-provider';

export interface SpinnerProps extends Omit<ActivityIndicatorProps, 'color'> {
  tone?: 'primary' | 'muted';
}

export function Spinner({ tone = 'primary', size = 'small', ...rest }: SpinnerProps) {
  const { theme } = useTheme();
  const color = tone === 'primary' ? theme.colors.tint : theme.colors.textMuted;
  return <ActivityIndicator color={color} size={size} {...rest} />;
}
