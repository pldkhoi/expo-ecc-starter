---
name: react-native-performance
description: Performance patterns for React Native on Expo SDK 55. Covers FlatList tuning, memoization, expo-image, Reanimated worklets, Hermes, bundle size, and Perf Monitor usage. Use whenever a screen feels slow or a list janks.
origin: ecc/expo
---

# React Native performance

Measure first. Don't optimize without a number.

## Targets

- Cold-start TTI on mid-range Android: < 2 s
- JS thread during scroll: ≥ 55 fps
- UI thread during animation: ≥ 58 fps
- Production JS bundle: < 2 MB gzipped per platform

## FlatList tuning

```tsx
<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={renderItem} // defined OUTSIDE the screen body
  getItemLayout={getItemLayout} // when row height is constant
  initialNumToRender={10}
  windowSize={5} // default 21 is overkill
  maxToRenderPerBatch={5}
  removeClippedSubviews // android default true; iOS opt-in
/>
```

Row component:

```tsx
type Item = { id: string; label: string };

const Row = React.memo(({ item }: { item: Item }) => (
  <View style={styles.row}>
    <ThemedText>{item.label}</ThemedText>
  </View>
));

const renderItem = ({ item }: { item: Item }) => <Row item={item} />;
const ROW_HEIGHT = 44;
const getItemLayout = (_: unknown, i: number) => ({
  length: ROW_HEIGHT,
  offset: ROW_HEIGHT * i,
  index: i,
});
```

Anti-patterns: anonymous `renderItem`, inline style objects, missing `keyExtractor`, `keyExtractor={(_, i) => String(i)}` (breaks on reorder).

## Memoization

- `React.memo` AFTER the profiler proves wasted re-renders. Random memoization adds maintenance cost.
- `useCallback` only when the callback is passed to a memoized child OR a Reanimated worklet.
- `useMemo` only when the computation is measurable (>1 ms) AND input is stable.

## Zustand selectors

```tsx
// BAD — subscribes to whole store
const { count, increment } = useStore();

// GOOD — selector subscribes to one slice
const count = useStore((s) => s.count);
const increment = useStore((s) => s.increment);
```

For shallow-equality on objects: `useStore((s) => ({ a: s.a, b: s.b }), shallow)` (import `shallow` from `zustand/shallow`).

## expo-image over RN Image

```tsx
import { Image } from 'expo-image';

<Image
  source={uri}
  style={{ width: 200, height: 200 }}
  contentFit="cover"
  cachePolicy="memory-disk"
  placeholder={{ blurhash }}
  transition={150}
/>;
```

Benefits over RN `Image`: shared cache, blurhash placeholder, content-fit semantics, faster decode.

## Reanimated 3

Animated values live on the UI thread:

```tsx
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const opacity = useSharedValue(0);
const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

useEffect(() => {
  opacity.value = withTiming(1, { duration: 200 });
}, []);

return <Animated.View style={style}>...</Animated.View>;
```

- `useSharedValue` for any value that animates.
- `runOnJS(fn)(args)` ONLY when a worklet needs to call a JS function.
- Gate motion: `if (await AccessibilityInfo.isReduceMotionEnabled()) return;`

## Hermes

Default-on in SDK 55. Verify at runtime:

```ts
if (typeof __HERMES_INTERNAL__ !== 'undefined') {
  /* Hermes */
}
```

No per-screen action needed. Bundle is pre-compiled to bytecode at build time.

## Bundle hygiene

```bash
npx expo export
du -sh dist/_expo/static/js
```

Tactics:

- Import named, not default: `import { format } from 'date-fns'`.
- Replace heavy libs: `moment` → `date-fns` or local helper.
- Avoid `lodash/*` whole import; use per-function: `import sortBy from 'lodash/sortBy'`.
- Lazy-load screens — Expo Router does this per file automatically; confirm with the bundle visualizer.

## Perf Monitor

Shake the device → Show Perf Monitor. Two key rows:

- **JS** — frames the JS thread can process per second. Drops here mean too much synchronous work in render or in a handler.
- **UI** — frames the native UI thread can render. Drops here mean a Reanimated worklet is doing too much or a layout is too expensive.

Aim for sustained ≥ 55 fps on both during the worst-case interaction (long scroll, modal open, list filter).

## Anti-patterns

| Anti-pattern                       | Fix                                              |
| ---------------------------------- | ------------------------------------------------ |
| Inline style object in render      | Hoist to `StyleSheet.create`                     |
| Anonymous `renderItem` in FlatList | Define outside or `useCallback` with stable deps |
| Animated value in `useState`       | `useSharedValue`                                 |
| `setNativeProps` in a loop         | Batch with `requestAnimationFrame`               |
| Full-state Zustand subscribe       | Use selectors                                    |
| `Image` with no cache policy       | `expo-image` with `cachePolicy="memory-disk"`    |
| `console.log` in release           | Wrap in `if (__DEV__)`                           |
