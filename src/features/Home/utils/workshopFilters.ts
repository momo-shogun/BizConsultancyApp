import type { EventSpotlightItem } from '@/shared/components/cards/EventSpotlightCard/EventSpotlightCard';

export type WorkshopSessionFilter = 'upcoming' | 'past';

function parseWorkshopStart(item: EventSpotlightItem): Date | null {
  const datePart = item.startDate?.trim();
  if (!datePart) {
    return null;
  }
  const timePart = item.startTime?.slice(0, 8) ?? '00:00:00';
  const parsed = new Date(`${datePart}T${timePart}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function isWorkshopUpcoming(item: EventSpotlightItem, now: Date = new Date()): boolean {
  const start = parseWorkshopStart(item);
  if (start == null) {
    return true;
  }
  return start.getTime() >= now.getTime();
}

export function filterWorkshopsBySession(
  items: EventSpotlightItem[],
  session: WorkshopSessionFilter,
  now: Date = new Date(),
): EventSpotlightItem[] {
  return items.filter((item) => {
    const upcoming = isWorkshopUpcoming(item, now);
    return session === 'upcoming' ? upcoming : !upcoming;
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
