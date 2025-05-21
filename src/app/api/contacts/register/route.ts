import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { randomBytes } from 'crypto';
import { sendContactVerificationEmail } from '@/lib/email/sendContactVerificationEmail';
import { ContactCreateSchema } from '@/lib/contacts/validation/schema';

const CONTACT_VERIFICATION_TOKEN_EXPIRES_HOURS = 24;

const getContactVerificationTokenExpires = (): Date => {
  const expires = new Date();
  expires.setHours(
    expires.getHours() + CONTACT_VERIFICATION_TOKEN_EXPIRES_HOURS
  );
  return expires;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body;
    if (!userId) {
      return NextResponse.json({ message: 'Missing userId' }, { status: 400 });
    }
    // Validate input (excluding userId)
    const result = ContactCreateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: result.error.flatten() },
        { status: 400 }
      );
    }
    const { email, firstName, lastName, phone } = result.data;
    // Check for duplicate
    const existing = await prisma.contact.findUnique({
      where: { userId_email: { userId, email } },
    });
    if (existing) {
      return NextResponse.json(
        {
          message: 'A contact with this email already exists for this company.',
        },
        { status: 409 }
      );
    }
    // Generate token
    const token = randomBytes(32).toString('hex');
    const expires = getContactVerificationTokenExpires();
    // Create contact
    await prisma.contact.create({
      data: {
        userId,
        firstName,
        lastName,
        email,
        phone,
        isEmailVerified: false,
        emailVerificationToken: token,
        emailVerificationTokenExpires: expires,
      },
    });
    // Send verification email (only email, token)
    await sendContactVerificationEmail(email, token);
    return NextResponse.json({
      message: 'Check your email to verify your address.',
    });
  } catch (error) {
    console.error('Error in contact registration:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
