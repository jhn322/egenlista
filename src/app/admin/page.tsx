import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel | Egen Lista',
  description:
    'Administration panel för att hantera kundlistor och inställningar.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  if (!session) {
    redirect('/auth/login');
  }

  return (
    <main className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Adminpanel</CardTitle>
          <CardDescription>
            Välkommen till adminpanelen, {session.user?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Admin Dashboard Cards */}
            <Card>
              <CardHeader>
                <CardTitle>Användare</CardTitle>
                <CardDescription>Hantera användarkonton</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Inställningar</CardTitle>
                <CardDescription>Konfigurera nånting c:</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Analys saker</CardTitle>
                <CardDescription>Kolla massa koll statistik</CardDescription>
              </CardHeader>
            </Card>
          </section>
        </CardContent>
      </Card>
    </main>
  );
}
