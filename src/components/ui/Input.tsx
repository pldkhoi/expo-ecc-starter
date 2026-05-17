import { forwardRef, useId, useState } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { useTheme } from '@/theme/theme-provider';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string | undefined;
  hint?: string;
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  { label, error, hint, accessibilityLabel, onFocus, onBlur, ...rest },
  ref,
) {
  const { theme } = useTheme();
  const [focused, setFocused] = useState(false);
  const reactId = useId();
  const hintId = hint ? `${reactId}-hint` : undefined;
  const errorId = error ? `${reactId}-error` : undefined;

  const borderColor = error
    ? theme.colors.danger
    : focused
      ? theme.colors.tint
      : theme.colors.border;

  return (
    <View style={styles.wrapper}>
      {label ? (
        <Text style={[styles.label, { color: theme.colors.text }]} accessibilityRole="text">
          {label}
        </Text>
      ) : null}
      <TextInput
        ref={ref}
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityHint={hint}
        placeholderTextColor={theme.colors.textMuted}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        style={[
          styles.input,
          {
            color: theme.colors.text,
            backgroundColor: theme.colors.background,
            borderColor,
            borderRadius: theme.radii.md,
          },
        ]}
        {...rest}
      />
      {error ? (
        <Text
          nativeID={errorId}
          accessibilityLiveRegion="polite"
          style={[styles.help, { color: theme.colors.danger }]}
        >
          {error}
        </Text>
      ) : hint ? (
        <Text nativeID={hintId} style={[styles.help, { color: theme.colors.textMuted }]}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: { fontSize: 14, fontWeight: '500' },
  input: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 48,
  },
  help: { fontSize: 12, lineHeight: 16 },
});
