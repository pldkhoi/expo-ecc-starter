import { fireEvent, renderWithProviders, screen } from '@/test-utils/render';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders the label and is accessible by role', () => {
    renderWithProviders(<Button label="Sign in" onPress={() => undefined} />);
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeOnTheScreen();
  });

  it('fires onPress when tapped', () => {
    const onPress = jest.fn();
    renderWithProviders(<Button label="Save" onPress={onPress} />);
    fireEvent.press(screen.getByRole('button', { name: 'Save' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not fire onPress when disabled', () => {
    const onPress = jest.fn();
    renderWithProviders(<Button label="Save" disabled onPress={onPress} />);
    fireEvent.press(screen.getByRole('button', { name: 'Save' }));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('does not fire onPress while loading', () => {
    const onPress = jest.fn();
    renderWithProviders(<Button label="Save" loading onPress={onPress} />);
    fireEvent.press(screen.getByRole('button', { name: 'Save' }));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('exposes loading state via accessibilityState.busy', () => {
    renderWithProviders(<Button label="Save" loading onPress={() => undefined} />);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button.props.accessibilityState).toMatchObject({ busy: true, disabled: true });
  });
});
