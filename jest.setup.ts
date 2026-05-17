import '@testing-library/jest-native/extend-expect';

// React Native's `Animated` polyfill is noisy under JSDOM; silence the warning.
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({}), { virtual: true });

// AsyncStorage is auto-mocked from __mocks__/@react-native-async-storage/async-storage.ts
// expo-secure-store is auto-mocked from __mocks__/expo-secure-store.ts

// Silence the "useNativeDriver" warning from RN.
const originalWarn = console.warn;
console.warn = (...args: unknown[]) => {
  const [first] = args;
  if (typeof first === 'string' && first.includes('useNativeDriver')) return;
  originalWarn(...(args as Parameters<typeof console.warn>));
};
