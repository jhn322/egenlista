import { z } from 'zod';
import { ContactType } from '@/generated/prisma'; // Import the enum

// * ==========================================================================
// *                            CONTACT VALIDATION SCHEMAS
// * ==========================================================================

// ** Schema for Creating a Contact ** //
// Includes fields expected from the widget/form submission
export const ContactCreateSchema = z.object({
  firstName: z.string().min(1, { message: 'Förnamn måste anges.' }).max(100),
  lastName: z.string().min(1, { message: 'Efternamn måste anges.' }).max(100),
  email: z.string().email({ message: 'Ogiltig e-postadress.' }),
  phone: z.string().max(50).optional().or(z.literal('')), // Allow empty string or make optional

  // ** Optional Address Fields ** //
  addressStreet: z.string().max(200).optional().or(z.literal('')),
  addressStreet2: z.string().max(200).optional().or(z.literal('')),
  addressPostalCode: z.string().max(20).optional().or(z.literal('')),
  addressCity: z.string().max(100).optional().or(z.literal('')),
  addressCountry: z.string().max(100).optional().or(z.literal('')),
  // addressStateOrProvince: z.string().max(100).optional().or(z.literal('')), // Maybe add later if needed
  // addressType: z.nativeEnum(AddressType).optional(), // Type could be added later

  // Note: 'type' is defaulted in Prisma, not expected from client form
  // Note: 'userId' is determined server-side from widget/auth
});

// Infer the TypeScript type for input data validation
export type ContactCreateInput = z.infer<typeof ContactCreateSchema>;

// ** Schema for Updating a Contact ** //
// Allows partial updates and changing the type
export const ContactUpdateSchema = ContactCreateSchema.partial().extend({
  type: z.nativeEnum(ContactType).optional(), // Allow updating type
});
export type ContactUpdateInput = z.infer<typeof ContactUpdateSchema>; 