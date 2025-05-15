// This route is intended to be called by a scheduled job (cron job).
// It finds expired verification tokens and deletes the associated unverified user accounts.

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { AUTH_MESSAGES } from '@/lib/auth/constants/auth';
import { API_AUTH_PATHS } from '@/lib/constants/routes';

/**
 * Handles requests to clean up unverified users whose verification tokens have expired.
 * - Finds expired VerificationToken records.
 * - For each, checks if the associated User is still unverified.
 * - If unverified, deletes the User and the VerificationToken.
 */
export async function POST(req: Request) {
  // Protected endpoint
  const authHeader = req.headers.get('Authorization');
  const expectedToken = `Bearer ${process.env.CRON_SECRET}`;

  if (!process.env.CRON_SECRET) {
    console.error(
      `POST ${API_AUTH_PATHS.CLEANUP_UNVERIFIED_USERS}: CRON_SECRET is not set in environment variables. Denying access.`
    );
    return NextResponse.json(
      { message: 'Configuration error: Missing secret.' },
      { status: 500 }
    );
  }

  if (!authHeader || authHeader !== expectedToken) {
    console.warn(
      `POST ${API_AUTH_PATHS.CLEANUP_UNVERIFIED_USERS}: Unauthorized attempt. Invalid or missing Authorization header.`
    );
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  console.log(
    `POST ${API_AUTH_PATHS.CLEANUP_UNVERIFIED_USERS}: Starting cleanup of unverified users.`
  );

  let deletedUsersCount = 0;
  let deletedTokensCount = 0;

  try {
    // * 1. Find all expired verification tokens
    const now = new Date();
    const expiredTokens = await prisma.verificationToken.findMany({
      where: {
        expires: {
          lt: now,
        },
      },
    });

    if (expiredTokens.length === 0) {
      console.log(
        `POST ${API_AUTH_PATHS.CLEANUP_UNVERIFIED_USERS}: No expired verification tokens found.`
      );
      return NextResponse.json(
        { message: 'No expired tokens to process.' },
        { status: 200 }
      );
    }

    console.log(
      `POST ${API_AUTH_PATHS.CLEANUP_UNVERIFIED_USERS}: Found ${expiredTokens.length} expired token(s).`
    );

    // * 2. Process each expired token
    for (const token of expiredTokens) {
      console.log(
        `POST ${API_AUTH_PATHS.CLEANUP_UNVERIFIED_USERS}: Processing token for ${token.identifier} (Token ID: ${token.id})`
      );

      const user = await prisma.user.findUnique({
        where: { email: token.identifier },
        select: { id: true, emailVerified: true, email: true },
      });

      if (!user) {
        // User associated with the token doesn't exist, maybe deleted manually.
        // Just delete the orphaned token.
        console.warn(
          `POST ${API_AUTH_PATHS.CLEANUP_UNVERIFIED_USERS}: User ${token.identifier} not found for expired token ${token.id}. Deleting token.`
        );
        await prisma.verificationToken.delete({
          where: { id: token.id },
        });
        deletedTokensCount++;
        continue;
      }

      // * 3. Check if user is still unverified
      if (user.emailVerified === null) {
        console.log(
          `POST ${API_AUTH_PATHS.CLEANUP_UNVERIFIED_USERS}: User ${user.email} (ID: ${user.id}) is unverified. Deleting user and token.`
        );
        // Use a transaction to ensure both user and token are deleted, or neither.
        try {
          await prisma.$transaction([
            prisma.user.delete({
              where: { id: user.id },
            }),
            prisma.verificationToken.delete({
              where: { id: token.id },
            }),
          ]);
          deletedUsersCount++;
          deletedTokensCount++;
          console.log(
            `POST ${API_AUTH_PATHS.CLEANUP_UNVERIFIED_USERS}: Successfully deleted unverified user ${user.email} and their token.`
          );
        } catch (transactionError) {
          console.error(
            `POST ${API_AUTH_PATHS.CLEANUP_UNVERIFIED_USERS}: Error in transaction deleting user ${user.email} (ID: ${user.id}) and token ${token.id}:`,
            transactionError
          );
          // Continue to the next token, don't let one failure stop the whole batch
        }
      } else {
        // User is verified, but the token is expired. Just delete the token.
        console.log(
          `POST ${API_AUTH_PATHS.CLEANUP_UNVERIFIED_USERS}: User ${user.email} (ID: ${user.id}) is already verified. Deleting expired token ${token.id}.`
        );
        await prisma.verificationToken.delete({
          where: { id: token.id },
        });
        deletedTokensCount++;
      }
    }

    console.log(
      `POST ${API_AUTH_PATHS.CLEANUP_UNVERIFIED_USERS}: Cleanup finished. Deleted ${deletedUsersCount} user(s) and ${deletedTokensCount} token(s).`
    );
    return NextResponse.json(
      {
        message: 'Cleanup process completed.',
        deletedUsers: deletedUsersCount,
        deletedTokens: deletedTokensCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      `POST ${API_AUTH_PATHS.CLEANUP_UNVERIFIED_USERS}: Unexpected error during cleanup:`,
      error
    );
    return NextResponse.json(
      { message: AUTH_MESSAGES.ERROR_DEFAULT },
      { status: 500 }
    );
  }
}
