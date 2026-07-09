import type { ScheduleDayConfig } from '../types/consultantSchedule.types';

/** Always sent on schedule save; not shown in the app UI. */
export const DEFAULT_SCHEDULE_NAME = 'Default';

export const SCHEDULE_DAY_ORDER = [1, 2, 3, 4, 5, 6, 0] as const;

export const SCHEDULE_DAY_LABELS: Record<number, string> = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
  // 7: 'Everyday',
};

export interface TimeOption {
  value: string;
  label: string;
}

export const SCHEDULE_TIME_OPTIONS: TimeOption[] = (() => {
  const options: TimeOption[] = [];
  for (let hour = 0; hour < 24; hour += 1) {
    for (const minute of [0, 30]) {
      const value = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      const period = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      options.push({
        value,
        label: `${hour12}:${String(minute).padStart(2, '0')} ${period}`,
      });
    }
  }
  return options;
})();

export function getDefaultScheduleDays(): ScheduleDayConfig[] {
  return SCHEDULE_DAY_ORDER.map((dayOfWeek) => ({
    dayOfWeek,
    isActive: dayOfWeek !== 0 && dayOfWeek !== 7,
    ranges: [{ startTime: '09:00', endTime: '17:00' }],
  }));
}
