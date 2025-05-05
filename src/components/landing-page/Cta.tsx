'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CtaSection() {
  return (
    <section className="w-full bg-primary px-4 py-24 text-primary-foreground">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="mb-6 text-3xl font-bold md:text-4xl">
          Kom igång med Egen Lista idag
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-xl text-primary-foreground/80">
          Anslut dig till hundratals svenska företagare som redan använder Egen
          Lista för att bygga starkare kundrelationer.
        </p>

        <div className="mx-auto max-w-md">
          <form className="flex flex-col gap-4 sm:flex-row">
            <Input
              type="email"
              placeholder="Din e-postadress"
              className="border-primary/50 bg-background/70 text-black placeholder:text-black/60 focus-visible:ring-ring"
            />
            <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              Kom igång gratis
            </Button>
          </form>
          <p className="mt-4 text-sm text-primary-foreground/80">
            Avsluta när du vill.
          </p>
        </div>
      </div>
    </section>
  );
}
