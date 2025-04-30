"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarIcon } from "lucide-react";

const testimonials = [
  {
    name: "Anna Johansson",
    role: "Småföretagare, Stockholm",
    content:
      "Egen Lista har revolutionerat hur jag håller kontakten med mina kunder. Det är enkelt att använda och sparar mig flera timmar varje vecka.",
    avatar: "AJ",
  },
  {
    name: "Erik Lindberg",
    role: "Konsult, Göteborg",
    content:
      "Efter att ha testat flera CRM-system är Egen Lista det enda som verkligen passar mina behov som svensk företagare.",
    avatar: "EL",
  },
  {
    name: "Maria Svensson",
    role: "Butiksägare, Malmö",
    content:
      "Tack vare Egen Listahar jag kunnat öka min försäljning med 30% genom bättre kundrelationer och uppföljning.",
    avatar: "MS",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="w-full px-4 py-24 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900">
            Vad våra kunder säger
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hundratals svenska företagare använder redan Egen-lista för att
            förbättra sina kundrelationer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-gray-200">
              <CardHeader className="pb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  &quot;{testimonial.content}&quot;
                </p>
              </CardContent>
              <CardFooter>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage
                      src="/placeholder.svg"
                      alt={testimonial.name}
                    />
                    <AvatarFallback className="bg-gray-200 text-gray-700">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-blue-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
