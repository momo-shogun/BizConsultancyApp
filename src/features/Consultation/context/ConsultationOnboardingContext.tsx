import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import {
  buildConsultationDateOptions,
  buildConsultationTimeSlots,
} from '../data/demoSchedule';
import type {
  ConsultationDateOption,
  ConsultationOnboardingFormState,
  ConsultationOnboardingRouteParams,
  ConsultationTimeSlot,
} from '../types/consultationOnboarding.types';

interface ConsultationOnboardingContextValue {
  form: ConsultationOnboardingFormState;
  dateOptions: ConsultationDateOption[];
  timeSlots: ConsultationTimeSlot[];
  setContactField: (
    field: keyof ConsultationOnboardingFormState['contact'],
    value: string,
  ) => void;
  setSelectedDateId: (dateId: string) => void;
  setSelectedTimeSlotId: (slotId: string) => void;
  selectedDate: ConsultationDateOption | null;
  selectedTimeSlot: ConsultationTimeSlot | null;
}

const ConsultationOnboardingContext = createContext<ConsultationOnboardingContextValue | null>(
  null,
);

function buildInitialForm(params: ConsultationOnboardingRouteParams): ConsultationOnboardingFormState {
  return {
    consultantSlug: params.consultantSlug,
    consultantName: params.consultantName,
    problemCategory: params.problemCategory ?? 'Consumer Lawyer',
    problemSubCategory: params.problemSubCategory ?? 'Consumer Law Consultation',
    consultationType: params.consultationType ?? 'Consult Now',
    callType: params.callType ?? 'Video Call',
    city: params.city ?? 'Nizamabad',
    language: params.language ?? 'Telugu',
    price: params.price ?? 99,
    contact: {
      fullName: '',
      email: '',
      phone: '',
    },
    selectedDateId: null,
    selectedTimeSlotId: null,
  };
}

interface ConsultationOnboardingProviderProps {
  params: ConsultationOnboardingRouteParams;
  children: React.ReactNode;
}

export function ConsultationOnboardingProvider(
  props: ConsultationOnboardingProviderProps,
): React.ReactElement {
  const [form, setForm] = useState<ConsultationOnboardingFormState>(() =>
    buildInitialForm(props.params),
  );

  const dateOptions = useMemo(() => buildConsultationDateOptions(), []);
  const timeSlots = useMemo(() => buildConsultationTimeSlots(), []);

  const setContactField = useCallback(
    (field: keyof ConsultationOnboardingFormState['contact'], value: string) => {
      setForm((prev) => ({
        ...prev,
        contact: { ...prev.contact, [field]: value },
      }));
    },
    [],
  );

  const setSelectedDateId = useCallback((dateId: string) => {
    setForm((prev) => ({
      ...prev,
      selectedDateId: dateId,
      selectedTimeSlotId: null,
    }));
  }, []);

  const setSelectedTimeSlotId = useCallback((slotId: string) => {
    setForm((prev) => ({ ...prev, selectedTimeSlotId: slotId }));
  }, []);

  const selectedDate = useMemo(
    () => dateOptions.find((item) => item.id === form.selectedDateId) ?? null,
    [dateOptions, form.selectedDateId],
  );

  const selectedTimeSlot = useMemo(
    () => timeSlots.find((item) => item.id === form.selectedTimeSlotId) ?? null,
    [form.selectedTimeSlotId, timeSlots],
  );

  const value = useMemo(
    (): ConsultationOnboardingContextValue => ({
      form,
      dateOptions,
      timeSlots,
      setContactField,
      setSelectedDateId,
      setSelectedTimeSlotId,
      selectedDate,
      selectedTimeSlot,
    }),
    [
      dateOptions,
      form,
      selectedDate,
      selectedTimeSlot,
      setContactField,
      setSelectedDateId,
      setSelectedTimeSlotId,
      timeSlots,
    ],
  );

  return (
    <ConsultationOnboardingContext.Provider value={value}>
      {props.children}
    </ConsultationOnboardingContext.Provider>
  );
}

export function useConsultationOnboarding(): ConsultationOnboardingContextValue {
  const context = useContext(ConsultationOnboardingContext);
  if (context == null) {
    throw new Error('useConsultationOnboarding must be used within ConsultationOnboardingProvider');
  }
  return context;
}
