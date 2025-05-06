'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowIcon } from '@/components/icons/arrow-icon';
import { SendIcon } from '@/components/icons/send-icon';

export default function CtaSection() {
  return (
    <section className="relative w-full px-4 py-16 sm:py-24">
      <div className="from-secondary absolute inset-x-0 top-0 z-[-1] h-32 bg-gradient-to-b to-transparent"></div>

      <div className="relative container mx-auto max-w-6xl overflow-hidden rounded-lg border bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8 sm:p-16">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/logo-bg.png"
            alt="Background"
            fill
            className="object-none object-center opacity-30 blur-[20px]"
            style={{ transform: 'scale(1)' }}
            priority={false}
          />
        </div>

        <div className="relative z-10 grid gap-12 md:grid-cols-2 md:items-center">
          <div className="text-center md:text-left">
            <h2 className="text-primary mb-4 text-3xl font-bold md:text-4xl">
              Kom igång med Egen Lista idag
            </h2>
            <p className="text-muted-foreground mb-8 text-lg md:mb-0">
              Anslut dig till hundratals svenska företagare som redan använder
              Egen Lista för att bygga starkare kundrelationer.
            </p>
          </div>

          <div className="mx-auto w-full max-w-md">
            <p className="text-primary mb-2 flex items-center justify-center text-sm font-medium md:justify-start">
              Håll dig uppdaterad om våra verktyg
              <ArrowIcon className="ml-2 h-4 w-4 rotate-90" />
            </p>
            <form className="bg-background flex items-center space-x-2 rounded-lg border p-1 shadow-inner">
              <Input
                type="email"
                placeholder="Din e-postadress"
                className="text-foreground placeholder:text-muted-foreground flex-1 border-none bg-transparent px-4 py-2 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 sm:placeholder:text-base"
                aria-label="E-postadress för uppdateringar"
              />
              <Button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 rounded-lg p-2 sm:px-6 sm:py-2"
                aria-label="Skicka e-postadress"
              >
                <SendIcon className="h-5 w-5 sm:mr-2" />
                <span className="hidden sm:inline">Kom igång</span>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
