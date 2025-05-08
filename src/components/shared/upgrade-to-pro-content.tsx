'use client';

// * ==========================================================================
// *                       UPGRADE TO PRO CONTENT COMPONENT
// * ==========================================================================
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ** Props Interface ** //
interface UpgradeToProContentProps {
  // featureTitle: string; // Removed
  // featureDescription: string; // Removed
  // titleId?: string; // Removed
  // descriptionId?: string; // Removed
  actionButtonText?: string;
  onActionButtonClick?: () => void;
  showDismissButton?: boolean; // To optionally show a dismiss/close button if not in a modal
  onDismiss?: () => void; // Action for the dismiss button
}

// ** UpgradeToProContent Component ** //
export function UpgradeToProContent({
  // featureTitle, // Removed
  // featureDescription, // Removed
  // titleId, // Removed
  // descriptionId, // Removed
  actionButtonText = 'Läs mer om PRO',
  onActionButtonClick,
  showDismissButton = false,
  onDismiss,
}: UpgradeToProContentProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <ShieldAlert className="mb-3 h-12 w-12 text-amber-500" />
      {/* Removed h3 and p tags for title/description */}
      {/* <h3 id={titleId} className="text-lg font-semibold">{featureTitle}</h3> */}
      {/* <p id={descriptionId} className="text-muted-foreground mt-1 text-sm">{featureDescription}</p> */}

      {onActionButtonClick && (
        <Button className="mt-4 w-full" onClick={onActionButtonClick}>
          {actionButtonText}
        </Button>
      )}
      {showDismissButton && onDismiss && (
        <Button variant="outline" className="mt-2 w-full" onClick={onDismiss}>
          Stäng
        </Button>
      )}
    </div>
  );
}
