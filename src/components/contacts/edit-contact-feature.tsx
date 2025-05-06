'use client';

// * ==========================================================================
// *                      EDIT CONTACT FEATURE COMPONENT
// * ==========================================================================
import { useEffect, useTransition } from 'react';
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
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'; // Removed DialogTrigger as it's handled by parent
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'; // Import Select components

import { Contact, ContactType } from '@/generated/prisma';
import {
  ContactUpdateSchema,
  type ContactUpdateInput,
} from '@/lib/contacts/validation/schema';
import { updateContact } from '@/lib/contacts/utils/actions'; // Server action
import {
  TOAST_MESSAGES,
  DIALOG_TEXTS,
} from '@/lib/contacts/constants/contacts'; // Import constants

import { Loader2 } from 'lucide-react';

// ** Props Interface ** //
interface EditContactFeatureProps {
  contactToEdit: Contact | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userIsPro: boolean;
  userId: string;
}

// ** Helper function to format ContactType ** //
function formatContactType(type: ContactType): string {
  switch (type) {
    case ContactType.LEAD:
      return 'Lead';
    case ContactType.CUSTOMER:
      return 'Kund';
    case ContactType.AMBASSADOR:
      return 'Ambassadör';
    default:
      return type;
  }
}

// ** EditContactFeature Component ** //
export function EditContactFeature({
  contactToEdit,
  isOpen,
  onOpenChange,
  userIsPro,
  userId,
}: EditContactFeatureProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ContactUpdateInput>({
    resolver: zodResolver(ContactUpdateSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      type: ContactType.LEAD,
    },
  });

  useEffect(() => {
    if (isOpen && contactToEdit) {
      form.reset({
        firstName: contactToEdit.firstName || '',
        lastName: contactToEdit.lastName || '',
        email: contactToEdit.email || '',
        phone: contactToEdit.phone || '',
        type: contactToEdit.type,
      });
    } else if (!isOpen) {
      form.reset({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        type: ContactType.LEAD,
      });
    }
  }, [isOpen, contactToEdit, form]);

  const onSubmit = (values: ContactUpdateInput) => {
    if (!contactToEdit) return;

    startTransition(async () => {
      try {
        const dataToUpdate: ContactUpdateInput = {};

        if (userIsPro) {
          if (values.firstName !== contactToEdit.firstName)
            dataToUpdate.firstName = values.firstName;
          if (values.lastName !== contactToEdit.lastName)
            dataToUpdate.lastName = values.lastName;
          if (values.email !== contactToEdit.email)
            dataToUpdate.email = values.email;
          if ((values.phone || null) !== contactToEdit.phone)
            dataToUpdate.phone = values.phone ? values.phone : undefined;
        }
        if (values.type !== contactToEdit.type) dataToUpdate.type = values.type;

        if (Object.keys(dataToUpdate).length === 0) {
          toast.info(TOAST_MESSAGES.NO_CHANGES_TO_SAVE);
          onOpenChange(false);
          return;
        }

        await updateContact(contactToEdit.id, userId, dataToUpdate);

        toast.success(TOAST_MESSAGES.CONTACT_UPDATED_SUCCESS_TITLE, {
          description: TOAST_MESSAGES.CONTACT_UPDATED_SUCCESS_DESC(
            `${values.firstName || contactToEdit.firstName} ${
              values.lastName || contactToEdit.lastName
            }`
          ),
        });
        onOpenChange(false);
      } catch (error) {
        let errorMessage = TOAST_MESSAGES.UNKNOWN_ERROR_DESC;
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        toast.error(TOAST_MESSAGES.UPDATE_ERROR_TITLE, {
          description: errorMessage,
        });
        console.error('Error updating contact:', error);
      }
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (isPending) return;
        onOpenChange(open);
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Redigera Kontakt</DialogTitle> {/* Kept in JSX */}
          <DialogDescription>
            {userIsPro
              ? DIALOG_TEXTS.EDIT_CONTACT_PRO_DESCRIPTION
              : DIALOG_TEXTS.EDIT_CONTACT_NON_PRO_DESCRIPTION}{' '}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            {/* FormFields remain unchanged */}
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
                      disabled={!userIsPro || isPending}
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
                      disabled={!userIsPro || isPending}
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
                      disabled={!userIsPro || isPending}
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
                      value={field.value ?? ''}
                      disabled={!userIsPro || isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Typ</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Välj typ" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(ContactType).map((typeValue) => (
                        <SelectItem key={typeValue} value={typeValue}>
                          {formatContactType(typeValue)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isPending}>
                  Avbryt {/* Kept in JSX */}
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sparar... {/* Kept in JSX */}
                  </>
                ) : (
                  'Spara ändringar' /* Kept in JSX */
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
