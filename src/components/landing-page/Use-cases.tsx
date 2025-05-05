'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

const useCases = [
  {
    title: 'Småföretagare',
    description:
      'Perfekt för småföretagare som vill hålla koll på sina kunder utan komplicerade system.',
    image: '/use-cases/use-cases-1.jpg',
  },
  {
    title: 'E-handlare',
    description:
      'Hantera dina onlinekunder och förbättra din e-handelsstrategi med kundinsikter.',
    image: '/use-cases/use-cases-2.jpg',
  },
  {
    title: 'Konsulter',
    description:
      'Håll reda på dina klienter och projekt för att leverera bättre tjänster.',
    image: '/use-cases/use-cases-3.jpg',
  },
  {
    title: 'Tjänsteföretag',
    description:
      'Förbättra kundupplevelsen genom att ha all kundinformation lättillgänglig.',
    image: '/use-cases/use-cases-4.jpg',
  },
];

export default function UseCasesSection() {
  return (
    <section className="relative w-full bg-background px-4 py-24">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-primary md:text-4xl">
            Börja med en mall. Bygg vad som helst.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-muted-foreground">
            Egen Lista passar för alla typer av företag och branscher. Se hur
            olika företag använder vår plattform.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {useCases.map((useCase, index) => (
            <Card key={index} className="overflow-hidden border-border">
              <div className="relative h-[250px]">
                <Image
                  src={useCase.image || '/placeholder.svg'}
                  alt={useCase.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{useCase.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{useCase.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-secondary z-5"></div>
    </section>
  );
}
