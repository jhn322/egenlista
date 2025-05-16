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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ContactToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  typeFilter: ContactType | 'all';
  onTypeChange: (value: ContactType | 'all') => void;
  selectedCount: number;
  onDeleteSelected: () => void;
  onDeselectAll: () => void;
  showAllContactsInList: boolean;
  onShowAllContactsInListChange: (showAll: boolean) => void;
  isDateRangeActive: boolean;
}

export function ContactToolbar({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeChange,
  selectedCount,
  onDeleteSelected,
  onDeselectAll,
  showAllContactsInList,
  onShowAllContactsInListChange,
  isDateRangeActive,
}: ContactToolbarProps) {
  const toggleLabel = showAllContactsInList
    ? 'Visar alla kontakter'
    : 'Filter aktivt: Visar vald tidsperiod';

  const isToggleDisabled = !isDateRangeActive;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <Input
          placeholder="Sök kontakter..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-8 min-w-[120px] flex-1 text-xs sm:max-w-[200px] sm:text-sm md:max-w-[250px]"
        />
        <Select value={typeFilter} onValueChange={onTypeChange}>
          <SelectTrigger
            className="h-8 w-full text-xs sm:w-[150px] sm:text-sm"
            aria-label="Filtrera efter typ"
          >
            <SelectValue placeholder="Alla typer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alla typer</SelectItem>
            {Object.values(ContactType).map((type) => (
              <SelectItem key={type} value={type}>
                {formatContactType(type)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:gap-2">
        <div className="flex items-center justify-start space-x-2 sm:justify-end">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Switch
                    id="show-all-contacts-toggle-toolbar"
                    checked={showAllContactsInList}
                    onCheckedChange={onShowAllContactsInListChange}
                    disabled={isToggleDisabled}
                    aria-label={toggleLabel}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="end">
                <p>
                  {isToggleDisabled
                    ? 'Datumfilter är inte aktivt. Alla kontakter visas.'
                    : showAllContactsInList
                      ? 'Växla för att endast visa kontakter inom det valda datumintervallet.'
                      : 'Växla för att visa alla kontakter, oavsett datumfilter.'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Label
            htmlFor="show-all-contacts-toggle-toolbar"
            className={`text-muted-foreground min-w-[180px] text-left text-xs whitespace-nowrap sm:text-right ${isToggleDisabled ? 'opacity-70' : ''}`}
          >
            {!isDateRangeActive
              ? 'Visar alla (datumfilter rensat)'
              : toggleLabel}
          </Label>
        </div>
        {selectedCount > 0 && (
          <div className="flex h-8 items-center gap-2 border-l sm:pl-2">
            {selectedCount > 1 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onDeselectAll}
                      className="flex items-center"
                      aria-label="Avmarkera alla valda kontakter"
                    >
                      Avmarkera
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Avmarkera alla {selectedCount} valda kontakter.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
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
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ta bort de {selectedCount} valda kontakterna permanent.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  );
}
