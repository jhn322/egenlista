import { NextResponse } from 'next/server';
import db from '@/lib/prisma';
import { forgotPasswordSchema } from '@/lib/auth/validation/forgot-password';
import { sendPasswordResetEmail } from '@/lib/email/sendResetEmail';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const HASH_ROUNDS = 10;
const TOKEN_EXPIRATION_DURATION = 3600000; // 1 hour

const generateTokenAndHash = async () => {
  const token = crypto.randomBytes(32).toString('hex');
  const hash = await bcrypt.hash(token, HASH_ROUNDS);
  return { token, hash };
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = forgotPasswordSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid email format.' },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        {
          message:
            'If an account with this email exists and uses password login, a reset link has been sent.',
        },
        { status: 200 }
      );
    }

    const { token, hash } = await generateTokenAndHash();
    const expires = new Date(Date.now() + TOKEN_EXPIRATION_DURATION);

    await db.passwordResetToken.create({
      data: {
        userId: user.id,
        token: hash,
        expires: expires,
      },
    });

    await sendPasswordResetEmail(email, token);

    return NextResponse.json(
      {
        message:
          'If an account with this email exists and uses password login, a reset link has been sent.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[FORGOT_PASSWORD_POST]', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
