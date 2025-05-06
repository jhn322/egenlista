'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ArrowIcon } from '@/components/icons/arrow-icon';

export default function HeroSection() {
  return (
    <section className="relative w-full bg-secondary px-4 py-32 md:py-40 lg:py-48 overflow-hidden">
      {/* Background Image with Blur Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/logo-bg.png"
          alt="Background"
          fill
          className="object-none object-center opacity-30 blur-[20px]"
          style={{ transform: 'scale(1)' }}
          priority
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-background z-5"></div>

      <div className="container relative z-10 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold tracking-tight text-primary md:text-6xl">
              Egen Lista
            </h1>
            <p className="max-w-md text-xl text-muted-foreground md:text-2xl">
              Ett enkelt verktyg för svenska företagare att bygga sin egen
              kundlista.
            </p>
            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Kom igång gratis
              </Button>
              <Button
                variant="outline"
                className="border-border text-foreground"
              >
                Se demo <ArrowIcon className="ml-2" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Ingen kreditkort krävs. Gratis för små företag.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
