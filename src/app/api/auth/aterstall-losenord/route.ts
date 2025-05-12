import { NextResponse } from 'next/server';
import db from '@/lib/prisma';
import { resetPasswordSchema } from '@/lib/auth/validation/reset-password';
import bcrypt from 'bcryptjs';

const HASH_ROUNDS = 10;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, password } = body;

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { message: 'Invalid or missing token.' },
        { status: 400 }
      );
    }

    const passwordValidation = resetPasswordSchema.safeParse(body);
    if (!passwordValidation.success) {
      return NextResponse.json(
        {
          message:
            passwordValidation.error.errors[0]?.message || 'Invalid input.',
        },
        { status: 400 }
      );
    }

    const potentialTokens = await db.passwordResetToken.findMany({
      where: {
        expires: { gt: new Date() },
      },
    });

    let validTokenRecord = null;
    for (const record of potentialTokens) {
      const isTokenMatch = await bcrypt.compare(token, record.token);
      if (isTokenMatch) {
        validTokenRecord = record;
        break;
      }
    }

    if (!validTokenRecord) {
      return NextResponse.json(
        { message: 'Invalid or expired token.' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, HASH_ROUNDS);

    await db.$transaction([
      db.user.update({
        where: { id: validTokenRecord.userId },
        data: { password: hashedPassword },
      }),
      db.passwordResetToken.delete({
        where: { id: validTokenRecord.id },
      }),
    ]);

    return NextResponse.json(
      { message: 'Password reset successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[RESET_PASSWORD_POST]', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
