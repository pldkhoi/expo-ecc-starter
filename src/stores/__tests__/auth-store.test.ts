import { useAuthStore, selectIsAuthenticated } from '@/stores/auth-store';

describe('auth-store', () => {
  const initial = useAuthStore.getState();

  beforeEach(() => {
    useAuthStore.setState(initial, true);
  });

  it('starts unauthenticated', () => {
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().token).toBeNull();
    expect(selectIsAuthenticated(useAuthStore.getState())).toBe(false);
  });

  it('signIn writes the user and token', () => {
    useAuthStore
      .getState()
      .signIn({ id: 'u1', email: 'a@example.com', name: 'Alice' }, 'fake-token');

    const state = useAuthStore.getState();
    expect(state.user?.email).toBe('a@example.com');
    expect(state.token).toBe('fake-token');
    expect(selectIsAuthenticated(state)).toBe(true);
  });

  it('signOut clears the user and token', () => {
    useAuthStore
      .getState()
      .signIn({ id: 'u1', email: 'a@example.com', name: 'Alice' }, 'fake-token');
    useAuthStore.getState().signOut();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(selectIsAuthenticated(state)).toBe(false);
  });
});
