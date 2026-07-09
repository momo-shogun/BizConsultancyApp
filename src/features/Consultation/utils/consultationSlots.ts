import type {
  ConsultationSlotGroup,
  ConsultationTimePeriod,
  ConsultationTimeSlot,
} from '../types/consultationOnboarding.types';

import type { AvailableSlot } from '@/features/consultant/types/consultantApi.types';

const PERIOD_BY_GROUP_LABEL: Record<string, ConsultationTimePeriod> = {
  Morning: 'morning',
  Afternoon: 'afternoon',
  Evening: 'evening',
};

export function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function todayStart(): Date {
  return startOfDay(new Date());
}

/** `YYYY-MM-DD` for `GET public/consultants/:slug/available-slots`. */
export function formatConsultationApiDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** True when `slotLabel` is at or before the current clock time on `preferredDate`. */
export function isSlotPastForDate(
  slotLabel: string,
  preferredDate: Date,
  now: Date = new Date(),
): boolean {
  if (!isSameCalendarDay(preferredDate, now)) {
    return false;
  }
  const slotMinutes = slotTimeToMinutes(slotLabel);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return slotMinutes <= nowMinutes;
}

function slotTimeToMinutes(time: string): number {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match == null) {
    return 0;
  }
  let hour = Number.parseInt(match[1], 10);
  const minute = Number.parseInt(match[2], 10);
  const meridiem = match[3].toUpperCase();
  if (meridiem === 'PM' && hour !== 12) {
    hour += 12;
  }
  if (meridiem === 'AM' && hour === 12) {
    hour = 0;
  }
  return hour * 60 + minute;
}

/**
 * Groups API slot strings (e.g. `"9:00 AM"`) into Morning / Afternoon / Evening.
 * Mirrors `groupSlots` in BizConsultancy `app/consultants/[slug]/page.tsx`.
 */
export function groupAvailableSlotLabels(
  slots: string[],
): Array<{ label: string; slots: string[] }> {
  const morning: string[] = [];
  const afternoon: string[] = [];
  const evening: string[] = [];
  const noon = 12 * 60;
  const fivePm = 17 * 60;

  for (const time of slots) {
    const minutes = slotTimeToMinutes(time);
    if (minutes < noon) {
      morning.push(time);
    } else if (minutes < fivePm) {
      afternoon.push(time);
    } else {
      evening.push(time);
    }
  }

  const groups: Array<{ label: string; slots: string[] }> = [];
  if (morning.length > 0) {
    groups.push({ label: 'Morning', slots: morning });
  }
  if (afternoon.length > 0) {
    groups.push({ label: 'Afternoon', slots: afternoon });
  }
  if (evening.length > 0) {
    groups.push({ label: 'Evening', slots: evening });
  }
  return groups;
}

function resolveConsultationSlotAvailability(
  label: string,
  apiAvailable: boolean,
  preferredDate: Date | null,
  now: Date,
): boolean {
  if (!apiAvailable) {
    return false;
  }
  if (preferredDate != null && isSlotPastForDate(label, preferredDate, now)) {
    return false;
  }
  return true;
}

export function mapSlotLabelsToConsultationGroups(
  labels: string[],
  preferredDate: Date | null = null,
  now: Date = new Date(),
): ConsultationSlotGroup[] {
  return groupAvailableSlotLabels(labels).map((group) => ({
    label: group.label,
    period: PERIOD_BY_GROUP_LABEL[group.label] ?? 'morning',
    slots: group.slots.map(
      (label): ConsultationTimeSlot => ({
        id: label,
        label,
        period: PERIOD_BY_GROUP_LABEL[group.label] ?? 'morning',
        available: resolveConsultationSlotAvailability(label, true, preferredDate, now),
      }),
    ),
  }));
}

function slotLabelFromApi(slot: AvailableSlot): string {
  const label = slot.label?.trim();
  if (label != null && label.length > 0) {
    return label;
  }
  return slot.startTime.trim();
}

function resolveSlotAvailability(slot: AvailableSlot): boolean {
  if (typeof slot.available === 'boolean') {
    return slot.available;
  }
  if (typeof slot.isAvailable === 'boolean') {
    return slot.isAvailable;
  }
  return true;
}

/**
 * Builds slot groups while respecting per-slot availability returned by the API.
 * Falls back to `available: true` for older APIs that only return strings.
 */
export function mapAvailableSlotsToConsultationGroups(
  slots: AvailableSlot[],
  preferredDate: Date | null = null,
  now: Date = new Date(),
): ConsultationSlotGroup[] {
  const morning: ConsultationTimeSlot[] = [];
  const afternoon: ConsultationTimeSlot[] = [];
  const evening: ConsultationTimeSlot[] = [];

  const noon = 12 * 60;
  const fivePm = 17 * 60;

  for (const slot of slots) {
    const label = slotLabelFromApi(slot);
    if (label.length === 0) continue;

    const minutes = slotTimeToMinutes(label);
    const available = resolveConsultationSlotAvailability(
      label,
      resolveSlotAvailability(slot),
      preferredDate,
      now,
    );

    const period: ConsultationTimePeriod =
      minutes < noon ? 'morning' : minutes < fivePm ? 'afternoon' : 'evening';

    const timeSlot: ConsultationTimeSlot = {
      id: label,
      label,
      period,
      available,
    };

    if (period === 'morning') {
      morning.push(timeSlot);
    } else if (period === 'afternoon') {
      afternoon.push(timeSlot);
    } else {
      evening.push(timeSlot);
    }
  }

  const groups: ConsultationSlotGroup[] = [];
  if (morning.length > 0) groups.push({ label: 'Morning', period: 'morning', slots: morning });
  if (afternoon.length > 0)
    groups.push({ label: 'Afternoon', period: 'afternoon', slots: afternoon });
  if (evening.length > 0) groups.push({ label: 'Evening', period: 'evening', slots: evening });
  return groups;
}
