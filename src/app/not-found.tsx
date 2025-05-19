import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from '@/components/icons/arrow-left-icon';
import { CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sidan kunde inte hittas',
  description:
    'Tyvärr kunde vi inte hitta sidan du sökte efter. Kontrollera webbadressen eller gå tillbaka till startsidan.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="bg-card flex h-screen w-full items-center justify-center">
      <div className="max-w-[600px] space-y-6 px-4 text-center">
        <div className="space-y-2">
          <CardTitle
            className="text-card-foreground text-4xl font-bold sm:text-6xl"
            aria-label="404"
          >
            404
          </CardTitle>
          <CardTitle className="text-muted-foreground text-xl font-semibold sm:text-2xl">
            Sidan kunde inte hittas
          </CardTitle>
        </div>
        <CardDescription className="text-base text-black/90 sm:text-lg">
          Tyvärr kunde vi inte hitta sidan du sökte efter. Kontrollera
          webbadressen eller gå tillbaka till startsidan.
        </CardDescription>
        <CardDescription className="flex justify-center gap-4">
          <Button
            asChild
            variant="default"
            aria-label="Gå tillbaka till startsidan"
          >
            <Link href="/">
              <ArrowLeftIcon className="mr-2 h-4 w-4" aria-hidden="true" />
              Gå tillbaka hem
            </Link>
          </Button>
        </CardDescription>
        <CardContent className="pt-8">
          <div
            className="from-primary/30 to-primary mx-auto h-2 w-32 rounded-full bg-gradient-to-r"
            aria-hidden="true"
            role="presentation"
          />
        </CardContent>
      </div>
    </main>
  );
}
