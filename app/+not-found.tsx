import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/theme/theme-provider';

export default function NotFoundScreen() {
  const { theme } = useTheme();
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ThemedText type="title">404</ThemedText>
        <ThemedText type="muted" style={styles.center}>
          That screen does not exist. Check the URL or head home.
        </ThemedText>
        <Link href="/" asChild>
          <Button label="Back to home" variant="secondary" />
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  center: { textAlign: 'center' },
});
