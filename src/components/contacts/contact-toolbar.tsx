'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { ContactType } from '@/generated/prisma';
import { formatContactType } from '@/lib/contacts/utils/formatting';

interface ContactToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  typeFilter: ContactType | 'all';
  onTypeChange: (value: ContactType | 'all') => void;
  selectedCount: number;
  onDeleteSelected: () => void;
  onDeselectAll: () => void;
}

export function ContactToolbar({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeChange,
  selectedCount,
  onDeleteSelected,
  onDeselectAll,
}: ContactToolbarProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap gap-2">
        <Input
          placeholder="Sök kontakter..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-8 min-w-[120px] flex-1 text-xs sm:max-w-[250px] sm:text-sm"
        />
        <Select value={typeFilter} onValueChange={onTypeChange}>
          <SelectTrigger
            className="h-8 w-full text-xs sm:w-[150px] sm:text-sm"
            aria-label="Filtrera efter typ"
          >
            <SelectValue placeholder="Alla typer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="cursor-pointer">
              Alla typer
            </SelectItem>
            {Object.values(ContactType).map((type) => (
              <SelectItem key={type} value={type} className="cursor-pointer">
                {formatContactType(type)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {selectedCount > 0 && (
        <div className="flex h-8 items-center gap-2">
          {selectedCount > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDeselectAll}
              className="flex items-center"
              aria-label="Avmarkera alla valda kontakter"
            >
              Avmarkera
            </Button>
          )}
          <Button
            variant="destructive"
            size="sm"
            onClick={onDeleteSelected}
            className="flex items-center"
            aria-label={`Ta bort ${selectedCount} valda kontakter`}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Ta bort ({selectedCount})
          </Button>
        </div>
      )}
    </div>
  );
}
