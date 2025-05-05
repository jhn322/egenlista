import prisma from '@/lib/prisma';
import {
  type ContactCreateInput,
  type ContactUpdateInput, // Add update input type
} from '@/lib/contacts/validation/schema';
import { Prisma } from '@/generated/prisma'; // Import Prisma for error types

// * ==========================================================================
// *                            CONTACT UTILITY ACTIONS
// * ==========================================================================

// ** FETCH ALL contacts for a specific user ** //
export async function getAllContactsForUser(userId: string) {
  if (!userId) {
    // Basic guard clause
    throw new Error('User ID is required to fetch contacts.');
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
    // Re-throw or handle more specifically depending on where it's called
    throw new Error('Could not fetch contacts.');
  }
}

// ** CREATE a new contact for a specific user ** //
export async function createContact(data: ContactCreateInput, userId: string) {
  if (!userId) {
    // Basic guard clause
    throw new Error('User ID is required to create a contact.');
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
          throw new Error('A contact with this email already exists for this account.');
        }
        // Throw a more generic duplicate error if target isn't specific
        throw new Error('Failed to create contact due to a conflict.');
      }
    }
    // Re-throw a generic error for other issues
    throw new Error('Could not create contact.');
  }
}

// ** GET A SINGLE contact by ID, ensuring user ownership ** //
export async function getContactById(contactId: string, userId: string) {
  if (!userId) {
    throw new Error('User ID is required to fetch a contact.');
  }
  if (!contactId) {
    throw new Error('Contact ID is required.');
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
    throw new Error('Could not fetch contact.');
  }
}

// ** UPDATE a contact by ID, ensuring user ownership ** //
export async function updateContact(
  contactId: string,
  userId: string,
  data: ContactUpdateInput
) {
  if (!userId) {
    throw new Error('User ID is required to update a contact.');
  }
  if (!contactId) {
    throw new Error('Contact ID is required.');
  }
  if (Object.keys(data).length === 0) {
    throw new Error('No data provided for update.');
  }

  // Data should already be validated by Zod before calling this function

  try {
    // First, verify the contact exists and belongs to the user
    const existingContact = await prisma.contact.findUnique({
      where: { id: contactId, userId: userId },
      select: { id: true }, // Only need to select id to confirm existence
    });

    if (!existingContact) {
      // Return null or throw an error if not found/authorized
      // Returning null allows the API route to handle the 404 response
      return null; // Explicitly return null
    }

    // Proceed with the update
    const updatedContact = await prisma.contact.update({
      where: {
        id: contactId,
        // No need for userId here again as we confirmed ownership above
      },
      data: data, // Pass the validated update data
    });
    return updatedContact;
  } catch (error) {
    console.error(
      `Error updating contact ${contactId} for user ${userId}:`,
      error
    );

    // Handle specific Prisma errors, e.g., unique constraints
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        const target = error.meta?.target as string[] | undefined;
        if (target?.includes('email')) {
          throw new Error('A contact with this email already exists for this account.');
        }
        throw new Error('Failed to update contact due to a conflict.');
      }
      // P2025: Record to update not found (covered by our initial check, but good practice)
      if (error.code === 'P2025') {
        console.warn(`Update failed: Contact ${contactId} not found.`);
        return null; // Treat as not found
      }
    }
    // Re-throw a generic error for other issues
    throw new Error('Could not update contact.');
  }
}

// ** DELETE a contact by ID, ensuring user ownership ** //
export async function deleteContact(contactId: string, userId: string): Promise<Prisma.BatchPayload> {
  if (!userId) {
    throw new Error('User ID is required to delete a contact.');
  }
  if (!contactId) {
    throw new Error('Contact ID is required.');
  }

  try {
    // Use deleteMany to ensure we only delete if the userId matches
    // This prevents deleting if the ID exists but belongs to another user
    const deleteResult = await prisma.contact.deleteMany({
      where: {
        id: contactId,
        userId: userId,
      }
    });
    // deleteResult contains { count: number } (0 or 1)
    return deleteResult;
  } catch (error) {
    console.error(
      `Error deleting contact ${contactId} for user ${userId}:`,
      error
    );
    throw new Error('Could not delete contact.');
  }
} 