// src/app/api/auth/resend-verification/route.ts
// * ==========================================================================
// *            API ROUTE: RESEND VERIFICATION EMAIL (/api/auth/resend-verification)
// * ==========================================================================

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { AUTH_MESSAGES } from '@/lib/auth/constants/auth';
import { sendVerificationEmail } from '@/lib/email/sendVerificationEmail';
import { generateAndSaveVerificationToken } from '@/lib/auth/utils/token';
import { API_AUTH_PATHS } from '@/lib/constants/routes';

// ** POST Handler ** //
/**
 * Handles POST requests to resend an email verification link.
 * - Expects { email: string } in the request body.
 * - Validates input.
 * - Checks if the user exists and if they are already verified.
 * - Generates a new verification token (invalidating old ones).
 * - Sends a new verification email.
 * - Returns success or error responses.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email: originalEmail } = body; // Rename to avoid conflict

    // * 1. Validate Input
    if (!originalEmail || typeof originalEmail !== 'string') {
      return NextResponse.json(
        { message: 'Email is required.' },
        { status: 400 }
      );
    }

    // Convert to lowercase after validation
    const email = originalEmail.trim().toLowerCase();

    console.log(`POST ${API_AUTH_PATHS.RESEND_VERIFICATION_EMAIL}: Resend verification request received for: ${email} (Original: ${originalEmail})`);

    // * 2. Find User (using lowercase email)
    const user = await prisma.user.findUnique({
      where: { email }, // Use lowercase email
    });

    if (!user) {
      // Don't reveal if the user exists or not for security
      console.warn(
        `POST ${API_AUTH_PATHS.RESEND_VERIFICATION_EMAIL}: Resend verification requested for non-existent user: ${email}`
      );
      return NextResponse.json({
        message: AUTH_MESSAGES.INFO_VERIFICATION_EMAIL_SENT,
      });
    }

    // * 3. Check if Already Verified
    if (user.emailVerified) {
      console.log(`POST ${API_AUTH_PATHS.RESEND_VERIFICATION_EMAIL}: User ${email} is already verified.`);
      return NextResponse.json(
        { message: AUTH_MESSAGES.ERROR_ALREADY_VERIFIED },
        { status: 400 }
      );
    }

    // * 4. Generate New Token and Send Email (using lowercase email)
    console.log(`POST ${API_AUTH_PATHS.RESEND_VERIFICATION_EMAIL}: Generating new token and resending email to ${email}...`);
    // Pass the lowercase email to the token and email functions
    const verificationToken = await generateAndSaveVerificationToken(email);
    await sendVerificationEmail(email, verificationToken);

    // * 5. Return Success Response
    return NextResponse.json({
      message: AUTH_MESSAGES.INFO_VERIFICATION_EMAIL_SENT,
    });

  } catch (error) {
    // * Handle Unexpected Errors
    console.error(`POST ${API_AUTH_PATHS.RESEND_VERIFICATION_EMAIL}: Resend verification email error:`, error);
    // Check if it's an error thrown by our token/email functions or something else
    const errorMessage =
      error instanceof Error ? error.message : AUTH_MESSAGES.ERROR_DEFAULT;

    // Avoid sending detailed internal errors to the client
    if (errorMessage === 'Could not generate or save verification token.') {
      return NextResponse.json(
        { message: AUTH_MESSAGES.ERROR_DEFAULT }, // Generic error
        { status: 500 }
      );
    }
    // Let specific email sending errors pass through if desired, or map to generic
    if (errorMessage.includes('Failed to send email')) {
      return NextResponse.json(
        { message: AUTH_MESSAGES.ERROR_VERIFICATION_EMAIL_FAILED },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: AUTH_MESSAGES.ERROR_DEFAULT },
      { status: 500 }
    );
  }
} 