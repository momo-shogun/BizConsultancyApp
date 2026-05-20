import type {
  ConsultationSlotGroup,
  ConsultationTimePeriod,
  ConsultationTimeSlot,
} from '../types/consultationOnboarding.types';

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

export function mapSlotLabelsToConsultationGroups(labels: string[]): ConsultationSlotGroup[] {
  return groupAvailableSlotLabels(labels).map((group) => ({
    label: group.label,
    period: PERIOD_BY_GROUP_LABEL[group.label] ?? 'morning',
    slots: group.slots.map(
      (label): ConsultationTimeSlot => ({
        id: label,
        label,
        period: PERIOD_BY_GROUP_LABEL[group.label] ?? 'morning',
        available: true,
      }),
    ),
  }));
}
