// * ==========================================================================
// *                        KONTAKTVY MANAGEMENT PAGE
// * ==========================================================================
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Metadata } from 'next';

import { authOptions } from '@/lib/auth/options';
import { getAllContactsForUser } from '@/lib/contacts/utils/actions';
import { isUserPro } from '@/lib/subscriptions/utils/actions';
import { Contact } from '@/generated/prisma';
import { AUTH_PATHS, PROTECTED_PATHS } from '@/lib/constants/routes';
import { APP_NAME } from '@/lib/constants/site';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ContactStats } from '@/components/contacts/contact-stats';
import { ContactsView } from '@/components/contacts/contacts-view';

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
  let contacts: Contact[] = [];
  let userIsPro = false;

  try {
    [contacts, userIsPro] = await Promise.all([
      getAllContactsForUser(userId),
      isUserPro(userId),
    ]);
  } catch (error) {
    console.error('Failed to load contacts or subscription status:', error);
    // Här kan du visa ett felmeddelande till användaren eller logga mer detaljerat
    // För nu, fortsätt med tom data eller default-värden
  }

  return (
    <main className="container mx-auto py-10">
      <div className="space-y-6">
        {/* Section for Overview and Create New */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1.5">
              <CardTitle>Översikt Kontakter</CardTitle>
              <CardDescription>
                Statistik och möjlighet att skapa nya kontakter.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <ContactStats contacts={contacts} />
          </CardContent>
        </Card>

        <ContactsView
          initialContacts={contacts}
          userIsPro={userIsPro}
          userId={userId}
        />
      </div>
    </main>
  );
}
