import { SCHEDULE_TIME_OPTIONS } from '../constants/scheduleConstants';
import type {
  ConsultantAvailabilityOverride,
  ScheduleDayConfig,
  ScheduleTimeRange,
} from '../types/consultantSchedule.types';
import { formatDateToApi } from './scheduleDisplay';
import { getSlotMinutesFromLabel, timeValueToMinutesHHmm } from './scheduleValidation';

const SLOT_STEP_MINUTES = 30;

function hhmmToLabel(hhmm: string): string {
  const normalized = hhmm.slice(0, 5);
  const match = SCHEDULE_TIME_OPTIONS.find((option) => option.value === normalized);
  return match?.label ?? normalized;
}

function resolveScheduleDayForDate(
  scheduleDays: ScheduleDayConfig[],
  date: Date,
): ScheduleDayConfig | null {
  const dayOfWeek = date.getDay();
  const everyday = scheduleDays.find((day) => day.dayOfWeek === 7);
  if (everyday?.isActive) {
    return everyday;
  }
  return scheduleDays.find((day) => day.dayOfWeek === dayOfWeek) ?? null;
}

function generateSlotsForRanges(ranges: ScheduleTimeRange[]): string[] {
  const labels = new Set<string>();

  for (const range of ranges) {
    const start = timeValueToMinutesHHmm(range.startTime.slice(0, 5));
    const end = timeValueToMinutesHHmm(range.endTime.slice(0, 5));
    if (start == null || end == null || end <= start) {
      continue;
    }

    for (let minutes = start; minutes < end; minutes += SLOT_STEP_MINUTES) {
      const hour = Math.floor(minutes / 60);
      const minute = minutes % 60;
      const hhmm = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      labels.add(hhmmToLabel(hhmm));
    }
  }

  return [...labels].sort((left, right) => {
    const leftMinutes = getSlotMinutesFromLabel(left) ?? 0;
    const rightMinutes = getSlotMinutesFromLabel(right) ?? 0;
    return leftMinutes - rightMinutes;
  });
}

function isSlotBlockedByOverride(
  slotMinutes: number,
  override: ConsultantAvailabilityOverride,
): boolean {
  const start = timeValueToMinutesHHmm(override.startTime.slice(0, 5));
  const end = timeValueToMinutesHHmm(override.endTime.slice(0, 5));
  if (start == null || end == null) {
    return false;
  }
  return slotMinutes >= start && slotMinutes < end;
}

export function buildSchedulePreviewSlots(
  scheduleDays: ScheduleDayConfig[],
  overrides: ConsultantAvailabilityOverride[],
  previewDate: Date,
): string[] {
  const dayConfig = resolveScheduleDayForDate(scheduleDays, previewDate);
  if (dayConfig == null || !dayConfig.isActive || dayConfig.ranges.length === 0) {
    return [];
  }

  const previewDateApi = formatDateToApi(previewDate);
  const dayOverrides = overrides.filter(
    (override) => override.overrideDate.slice(0, 10) === previewDateApi,
  );

  const baseSlots = generateSlotsForRanges(dayConfig.ranges);
  if (dayOverrides.length === 0) {
    return baseSlots;
  }

  return baseSlots.filter((label) => {
    const slotMinutes = getSlotMinutesFromLabel(label);
    if (slotMinutes == null) {
      return true;
    }
    return !dayOverrides.some((override) => isSlotBlockedByOverride(slotMinutes, override));
  });
}
