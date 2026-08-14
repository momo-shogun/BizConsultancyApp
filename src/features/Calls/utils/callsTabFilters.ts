import type { FilterChipItem, FilterOption, FilterSection, FilterSheetValue } from '@/shared/components';

import type { CallHistoryItem } from '@/features/Calls/types/callApi.types';
import {
  getOtherPartyName,
  isMissedCall,
} from '@/features/Calls/utils/callsTabHistoryDisplay';

export const CALLS_FILTER_KEYS = {
  status: 'status',
  date: 'date',
} as const;

export const CALLS_DATE_PICK_OPTION_ID = 'pick_date';

export type CallsDatePeriodPreset =
  | 'today'
  | 'yesterday'
  | 'last_7_days'
  | 'last_30_days'
  | 'this_month'
  | 'last_month'
  | 'this_year'
  | 'last_year';

/** Encoded as `year:2025` or `day:2026-08-10`. */
export type CallsDateFilterValue =
  | CallsDatePeriodPreset
  | `year:${number}`
  | `day:${string}`;

export type CallsStatusFilter = 'all' | 'missed';

export const EMPTY_CALLS_FILTERS: FilterSheetValue = {
  selected: {
    [CALLS_FILTER_KEYS.status]: null,
    [CALLS_FILTER_KEYS.date]: null,
  },
};

const PERIOD_LABELS: Record<CallsDatePeriodPreset, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  last_7_days: 'Last 7 days',
  last_30_days: 'Last 30 days',
  this_month: 'This month',
  last_month: 'Last month',
  this_year: 'This year',
  last_year: 'Last year',
};

const PERIOD_PRESETS: CallsDatePeriodPreset[] = [
  'today',
  'yesterday',
  'last_7_days',
  'last_30_days',
  'this_month',
  'last_month',
  'this_year',
  'last_year',
];

const YEAR_OPTION_COUNT = 5;

function isPeriodPreset(value: string): value is CallsDatePeriodPreset {
  return (PERIOD_PRESETS as string[]).includes(value);
}

function parseYearFilter(value: string): number | null {
  const match = /^year:(\d{4})$/.exec(value);
  if (match == null) {
    return null;
  }
  const year = Number(match[1]);
  return Number.isFinite(year) ? year : null;
}

function parseDayFilter(value: string): string | null {
  const match = /^day:(\d{4}-\d{2}-\d{2})$/.exec(value);
  return match?.[1] ?? null;
}

export function encodeCallsDayFilter(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `day:${y}-${m}-${d}`;
}

export function encodeCallsYearFilter(year: number): string {
  return `year:${year}`;
}

function buildYearOptions(now: Date = new Date()): FilterOption[] {
  const currentYear = now.getFullYear();
  const options: FilterOption[] = [];
  for (let offset = 0; offset < YEAR_OPTION_COUNT; offset += 1) {
    const year = currentYear - offset;
    if (offset === 0 || offset === 1) {
      // Covered by This year / Last year presets.
      continue;
    }
    options.push({
      id: encodeCallsYearFilter(year),
      label: String(year),
    });
  }
  return options;
}

export function buildCallsFilterSections(now: Date = new Date()): FilterSection[] {
  return [
    {
      id: CALLS_FILTER_KEYS.status,
      title: 'Call type',
      options: [
        { id: 'all', label: 'All' },
        { id: 'missed', label: 'Missed' },
      ],
    },
    {
      id: CALLS_FILTER_KEYS.date,
      title: 'Date',
      options: [
        { id: 'today', label: PERIOD_LABELS.today },
        { id: 'yesterday', label: PERIOD_LABELS.yesterday },
        { id: 'last_7_days', label: PERIOD_LABELS.last_7_days },
        { id: 'last_30_days', label: PERIOD_LABELS.last_30_days },
        { id: 'this_month', label: PERIOD_LABELS.this_month },
        { id: 'last_month', label: PERIOD_LABELS.last_month },
        { id: 'this_year', label: PERIOD_LABELS.this_year },
        { id: 'last_year', label: PERIOD_LABELS.last_year },
        ...buildYearOptions(now),
        { id: CALLS_DATE_PICK_OPTION_ID, label: 'Choose date…' },
      ],
    },
  ];
}

/** @deprecated Prefer buildCallsFilterSections() for dynamic years. */
export const CALLS_FILTER_SECTIONS: FilterSection[] = buildCallsFilterSections();

export interface CallsListCriteria {
  searchQuery: string;
  status: CallsStatusFilter;
  dateFilter: CallsDateFilterValue | null;
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

export function getCallTimestamp(item: CallHistoryItem): number | null {
  const raw = item.startedAt ?? item.connectedAt ?? item.endedAt;
  if (raw == null || raw.length === 0) {
    return null;
  }
  const parsed = new Date(raw).getTime();
  return Number.isNaN(parsed) ? null : parsed;
}

export function resolveCallsStatusFilter(filters: FilterSheetValue): CallsStatusFilter {
  const value = filters.selected[CALLS_FILTER_KEYS.status];
  return value === 'missed' ? 'missed' : 'all';
}

export function resolveCallsDateFilter(filters: FilterSheetValue): CallsDateFilterValue | null {
  const value = filters.selected[CALLS_FILTER_KEYS.date];
  if (value == null || value.length === 0 || value === CALLS_DATE_PICK_OPTION_ID) {
    return null;
  }
  if (isPeriodPreset(value)) {
    return value;
  }
  if (parseYearFilter(value) != null) {
    return value as CallsDateFilterValue;
  }
  if (parseDayFilter(value) != null) {
    return value as CallsDateFilterValue;
  }
  return null;
}

/** @deprecated Use resolveCallsDateFilter */
export function resolveCallsDatePreset(filters: FilterSheetValue): CallsDateFilterValue | null {
  return resolveCallsDateFilter(filters);
}

export function formatCallsDateFilterLabel(value: CallsDateFilterValue): string {
  if (isPeriodPreset(value)) {
    return PERIOD_LABELS[value];
  }
  const year = parseYearFilter(value);
  if (year != null) {
    return String(year);
  }
  const day = parseDayFilter(value);
  if (day != null) {
    const parsed = new Date(`${day}T12:00:00`);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
  }
  return value;
}

export function countActiveCallsFilters(filters: FilterSheetValue): number {
  let count = 0;
  const status = filters.selected[CALLS_FILTER_KEYS.status];
  if (status === 'missed') {
    count += 1;
  }
  if (resolveCallsDateFilter(filters) != null) {
    count += 1;
  }
  return count;
}

export function buildCallsFilterChipItems(
  filters: FilterSheetValue,
  onClearStatus: () => void,
  onClearDate: () => void,
): FilterChipItem[] {
  const chips: FilterChipItem[] = [];
  const status = filters.selected[CALLS_FILTER_KEYS.status];
  if (status === 'missed') {
    chips.push({
      id: 'status-missed',
      label: 'Missed',
      isSelected: true,
      onPress: onClearStatus,
    });
  }

  const dateFilter = resolveCallsDateFilter(filters);
  if (dateFilter != null) {
    chips.push({
      id: `date-${dateFilter}`,
      label: formatCallsDateFilterLabel(dateFilter),
      isSelected: true,
      onPress: onClearDate,
    });
  }

  return chips;
}

export function matchesCallsSearch(item: CallHistoryItem, searchQuery: string): boolean {
  const query = searchQuery.trim().toLowerCase();
  if (query.length === 0) {
    return true;
  }
  const name = getOtherPartyName(item).toLowerCase();
  const medium = item.callType === 'video' ? 'video' : 'voice';
  return name.includes(query) || medium.includes(query);
}

export function matchesCallsDateFilter(
  item: CallHistoryItem,
  dateFilter: CallsDateFilterValue | null,
): boolean {
  if (dateFilter == null) {
    return true;
  }

  const ts = getCallTimestamp(item);
  if (ts == null) {
    return false;
  }

  const now = new Date();
  const todayStart = startOfLocalDay(now).getTime();
  const todayEnd = endOfLocalDay(now).getTime();

  const yearValue = parseYearFilter(dateFilter);
  if (yearValue != null) {
    const from = new Date(yearValue, 0, 1).getTime();
    const to = endOfLocalDay(new Date(yearValue, 11, 31)).getTime();
    return ts >= from && ts <= to;
  }

  const dayValue = parseDayFilter(dateFilter);
  if (dayValue != null) {
    const day = new Date(`${dayValue}T12:00:00`);
    if (Number.isNaN(day.getTime())) {
      return false;
    }
    return ts >= startOfLocalDay(day).getTime() && ts <= endOfLocalDay(day).getTime();
  }

  if (dateFilter === 'today') {
    return ts >= todayStart && ts <= todayEnd;
  }

  if (dateFilter === 'yesterday') {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    return ts >= startOfLocalDay(yesterday).getTime() && ts <= endOfLocalDay(yesterday).getTime();
  }

  if (dateFilter === 'last_7_days') {
    const from = new Date(now);
    from.setDate(from.getDate() - 6);
    return ts >= startOfLocalDay(from).getTime() && ts <= todayEnd;
  }

  if (dateFilter === 'last_30_days') {
    const from = new Date(now);
    from.setDate(from.getDate() - 29);
    return ts >= startOfLocalDay(from).getTime() && ts <= todayEnd;
  }

  if (dateFilter === 'this_month') {
    const from = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    return ts >= from && ts <= todayEnd;
  }

  if (dateFilter === 'last_month') {
    const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const to = endOfLocalDay(new Date(now.getFullYear(), now.getMonth(), 0));
    return ts >= from.getTime() && ts <= to.getTime();
  }

  if (dateFilter === 'this_year') {
    const from = new Date(now.getFullYear(), 0, 1).getTime();
    return ts >= from && ts <= todayEnd;
  }

  if (dateFilter === 'last_year') {
    const year = now.getFullYear() - 1;
    const from = new Date(year, 0, 1).getTime();
    const to = endOfLocalDay(new Date(year, 11, 31)).getTime();
    return ts >= from && ts <= to;
  }

  return true;
}

/** @deprecated Use matchesCallsDateFilter */
export function matchesCallsDatePreset(
  item: CallHistoryItem,
  preset: CallsDateFilterValue | null,
): boolean {
  return matchesCallsDateFilter(item, preset);
}

export function matchesCallsStatus(
  item: CallHistoryItem,
  status: CallsStatusFilter,
): boolean {
  if (status === 'all') {
    return true;
  }
  return isMissedCall(item);
}

export function filterCallHistoryItems(
  items: CallHistoryItem[],
  criteria: CallsListCriteria,
): CallHistoryItem[] {
  return items.filter(
    (item) =>
      matchesCallsStatus(item, criteria.status) &&
      matchesCallsDateFilter(item, criteria.dateFilter) &&
      matchesCallsSearch(item, criteria.searchQuery),
  );
}

export function getCallsDatePickerBounds(now: Date = new Date()): {
  minimumDate: Date;
  maximumDate: Date;
} {
  return {
    minimumDate: new Date(now.getFullYear() - (YEAR_OPTION_COUNT - 1), 0, 1),
    maximumDate: startOfLocalDay(now),
  };
}
