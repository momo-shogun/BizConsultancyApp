import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  useGetAvailableSlotsQuery,
  useGetPublicConsultantsQuery,
} from '@/features/consultant/api/consultantApi';
import {
  useCreateConsultantOverrideMutation,
  useDeleteConsultantOverrideMutation,
  useGetConsultantOverridesQuery,
  useGetConsultantScheduleQuery,
  useUpdateConsultantOverrideMutation,
  useUpsertConsultantScheduleMutation,
} from '@/features/ConsultantSlotTime/api/consultantScheduleApi';
import { getDefaultScheduleDays } from '@/features/ConsultantSlotTime/constants/scheduleConstants';
import type {
  ConsultantAvailabilityOverride,
  OverrideFormState,
  ScheduleDayConfig,
} from '@/features/ConsultantSlotTime/types/consultantSchedule.types';
import { formatDateToApi, readApiErrorMessage } from '@/features/ConsultantSlotTime/utils/scheduleDisplay';
import {
  nextDefaultRangeAfterExisting,
  rangesOverlap,
} from '@/features/ConsultantSlotTime/utils/scheduleValidation';
import { useAppSelector } from '@/store/typedHooks';
import { showGlobalToast } from '@/shared/components/toast';

export interface UseConsultantSlotTimeScreenResult {
  scheduleName: string;
  setScheduleName: (name: string) => void;
  scheduleDays: ScheduleDayConfig[];
  scheduleExists: boolean;
  isScheduleLoading: boolean;
  isScheduleSaving: boolean;
  createSchedule: () => void;
  saveSchedule: () => Promise<void>;
  cancelScheduleEdits: () => void;
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
  slugMissing: boolean;
  refreshAll: () => void;
  isRefreshing: boolean;
}

const EMPTY_OVERRIDE_FORM: OverrideFormState = {
  overrideDate: '',
  startTime: '09:00',
  endTime: '17:00',
};

export function useConsultantSlotTimeScreen(): UseConsultantSlotTimeScreenResult {
  const authUserId = useAppSelector((state) => state.auth.user?.id ?? '');
  const consultantId = Number(authUserId);

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

  const { data: consultantsPage } = useGetPublicConsultantsQuery(
    { limit: '100' },
    { skip: !Number.isFinite(consultantId) || consultantId <= 0 },
  );

  const consultantSlug = useMemo((): string => {
    if (!Number.isFinite(consultantId) || consultantId <= 0) {
      return '';
    }
    const match = consultantsPage?.items.find((item) => Number(item.id) === consultantId);
    return match?.slug?.trim() ?? '';
  }, [consultantId, consultantsPage?.items]);

  const [scheduleName, setScheduleName] = useState('Default');
  const [scheduleDays, setScheduleDays] = useState<ScheduleDayConfig[]>([]);
  const [scheduleExists, setScheduleExists] = useState(false);

  const [previewDate, setPreviewDate] = useState<Date>(() => new Date());
  const previewDateApi = formatDateToApi(previewDate);

  const { data: previewResponse, isFetching: isPreviewFetching } = useGetAvailableSlotsQuery(
    { slug: consultantSlug, date: previewDateApi },
    { skip: consultantSlug.length === 0 },
  );

  const [overrideModalVisible, setOverrideModalVisible] = useState(false);
  const [overrideForm, setOverrideForm] = useState<OverrideFormState>(EMPTY_OVERRIDE_FORM);
  const [overrideEditId, setOverrideEditId] = useState<number | null>(null);

  const applyScheduleFromApi = useCallback((schedule: typeof scheduleData): void => {
    if (schedule != null && schedule.days.length > 0) {
      setScheduleExists(true);
      setScheduleName(schedule.name);
      setScheduleDays(schedule.days);
      return;
    }
    setScheduleExists(false);
    setScheduleName('Default');
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
    const slots = previewResponse?.slots ?? [];
    return slots.map((slot) => slot.label ?? slot.startTime).filter((label) => label.length > 0);
  }, [previewResponse?.slots]);

  const createSchedule = useCallback((): void => {
    setScheduleExists(true);
    setScheduleName('Default');
    setScheduleDays(getDefaultScheduleDays());
  }, []);

  const cancelScheduleEdits = useCallback((): void => {
    applyScheduleFromApi(scheduleData);
  }, [applyScheduleFromApi, scheduleData]);

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
          showGlobalToast({ message: 'No more time available to add a slot.', variant: 'error' });
          return day;
        }
        const proposed = [...day.ranges, nextRange];
        if (rangesOverlap(proposed)) {
          showGlobalToast({ message: 'This time slot conflicts with an existing slot.', variant: 'error' });
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
              showGlobalToast({ message: 'Same time slot already exists.', variant: 'error' });
              return day;
            }
            seen.add(key);
          }
          if (rangesOverlap(nextRanges)) {
            showGlobalToast({
              message: 'This time slot conflicts with another slot.',
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
      await upsertSchedule({ name: scheduleName, days: scheduleDays }).unwrap();
      showGlobalToast({ message: 'Schedule updated', variant: 'success' });
      await refetchSchedule();
    } catch (error: unknown) {
      showGlobalToast({
        message: readApiErrorMessage(error, 'Failed to update schedule'),
        variant: 'error',
      });
    }
  }, [refetchSchedule, scheduleDays, scheduleName, upsertSchedule]);

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
      showGlobalToast({ message: 'Please select a date', variant: 'error' });
      return;
    }
    try {
      if (overrideEditId != null) {
        await updateOverride({ id: overrideEditId, body: overrideForm }).unwrap();
        showGlobalToast({ message: 'Override updated', variant: 'success' });
      } else {
        await createOverride(overrideForm).unwrap();
        showGlobalToast({ message: 'Override added', variant: 'success' });
      }
      setOverrideModalVisible(false);
      await refetchOverrides();
    } catch (error: unknown) {
      showGlobalToast({
        message: readApiErrorMessage(error, 'Failed to save override'),
        variant: 'error',
      });
    }
  }, [createOverride, overrideEditId, overrideForm, refetchOverrides, updateOverride]);

  const deleteOverride = useCallback(
    async (overrideId: number): Promise<void> => {
      try {
        await deleteOverrideMutation(overrideId).unwrap();
        showGlobalToast({ message: 'Override removed', variant: 'success' });
        await refetchOverrides();
      } catch (error: unknown) {
        showGlobalToast({
          message: readApiErrorMessage(error, 'Failed to delete override'),
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
    scheduleName,
    setScheduleName,
    scheduleDays,
    scheduleExists,
    isScheduleLoading: isScheduleQueryLoading && scheduleData === undefined,
    isScheduleSaving,
    createSchedule,
    saveSchedule,
    cancelScheduleEdits,
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
    isPreviewLoading: isPreviewFetching,
    slugMissing: consultantSlug.length === 0,
    refreshAll,
    isRefreshing: isScheduleFetching || isOverridesFetching,
  };
}
