'use client';

// * ==========================================================================
// *                   DELETE CONTACT CONFIRMATION DIALOG
// * ==========================================================================
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

import { Contact } from '@/generated/prisma';
import { deleteContact } from '@/lib/contacts/utils/actions'; // Import server action
import {
  DIALOG_TEXTS,
  TOAST_MESSAGES,
} from '@/lib/contacts/constants/contacts'; // Import constants

// ** Props Interface ** //
interface DeleteContactFeatureProps {
  contactToDelete: Pick<Contact, 'id' | 'firstName' | 'lastName'> | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string; // Add userId back
}

// ** DeleteContactFeature Component ** //
export function DeleteContactFeature({
  contactToDelete,
  isOpen,
  onOpenChange,
  userId,
}: DeleteContactFeatureProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const contactName = contactToDelete
    ? `${contactToDelete.firstName} ${contactToDelete.lastName}`.trim()
    : 'kontakten';

  const handleConfirmDelete = () => {
    if (!contactToDelete) return;

    startTransition(async () => {
      try {
        const result = await deleteContact(contactToDelete.id, userId);
        if (result.count > 0) {
          toast.success(TOAST_MESSAGES.CONTACT_DELETED_SUCCESS_TITLE, {
            description:
              TOAST_MESSAGES.CONTACT_DELETED_SUCCESS_DESC(contactName),
          });
          router.refresh(); // Refresh data
          onOpenChange(false); // Close dialog on success
        } else {
          toast.error(TOAST_MESSAGES.DELETE_ERROR_TITLE, {
            description: TOAST_MESSAGES.UNKNOWN_ERROR_DESC,
          });
        }
      } catch (error) {
        let errorMessage = TOAST_MESSAGES.UNKNOWN_ERROR_DESC;
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        toast.error(TOAST_MESSAGES.DELETE_ERROR_TITLE, {
          description: errorMessage,
        });
        console.error('Error deleting contact:', error);
        // Optionally keep dialog open on error, or close it:
        // onOpenChange(false);
      }
    });
  };

  // Avoid rendering if not open
  if (!isOpen || !contactToDelete) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{DIALOG_TEXTS.DELETE_CONTACT_TITLE}</DialogTitle>
          <DialogDescription>
            {/* Use a function to insert name if available */}
            {DIALOG_TEXTS.DELETE_CONTACT_DESCRIPTION(contactName)}
          </DialogDescription>
        </DialogHeader>

        {/* No form needed, just footer with actions */}
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isPending}>
              {DIALOG_TEXTS.DELETE_CONTACT_CANCEL_BUTTON}
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive" // Use destructive variant for delete button
            onClick={handleConfirmDelete} // Call internal handler
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {DIALOG_TEXTS.DELETE_CONTACT_PENDING_BUTTON}
              </>
            ) : (
              DIALOG_TEXTS.DELETE_CONTACT_CONFIRM_BUTTON
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
