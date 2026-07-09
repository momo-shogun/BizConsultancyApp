import type { EventSpotlightItem } from '@/shared/components/cards/EventSpotlightCard/EventSpotlightCard';

export type WorkshopSessionFilter = 'upcoming' | 'past';

function normalizeTimePart(time?: string): string {
  const trimmed = time?.trim();
  if (trimmed == null || trimmed.length === 0) {
    return '00:00:00';
  }
  if (trimmed.length === 5) {
    return `${trimmed}:00`;
  }
  return trimmed.slice(0, 8);
}

function parseWorkshopDateTime(date?: string, time?: string): Date | null {
  const datePart = date?.trim();
  if (datePart == null || datePart.length === 0) {
    return null;
  }
  const parsed = new Date(`${datePart}T${normalizeTimePart(time)}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function parseWorkshopStart(item: EventSpotlightItem): Date | null {
  return parseWorkshopDateTime(item.startDate, item.startTime);
}

function parseWorkshopSessionEnd(item: EventSpotlightItem): Date | null {
  const endDate = item.endDate?.trim();
  if (endDate != null && endDate.length > 0) {
    return parseWorkshopDateTime(endDate, item.endTime ?? item.startTime);
  }
  return parseWorkshopDateTime(item.startDate, item.endTime ?? item.startTime);
}

function resolveWorkshopSortTime(item: EventSpotlightItem): number {
  return (
    parseWorkshopSessionEnd(item)?.getTime() ??
    parseWorkshopStart(item)?.getTime() ??
    0
  );
}

export function isWorkshopUpcoming(item: EventSpotlightItem, now: Date = new Date()): boolean {
  const sessionEnd = parseWorkshopSessionEnd(item);
  if (sessionEnd == null) {
    return true;
  }
  return sessionEnd.getTime() >= now.getTime();
}

export function filterWorkshopsBySession(
  items: EventSpotlightItem[],
  session: WorkshopSessionFilter,
  now: Date = new Date(),
): EventSpotlightItem[] {
  const filtered = items.filter((item) => {
    const upcoming = isWorkshopUpcoming(item, now);
    return session === 'upcoming' ? upcoming : !upcoming;
  });

  return filtered.sort((a, b) => {
    const aTime = resolveWorkshopSortTime(a);
    const bTime = resolveWorkshopSortTime(b);
    return session === 'past' ? bTime - aTime : aTime - bTime;
  });
}

export function matchesWorkshopSearch(item: EventSpotlightItem, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (q.length === 0) {
    return true;
  }
  return (
    item.name.toLowerCase().includes(q) ||
    item.type.toLowerCase().includes(q) ||
    (item.place?.toLowerCase().includes(q) ?? false) ||
    (item.description?.toLowerCase().includes(q) ?? false)
  );
}
