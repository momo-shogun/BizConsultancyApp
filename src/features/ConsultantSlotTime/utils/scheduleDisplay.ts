import type { ConsultantAvailabilityOverride } from '../types/consultantSchedule.types';
import { SCHEDULE_TIME_OPTIONS } from '../constants/scheduleConstants';

export function formatScheduleDate(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function hhmmToLabel(time: string): string {
  const normalized = time.slice(0, 5);
  const match = SCHEDULE_TIME_OPTIONS.find((option) => option.value === normalized);
  return match?.label ?? normalized;
}

export function formatOverrideDisplay(override: ConsultantAvailabilityOverride): string {
  const dateLabel = formatScheduleDate(override.overrideDate);
  return `${dateLabel} · ${hhmmToLabel(override.startTime)} – ${hhmmToLabel(override.endTime)}`;
}

export function formatDateToApi(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function readApiErrorMessage(error: unknown, fallback: string): string {
  if (error != null && typeof error === 'object' && 'data' in error) {
    const data = (error as { data: unknown }).data;
    if (typeof data === 'string' && data.trim().length > 0) {
      return data;
    }
    if (data != null && typeof data === 'object') {
      const record = data as Record<string, unknown>;
      const message = record.message;
      if (typeof message === 'string' && message.trim().length > 0) {
        return message;
      }
      if (Array.isArray(message) && message.length > 0 && typeof message[0] === 'string') {
        return message[0];
      }
    }
  }
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }
  return fallback;
}
