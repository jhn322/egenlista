// * ============================================================================
// *                     CONTACT SIGNUP THANK YOU PAGE
// * ============================================================================
import type { Metadata } from 'next';
import React from 'react';
// import Link from 'next/link'; // Removed unused import
import { CheckCircle } from 'lucide-react';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
// import { Button } from '@/components/ui/button'; // Removed unused import

// Since this page shares the user fetching logic, we might refactor getUserInfo later
async function getUserInfo(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
      },
    });
    return user;
  } catch (error) {
    console.error('Error fetching user for thank you page:', error);
    return null;
  }
}

// Update interface: params is a Promise
interface ContactSignupThankYouPageProps {
  params: Promise<{ userId: string }>;
  // searchParams: Promise<{ [key: string]: string | string[] | undefined }>; // Add if needed later
}

// Dynamic metadata based on user - needs to await params
export async function generateMetadata({
  params: paramsPromise, // Rename to avoid conflict
}: ContactSignupThankYouPageProps): Promise<Metadata> {
  const params = await paramsPromise; // Await the params promise
  const user = await getUserInfo(params.userId);
  return {
    title: `Tack för din registrering hos ${user?.name || 'företaget'}`,
    description: 'Din registrering har mottagits.',
  };
}

// Update component signature and add await
export default async function ContactSignupThankYouPage(
  props: ContactSignupThankYouPageProps
) {
  // Await the params promise
  const params = await props.params;
  const { userId } = params;
  const user = await getUserInfo(userId);

  // User not found (should ideally not happen if redirected from successful signup)
  if (!user) {
    notFound();
  }

  return (
    <main
      id="main-content"
      className="bg-background flex min-h-screen flex-col items-center justify-center p-4 sm:p-6"
    >
      <div className="border-border bg-card w-full max-w-md rounded-lg border p-8 text-center shadow-sm">
        <CheckCircle className="mx-auto mb-4 size-12 text-green-500" />
        <h1 className="text-card-foreground mb-2 text-2xl font-semibold">
          Tack för din registrering!
        </h1>
        <p className="text-muted-foreground mb-6">
          Dina uppgifter har registrerats hos {user.name || 'företaget'}.
        </p>
        {/* Optional: Add a button to close or navigate somewhere else if relevant */}
      </div>
    </main>
  );
}
