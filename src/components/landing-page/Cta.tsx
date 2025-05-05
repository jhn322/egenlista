'use client';

import { ArrowDown } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CtaSection() {
  return (
    <section className="relative w-full px-4 py-16 sm:py-24">
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-secondary to-transparent z-[-1]"></div>

      <div className="relative container mx-auto max-w-6xl rounded-lg bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8 shadow-sm sm:p-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden z-0">
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
            <h2 className="mb-4 text-3xl font-bold text-primary md:text-4xl">
              Kom igång med Egen Lista idag
            </h2>
            <p className="mb-8 text-lg text-muted-foreground md:mb-0">
              Anslut dig till hundratals svenska företagare som redan använder
              Egen Lista för att bygga starkare kundrelationer.
            </p>
          </div>

          <div className="mx-auto w-full max-w-md">
            <p className="mb-2 flex items-center justify-center text-sm font-medium text-primary md:justify-start">
              Anmäl dig till vårt nyhetsbrev
              <ArrowDown className="ml-1 h-4 w-4" />
            </p>
            <form className="flex items-center space-x-2 rounded-lg border bg-background p-1 shadow-inner">
              <Input
                type="email"
                placeholder="Din e-postadress"
                className="flex-1 border-none bg-transparent px-4 py-2 text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button
                type="submit"
                className="shrink-0 rounded-lg bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90"
              >
                Kom igång gratis
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
