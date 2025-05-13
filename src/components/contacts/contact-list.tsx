'use client';

import { useState, useTransition, useEffect, useRef, useMemo } from 'react';
import { /* useRouter, */ usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import clsx from 'clsx';

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
  StickyNote,
  Save,
  XCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
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
import { ContactPagination } from './contact-pagination';
import { ContactToolbar } from './contact-toolbar';

// **  Component Props Interface  ** //
interface ContactListProps {
  contacts: Contact[];
  onDelete: (
    contactInfo: Pick<Contact, 'id' | 'firstName' | 'lastName'>
  ) => void;
  onNote: (contact: Contact) => void;
  userIsPro: boolean;
  userId: string;
}

type SortConfiguration = {
  column: 'firstName' | 'lastName' | 'email' | 'phone' | 'type' | 'createdAt';
  direction: 'asc' | 'desc';
};

// **  ContactList Component  ** //
export function ContactList({
  contacts,
  onDelete,
  userIsPro,
  userId,
  onNote,
}: ContactListProps) {
  // ** State Variables ** //
  // * ID of the contact currently being edited inline (null if none)
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  // * State for the "Upgrade to PRO" Popover visibility (for non-PRO trying to edit type)
  const [isTypeUpgradePopoverOpen, setIsTypeUpgradePopoverOpen] =
    useState(false);
  // * Transition state for pending server actions (e.g., saving edits)
  const [isPending, startTransition] = useTransition();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    // Get the saved value from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('contactsItemsPerPage');
      return saved ? parseInt(saved, 10) : 25;
    }
    return 25;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<ContactType | 'all'>('all');
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(
    new Set()
  );
  const [sort, setSort] = useState<SortConfiguration>({
    column: 'createdAt',
    direction: 'desc',
  });
  const [highlightedContactId, setHighlightedContactId] = useState<
    string | null
  >(null);

  // ** Refs ** //
  // * Ref for the currently editing table row (for click-outside detection)
  const editRowRef = useRef<HTMLTableRowElement>(null);
  // * Ref for the Select dropdown content (for click-outside / popover interaction)
  const selectContentRef = useRef<HTMLDivElement>(null);
  // * Ref for the main table wrapper div (for click-outside listener attachment)
  const tableWrapperRef = useRef<HTMLDivElement>(null);

  // ** Hooks ** //
  // const router = useRouter();
  const pathname = usePathname();

  // * Form Hook Initialization (react-hook-form)
  const form = useForm<ContactUpdateInput>({
    resolver: zodResolver(ContactUpdateSchema),
    // Default values are set when resetting the form
    defaultValues: {},
  });

  // Filter contacts based on search query and type filter
  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const matchesSearch = searchQuery
        ? `${contact.firstName} ${contact.lastName} ${contact.email} ${contact.phone || ''}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        : true;

      const matchesType = typeFilter === 'all' || contact.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [contacts, searchQuery, typeFilter]);

  const handleSort = (column: SortConfiguration['column']) => {
    setSort((prev) => ({
      column,
      direction:
        prev.column === column && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  // Sort contacts based on current sort configuration
  const sortedAndFilteredContacts = useMemo(() => {
    return [...filteredContacts].sort((a, b) => {
      const modifier = sort.direction === 'desc' ? -1 : 1;

      switch (sort.column) {
        case 'firstName':
          return (
            modifier * (a.firstName || '').localeCompare(b.firstName || '')
          );
        case 'lastName':
          return modifier * (a.lastName || '').localeCompare(b.lastName || '');
        case 'email':
          return modifier * (a.email || '').localeCompare(b.email || '');
        case 'phone':
          return modifier * (a.phone || '').localeCompare(b.phone || '');
        case 'type':
          return modifier * a.type.localeCompare(b.type);
        case 'createdAt':
          return (
            modifier *
            (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          );
        default:
          return 0;
      }
    });
  }, [filteredContacts, sort]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedAndFilteredContacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedContacts = sortedAndFilteredContacts.slice(
    startIndex,
    endIndex
  );

  // Reset to first page when filters change or per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, typeFilter, itemsPerPage]);

  // Save itemsPerPage to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('contactsItemsPerPage', itemsPerPage.toString());
    }
  }, [itemsPerPage]);

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

  // Handle the contact selection
  const handleSelectContact = (contactId: string, checked: boolean) => {
    setSelectedContacts((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(contactId);
      } else {
        next.delete(contactId);
      }
      return next;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedContacts(
        new Set(paginatedContacts.map((contact) => contact.id))
      );
    } else {
      setSelectedContacts(new Set());
    }
  };

  const handleDeselectAll = () => {
    setSelectedContacts(new Set());
  };

  const handleDeleteSelected = () => {
    // Get contact info for selected contacts
    const contactsToDelete = Array.from(selectedContacts).map((id) => {
      const contact = contacts.find((c) => c.id === id);
      if (!contact) throw new Error('Contact not found');
      return {
        id: contact.id,
        firstName: contact.firstName,
        lastName: contact.lastName,
      };
    });

    // Call onDelete for each selected contact
    contactsToDelete.forEach((contact) => onDelete(contact));
    setSelectedContacts(new Set());
  };

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
        const justEditedId = editingContactId;

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
        await updateContact(editingContactId, userId, dataToUpdate, {
          revalidatePath: pathname,
        });

        toast.success(TOAST_MESSAGES.CONTACT_UPDATED_SUCCESS_TITLE, {
          description: TOAST_MESSAGES.CONTACT_UPDATED_SUCCESS_DESC(
            `${values.firstName || contactToEdit.firstName} ${values.lastName || contactToEdit.lastName}`
          ),
        });
        setEditingContactId(null);
        setHighlightedContactId(justEditedId);
        // router.refresh();

        setTimeout(() => {
          setHighlightedContactId(null);
        }, 3000);
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
      <div className="rounded-lg border border-dashed p-8 text-center">
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <ContactToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
          selectedCount={selectedContacts.size}
          onDeleteSelected={handleDeleteSelected}
          onDeselectAll={handleDeselectAll}
        />
        <div className="rounded-lg border" ref={tableWrapperRef}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <input
                    type="checkbox"
                    checked={
                      paginatedContacts.length > 0 &&
                      paginatedContacts.every((contact) =>
                        selectedContacts.has(contact.id)
                      )
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                    aria-label="Välj alla kontakter"
                  />
                </TableHead>
                <TableHead
                  className="w-[200px]"
                  sortable
                  onClick={() => handleSort('firstName')}
                >
                  <div className="flex items-center gap-1">
                    Namn
                    {sort.column === 'firstName' &&
                      (sort.direction === 'desc' ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronUp className="h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead
                  className="hidden md:table-cell"
                  sortable
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center gap-1">
                    E-post
                    {sort.column === 'email' &&
                      (sort.direction === 'desc' ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronUp className="h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead
                  className="hidden lg:table-cell"
                  sortable
                  onClick={() => handleSort('phone')}
                >
                  <div className="flex items-center gap-1">
                    Telefon
                    {sort.column === 'phone' &&
                      (sort.direction === 'desc' ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronUp className="h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead
                  className="w-[120px]"
                  sortable
                  onClick={() => handleSort('type')}
                >
                  <div className="flex items-center gap-1">
                    Typ
                    {sort.column === 'type' &&
                      (sort.direction === 'desc' ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronUp className="h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead
                  className="hidden w-[120px] sm:table-cell"
                  sortable
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center gap-1">
                    Skapad
                    {sort.column === 'createdAt' ? (
                      sort.direction === 'desc' ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronUp className="h-4 w-4" />
                      )
                    ) : (
                      <ChevronDown className="text-muted-foreground/50 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="w-[100px] text-right">Åtgärder</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Map through paginated contacts and render rows */}
              {paginatedContacts.map((contact) =>
                editingContactId === contact.id ? (
                  // *** Editing Row ***
                  <TableRow
                    key={`${contact.id}-editing`}
                    className="bg-muted/30"
                    ref={editRowRef}
                  >
                    {/* ** Checkbox Cell (Edit - Disabled) ** */}
                    <TableCell>
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                        aria-label="Checkbox inaktiverad vid redigering"
                        disabled
                      />
                    </TableCell>
                    {/* ** Name Cell (Edit) ** */}
                    <TableCell>
                      {/* Wrap first and last name fields in a flex container */}
                      <div className="flex items-start gap-2">
                        <FormField
                          name="firstName"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              {' '}
                              {/* Allow field to grow */}
                              {/* Removed mb-2, gap handles spacing */}
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
                            <FormItem className="flex-1">
                              {' '}
                              {/* Allow field to grow */}
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
                      </div>
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
                  <TableRow
                    key={contact.id}
                    className={clsx(
                      'hover:bg-muted/50 transition-colors duration-300',
                      {
                        'pointer-events-none opacity-50 blur-sm':
                          editingContactId && editingContactId !== contact.id,
                        'bg-green-100 dark:bg-green-700/50':
                          contact.id === highlightedContactId,
                      }
                    )}
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedContacts.has(contact.id)}
                        onChange={(e) =>
                          handleSelectContact(contact.id, e.target.checked)
                        }
                        className="h-4 w-4 rounded border-gray-300"
                        aria-label={`Välj ${contact.firstName} ${contact.lastName}`}
                      />
                    </TableCell>
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
                    <TableCell className="flex items-center justify-end gap-2 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={
                          contact.note
                            ? 'Redigera anteckning'
                            : 'Lägg till anteckning'
                        }
                        title={
                          contact.note
                            ? 'Redigera anteckning'
                            : 'Lägg till anteckning'
                        }
                        onClick={() => onNote(contact)}
                        tabIndex={0}
                        className="group relative"
                      >
                        <StickyNote
                          className={
                            contact.note
                              ? 'text-primary fill-primary/20 h-5 w-5'
                              : 'text-muted-foreground h-5 w-5'
                          }
                        />
                        {contact.note && (
                          <span className="absolute top-1 -right-1 flex h-2 w-2">
                            <span className="bg-primary relative inline-flex h-2 w-2 rounded-full"></span>
                          </span>
                        )}
                      </Button>
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
                            className="text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer hover:text-white"
                            disabled={isPending || !!editingContactId}
                          >
                            <Trash2 className="mr-2 h-4 w-4 hover:text-white" />
                            <span>Ta bort</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              )}
              {paginatedContacts.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-muted-foreground h-24 text-center"
                  >
                    Inga kontakter hittades.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <ContactPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </form>
    </Form>
  );
}
