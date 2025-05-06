'use client';

import Image from 'next/image';

export default function BenefitsSection() {
  return (
    <section className="relative w-full bg-background px-4 py-32 overflow-hidden">
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

      <div className="container relative z-10 mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-primary md:text-4xl">
            Hitta allt. Direkt.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-muted-foreground">
            Sluta leta efter information om dina kunder. Med Egen Lista har du
            allt på ett ställe.
          </p>
        </div>


        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <span className="font-bold text-primary">1</span>
            </div>
            <h3 className="text-xl font-bold text-primary">Snabb sökning</h3>
            <p className="text-muted-foreground">
              Hitta exakt den information du behöver med vår kraftfulla
              sökfunktion.
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <span className="font-bold text-primary">2</span>
            </div>
            <h3 className="text-xl font-bold text-primary">
              Smart filtrering
            </h3>
            <p className="text-muted-foreground">
              Filtrera dina kundlistor baserat på olika kriterier för att hitta
              rätt målgrupp.
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <span className="font-bold text-primary">3</span>
            </div>
            <h3 className="text-xl font-bold text-primary">Anpassade vyer</h3>
            <p className="text-muted-foreground">
              Skapa anpassade vyer för att se exakt den information du behöver
              för olika situationer.
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-secondary z-5"></div>
    </section>
  );
}
