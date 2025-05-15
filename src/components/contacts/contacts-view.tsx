'use client';

// * ==========================================================================
// *                       CONTACTS VIEW COMPONENT (Client)
// * ==========================================================================
import { useState, useEffect } from 'react';
import { Contact } from '@/generated/prisma';
import { PlusCircle, Download, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { DateRange } from 'react-day-picker';
import { startOfDay, endOfDay } from 'date-fns';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { ContactList } from './contact-list';
import { DeleteContactFeature } from './delete-contact-feature';
// import { CreateContactFeature } from './create-contact-feature'; // Removed old import
import { CreateContactForm } from './create-contact-form';
import { UpgradeToProModal } from '@/components/shared/upgrade-to-pro-modal';
import { DIALOG_TEXTS } from '@/lib/contacts/constants/contacts'; // Added DIALOG_TEXTS for modal titles/desc
import { ContactNoteModal } from './contact-note-modal';
import { exportContactsToCSV } from '@/lib/contacts/utils/actions';
import { ContactCharts } from './contact-charts';
import { QRCodeModal } from '@/components/qr-code/qr-code-modal';

// ** Props Interface ** //
interface ContactsViewProps {
  initialContacts: Contact[];
  userIsPro: boolean;
  userId: string;
  showAllContactsInList: boolean;
  onShowAllContactsInListChange: (showAll: boolean) => void;
  isDateRangeActive: boolean;
  dateRange?: DateRange;
  comparisonDateRange?: DateRange;
}

// ** ContactsView Component ** //
export function ContactsView({
  initialContacts,
  userIsPro,
  userId,
  showAllContactsInList,
  onShowAllContactsInListChange,
  isDateRangeActive,
  dateRange,
  comparisonDateRange,
}: ContactsViewProps) {
  const [deletingContact, setDeletingContact] = useState<Pick<
    Contact,
    'id' | 'firstName' | 'lastName'
  > | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  // State for note modal
  const [noteContact, setNoteContact] = useState<Contact | null>(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  // State for controlling the dialogs
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  // useEffect to update local contacts state when initialContacts prop changes
  useEffect(() => {
    setContacts(initialContacts);
  }, [initialContacts]);

  const handleDeleteClick = (
    contactInfo: Pick<Contact, 'id' | 'firstName' | 'lastName'>
  ) => {
    setDeletingContact(contactInfo);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateClick = () => {
    if (userIsPro) {
      setIsCreateDialogOpen(true);
    } else {
      setIsUpgradeModalOpen(true);
    }
  };

  const handleNoteClick = (contact: Contact) => {
    setNoteContact(contact);
    setIsNoteModalOpen(true);
  };

  const handleNoteSave = async (note: string) => {
    if (!noteContact) return;
    const contactId = noteContact.id;
    try {
      const res = await fetch(`/api/contacts/${contactId}/note`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Kunde inte spara anteckningen.');
      }
      const updatedContact = await res.json();
      setContacts((prev) =>
        prev.map((c) =>
          c.id === contactId
            ? {
                ...c,
                note: updatedContact.note,
                noteUpdatedAt: updatedContact.noteUpdatedAt,
              }
            : c
        )
      );
      if (note) {
        toast.success('Anteckning sparad!');
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Kunde inte spara anteckningen.'
      );
    }
  };

  const handleExportClick = async () => {
    try {
      let exportStartDate: string | undefined = undefined;
      let exportEndDate: string | undefined = undefined;

      // Only apply date filter if a range is active AND showAllContactsInList is false
      if (isDateRangeActive && dateRange?.from && !showAllContactsInList) {
        exportStartDate = startOfDay(dateRange.from).toISOString();
        if (dateRange.to) {
          exportEndDate = endOfDay(dateRange.to).toISOString();
        } else {
          // Single day selection, end of the 'from' day
          exportEndDate = endOfDay(dateRange.from).toISOString();
        }
      }

      const csvContent = await exportContactsToCSV(
        userId,
        exportStartDate,
        exportEndDate
      );

      // Create download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `kontakter-${new Date().toISOString().split('T')[0]}.csv`
      );
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Kontaktlistan har exporterats!');
    } catch (error) {
      toast.error('Kunde inte exportera kontaktlistan');
      console.error('Export error:', error);
    }
  };

  // Determine which contacts to pass to the charts
  const contactsForChart = contacts;

  return (
    <div className="space-y-6">
      {/* Contact Charts */}
      <ContactCharts
        contacts={contactsForChart}
        dateRange={dateRange}
        comparisonDateRange={comparisonDateRange}
      />

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 pb-2 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
            <div className="space-y-1.5">
              <CardTitle>Kontaktlista</CardTitle>
              <CardDescription>
                Sök, filtrera och hantera dina kontakter nedan.
              </CardDescription>
            </div>
            <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center md:justify-end md:gap-2">
              {/* My QR-kode Button using QRCodeModal */}

              <QRCodeModal
                triggerButton={
                  <Button
                    variant="outline"
                    className="w-full md:w-auto"
                    aria-label="Visa min QR-kod"
                  >
                    <QrCode className="mr-2 h-4 w-4" />
                    Min QR-kod
                  </Button>
                }
              />

              {/* Export Button */}
              <Button
                variant="outline"
                onClick={handleExportClick}
                className="w-full md:w-auto"
                aria-label="Exportera kontakter till CSV-fil"
              >
                <Download className="mr-2 h-4 w-4" />
                Exportera CSV
              </Button>
              {/* Create Contact Button */}
              <Button
                onClick={handleCreateClick}
                className="w-full md:w-auto"
                aria-label="Skapa ny kontakt"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Skapa Ny Kontakt
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <ContactList
            contacts={contacts}
            onDelete={handleDeleteClick}
            userIsPro={userIsPro}
            userId={userId}
            onNote={handleNoteClick}
            showAllContactsInList={showAllContactsInList}
            onShowAllContactsInListChange={onShowAllContactsInListChange}
            isDateRangeActive={isDateRangeActive}
          />
        </CardContent>
      </Card>

      {/* Delete Contact Confirmation Dialog */}
      <DeleteContactFeature
        contactToDelete={deletingContact}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        userId={userId}
      />

      {/* Create Contact Dialog (Only for PRO) */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Skapa Ny Kontakt</DialogTitle>
            <DialogDescription>
              {userIsPro
                ? DIALOG_TEXTS.CREATE_CONTACT_PRO_DESCRIPTION
                : DIALOG_TEXTS.CREATE_CONTACT_NON_PRO_DESCRIPTION}
            </DialogDescription>
          </DialogHeader>
          {userIsPro && (
            <CreateContactForm
              userId={userId}
              onClose={() => setIsCreateDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Upgrade to PRO Modal (Only for Non-PRO) */}
      {!userIsPro && (
        <UpgradeToProModal
          isOpen={isUpgradeModalOpen}
          onOpenChange={setIsUpgradeModalOpen}
          featureTitle={DIALOG_TEXTS.CREATE_CONTACT_UPGRADE_PROMPT_TITLE}
          featureDescription={
            DIALOG_TEXTS.CREATE_CONTACT_UPGRADE_PROMPT_DESCRIPTION
          }
        />
      )}

      {/* Note Modal */}
      <ContactNoteModal
        contact={noteContact}
        isOpen={isNoteModalOpen}
        onOpenChange={setIsNoteModalOpen}
        userIsPro={userIsPro}
        onSave={handleNoteSave}
      />
    </div>
  );
}
