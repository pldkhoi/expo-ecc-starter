import { act, fireEvent, waitFor } from '@testing-library/react-native';

import { renderWithProviders, screen } from '@/test-utils/render';
import { useAuthStore } from '@/stores/auth-store';
import SignInScreen from '../../app/(auth)/sign-in';

const initialAuth = useAuthStore.getState();

describe('SignInScreen', () => {
  beforeEach(() => {
    useAuthStore.setState(initialAuth, true);
  });

  it('renders email and password fields', () => {
    renderWithProviders(<SignInScreen />);
    expect(screen.getByLabelText('Email')).toBeOnTheScreen();
    expect(screen.getByLabelText('Password')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeOnTheScreen();
  });

  it('shows validation errors when fields are empty', async () => {
    renderWithProviders(<SignInScreen />);
    await act(async () => {
      fireEvent.press(screen.getByRole('button', { name: 'Sign in' }));
    });
    await waitFor(() => {
      expect(screen.getByText('Email is required.')).toBeOnTheScreen();
    });
  });

  it('signs the user in on a valid submission', async () => {
    renderWithProviders(<SignInScreen />);
    fireEvent.changeText(screen.getByLabelText('Email'), 'alice@example.com');
    fireEvent.changeText(screen.getByLabelText('Password'), 'password123');

    await act(async () => {
      fireEvent.press(screen.getByRole('button', { name: 'Sign in' }));
    });

    await waitFor(
      () => {
        expect(useAuthStore.getState().user?.email).toBe('alice@example.com');
        expect(useAuthStore.getState().token).toBeTruthy();
      },
      { timeout: 3000 },
    );
  });
});
