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

function readFeeAmount(value: string | number | null | undefined): number {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function formatRupeeAmount(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

/** Amount charged by POST /workshop-bookings (matches API getAmountFromWorkshop). */
export function resolveWorkshopBookAmount(workshop: PublicWorkshopApiRow): number {
  const useOnline = workshop.isOnlineAvailable === 1;
  const raw = useOnline ? workshop.onlineFee : workshop.offlineFee;
  const amount = readFeeAmount(raw);
  return amount > 0 ? Math.round(amount) : 0;
}

export function isWorkshopBookingFree(workshop: PublicWorkshopApiRow): boolean {
  return resolveWorkshopBookAmount(workshop) <= 0;
}

export function resolveWorkshopFee(workshop: PublicWorkshopApiRow): {
  amount: number;
  isFree: boolean;
  label: string;
  detailLine: string | null;
} {
  const online = readFeeAmount(workshop.onlineFee);
  const offline = readFeeAmount(workshop.offlineFee);
  const onlineFree = online <= 0;
  const offlineFree = offline <= 0;

  if (onlineFree && offlineFree) {
    return { amount: 0, isFree: true, label: 'FREE', detailLine: null };
  }

  if (!onlineFree && !offlineFree && online !== offline) {
    return {
      amount: online,
      isFree: false,
      label: formatRupeeAmount(online),
      detailLine: `In-person: ${formatRupeeAmount(offline)}`,
    };
  }

  const amount = !onlineFree ? online : offline;
  return {
    amount: Math.round(amount),
    isFree: false,
    label: formatRupeeAmount(amount),
    detailLine: null,
  };
}

export function parseWorkshopStartDate(workshop: PublicWorkshopApiRow): Date | null {
  const datePart = workshop.startDate?.trim();
  if (datePart == null || datePart.length === 0) {
    return null;
  }
  const timePart = workshop.startTime?.slice(0, 8) ?? '00:00:00';
  const parsed = new Date(`${datePart}T${timePart}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function isWorkshopUpcoming(
  workshop: PublicWorkshopApiRow,
  now: Date = new Date(),
): boolean {
  const start = parseWorkshopStartDate(workshop);
  if (start == null) {
    return true;
  }
  return start.getTime() >= now.getTime();
}

/** Online workshops (isOnlineAvailable === 1) stay bookable after the session date. */
export function isWorkshopOnlineAvailable(workshop: PublicWorkshopApiRow): boolean {
  return workshop.isOnlineAvailable === 1;
}

export function isWorkshopBookable(
  workshop: PublicWorkshopApiRow,
  now: Date = new Date(),
): boolean {
  if (isWorkshopOnlineAvailable(workshop)) {
    return true;
  }
  return isWorkshopUpcoming(workshop, now);
}

export function resolveWorkshopJoinUrl(workshop: PublicWorkshopApiRow): string | null {
  const candidates = [workshop.workshopUrl, workshop.externalUrlOnline];
  for (const raw of candidates) {
    const trimmed = raw?.trim();
    if (trimmed != null && trimmed.length > 0) {
      return trimmed;
    }
  }
  return null;
}

export function resolveWorkshopMapsUrl(workshop: PublicWorkshopApiRow): string | null {
  const map = workshop.mapLocation?.trim();
  if (map != null && map.length > 0) {
    if (/^https?:\/\//i.test(map)) {
      return map;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(map)}`;
  }
  const place = workshop.place?.trim();
  if (place != null && place.length > 0 && place.toLowerCase() !== 'online') {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;
  }
  return null;
}

export function formatWorkshopTypeLabel(type: string): string {
  const trimmed = type.trim();
  if (trimmed.length === 0) {
    return 'Workshop';
  }
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}
