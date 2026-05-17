// Auto-mocked by Jest for any test that imports `@react-native-async-storage/async-storage`.
// In-memory implementation; reset between tests by mock factories if needed.

const store = new Map<string, string>();

const AsyncStorage = {
  getItem: jest.fn(async (key: string) => (store.has(key) ? (store.get(key) ?? null) : null)),
  setItem: jest.fn(async (key: string, value: string) => {
    store.set(key, value);
  }),
  removeItem: jest.fn(async (key: string) => {
    store.delete(key);
  }),
  clear: jest.fn(async () => {
    store.clear();
  }),
  getAllKeys: jest.fn(async () => Array.from(store.keys())),
  multiGet: jest.fn(async (keys: string[]) => keys.map((k) => [k, store.get(k) ?? null])),
  multiSet: jest.fn(async (entries: [string, string][]) => {
    for (const [k, v] of entries) store.set(k, v);
  }),
  multiRemove: jest.fn(async (keys: string[]) => {
    for (const k of keys) store.delete(k);
  }),
};

export default AsyncStorage;
export { AsyncStorage };
