import type { PublicWorkshopApiRow } from '../types/publicWorkshopApi.types';

const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

function parseYyyyMmDd(value?: string | null): { y: number; m: number; d: number } | null {
  if (value == null || value.trim().length === 0) {
    return null;
  }
  const [yRaw, mRaw, dRaw] = value.split('-');
  const y = Number(yRaw);
  const m = Number(mRaw);
  const d = Number(dRaw);
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) {
    return null;
  }
  if (m < 1 || m > 12 || d < 1 || d > 31) {
    return null;
  }
  return { y, m, d };
}

export function parseWorkshopHighlightPoints(raw: string | null | undefined): string[] {
  const trimmed = raw?.trim();
  if (trimmed == null || trimmed.length === 0) {
    return [];
  }
  try {
    const parsed = JSON.parse(trimmed) as unknown;
    const arr = typeof parsed === 'string' ? (JSON.parse(parsed) as unknown) : parsed;
    return Array.isArray(arr)
      ? arr.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      : [];
  } catch {
    return trimmed
      .split(',')
      .map((part) => part.trim())
      .filter((part) => part.length > 0);
  }
}

export function parseWorkshopKeywords(raw: string | null | undefined): string[] {
  const trimmed = raw?.trim();
  if (trimmed == null || trimmed.length === 0) {
    return [];
  }
  try {
    const parsed = JSON.parse(trimmed) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      : [];
  } catch {
    return trimmed
      .split(',')
      .map((part) => part.trim())
      .filter((part) => part.length > 0);
  }
}

export function formatWorkshopDateRange(start?: string | null, end?: string | null): string {
  const s = parseYyyyMmDd(start);
  if (s == null) {
    return '—';
  }
  const e = parseYyyyMmDd(end);
  const sMonth = MONTHS_SHORT[s.m - 1];
  if (e == null || end == null || end === start) {
    return `${s.d} ${sMonth} ${s.y}`;
  }
  const eMonth = MONTHS_SHORT[e.m - 1];
  if (s.y === e.y && s.m === e.m) {
    return `${s.d}–${e.d} ${sMonth} ${s.y}`;
  }
  return `${s.d} ${sMonth} ${s.y} – ${e.d} ${eMonth} ${e.y}`;
}

export function formatWorkshopLongDate(value?: string | null): string {
  const parsed = parseYyyyMmDd(value);
  if (parsed == null) {
    return '—';
  }
  const date = new Date(parsed.y, parsed.m - 1, parsed.d);
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatWorkshopTimeRange(startTime?: string | null, endTime?: string | null): string {
  const start = startTime?.slice(0, 5);
  const end = endTime?.slice(0, 5);
  if (start != null && start.length > 0 && end != null && end.length > 0) {
    return `${start} – ${end}`;
  }
  return start ?? end ?? '—';
}

export function resolveWorkshopFee(workshop: PublicWorkshopApiRow): {
  amount: number;
  isFree: boolean;
  label: string;
} {
  const online = Number(workshop.onlineFee ?? 0);
  const offline = Number(workshop.offlineFee ?? 0);
  const amount = online > 0 ? online : offline;
  if (!Number.isFinite(amount) || amount <= 0) {
    return { amount: 0, isFree: true, label: 'FREE' };
  }
  return {
    amount: Math.round(amount),
    isFree: false,
    label: `₹${Math.round(amount).toLocaleString('en-IN')}`,
  };
}

export function formatWorkshopTypeLabel(type: string): string {
  const trimmed = type.trim();
  if (trimmed.length === 0) {
    return 'Workshop';
  }
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}
