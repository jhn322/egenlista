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
import { Trash2, ShieldAlert } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
      onOpenChange(false);
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
        <DialogContent
          aria-label="Anteckning för kontakt"
          className="max-w-4xl"
        >
          <DialogHeader>
            <DialogTitle>
              {contact?.firstName} {contact?.lastName} – Anteckning
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <div data-color-mode="light">
              <MDEditor
                value={note}
                onChange={(value) => {
                  const newValue = value || '';
                  if (newValue.length <= (userIsPro ? maxLength : 1200)) {
                    setNote(newValue);
                  }
                }}
                preview="edit"
                height={400}
                textareaProps={{
                  placeholder: 'Skriv en anteckning...',
                  disabled: isSaving,
                }}
                className="!border-input"
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span
                className={
                  !userIsPro && note.length > 1000
                    ? 'text-destructive font-semibold'
                    : 'text-muted-foreground'
                }
              >
                {note.length}/{maxLength} tecken
              </span>
            </div>
            {/* Show yellow Pro info box only when free user exceeds 1000 chars */}
            {!userIsPro && note.length > 1000 && (
              <div className="mt-1 flex flex-col items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                <div className="mb-1 flex items-center gap-2">
                  <ShieldAlert className="h-6 w-6 text-amber-500" />
                  <span className="font-semibold">PRO-funktion</span>
                </div>
                <div className="text-center leading-tight">
                  Max <span className="font-semibold">1000</span> tecken för
                  gratisanvändare. Uppgradera till{' '}
                  <span className="font-semibold">PRO</span> för att spara
                  längre anteckningar.
                  <br />
                  <Button
                    variant="link"
                    className="px-0 text-amber-700 hover:text-amber-900"
                    onClick={() => window.open('/pro', '_blank')}
                  >
                    Läs mer om PRO
                  </Button>
                </div>
              </div>
            )}
            {error && <div className="text-destructive text-sm">{error}</div>}
          </div>
          <DialogFooter className="flex items-center justify-between">
            <div>
              {hasNote && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
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
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Rensa hela anteckningen permanent.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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
                  isSaving ||
                  isOverLimit ||
                  (!userIsPro && note.length > 1000) ||
                  note === (contact?.note || '')
                }
                aria-disabled={
                  isSaving || isOverLimit || (!userIsPro && note.length > 1000)
                }
                aria-label="Spara anteckning"
              >
                {!userIsPro && note.length > 1000
                  ? 'Uppgradera till Pro'
                  : isSaving
                    ? 'Sparar...'
                    : 'Spara'}
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
