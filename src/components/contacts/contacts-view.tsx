'use client';

// * ==========================================================================
// *                       CONTACTS VIEW COMPONENT (Client)
// * ==========================================================================
import { useState } from 'react';
import { Contact } from '@/generated/prisma';
import { PlusCircle } from 'lucide-react'; // Added PlusCircle for button

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button'; // Added Button
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  // Removed DialogTrigger as button is handled here now
} from '@/components/ui/dialog'; // Added Dialog imports

import { ContactList } from './contact-list';
import { DeleteContactFeature } from './delete-contact-feature';
// import { CreateContactFeature } from './create-contact-feature'; // Removed old import
import { CreateContactForm } from './create-contact-form'; // Added new form import
import { UpgradeToProModal } from '@/components/shared/upgrade-to-pro-modal'; // Added upgrade modal import
import { DIALOG_TEXTS } from '@/lib/contacts/constants/contacts'; // Added DIALOG_TEXTS for modal titles/desc

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

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1.5">
            <CardTitle>Kontaktlista</CardTitle>
            <CardDescription>Alla dina kontakter visas nedan.</CardDescription>
          </div>
          {/* Create Contact Button - Triggers handler */}
          <Button onClick={handleCreateClick}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Skapa Ny Kontakt
          </Button>
          {/* Removed old CreateContactFeature component */}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <ContactList
          contacts={initialContacts}
          onDelete={handleDeleteClick}
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
      </CardContent>
    </Card>
  );
}
