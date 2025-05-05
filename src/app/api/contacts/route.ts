import { NextResponse, type NextRequest } from "next/server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import {
  ContactCreateSchema,
} from '@/lib/contacts/validation/schema';
import {
  getAllContactsForUser,
  createContact,
} from '@/lib/contacts/utils/actions';

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Allow all origins 
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

/**
 * Handle OPTIONS requests for CORS preflight
 */
export async function OPTIONS() {
  console.log('OPTIONS /api/contacts: Handling CORS preflight request.');
  return new NextResponse(null, {
    status: 204, // No Content
    headers: corsHeaders,
  });
}

//* GET requests for fetching contacts owned by the authenticated user
export async function GET() {
  // Get the server session to identify the user
  const session = await getServerSession(authOptions);

  // If no session found or user ID is missing, return Unauthorized
  if (!session?.user?.id) {
    console.error("GET /api/contacts: Unauthorized access attempt.");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // Use the utility function to fetch contacts
    const contacts = await getAllContactsForUser(userId);

    console.log(`GET /api/contacts: Successfully fetched ${contacts.length} contacts for user ${userId}.`);
    // Return the fetched contacts wrapped in an object
    return NextResponse.json({ contacts }, { headers: corsHeaders });
  } catch (error) {
    console.error(`GET /api/contacts: Error fetching contacts for user ${userId}:`, error);
    // Return an error response if something goes wrong
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch contacts';
    return NextResponse.json(
      { message: errorMessage },
      { status: 500, headers: corsHeaders }
    );
  }
}

//* POST requests for creating a new contact (typically from a widget)
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    console.error('POST /api/contacts: Unauthorized attempt to create contact.');
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  let requestBody: unknown;

  try {
    requestBody = await request.json();

    // Validate the request body using the Zod schema
    const validationResult = ContactCreateSchema.safeParse(requestBody);

    if (!validationResult.success) {
      console.warn(
        `POST /api/contacts: Validation failed for user ${userId}:`,
        validationResult.error.flatten()
      );
      return NextResponse.json(
        {
          message: 'Invalid input data',
          errors: validationResult.error.flatten(), // Provide detailed errors
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // Data is valid, proceed to create the contact using the utility function
    const validatedData = validationResult.data;
    console.log(
      `POST /api/contacts: Attempting contact creation for user ${userId}.`
    );

    const newContact = await createContact(validatedData, userId);

    console.log(
      `POST /api/contacts: Successfully created contact ${newContact.id} for user ${userId}.`
    );
    // Return the newly created contact
    return NextResponse.json(
      { contact: newContact },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    // Log context includes the user ID
    const logContext = `(userId: ${userId})`;
    const emailFromReq = (typeof requestBody === 'object' &&
      requestBody !== null &&
      'email' in requestBody) ? String(requestBody.email) : '[email not available]';

    console.error(`POST /api/contacts: Error creating contact ${logContext}:`, error);

    // Handle errors thrown from createContact utility or other unexpected errors
    if (error instanceof Error) {
      // Check for specific known error messages from createContact
      if (error.message.includes('already exists')) {
        console.warn(`POST /api/contacts: Duplicate contact detected for user ${userId}, email: ${emailFromReq}.`);
        return NextResponse.json(
          { message: error.message }, // Use the specific error message
          { status: 409, headers: corsHeaders } // 409 Conflict
        );
      }
      if (error.message.includes('conflict')) {
        console.warn(`POST /api/contacts: Conflict error for user ${userId}, email: ${emailFromReq}.`);
        return NextResponse.json(
          { message: error.message },
          { status: 409, headers: corsHeaders } // 409 Conflict
        );
      }
    }

    // Generic fallback error
    return NextResponse.json(
      { message: 'Failed to create contact' },
      { status: 500, headers: corsHeaders }
    );
  }
}
