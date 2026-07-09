export const UPCOMING_GRACE_MINUTES = 30;

/** Normalizes API `bookingDate` values to `YYYY-MM-DD` for display and comparison. */
export function normalizeBookingDateString(value: unknown): string | null {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return null;
    }
    const isoDay = /^(\d{4})-(\d{2})-(\d{2})/.exec(trimmed);
    if (isoDay != null) {
      return `${isoDay[1]}-${isoDay[2]}-${isoDay[3]}`;
    }
    const parsed = new Date(trimmed);
    if (Number.isNaN(parsed.getTime())) {
      return null;
    }
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, '0');
    const d = String(parsed.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, '0');
    const d = String(value.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return null;
}

export function parseBookingDate(dateStr: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
      return null;
    }
    const d = new Date(year, month - 1, day);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) {
    return null;
  }
  d.setHours(0, 0, 0, 0);
  return d;
}

export function parseSlotTimeToMinutes(slotTime: string): { hour: number; minute: number } | null {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(slotTime.trim());
  if (!match) {
    return null;
  }
  const rawHour = Number(match[1]);
  const minute = Number(match[2]);
  const ampm = match[3].toUpperCase();
  if (!Number.isFinite(rawHour) || !Number.isFinite(minute)) {
    return null;
  }
  let hour = rawHour;
  if (ampm === 'PM' && hour !== 12) {
    hour += 12;
  }
  if (ampm === 'AM' && hour === 12) {
    hour = 0;
  }
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return null;
  }
  return { hour, minute };
}

export function buildBookingDateTime(bookingDate: string, slotTime: string): Date | null {
  const baseDate = parseBookingDate(bookingDate);
  if (baseDate == null) {
    return null;
  }
  const time = parseSlotTimeToMinutes(slotTime);
  if (time == null) {
    return null;
  }
  baseDate.setHours(time.hour, time.minute, 0, 0);
  return baseDate;
}

export function hasBookingStarted(bookingDate: string, slotTime: string, now = new Date()): boolean {
  const bookingDateTime = buildBookingDateTime(bookingDate, slotTime);
  if (bookingDateTime == null) {
    return false;
  }
  return now.getTime() >= bookingDateTime.getTime();
}

/** Upcoming tab: appointment is today or in the future (matches web bookings page). */
export function isBookingUpcomingTab(
  bookingDate: string,
  slotTime: string,
  now = new Date(),
): boolean {
  const bookingDateTime = buildBookingDateTime(bookingDate, slotTime);
  if (bookingDateTime != null) {
    return bookingDateTime.getTime() >= now.getTime();
  }
  const dateOnly = parseBookingDate(bookingDate);
  if (dateOnly == null) {
    return false;
  }
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  return dateOnly.getTime() >= today.getTime();
}

export function isBookingUpcoming(bookingDate: string, slotTime: string, now = new Date()): boolean {
  const bookingDateTime = buildBookingDateTime(bookingDate, slotTime);
  if (bookingDateTime != null) {
    const graceMs = UPCOMING_GRACE_MINUTES * 60 * 1000;
    return now.getTime() <= bookingDateTime.getTime() + graceMs;
  }
  const dateOnly = parseBookingDate(bookingDate);
  if (dateOnly == null) {
    return false;
  }
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  return dateOnly.getTime() >= today.getTime();
}

export function getBookingScheduleTimestamp(
  bookingDate: string,
  slotTime: string,
): number {
  const bookingDateTime = buildBookingDateTime(bookingDate, slotTime);
  if (bookingDateTime != null) {
    return bookingDateTime.getTime();
  }
  const dateOnly = parseBookingDate(bookingDate);
  return dateOnly?.getTime() ?? 0;
}

export function sortBookingsBySchedule<T extends { bookingDate: string; slotTime: string; id: number }>(
  bookings: T[],
  direction: 'asc' | 'desc',
): T[] {
  const factor = direction === 'asc' ? 1 : -1;
  return [...bookings].sort((a, b) => {
    const diff =
      getBookingScheduleTimestamp(a.bookingDate, a.slotTime) -
      getBookingScheduleTimestamp(b.bookingDate, b.slotTime);
    if (diff !== 0) {
      return diff * factor;
    }
    return (a.id - b.id) * factor;
  });
}

export function formatBookingDate(dateStr: string): string {
  const d = parseBookingDate(dateStr) ?? new Date(dateStr);
  if (Number.isNaN(d.getTime())) {
    return dateStr;
  }
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
