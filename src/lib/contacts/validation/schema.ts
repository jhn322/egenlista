import { z } from 'zod';
import { ContactType } from '@/generated/prisma'; // Import the enum

// * ==========================================================================
// *                            CONTACT VALIDATION SCHEMAS
// * ==========================================================================

// ** Schema for Creating a Contact ** //
// Includes fields expected from the widget/form submission
export const ContactCreateSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required.' }).max(100),
  lastName: z.string().min(1, { message: 'Last name is required.' }).max(100),
  email: z.string().email({ message: 'Invalid email address.' }),
  phone: z.string().optional(), // Keep optional as in schema
  // Note: 'type' is defaulted in Prisma, not expected from client form
  // Note: 'userId' is determined server-side from widget/auth
});

// Infer the TypeScript type for input data validation
export type ContactCreateInput = z.infer<typeof ContactCreateSchema>;

// ** Schema for Updating a Contact ** //
// Allows partial updates and changing the type
export const ContactUpdateSchema = ContactCreateSchema.partial().extend({
  type: z.nativeEnum(ContactType).optional(), // Allow updating type
  note: z.string().optional(),
  noteUpdatedAt: z.date().optional(),
});
export type ContactUpdateInput = z.infer<typeof ContactUpdateSchema>;

// ** Schema for Contact Note (Markdown) ** //
export const getContactNoteSchema = (maxLength: number) =>
  z.object({
    note: z
      .string()
      .max(maxLength, {
        message: `Note must be at most ${maxLength} characters.`,
      })
      .optional()
      .default(''),
  });
export type ContactNoteInput = z.infer<ReturnType<typeof getContactNoteSchema>>;
