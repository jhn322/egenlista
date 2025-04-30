"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="w-full px-4 py-24 md:py-32 lg:py-40 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-blue-900">
              Egen Lista
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-md">
              Ett enkelt verktyg för svenska företagare att bygga sin egen
              kundlista.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="bg-blue-900 hover:bg-gray-800 text-white">
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
          <div className="relative h-[500px] lg:h-[600px] rounded-xl overflow-hidden">
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
