import { NextResponse, type NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  if (!token) {
    // No token provided
    return NextResponse.redirect(
      `${baseUrl}/signup/invalid/tack?error=invalid-token`
    );
  }
  try {
    // Find contact by token
    const contact = await prisma.contact.findFirst({
      where: { emailVerificationToken: token },
    });
    if (!contact || !contact.emailVerificationTokenExpires) {
      return NextResponse.redirect(
        `${baseUrl}/signup/invalid/tack?error=invalid-token`
      );
    }
    // Check expiry
    if (contact.emailVerificationTokenExpires < new Date()) {
      return NextResponse.redirect(
        `${baseUrl}/signup/${contact.userId}/tack?error=expired-token`
      );
    }
    // Mark as verified and clear token fields
    await prisma.contact.update({
      where: { id: contact.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationTokenExpires: null,
      },
    });
    // Redirect to thank you page with verified=true
    return NextResponse.redirect(
      `${baseUrl}/signup/${contact.userId}/tack?verified=true`
    );
  } catch (error) {
    console.error('Error verifying contact email:', error);
    return NextResponse.redirect(
      `${baseUrl}/signup/invalid/tack?error=server-error`
    );
  }
}
