import { z } from 'zod';

export const emailSchema = z
  .string()
  .trim()
  .min(1, 'Email is required.')
  .email('Enter a valid email address.');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters.')
  .max(128, 'Password must be at most 128 characters.');

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
export type SignInValues = z.infer<typeof signInSchema>;

export const signUpSchema = signInSchema
  .extend({
    name: z.string().trim().min(2, 'Name must be at least 2 characters.').max(80),
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });
export type SignUpValues = z.infer<typeof signUpSchema>;
