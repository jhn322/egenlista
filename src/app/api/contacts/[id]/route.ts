import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options"; // Corrected path
import {
  ContactUpdateSchema, // Use Contact schema
} from "@/lib/contacts/validation/schema"; // Corrected path
// Import Contact utility functions
import {
  getContactById,
  updateContact,
  deleteContact,
} from "@/lib/contacts/utils/actions"; // Corrected path

// Removed Params interface as it will be defined inline
// interface Params {
//   id: string;
// }

//* GET requests for fetching a single contact
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } } // Use inline type
) {
  const contactId = params.id;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      console.error(`GET /api/contacts/${contactId}: Unauthorized access attempt.`);
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Use the utility function to fetch the contact
    const contact = await getContactById(contactId, userId);

    // getContactById returns null if not found or not owned by user
    if (!contact) {
      console.warn(
        `GET /api/contacts/${contactId}: Contact not found or access denied for user ${userId}.`
      );
      return NextResponse.json({ message: 'Contact not found' }, { status: 404 });
    }

    console.log(
      `GET /api/contacts/${contactId}: Successfully fetched contact for user ${userId}.`
    );
    return NextResponse.json({ contact }); // Return the fetched contact
  } catch (error) {
    console.error(`GET /api/contacts/${contactId}: Error fetching contact:`, error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch contact';
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}

//* PUT requests for updating a contact
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } } // Use inline type
) {
  const contactId = params.id;
  let requestBody: unknown;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      console.error(`PUT /api/contacts/${contactId}: Unauthorized access attempt.`);
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // --- Validation --- 
    requestBody = await request.json();
    const validationResult = ContactUpdateSchema.safeParse(requestBody);

    if (!validationResult.success) {
      console.warn(
        `PUT /api/contacts/${contactId}: Validation failed for user ${userId}:`,
        validationResult.error.flatten()
      );
      return NextResponse.json(
        {
          message: 'Invalid input data',
          errors: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    // Ensure there's actually data to update after parsing
    const validatedData = validationResult.data;
    if (Object.keys(validatedData).length === 0) {
      console.warn(
        `PUT /api/contacts/${contactId}: No valid update data provided for user ${userId}.`
      );
      return NextResponse.json(
        { message: 'No fields provided for update' },
        { status: 400 }
      );
    }

    // --- Update Contact using the utility function --- 
    console.log(
      `PUT /api/contacts/${contactId}: Attempting update for user ${userId}.`
    );
    const updatedContact = await updateContact(contactId, userId, validatedData);

    // updateContact returns null if not found/owned
    if (!updatedContact) {
      console.warn(
        `PUT /api/contacts/${contactId}: Contact not found or access denied for user ${userId} during update attempt.`
      );
      return NextResponse.json(
        { message: 'Contact not found or update failed' },
        { status: 404 }
      );
    }

    console.log(
      `PUT /api/contacts/${contactId}: Successfully updated contact for user ${userId}.`
    );
    return NextResponse.json({ contact: updatedContact });
  } catch (error) {
    console.error(`PUT /api/contacts/${contactId}: Error updating contact:`, error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to update contact';
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}

//* DELETE requests for deleting a contact
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } } // Use inline type
) {
  const contactId = params.id;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      console.error(`DELETE /api/contacts/${contactId}: Unauthorized access attempt.`);
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // --- Fetch the contact first to verify existence and ownership --- 
    const contactToDelete = await getContactById(contactId, userId);

    if (!contactToDelete) {
      console.warn(
        `DELETE /api/contacts/${contactId}: Contact not found or access denied for user ${userId}.`
      );
      return NextResponse.json(
        { message: 'Contact not found or access denied' },
        { status: 404 }
      );
    }

    // --- Delete Contact using the utility function --- 
    console.log(
      `DELETE /api/contacts/${contactId}: Attempting deletion for user ${userId}.`
    );
    const deleteResult = await deleteContact(contactId, userId);

    // Assert the type to ensure TypeScript knows about .count
    const resultPayload = deleteResult as { count: number };

    // Check the count property of the result
    if (resultPayload.count === 0) {
      // This case should ideally not be reached if getContactById succeeded,
      // but acts as a safeguard.
      console.error(
        `DELETE /api/contacts/${contactId}: Deletion failed unexpectedly after contact was found for user ${userId}.`
      );
      return NextResponse.json(
        { message: 'Deletion failed unexpectedly' },
        { status: 500 } // Internal Server Error might be more appropriate
      );
    }

    console.log(
      `DELETE /api/contacts/${contactId}: Successfully deleted contact for user ${userId}.`
    );
    // Return 200 OK with the data of the deleted contact
    return NextResponse.json({
      message: 'Contact deleted successfully',
      deletedContact: contactToDelete // Return the fetched data
    }, { status: 200 });
  } catch (error) {
    console.error(`DELETE /api/contacts/${contactId}: Error deleting contact:`, error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to delete contact';
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}
