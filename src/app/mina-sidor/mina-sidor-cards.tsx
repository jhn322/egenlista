'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { MultipleUsersIcon } from '@/components/icons/multiple-users-icon';
import { LoadingCircleIcon } from '@/components/icons/loading-circle-icon';
import { PROTECTED_PATHS } from '@/lib/constants/routes';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface MinaSidorCardsProps {}

interface CardConfig {
  id: string;
  href: string;
  title: string;
  Icon?: React.ElementType;
  iconAriaLabel?: string;
  description: string;
  comingSoon?: boolean;
}

const cardsData: CardConfig[] = [
  {
    id: 'contacts',
    href: PROTECTED_PATHS.MINA_SIDOR_KONTAKTVY,
    title: 'Kontakter',
    Icon: MultipleUsersIcon,
    iconAriaLabel: 'Visa kontaktsidan',
    description: 'Se och hantera dina insamlade kontakter.',
  },
  {
    id: 'account-settings',
    href: '#', // Placeholder, will not navigate
    title: 'Kontoinställningar',
    description: '(Kommer snart)',
    comingSoon: true,
  },
  {
    id: 'subscription',
    href: '#', // Placeholder, will not navigate
    title: 'Prenumeration',
    description: '(Kommer snart)',
    comingSoon: true,
  },
];

export const MinaSidorCards: React.FC<MinaSidorCardsProps> = () => {
  const [loadingCardHref, setLoadingCardHref] = useState<string | null>(null);

  const handleCardClick = (href: string) => {
    // Only set loading state for actual navigation, not for disabled/coming soon cards
    if (href && href !== '#') {
      setLoadingCardHref(href);
    }
    // Navigation will be handled by the Link component
  };

  return (
    <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {cardsData.map((card) => {
        const isLoading = loadingCardHref === card.href && !card.comingSoon;
        const isClickable = !card.comingSoon;

        const cardElements = (
          <>
            <CardHeader
              className={
                card.Icon
                  ? 'flex flex-row items-center justify-between space-y-0 pb-2'
                  : ''
              }
            >
              <CardTitle className="text-lg font-medium">
                {card.title}
              </CardTitle>
              {card.Icon && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <card.Icon className="text-muted-foreground h-5 w-5" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{card.iconAriaLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </CardHeader>
            <CardContent className="relative">
              {isLoading && (
                <div className="bg-card/80 absolute inset-0 flex items-center justify-center rounded-lg backdrop-blur-sm">
                  <LoadingCircleIcon
                    iconSize={48}
                    className="text-primary animate-spin"
                  />
                </div>
              )}
              {!isLoading && (
                <p className="text-muted-foreground text-sm">
                  {card.description}
                </p>
              )}
            </CardContent>
          </>
        );

        if (!isClickable) {
          return (
            <Card key={card.id} className="h-full opacity-70">
              {cardElements}
            </Card>
          );
        }

        return (
          <Link
            key={card.id}
            href={card.href}
            className="focus-visible:ring-ring block rounded-lg transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            onClick={() => handleCardClick(card.href)}
            aria-label={`Gå till ${card.title}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleCardClick(card.href);
              }
            }}
          >
            <Card className="hover:bg-muted/50 h-full">{cardElements}</Card>
          </Link>
        );
      })}
    </section>
  );
};
