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

// Define PageProps with params as a Promise
interface PageProps {
  params: Promise<{ userId: string }>; // params itself is the Promise
  // If searchParams were used, they might also need Promise type:
  // searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Function to fetch user information (kept simple for this example)
async function getUserInfo(userId: string) {
  if (!userId) {
    // Although Next.js routing should prevent this with dynamic segments,
    // adding a check doesn't hurt.
    console.warn('getUserInfo called without a userId in signup page.');
    return null;
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
      },
    });
    return user;
  } catch (error) {
    console.error(`Error fetching user (${userId}) for signup page:`, error);
    return null;
  }
}

// Type props directly, params inside is the promise
export default async function ContactSignupPage(props: PageProps) {
  // Await the params promise before accessing userId
  const params = await props.params;
  const { userId } = params;

  // Fetch user information based on userId from params
  const user = await getUserInfo(userId);

  // Handle case where user is not found
  if (!user) {
    notFound(); // Trigger 404 page
  }

  return (
    <main id="main-content" className="flex min-h-screen flex-col">
      <header className="bg-primary text-primary-foreground px-4 py-8 text-center sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Registrera dig som kontakt
          </h1>
          {/* Display user name fetched from DB */}
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
            {/* Pass the userId to the form component */}
            <ContactPublicSignupForm userId={userId} />
          </div>
        </div>
      </section>
    </main>
  );
}
