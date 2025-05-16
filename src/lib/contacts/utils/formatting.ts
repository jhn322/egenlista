import { ContactType } from '@/generated/prisma';

// * ==========================================================================
// *                           FORMATTING UTILITIES
// * ==========================================================================

// **  Helper function to format ContactType  ** //
export function formatContactType(type: ContactType): string {
  switch (type) {
    case ContactType.CONTACT:
      return 'Kontakt';
    case ContactType.LEAD:
      return 'Lead';
    case ContactType.CUSTOMER:
      return 'Kund';
    case ContactType.AMBASSADOR:
      return 'Ambassadör';
    default:
      // Potentially log an issue if an unknown type is encountered
      // console.warn(`Unknown contact type: ${type}`);
      return type; // Return the original type string as a fallback
  }
} 