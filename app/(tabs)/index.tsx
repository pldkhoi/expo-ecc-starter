import Constants from 'expo-constants';
import { Link } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowRight } from '@/components/icons';
import { useAuthStore } from '@/stores/auth-store';
import { useTheme } from '@/theme/theme-provider';

export default function HomeScreen() {
  const { theme } = useTheme();
  const user = useAuthStore((s) => s.user);
  const appName = Constants.expoConfig?.name ?? 'Your app';

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <ThemedText type="muted">Welcome back, {user?.name ?? 'friend'}.</ThemedText>
        <ThemedText type="title">{appName}</ThemedText>
        <ThemedText type="muted">
          Edit `app/(tabs)/index.tsx` to start. Everything else is documented in `docs/` and
          `CLAUDE.md`.
        </ThemedText>
      </View>

      <Card>
        <ThemedText type="subtitle">What you get out of the box</ThemedText>
        <View style={styles.list}>
          <ThemedText>• Expo Router 6 + typed routes + `Stack.Protected` auth gating</ThemedText>
          <ThemedText>• Theme provider with light / dark / system</ThemedText>
          <ThemedText>• TanStack Query 5 + persisted cache</ThemedText>
          <ThemedText>• React Hook Form + Zod for forms</ThemedText>
          <ThemedText>• Mock auth flow with `expo-secure-store`</ThemedText>
          <ThemedText>• UI primitives (Button, Card, Input, Spinner) + lucide icons</ThemedText>
          <ThemedText>• ErrorBoundary at the root</ThemedText>
          <ThemedText>• Jest setup + sample tests + Maestro smoke flow</ThemedText>
        </View>
      </Card>

      <Card>
        <ThemedText type="subtitle">Next steps</ThemedText>
        <View style={styles.list}>
          <ThemedText>1. Run `bun init` to rename the project.</ThemedText>
          <ThemedText>2. Edit `src/theme/theme.ts` to set your brand colors.</ThemedText>
          <ThemedText>
            3. Replace mock `signIn` in `app/(auth)/sign-in.tsx` with a real API call.
          </ThemedText>
          <ThemedText>4. Add your first feature under `src/` and `app/`.</ThemedText>
        </View>
      </Card>

      <Link href="/(modal)/example" asChild>
        <Button
          label="Open modal example"
          variant="secondary"
          rightIcon={<ArrowRight size={16} color={theme.colors.text} />}
        />
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 16, paddingBottom: 48 },
  header: { gap: 6 },
  list: { gap: 6, marginTop: 8 },
});
