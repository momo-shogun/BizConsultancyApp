import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  useCreateConsultantOverrideMutation,
  useDeleteConsultantOverrideMutation,
  useGetConsultantOverridesQuery,
  useGetConsultantScheduleQuery,
  useUpdateConsultantOverrideMutation,
  useUpsertConsultantScheduleMutation,
} from '@/features/ConsultantSlotTime/api/consultantScheduleApi';
import {
  DEFAULT_SCHEDULE_NAME,
  getDefaultScheduleDays,
} from '@/features/ConsultantSlotTime/constants/scheduleConstants';
import type {
  ConsultantAvailabilityOverride,
  OverrideFormState,
  ScheduleDayConfig,
} from '@/features/ConsultantSlotTime/types/consultantSchedule.types';
import { readApiErrorMessage } from '@/features/ConsultantSlotTime/utils/scheduleDisplay';
import { buildSchedulePreviewSlots } from '@/features/ConsultantSlotTime/utils/schedulePreviewSlots';
import {
  nextDefaultRangeAfterExisting,
  rangesOverlap,
} from '@/features/ConsultantSlotTime/utils/scheduleValidation';
import { showGlobalToast } from '@/shared/components/toast';

export interface UseConsultantSlotTimeScreenResult {
  scheduleDays: ScheduleDayConfig[];
  scheduleExists: boolean;
  isScheduleLoading: boolean;
  isScheduleSaving: boolean;
  createSchedule: () => void;
  saveSchedule: () => Promise<void>;
  setDayActive: (dayOfWeek: number, isActive: boolean) => void;
  addRangeToDay: (dayOfWeek: number) => void;
  removeRangeFromDay: (dayOfWeek: number, rangeIndex: number) => void;
  updateDayRange: (
    dayOfWeek: number,
    rangeIndex: number,
    field: 'startTime' | 'endTime',
    value: string,
  ) => void;
  overrides: ConsultantAvailabilityOverride[];
  isOverridesLoading: boolean;
  openCreateOverride: () => void;
  openEditOverride: (override: ConsultantAvailabilityOverride) => void;
  deleteOverride: (overrideId: number) => Promise<void>;
  overrideModalVisible: boolean;
  overrideForm: OverrideFormState;
  overrideEditId: number | null;
  isOverrideSaving: boolean;
  closeOverrideModal: () => void;
  updateOverrideForm: (patch: Partial<OverrideFormState>) => void;
  saveOverride: () => Promise<void>;
  previewDate: Date;
  setPreviewDate: (date: Date) => void;
  previewSlots: string[];
  isPreviewLoading: boolean;
  previewNeedsSchedule: boolean;
  refreshAll: () => void;
  isRefreshing: boolean;
}

const EMPTY_OVERRIDE_FORM: OverrideFormState = {
  overrideDate: '',
  startTime: '09:00',
  endTime: '17:00',
};

export function useConsultantSlotTimeScreen(): UseConsultantSlotTimeScreenResult {
  const {
    data: scheduleData,
    isLoading: isScheduleQueryLoading,
    isFetching: isScheduleFetching,
    refetch: refetchSchedule,
  } = useGetConsultantScheduleQuery();
  const {
    data: overridesData = [],
    isLoading: isOverridesQueryLoading,
    isFetching: isOverridesFetching,
    refetch: refetchOverrides,
  } = useGetConsultantOverridesQuery();
  const [upsertSchedule, { isLoading: isScheduleSaving }] = useUpsertConsultantScheduleMutation();
  const [createOverride, { isLoading: isCreateOverrideSaving }] =
    useCreateConsultantOverrideMutation();
  const [updateOverride, { isLoading: isUpdateOverrideSaving }] =
    useUpdateConsultantOverrideMutation();
  const [deleteOverrideMutation] = useDeleteConsultantOverrideMutation();

  const [scheduleDays, setScheduleDays] = useState<ScheduleDayConfig[]>([]);
  const [scheduleExists, setScheduleExists] = useState(false);

  const [previewDate, setPreviewDate] = useState<Date>(() => new Date());

  const [overrideModalVisible, setOverrideModalVisible] = useState(false);
  const [overrideForm, setOverrideForm] = useState<OverrideFormState>(EMPTY_OVERRIDE_FORM);
  const [overrideEditId, setOverrideEditId] = useState<number | null>(null);

  const applyScheduleFromApi = useCallback((schedule: typeof scheduleData): void => {
    if (schedule != null && schedule.days.length > 0) {
      setScheduleExists(true);
      setScheduleDays(schedule.days);
      return;
    }
    setScheduleExists(false);
    setScheduleDays([]);
  }, []);

  useEffect(() => {
    if (isScheduleQueryLoading) {
      return;
    }
    applyScheduleFromApi(scheduleData);
  }, [applyScheduleFromApi, isScheduleQueryLoading, scheduleData]);

  const overrides = useMemo(
    () => overridesData.filter((item) => item.isDeleted !== 1),
    [overridesData],
  );

  const previewSlots = useMemo((): string[] => {
    if (scheduleDays.length === 0) {
      return [];
    }
    return buildSchedulePreviewSlots(scheduleDays, overrides, previewDate);
  }, [overrides, previewDate, scheduleDays]);

  const previewNeedsSchedule = !scheduleExists && scheduleDays.length === 0;

  const createSchedule = useCallback((): void => {
    setScheduleExists(true);
    setScheduleDays(getDefaultScheduleDays());
  }, []);

  const setDayActive = useCallback((dayOfWeek: number, isActive: boolean): void => {
    setScheduleDays((prev) =>
      prev.map((day) => (day.dayOfWeek === dayOfWeek ? { ...day, isActive } : day)),
    );
  }, []);

  const addRangeToDay = useCallback((dayOfWeek: number): void => {
    setScheduleDays((prev) =>
      prev.map((day) => {
        if (day.dayOfWeek !== dayOfWeek) {
          return day;
        }
        const nextRange = nextDefaultRangeAfterExisting(day.ranges);
        if (nextRange == null) {
          showGlobalToast({ message: 'No more time left today.', variant: 'error' });
          return day;
        }
        const proposed = [...day.ranges, nextRange];
        if (rangesOverlap(proposed)) {
          showGlobalToast({ message: 'This time overlaps another one.', variant: 'error' });
          return day;
        }
        return { ...day, ranges: proposed };
      }),
    );
  }, []);

  const updateDayRange = useCallback(
    (dayOfWeek: number, rangeIndex: number, field: 'startTime' | 'endTime', value: string): void => {
      setScheduleDays((prev) =>
        prev.map((day) => {
          if (day.dayOfWeek !== dayOfWeek) {
            return day;
          }
          const nextRanges = day.ranges.map((range, index) =>
            index === rangeIndex ? { ...range, [field]: value } : range,
          );
          const seen = new Set<string>();
          for (const range of nextRanges) {
            const key = `${range.startTime.slice(0, 5)}-${range.endTime.slice(0, 5)}`;
            if (seen.has(key)) {
              showGlobalToast({ message: 'You already added this time.', variant: 'error' });
              return day;
            }
            seen.add(key);
          }
          if (rangesOverlap(nextRanges)) {
            showGlobalToast({
              message: 'Times cannot overlap.',
              variant: 'error',
            });
            return day;
          }
          return { ...day, ranges: nextRanges };
        }),
      );
    },
    [],
  );

  const removeRangeFromDay = useCallback((dayOfWeek: number, rangeIndex: number): void => {
    setScheduleDays((prev) =>
      prev.map((day) => {
        if (day.dayOfWeek !== dayOfWeek || day.ranges.length <= 1) {
          return day;
        }
        return { ...day, ranges: day.ranges.filter((_, index) => index !== rangeIndex) };
      }),
    );
  }, []);

  const saveSchedule = useCallback(async (): Promise<void> => {
    if (scheduleDays.length === 0) {
      return;
    }
    try {
      await upsertSchedule({ name: DEFAULT_SCHEDULE_NAME, days: scheduleDays }).unwrap();
      showGlobalToast({ message: 'Weekly hours saved', variant: 'success' });
      await refetchSchedule();
    } catch (error: unknown) {
      showGlobalToast({
        message: readApiErrorMessage(error, 'Could not save. Try again.'),
        variant: 'error',
      });
    }
  }, [refetchSchedule, scheduleDays, upsertSchedule]);

  const openCreateOverride = useCallback((): void => {
    setOverrideEditId(null);
    setOverrideForm(EMPTY_OVERRIDE_FORM);
    setOverrideModalVisible(true);
  }, []);

  const openEditOverride = useCallback((override: ConsultantAvailabilityOverride): void => {
    setOverrideEditId(override.id);
    setOverrideForm({
      overrideDate: override.overrideDate.slice(0, 10),
      startTime: override.startTime.slice(0, 5),
      endTime: override.endTime.slice(0, 5),
    });
    setOverrideModalVisible(true);
  }, []);

  const closeOverrideModal = useCallback((): void => {
    if (isCreateOverrideSaving || isUpdateOverrideSaving) {
      return;
    }
    setOverrideModalVisible(false);
  }, [isCreateOverrideSaving, isUpdateOverrideSaving]);

  const updateOverrideForm = useCallback((patch: Partial<OverrideFormState>): void => {
    setOverrideForm((prev) => ({ ...prev, ...patch }));
  }, []);

  const saveOverride = useCallback(async (): Promise<void> => {
    if (overrideForm.overrideDate.trim().length < 10) {
      showGlobalToast({ message: 'Pick a date first', variant: 'error' });
      return;
    }
    try {
      if (overrideEditId != null) {
        await updateOverride({ id: overrideEditId, body: overrideForm }).unwrap();
        showGlobalToast({ message: 'Day off updated', variant: 'success' });
      } else {
        await createOverride(overrideForm).unwrap();
        showGlobalToast({ message: 'Day off added', variant: 'success' });
      }
      setOverrideModalVisible(false);
      await refetchOverrides();
    } catch (error: unknown) {
      showGlobalToast({
        message: readApiErrorMessage(error, 'Could not save. Try again.'),
        variant: 'error',
      });
    }
  }, [createOverride, overrideEditId, overrideForm, refetchOverrides, updateOverride]);

  const deleteOverride = useCallback(
    async (overrideId: number): Promise<void> => {
      try {
        await deleteOverrideMutation(overrideId).unwrap();
        showGlobalToast({ message: 'Day off removed', variant: 'success' });
        await refetchOverrides();
      } catch (error: unknown) {
        showGlobalToast({
          message: readApiErrorMessage(error, 'Could not remove. Try again.'),
          variant: 'error',
        });
      }
    },
    [deleteOverrideMutation, refetchOverrides],
  );

  const refreshAll = useCallback((): void => {
    void refetchSchedule();
    void refetchOverrides();
  }, [refetchOverrides, refetchSchedule]);

  return {
    scheduleDays,
    scheduleExists,
    isScheduleLoading: isScheduleQueryLoading && scheduleData === undefined,
    isScheduleSaving,
    createSchedule,
    saveSchedule,
    setDayActive,
    addRangeToDay,
    removeRangeFromDay,
    updateDayRange,
    overrides,
    isOverridesLoading: isOverridesQueryLoading && overridesData === undefined,
    openCreateOverride,
    openEditOverride,
    deleteOverride,
    overrideModalVisible,
    overrideForm,
    overrideEditId,
    isOverrideSaving: isCreateOverrideSaving || isUpdateOverrideSaving,
    closeOverrideModal,
    updateOverrideForm,
    saveOverride,
    previewDate,
    setPreviewDate,
    previewSlots,
    isPreviewLoading: isScheduleQueryLoading && scheduleData === undefined,
    previewNeedsSchedule,
    refreshAll,
    isRefreshing: isScheduleFetching || isOverridesFetching,
  };
}
