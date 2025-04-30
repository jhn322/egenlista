"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CtaSection() {
  return (
    <section className="w-full px-4 py-24 bg-blue-900 text-white">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Kom igång med Egen Lista idag
        </h2>
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Anslut dig till hundratals svenska företagare som redan använder Egen
          Lista för att bygga starkare kundrelationer.
        </p>

        <div className="max-w-md mx-auto">
          <form className="flex flex-col sm:flex-row gap-4">
            <Input
              type="email"
              placeholder="Din e-postadress"
              className="bg-blue-800 border-blue-700 text-white placeholder:text-gray-200 focus-visible:ring-blue-700"
            />
            <Button className="bg-white text-blue-900 hover:bg-gray-200">
              Kom igång gratis
            </Button>
          </form>
          <p className="text-sm text-gray-200 mt-4">Avsluta när du vill.</p>
        </div>
      </div>
    </section>
  );
}
