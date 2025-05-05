// * ==========================================================================
// *                     API ROUTE: USER REGISTRATION (/api/auth/register)
// * ==========================================================================

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
// import crypto from 'crypto'; // No longer needed here
import prisma from '@/lib/prisma';
import { USER_ROLES, AUTH_MESSAGES } from '@/lib/auth/constants/auth';
import { registerApiSchema } from '@/lib/validations/auth/register';
import { ZodIssue } from 'zod';
import { sendVerificationEmail } from '@/lib/email/sendVerificationEmail';
import { generateAndSaveVerificationToken } from '@/lib/auth/utils/token'; // Import the new token function

// Removed the local getVerificationTokenExpires helper function

// ** POST Handler ** //
/**
 * Handles POST requests to register a new user.
 * - Validates input data.
 * - Checks for existing users (email conflicts).
 * - Hashes the password.
 * - Creates the new user in the database.
 * - Generates and stores an email verification token.
 * - Sends the verification email.
 * - Returns a success or error response.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // * 1. Validate Input Data
    const validationResult = registerApiSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((e: ZodIssue) => e.message);
      console.warn('Registration validation failed:', errors);
      return NextResponse.json(
        { message: errors.join(', ') || AUTH_MESSAGES.ERROR_MISSING_FIELDS },
        { status: 400 }
      );
    }
    const { name, email, password } = validationResult.data;

    // * 2. Check for Existing User (Email Conflict)
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { accounts: true }, // Include accounts to check for OAuth sign-ins
    });

    if (existingUser) {
      if (existingUser.accounts && existingUser.accounts.length > 0) {
        // User exists and has linked OAuth account(s)
        console.warn(`Registration conflict (OAuth): ${email}`);
        return NextResponse.json(
          { message: AUTH_MESSAGES.ERROR_EMAIL_EXISTS_OAUTH },
          { status: 409 } // 409 Conflict
        );
      } else {
        // User exists, likely registered with credentials before
        console.warn(`Registration conflict (Credentials): ${email}`);
        return NextResponse.json(
          { message: AUTH_MESSAGES.ERROR_EMAIL_EXISTS },
          { status: 409 } // 409 Conflict
        );
      }
    }

    // * 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 12);

    // * 4. Create User in Database
    // emailVerified will be null by default based on Prisma schema
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: USER_ROLES.USER, // Default role
      },
    });
    console.log(`User created: ${user.email} (ID: ${user.id})`);

    // * 5. Generate, Save Verification Token (using the utility function)
    const verificationToken = await generateAndSaveVerificationToken(email);
    // The utility function now handles logging for token creation/deletion

    // * 6. Send Verification Email using the Service Function
    try {
      await sendVerificationEmail(email, verificationToken);
      // Service function handles logging success/failure of the API call
    } catch (emailError) {
      // Log the error here as well, but proceed as registration itself was successful
      console.error(
        `Registration succeeded but email dispatch failed for ${email}:`,
        emailError instanceof Error ? emailError.message : emailError
      );
      // Continue to return success to the user, as the account is created.
      // They might need a "resend verification" feature later.
    }

    // * 7. Return Success Response (excluding sensitive data)
    // We don't need to return the user object upon registration.
    return NextResponse.json(
      {
        message: AUTH_MESSAGES.INFO_VERIFICATION_EMAIL_SENT,
      },
      { status: 201 } // HTTP 201 Created
    );

  } catch (error) {
    // * Handle Unexpected Errors
    console.error('Unexpected registration error:', error);
    return NextResponse.json(
      { message: AUTH_MESSAGES.ERROR_REGISTRATION_FAILED },
      { status: 500 } // HTTP 500 Internal Server Error
    );
  }
}
