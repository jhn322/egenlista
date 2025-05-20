import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { Metadata } from 'next';
import { AUTH_PATHS, PROTECTED_PATHS } from '@/lib/constants/routes';
import { APP_NAME } from '@/lib/constants/site';
import { MinaSidorCards } from '@/app/mina-sidor/mina-sidor-cards';

export const metadata: Metadata = {
  title: `Mina Sidor | ${APP_NAME}`,
  description: 'Hantera dina kontakter, inställningar och prenumeration.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function MinaSidorPage() {
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  if (!session || !session.user) {
    redirect(
      `${AUTH_PATHS.LOGIN}?callbackUrl=${PROTECTED_PATHS.MINA_SIDOR_BASE}`
    );
  }

  return (
    <main className="container mx-auto py-10">
      <div className="space-y-6">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold">Mina Sidor</h1>
          <p className="text-muted-foreground">
            Välkommen, {session.user?.name || 'användare'}! Härifrån hanterar du
            dina uppgifter.
          </p>
        </div>

        {/* Grid for different sections */}
        <MinaSidorCards />
      </div>
    </main>
  );
}
