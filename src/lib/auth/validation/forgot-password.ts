import * as z from 'zod';

export const forgotPasswordSchema = z.object({
  email: z.string().email({
    message: 'Snälla ange en giltlig e-postadress.',
  }),
});
