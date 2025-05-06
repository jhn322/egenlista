'use client';

// * ==========================================================================
// *                       CONTACTS VIEW COMPONENT (Client)
// * ==========================================================================
import { useState } from 'react';
import { Contact } from '@/generated/prisma';

import { ContactList } from './contact-list';
import { EditContactFeature } from './edit-contact-feature';
import { DeleteContactFeature } from './delete-contact-feature';
// We might also move ContactStats and CreateContactFeature here if needed,
// but for now, let's keep them separate in the Page component.

// ** Props Interface ** //
interface ContactsViewProps {
  initialContacts: Contact[]; // Contacts fetched on the server
  userIsPro: boolean;
  userId: string;
}

// ** ContactsView Component ** //
export function ContactsView({
  initialContacts,
  userIsPro,
  userId,
}: ContactsViewProps) {
  // State for managing the currently selected contact for editing
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // State for managing the currently selected contact for deletion
  const [deletingContact, setDeletingContact] = useState<Pick<
    Contact,
    'id' | 'firstName' | 'lastName'
  > | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Handler for when the edit button is clicked in the list
  const handleEditClick = (contact: Contact) => {
    setEditingContact(contact); // Set the contact to edit
    setIsEditDialogOpen(true); // Open the edit dialog
  };

  // Handler for when the delete button is clicked in the list
  const handleDeleteClick = (
    contactInfo: Pick<Contact, 'id' | 'firstName' | 'lastName'>
  ) => {
    console.log('Delete requested for:', contactInfo);
    setDeletingContact(contactInfo); // Set the contact to delete
    setIsDeleteDialogOpen(true); // Open the delete confirmation dialog
  };

  return (
    <div className="space-y-4">
      <ContactList
        contacts={initialContacts} // Use initialContacts directly
        onEdit={handleEditClick}
        onDelete={handleDeleteClick} // Pass the new handler
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
    </div>
  );
}
