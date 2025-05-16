'use client';

import * as React from 'react';
import { CalendarIcon, Check, X, ChevronDown, ClockIcon } from 'lucide-react';
import { format, subMonths, subYears, subDays } from 'date-fns';
import { sv } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type ComparisonMode =
  | 'previous-month'
  | 'immediately-before'
  | 'year-over-year';

interface DateRangePickerProps {
  className?: string;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  comparisonDateRange?: DateRange | undefined;
  onComparisonDateRangeChange?: (range: DateRange | undefined) => void;
  showComparison?: boolean;
  onComparisonToggle?: (enabled: boolean) => void;
}

export function DateRangePicker({
  className,
  dateRange,
  onDateRangeChange,
  comparisonDateRange,
  onComparisonDateRangeChange,
  showComparison = false,
  onComparisonToggle,
}: DateRangePickerProps) {
  // State to control the popover and prevent it from closing automatically
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState<Date | undefined>(
    dateRange?.from || new Date()
  );
  const [isComparisonMode, setIsComparisonMode] =
    React.useState(showComparison);
  const [comparisonMode, setComparisonMode] =
    React.useState<ComparisonMode>('previous-month');
  const [isMobile, setIsMobile] = React.useState(false);

  // Keep track of temporary selection before applying
  const [tempDateRange, setTempDateRange] = React.useState<
    DateRange | undefined
  >(dateRange);

  const [tempComparisonDateRange, setTempComparisonDateRange] = React.useState<
    DateRange | undefined
  >(comparisonDateRange);

  // Handle window resize for responsive calendar
  React.useEffect(() => {
    // Initial value
    setIsMobile(window.innerWidth < 768);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update current month when dateRange.from changes
  React.useEffect(() => {
    if (dateRange?.from) {
      setCurrentMonth(dateRange.from);
    }

    // Update temp selection when props change
    setTempDateRange(dateRange);
  }, [dateRange]);

  // Update comparison state when prop changes
  React.useEffect(() => {
    setIsComparisonMode(showComparison);
    setTempComparisonDateRange(comparisonDateRange);
  }, [showComparison, comparisonDateRange]);

  // Update comparison calendar view when mode changes
  React.useEffect(() => {
    if (tempDateRange?.from && tempDateRange?.to) {
      updateComparisonDateRange(tempDateRange, comparisonMode);
    }
  }, [comparisonMode, tempDateRange]);

  // Update comparison when toggling comparison mode
  React.useEffect(() => {
    if (isComparisonMode && tempDateRange?.from && tempDateRange?.to) {
      // Force update of the comparison range when comparison mode is enabled
      updateComparisonDateRange(tempDateRange, comparisonMode);
    }
  }, [isComparisonMode, tempDateRange, comparisonMode]);

  // Handle date range selection without applying it yet
  const handleSelect = (range: DateRange | undefined) => {
    setTempDateRange(range);

    // Auto-update comparison range if comparison is enabled
    if (isComparisonMode && range?.from && range?.to) {
      updateComparisonDateRange(range, comparisonMode);
    }
  };

  // Handle comparison date range selection
  const handleComparisonSelect = (range: DateRange | undefined) => {
    setTempComparisonDateRange(range);
  };

  // Update comparison date range based on selected mode
  const updateComparisonDateRange = (
    mainRange: DateRange,
    mode: ComparisonMode
  ) => {
    if (!mainRange.from || !mainRange.to) return;

    const daysDiff = Math.round(
      (mainRange.to.getTime() - mainRange.from.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    let comparisonFrom: Date;
    let comparisonTo: Date;

    switch (mode) {
      case 'previous-month':
        // Same period last month
        comparisonFrom = subMonths(new Date(mainRange.from), 1);
        comparisonTo = subMonths(new Date(mainRange.to), 1);
        break;

      case 'immediately-before':
        // Same duration, immediately before
        comparisonTo = subDays(new Date(mainRange.from), 1);
        comparisonFrom = subDays(comparisonTo, daysDiff);
        break;

      case 'year-over-year':
        comparisonFrom = subYears(new Date(mainRange.from), 1);
        comparisonTo = subYears(new Date(mainRange.to), 1);
        break;
    }

    setTempComparisonDateRange({
      from: comparisonFrom,
      to: comparisonTo,
    });

    // Update the visible month in the comparison calendar if needed
    if (mode === 'year-over-year' && comparisonFrom) {
      // This will update the defaultMonth calculation for the comparison calendar
      setTempComparisonDateRange({
        from: comparisonFrom,
        to: comparisonTo,
      });
    }
  };

  const handleComparisonToggle = () => {
    const newValue = !isComparisonMode;
    setIsComparisonMode(newValue);

    if (onComparisonToggle) {
      onComparisonToggle(newValue);
    }

    if (newValue && tempDateRange?.from && tempDateRange?.to) {
      updateComparisonDateRange(tempDateRange, comparisonMode);
    }
  };

  const handleComparisonModeChange = (value: ComparisonMode) => {
    setComparisonMode(value);

    // Update comparison range if we have a main date range
    if (tempDateRange?.from && tempDateRange?.to) {
      updateComparisonDateRange(tempDateRange, value);
    }
  };

  // Apply the selected range and close popover
  const handleApply = () => {
    onDateRangeChange(tempDateRange);

    if (isComparisonMode && onComparisonDateRangeChange) {
      onComparisonDateRangeChange(tempComparisonDateRange);
    } else if (!isComparisonMode && onComparisonDateRangeChange) {
      onComparisonDateRangeChange(undefined);
    }

    setIsOpen(false);
  };

  // Cancel selection and close popover
  const handleCancel = () => {
    setTempDateRange(dateRange);
    setTempComparisonDateRange(comparisonDateRange);
    setIsComparisonMode(showComparison);
    setIsOpen(false);
  };

  const handleButtonClick = () => {
    setIsOpen(true);
  };

  // Reset the selected range to default
  const handleReset = () => {
    const today = new Date();
    const oneMonthAgo = subMonths(today, 1);
    const newDefaultRange = { from: oneMonthAgo, to: today };

    setTempDateRange(newDefaultRange);
    setCurrentMonth(oneMonthAgo);

    if (isComparisonMode) {
      updateComparisonDateRange(newDefaultRange, comparisonMode);
    } else {
      // If comparison is not active, clear any temp comparison range
      setTempComparisonDateRange(undefined);
    }
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-full justify-start truncate text-left text-xs font-normal sm:text-sm',
              !dateRange && 'text-muted-foreground'
            )}
            onClick={handleButtonClick}
          >
            <CalendarIcon className="mr-1 h-3 w-3 flex-shrink-0 sm:mr-2 sm:h-4 sm:w-4" />
            {dateRange?.from ? (
              <span className="flex w-full items-center gap-1 overflow-hidden sm:gap-2">
                <span className="truncate">
                  {dateRange.to ? (
                    <>
                      {format(dateRange.from, 'PP', { locale: sv })} -{' '}
                      {format(dateRange.to, 'PP', { locale: sv })}
                    </>
                  ) : (
                    format(dateRange.from, 'PP', { locale: sv })
                  )}
                </span>
                {showComparison && comparisonDateRange?.from && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge
                          variant="outline"
                          className="ml-1 flex flex-shrink-0 items-center gap-1 text-[10px] sm:ml-2 sm:text-xs"
                        >
                          <ClockIcon className="h-2 w-2 sm:h-3 sm:w-3" />
                          Jämför
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Jämförelseperiod är aktiv.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </span>
            ) : (
              <span>Välj datumintervall</span>
            )}
            <ChevronDown
              className={cn(
                'ml-auto h-3 w-3 flex-shrink-0 transition-transform duration-200 sm:h-4 sm:w-4',
                isOpen && 'rotate-180 transform'
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto max-w-[calc(100vw-32px)] rounded-lg bg-white p-0"
          align="center"
        >
          <div className="flex flex-col">
            <div className="border-b p-3">
              <h3 className="mb-2 font-medium">Aktuell datumintervall</h3>
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                selected={tempDateRange}
                onSelect={handleSelect}
                numberOfMonths={isMobile ? 1 : 2}
                locale={sv}
                todayClassName="bg-blue-100 text-blue-700 font-semibold border border-blue-300 hover:bg-blue-200 hover:text-blue-800"
              />
            </div>

            <div className="border-b px-3 py-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="comparison"
                  checked={isComparisonMode}
                  onCheckedChange={() => handleComparisonToggle()}
                />
                <Label htmlFor="comparison" className="text-sm font-medium">
                  Jämför med tidigare period
                </Label>
              </div>
            </div>

            {isComparisonMode && (
              <>
                <div className="border-b px-3 py-2">
                  <div className="mb-1 flex items-center space-x-2">
                    <Label className="text-sm font-medium">Jämförelsetyp</Label>
                  </div>
                  <Select
                    value={comparisonMode}
                    onValueChange={(value) =>
                      handleComparisonModeChange(value as ComparisonMode)
                    }
                    defaultValue="previous-month"
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="previous-month">
                        Samma period föregående månad
                      </SelectItem>
                      <SelectItem value="immediately-before">
                        Samma längd, direkt före
                      </SelectItem>
                      <SelectItem value="year-over-year">
                        Samma period föregående år
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="border-b p-3">
                  <h3 className="text-muted-foreground mb-2 font-medium">
                    Jämförelseperiod
                  </h3>
                  <Calendar
                    mode="range"
                    key={`comparison-calendar-${comparisonMode}`}
                    defaultMonth={
                      comparisonMode === 'year-over-year' && tempDateRange?.from
                        ? new Date(
                            tempDateRange.from.getFullYear() - 1,
                            tempDateRange.from.getMonth(),
                            1
                          )
                        : tempComparisonDateRange?.from ||
                          (tempDateRange?.from
                            ? new Date(
                                tempDateRange.from.getFullYear(),
                                tempDateRange.from.getMonth() - 1,
                                1
                              )
                            : undefined)
                    }
                    month={
                      comparisonMode === 'year-over-year' && tempDateRange?.from
                        ? new Date(
                            tempDateRange.from.getFullYear() - 1,
                            tempDateRange.from.getMonth(),
                            1
                          )
                        : undefined
                    }
                    selected={tempComparisonDateRange}
                    onSelect={handleComparisonSelect}
                    numberOfMonths={isMobile ? 1 : 2}
                    locale={sv}
                    todayClassName="bg-blue-100 text-blue-700 font-semibold border border-blue-300 hover:bg-blue-200 hover:text-blue-800"
                  />
                </div>
              </>
            )}

            <div className="flex justify-between border-t p-3">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  className="hover:bg-destructive flex items-center hover:text-white"
                >
                  <X className="mr-1 h-4 w-4" />
                  Avbryt
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleReset}
                        className="flex items-center"
                      >
                        Återställ
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Återställ till standardperiod (senaste månaden).</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleApply}
                      className="flex items-center"
                    >
                      <Check className="mr-1 h-4 w-4" />
                      Tillämpa
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Verkställ valt datumintervall.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
