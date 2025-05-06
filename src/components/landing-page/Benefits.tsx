'use client';

import Image from 'next/image';
import { APP_NAME } from '@/lib/constants/site';

export default function BenefitsSection() {
  return (
    <section className="bg-background relative w-full px-4 py-32">
      <div className="absolute inset-0 flex items-center justify-center overflow-visible">
        <div className="relative h-full max-h-[900px] w-full max-w-[1200px]">
          <Image
            src="/logo-bg.png"
            alt="Background"
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="pointer-events-none opacity-30 select-none"
            style={{
              objectFit: 'contain',
              filter: 'blur(20px)',
            }}
            loading="lazy"
            fetchPriority="low"
          />
        </div>
      </div>

      <div className="relative z-10 container mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-primary text-3xl font-bold md:text-4xl">
            Hitta allt. Direkt.
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-xl">
            Sluta leta efter information om dina kunder. Med {APP_NAME} har du
            allt på ett ställe.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <span className="text-primary font-bold">1</span>
            </div>
            <h3 className="text-primary text-xl font-bold">Snabb sökning</h3>
            <p className="text-foreground/90">
              Hitta exakt den information du behöver med vår kraftfulla
              sökfunktion.
            </p>
          </div>
          <div className="space-y-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <span className="text-primary font-bold">2</span>
            </div>
            <h3 className="text-primary text-xl font-bold">Smart filtrering</h3>
            <p className="text-foreground/90">
              Filtrera dina kundlistor baserat på olika kriterier för att hitta
              rätt målgrupp.
            </p>
          </div>
          <div className="space-y-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <span className="text-primary font-bold">3</span>
            </div>
            <h3 className="text-primary text-xl font-bold">Anpassade vyer</h3>
            <p className="text-foreground/90">
              Skapa anpassade vyer för att se exakt den information du behöver
              för olika situationer.
            </p>
          </div>
        </div>
      </div>

      <div className="to-secondary absolute right-0 bottom-0 left-0 z-5 h-32 bg-gradient-to-b from-transparent"></div>
    </section>
  );
}
