'use client';

import * as React from 'react';
import { DateRange } from 'react-day-picker';
import { Contact } from '@/generated/prisma';
import { subMonths, startOfDay, endOfDay } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DateRangePicker } from '@/components/contacts/date-range-picker';
import { ContactStats } from '@/components/contacts/contact-stats';
import { ContactsView } from '@/components/contacts/contacts-view';

// **  Props Interface  ** //
interface ContactsPageClientContentProps {
  initialContacts: Contact[];
  userIsPro: boolean;
  userId: string;
}

// **  Helper Function to create default date range  ** //
const getDefaultDateRange = (): DateRange => {
  const toDate = endOfDay(new Date());
  const fromDate = startOfDay(subMonths(new Date(), 1));
  return { from: fromDate, to: toDate };
};

// **  Helper Function  ** //
// Filters contacts based on the provided date range.
const filterContactsByDateRange = (
  contacts: Contact[],
  dateRange: DateRange | undefined
): Contact[] => {
  if (!dateRange?.from) {
    // If no 'from' date is set, return all contacts.
    return contacts;
  }

  const fromDateStart = new Date(dateRange.from);
  // Ensure we compare from the very start of the 'from' day
  if (
    !(
      dateRange.from instanceof Date &&
      dateRange.from.getHours() === 0 &&
      dateRange.from.getMinutes() === 0
    )
  ) {
    fromDateStart.setHours(0, 0, 0, 0);
  }

  const toDateEnd = dateRange.to
    ? new Date(dateRange.to)
    : new Date(dateRange.from);
  // Ensure we compare until the very end of the 'to' day
  if (
    !(
      dateRange.to instanceof Date &&
      dateRange.to.getHours() === 23 &&
      dateRange.to.getMinutes() === 59
    )
  ) {
    toDateEnd.setHours(23, 59, 59, 999);
  }

  return contacts.filter((contact) => {
    if (!contact.createdAt) return false;
    try {
      const contactDate = new Date(contact.createdAt);
      if (isNaN(contactDate.getTime())) return false;
      return contactDate >= fromDateStart && contactDate <= toDateEnd;
    } catch (error) {
      console.error(
        'Invalid date format for contact.createdAt:',
        contact.createdAt,
        error
      );
      return false;
    }
  });
};

// **  ContactsPageClientContent Component  ** //
export function ContactsPageClientContent({
  initialContacts,
  userIsPro,
  userId,
}: ContactsPageClientContentProps) {
  // Initialize dateRange with the last month
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    getDefaultDateRange()
  );
  const [comparisonDateRange, setComparisonDateRange] = React.useState<
    DateRange | undefined
  >(undefined);
  const [showComparison, setShowComparison] = React.useState<boolean>(false);

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  const handleComparisonDateRangeChange = (range: DateRange | undefined) => {
    setComparisonDateRange(range);
  };

  const handleComparisonToggle = (enabled: boolean) => {
    setShowComparison(enabled);
    if (!enabled) {
      // Clear comparison range when toggled off for consistency
      setComparisonDateRange(undefined);
    }
  };

  // Memoize filtered contacts to avoid re-computation on every render unless dependencies change.
  const activeContacts = React.useMemo(() => {
    return filterContactsByDateRange(initialContacts, dateRange);
  }, [initialContacts, dateRange]);

  return (
    <div className="space-y-6">
      {/* Section for Overview and Date Range Picker */}
      <Card>
        <CardHeader className="flex flex-col gap-4 pb-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <CardTitle>Översikt Kontakter</CardTitle>
            <CardDescription>
              Statistik över dina kontakter. Filtrera med datumväljaren.
            </CardDescription>
          </div>
          {/* Container for DateRangePicker to control its alignment and size */}
          <div className="w-full shrink-0 sm:w-auto sm:min-w-[280px] md:min-w-[320px] lg:min-w-[360px]">
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={handleDateRangeChange}
              comparisonDateRange={comparisonDateRange}
              onComparisonDateRangeChange={handleComparisonDateRangeChange}
              showComparison={showComparison}
              onComparisonToggle={handleComparisonToggle}
              className="w-full"
            />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <ContactStats contacts={activeContacts} />
        </CardContent>
      </Card>

      {/* ContactsView will also use the filtered contacts */}
      <ContactsView
        initialContacts={activeContacts}
        userIsPro={userIsPro}
        userId={userId}
      />
    </div>
  );
}
