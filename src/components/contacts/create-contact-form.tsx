'use client';

// * ==========================================================================
// *                       CREATE CONTACT FORM COMPONENT
// * ==========================================================================
// import { useState, useTransition } from 'react'; // Removed useState
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
// Removed Dialog imports
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

import {
  ContactCreateSchema,
  type ContactCreateInput,
} from '@/lib/contacts/validation/schema';
import { createContact } from '@/lib/contacts/utils/actions'; // Server action
import {
  TOAST_MESSAGES,
  // DIALOG_TEXTS, // Removed DIALOG_TEXTS as header/description is now handled by parent
} from '@/lib/contacts/constants/contacts'; // Import constants

// Removed UpgradeToProModal and VisuallyHidden imports
import { Loader2 } from 'lucide-react'; // Removed PlusCircle as button is now in parent

// **  Props Interface  ** //
interface CreateContactFormProps {
  userId: string;
  onClose: () => void; // Callback to close the dialog/modal
}

// **  CreateContactForm Component  ** //
export function CreateContactForm({ userId, onClose }: CreateContactFormProps) {
  // Removed isOpen state as it's controlled by parent
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<ContactCreateInput>({
    resolver: zodResolver(ContactCreateSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      addressStreet: '',
      addressStreet2: '',
      addressPostalCode: '',
      addressCity: '',
      addressCountry: '',
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
        onClose(); // Close dialog via prop
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
        // Keep dialog open on error?
      }
    });
  };

  // Removed outer Dialog, DialogTrigger, DialogContent, DialogHeader
  // Removed conditional rendering for userIsPro

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
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

        {/* Separator and Optional Address Fields */}
        <div className="space-y-2 pt-4">
          <h4 className="text-muted-foreground text-sm font-medium">
            Adress (Valfri)
          </h4>
          <Separator />
        </div>

        <FormField
          control={form.control}
          name="addressStreet"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gatuadress</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ange gatuadress"
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
          name="addressStreet2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gatuadress 2 (valfri)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ange C/O, lägenhetsnr etc."
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="addressPostalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postnummer</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ange postnummer"
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
            name="addressCity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stad</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ange stad"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="addressCountry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Land</FormLabel>
              <FormControl>
                {/* Maybe use a Select for country later? */}
                <Input
                  placeholder="Ange land"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Changed DialogFooter to a simple div, added explicit Cancel button */}
        <div className="flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose} // Use onClose prop
            disabled={isPending}
          >
            Avbryt
          </Button>
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
        </div>
      </form>
    </Form>
  );
}
