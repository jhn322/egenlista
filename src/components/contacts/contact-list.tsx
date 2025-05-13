'use client';

import { useState, useTransition, useEffect, useRef, useMemo } from 'react';
import { /* useRouter, */ usePathname } from 'next/navigation';
import { toast } from 'sonner';
import clsx from 'clsx';
// import { ZodError } from 'zod'; // Importeras inte direkt, ContactUpdateSchema hanterar det

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
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@/components/ui/popover';
import { UpgradeToProContent } from '@/components/shared/upgrade-to-pro-content';

import { Contact, ContactType } from '@/generated/prisma';
import {
  Trash2,
  MoreVertical,
  StickyNote,
  Loader2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { CONTACT_LIST_EMPTY_STATE } from '@/lib/contacts/constants/contacts';

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
  // DropdownMenuSeparator, // Tas bort om inte "Redigera"-knapp finns kvar
} from '@/components/ui/dropdown-menu';

import { formatContactType } from '@/lib/contacts/utils/formatting';
import { ContactPagination } from './contact-pagination';
import { ContactToolbar } from './contact-toolbar';

// Definiera vilka fält som är redigerbara mer explicit för typkontroll
// Exkluderar fält som inte ska vara direkt redigerbara i tabellen via denna mekanism.
type EditableContactFieldNames = Exclude<
  keyof ContactUpdateInput,
  // Följande fält hanteras eventuellt annorlunda eller inte alls inline
  | 'addressStreet'
  | 'addressStreet2'
  | 'addressPostalCode'
  | 'addressCity'
  | 'addressCountry'
  | 'consents' // consents hanteras typiskt i en mer komplex form
>;

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

export function ContactList({
  contacts,
  onDelete,
  userIsPro,
  userId,
  onNote,
}: ContactListProps) {
  const [editingCell, setEditingCell] = useState<{
    contactId: string;
    fieldName: EditableContactFieldNames;
    originalValue: string | ContactType | null | undefined;
  } | null>(null);
  const [currentCellValue, setCurrentCellValue] = useState<
    string | ContactType
  >('');
  const [isCellSaving, setIsCellSaving] = useState(false);

  const [highlightedContactId, setHighlightedContactId] = useState<
    string | null
  >(null);
  const [isTypeUpgradePopoverOpen, setIsTypeUpgradePopoverOpen] =
    useState(false);
  const [isTypeSelectOpen, setIsTypeSelectOpen] = useState(false);
  const [, startTransition] = useTransition(); // isPending används inte direkt här, men startTransition behövs
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(() => {
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

  const selectContentRef = useRef<HTMLDivElement>(null);
  const recentlyEditedIdRef = useRef<string | null>(null);
  const currentEditingInputRef = useRef<HTMLInputElement | null>(null);
  const typeCellPopoverAnchorRef = useRef<HTMLTableCellElement | null>(null); // Specifik ref för Typ-cellens popover

  const pathname = usePathname();

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

  const totalPages = Math.ceil(sortedAndFilteredContacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedContacts = sortedAndFilteredContacts.slice(
    startIndex,
    endIndex
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, typeFilter, itemsPerPage]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('contactsItemsPerPage', itemsPerPage.toString());
    }
  }, [itemsPerPage]);

  useEffect(() => {
    if (
      recentlyEditedIdRef.current &&
      contacts.some((c) => c.id === recentlyEditedIdRef.current)
    ) {
      const idToHighlight = recentlyEditedIdRef.current;
      setHighlightedContactId(idToHighlight);
      recentlyEditedIdRef.current = null;
      const timer = setTimeout(() => {
        setHighlightedContactId(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [contacts]);

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
    const contactsToDelete = Array.from(selectedContacts).map((id) => {
      const contact = contacts.find((c) => c.id === id);
      if (!contact) throw new Error('Contact not found');
      return {
        id: contact.id,
        firstName: contact.firstName,
        lastName: contact.lastName,
      };
    });
    contactsToDelete.forEach((contact) => onDelete(contact));
    setSelectedContacts(new Set());
  };

  const handleCellClick = (
    contact: Contact,
    fieldName: EditableContactFieldNames
  ) => {
    console.log('handleCellClick', {
      isTypeSelectOpen,
      isTypeUpgradePopoverOpen,
      isCellSaving,
      editingCell,
      contactId: contact.id,
      fieldName,
    });

    if (isCellSaving) return;

    if (
      editingCell &&
      (editingCell.contactId !== contact.id ||
        editingCell.fieldName !== fieldName)
    ) {
      handleCellSave();
    }

    if (
      editingCell &&
      editingCell.contactId === contact.id &&
      editingCell.fieldName === fieldName
    ) {
      if (fieldName === 'type' && !isTypeSelectOpen) {
        setIsTypeSelectOpen(true);
      }
      return;
    }

    const rawOriginalValue = contact[fieldName];

    let typedOriginalValueForState: string | ContactType | null | undefined;
    let cellValueForInput: string | ContactType;

    if (fieldName === 'type') {
      typedOriginalValueForState = rawOriginalValue as ContactType | undefined;
      cellValueForInput = typedOriginalValueForState ?? contact.type;

      if (!userIsPro) {
        setIsTypeUpgradePopoverOpen(true);
      }
      setIsTypeSelectOpen(true);
    } else {
      typedOriginalValueForState = rawOriginalValue as
        | string
        | null
        | undefined;
      cellValueForInput = typedOriginalValueForState ?? '';
      if (isTypeSelectOpen) setIsTypeSelectOpen(false);
    }

    setEditingCell({
      contactId: contact.id,
      fieldName: fieldName,
      originalValue: typedOriginalValueForState,
    });
    setCurrentCellValue(cellValueForInput);
  };

  const handleCellValueChange = (value: string | ContactType) => {
    setCurrentCellValue(value);
  };

  const handleCellSave = async () => {
    if (!editingCell) return;

    const { contactId, fieldName, originalValue } = editingCell;
    let valueForUpdate: string | null | ContactType = currentCellValue;

    const previouslyEditingCell = editingCell;
    setEditingCell(null);
    if (previouslyEditingCell.fieldName === 'type') {
      setIsTypeSelectOpen(false);
    }

    if (
      fieldName === 'phone' &&
      typeof valueForUpdate === 'string' &&
      valueForUpdate.trim() === ''
    ) {
      valueForUpdate = null;
    }

    if (
      String(valueForUpdate ?? '').trim() === String(originalValue ?? '').trim()
    ) {
      return;
    }

    let schemaPartToValidate;
    switch (fieldName) {
      case 'firstName':
        schemaPartToValidate = ContactUpdateSchema.pick({ firstName: true });
        break;
      case 'lastName':
        schemaPartToValidate = ContactUpdateSchema.pick({ lastName: true });
        break;
      case 'email':
        schemaPartToValidate = ContactUpdateSchema.pick({ email: true });
        break;
      case 'phone':
        schemaPartToValidate = ContactUpdateSchema.pick({ phone: true });
        break;
      case 'type':
        schemaPartToValidate = ContactUpdateSchema.pick({ type: true });
        break;
      default:
        toast.error('Okänt fält för validering.');
        setEditingCell(previouslyEditingCell);
        return;
    }

    const validationResult = schemaPartToValidate.safeParse({
      [fieldName]: valueForUpdate,
    });

    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      toast.error(`Ogiltigt värde: ${firstError.message}`);
      setEditingCell(previouslyEditingCell);
      if (currentEditingInputRef.current)
        currentEditingInputRef.current.focus();
      return;
    }

    if (
      fieldName === 'type' &&
      !userIsPro &&
      valueForUpdate !== originalValue
    ) {
      toast.info('Du måste vara PRO för att ändra kontakttypen.');
      setEditingCell(null);
      return;
    }

    setIsCellSaving(true);
    startTransition(async () => {
      try {
        await updateContact(
          contactId,
          userId,
          { [fieldName]: valueForUpdate } as ContactUpdateInput,
          {
            revalidatePath: pathname,
          }
        );
        toast.success(
          `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} uppdaterad!`
        );
        recentlyEditedIdRef.current = contactId;
      } catch (error) {
        toast.error(`Kunde inte uppdatera ${fieldName}.`);
        console.error(`Error updating ${fieldName}:`, error);
      }
      setIsCellSaving(false);
    });
  };

  const handleCellKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleCellSave();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      if (editingCell?.fieldName === 'type') {
        setIsTypeSelectOpen(false);
      }
      setEditingCell(null);
    }
  };

  useEffect(() => {
    if (
      editingCell &&
      currentEditingInputRef.current &&
      editingCell.fieldName !== 'type'
    ) {
      currentEditingInputRef.current.focus();
      if (
        currentEditingInputRef.current.type === 'text' ||
        currentEditingInputRef.current.type === 'email' ||
        currentEditingInputRef.current.type === 'tel'
      ) {
        currentEditingInputRef.current.select();
      }
    }
  }, [editingCell]);

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

  return (
    <div className="w-full space-y-4">
      <ContactToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        selectedCount={selectedContacts.size}
        onDeleteSelected={handleDeleteSelected}
        onDeselectAll={handleDeselectAll}
      />
      <div className="rounded-lg border">
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
                className="w-[150px]"
                onClick={() => handleSort('firstName')}
              >
                <div className="flex cursor-pointer items-center gap-1">
                  Förnamn
                  {sort.column === 'firstName' &&
                    (sort.direction === 'desc' ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronUp className="h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead
                className="w-[150px]"
                onClick={() => handleSort('lastName')}
              >
                <div className="flex cursor-pointer items-center gap-1">
                  Efternamn
                  {sort.column === 'lastName' &&
                    (sort.direction === 'desc' ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronUp className="h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead
                className="hidden md:table-cell"
                onClick={() => handleSort('email')}
              >
                <div className="flex cursor-pointer items-center gap-1">
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
                onClick={() => handleSort('phone')}
              >
                <div className="flex cursor-pointer items-center gap-1">
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
                onClick={() => handleSort('type')}
              >
                <div className="flex cursor-pointer items-center gap-1">
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
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex cursor-pointer items-center gap-1">
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
            {paginatedContacts.map((contact) => {
              return (
                <TableRow
                  key={contact.id}
                  className={clsx('transition-colors duration-300', {
                    'bg-green-100 dark:bg-green-700/50':
                      contact.id === highlightedContactId,
                    'opacity-60':
                      isCellSaving && editingCell?.contactId === contact.id,
                  })}
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
                      disabled={!!editingCell || isCellSaving}
                    />
                  </TableCell>

                  <TableCell
                    onClick={() => handleCellClick(contact, 'firstName')}
                    className="hover:bg-muted/20 cursor-pointer p-2"
                  >
                    {editingCell?.contactId === contact.id &&
                    editingCell?.fieldName === 'firstName' ? (
                      <div className="flex items-center gap-1">
                        <Input
                          ref={currentEditingInputRef}
                          type="text"
                          value={currentCellValue as string}
                          onChange={(e) =>
                            handleCellValueChange(e.target.value)
                          }
                          onBlur={handleCellSave}
                          onKeyDown={handleCellKeyDown}
                          className="h-8 min-w-0 flex-grow text-sm"
                          disabled={isCellSaving}
                        />
                        {isCellSaving &&
                          editingCell.contactId === contact.id &&
                          editingCell.fieldName === 'firstName' && (
                            <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin" />
                          )}
                      </div>
                    ) : (
                      <div className="truncate font-medium">
                        {contact.firstName}
                      </div>
                    )}
                  </TableCell>

                  <TableCell
                    onClick={() => handleCellClick(contact, 'lastName')}
                    className="hover:bg-muted/20 cursor-pointer p-2"
                  >
                    {editingCell?.contactId === contact.id &&
                    editingCell?.fieldName === 'lastName' ? (
                      <div className="flex items-center gap-1">
                        <Input
                          ref={currentEditingInputRef}
                          type="text"
                          value={currentCellValue as string}
                          onChange={(e) =>
                            handleCellValueChange(e.target.value)
                          }
                          onBlur={handleCellSave}
                          onKeyDown={handleCellKeyDown}
                          className="h-8 min-w-0 flex-grow text-sm"
                          disabled={isCellSaving}
                        />
                        {isCellSaving &&
                          editingCell.contactId === contact.id &&
                          editingCell.fieldName === 'lastName' && (
                            <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin" />
                          )}
                      </div>
                    ) : (
                      <div className="truncate font-medium">
                        {contact.lastName}
                      </div>
                    )}
                  </TableCell>

                  <TableCell
                    className="hover:bg-muted/20 hidden cursor-pointer p-2 md:table-cell"
                    onClick={() => handleCellClick(contact, 'email')}
                  >
                    {editingCell?.contactId === contact.id &&
                    editingCell?.fieldName === 'email' ? (
                      <div className="flex items-center gap-1">
                        <Input
                          ref={currentEditingInputRef}
                          type="email"
                          value={currentCellValue as string}
                          onChange={(e) =>
                            handleCellValueChange(e.target.value)
                          }
                          onBlur={handleCellSave}
                          onKeyDown={handleCellKeyDown}
                          className="h-8 min-w-0 flex-grow text-sm"
                          disabled={isCellSaving}
                        />
                        {isCellSaving &&
                          editingCell.contactId === contact.id &&
                          editingCell.fieldName === 'email' && (
                            <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin" />
                          )}
                      </div>
                    ) : (
                      <div className="truncate">{contact.email}</div>
                    )}
                  </TableCell>

                  <TableCell
                    className="hover:bg-muted/20 hidden cursor-pointer p-2 lg:table-cell"
                    onClick={() => handleCellClick(contact, 'phone')}
                  >
                    {editingCell?.contactId === contact.id &&
                    editingCell?.fieldName === 'phone' ? (
                      <div className="flex items-center gap-1">
                        <Input
                          ref={currentEditingInputRef}
                          type="tel"
                          value={currentCellValue as string}
                          onChange={(e) =>
                            handleCellValueChange(e.target.value)
                          }
                          onBlur={handleCellSave}
                          onKeyDown={handleCellKeyDown}
                          className="h-8 min-w-0 flex-grow text-sm"
                          disabled={isCellSaving}
                          placeholder="Telefon (valfri)"
                        />
                        {isCellSaving &&
                          editingCell.contactId === contact.id &&
                          editingCell.fieldName === 'phone' && (
                            <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin" />
                          )}
                      </div>
                    ) : (
                      <div className="truncate">{contact.phone || '-'}</div>
                    )}
                  </TableCell>

                  <TableCell
                    className="hover:bg-muted/20 cursor-pointer p-2"
                    onClick={() => handleCellClick(contact, 'type')}
                    ref={typeCellPopoverAnchorRef}
                  >
                    <Popover
                      open={
                        isTypeUpgradePopoverOpen &&
                        editingCell?.contactId === contact.id &&
                        editingCell?.fieldName === 'type' &&
                        !userIsPro
                      }
                      onOpenChange={(openState) => {
                        if (!openState) {
                          // setIsTypeUpgradePopoverOpen(false);
                        }
                      }}
                    >
                      <PopoverAnchor asChild>
                        <div>
                          {editingCell?.contactId === contact.id &&
                          editingCell?.fieldName === 'type' ? (
                            <Select
                              open={isTypeSelectOpen}
                              onOpenChange={(openState) => {
                                setIsTypeSelectOpen(openState);
                                if (!userIsPro && openState) {
                                  setIsTypeUpgradePopoverOpen(true);
                                }
                                if (
                                  !openState &&
                                  editingCell?.contactId === contact.id &&
                                  editingCell?.fieldName === 'type'
                                ) {
                                  if (userIsPro) {
                                    if (
                                      currentCellValue !==
                                      editingCell.originalValue
                                    ) {
                                      handleCellSave();
                                    } else {
                                      setEditingCell(null);
                                    }
                                  } else {
                                    setEditingCell(null);
                                  }
                                }
                              }}
                              value={currentCellValue as ContactType}
                              onValueChange={(value) => {
                                handleCellValueChange(value as ContactType);
                              }}
                              disabled={
                                isCellSaving ||
                                (!userIsPro &&
                                  currentCellValue !== contact.type)
                              }
                            >
                              <SelectTrigger className="h-8 min-w-[100px] text-sm">
                                <SelectValue placeholder="Välj typ" />
                              </SelectTrigger>
                              <SelectContent ref={selectContentRef}>
                                {Object.values(ContactType).map((typeValue) => (
                                  <SelectItem
                                    key={typeValue}
                                    value={typeValue}
                                    className="text-sm"
                                    disabled={
                                      !userIsPro && typeValue !== contact.type
                                    }
                                  >
                                    {formatContactType(typeValue)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
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
                          )}
                        </div>
                      </PopoverAnchor>
                      <PopoverContent
                        className="w-auto p-4"
                        side="top"
                        align="center"
                      >
                        <UpgradeToProContent
                          onActionButtonClick={() => {
                            setIsTypeUpgradePopoverOpen(false);
                          }}
                          showDismissButton={true}
                          onDismiss={() => setIsTypeUpgradePopoverOpen(false)}
                        />
                      </PopoverContent>
                    </Popover>
                  </TableCell>

                  <TableCell className="hidden p-2 sm:table-cell">
                    {new Date(contact.createdAt).toLocaleDateString('sv-SE')}
                  </TableCell>

                  <TableCell className="flex items-center justify-end gap-1 p-2">
                    {' '}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onNote(contact)}
                      tabIndex={0}
                      className="group relative"
                      disabled={!!editingCell || isCellSaving}
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
                          disabled={!!editingCell || isCellSaving}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            onDelete({
                              id: contact.id,
                              firstName: contact.firstName,
                              lastName: contact.lastName,
                            })
                          }
                          className="text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer hover:text-white"
                          disabled={!!editingCell || isCellSaving}
                        >
                          <Trash2 className="mr-2 h-4 w-4 hover:text-white" />
                          <span>Ta bort</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
            {paginatedContacts.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
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
    </div>
  );
}
