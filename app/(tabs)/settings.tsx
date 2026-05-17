import Constants from 'expo-constants';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ChevronRight, LogOut, Moon, Sun } from '@/components/icons';
import { useAuthStore } from '@/stores/auth-store';
import { useTheme } from '@/theme/theme-provider';

export default function SettingsScreen() {
  const { theme, colorScheme, preference, setPreference } = useTheme();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const version = Constants.expoConfig?.version ?? '0.0.0';

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Card>
        <ThemedText type="subtitle">Account</ThemedText>
        <View style={{ marginTop: 8 }}>
          <ThemedText>{user?.name ?? 'Anonymous'}</ThemedText>
          <ThemedText type="muted">{user?.email ?? 'no-email'}</ThemedText>
        </View>
      </Card>

      <Card padding="none">
        <SectionHeader title="Appearance" />
        <ThemeOption
          label="System"
          description="Match the OS color scheme"
          selected={preference === 'system'}
          onPress={() => setPreference('system')}
          icon={
            colorScheme === 'dark' ? (
              <Moon size={18} color={theme.colors.text} />
            ) : (
              <Sun size={18} color={theme.colors.text} />
            )
          }
        />
        <ThemeOption
          label="Light"
          description="Always light"
          selected={preference === 'light'}
          onPress={() => setPreference('light')}
          icon={<Sun size={18} color={theme.colors.text} />}
        />
        <ThemeOption
          label="Dark"
          description="Always dark"
          selected={preference === 'dark'}
          onPress={() => setPreference('dark')}
          icon={<Moon size={18} color={theme.colors.text} />}
          last
        />
      </Card>

      <Card padding="none">
        <SectionHeader title="More" />
        <Row label="Open modal example" onPress={() => router.push('/(modal)/example')} last />
      </Card>

      <Button
        label="Sign out"
        variant="danger"
        onPress={signOut}
        leftIcon={<LogOut size={18} color={theme.colors.dangerForeground} />}
        fullWidth
      />

      <ThemedText type="muted" style={styles.version}>
        v{version}
      </ThemedText>
    </ScrollView>
  );
}

interface ThemeOptionProps {
  label: string;
  description: string;
  selected: boolean;
  onPress: () => void;
  icon: React.ReactNode;
  last?: boolean;
}

function ThemeOption({ label, description, selected, onPress, icon, last }: ThemeOptionProps) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Use ${label.toLowerCase()} theme`}
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.row,
        !last && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: theme.colors.border,
        },
        pressed && { backgroundColor: theme.colors.backgroundElevated },
      ]}
    >
      <View style={styles.rowIcon}>{icon}</View>
      <View style={styles.rowText}>
        <ThemedText>{label}</ThemedText>
        <ThemedText type="muted">{description}</ThemedText>
      </View>
      {selected ? <ThemedText type="link">Active</ThemedText> : null}
    </Pressable>
  );
}

interface RowProps {
  label: string;
  onPress: () => void;
  last?: boolean;
}

function Row({ label, onPress, last }: RowProps) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.row,
        !last && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: theme.colors.border,
        },
        pressed && { backgroundColor: theme.colors.backgroundElevated },
      ]}
    >
      <View style={styles.rowText}>
        <ThemedText>{label}</ThemedText>
      </View>
      <ChevronRight size={18} color={theme.colors.textMuted} />
    </Pressable>
  );
}

function SectionHeader({ title }: { title: string }) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.sectionHeader,
        { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.border },
      ]}
    >
      <ThemedText type="muted">{title}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 16, paddingBottom: 48 },
  sectionHeader: { paddingHorizontal: 16, paddingVertical: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 56,
  },
  rowIcon: { width: 28, alignItems: 'center' },
  rowText: { flex: 1, gap: 2 },
  version: { textAlign: 'center', marginTop: 8 },
});
