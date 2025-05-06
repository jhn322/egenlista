'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { APP_NAME } from '@/lib/constants/site';

// ** Preview Images for Carousel ** //
const previewImages = [
  '/tools/tools-preview-1.webp',
  '/tools/tools-preview-2.webp',
  '/tools/tools-preview-3.webp',
  '/tools/tools-preview-4.webp',
];

export default function ToolsSection() {
  // ** Carousel State & Effect ** //
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === previewImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-secondary relative w-full px-4 py-24">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-primary text-3xl font-bold md:text-4xl">
            Kraftfulla verktyg för ditt företag
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-xl">
            {APP_NAME} ger dig allt du behöver för att hantera dina
            kundrelationer på ett professionellt sätt.
          </p>
        </div>

        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div className="space-y-6">
            <h3 className="text-primary text-2xl font-bold">
              Avancerad dataanalys
            </h3>
            <p className="text-muted-foreground text-lg">
              Få djupgående insikter om dina kunder och deras beteenden. Använd
              dessa insikter för att förbättra dina affärsstrategier och öka din
              försäljning.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <div className="bg-primary h-2 w-2 rounded-lg"></div>
                <span className="text-muted-foreground">
                  Kundengagemang och aktivitet
                </span>
              </li>
              <li className="flex items-center gap-2">
                <div className="bg-primary h-2 w-2 rounded-lg"></div>
                <span className="text-muted-foreground">
                  Försäljningstrender och prognoser
                </span>
              </li>
              <li className="flex items-center gap-2">
                <div className="bg-primary h-2 w-2 rounded-lg"></div>
                <span className="text-muted-foreground">
                  Segmentering och målgruppsanalys
                </span>
              </li>
            </ul>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Utforska analysfunktioner
            </Button>
          </div>
          <div className="relative overflow-hidden">
            {/* Preview Window */}
            <Card className="relative mx-auto overflow-hidden shadow-sm dark:shadow-slate-700/[.3]">
              {/* Header */}
              <div className="bg-muted/60 absolute top-0 right-0 left-0 z-10 flex h-8 items-center gap-1.5 px-3">
                <span className="h-3 w-3 rounded-full bg-red-500"></span>
                <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                <span className="h-3 w-3 rounded-full bg-green-500"></span>
              </div>

              {/* Image Content */}
              <CardContent className="aspect-video h-full w-full p-0 pt-8">
                <div className="relative h-full w-full">
                  <Image
                    key={currentImageIndex}
                    src={previewImages[currentImageIndex]}
                    alt={`Tools Preview Images ${currentImageIndex + 1}`}
                    fill
                    className="object-cover"
                    priority={currentImageIndex === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="to-background absolute right-0 bottom-0 left-0 z-5 h-32 bg-gradient-to-b from-transparent"></div>
    </section>
  );
}
