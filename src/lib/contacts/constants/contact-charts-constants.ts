// **  Contact Types & Translations  ** //
export const CONTACT_TYPE_TRANSLATIONS: Record<string, string> = {
  CONTACT: 'Kontakter',
  LEAD: 'Leads',
  CUSTOMER: 'Kunder',
  AMBASSADOR: 'Ambassadörer',
};

// **  Contact Type Order for Charts  ** //
export const CONTACT_TYPE_ORDER: string[] = ['CONTACT', 'LEAD', 'CUSTOMER', 'AMBASSADOR'];

// **  Contact Type Colors  ** //
const CONTACT_TYPE_COLOR_PALETTE: Record<string, string> = {
  CUSTOMER: '#004794',
  LEAD: '#009400',
  AMBASSADOR: '#940000',
  Default: '#6B7280', // Gray-500 (Fallback)
};

export const getContactTypeColorValue = (type: string): string => {
  // Ensure the type lookup is case-insensitive or matches the expected case from data
  return CONTACT_TYPE_COLOR_PALETTE[type] || CONTACT_TYPE_COLOR_PALETTE.Default;
};

// To be used by recharts <Bar /> or <Cell /> component for fill
export const CONTACT_CHART_COLORS_LIST = CONTACT_TYPE_ORDER.map((type) =>
  getContactTypeColorValue(type)
);
