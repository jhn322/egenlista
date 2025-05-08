'use client';

// * ==========================================================================
// *                            CONTACT LIST COMPONENT
// * ==========================================================================
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
import { Contact, ContactType } from '@/generated/prisma';
import { Trash2, MoreVertical, Pencil, StickyNote } from 'lucide-react'; // Icons
import { CONTACT_LIST_EMPTY_STATE } from '@/lib/contacts/constants/contacts'; // Import constants

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// **  Props Interface  ** //
interface ContactListProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (
    contactInfo: Pick<Contact, 'id' | 'firstName' | 'lastName'>
  ) => void;
  onNote: (contact: Contact) => void;
}

// **  Helper function to format ContactType  ** //
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

// **  ContactList Component  ** //
export function ContactList({
  contacts,
  onEdit,
  onDelete,
  onNote,
}: ContactListProps) {
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Namn</TableHead>
            <TableHead className="hidden md:table-cell">E-post</TableHead>
            <TableHead className="hidden lg:table-cell">Telefon</TableHead>
            <TableHead>Typ</TableHead>
            <TableHead className="hidden sm:table-cell">Skapad</TableHead>
            <TableHead className="text-right">Åtgärder</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
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
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Fler åtgärder</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onEdit(contact)}
                      className="cursor-pointer"
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>Redigera</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        onDelete({
                          id: contact.id,
                          firstName: contact.firstName,
                          lastName: contact.lastName,
                        })
                      }
                      className="text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Ta bort</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
