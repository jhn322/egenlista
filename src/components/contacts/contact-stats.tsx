'use client';

// * ==========================================================================
// *                          CONTACT STATS COMPONENT
// * ==========================================================================
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Contact, ContactType } from '@/generated/prisma';
import { Users, Briefcase, Star, UsersRound } from 'lucide-react';
import React from 'react';

// **  Props Interface  ** //
interface ContactStatsProps {
  contacts: Contact[];
}

// **  ContactStats Component  ** //
// Returns an array of Card React.ReactElements to be used in a parent grid
export function ContactStats({
  contacts,
}: ContactStatsProps): React.ReactElement[] {
  // * Calculate statistics
  const totalContacts = contacts.length;
  const leadContacts = contacts.filter(
    (contact) => contact.type === ContactType.LEAD
  ).length;
  const customerContacts = contacts.filter(
    (contact) => contact.type === ContactType.CUSTOMER
  ).length;
  const ambassadorContacts = contacts.filter(
    (contact) => contact.type === ContactType.AMBASSADOR
  ).length;

  const statsData = [
    {
      title: 'Totalt Antal',
      value: totalContacts,
      icon: <UsersRound className="text-muted-foreground h-5 w-5" />,
      description: 'Alla dina kontakter.',
    },
    {
      title: 'Leads',
      value: leadContacts,
      icon: <Users className="text-muted-foreground h-5 w-5" />,
      description: 'Potentiella kunder.',
    },
    {
      title: 'Kunder',
      value: customerContacts,
      icon: <Briefcase className="text-muted-foreground h-5 w-5" />,
      description: 'Betalande kunder.',
    },
    {
      title: 'Ambassadörer',
      value: ambassadorContacts,
      icon: <Star className="text-muted-foreground h-5 w-5" />,
      description: 'De som marknadsför dig.',
    },
  ];

  return statsData.map((stat) => (
    <Card key={stat.title}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
        {stat.icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stat.value}</div>
        <p className="text-muted-foreground text-xs">{stat.description}</p>
      </CardContent>
    </Card>
  ));
}
