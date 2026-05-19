export const SEARCH_DEBOUNCE_MS = 320;
export const SEARCH_MIN_QUERY_LENGTH = 2;
export const SEARCH_API_LIMIT = 15;
export const MAX_RECENT_SEARCHES = 8;

export const SEARCH_PLACEHOLDERS = [
  'Search GST & compliance',
  'Company registration',
  'Licenses & filings',
  'Trademark, MSME',
] as const;

export const TRENDING_SEARCHES = [
  'GST registration',
  'Private limited company',
  'Trademark registration',
  'MSME registration',
  'Startup India',
  'FSSAI license',
  'Import export code',
  'Annual compliance',
] as const;

export const QUICK_ACTIONS = [
  { id: 'consultants', label: 'Experts', icon: 'people-outline' as const },
  { id: 'services', label: 'Services', icon: 'grid-outline' as const },
  { id: 'workshops', label: 'Workshops', icon: 'school-outline' as const },
] as const;
