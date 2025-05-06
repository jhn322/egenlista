// * ==========================================================================
// *                         CONTACTS MANAGEMENT PAGE
// * ==========================================================================
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Metadata } from 'next';

import { authOptions } from '@/lib/auth/options';
import { getAllContactsForUser } from '@/lib/contacts/utils/actions';
import { isUserPro } from '@/lib/subscriptions/utils/actions'; // Importera den nya funktionen
import { Contact } from '@/generated/prisma'; // Assuming Contact type is exported

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ContactStats } from '@/components/contacts/contact-stats'; // Importera ContactStats
import { CreateContactFeature } from '@/components/contacts/create-contact-feature'; // Import CreateContactFeature
import { ContactsView } from '@/components/contacts/contacts-view'; // Import the new wrapper component

// **  Page Metadata  ** //
export const metadata: Metadata = {
  title: 'Hantera Kontakter | Egen Lista',
  description: 'Se och hantera dina insamlade kontakter.',
  robots: {
    index: false, // Dölj från sökmotorer tills vidare
    follow: false,
  },
};

// **  Contacts Page Component  ** //
export default async function ContactsPage() {
  const session = await getServerSession(authOptions);

  // * Redirect to login if not authenticated
  if (!session || !session.user || !session.user.id) {
    redirect('/auth/login?callbackUrl=/admin/contacts');
    return null; // Nödvändigt för att Next.js ska förstå omdirigeringen
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
        {/* Section för Översikt och Skapa Ny */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1.5">
              <CardTitle>Översikt Kontakter</CardTitle>
              <CardDescription>
                Statistik och möjlighet att skapa nya kontakter.
              </CardDescription>
            </div>
            {/* CreateContactFeature Component */}
            <CreateContactFeature userIsPro={userIsPro} userId={userId} />
          </CardHeader>
          <CardContent className="pt-4">
            {/* ContactStats Komponent */}
            <ContactStats contacts={contacts} />
          </CardContent>
        </Card>

        {/* Section för Kontaktlistan */}
        <Card>
          <CardHeader>
            <CardTitle>Kontaktlista</CardTitle>
            <CardDescription>Alla dina kontakter visas nedan.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* ContactsView Component (Client Component Wrapper) */}
            <ContactsView
              initialContacts={contacts} // Pass initial data
              userIsPro={userIsPro} // Pass user status
              userId={userId} // Pass user ID
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
