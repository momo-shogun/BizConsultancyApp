import type { WorkshopBookingItem } from '@/features/Home/api/workshopBookingsApi';

export function formatWorkshopDisplayDate(
  dateStr?: string | null,
  fallback?: string,
): string {
  const src = dateStr ?? fallback;
  if (src == null || src.length === 0) {
    return '—';
  }
  const d = new Date(src);
  if (Number.isNaN(d.getTime())) {
    return '—';
  }
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function hasWorkshopPassed(item: WorkshopBookingItem, now = Date.now()): boolean {
  if (item.workshopDate == null || item.workshopDate.length === 0) {
    return false;
  }
  const endTimeRaw = (item.workshopEndTime ?? item.workshopStartTime ?? '23:59:59').trim();
  const endTime = endTimeRaw.length === 5 ? `${endTimeRaw}:00` : endTimeRaw;
  const endDateTime = new Date(`${item.workshopDate}T${endTime}`);
  if (Number.isNaN(endDateTime.getTime())) {
    return false;
  }
  return now > endDateTime.getTime();
}

export function canJoinWorkshop(item: WorkshopBookingItem): boolean {
  return item.joinUrl != null && item.joinUrl.length > 0 && !hasWorkshopPassed(item);
}

export function canOpenWorkshopRecording(item: WorkshopBookingItem): boolean {
  return item.workshopUrl != null && item.workshopUrl.length > 0 && hasWorkshopPassed(item);
}

export function canViewCertificate(item: WorkshopBookingItem): boolean {
  return (
    hasWorkshopPassed(item) &&
    item.certificateNumber != null &&
    item.certificateNumber.length > 0
  );
}
