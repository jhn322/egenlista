'use server'; // Mark this file as Server Actions

import prisma from '@/lib/prisma';
import {
  type ContactCreateInput,
  type ContactUpdateInput, // Add update input type
} from '@/lib/contacts/validation/schema';
import { Prisma } from '@/generated/prisma'; // Import Prisma for error types
import { revalidatePath } from 'next/cache'; // Import for revalidation
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

// ** CREATE a new contact for a specific user ** //
export async function createContact(data: ContactCreateInput, userId: string) {
  if (!userId) {
    throw new Error(SERVER_ACTION_ERRORS.USER_ID_REQUIRED);
  }

  // Data should already be validated by Zod before calling this function

  try {
    const newContact = await prisma.contact.create({
      data: {
        ...data, // Spread validated fields (firstName, lastName, email, phone?)
        userId: userId, // Associate with the user
        // 'type' will use the default defined in schema.prisma (LEAD)
      },
    });

    // Revalidate the contacts page path to show the new contact
    revalidatePath('/admin/contacts');

    return newContact;
  } catch (error) {
    console.error(`Error creating contact for user ${userId}:`, error);

    // Handle specific Prisma errors, e.g., unique constraints
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Example: Unique constraint violation (e.g., email + userId)
      if (error.code === 'P2002') {
        // Check the specific constraint if necessary (using error.meta.target)
        const target = error.meta?.target as string[] | undefined;
        if (target?.includes('email') && target?.includes('userId')) {
          throw new Error(SERVER_ACTION_ERRORS.CONTACT_EXISTS);
        }
        // Throw a more generic duplicate error if target isn't specific
        throw new Error(SERVER_ACTION_ERRORS.CREATE_CONFLICT_INTERNAL);
      }
    }
    // Re-throw a generic error for other issues
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

    // Revalidate the path after successful update
    revalidatePath('/admin/contacts');

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

    if (deleteResult.count > 0) {
      // Revalidate the path only if a contact was actually deleted
      revalidatePath('/admin/contacts');
    }

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