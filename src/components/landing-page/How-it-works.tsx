"use client";

import { Check } from "lucide-react";
import Image from "next/image";

const steps = [
  {
    title: "Importera dina kontakter",
    description:
      "Ladda upp din befintliga kundlista eller börja bygga en från grunden.",
  },
  {
    title: "Organisera och kategorisera",
    description: "Gruppera dina kunder baserat på deras behov och intressen.",
  },
  {
    title: "Engagera dina kunder",
    description:
      "Skicka personliga meddelanden och följ upp vid rätt tidpunkt.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="w-full px-4 py-24 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 relative h-[500px] rounded-xl overflow-hidden">
            <Image
              src="/placeholder.svg?height=500&width=700"
              alt="Egen Lista workflow"
              fill
              className="object-cover"
            />
          </div>

          <div className="order-1 lg:order-2 space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900">
              Ditt arbetsflöde. Ditt sätt.
            </h2>
            <p className="text-lg text-gray-600">
              Egen Lista anpassar sig efter dina behov, inte tvärtom. Vårt
              verktyg är utformat för att göra kundhantering så enkel som
              möjligt.
            </p>

            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="h-6 w-6 rounded-full bg-blue-900 flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-blue-900">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 mt-1">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
