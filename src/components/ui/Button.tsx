import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
} from 'react-native';

import { useTheme } from '@/theme/theme-provider';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const SIZES: Record<
  ButtonSize,
  { paddingVertical: number; paddingHorizontal: number; fontSize: number; minHeight: number }
> = {
  sm: { paddingVertical: 8, paddingHorizontal: 14, fontSize: 14, minHeight: 36 },
  md: { paddingVertical: 12, paddingHorizontal: 18, fontSize: 16, minHeight: 48 },
  lg: { paddingVertical: 16, paddingHorizontal: 22, fontSize: 18, minHeight: 56 },
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  accessibilityLabel,
  accessibilityHint,
  ...rest
}: ButtonProps) {
  const { theme } = useTheme();
  const isDisabled = disabled || loading;
  const sizeStyle = SIZES[size];

  const palette = resolveVariant(variant, theme.colors);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: palette.background,
          borderColor: palette.border,
          paddingVertical: sizeStyle.paddingVertical,
          paddingHorizontal: sizeStyle.paddingHorizontal,
          minHeight: sizeStyle.minHeight,
          borderRadius: theme.radii.md,
          opacity: isDisabled ? 0.55 : 1,
        },
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressed,
      ]}
      {...rest}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={palette.foreground} size="small" />
        ) : (
          <>
            {leftIcon ? <View style={styles.icon}>{leftIcon}</View> : null}
            <Text
              style={{
                color: palette.foreground,
                fontSize: sizeStyle.fontSize,
                fontWeight: '600',
              }}
            >
              {label}
            </Text>
            {rightIcon ? <View style={styles.icon}>{rightIcon}</View> : null}
          </>
        )}
      </View>
    </Pressable>
  );
}

interface Palette {
  background: string;
  foreground: string;
  border: string;
}

function resolveVariant(
  variant: ButtonVariant,
  colors: ReturnType<typeof useTheme>['theme']['colors'],
): Palette {
  switch (variant) {
    case 'primary':
      return { background: colors.tint, foreground: colors.tintForeground, border: colors.tint };
    case 'secondary':
      return {
        background: colors.backgroundElevated,
        foreground: colors.text,
        border: colors.border,
      };
    case 'ghost':
      return { background: 'transparent', foreground: colors.tint, border: 'transparent' };
    case 'danger':
      return {
        background: colors.danger,
        foreground: colors.dangerForeground,
        border: colors.danger,
      };
  }
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: { alignSelf: 'stretch' },
  pressed: { opacity: 0.85 },
});
