'use client';

// * ==========================================================================
// *                            CONTACT LIST COMPONENT
// * ==========================================================================
import { useState, useTransition, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { UpgradeToProContent } from '@/components/shared/upgrade-to-pro-content';

import { Contact, ContactType } from '@/generated/prisma';
import {
  Trash2,
  MoreVertical,
  Pencil,
  Save,
  XCircle,
  Loader2,
} from 'lucide-react';
import {
  CONTACT_LIST_EMPTY_STATE,
  TOAST_MESSAGES,
} from '@/lib/contacts/constants/contacts';

import {
  ContactUpdateSchema,
  type ContactUpdateInput,
} from '@/lib/contacts/validation/schema';
import { updateContact } from '@/lib/contacts/utils/actions';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import { formatContactType } from '@/lib/contacts/utils/formatting';

// **  Props Interface  ** //
interface ContactListProps {
  contacts: Contact[];
  // onEdit: (contact: Contact) => void; // Removed onEdit
  onDelete: (
    contactInfo: Pick<Contact, 'id' | 'firstName' | 'lastName'>
  ) => void;
  userIsPro: boolean; // Added userIsPro
  userId: string; // Added userId
}

// **  ContactList Component  ** //
export function ContactList({
  contacts,
  onDelete,
  userIsPro,
  userId,
}: ContactListProps) {
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [isTypeUpgradePopoverOpen, setIsTypeUpgradePopoverOpen] =
    useState(false);
  const [isPending, startTransition] = useTransition();
  const selectContentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
    if (editingContactId) {
      const contactToEdit = contacts.find((c) => c.id === editingContactId);
      if (contactToEdit) {
        form.reset({
          firstName: contactToEdit.firstName || '',
          lastName: contactToEdit.lastName || '',
          email: contactToEdit.email || '',
          phone: contactToEdit.phone || '',
          type: contactToEdit.type,
        });
      }
    } else {
      form.reset({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        type: ContactType.LEAD,
      });
    }
  }, [editingContactId, contacts, form]);

  const handleEditClick = (contact: Contact) => {
    setEditingContactId(contact.id);
  };

  const handleCancelEdit = () => {
    setEditingContactId(null);
  };

  const onSubmit = (values: ContactUpdateInput) => {
    if (!editingContactId) return;

    const contactToEdit = contacts.find((c) => c.id === editingContactId);
    if (!contactToEdit) return;

    startTransition(async () => {
      try {
        const dataToUpdate: ContactUpdateInput = {};

        // Non-PRO users can now edit these fields
        if (values.firstName !== contactToEdit.firstName)
          dataToUpdate.firstName = values.firstName;
        if (values.lastName !== contactToEdit.lastName)
          dataToUpdate.lastName = values.lastName;
        if (values.email !== contactToEdit.email)
          dataToUpdate.email = values.email;
        if ((values.phone || null) !== contactToEdit.phone)
          dataToUpdate.phone = values.phone ? values.phone : undefined;

        // Type can only be updated by PRO users
        if (userIsPro && values.type !== contactToEdit.type) {
          dataToUpdate.type = values.type;
        } else if (!userIsPro && values.type !== contactToEdit.type) {
          // Optionally inform user or log if they are non-PRO and type somehow changed in form
          // This should ideally be prevented by the UI (disabled select)
          toast.info('Kontakttypen kan endast ändras av PRO-användare.');
        }

        if (Object.keys(dataToUpdate).length === 0) {
          toast.info(TOAST_MESSAGES.NO_CHANGES_TO_SAVE);
          setEditingContactId(null);
          return;
        }

        await updateContact(editingContactId, userId, dataToUpdate);

        toast.success(TOAST_MESSAGES.CONTACT_UPDATED_SUCCESS_TITLE, {
          description: TOAST_MESSAGES.CONTACT_UPDATED_SUCCESS_DESC(
            `${values.firstName || contactToEdit.firstName} ${
              values.lastName || contactToEdit.lastName
            }`
          ),
        });
        setEditingContactId(null);
        router.refresh(); // Refresh data on the page
      } catch (error) {
        let errorMessage = TOAST_MESSAGES.UNKNOWN_ERROR_DESC;
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        toast.error(TOAST_MESSAGES.UPDATE_ERROR_TITLE, {
          description: errorMessage,
        });
        console.error('Error updating contact inline:', error);
      }
    });
  };

  if (!contacts || contacts.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center">
        <h3 className="text-lg font-semibold">
          {CONTACT_LIST_EMPTY_STATE.TITLE}
        </h3>
        <p className="text-muted-foreground text-sm">
          {CONTACT_LIST_EMPTY_STATE.DESCRIPTION}
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Namn</TableHead>
                <TableHead className="hidden md:table-cell">E-post</TableHead>
                <TableHead className="hidden lg:table-cell">Telefon</TableHead>
                <TableHead className="w-[120px]">Typ</TableHead>
                <TableHead className="hidden w-[120px] sm:table-cell">
                  Skapad
                </TableHead>
                <TableHead className="w-[100px] text-right">Åtgärder</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) =>
                editingContactId === contact.id ? (
                  // * Editing Row
                  <TableRow
                    key={`${contact.id}-editing`}
                    className="bg-muted/30"
                  >
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem className="mb-2">
                            {/* <FormLabel className="sr-only">Förnamn</FormLabel> */}
                            <FormControl>
                              <Input
                                placeholder="Förnamn"
                                {...field}
                                disabled={isPending}
                                className="h-8 text-sm"
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            {/* <FormLabel className="sr-only">Efternamn</FormLabel> */}
                            <FormControl>
                              <Input
                                placeholder="Efternamn"
                                {...field}
                                disabled={isPending}
                                className="h-8 text-sm"
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            {/* <FormLabel className="sr-only">E-post</FormLabel> */}
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="E-post"
                                {...field}
                                disabled={isPending}
                                className="h-8 text-sm"
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            {/* <FormLabel className="sr-only">Telefon</FormLabel> */}
                            <FormControl>
                              <Input
                                placeholder="Telefon (valfri)"
                                {...field}
                                value={field.value ?? ''}
                                disabled={isPending}
                                className="h-8 text-sm"
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => {
                          return (
                            <FormItem>
                              <Popover
                                open={isTypeUpgradePopoverOpen}
                                onOpenChange={(popoverOpenState) => {
                                  if (!popoverOpenState) {
                                    const selectContentNode =
                                      selectContentRef.current;
                                    const activeElement =
                                      document.activeElement;

                                    if (
                                      selectContentNode &&
                                      activeElement &&
                                      selectContentNode.contains(activeElement)
                                    ) {
                                      return;
                                    } else {
                                    }
                                  }
                                  setIsTypeUpgradePopoverOpen(popoverOpenState);
                                }}
                              >
                                <PopoverAnchor asChild>
                                  <div
                                    className="relative"
                                    onClick={() => {
                                      if (!userIsPro) {
                                        setIsTypeUpgradePopoverOpen(true);
                                      }
                                    }}
                                  >
                                    <Select
                                      onValueChange={(value) => {
                                        if (
                                          (value === '' ||
                                            value === undefined ||
                                            value === null) &&
                                          field.value
                                        ) {
                                          return;
                                        }
                                        field.onChange(value);
                                      }}
                                      value={field.value}
                                      disabled={isPending}
                                      onOpenChange={(selectOpenState) => {
                                        if (selectOpenState && !userIsPro) {
                                          setIsTypeUpgradePopoverOpen(true);
                                        }
                                      }}
                                    >
                                      <FormControl>
                                        <SelectTrigger
                                          className={`h-8 text-sm`}
                                          aria-disabled={!userIsPro}
                                        >
                                          <SelectValue placeholder="Välj typ" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent ref={selectContentRef}>
                                        {Object.values(ContactType).map(
                                          (typeValue) => (
                                            <SelectItem
                                              key={typeValue}
                                              value={typeValue}
                                              className="text-sm"
                                              disabled={
                                                !userIsPro &&
                                                typeValue !== field.value
                                              }
                                            >
                                              {formatContactType(typeValue)}
                                            </SelectItem>
                                          )
                                        )}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </PopoverAnchor>

                                <PopoverContent
                                  className="w-auto p-4"
                                  side="top"
                                  align="center"
                                >
                                  <div className="space-y-2 text-center">
                                    <h3 className="text-sm font-semibold">
                                      Ändra Kontakttyp
                                    </h3>
                                    <p className="text-muted-foreground text-sm">
                                      För att kunna ändra kontakttypen behöver
                                      du uppgradera till PRO.
                                    </p>
                                  </div>
                                  <UpgradeToProContent
                                    onActionButtonClick={() => {
                                      setIsTypeUpgradePopoverOpen(false);
                                    }}
                                    showDismissButton={true}
                                    onDismiss={() =>
                                      setIsTypeUpgradePopoverOpen(false)
                                    }
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell className="hidden pt-3 align-top sm:table-cell">
                      {new Date(contact.createdAt).toLocaleDateString('sv-SE')}
                    </TableCell>
                    <TableCell className="pt-1.5 text-right align-top">
                      <div className="flex items-center justify-end space-x-1">
                        <Button
                          type="submit"
                          variant="ghost"
                          size="icon"
                          disabled={isPending}
                          title="Spara ändringar"
                        >
                          {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4 text-green-600" />
                          )}
                          <span className="sr-only">Spara</span>
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={handleCancelEdit}
                          disabled={isPending}
                          title="Avbryt redigering"
                        >
                          <XCircle className="h-4 w-4 text-red-600" />
                          <span className="sr-only">Avbryt</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  // * Display Row
                  <TableRow key={contact.id}>
                    <TableCell>
                      <div className="font-medium">
                        {contact.firstName} {contact.lastName}
                      </div>
                      <div className="text-muted-foreground text-sm md:hidden">
                        {contact.email}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {contact.email}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {contact.phone || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          contact.type === ContactType.CUSTOMER
                            ? 'default'
                            : contact.type === ContactType.AMBASSADOR
                              ? 'outline'
                              : 'secondary'
                        }
                      >
                        {formatContactType(contact.type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {new Date(contact.createdAt).toLocaleDateString('sv-SE')}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={
                              isPending && editingContactId === contact.id
                            }
                          >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Fler åtgärder</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEditClick(contact)}
                            className="cursor-pointer"
                            disabled={isPending || !!editingContactId}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Redigera</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              onDelete({
                                id: contact.id,
                                firstName: contact.firstName,
                                lastName: contact.lastName,
                              })
                            }
                            className="text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer"
                            disabled={isPending || !!editingContactId}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Ta bort</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </div>
      </form>
    </Form>
  );
}
