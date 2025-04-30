'use client';

import Image from 'next/image';

export default function BenefitsSection() {
  return (
    <section className="w-full bg-white px-4 py-24">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-blue-900 md:text-4xl">
            Hitta allt. Direkt.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600">
            Sluta leta efter information om dina kunder. Med Egen Lista har du
            allt på ett ställe.
          </p>
        </div>

        <div className="relative mb-12 h-[600px] overflow-hidden rounded-xl">
          <Image
            src="/placeholder.svg?height=600&width=1200"
            alt="Egen Lista dashboard overview"
            fill
            className="object-cover"
          />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <span className="font-bold text-blue-900">1</span>
            </div>
            <h3 className="text-xl font-bold text-blue-900">Snabb sökning</h3>
            <p className="text-gray-600">
              Hitta exakt den information du behöver med vår kraftfulla
              sökfunktion.
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <span className="font-bold text-blue-900">2</span>
            </div>
            <h3 className="text-xl font-bold text-blue-900">
              Smart filtrering
            </h3>
            <p className="text-gray-600">
              Filtrera dina kundlistor baserat på olika kriterier för att hitta
              rätt målgrupp.
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <span className="font-bold text-blue-900">3</span>
            </div>
            <h3 className="text-xl font-bold text-blue-900">Anpassade vyer</h3>
            <p className="text-gray-600">
              Skapa anpassade vyer för att se exakt den information du behöver
              för olika situationer.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
