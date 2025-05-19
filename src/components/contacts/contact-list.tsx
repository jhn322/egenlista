'use client';

import { useState, useTransition, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
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

import { Contact as PrismaContact, ContactType } from '@/generated/prisma';
import { DotsVerticalIcon } from '@/components/icons/dots-vertical-icon';
import { PencilEditIcon } from '@/components/icons/pencil-edit-icon';
import { NoteIcon } from '@/components/icons/note-icon';
import { SaveIcon } from '@/components/icons/save-icon';
import { XCircleIcon } from '@/components/icons/x-circle-icon';
import { ChevronDownIcon } from '@/components/icons/chevron-down-icon';
import { ChevronUpIcon } from '@/components/icons/chevron-up-icon';
import {
  CONTACT_LIST_EMPTY_STATE,
  TOAST_MESSAGES,
  NEW_CONTACT_THRESHOLD_DAYS,
  NEW_CONTACT_BADGE_TEXT,
  TOOLTIP_NEW_CONTACT,
} from '@/lib/contacts/constants/contacts';

import {
  ContactUpdateSchema,
  type ContactUpdateInput,
} from '@/lib/contacts/validation/schema';
import { updateContact } from '@/lib/contacts/utils/actions';
import { markContactAsViewed } from '@/lib/interactions/actions';

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
import { Checkbox } from '@/components/ui/checkbox';
import { getContactTypeColorValue } from '@/lib/contacts/constants/contact-charts-constants';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { TrashIcon } from '@/components/icons/trash-icon';
import { LoadingCircleIcon } from '@/components/icons/loading-circle-icon';

export interface ContactWithInteractions extends PrismaContact {
  interactions: Array<{ lastViewedAt: Date | null }>;
}

// **  Component Props Interface  ** //
interface ContactListProps {
  contacts: ContactWithInteractions[]; // Use the extended type
  onDelete: (
    contactInfo: Pick<PrismaContact, 'id' | 'firstName' | 'lastName'>
  ) => void;
  onNote: (contact: ContactWithInteractions) => void; // Use the extended type
  userIsPro: boolean;
  userId: string; // Still needed for some operations, though interaction uses session
  showAllContactsInList: boolean;
  onShowAllContactsInListChange: (showAll: boolean) => void;
  isDateRangeActive: boolean;
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
  showAllContactsInList,
  onShowAllContactsInListChange,
  isDateRangeActive,
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
  const [successfullyUpdatedContactId, setSuccessfullyUpdatedContactId] =
    useState<string | null>(null);

  // ** Refs ** //
  // * Ref for the currently editing table row (for click-outside detection)
  const editRowRef = useRef<HTMLTableRowElement>(null);
  // * Ref for the Select dropdown content (for click-outside / popover interaction)
  const selectContentRef = useRef<HTMLDivElement>(null);
  // * Ref for the main table wrapper div (for click-outside listener attachment)
  const tableWrapperRef = useRef<HTMLDivElement>(null);

  // ** Hooks ** //
  const router = useRouter();

  // * Helper function to check if a contact is new based on interaction and age
  const isContactNew = (contact: ContactWithInteractions): boolean => {
    // 1. If there is an interaction record for the current user, it's NOT new.
    if (contact.interactions && contact.interactions.length > 0) {
      return false;
    }

    // 2. If no interaction, check its age. If older than threshold, it's NOT new.
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - NEW_CONTACT_THRESHOLD_DAYS);
    const contactCreationDate = new Date(contact.createdAt);

    if (contactCreationDate < threshold) {
      return false;
    }

    // 3. Otherwise (no interaction AND within threshold), it IS new.
    return true;
  };

  // * Form Hook Initialization (react-hook-form)
  const form = useForm<ContactUpdateInput>({
    resolver: zodResolver(ContactUpdateSchema),
    // Default values are set when resetting the form
    defaultValues: {},
  });

  // useEffect to 'prune' selectedContacts when the main contacts list changes
  useEffect(() => {
    const currentContactIds = new Set(contacts.map((c) => c.id));
    setSelectedContacts((prevSelected) => {
      const newSelected = new Set<string>();
      for (const id of prevSelected) {
        if (currentContactIds.has(id)) {
          newSelected.add(id);
        }
      }
      return newSelected;
    });
  }, [contacts]);

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

  // * Effect: Clear Success Highlight
  // * Clears the successfully updated contact ID after a short delay.
  useEffect(() => {
    if (successfullyUpdatedContactId) {
      const timer = setTimeout(() => {
        setSuccessfullyUpdatedContactId(null);
      }, 3000); // Highlight duration: 3 seconds
      return () => clearTimeout(timer);
    }
  }, [successfullyUpdatedContactId]);

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
  const handleEditClick = (contact: ContactWithInteractions) => {
    setEditingContactId(contact.id);
    // Mark as viewed when edit is clicked
    startTransition(async () => {
      const result = await markContactAsViewed(contact.id);
      if (!result.success) {
        toast.error('Fel', {
          description: result.message || 'Kunde inte markera kontakt som sedd.',
        });
      }
    });
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
        setSuccessfullyUpdatedContactId(editingContactId); // Highlight the row
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
          showAllContactsInList={showAllContactsInList}
          onShowAllContactsInListChange={onShowAllContactsInListChange}
          isDateRangeActive={isDateRangeActive}
        />
        <div className="rounded-lg border" ref={tableWrapperRef}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={
                      paginatedContacts.length > 0 &&
                      paginatedContacts.every((contact) =>
                        selectedContacts.has(contact.id)
                      )
                    }
                    onCheckedChange={(checkedState) => {
                      handleSelectAll(!!checkedState);
                    }}
                    aria-label="Välj alla kontakter"
                  />
                </TableHead>
                <TableHead
                  className="w-[200px]"
                  sortable
                  onClick={() => handleSort('firstName')}
                >
                  <div className="flex items-center gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>Namn</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Sortera på namn</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {sort.column === 'firstName' &&
                      (sort.direction === 'desc' ? (
                        <ChevronDownIcon className="h-4 w-4" />
                      ) : (
                        <ChevronUpIcon className="h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead
                  className="hidden md:table-cell"
                  sortable
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>E-post</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Sortera på e-post</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {sort.column === 'email' &&
                      (sort.direction === 'desc' ? (
                        <ChevronDownIcon className="h-4 w-4" />
                      ) : (
                        <ChevronUpIcon className="h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead
                  className="hidden lg:table-cell"
                  sortable
                  onClick={() => handleSort('phone')}
                >
                  <div className="flex items-center gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>Telefon</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Sortera på telefon</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {sort.column === 'phone' &&
                      (sort.direction === 'desc' ? (
                        <ChevronDownIcon className="h-4 w-4" />
                      ) : (
                        <ChevronUpIcon className="h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead
                  className="w-[120px]"
                  sortable
                  onClick={() => handleSort('type')}
                >
                  <div className="flex items-center gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>Typ</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Sortera på typ</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {sort.column === 'type' &&
                      (sort.direction === 'desc' ? (
                        <ChevronDownIcon className="h-4 w-4" />
                      ) : (
                        <ChevronUpIcon className="h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead
                  className="hidden w-[120px] sm:table-cell"
                  sortable
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>Skapad</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Sortera på skapandedatum</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {sort.column === 'createdAt' ? (
                      sort.direction === 'desc' ? (
                        <ChevronDownIcon className="h-4 w-4" />
                      ) : (
                        <ChevronUpIcon className="h-4 w-4" />
                      )
                    ) : (
                      <ChevronDownIcon className="text-muted-foreground/50 h-4 w-4" />
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
                    className="animate-in fade-in bg-blue-50 duration-200 ease-out dark:bg-blue-950/30"
                    ref={editRowRef}
                  >
                    {/* Empty cell for checkbox alignment */}
                    <TableCell />
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
                                  className="bg-card h-8 text-sm"
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
                                  className="bg-card h-8 text-sm"
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
                                className="bg-card h-8 text-sm"
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
                                className="bg-card h-8 text-sm"
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
                                          className={`bg-card h-8 text-sm`}
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
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="submit"
                                variant="ghost"
                                size="icon"
                                disabled={isPending}
                              >
                                {isPending ? (
                                  <LoadingCircleIcon className="h-4 w-4 animate-spin" />
                                ) : (
                                  <SaveIcon className="h-4 w-4 text-green-600" />
                                )}
                                <span className="sr-only">Spara</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Spara ändringar</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        {/* Cancel Button */}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={handleCancelEdit}
                                disabled={isPending}
                              >
                                <XCircleIcon className="h-4 w-4 text-red-600" />
                                <span className="sr-only">Avbryt</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Avbryt redigering</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  // *** Display Row ***
                  <TableRow
                    key={contact.id}
                    onClick={(event) => {
                      if (editingContactId) return;

                      const target = event.target as HTMLElement;
                      // Check if the click was on specific interactive child elements.
                      const wasCheckboxClicked =
                        target.closest('[role="checkbox"]');
                      const wasNoteButtonClicked = target.closest(
                        'button[aria-label*="anteckning"]'
                      );
                      const wasActionsDropdownTriggered = target.closest(
                        'button[aria-haspopup="menu"]'
                      );

                      if (
                        wasCheckboxClicked ||
                        wasNoteButtonClicked ||
                        wasActionsDropdownTriggered ||
                        target.closest('[role="menuitem"]')
                      ) {
                        return;
                      }

                      // If the contact is currently considered "new" and not being edited,
                      // then mark it as viewed.
                      if (isContactNew(contact)) {
                        startTransition(async () => {
                          const result = await markContactAsViewed(contact.id);
                          if (!result.success) {
                            toast.error('Fel', {
                              description:
                                result.message ||
                                'Kunde inte uppdatera visningsstatus.',
                            });
                          }
                        });
                      }
                    }}
                    className={clsx(
                      'cursor-default transition-all duration-500 ease-in-out',
                      {
                        'hover:bg-muted/50':
                          successfullyUpdatedContactId !== contact.id, // Only apply hover if not success-highlighted
                        'bg-green-100 dark:bg-green-900/30':
                          successfullyUpdatedContactId === contact.id, // Success highlight
                        'pointer-events-none opacity-50 blur-sm':
                          editingContactId && editingContactId !== contact.id, // Dim other rows when editing
                      }
                    )}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedContacts.has(contact.id)}
                        onCheckedChange={(checkedState) => {
                          handleSelectContact(contact.id, !!checkedState);
                        }}
                        aria-label={`Välj ${contact.firstName} ${contact.lastName}`}
                      />
                    </TableCell>
                    {/* ** Name Cell (Display) ** */}
                    <TableCell>
                      <div className="font-medium">
                        {contact.firstName} {contact.lastName}
                        {isContactNew(contact) && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge
                                  variant="outline"
                                  className="border-primary text-primary ml-2"
                                  aria-label="Ny kontakt"
                                >
                                  {NEW_CONTACT_BADGE_TEXT}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{TOOLTIP_NEW_CONTACT}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
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
                        style={{
                          backgroundColor: getContactTypeColorValue(
                            contact.type
                          ),
                          color: 'white',
                        }}
                        className="px-2 py-0.5 text-xs font-medium"
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
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={
                                contact.note
                                  ? 'Redigera anteckning'
                                  : 'Lägg till anteckning'
                              }
                              onClick={() => onNote(contact)}
                              tabIndex={0}
                              className="group relative"
                            >
                              <NoteIcon
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
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {contact.note
                                ? 'Visa/redigera anteckning'
                                : 'Lägg till anteckning'}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <DropdownMenu>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  disabled={isPending || !!editingContactId}
                                >
                                  <DotsVerticalIcon className="h-4 w-4" />
                                  <span className="sr-only">Fler åtgärder</span>
                                </Button>
                              </DropdownMenuTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Fler åtgärder</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <DropdownMenuContent align="end">
                          {/* Edit Action */}
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <DropdownMenuItem
                                  onClick={() => handleEditClick(contact)}
                                  className="cursor-pointer"
                                  disabled={isPending || !!editingContactId}
                                >
                                  <PencilEditIcon className="mr-2 h-4 w-4" />
                                  <span>Redigera</span>
                                </DropdownMenuItem>
                              </TooltipTrigger>
                              <TooltipContent side="left" align="center">
                                <p>Redigera kontaktuppgifter</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <DropdownMenuSeparator />
                          {/* Delete Action */}
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
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
                                  <TrashIcon className="mr-2 h-4 w-4 hover:text-white" />
                                  <span>Ta bort</span>
                                </DropdownMenuItem>
                              </TooltipTrigger>
                              <TooltipContent side="left" align="center">
                                <p>Ta bort kontakt permanent</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
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
