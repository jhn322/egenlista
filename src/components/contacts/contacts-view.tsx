'use client';

// * ==========================================================================
// *                       CONTACTS VIEW COMPONENT (Client)
// * ==========================================================================
import { useState } from 'react';
import { Contact } from '@/generated/prisma';
import { PlusCircle, Download } from 'lucide-react';
import { toast } from 'sonner';

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

// ** Props Interface ** //
interface ContactsViewProps {
  initialContacts: Contact[];
  userIsPro: boolean;
  userId: string;
}

// ** ContactsView Component ** //
export function ContactsView({
  initialContacts,
  userIsPro,
  userId,
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
      const data = await res.json();
      setContacts((prev) =>
        prev.map((c) =>
          c.id === contactId
            ? { ...c, note: data.note, noteUpdatedAt: data.noteUpdatedAt }
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
      throw err;
    }
  };

  const handleExportClick = async () => {
    try {
      const csvContent = await exportContactsToCSV(userId);

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

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1.5">
            <CardTitle>Kontaktlista</CardTitle>
            <CardDescription>Alla dina kontakter visas nedan.</CardDescription>
          </div>
          <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center md:justify-end md:gap-2">
            <Button
              variant="outline"
              onClick={handleExportClick}
              className="w-full md:w-auto"
            >
              <Download className="mr-2 h-4 w-4" />
              Exportera CSV
            </Button>
            <Button onClick={handleCreateClick} className="w-full md:w-auto">
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
        />

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
                {DIALOG_TEXTS.CREATE_CONTACT_PRO_DESCRIPTION}
              </DialogDescription>
            </DialogHeader>
            {/* Render form inside */}
            <CreateContactForm
              userId={userId}
              onClose={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Upgrade to PRO Modal (Only for Non-PRO) */}
        <UpgradeToProModal
          isOpen={isUpgradeModalOpen}
          onOpenChange={setIsUpgradeModalOpen}
          featureTitle={DIALOG_TEXTS.CREATE_CONTACT_UPGRADE_PROMPT_TITLE}
          featureDescription={
            DIALOG_TEXTS.CREATE_CONTACT_UPGRADE_PROMPT_DESCRIPTION
          }
          onActionButtonClick={() => {
            // Example: Navigate to pricing page
            // router.push('/pris');
            setIsUpgradeModalOpen(false);
          }}
        />

        {/* Note Modal */}
        <ContactNoteModal
          contact={noteContact}
          isOpen={isNoteModalOpen}
          onOpenChange={setIsNoteModalOpen}
          userIsPro={userIsPro}
          onSave={handleNoteSave}
        />
      </CardContent>
    </Card>
  );
}
