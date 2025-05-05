'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function ToolsSection() {
  return (
    <section className="relative w-full bg-secondary px-4 py-24">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-primary md:text-4xl">
            Kraftfulla verktyg för ditt företag
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-muted-foreground">
            Egen Lista ger dig allt du behöver för att hantera dina
            kundrelationer på ett professionellt sätt.
          </p>
        </div>

        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-primary">
              Avancerad dataanalys
            </h3>
            <p className="text-lg text-muted-foreground">
              Få djupgående insikter om dina kunder och deras beteenden. Använd
              dessa insikter för att förbättra dina affärsstrategier och öka din
              försäljning.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-lg bg-primary"></div>
                <span className="text-muted-foreground">
                  Kundengagemang och aktivitet
                </span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-lg bg-primary"></div>
                <span className="text-muted-foreground">
                  Försäljningstrender och prognoser
                </span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-lg bg-primary"></div>
                <span className="text-muted-foreground">
                  Segmentering och målgruppsanalys
                </span>
              </li>
            </ul>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Utforska analysfunktioner
            </Button>
          </div>
          <div className="relative h-[500px] overflow-hidden rounded-lg">
            <Image
              src="/tools/tools-1.jpg"
              alt="Dataanalys i Egen Lista"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-background z-5"></div>
    </section>
  );
}
