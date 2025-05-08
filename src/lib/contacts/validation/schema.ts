import { z } from 'zod';
import { ContactType } from '@/generated/prisma'; // Import the enum
import { AVAILABLE_CONSENT_TYPE_IDS } from '@/lib/contacts/constants/contacts'; // Import consent types

// * ==========================================================================
// *                            CONTACT VALIDATION SCHEMAS
// * ==========================================================================

// ** Individual Consent Schema ** //
const ConsentItemSchema = z.object({
  consentType: z.enum(AVAILABLE_CONSENT_TYPE_IDS, {
    errorMap: () => ({ message: 'Ogiltig samtyckestyp.' })
  }),
  granted: z.boolean(),
  // proof and legalNotice will be added server-side or based on form context
});
export type ConsentItemInput = z.infer<typeof ConsentItemSchema>;

// ** Base Contact Object Schema (without create-specific refinements) ** //
const ContactObjectSchema = z.object({
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

  // ** Consents ** //
  consents: z.array(ConsentItemSchema).min(AVAILABLE_CONSENT_TYPE_IDS.length, {
    message: 'Alla nödvändiga samtycken måste hanteras.', // Ensures all defined types are present
  }),

  // Note: 'type' is defaulted in Prisma, not expected from client form
  // Note: 'userId' is determined server-side from widget/auth
});

// ** Schema for Creating a Contact ** //
export const ContactCreateSchema = ContactObjectSchema.refine(data => {
  // If STORAGE consent is present, it must be granted.
  const storageConsent = data.consents.find(c => c.consentType === 'STORAGE');
  if (storageConsent && !storageConsent.granted) {
    return false;
  }
  return true;
}, {
  message: 'Godkännande för lagring av personuppgifter är obligatoriskt för att skapa en kontakt.',
  path: ['consents'], // General error on the consents array, or be more specific e.g., consents[STORAGE_INDEX].granted
});

// Infer the TypeScript type for input data validation
export type ContactCreateInput = z.infer<typeof ContactCreateSchema>;

// ** Schema for Updating a Contact ** //
// Omitting consents as they are event-based and not directly updatable on the contact record itself.
// Type is made optional here for partial updates.
export const ContactUpdateSchema = ContactObjectSchema.pick({
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  addressStreet: true,
  addressStreet2: true,
  addressPostalCode: true,
  addressCity: true,
  addressCountry: true,
}).partial().extend({
  type: z.nativeEnum(ContactType).optional(), // Allow updating type
});
export type ContactUpdateInput = z.infer<typeof ContactUpdateSchema>; 