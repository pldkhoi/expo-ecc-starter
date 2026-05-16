import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ThemedText type="title">Welcome to expo-ecc-starter</ThemedText>
      <ThemedText>Edit app/(tabs)/index.tsx to start.</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
});
