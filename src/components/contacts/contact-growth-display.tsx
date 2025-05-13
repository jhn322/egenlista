'use client';

import { useState, useMemo } from 'react';
import { Contact } from '@/generated/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// **  Props Interface  ** //
interface ContactGrowthDisplayProps {
  contacts: Contact[];
  className?: string;
}

// **  ContactGrowthDisplay Component  ** //
export function ContactGrowthDisplay({
  contacts,
  className,
}: ContactGrowthDisplayProps) {
  const [timePeriod, setTimePeriod] = useState<'7days' | '30days'>('7days');

  const summaryData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysInPeriod = timePeriod === '7days' ? 7 : 30;
    const periodStartDate = new Date(today);
    periodStartDate.setDate(today.getDate() - (daysInPeriod - 1));
    periodStartDate.setHours(0, 0, 0, 0);
    const periodEndDate = new Date(today);
    periodEndDate.setHours(23, 59, 59, 999);

    const newContactsInPeriod = contacts.filter((contact) => {
      const contactCreationDate = new Date(contact.createdAt);
      return (
        contactCreationDate >= periodStartDate &&
        contactCreationDate <= periodEndDate
      );
    }).length;

    const averagePerDay =
      daysInPeriod > 0 ? newContactsInPeriod / daysInPeriod : 0;

    return {
      totalNewContacts: newContactsInPeriod,
      averageNewContactsPerDay: parseFloat(averagePerDay.toFixed(1)),
    };
  }, [contacts, timePeriod]);

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Tillväxt</CardTitle>
        <Select
          value={timePeriod}
          onValueChange={(value) => setTimePeriod(value as '7days' | '30days')}
        >
          <SelectTrigger
            className="focus:ring-ring h-8 w-auto px-3 text-xs focus:ring-1 sm:text-sm"
            aria-label="Välj tillväxtsperiod"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="7days" className="text-xs">
              Senaste 7 dagarna
            </SelectItem>
            <SelectItem value="30days" className="text-xs">
              Senaste 30 dagarna
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{summaryData.totalNewContacts}</div>
        <p className="text-muted-foreground text-xs">
          {summaryData.averageNewContactsPerDay} nya/dag genomsnitt
        </p>
      </CardContent>
    </Card>
  );
}
