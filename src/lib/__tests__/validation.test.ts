import { signInSchema, signUpSchema } from '@/lib/validation';

describe('signInSchema', () => {
  it('accepts a valid email and password', () => {
    const result = signInSchema.safeParse({ email: 'a@example.com', password: '12345678' });
    expect(result.success).toBe(true);
  });

  it('rejects an invalid email', () => {
    const result = signInSchema.safeParse({ email: 'nope', password: '12345678' });
    expect(result.success).toBe(false);
  });

  it('rejects passwords shorter than 8 characters', () => {
    const result = signInSchema.safeParse({ email: 'a@example.com', password: 'short' });
    expect(result.success).toBe(false);
  });
});

describe('signUpSchema', () => {
  it('requires matching passwords', () => {
    const result = signUpSchema.safeParse({
      name: 'Alice',
      email: 'a@example.com',
      password: '12345678',
      confirmPassword: 'different',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.join('.') === 'confirmPassword');
      expect(issue?.message).toBe('Passwords do not match.');
    }
  });

  it('passes when all fields are valid and passwords match', () => {
    const result = signUpSchema.safeParse({
      name: 'Alice',
      email: 'a@example.com',
      password: '12345678',
      confirmPassword: '12345678',
    });
    expect(result.success).toBe(true);
  });
});
