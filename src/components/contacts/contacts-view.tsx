'use client';

// * ==========================================================================
// *                       CONTACTS VIEW COMPONENT (Client)
// * ==========================================================================
import { useState } from 'react';
import { Contact } from '@/generated/prisma';

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
          contacts={initialContacts}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
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
      </CardContent>
    </Card>
  );
}
