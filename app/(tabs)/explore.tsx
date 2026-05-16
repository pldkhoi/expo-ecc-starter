import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { useCounterStore } from '@/stores/counter-store';

type Item = { id: string; label: string };

const ITEMS: Item[] = Array.from({ length: 50 }, (_, i) => ({
  id: String(i),
  label: `Item ${i + 1}`,
}));

const ROW_HEIGHT = 44;

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const count = useCounterStore((s) => s.count);
  const increment = useCounterStore((s) => s.increment);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Pressable
        onPress={increment}
        accessibilityRole="button"
        accessibilityLabel={`Increment counter, current value ${count}`}
        style={styles.button}
      >
        <ThemedText>Count: {count}</ThemedText>
      </Pressable>
      <FlatList
        data={ITEMS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <ThemedText>{item.label}</ThemedText>
          </View>
        )}
        getItemLayout={(_, index) => ({
          length: ROW_HEIGHT,
          offset: ROW_HEIGHT * index,
          index,
        })}
        initialNumToRender={10}
        windowSize={5}
        removeClippedSubviews
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  button: {
    padding: 12,
    backgroundColor: '#e6f4f9',
    borderRadius: 8,
    marginBottom: 16,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { height: ROW_HEIGHT, justifyContent: 'center' },
});
