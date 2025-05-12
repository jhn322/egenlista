import { z } from 'zod';
import { ContactType, ConsentType } from '@/generated/prisma'; // Import the enum and ConsentType
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
  consents: z
    .array(ConsentItemSchema)
    .min(AVAILABLE_CONSENT_TYPE_IDS.length, {
      message: 'Alla nödvändiga samtycken måste hanteras.',
    })
    // Use superRefine for more control over adding issues
    .superRefine((consents, ctx) => {
      const storageConsentIndex = consents.findIndex(
        (c) => c.consentType === ConsentType.STORAGE
      );

      if (storageConsentIndex === -1) {
        // This case should ideally be caught by .min() or initial setup,
        // but adding a check just in case.
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Nödvändigt samtycke för lagring saknas helt.', // More specific error
          path: [], // Add to the array level if STORAGE type isn't even present
        });
      } else if (!consents[storageConsentIndex].granted) {
        // If STORAGE exists but is not granted, add issue to its 'granted' field
        ctx.addIssue({
          code: z.ZodIssueCode.custom, // Use custom code for refine-like errors
          message: 'Godkännande för lagring av personuppgifter är obligatoriskt.',
          path: [storageConsentIndex, 'granted'], // Path relative to the array
        });
      }
    }),

  // Note: 'type' is defaulted in Prisma, not expected from client form
  // Note: 'userId' is determined server-side from widget/auth
});

// ** Schema for Creating a Contact (No longer needs the top-level refine) ** //
export const ContactCreateSchema = ContactObjectSchema;

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
