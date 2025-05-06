'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AUTH_PATHS } from '@/lib/constants/routes';
import { APP_NAME } from '@/lib/constants/site';

// ** Preview Images for Carousel ** //
const previewImages = [
  '/hero/hero-preview-1.webp',
  '/hero/hero-preview-2.webp',
  '/hero/hero-preview-3.webp',
  '/hero/hero-preview-4.webp',
];

export default function HeroSection() {
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
    <section className="bg-secondary relative w-full overflow-hidden px-4 py-16 md:py-24 lg:py-32">
      {/* Background Image with Blur Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/logo-bg.png"
          alt="Background"
          fill
          className="object-none object-left opacity-30 blur-[20px]"
          style={{ transform: 'scale(1)' }}
          priority
        />
      </div>

      {/* Gradient Overlay */}
      <div className="to-background absolute right-0 bottom-0 left-0 z-5 h-48 bg-gradient-to-b from-transparent"></div>

      <div className="relative z-10 container mx-auto max-w-6xl space-y-12 lg:space-y-24">
        <div className="grid grid-cols-1 items-center gap-x-12 gap-y-8 lg:grid-cols-2">
          {/* Text and Button Column */}
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-primary text-5xl font-bold tracking-tight md:text-6xl">
              {APP_NAME}
            </h1>
            <p className="text-muted-foreground mx-auto max-w-md text-xl md:text-2xl lg:mx-0">
              Ett enkelt verktyg för svenska företagare att bygga sin egen
              kundlista.
            </p>
            {/* Button and Sub-text Container */}
            <div className="flex flex-col items-center gap-4 pt-4 lg:items-start">
              <Link href={AUTH_PATHS.LOGIN} className="w-full sm:w-auto">
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90 text-md w-full"
                  aria-label={`Kom igång gratis med ${APP_NAME}`}
                >
                  Kom igång gratis
                </Button>
              </Link>
              <p className="text-muted-foreground text-sm">
                Ingen kreditkort krävs. Gratis för små företag.
              </p>
            </div>
          </div>

          {/* App Preview Graphic (Desktop) */}
          <div className="hidden lg:flex lg:justify-center">
            <Image
              src="/hero/hero-illustration.svg"
              alt="Man reading list illustration"
              width={400}
              height={400}
              className="h-auto w-96 xl:w-120"
            />
          </div>
        </div>

        {/* Graphic & Preview Window (Mobile) */}
        <div className="-space-y-4 lg:space-y-2">
          <div className="flex justify-center lg:hidden">
            <Image
              src="/hero/hero-illustration.svg"
              alt="Man reading list illustration"
              width={300}
              height={300}
              className="h-auto w-80 md:w-96"
            />
          </div>

          {/* Preview Window */}
          <Card className="relative mx-auto max-w-6xl overflow-hidden shadow-sm dark:shadow-slate-700/[.3]">
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
                  alt={`App Preview Images ${currentImageIndex + 1}`}
                  fill
                  className="object-cover"
                  priority={currentImageIndex === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
