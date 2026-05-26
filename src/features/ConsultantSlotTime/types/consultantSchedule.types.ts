export interface ScheduleTimeRange {
  startTime: string;
  endTime: string;
}

export interface ScheduleDayConfig {
  dayOfWeek: number;
  isActive: boolean;
  ranges: ScheduleTimeRange[];
}

export interface ConsultantSchedule {
  id: number;
  consultantId: number;
  name: string;
  days: ScheduleDayConfig[];
}

export interface UpsertConsultantSchedulePayload {
  name?: string;
  days: ScheduleDayConfig[];
}

export interface ConsultantAvailabilityOverride {
  id: number;
  consultantId: number;
  overrideDate: string;
  startTime: string;
  endTime: string;
  isDeleted: number;
  createdAt: string;
  updatedAt: string;
}

export interface OverrideFormState {
  overrideDate: string;
  startTime: string;
  endTime: string;
}
