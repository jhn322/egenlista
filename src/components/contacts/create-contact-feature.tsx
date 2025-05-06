'use client';

// * ==========================================================================
// *                     CREATE CONTACT FEATURE COMPONENT
// * ==========================================================================
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import {
  ContactCreateSchema,
  type ContactCreateInput,
} from '@/lib/contacts/validation/schema';
import { createContact } from '@/lib/contacts/utils/actions'; // Server action
import {
  TOAST_MESSAGES,
  DIALOG_TEXTS,
} from '@/lib/contacts/constants/contacts'; // Import constants

import { PlusCircle, ShieldAlert, Loader2 } from 'lucide-react';

// **  Props Interface  ** //
interface CreateContactFeatureProps {
  userIsPro: boolean;
  userId: string;
}

// **  CreateContactFeature Component  ** //
export function CreateContactFeature({
  userIsPro,
  userId,
}: CreateContactFeatureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<ContactCreateInput>({
    resolver: zodResolver(ContactCreateSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
  });

  const onSubmit = (values: ContactCreateInput) => {
    startTransition(async () => {
      try {
        const newContact = await createContact(values, userId);
        toast.success(TOAST_MESSAGES.CONTACT_CREATED_SUCCESS_TITLE, {
          description: TOAST_MESSAGES.CONTACT_CREATED_SUCCESS_DESC(
            `${newContact.firstName} ${newContact.lastName}`
          ),
        });
        form.reset(); // Reset form fields
        setIsOpen(false); // Close dialog
        router.refresh(); // Refresh data on the page
      } catch (error) {
        let errorMessage = TOAST_MESSAGES.UNKNOWN_ERROR_DESC;
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        toast.error(TOAST_MESSAGES.CREATE_ERROR_TITLE, {
          description: errorMessage,
        });
        console.error('Error creating contact:', error);
      }
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (isPending) return; // Prevent closing while submitting
        setIsOpen(open);
        if (!open) form.reset(); // Reset form if dialog is closed manually
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Skapa Ny Kontakt
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {userIsPro ? 'Skapa Ny Kontakt' : 'PRO Funktion'}
          </DialogTitle>
          <DialogDescription>
            {userIsPro
              ? DIALOG_TEXTS.CREATE_CONTACT_PRO_DESCRIPTION
              : DIALOG_TEXTS.CREATE_CONTACT_NON_PRO_DESCRIPTION}
          </DialogDescription>
        </DialogHeader>

        {userIsPro ? (
          // ** PRO User: Show Contact Creation Form ** //
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 py-4"
            >
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Förnamn</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ange förnamn"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Efternamn</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ange efternamn"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-post</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Ange e-postadress"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefon (valfri)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ange telefonnummer"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline" disabled={isPending}>
                    Avbryt
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sparar...
                    </>
                  ) : (
                    'Spara Kontakt'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          // ** Non-PRO User: Show Upgrade Message ** //
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center text-center">
              <ShieldAlert className="mb-3 h-12 w-12 text-amber-500" />
              <p className="font-semibold">
                {DIALOG_TEXTS.CREATE_CONTACT_UPGRADE_PROMPT_TITLE}
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                {DIALOG_TEXTS.CREATE_CONTACT_UPGRADE_PROMPT_DESCRIPTION}
              </p>
            </div>
            <Button className="w-full" onClick={() => setIsOpen(false)}>
              Läs mer om PRO
            </Button>
            <DialogFooter className="pt-4 sm:justify-center">
              <DialogClose asChild>
                <Button variant="outline">Stäng</Button>
              </DialogClose>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
