'use client';

// * ==========================================================================
// *                       CONTACTS VIEW COMPONENT (Client)
// * ==========================================================================
import { useState } from 'react';
import { Contact } from '@/generated/prisma';

import { ContactList } from './contact-list';
import { EditContactFeature } from './edit-contact-feature';
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
  // State for the contact currently being edited
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  // State to control the edit dialog's visibility
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Handler function passed to ContactList
  const handleEditClick = (contact: Contact) => {
    setEditingContact(contact); // Set the contact to edit
    setIsEditDialogOpen(true); // Open the dialog
  };

  // Handler for closing/changing the dialog state, passed to EditContactFeature
  const handleEditDialogChange = (open: boolean) => {
    setIsEditDialogOpen(open);
    if (!open) {
      // Clear the editing contact when the dialog closes
      setEditingContact(null);
    }
  };

  // TODO: Implement delete confirmation and action
  const handleDeleteClick = (contactId: string) => {
    console.log('Attempting to delete contact:', contactId);
    // Confirmation dialog logic would go here
    // Then call deleteContact server action
  };

  return (
    <div className="space-y-6">
      {/* Pass handleEditClick to ContactList */}
      <ContactList
        contacts={initialContacts} // Use the server-fetched contacts initially
        onEdit={handleEditClick} // Pass the edit handler
        onDelete={handleDeleteClick} // Pass the delete handler (placeholder)
      />

      {/* Edit Contact Modal (controlled by this component's state) */}
      <EditContactFeature
        contactToEdit={editingContact}
        isOpen={isEditDialogOpen}
        onOpenChange={handleEditDialogChange}
        userIsPro={userIsPro}
        userId={userId}
      />

      {/* TODO: Add Delete Confirmation Dialog here */}
    </div>
  );
}
