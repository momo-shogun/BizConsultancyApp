import type {
  ConsultantAvailabilityOverride,
  ConsultantSchedule,
  ScheduleDayConfig,
  ScheduleTimeRange,
} from '../types/consultantSchedule.types';
import { SCHEDULE_DAY_ORDER } from '../constants/scheduleConstants';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function readString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function normalizeHHmm(value: unknown, fallback: string): string {
  const raw = readString(value);
  if (raw.length >= 5) {
    return raw.slice(0, 5);
  }
  return fallback;
}

function parseRange(raw: unknown): ScheduleTimeRange | null {
  if (!isRecord(raw)) {
    return null;
  }
  return {
    startTime: normalizeHHmm(raw.startTime, '09:00'),
    endTime: normalizeHHmm(raw.endTime, '17:00'),
  };
}

function parseDay(raw: unknown): ScheduleDayConfig | null {
  if (!isRecord(raw)) {
    return null;
  }
  const dayOfWeek = typeof raw.dayOfWeek === 'number' ? raw.dayOfWeek : null;
  if (dayOfWeek == null) {
    return null;
  }
  const isActiveRaw = raw.isActive;
  const isActive =
    isActiveRaw === true ||
    isActiveRaw === 1 ||
    isActiveRaw === '1' ||
    (typeof isActiveRaw === 'string' && isActiveRaw.toLowerCase() === 'true');

  const rangeRows = Array.isArray(raw.ranges) ? raw.ranges : [];
  const ranges = rangeRows
    .map(parseRange)
    .filter((range): range is ScheduleTimeRange => range != null);

  if (ranges.length === 0) {
    ranges.push({ startTime: '09:00', endTime: '17:00' });
  }

  return { dayOfWeek, isActive, ranges };
}

export function parseConsultantSchedule(raw: unknown): ConsultantSchedule | null {
  if (!isRecord(raw)) {
    return null;
  }
  const id = typeof raw.id === 'number' ? raw.id : 0;
  const consultantId = typeof raw.consultantId === 'number' ? raw.consultantId : 0;
  const name = readString(raw.name) || 'Default';

  const dayRows = Array.isArray(raw.days) ? raw.days : [];
  const parsedDays = dayRows
    .map(parseDay)
    .filter((day): day is ScheduleDayConfig => day != null);

  const days: ScheduleDayConfig[] = SCHEDULE_DAY_ORDER.map((dayOfWeek) => {
    const existing = parsedDays.find((day) => day.dayOfWeek === dayOfWeek);
    if (existing != null) {
      return existing;
    }
    return {
      dayOfWeek,
      isActive: dayOfWeek !== 0 && dayOfWeek !== 7,
      ranges: [{ startTime: '09:00', endTime: '17:00' }],
    };
  });

  return { id, consultantId, name, days };
}

export function parseConsultantOverride(raw: unknown): ConsultantAvailabilityOverride | null {
  if (!isRecord(raw)) {
    return null;
  }
  const id = typeof raw.id === 'number' ? raw.id : null;
  const consultantId = typeof raw.consultantId === 'number' ? raw.consultantId : null;
  if (id == null || consultantId == null) {
    return null;
  }

  const overrideDateRaw = readString(raw.overrideDate);
  const overrideDate = overrideDateRaw.length >= 10 ? overrideDateRaw.slice(0, 10) : overrideDateRaw;

  return {
    id,
    consultantId,
    overrideDate,
    startTime: normalizeHHmm(raw.startTime, '09:00'),
    endTime: normalizeHHmm(raw.endTime, '17:00'),
    isDeleted: typeof raw.isDeleted === 'number' ? raw.isDeleted : 0,
    createdAt: readString(raw.createdAt),
    updatedAt: readString(raw.updatedAt),
  };
}

export function parseConsultantOverridesList(raw: unknown): ConsultantAvailabilityOverride[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw
    .map(parseConsultantOverride)
    .filter((item): item is ConsultantAvailabilityOverride => item != null);
}
