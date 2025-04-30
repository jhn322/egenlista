'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

const useCases = [
  {
    title: 'Småföretagare',
    description:
      'Perfekt för småföretagare som vill hålla koll på sina kunder utan komplicerade system.',
    image: '/placeholder.svg?height=300&width=400',
  },
  {
    title: 'E-handlare',
    description:
      'Hantera dina onlinekunder och förbättra din e-handelsstrategi med kundinsikter.',
    image: '/placeholder.svg?height=300&width=400',
  },
  {
    title: 'Konsulter',
    description:
      'Håll reda på dina klienter och projekt för att leverera bättre tjänster.',
    image: '/placeholder.svg?height=300&width=400',
  },
  {
    title: 'Tjänsteföretag',
    description:
      'Förbättra kundupplevelsen genom att ha all kundinformation lättillgänglig.',
    image: '/placeholder.svg?height=300&width=400',
  },
];

export default function UseCasesSection() {
  return (
    <section className="w-full bg-white px-4 py-24">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-blue-900 md:text-4xl">
            Börja med en mall. Bygg vad som helst.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600">
            Egen Lista passar för alla typer av företag och branscher. Se hur
            olika företag använder vår plattform.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {useCases.map((useCase, index) => (
            <Card key={index} className="overflow-hidden border-gray-200">
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
                <p className="text-gray-600">{useCase.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
