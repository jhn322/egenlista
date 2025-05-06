'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { AuthCard } from '@/components/auth/AuthCard';
import { AUTH_PATHS, API_AUTH_PATHS } from '@/lib/constants/routes';
import { AUTH_MESSAGES } from '@/lib/auth/constants/auth';

// ** Component to handle displaying content and resend logic ** //
function VerifyNeededContent() {
  const searchParams = useSearchParams();
  const email = searchParams?.get('email');
  const [isLoading, setIsLoading] = useState(false);

  const handleResendClick = async () => {
    if (!email) {
      toast.error('E-postadress saknas. Kan inte skicka om mailet.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(API_AUTH_PATHS.RESEND_VERIFICATION_EMAIL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          data.message || AUTH_MESSAGES.INFO_VERIFICATION_EMAIL_SENT
        );
      } else {
        toast.error(data.message || AUTH_MESSAGES.ERROR_DEFAULT);
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      toast.error(AUTH_MESSAGES.ERROR_DEFAULT);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Verifiera din e-postadress"
      description={`Ett verifieringsmail har skickats till ${email || 'din e-postadress'}. Klicka på länken i mailet för att slutföra registreringen.`}
    >
      <div className="space-y-4 text-center">
        <p className="text-sm text-gray-600">
          Fick du inget mail? Kontrollera din skräppostmapp eller klicka nedan
          för att skicka ett nytt.
        </p>
        <Button
          onClick={handleResendClick}
          variant="secondary"
          className="w-full"
          disabled={isLoading || !email}
        >
          {isLoading ? 'Skickar...' : 'Skicka nytt verifieringsmail'}
        </Button>
        <div className="pt-4 text-sm">
          <Link
            href={AUTH_PATHS.LOGIN}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Tillbaka till inloggning
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}

// ** Main Page Component with Suspense ** //
// * This page informs the user that they need to verify their email address
// * and provides an option to resend the verification email.
export default function VerifyNeededPage() {
  // Using Suspense because useSearchParams needs it
  return (
    <Suspense fallback={<div>Laddar...</div>}>
      <VerifyNeededContent />
    </Suspense>
  );
}
