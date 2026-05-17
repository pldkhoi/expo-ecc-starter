import { act, fireEvent } from '@testing-library/react-native';
import { Pressable, Text } from 'react-native';

import { renderWithProviders } from '@/test-utils/render';
import { useTheme } from '@/theme/theme-provider';

function ThemeProbe() {
  const { colorScheme, preference, setPreference } = useTheme();
  return (
    <>
      <Text testID="scheme">{colorScheme}</Text>
      <Text testID="preference">{preference}</Text>
      <Pressable testID="dark" onPress={() => setPreference('dark')}>
        <Text>dark</Text>
      </Pressable>
      <Pressable testID="light" onPress={() => setPreference('light')}>
        <Text>light</Text>
      </Pressable>
    </>
  );
}

describe('useTheme', () => {
  it('returns the system color scheme by default', () => {
    const { getByTestId } = renderWithProviders(<ThemeProbe />);
    expect(getByTestId('preference').props.children).toBe('system');
    expect(['light', 'dark']).toContain(getByTestId('scheme').props.children);
  });

  it('switches to dark when setPreference("dark") is called', () => {
    const { getByTestId } = renderWithProviders(<ThemeProbe />);
    act(() => {
      fireEvent.press(getByTestId('dark'));
    });
    expect(getByTestId('preference').props.children).toBe('dark');
    expect(getByTestId('scheme').props.children).toBe('dark');
  });

  it('switches to light when setPreference("light") is called', () => {
    const { getByTestId } = renderWithProviders(<ThemeProbe />);
    act(() => {
      fireEvent.press(getByTestId('light'));
    });
    expect(getByTestId('preference').props.children).toBe('light');
    expect(getByTestId('scheme').props.children).toBe('light');
  });
});
