// * ==========================================================================
// *                        KONTAKTVY MANAGEMENT PAGE
// * ==========================================================================
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Metadata } from 'next';

import { authOptions } from '@/lib/auth/options';
import { getAllContactsForUser } from '@/lib/contacts/utils/actions';
import { isUserPro } from '@/lib/subscriptions/utils/actions';
import { AUTH_PATHS, PROTECTED_PATHS } from '@/lib/constants/routes';
import { APP_NAME } from '@/lib/constants/site';

import { ContactsPageClientContent } from '@/components/contacts/contacts-page-client-content';
import { type ContactWithInteractions } from '@/components/contacts/contact-list';

// **  Page Metadata  ** //
export const metadata: Metadata = {
  title: `Kontaktvy | ${APP_NAME}`,
  description: 'Se och hantera dina insamlade kontakter.',
  robots: {
    index: false,
    follow: false,
  },
};

// **  Kontakter Page Component  ** //
export default async function KontakterPage() {
  const session = await getServerSession(authOptions);

  // * Redirect to login if not authenticated
  if (!session || !session.user || !session.user.id) {
    redirect(
      `${AUTH_PATHS.LOGIN}?callbackUrl=${PROTECTED_PATHS.MINA_SIDOR_KONTAKTVY}`
    );
    return null;
  }

  const userId = session.user.id;

  // * Fetch contacts and PRO status in parallel
  let contacts: ContactWithInteractions[] = [];
  let userIsPro = false;

  try {
    [contacts, userIsPro] = await Promise.all([
      getAllContactsForUser(userId),
      isUserPro(userId),
    ]);
  } catch (error) {
    console.error('Failed to load contacts or subscription status:', error);
    // Här kan du visa ett felmeddelande till användaren eller logga mer detaljerat
    // För nu, fortsätt med tom data eller default-värden, vilket ContactsPageClientContent kan hantera.
  }

  return (
    <main className="container mx-auto py-10">
      {/* **MODIFIED**: Render the client content wrapper */}
      <ContactsPageClientContent
        initialContacts={contacts}
        userIsPro={userIsPro}
        userId={userId}
      />
    </main>
  );
}
