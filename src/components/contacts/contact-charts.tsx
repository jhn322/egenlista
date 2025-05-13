'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Contact } from '@/generated/prisma';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  TooltipProps,
  PieChart,
  Pie,
  Cell,
  Legend,
  PieLabelRenderProps,
} from 'recharts';
import { format, startOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import { sv } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CONTACT_TYPE_TRANSLATIONS,
  CONTACT_TYPE_ORDER,
  getContactTypeColorValue,
} from '@/lib/contacts/constants/contact-charts-constants';
import { DateRange } from 'react-day-picker';
import { Badge } from '@/components/ui/badge';
import { InfoIcon } from 'lucide-react';

// ** Local Interface for Legend Entry ** //
interface SimpleLegendEntry {
  color?: string;
  value?: string | number;
  payload?: {
    // The payload associated with the legend item, from the chart series
    color?: string; // Color of the chart element
    stroke?: string; // Stroke color (lines)
    fill?: string; // Fill color (bars)
    value?: string | number;
    dataKey?: string;
  };
}

// **  Props Interface  ** //
interface ContactChartsProps {
  contacts: Contact[];
  dateRange?: DateRange;
  comparisonDateRange?: DateRange;
}

// **  Data Interfaces for Charts  ** //
interface MonthlyData {
  month: string;
  count: number;
  comparisonCount?: number;
}

interface ContactTypeData {
  name: string;
  value: number;
  comparisonValue?: number;
  color: string;
  originalType: string;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  type: 'monthly' | 'contactType';
  showComparison: boolean;
}

// Helper for direct color access
const tempColorPalette = {
  Lead: '#3B82F6', // Green
  Kund: '#10B981', // EgenLista Blue
  Ambassadör: '#F59E0B', // Red
  Default: '#6B7280', // Gray-500
};

// **  ContactCharts Component  ** //
export function ContactCharts({
  contacts,
  dateRange,
  comparisonDateRange,
}: ContactChartsProps) {
  const hasComparison =
    !!comparisonDateRange?.from && !!comparisonDateRange?.to;

  // Filter contacts based on date range
  const filteredContacts = React.useMemo(() => {
    if (!dateRange?.from) return contacts;

    const from = new Date(dateRange.from);
    from.setHours(0, 0, 0, 0);

    const to = dateRange.to ? new Date(dateRange.to) : new Date();
    to.setHours(23, 59, 59, 999);

    return contacts.filter((contact) => {
      const contactDate = new Date(contact.createdAt);
      return contactDate >= from && contactDate <= to;
    });
  }, [contacts, dateRange]);

  // Filter comparison contacts
  const comparisonContacts = React.useMemo(() => {
    if (
      !hasComparison ||
      !comparisonDateRange?.from ||
      !comparisonDateRange?.to
    )
      return [];

    const from = new Date(comparisonDateRange.from);
    from.setHours(0, 0, 0, 0);

    const to = new Date(comparisonDateRange.to);
    to.setHours(23, 59, 59, 999);

    return contacts.filter((contact) => {
      const contactDate = new Date(contact.createdAt);
      return contactDate >= from && contactDate <= to;
    });
  }, [contacts, comparisonDateRange, hasComparison]);

  // Format date ranges for display
  const primaryDateLabel = React.useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return '';
    if (
      dateRange.from.getMonth() === dateRange.to.getMonth() &&
      dateRange.from.getFullYear() === dateRange.to.getFullYear()
    ) {
      return format(dateRange.from, 'MMMM yyyy', { locale: sv });
    }
    return `${format(dateRange.from, 'd MMM', {
      locale: sv,
    })} - ${format(dateRange.to, 'd MMM yyyy', { locale: sv })}`;
  }, [dateRange]);

  const comparisonDateLabel = React.useMemo(() => {
    if (
      !hasComparison ||
      !comparisonDateRange?.from ||
      !comparisonDateRange?.to
    )
      return '';
    if (
      comparisonDateRange.from.getMonth() ===
        comparisonDateRange.to.getMonth() &&
      comparisonDateRange.from.getFullYear() ===
        comparisonDateRange.to.getFullYear()
    ) {
      return format(comparisonDateRange.from, 'MMMM yyyy', { locale: sv });
    }
    return `${format(comparisonDateRange.from, 'd MMM', {
      locale: sv,
    })} - ${format(comparisonDateRange.to, 'd MMM yyyy', { locale: sv })}`;
  }, [comparisonDateRange, hasComparison]);

  // Monthly data aggregation
  const monthlyData = React.useMemo(() => {
    const now = new Date();
    const monthsInterval = eachMonthOfInterval({
      start: subMonths(now, 11),
      end: now,
    });

    return monthsInterval.map((month) => {
      const monthStart = startOfMonth(month);
      const primaryCount = filteredContacts.filter((contact) => {
        const contactDate = new Date(contact.createdAt);
        return startOfMonth(contactDate).getTime() === monthStart.getTime();
      }).length;

      const comparisonCountValue = hasComparison
        ? comparisonContacts.filter((contact) => {
            const contactDate = new Date(contact.createdAt);
            return startOfMonth(contactDate).getTime() === monthStart.getTime();
          }).length
        : undefined;

      return {
        month: format(month, 'MMM yyyy', { locale: sv }),
        count: primaryCount,
        ...(hasComparison && { comparisonCount: comparisonCountValue }),
      };
    });
  }, [filteredContacts, comparisonContacts, hasComparison]);

  // Contact type data aggregation
  const contactTypeData = React.useMemo(() => {
    const typeCounts = filteredContacts.reduce(
      (acc: Record<string, number>, contact) => {
        const type = contact.type || 'Okänd'; // Assuming contact.type exists, provide fallback
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      },
      {}
    );

    const comparisonTypeCounts = hasComparison
      ? comparisonContacts.reduce((acc: Record<string, number>, contact) => {
          const type = contact.type || 'Okänd';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {})
      : {};

    const unsortedData: ContactTypeData[] = Object.entries(typeCounts).map(
      ([type, count]) => ({
        originalType: type,
        name: CONTACT_TYPE_TRANSLATIONS[type] || type,
        value: count,
        comparisonValue: hasComparison
          ? comparisonTypeCounts[type] || 0
          : undefined,
        color: getContactTypeColorValue(type),
      })
    );

    const sortedData = unsortedData.sort((a, b) => {
      const indexA = CONTACT_TYPE_ORDER.indexOf(a.originalType);
      const indexB = CONTACT_TYPE_ORDER.indexOf(b.originalType);

      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return b.value - a.value; // Fallback sort by value
    });

    return sortedData;
  }, [filteredContacts, comparisonContacts, hasComparison]);

  // ** Custom Tooltip Component ** //
  const CustomTooltip = ({
    active,
    payload,
    type,
    showComparison,
  }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      let displayValue: string;
      let primaryValue: number;
      let comparisonValue: number | undefined;

      if (type === 'monthly') {
        const monthData = data as MonthlyData;
        displayValue = monthData.month;
        primaryValue = monthData.count;
        comparisonValue = monthData.comparisonCount;
      } else {
        // 'contactType'
        const typeData = data as ContactTypeData;
        displayValue = typeData.name; // Translated name
        primaryValue = typeData.value;
        comparisonValue = typeData.comparisonValue;
      }

      const percentChange =
        comparisonValue !== undefined && comparisonValue > 0
          ? ((primaryValue - comparisonValue) / comparisonValue) * 100
          : primaryValue > 0 && comparisonValue === 0
            ? Infinity // Or handle as 'New' or specific large percentage
            : 0;

      let changeText = '';
      if (percentChange === Infinity) {
        changeText = 'Nytt';
      } else if (percentChange !== 0) {
        changeText = `${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(1)}%`;
      }

      return (
        <div className="bg-background max-w-[280px] rounded-lg border p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-[0.70rem] uppercase">
                {type === 'monthly' ? 'Månad' : 'Kontakttyp'}
              </span>
              <span className="text-muted-foreground font-bold">
                {displayValue}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-[0.70rem] uppercase">
                Aktuell period
              </span>
              <span className="font-bold">{primaryValue}</span>
            </div>
          </div>

          {showComparison && comparisonValue !== undefined && (
            <div className="mt-2 border-t pt-2">
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-muted-foreground text-[0.70rem] uppercase">
                      Jämförelseperiod
                    </span>
                    <div className="font-medium">{comparisonValue}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[0.70rem] uppercase">
                      Förändring
                    </span>
                    <div
                      className={`font-medium ${
                        percentChange === Infinity
                          ? 'text-green-600'
                          : percentChange >= 0
                            ? 'text-green-600'
                            : 'text-red-600'
                      }`}
                    >
                      {changeText}
                    </div>
                  </div>
                </div>
                <div className="text-muted-foreground mt-1 text-[0.65rem] font-normal">
                  {Math.abs(percentChange) > 0 && percentChange !== Infinity
                    ? `${
                        percentChange >= 0 ? 'Ökning' : 'Minskning'
                      } med ${Math.abs(percentChange).toFixed(
                        1
                      )}% från jämförelseperioden`
                    : percentChange === Infinity
                      ? `Nytt inflöde jämfört med 0 i jämförelseperioden.`
                      : 'Ingen förändring mellan perioderna'}
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const CustomTooltipWrapper = (
    props: TooltipProps<number, string> & {
      type: 'monthly' | 'contactType';
    }
  ) => {
    return (
      <CustomTooltip
        {...props}
        type={props.type}
        showComparison={hasComparison}
      />
    );
  };

  // ** Pie Chart Label Renderer ** //
  const renderCustomizedPieLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: PieLabelRenderProps) => {
    const RADIAN = Math.PI / 180;
    const safeInnerRadius = typeof innerRadius === 'number' ? innerRadius : 0;
    const safeOuterRadius = typeof outerRadius === 'number' ? outerRadius : 0;
    const safeCx = typeof cx === 'number' ? cx : 0;
    const safeCy = typeof cy === 'number' ? cy : 0;
    const safeMidAngle = typeof midAngle === 'number' ? midAngle : 0;

    const radius = safeInnerRadius + (safeOuterRadius - safeInnerRadius) * 0.6;
    const x = safeCx + radius * Math.cos(-safeMidAngle * RADIAN);
    const y = safeCy + radius * Math.sin(-safeMidAngle * RADIAN);

    return percent && percent > 0.05 ? (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  if (!contacts || contacts.length === 0) {
    return (
      <Card className="flex h-full w-full min-w-0 flex-col overflow-hidden">
        <CardHeader className="px-3 sm:px-6">
          <CardTitle>Kontaktstatistik</CardTitle>
          <CardDescription>
            Data för att visa diagram över dina kontakter.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-grow items-center justify-center px-3 sm:px-6">
          <div className="text-center text-gray-500">
            <InfoIcon className="mx-auto mb-2 h-10 w-10" />
            <p>Ingen kontaktdata att visa för den valda perioden.</p>
            <p className="text-sm">
              Lägg till kontakter eller justera datumfiltret.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex h-full w-full min-w-0 flex-col overflow-hidden">
      <CardHeader className="px-3 sm:px-6">
        <CardTitle>Kontaktstatistik</CardTitle>
        {hasComparison && (
          <CardDescription className="flex items-center gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge
                variant="outline"
                className="border-amber-200 bg-amber-100 text-xs text-amber-800"
              >
                Aktuell: {primaryDateLabel}
              </Badge>
              <Badge
                variant="outline"
                className="border-purple-200 bg-purple-100 text-xs text-purple-800"
              >
                Jämförelse: {comparisonDateLabel}
              </Badge>
            </div>
          </CardDescription>
        )}
        {!hasComparison && dateRange?.from && dateRange?.to && (
          <CardDescription className="flex items-center gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge
                variant="outline"
                className="border-amber-200 bg-amber-100 text-xs text-amber-800"
              >
                Visar: {primaryDateLabel}
              </Badge>
            </div>
          </CardDescription>
        )}
        <CardDescription className="text-muted-foreground pt-1 text-sm">
          Visualisera dina kontakters tillväxt och fördelning över tid och typ.
          Använd flikarna nedan för att byta diagramvy.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow px-3 pt-0 sm:px-6">
        <Tabs defaultValue="monthly" className="flex h-full w-full flex-col">
          <TabsList className="grid w-full grid-cols-3 text-xs sm:text-sm">
            <TabsTrigger value="monthly" className="px-1 sm:px-3">
              Linjediagram
            </TabsTrigger>
            <TabsTrigger value="category" className="px-1 sm:px-3">
              Stapeldiagram
            </TabsTrigger>
            <TabsTrigger value="pie" className="px-1 sm:px-3">
              Cirkeldiagram
            </TabsTrigger>
          </TabsList>

          {/* Monthly Chart */}
          <TabsContent value="monthly">
            <div className="h-full min-h-[520px] pt-4">
              {hasComparison && (
                <div className="mb-4 flex items-center gap-2 text-sm">
                  <InfoIcon className="text-muted-foreground h-3.5 w-3.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Muspekaren över linjen för detaljerad jämförelse.
                  </span>
                </div>
              )}
              <ResponsiveContainer width="100%" height={500}>
                <LineChart data={monthlyData}>
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: '10px' }}
                    interval="preserveStartEnd"
                    minTickGap={5}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                    allowDecimals={false}
                  />
                  <Tooltip
                    content={(props: TooltipProps<number, string>) => (
                      <CustomTooltipWrapper {...props} type="monthly" />
                    )}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="Aktuell period"
                    stroke={tempColorPalette.Lead}
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 2, fill: tempColorPalette.Lead }}
                    activeDot={{
                      r: 6,
                      strokeWidth: 2,
                      fill: tempColorPalette.Lead,
                    }}
                  />
                  {hasComparison && (
                    <Line
                      type="monotone"
                      dataKey="comparisonCount"
                      name="Jämförelseperiod"
                      stroke={tempColorPalette.Ambassadör}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{
                        r: 4,
                        strokeWidth: 2,
                        fill: tempColorPalette.Ambassadör,
                      }}
                      activeDot={{
                        r: 6,
                        strokeWidth: 2,
                        fill: tempColorPalette.Ambassadör,
                      }}
                    />
                  )}
                  <Legend
                    wrapperStyle={{ paddingTop: '20px' }}
                    formatter={(value: string, entry: SimpleLegendEntry) => {
                      const lineColor = entry?.color || tempColorPalette.Lead;
                      return (
                        <span
                          className="text-foreground rounded-sm px-2 py-1 text-sm font-medium"
                          style={{
                            color: lineColor,
                          }}
                        >
                          {value}
                        </span>
                      );
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          {/* Contact Type Bar Chart */}
          <TabsContent value="category">
            <div className="h-full min-h-[520px] pt-4">
              {hasComparison && (
                <div className="mb-4 flex items-center gap-2 text-sm">
                  <InfoIcon className="text-muted-foreground h-3.5 w-3.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Prickade staplar är jämförelseperioden.
                  </span>
                </div>
              )}
              <ResponsiveContainer width="100%" height={500}>
                <BarChart
                  data={contactTypeData}
                  margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                >
                  <XAxis
                    dataKey="name" // Display translated name
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: '12px' }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                    allowDecimals={false}
                  />
                  <Tooltip
                    content={(props: TooltipProps<number, string>) => (
                      <CustomTooltipWrapper {...props} type="contactType" />
                    )}
                  />
                  <Bar
                    dataKey="value"
                    name="Aktuell period"
                    radius={[4, 4, 0, 0]}
                    barSize={
                      contactTypeData.length > 0
                        ? Math.max(30, 400 / contactTypeData.length)
                        : 30
                    }
                  >
                    {contactTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                  {hasComparison && (
                    <Bar
                      dataKey="comparisonValue"
                      name="Jämförelseperiod"
                      fill={tempColorPalette.Ambassadör}
                      radius={[4, 4, 0, 0]}
                      fillOpacity={0.7}
                      stroke={tempColorPalette.Ambassadör}
                      strokeDasharray="3 3"
                      barSize={
                        contactTypeData.length > 0
                          ? Math.max(30, 400 / contactTypeData.length)
                          : 30
                      }
                    />
                  )}
                  <Legend
                    wrapperStyle={{ paddingTop: '20px' }}
                    formatter={(value: string) => {
                      let textColor = 'hsl(var(--foreground))';
                      if (value === 'Aktuell period') {
                        textColor = tempColorPalette.Lead;
                      } else if (value === 'Jämförelseperiod') {
                        textColor = tempColorPalette.Ambassadör;
                      }
                      return (
                        <span
                          className="text-foreground rounded-sm px-2 py-1 text-sm font-medium"
                          style={{ color: textColor }}
                        >
                          {value}
                        </span>
                      );
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          {/* Contact Type Pie Chart */}
          <TabsContent value="pie">
            <div className="h-full min-h-[520px] pt-4">
              {hasComparison && (
                <div className="mb-4 flex items-center gap-2 text-sm">
                  <InfoIcon className="text-muted-foreground h-3.5 w-3.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Cirkeldiagrammet visar aktuell period. Håll musen över för
                    detaljer.
                  </span>
                </div>
              )}
              <ResponsiveContainer width="100%" height={500}>
                <PieChart>
                  <Pie
                    data={contactTypeData.filter((d) => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedPieLabel}
                    outerRadius={160}
                    dataKey="value"
                    nameKey="name"
                    paddingAngle={
                      contactTypeData.filter((d) => d.value > 0).length > 1
                        ? 2
                        : 0
                    }
                  >
                    {contactTypeData
                      .filter((d) => d.value > 0)
                      .map((entry) => (
                        <Cell
                          key={`cell-${entry.originalType}`}
                          fill={entry.color}
                        />
                      ))}
                  </Pie>
                  <Tooltip
                    content={(props: TooltipProps<number, string>) => (
                      <CustomTooltipWrapper {...props} type="contactType" />
                    )}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    iconSize={10}
                    wrapperStyle={{ paddingTop: '20px', paddingBottom: '10px' }}
                    formatter={(value: string, entry: SimpleLegendEntry) => {
                      const sliceColor =
                        entry?.color ||
                        getContactTypeColorValue(
                          (entry.value as string) || value
                        );
                      return (
                        <span
                          className="text-sm"
                          style={{ color: sliceColor, marginRight: '10px' }}
                        >
                          {value}
                        </span>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
