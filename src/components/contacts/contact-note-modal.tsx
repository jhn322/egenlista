// * ============================================================================
// *                        CONTACT NOTE MODAL COMPONENT
// * ============================================================================
'use client';
import { useState, useEffect } from 'react';
import { Contact } from '@/generated/prisma';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Trash2 } from 'lucide-react';

interface ContactNoteModalProps {
  contact: Contact | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userIsPro: boolean;
  onSave?: (note: string) => Promise<void>;
}

export const ContactNoteModal = ({
  contact,
  isOpen,
  onOpenChange,
  userIsPro,
  onSave,
}: ContactNoteModalProps) => {
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const maxLength = userIsPro ? 10000 : 1000;

  useEffect(() => {
    setNote(contact?.note || '');
    setError(null);
  }, [contact, isOpen]);

  const handleSave = async () => {
    if (!contact || !onSave) return;
    setIsSaving(true);
    setError(null);
    try {
      await onSave(note);
      onOpenChange(false);
    } catch {
      setError('Kunde inte spara anteckningen. Försök igen.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = async () => {
    if (!contact || !onSave) return;
    setIsSaving(true);
    setError(null);
    try {
      await onSave('');
      setNote('');
      setIsConfirmOpen(false);
    } catch {
      setError('Kunde inte rensa anteckningen. Försök igen.');
    } finally {
      setIsSaving(false);
    }
  };

  const isOverLimit = note.length > maxLength;
  const hasNote = note.length > 0;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent aria-label="Anteckning för kontakt" className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {contact?.firstName} {contact?.lastName} – Anteckning
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={maxLength}
              rows={8}
              placeholder="Skriv en anteckning i markdown..."
              aria-label="Anteckning"
              disabled={isSaving}
              className="resize-y"
              autoFocus
            />
            <div className="text-muted-foreground flex items-center justify-between text-xs">
              <span>
                {note.length}/{maxLength} tecken
              </span>
              {!userIsPro && note.length > 1000 && (
                <span className="text-destructive font-medium">
                  Max 1000 tecken för gratisanvändare. Uppgradera till Pro för
                  längre anteckningar.
                </span>
              )}
            </div>
            {error && <div className="text-destructive text-sm">{error}</div>}
          </div>
          <DialogFooter className="flex items-center justify-between">
            <div>
              {hasNote && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsConfirmOpen(true)}
                  disabled={isSaving}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Rensa anteckning
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
              >
                Avbryt
              </Button>
              <Button
                onClick={handleSave}
                disabled={
                  isSaving || isOverLimit || note === (contact?.note || '')
                }
                aria-disabled={isSaving || isOverLimit}
                aria-label="Spara anteckning"
              >
                {isSaving ? 'Sparar...' : 'Spara'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rensa anteckning</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground text-sm">
              Är du säker på att du vill rensa denna anteckning? Detta går inte
              att ångra.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmOpen(false)}
              disabled={isSaving}
            >
              Avbryt
            </Button>
            <Button
              variant="destructive"
              onClick={handleClear}
              disabled={isSaving}
            >
              {isSaving ? 'Rensar...' : 'Rensa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
