import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { signInSchema, type SignInValues } from '@/lib/validation';
import { useAuthStore } from '@/stores/auth-store';
import { useTheme } from '@/theme/theme-provider';

const DEFAULT_VALUES: SignInValues = { email: '', password: '' };

export default function SignInScreen() {
  const { theme } = useTheme();
  const signIn = useAuthStore((s) => s.signIn);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const onSubmit = handleSubmit(async (values) => {
    // Replace this with a real network call.
    await new Promise((resolve) => setTimeout(resolve, 800));
    signIn(
      { id: 'mock-user-1', email: values.email, name: values.email.split('@')[0] ?? 'You' },
      'mock-jwt-token',
    );
  });

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.select({ ios: 'padding', default: undefined })}
      keyboardVerticalOffset={Platform.select({ ios: 64, default: 0 })}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <ThemedText type="title">Welcome back</ThemedText>
          <ThemedText type="muted">Sign in to continue.</ThemedText>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email"
                placeholder="you@example.com"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                keyboardType="email-address"
                inputMode="email"
                textContentType="emailAddress"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Password"
                placeholder="At least 8 characters"
                autoCapitalize="none"
                autoComplete="password"
                autoCorrect={false}
                secureTextEntry
                textContentType="password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.password?.message}
              />
            )}
          />

          <Button
            label="Sign in"
            onPress={onSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
            fullWidth
          />
        </View>

        <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
          <ThemedText type="muted">Do not have an account?</ThemedText>
          <Link href="/(auth)/sign-up" accessibilityRole="link">
            <ThemedText type="link">Create one</ThemedText>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: 24, gap: 24, flexGrow: 1 },
  header: { gap: 6, marginTop: 16 },
  form: { gap: 16 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: 'auto',
  },
});
