'use server'; // Mark this file as Server Actions

import prisma from '@/lib/prisma';
import {
  type ContactCreateInput,
  type ContactUpdateInput, // Add update input type
} from '@/lib/contacts/validation/schema';
import { Prisma } from '@/generated/prisma'; // Import Prisma for error types
// import { revalidatePath } from 'next/cache'; // Import for revalidation -> No longer needed
import { SERVER_ACTION_ERRORS } from '../constants/contacts'; // Import constants

// * ==========================================================================
// *                            CONTACT UTILITY ACTIONS
// * ==========================================================================

// ** FETCH ALL contacts for a specific user ** //
export async function getAllContactsForUser(userId: string) {
  if (!userId) {
    throw new Error(SERVER_ACTION_ERRORS.USER_ID_REQUIRED);
  }
  try {
    const contacts = await prisma.contact.findMany({
      where: { userId: userId },
      orderBy: {
        createdAt: 'desc', // Or perhaps lastName, firstName
      },
    });
    return contacts;
  } catch (error) {
    console.error(`Error fetching contacts for user ${userId}:`, error);
    throw new Error(SERVER_ACTION_ERRORS.COULD_NOT_FETCH_CONTACTS_INTERNAL);
  }
}

// ** CREATE a new contact for a specific user (with optional address) ** //
export async function createContact(data: ContactCreateInput, userId: string) {
  if (!userId) {
    throw new Error(SERVER_ACTION_ERRORS.USER_ID_REQUIRED);
  }

  // Extract address fields and main contact data
  const {
    addressStreet,
    addressStreet2,
    addressPostalCode,
    addressCity,
    addressCountry,
    consents, // Destructure consents from data
    ...contactData // Rest are firstName, lastName, email, phone
  } = data;

  // Check if essential address data is provided
  const hasAddressData = !!(
    addressStreet &&
    addressPostalCode &&
    addressCity &&
    addressCountry
  );

  try {
    // Use a transaction to create Contact and potentially Address together
    const newContact = await prisma.$transaction(async (tx) => {
      // 1. Create the Contact
      const createdContact = await tx.contact.create({
        data: {
          ...contactData,
          userId: userId,
        },
      });

      // 2. If address data exists, create the related Address
      if (hasAddressData) {
        await tx.address.create({
          data: {
            contactId: createdContact.id, // Link to the new contact
            street: addressStreet!, // Use non-null assertion as we checked hasAddressData
            street2: addressStreet2 || null, // Use provided value or null
            postalCode: addressPostalCode!,
            city: addressCity!,
            country: addressCountry!,
            // addressStateOrProvince: data.addressStateOrProvince || null, // If added later
            // type: data.addressType || null, // Default address type if needed
            isPrimary: true, // Mark this first address as primary
          },
        });
      }

      // 3. Create ContactConsentEvent records for each consent
      if (consents && consents.length > 0) {
        const consentEventsToCreate = consents.map((consentItem) => ({
          contactId: createdContact.id,
          consentType: consentItem.consentType,
          granted: consentItem.granted,
          // proof and legalNotice could be set here if needed
          // For now, proof might be e.g. "Form: CreateContactForm v1.0"
          // legalNotice could be a link to a privacy policy version
          // timestamp is defaulted by Prisma schema
        }));
        await tx.contactConsentEvent.createMany({
          data: consentEventsToCreate,
        });
      }

      return createdContact; // Return the created contact from the transaction
    });

    return newContact;
  } catch (error) {
    console.error(`Error creating contact for user ${userId}:`, error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Prisma Known Request Error in createContact:', { code: error.code, meta: error.meta });
      if (error.code === 'P2002') { // Unique constraint violation
        const target = error.meta?.target as string[] | undefined;
        if (target?.includes('email') && target?.includes('userId')) {
          throw new Error(SERVER_ACTION_ERRORS.CONTACT_EXISTS);
        }
        throw new Error(
          `${SERVER_ACTION_ERRORS.CREATE_CONFLICT_INTERNAL} (Constraint: ${target?.join(', ') || 'unknown'})`
        );
      } else if (error.code === 'P2003') { // Foreign key constraint failed
        const fieldName = error.meta?.field_name as string | undefined;
        // User-facing, but with a hint of what might be wrong if it's, for example, a user not existing
        throw new Error(
          `${SERVER_ACTION_ERRORS.INVALID_RELATION_DATA} (Fält: ${fieldName || 'okänt'})`
        );
      }
      // For other known Prisma errors, use the more generic user-facing DB operation failed
      throw new Error(
        `${SERVER_ACTION_ERRORS.DB_OPERATION_FAILED} (Kod: ${error.code})`
      );
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      console.error('Prisma Validation Error in createContact:', error.message);
      // This is more of an internal server/data setup error before hitting DB rules
      throw new Error(SERVER_ACTION_ERRORS.VALIDATION_ERROR_INTERNAL_USER_FACING);
    }

    // Fallback for other types of errors
    throw new Error(SERVER_ACTION_ERRORS.GENERIC_CREATE_FAILURE);
  }
}

// ** GET A SINGLE contact by ID, ensuring user ownership ** //
export async function getContactById(contactId: string, userId: string) {
  if (!userId) {
    throw new Error(SERVER_ACTION_ERRORS.USER_ID_REQUIRED);
  }
  if (!contactId) {
    throw new Error(SERVER_ACTION_ERRORS.CONTACT_ID_REQUIRED);
  }

  try {
    const contact = await prisma.contact.findUnique({
      where: {
        id: contactId,
        userId: userId, // Ensure the contact belongs to the user
      },
    });
    // Returns the contact or null if not found or doesn't belong to the user
    return contact;
  } catch (error) {
    console.error(
      `Error fetching contact ${contactId} for user ${userId}:`,
      error
    );
    throw new Error(SERVER_ACTION_ERRORS.COULD_NOT_FETCH_CONTACT_INTERNAL);
  }
}

// ** UPDATE a contact by ID, ensuring user ownership ** //
export async function updateContact(
  contactId: string,
  userId: string,
  data: ContactUpdateInput
) {
  if (!userId) {
    throw new Error(SERVER_ACTION_ERRORS.USER_ID_REQUIRED);
  }
  if (!contactId) {
    throw new Error(SERVER_ACTION_ERRORS.CONTACT_ID_REQUIRED);
  }
  if (Object.keys(data).length === 0) {
    // Prevent unnecessary updates if no data is actually sent
    // Although Zod partial might allow empty objects, it's good practice.
    // Alternatively, return the existing contact without hitting the DB.
    console.warn(SERVER_ACTION_ERRORS.UPDATE_WITH_EMPTY_DATA_WARN);
    // Let's fetch and return the current contact to avoid errors downstream
    const currentContact = await getContactById(contactId, userId);
    if (!currentContact) {
      throw new Error(SERVER_ACTION_ERRORS.NOT_FOUND_OR_AUTHORIZED_USER_FACING);
    }
    return currentContact; // Return current state if no changes provided
    // Or simply: throw new Error('No data provided for update.');
  }

  // Data should already be validated by Zod before calling this function

  try {
    // First, verify the contact exists and belongs to the user (redundant check if getContactById is reliable, but safe)
    const existingContact = await prisma.contact.findUnique({
      where: { id: contactId, userId: userId },
      select: { id: true }, // Only need to select id to confirm existence
    });

    if (!existingContact) {
      // Throw a specific error if not found/authorized during the update attempt
      throw new Error(SERVER_ACTION_ERRORS.NOT_FOUND_OR_AUTHORIZED_USER_FACING);
    }

    // Proceed with the update
    const updatedContact = await prisma.contact.update({
      where: {
        id: contactId,
        // userId: userId // Can add for extra safety, but verified above
      },
      data: data, // Pass the validated update data
    });

    return updatedContact;
  } catch (error) {
    console.error(
      `Error updating contact ${contactId} for user ${userId}:`,
      error
    );

    // Handle specific Prisma errors, e.g., unique constraints on email update
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        const target = error.meta?.target as string[] | undefined;
        if (target?.includes('email')) {
          throw new Error(SERVER_ACTION_ERRORS.CONTACT_EXISTS);
        }
        throw new Error(SERVER_ACTION_ERRORS.UPDATE_CONFLICT_INTERNAL);
      }
      // P2025: Record to update not found (covered by our initial check)
      if (error.code === 'P2025') {
        throw new Error(SERVER_ACTION_ERRORS.UPDATE_NOT_FOUND_INTERNAL);
      }
    }
    // Re-throw a generic error for other issues
    throw new Error(SERVER_ACTION_ERRORS.GENERIC_UPDATE_FAILURE);
  }
}

// ** DELETE a contact by ID, ensuring user ownership ** //
export async function deleteContact(contactId: string, userId: string): Promise<{ count: number }> {
  if (!userId) {
    throw new Error(SERVER_ACTION_ERRORS.USER_ID_REQUIRED);
  }
  if (!contactId) {
    throw new Error(SERVER_ACTION_ERRORS.CONTACT_ID_REQUIRED);
  }

  try {
    // Use deleteMany to ensure we only delete if the userId matches
    const deleteResult = await prisma.contact.deleteMany({
      where: {
        id: contactId,
        userId: userId,
      }
    });

    // if (deleteResult.count > 0) {
    // Updated path
    // revalidatePath('/mina-sidor/kontaktvy'); Removed
    // }

    // deleteResult contains { count: number } (0 or 1)
    return deleteResult;
  } catch (error) {
    console.error(
      `Error deleting contact ${contactId} for user ${userId}:`,
      error
    );
    throw new Error(SERVER_ACTION_ERRORS.GENERIC_DELETE_FAILURE);
  }
} 