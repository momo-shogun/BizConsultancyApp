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

export function isBookingUpcoming(bookingDate: string, slotTime: string, now = new Date()): boolean {
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
