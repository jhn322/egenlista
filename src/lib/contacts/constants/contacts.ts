// src/lib/contacts/constants/contacts.ts

// * ==========================================================================
// *                        CONTACT FEATURE CONSTANTS
// * ==========================================================================

// **  Toast Messages  ** //
export const TOAST_MESSAGES = {
  CONTACT_CREATED_SUCCESS_TITLE: 'Kontakt Skapad',
  CONTACT_CREATED_SUCCESS_DESC: (contactName: string) =>
    `Kontakten ${contactName} har lagts till i din lista.`,
  CONTACT_UPDATED_SUCCESS_TITLE: 'Kontakt Uppdaterad',
  CONTACT_UPDATED_SUCCESS_DESC: (contactName: string) =>
    `Ändringarna för ${contactName} har sparats.`,
  CONTACT_DELETED_SUCCESS_TITLE: 'Kontakt Borttagen',
  CONTACT_DELETED_SUCCESS_DESC: (contactName: string) =>
    `Kontakten ${contactName} har tagits bort från din lista.`,
  NO_CHANGES_TO_SAVE: 'Inga ändringar att spara.',
  CREATE_ERROR_TITLE: 'Kunde inte skapa kontakt',
  UPDATE_ERROR_TITLE: 'Kunde inte uppdatera kontakt',
  DELETE_ERROR_TITLE: 'Kunde inte ta bort kontakt',
  UNKNOWN_ERROR_DESC: 'Ett okänt fel inträffade. Försök igen senare.',
};

// **  Dialog Texts  ** //
// Primarily for longer descriptions or unique prompts that might change.
// Simple titles like "Skapa kontakt" can remain in components for clarity.
export const DIALOG_TEXTS = {
  CREATE_CONTACT_PRO_DESCRIPTION:
    'Fyll i uppgifterna nedan för att lägga till en ny kontakt i din lista.',
  CREATE_CONTACT_NON_PRO_DESCRIPTION:
    'Den här funktionen är endast tillgänglig för PRO-användare.',
  CREATE_CONTACT_UPGRADE_PROMPT_TITLE:
    'Uppgradera till PRO för att skapa kontakter',
  CREATE_CONTACT_UPGRADE_PROMPT_DESCRIPTION:
    'Med ett PRO-medlemskap kan du manuellt lägga till kontakter direkt här.',
  EDIT_CONTACT_PRO_DESCRIPTION:
    'Ändra kontaktinformationen nedan. Alla fält utom typ är tillgängliga för PRO-användare.',
  EDIT_CONTACT_NON_PRO_DESCRIPTION:
    'Som GRATIS-användare kan du endast ändra kontaktens typ. Uppgradera till PRO för att redigera alla fält.',
  // Delete Contact Dialog
  DELETE_CONTACT_TITLE: 'Bekräfta borttagning',
  DELETE_CONTACT_DESCRIPTION: (contactName: string) =>
    `Är du säker på att du vill ta bort ${contactName}? Denna åtgärd kan inte ångras.`,
  DELETE_CONTACT_CANCEL_BUTTON: 'Avbryt',
  DELETE_CONTACT_CONFIRM_BUTTON: 'Ta bort',
  DELETE_CONTACT_PENDING_BUTTON: 'Tar bort...',
};

// ** Server Action Error Messages (User-facing or for consistent internal handling) ** //
export const SERVER_ACTION_ERRORS = {
  // User-facing messages, can be directly used in toasts or form errors
  CONTACT_EXISTS: 'En kontakt med denna e-post finns redan för detta konto.',
  NOT_FOUND_OR_AUTHORIZED_USER_FACING:
    'Kontakten hittades inte eller så saknar du behörighet att ändra den.',
  GENERIC_CREATE_FAILURE: 'Kunde inte skapa kontakten. Försök igen.',
  GENERIC_UPDATE_FAILURE: 'Kunde inte uppdatera kontakten. Försök igen.',
  GENERIC_DELETE_FAILURE: 'Kunde inte ta bort kontakten. Försök igen.',
  GENERIC_FETCH_FAILURE: 'Kunde inte hämta kontaktdata. Försök igen senare.',

  // More technical/internal errors (could be used for logging or mapping to user-facing ones)
  USER_ID_REQUIRED: 'Användar-ID krävs.',
  CONTACT_ID_REQUIRED: 'Kontakt-ID krävs.',
  CREATE_CONFLICT_INTERNAL: 'Intern konflikt vid skapande av kontakt.',
  UPDATE_CONFLICT_INTERNAL: 'Intern konflikt vid uppdatering av kontakt.',
  UPDATE_NOT_FOUND_INTERNAL: 'Internt fel: Kontakt att uppdatera ej hittad.',
  COULD_NOT_FETCH_CONTACTS_INTERNAL: 'Internt fel vid hämtning av kontakter.',
  COULD_NOT_FETCH_CONTACT_INTERNAL: 'Internt fel vid hämtning av enskild kontakt.',
  UPDATE_WITH_EMPTY_DATA_WARN: 'Varning: Uppdatering anropad med tom data.', // For logging
};

// ** General UI Text ** //
export const CONTACT_LIST_EMPTY_STATE = {
  TITLE: 'Inga kontakter än',
  DESCRIPTION: 'När du börjar samla in kontakter kommer de att visas här.',
}; 