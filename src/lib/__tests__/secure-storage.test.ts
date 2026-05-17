import { secureStorage } from '@/lib/secure-storage';

describe('secureStorage', () => {
  beforeEach(async () => {
    await secureStorage.removeItem('test.key');
  });

  it('round-trips a value', async () => {
    await secureStorage.setItem('test.key', 'hello');
    const value = await secureStorage.getItem('test.key');
    expect(value).toBe('hello');
  });

  it('returns null for a missing key', async () => {
    const value = await secureStorage.getItem('does.not.exist');
    expect(value).toBeNull();
  });

  it('removes a value', async () => {
    await secureStorage.setItem('test.key', 'gone');
    await secureStorage.removeItem('test.key');
    expect(await secureStorage.getItem('test.key')).toBeNull();
  });
});
