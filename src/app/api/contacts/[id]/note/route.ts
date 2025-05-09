import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/options';
import { getContactById, updateContact } from '@/lib/contacts/utils/actions';
import { getContactNoteSchema } from '@/lib/contacts/validation/schema';
import { isUserPro } from '@/lib/subscriptions/utils/actions';

interface Params {
  id: string;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const contactId = (await params).id;
  let requestBody: unknown;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Ej autentiserad' }, { status: 401 });
    }
    const userId = session.user.id;

    // Check ownership
    const contact = await getContactById(contactId, userId);
    if (!contact) {
      return NextResponse.json(
        { message: 'Kontakt hittades inte' },
        { status: 404 }
      );
    }

    // Check Pro status
    const userIsPro = await isUserPro(userId);
    const maxLength = userIsPro ? 10000 : 1000;

    // Validate input
    requestBody = await request.json();
    const schema = getContactNoteSchema(maxLength);
    const validationResult = schema.safeParse(requestBody);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: 'Ogiltig anteckning',
          errors: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }
    const { note } = validationResult.data;

    // Update note and noteUpdatedAt
    const updatedContact = await updateContact(contactId, userId, {
      note,
      noteUpdatedAt: new Date(),
    });
    if (!updatedContact) {
      return NextResponse.json(
        { message: 'Kontakt hittades inte eller uppdateringen misslyckades' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      note: updatedContact.note,
      noteUpdatedAt: updatedContact.noteUpdatedAt,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Uppdateringen av anteckningen misslyckades';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
