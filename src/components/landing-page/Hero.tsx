'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="w-full bg-gray-50 px-4 py-24 md:py-32 lg:py-40">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold tracking-tight text-blue-900 md:text-6xl">
              Egen Lista
            </h1>
            <p className="max-w-md text-xl text-gray-600 md:text-2xl">
              Ett enkelt verktyg för svenska företagare att bygga sin egen
              kundlista.
            </p>
            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              <Button className="bg-blue-900 text-white hover:bg-gray-800">
                Kom igång gratis
              </Button>
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700"
              >
                Se demo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              Ingen kreditkort krävs. Gratis för små företag.
            </p>
          </div>
          <div className="relative h-[500px] overflow-hidden rounded-xl lg:h-[600px]">
            <Image
              src="/placeholder.svg?height=600&width=800"
              alt="Egen Lista adminpanel"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
