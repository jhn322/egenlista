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
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/contacts/date-range-picker';
import { ContactStats } from '@/components/contacts/contact-stats';
import { ContactsView } from './contacts-view';
import { ContactGrowthDisplay } from './contact-growth-display';

// **  Props Interface - most props are derived for ContactsView  ** //
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
  if (!dateRange || !dateRange.from) {
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
  // State for toggling all contacts in the list
  const [showAllContactsInList, setShowAllContactsInList] =
    React.useState<boolean>(false); // Default to false (show date-filtered)

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    setShowAllContactsInList(false);
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

  // Handler to clear the date range
  const handleClearDateRange = () => {
    setDateRange(undefined);
    // When clearing date range, the list should show all contacts
    setShowAllContactsInList(true);
  };

  // Memoize filtered contacts to avoid re-computation on every render unless dependencies change.
  const contactsForStats = React.useMemo(() => {
    return filterContactsByDateRange(initialContacts, dateRange);
  }, [initialContacts, dateRange]);

  // Contacts for the list
  const contactsForList = React.useMemo(() => {
    if (showAllContactsInList) {
      return initialContacts;
    }
    return filterContactsByDateRange(initialContacts, dateRange);
  }, [initialContacts, dateRange, showAllContactsInList]);

  // Get the individual stat cards from ContactStats
  const statCards = ContactStats({ contacts: contactsForStats });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 pb-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <CardTitle>Översikt Kontakter</CardTitle>
            <CardDescription>
              Statistik över dina kontakter. Filtrera med datumväljaren eller
              visa alla.
            </CardDescription>
          </div>
          <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto lg:flex-row-reverse lg:items-center lg:gap-2">
            <div className="w-full md:min-w-[320px] lg:w-auto lg:min-w-[280px]">
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
            {dateRange && (
              <Button
                variant="outline"
                onClick={handleClearDateRange}
                className="w-full text-xs whitespace-nowrap sm:text-sm lg:w-auto"
              >
                Rensa filter & Visa alla kontakter
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {/* Stats and growth grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {statCards.map((card, index) => (
              <React.Fragment key={index}>{card}</React.Fragment>
            ))}
            <ContactGrowthDisplay contacts={contactsForStats} />
          </div>
        </CardContent>
      </Card>

      <ContactsView
        initialContacts={contactsForList}
        userIsPro={userIsPro}
        userId={userId}
        showAllContactsInList={showAllContactsInList}
        onShowAllContactsInListChange={setShowAllContactsInList}
        isDateRangeActive={!!dateRange}
      />
    </div>
  );
}
