import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Metadata } from 'next';
import Link from 'next/link';
import { Users } from 'lucide-react';
import { AUTH_PATHS, PROTECTED_PATHS } from '@/lib/constants/routes';
import { APP_NAME } from '@/lib/constants/site';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Link to Contacts */}
          <Link
            href={PROTECTED_PATHS.MINA_SIDOR_KONTAKTVY}
            className="block transition-opacity hover:opacity-90"
          >
            <Card className="hover:bg-muted/50 h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Kontakter</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Users className="text-muted-foreground h-5 w-5" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Visa kontaktsidan</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Se och hantera dina insamlade kontakter.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Placeholder for Account Settings */}
          <Card className="hover:bg-muted/50 h-full">
            <CardHeader>
              <CardTitle>Kontoinställningar</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">(Kommer snart)</p>
            </CardContent>
          </Card>

          {/* Placeholder for Subscription Management */}
          <Card className="hover:bg-muted/50 h-full">
            <CardHeader>
              <CardTitle>Prenumeration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">(Kommer snart)</p>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
