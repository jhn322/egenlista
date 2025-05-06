'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ClientsIcon } from '@/components/icons/clients-icon';
import { CheckmarklistIcon } from '@/components/icons/checkmarklist-icon';
import { AnalyticsIcon } from '@/components/icons/analytics-icon';
import { MailIcon } from '@/components/icons/mail-icon';

const features = [
  {
    title: 'Hantera kundlistor',
    description: 'Skapa och organisera dina kundlistor enkelt och effektivt.',
    icon: ClientsIcon,
  },
  {
    title: 'Spåra interaktioner',
    description:
      'Håll koll på alla kundkontakter och följ upp vid rätt tidpunkt.',
    icon: CheckmarklistIcon,
  },
  {
    title: 'Analysera data',
    description:
      'Få insikter om dina kunder och förbättra dina affärsrelationer.',
    icon: AnalyticsIcon,
  },
  {
    title: 'Automatisera utskick',
    description: 'Skicka personliga meddelanden till dina kunder automatiskt.',
    icon: MailIcon,
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-background relative w-full px-4 py-24">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-16 space-y-4 text-center">
          <h2 className="text-primary text-3xl font-bold md:text-4xl">
            Bygg perfekta kundlistor. Tillsammans.
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            Egen Lista ger dig alla verktyg du behöver för att hantera dina
            kundrelationer på ett enkelt sätt.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="border-border">
              <CardHeader>
                <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                  <feature.icon className="text-foreground h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
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
