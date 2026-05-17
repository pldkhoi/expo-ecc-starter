import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

interface ErrorBoundaryProps {
  children: ReactNode;
  onReset?: () => void;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Hook your crash reporter here (Sentry, Bugsnag, etc).
    // Sentry.captureException(error, { contexts: { react: { componentStack: info.componentStack } } });
    if (__DEV__) {
      console.error('[ErrorBoundary] Uncaught render error', error, info.componentStack);
    }
  }

  reset = (): void => {
    this.setState({ error: null });
    this.props.onReset?.();
  };

  render(): ReactNode {
    const { error } = this.state;
    if (!error) return this.props.children;

    if (this.props.fallback) return this.props.fallback(error, this.reset);

    return <DefaultFallback error={error} onReset={this.reset} />;
  }
}

interface DefaultFallbackProps {
  error: Error;
  onReset: () => void;
}

function DefaultFallback({ error, onReset }: DefaultFallbackProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading} accessibilityRole="header">
        Something went wrong
      </Text>
      <Text style={styles.message}>
        {__DEV__
          ? error.message
          : 'An unexpected error occurred. Please try again. If the problem persists, contact support.'}
      </Text>
      {__DEV__ && error.stack ? (
        <ScrollView style={styles.stack} contentContainerStyle={styles.stackContent}>
          <Text style={styles.stackText}>{error.stack}</Text>
        </ScrollView>
      ) : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Try again"
        onPress={onReset}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Text style={styles.buttonText}>Try again</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    gap: 12,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#11181C',
  },
  message: {
    fontSize: 16,
    lineHeight: 22,
    color: '#454c52',
  },
  stack: {
    maxHeight: 240,
    backgroundColor: '#0a0a0a',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  stackContent: { paddingBottom: 12 },
  stackText: {
    color: '#f4b8b8',
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
    fontSize: 12,
    lineHeight: 18,
  },
  button: {
    marginTop: 16,
    backgroundColor: '#0a7ea4',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'flex-start',
    minHeight: 48,
    justifyContent: 'center',
  },
  buttonPressed: { opacity: 0.85 },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});
