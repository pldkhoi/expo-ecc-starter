import { ApiError, api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';

const initialAuth = useAuthStore.getState();

describe('api', () => {
  const fetchMock = jest.fn();

  beforeAll(() => {
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  beforeEach(() => {
    fetchMock.mockReset();
    useAuthStore.setState(initialAuth, true);
  });

  it('returns parsed JSON on 200', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => ({ id: 1, name: 'pikachu' }),
    });

    const result = await api.get<{ id: number; name: string }>('/pokemon/pikachu');
    expect(result).toEqual({ id: 1, name: 'pikachu' });
  });

  it('attaches the Bearer token from the auth store by default', async () => {
    useAuthStore.getState().signIn({ id: 'u1', email: 'a@example.com', name: 'A' }, 'jwt-abc');

    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => ({}),
    });

    await api.get('/me');
    const call = fetchMock.mock.calls[0]?.[1] as RequestInit | undefined;
    const headers = call?.headers as Record<string, string> | undefined;
    expect(headers?.Authorization).toBe('Bearer jwt-abc');
  });

  it('omits the Authorization header when withAuth is false', async () => {
    useAuthStore.getState().signIn({ id: 'u1', email: 'a@example.com', name: 'A' }, 'jwt-abc');

    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => ({}),
    });

    await api.get('/public', { withAuth: false });
    const call = fetchMock.mock.calls[0]?.[1] as RequestInit | undefined;
    const headers = call?.headers as Record<string, string> | undefined;
    expect(headers?.Authorization).toBeUndefined();
  });

  it('throws ApiError on non-2xx responses', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: async () => ({ code: 'not_found', message: 'Pokemon missing' }),
    });

    await expect(api.get('/pokemon/missingno')).rejects.toMatchObject({
      status: 404,
      code: 'not_found',
      message: 'Pokemon missing',
    });
  });

  it('throws a timeout ApiError when fetch aborts', async () => {
    fetchMock.mockImplementationOnce(
      (_url: string, init?: RequestInit) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => {
            const error = new Error('aborted');
            error.name = 'AbortError';
            reject(error);
          });
        }),
    );

    await expect(api.get('/slow', { timeoutMs: 5 })).rejects.toBeInstanceOf(ApiError);
  });
});
