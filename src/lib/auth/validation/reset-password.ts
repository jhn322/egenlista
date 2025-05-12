import * as z from 'zod';

export const resetPasswordSchema = z
  .object({
    token: z.string(),
    password: z
      .string()
      .min(8, { message: 'Lösenordet måste vara minst 8 tecken.' })
      .max(64, { message: 'Lösenordet måste vara högst 64 tecken.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Lösenorden matchar inte.',
    path: ['confirmPassword'],
  });
