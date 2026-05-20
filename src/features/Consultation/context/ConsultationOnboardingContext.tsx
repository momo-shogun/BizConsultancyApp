import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  selectDisplayName,
  selectLoggedInEmail,
  selectLoggedInMobile,
} from '@/features/Auth/store/authSelectors';
import { useAppSelector } from '@/store/typedHooks';

import { buildConsultationTimeSlots } from '../data/demoSchedule';
import type {
  ConsultationOnboardingFormState,
  ConsultationOnboardingRouteParams,
  ConsultationTimeSlot,
} from '../types/consultationOnboarding.types';

interface ConsultationOnboardingContextValue {
  form: ConsultationOnboardingFormState;
  timeSlots: ConsultationTimeSlot[];
  setContactField: (
    field: keyof ConsultationOnboardingFormState['contact'],
    value: string,
  ) => void;
  setPreferredDate: (date: Date) => void;
  setSelectedTimeSlotId: (slotId: string) => void;
  selectedTimeSlot: ConsultationTimeSlot | null;
}

const ConsultationOnboardingContext = createContext<ConsultationOnboardingContextValue | null>(
  null,
);

function buildInitialForm(
  params: ConsultationOnboardingRouteParams,
  defaults?: { fullName: string; email: string; phone: string },
): ConsultationOnboardingFormState {
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
      fullName: defaults?.fullName ?? '',
      email: defaults?.email ?? '',
      phone: defaults?.phone ?? '',
    },
    preferredDate: null,
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
  const displayName = useAppSelector(selectDisplayName);
  const mobile = useAppSelector(selectLoggedInMobile);
  const email = useAppSelector(selectLoggedInEmail);

  const loggedInDefaults = useMemo(
    () => ({
      fullName: displayName?.trim() ?? '',
      phone: mobile != null ? mobile.replace(/\D/g, '').slice(0, 10) : '',
      email: email?.trim() ?? '',
    }),
    [displayName, mobile, email],
  );

  const [form, setForm] = useState<ConsultationOnboardingFormState>(() =>
    buildInitialForm(props.params, loggedInDefaults),
  );

  /** If Redux auth hydrates after first paint, merge stored name / phone / email into empty fields once. */
  const mergedAuthDefaultsRef = useRef<boolean>(false);
  useEffect(() => {
    if (mergedAuthDefaultsRef.current) {
      return;
    }
    const hasAny =
      loggedInDefaults.fullName.length > 0 ||
      loggedInDefaults.phone.length > 0 ||
      loggedInDefaults.email.length > 0;
    if (!hasAny) {
      return;
    }
    mergedAuthDefaultsRef.current = true;

    setForm((prev) => {
      const nextPhone = prev.contact.phone || loggedInDefaults.phone;
      const nextName = prev.contact.fullName || loggedInDefaults.fullName;
      const nextEmail = prev.contact.email || loggedInDefaults.email;
      if (
        nextPhone === prev.contact.phone &&
        nextName === prev.contact.fullName &&
        nextEmail === prev.contact.email
      ) {
        return prev;
      }
      return {
        ...prev,
        contact: {
          ...prev.contact,
          fullName: nextName,
          phone: nextPhone,
          email: nextEmail,
        },
      };
    });
  }, [loggedInDefaults.fullName, loggedInDefaults.phone, loggedInDefaults.email]);

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

  const setPreferredDate = useCallback((date: Date) => {
    setForm((prev) => ({
      ...prev,
      preferredDate: date,
      selectedTimeSlotId: null,
    }));
  }, []);

  const setSelectedTimeSlotId = useCallback((slotId: string) => {
    setForm((prev) => ({ ...prev, selectedTimeSlotId: slotId }));
  }, []);

  const selectedTimeSlot = useMemo(
    () => timeSlots.find((item) => item.id === form.selectedTimeSlotId) ?? null,
    [form.selectedTimeSlotId, timeSlots],
  );

  const value = useMemo(
    (): ConsultationOnboardingContextValue => ({
      form,
      timeSlots,
      setContactField,
      setPreferredDate,
      setSelectedTimeSlotId,
      selectedTimeSlot,
    }),
    [
      form,
      selectedTimeSlot,
      setContactField,
      setPreferredDate,
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
