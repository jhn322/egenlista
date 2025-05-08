'use client';

// * ==========================================================================
// *                            CONTACT LIST COMPONENT
// * ==========================================================================
// * This component displays a list of contacts in a table, allowing for
// * inline editing and deletion of contacts. It handles different states
// * for PRO and non-PRO users regarding editing capabilities.
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

// **  Component Props Interface  ** //
interface ContactListProps {
  contacts: Contact[];
  onDelete: (
    contactInfo: Pick<Contact, 'id' | 'firstName' | 'lastName'>
  ) => void;
  userIsPro: boolean;
  userId: string;
}

// **  ContactList Component  ** //
export function ContactList({
  contacts,
  onDelete,
  userIsPro,
  userId,
}: ContactListProps) {
  // ** State Variables ** //
  // * ID of the contact currently being edited inline (null if none)
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  // * State for the "Upgrade to PRO" Popover visibility (for non-PRO trying to edit type)
  const [isTypeUpgradePopoverOpen, setIsTypeUpgradePopoverOpen] =
    useState(false);
  // * Transition state for pending server actions (e.g., saving edits)
  const [isPending, startTransition] = useTransition();

  // ** Refs ** //
  // * Ref for the currently editing table row (for click-outside detection)
  const editRowRef = useRef<HTMLTableRowElement>(null);
  // * Ref for the Select dropdown content (for click-outside / popover interaction)
  const selectContentRef = useRef<HTMLDivElement>(null);
  // * Ref for the main table wrapper div (for click-outside listener attachment)
  const tableWrapperRef = useRef<HTMLDivElement>(null);

  // ** Hooks ** //
  const router = useRouter();

  // * Form Hook Initialization (react-hook-form)
  const form = useForm<ContactUpdateInput>({
    resolver: zodResolver(ContactUpdateSchema),
    // Default values are set when resetting the form
    defaultValues: {},
  });

  // * Effect: Reset Form on Edit Change
  // * Populates the form with the selected contact's data when editing starts,
  // * or clears the form when editing stops.
  useEffect(() => {
    if (editingContactId) {
      const contactToEdit = contacts.find((c) => c.id === editingContactId);
      if (contactToEdit) {
        // console.log('Setting form values:', contactToEdit); // Debug
        form.reset({
          firstName: contactToEdit.firstName || '',
          lastName: contactToEdit.lastName || '',
          email: contactToEdit.email || '',
          phone: contactToEdit.phone || '',
          type: contactToEdit.type,
        });
      }
    } else {
      form.reset({}); // Reset to empty or default values if needed
    }
  }, [editingContactId, contacts, form]);

  // * Effect: Click Outside Detection
  // * Adds a listener to detect clicks outside the editing row and associated portals
  // * (Select dropdown, Popover) to cancel the editing state.
  useEffect(() => {
    if (!editingContactId) return; // Only run if editing

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const rowNode = editRowRef.current;
      const wrapperNode = tableWrapperRef.current;
      if (!rowNode || !wrapperNode) return;

      const isInsideRow = rowNode.contains(target);

      // If click is outside the row, check if it's also outside relevant portals
      if (!isInsideRow) {
        const selectContentNode = selectContentRef.current;
        const popoverContentNode = document.querySelector(
          '[data-slot="popover-content"]'
        );
        const isInsideSelect =
          selectContentNode && selectContentNode.contains(target);
        const isInsidePopover =
          popoverContentNode && popoverContentNode.contains(target);

        // Cancel edit only if click is outside row AND outside Select/Popover portals
        if (!isInsideSelect && !isInsidePopover) {
          setEditingContactId(null);
        }
      }
    };

    const currentWrapper = tableWrapperRef.current;
    if (currentWrapper) {
      currentWrapper.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup listener on component unmount or when editingContactId changes
    return () => {
      if (currentWrapper) {
        currentWrapper.removeEventListener('mousedown', handleClickOutside);
      }
    };
  }, [editingContactId]);

  // ** Event Handlers ** //

  // * Start editing a specific contact
  const handleEditClick = (contact: Contact) => {
    setEditingContactId(contact.id);
  };

  // * Cancel the current inline edit
  const handleCancelEdit = () => {
    setEditingContactId(null);
  };

  // * Handle Form Submission (Save Changes)
  const onSubmit = (values: ContactUpdateInput) => {
    if (!editingContactId) return;
    const contactToEdit = contacts.find((c) => c.id === editingContactId);
    if (!contactToEdit) return;

    startTransition(async () => {
      try {
        const dataToUpdate: ContactUpdateInput = {};

        // Determine changed fields (respecting PRO status for certain fields)
        if (values.firstName !== contactToEdit.firstName)
          dataToUpdate.firstName = values.firstName;
        if (values.lastName !== contactToEdit.lastName)
          dataToUpdate.lastName = values.lastName;
        if (values.email !== contactToEdit.email)
          dataToUpdate.email = values.email;
        if ((values.phone || null) !== contactToEdit.phone)
          dataToUpdate.phone = values.phone ? values.phone : undefined;
        if (userIsPro && values.type !== contactToEdit.type) {
          dataToUpdate.type = values.type;
        } else if (!userIsPro && values.type !== contactToEdit.type) {
          // Prevent non-PRO type change attempt (should be blocked by UI but safeguard here)
          toast.info('Kontakttypen kan endast ändras av PRO-användare.');
        }

        // Only submit if there are actual changes
        if (Object.keys(dataToUpdate).length === 0) {
          toast.info(TOAST_MESSAGES.NO_CHANGES_TO_SAVE);
          setEditingContactId(null);
          return;
        }

        // Call server action to update
        await updateContact(editingContactId, userId, dataToUpdate);

        toast.success(TOAST_MESSAGES.CONTACT_UPDATED_SUCCESS_TITLE, {
          description: TOAST_MESSAGES.CONTACT_UPDATED_SUCCESS_DESC(
            `${values.firstName || contactToEdit.firstName} ${values.lastName || contactToEdit.lastName}`
          ),
        });
        setEditingContactId(null); // Exit edit mode on success
        router.refresh();
      } catch (error) {
        let errorMessage = TOAST_MESSAGES.UNKNOWN_ERROR_DESC;
        if (error instanceof Error) errorMessage = error.message;
        toast.error(TOAST_MESSAGES.UPDATE_ERROR_TITLE, {
          description: errorMessage,
        });
        console.error('Error updating contact inline:', error);
      }
    });
  };

  // ** Render Logic ** //

  // * Empty State: Render if no contacts are provided
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

  // * Main Table Structure
  return (
    <Form {...form}>
      {' '}
      {/* Form provider from react-hook-form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="rounded-md border" ref={tableWrapperRef}>
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
              {/* Map through contacts and render rows */}
              {contacts.map((contact) =>
                editingContactId === contact.id ? (
                  // *** Editing Row ***
                  <TableRow
                    key={`${contact.id}-editing`}
                    className="bg-muted/30"
                    ref={editRowRef}
                  >
                    {/* ** Name Cell (Edit) ** */}
                    <TableCell>
                      <FormField
                        name="firstName"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className="mb-2">
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
                        name="lastName"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
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
                    {/* ** Email Cell (Edit) ** */}
                    <TableCell className="hidden md:table-cell">
                      <FormField
                        name="email"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
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
                    {/* ** Phone Cell (Edit) ** */}
                    <TableCell className="hidden lg:table-cell">
                      <FormField
                        name="phone"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
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
                    {/* ** Type Cell (Edit) with Popover for non-PRO ** */}
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
                                  // Logic to prevent closing popover when interacting inside SelectContent
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
                                    }
                                  }
                                  setIsTypeUpgradePopoverOpen(popoverOpenState);
                                }}
                              >
                                <PopoverAnchor asChild>
                                  <div className="relative">
                                    {' '}
                                    {/* Wrapper for potential styling/positioning */}
                                    <Select
                                      onValueChange={(value) => {
                                        // Conditional onValueChange for PRO
                                        if (
                                          (value === '' ||
                                            value === undefined ||
                                            value === null) &&
                                          field.value
                                        )
                                          return; // Ignore initial empty call
                                        field.onChange(value);
                                      }}
                                      {...(userIsPro
                                        ? {}
                                        : { onValueChange: undefined })}
                                      value={field.value}
                                      disabled={isPending}
                                      onOpenChange={(selectOpenState) => {
                                        // Open popover for non-PRO
                                        if (selectOpenState && !userIsPro) {
                                          setIsTypeUpgradePopoverOpen(true);
                                        }
                                      }}
                                    >
                                      <FormControl>
                                        <SelectTrigger
                                          className={`h-8 text-sm`}
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
                                              } // Disable options for non-PRO
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
                                  {/* Popover content: Title/Desc + Upgrade Button */}
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
                                      // router.push('/pris');
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
                    {/* ** Created At Cell (Edit - Display Only) ** */}
                    <TableCell className="hidden pt-3 align-top sm:table-cell">
                      {new Date(contact.createdAt).toLocaleDateString('sv-SE')}
                    </TableCell>
                    {/* ** Actions Cell (Edit - Save/Cancel) ** */}
                    <TableCell className="pt-1.5 text-right align-top">
                      <div className="flex items-center justify-end space-x-1">
                        {/* Save Button */}
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
                        {/* Cancel Button */}
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
                  // *** Display Row ***
                  <TableRow key={contact.id}>
                    {/* ** Name Cell (Display) ** */}
                    <TableCell>
                      <div className="font-medium">
                        {contact.firstName} {contact.lastName}
                      </div>
                      <div className="text-muted-foreground text-sm md:hidden">
                        {contact.email}
                      </div>
                    </TableCell>
                    {/* ** Email Cell (Display) ** */}
                    <TableCell className="hidden md:table-cell">
                      {contact.email}
                    </TableCell>
                    {/* ** Phone Cell (Display) ** */}
                    <TableCell className="hidden lg:table-cell">
                      {contact.phone || '-'}
                    </TableCell>
                    {/* ** Type Cell (Display) ** */}
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
                    {/* ** Created At Cell (Display) ** */}
                    <TableCell className="hidden sm:table-cell">
                      {new Date(contact.createdAt).toLocaleDateString('sv-SE')}
                    </TableCell>
                    {/* ** Actions Cell (Display - Edit/Delete Menu) ** */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isPending || !!editingContactId}
                          >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Fler åtgärder</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {/* Edit Action */}
                          <DropdownMenuItem
                            onClick={() => handleEditClick(contact)}
                            className="cursor-pointer"
                            disabled={isPending || !!editingContactId}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Redigera</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {/* Delete Action */}
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
