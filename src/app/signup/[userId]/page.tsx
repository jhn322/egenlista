// * ============================================================================
// *                           CONTACT SIGNUP PAGE
// * ============================================================================

// Removed static metadata, generateMetadata will handle it
// import type { Metadata } from 'next';
import React from 'react';
import { ContactPublicSignupForm } from '@/components/contacts/contact-public-signup-form';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
// import type { Metadata } from 'next'; // Removed Metadata type import

// Static metadata removed as generateMetadata is used
// export const metadata: Metadata = {
//   title: 'Registrera dig som kontakt', // Typo was likely here or this was old
//   description:
//     'Fyll i formuläret för att registrera dig som kontakt till företaget.',
// };

// interface ContactSignupPageProps { // Removed interface as it was only used by generateMetadata
//   params: {
//     userId: string;
//   };
// }

async function getUserInfo(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
      },
    });
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

// Removed generateMetadata function
// export async function generateMetadata({ params }: ContactSignupPageProps): Promise<Metadata> {
//   const user = await getUserInfo(params.userId);
//   return {
//     title: `Registrera dig hos ${user?.name || 'företaget'}`,
//     description:
//       'Fyll i formuläret för att registrera dig som kontakt till företaget.',
//   };
// }

export default async function ContactSignupPage({
  params,
}: {
  params: { userId: string };
}) {
  const { userId } = params;
  const user = await getUserInfo(userId);

  if (!user) {
    notFound();
  }

  return (
    <main id="main-content" className="flex min-h-screen flex-col">
      <header className="bg-primary text-primary-foreground px-4 py-8 text-center sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Registrera dig som kontakt
          </h1>
          <p className="text-primary-foreground/90 mx-auto max-w-2xl text-sm">
            hos {user.name || 'företaget'} via detta formulär
          </p>
        </div>
      </header>

      <section className="bg-background flex flex-1 flex-col items-center justify-start py-8">
        <div className="w-full max-w-4xl px-4 sm:px-6">
          <div className="border-border bg-card overflow-hidden rounded-lg border p-6 shadow-sm">
            <h2 className="text-card-foreground mb-6 text-center text-xl font-semibold">
              Fyll i dina uppgifter
            </h2>
            <ContactPublicSignupForm userId={userId} />
          </div>
        </div>
      </section>
    </main>
  );
}
