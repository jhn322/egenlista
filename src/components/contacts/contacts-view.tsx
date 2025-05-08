'use client';

// * ==========================================================================
// *                       CONTACTS VIEW COMPONENT (Client)
// * ==========================================================================
import { useState } from 'react';
import { Contact } from '@/generated/prisma';
import { toast } from 'sonner';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'; // Import Card components
import { ContactList } from './contact-list';
import { EditContactFeature } from './edit-contact-feature';
import { DeleteContactFeature } from './delete-contact-feature';
import { CreateContactFeature } from './create-contact-feature';
import { ContactNoteModal } from './contact-note-modal';

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
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [deletingContact, setDeletingContact] = useState<Pick<
    Contact,
    'id' | 'firstName' | 'lastName'
  > | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [noteContact, setNoteContact] = useState<Contact | null>(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  const [contacts, setContacts] = useState<Contact[]>(initialContacts);

  const handleEditClick = (contact: Contact) => {
    setEditingContact(contact);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (
    contactInfo: Pick<Contact, 'id' | 'firstName' | 'lastName'>
  ) => {
    setDeletingContact(contactInfo);
    setIsDeleteDialogOpen(true);
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

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1.5">
            <CardTitle>Kontaktlista</CardTitle>
            <CardDescription>Alla dina kontakter visas nedan.</CardDescription>
          </div>
          <CreateContactFeature userIsPro={userIsPro} userId={userId} />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Contact List - Removed outer div and flex controls from here */}
        <ContactList
          contacts={contacts}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onNote={handleNoteClick}
        />

        {/* Edit Contact Dialog */}
        <EditContactFeature
          contactToEdit={editingContact}
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          userIsPro={userIsPro}
          userId={userId}
        />

        {/* Delete Contact Confirmation Dialog */}
        <DeleteContactFeature
          contactToDelete={deletingContact}
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          userId={userId}
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
