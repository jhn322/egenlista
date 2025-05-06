'use client';

import { Check } from 'lucide-react';
import Image from 'next/image';
import { APP_NAME } from '@/lib/constants/site';

const steps = [
  {
    title: 'Importera dina kontakter',
    description:
      'Ladda upp din befintliga kundlista eller börja bygga en från grunden.',
  },
  {
    title: 'Organisera och kategorisera',
    description: 'Gruppera dina kunder baserat på deras behov och intressen.',
  },
  {
    title: 'Engagera dina kunder',
    description:
      'Skicka personliga meddelanden och följ upp vid rätt tidpunkt.',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="bg-secondary relative w-full px-4 py-24">
      <div className="from-background absolute inset-x-0 top-0 h-32 bg-gradient-to-b to-transparent"></div>

      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="relative order-2 h-[500px] overflow-hidden rounded-lg lg:order-1">
            <Image
              src="/how-it-works/how-it-works-1.webp"
              alt={`${APP_NAME} workflow`}
              fill
              className="object-cover"
            />
          </div>

          <div className="order-1 space-y-8 lg:order-2">
            <h2 className="text-primary text-3xl font-bold md:text-4xl">
              Ditt arbetsflöde. Ditt sätt.
            </h2>
            <p className="text-muted-foreground text-lg">
              {APP_NAME} anpassar sig efter dina behov, inte tvärtom. Vårt
              verktyg är utformat för att göra kundhantering så enkel som
              möjligt.
            </p>

            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="bg-primary mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg">
                    <Check className="text-primary-foreground h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-primary text-xl font-medium">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="to-background absolute right-0 bottom-0 left-0 z-5 h-32 bg-gradient-to-b from-transparent"></div>
    </section>
  );
}
