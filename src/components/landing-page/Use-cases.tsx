'use client';

import { SmallBusinessIcon } from '@/components/icons/small-business-icon';
import { EcommerceIcon } from '@/components/icons/ecommerce-icon';
import { FreelanceIcon } from '@/components/icons/freelance-icon';
import { ServiceCompanyIcon } from '@/components/icons/service-company-icon';

// ** Use Case Data ** //
const useCases = [
  {
    icon: SmallBusinessIcon,
    title: 'Småföretagare',
    description:
      'Perfekt för lokala butiker, hantverkare eller andra småföretagare som vill hålla koll på sina kunder utan krångliga system.',
  },
  {
    icon: EcommerceIcon,
    title: 'E-handlare',
    description:
      'Samla leads, hantera dina onlinekunder och förbättra din marknadsföring med värdefulla kundinsikter.',
  },
  {
    icon: FreelanceIcon,
    title: 'Konsulter & Frilansare',
    description:
      'Håll ordning på dina klienter och projekt för att enkelt kunna skicka ut nyhetsbrev eller erbjudanden.',
  },
  {
    icon: ServiceCompanyIcon,
    title: 'Tjänsteföretag',
    description:
      'Förbättra kundrelationer och service genom att ha all relevant kundinformation samlad och lättillgänglig.',
  },
];

// ** Main Component ** //
export default function UseCasesSection() {
  return (
    <section className="bg-background relative w-full px-4 py-24">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-primary text-3xl font-bold md:text-4xl">
            Anpassat för din verksamhet
          </h2>
          <p className="text-foreground/90 mx-auto mt-4 max-w-2xl text-lg md:text-xl">
            Oavsett om du driver en webbshop, en konsultfirma eller en lokal
            butik, hjälper Egen Lista dig att växa din kundbas.
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
          {useCases.map((useCase) => {
            const IconComponent = useCase.icon;
            return (
              <div
                key={useCase.title}
                className="flex flex-col items-center text-center md:items-start md:text-left"
              >
                <div className="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                  <IconComponent className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-foreground text-lg font-semibold">
                  {useCase.title}
                </h3>
                <p className="text-foreground/90 mt-1">{useCase.description}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="to-secondary absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-b from-transparent"></div>
    </section>
  );
}
