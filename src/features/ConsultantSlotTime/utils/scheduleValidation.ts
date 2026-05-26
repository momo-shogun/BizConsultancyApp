import type { ScheduleTimeRange } from '../types/consultantSchedule.types';

export function timeValueToMinutesHHmm(value: string): number | null {
  const match = value.trim().match(/^(\d{2}):(\d{2})$/);
  if (match == null) {
    return null;
  }
  const hour = Number.parseInt(match[1], 10);
  const minute = Number.parseInt(match[2], 10);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return null;
  }
  return hour * 60 + minute;
}

export function rangesOverlap(ranges: ScheduleTimeRange[]): boolean {
  const parsed = ranges
    .map((range) => ({
      start: timeValueToMinutesHHmm(range.startTime.slice(0, 5)),
      end: timeValueToMinutesHHmm(range.endTime.slice(0, 5)),
    }))
    .filter(
      (entry): entry is { start: number; end: number } =>
        entry.start != null && entry.end != null,
    );

  for (const entry of parsed) {
    if (entry.end <= entry.start) {
      return true;
    }
  }

  parsed.sort((a, b) => a.start - b.start || a.end - b.end);
  for (let index = 1; index < parsed.length; index += 1) {
    if (parsed[index].start < parsed[index - 1].end) {
      return true;
    }
  }
  return false;
}

function minutesToHHmm(mins: number): string {
  const normalized = ((mins % (24 * 60)) + 24 * 60) % (24 * 60);
  const hour = Math.floor(normalized / 60);
  const minute = normalized % 60;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

export function nextDefaultRangeAfterExisting(
  ranges: ScheduleTimeRange[],
): ScheduleTimeRange | null {
  const parsed = ranges
    .map((range) => ({
      start: timeValueToMinutesHHmm(range.startTime.slice(0, 5)),
      end: timeValueToMinutesHHmm(range.endTime.slice(0, 5)),
    }))
    .filter(
      (entry): entry is { start: number; end: number } =>
        entry.start != null && entry.end != null,
    );

  if (parsed.length === 0) {
    return { startTime: '09:00', endTime: '17:00' };
  }

  const lastEnd = Math.max(...parsed.map((entry) => entry.end));
  const oneHourEnd = lastEnd + 60;
  const halfHourEnd = lastEnd + 30;

  if (oneHourEnd <= 24 * 60) {
    return { startTime: minutesToHHmm(lastEnd), endTime: minutesToHHmm(oneHourEnd) };
  }
  if (halfHourEnd <= 24 * 60) {
    return { startTime: minutesToHHmm(lastEnd), endTime: minutesToHHmm(halfHourEnd) };
  }
  return null;
}

export function getSlotMinutesFromLabel(slotTime: string): number | null {
  const match = slotTime.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match == null) {
    return null;
  }
  let hour = Number.parseInt(match[1], 10);
  const minute = Number.parseInt(match[2], 10);
  const ampm = match[3].toUpperCase();
  if (ampm === 'PM' && hour !== 12) {
    hour += 12;
  }
  if (ampm === 'AM' && hour === 12) {
    hour = 0;
  }
  return hour * 60 + minute;
}
