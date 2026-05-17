import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/theme/theme-provider';

export default function ModalExample() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background, paddingBottom: insets.bottom + 24 },
      ]}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedText type="title">Modal example</ThemedText>
        <ThemedText type="muted">
          Presented with `presentation: &quot;modal&quot;`. Dismiss with `router.dismiss()`.
        </ThemedText>

        <Card>
          <ThemedText type="subtitle">When to use a modal</ThemedText>
          <ThemedText style={{ marginTop: 8 }}>
            Modals interrupt the main flow for a focused task: confirming an action, picking a
            value, displaying a one-shot detail view. Avoid stacking modals — push a new screen
            instead.
          </ThemedText>
        </Card>
      </ScrollView>

      <Button label="Dismiss" onPress={() => router.dismiss()} fullWidth />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 16, gap: 16 },
  content: { gap: 16, paddingBottom: 24 },
});
