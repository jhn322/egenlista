'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function ToolsSection() {
  return (
    <section className="w-full bg-gray-50 px-4 py-24">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-blue-900 md:text-4xl">
            Kraftfulla verktyg för ditt företag
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600">
            Egen Lista ger dig allt du behöver för att hantera dina
            kundrelationer på ett professionellt sätt.
          </p>
        </div>

        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-blue-900">
              Avancerad dataanalys
            </h3>
            <p className="text-lg text-gray-600">
              Få djupgående insikter om dina kunder och deras beteenden. Använd
              dessa insikter för att förbättra dina affärsstrategier och öka din
              försäljning.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-900"></div>
                <span className="text-gray-700">
                  Kundengagemang och aktivitet
                </span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-900"></div>
                <span className="text-gray-700">
                  Försäljningstrender och prognoser
                </span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-900"></div>
                <span className="text-gray-700">
                  Segmentering och målgruppsanalys
                </span>
              </li>
            </ul>
            <Button className="bg-blue-900 text-white hover:bg-gray-800">
              Utforska analysfunktioner
            </Button>
          </div>
          <div className="relative h-[500px] overflow-hidden rounded-xl">
            <Image
              src="/placeholder.svg?height=500&width=700"
              alt="Dataanalys i Egen Lista"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
