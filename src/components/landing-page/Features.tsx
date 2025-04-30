"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, ListChecks, BarChart3, Mail } from "lucide-react";

const features = [
  {
    title: "Hantera kundlistor",
    description: "Skapa och organisera dina kundlistor enkelt och effektivt.",
    icon: Users,
  },
  {
    title: "Spåra interaktioner",
    description:
      "Håll koll på alla kundkontakter och följ upp vid rätt tidpunkt.",
    icon: ListChecks,
  },
  {
    title: "Analysera data",
    description:
      "Få insikter om dina kunder och förbättra dina affärsrelationer.",
    icon: BarChart3,
  },
  {
    title: "Automatisera utskick",
    description: "Skicka personliga meddelanden till dina kunder automatiskt.",
    icon: Mail,
  },
];

export default function FeaturesSection() {
  return (
    <section className="w-full px-4 py-24 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900">
            Bygg perfekta kundlistor. Tillsammans.
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Egen Lista ger dig alla verktyg du behöver för att hantera dina
            kundrelationer på ett enkelt sätt.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-gray-200">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-gray-700" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
