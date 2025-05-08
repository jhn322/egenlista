'use client';

// * ==========================================================================
// *                       UPGRADE TO PRO MODAL COMPONENT
// * ==========================================================================
// import { ShieldAlert } from 'lucide-react';
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
import { UpgradeToProContent } from './upgrade-to-pro-content';

// ** Props Interface ** //
interface UpgradeToProModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  featureTitle: string; // e.g., "Redigera Kontakttyp"
  featureDescription: string; // e.g., "För att kunna ändra kontakttypen behöver du vara PRO-användare."
  actionButtonText?: string; // e.g., "Läs mer om PRO"
  onActionButtonClick?: () => void; // Action for the button, e.g., navigate to pricing page
}

// ** UpgradeToProModal Component ** //
export function UpgradeToProModal({
  isOpen,
  onOpenChange,
  featureTitle,
  featureDescription,
  actionButtonText = 'Läs mer om PRO', // Default button text
  onActionButtonClick,
}: UpgradeToProModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center sm:text-center">
          <DialogTitle>{featureTitle}</DialogTitle>
          <DialogDescription>{featureDescription}</DialogDescription>
        </DialogHeader>
        <div className="pt-2 pb-4">
          <UpgradeToProContent
            actionButtonText={actionButtonText}
            onActionButtonClick={onActionButtonClick}
          />
        </div>

        <DialogFooter className="pt-2 sm:justify-center">
          <DialogClose asChild>
            <Button variant="outline">Stäng</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
