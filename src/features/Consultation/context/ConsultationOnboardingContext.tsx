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
import { useGetAvailableSlotsQuery, useGetPublicConsultantBySlugQuery } from '@/features/consultant/api/consultantApi';
import { useAppSelector } from '@/store/typedHooks';

import type { ConsultationTypeApi } from '../types/consultantBooking.types';
import {
  mapCallTypeToConsultationType,
  resolveConsultationFee,
  type ConsultationFeeRates,
} from '../utils/consultationBooking';
import type {
  ConsultationOnboardingFormState,
  ConsultationOnboardingRouteParams,
  ConsultationSlotGroup,
  ConsultationTimeSlot,
} from '../types/consultationOnboarding.types';
import {
  formatConsultationApiDate,
  mapSlotLabelsToConsultationGroups,
  todayStart,
} from '../utils/consultationSlots';

interface ConsultationOnboardingContextValue {
  form: ConsultationOnboardingFormState;
  feeRates: ConsultationFeeRates;
  slotGroups: ConsultationSlotGroup[];
  slotsLoading: boolean;
  slotsError: boolean;
  setContactField: (
    field: keyof ConsultationOnboardingFormState['contact'],
    value: string,
  ) => void;
  setConsultationType: (type: ConsultationTypeApi) => void;
  setPreferredDate: (date: Date) => void;
  setSelectedTimeSlotId: (slotId: string) => void;
  selectedTimeSlot: ConsultationTimeSlot | null;
}

const ConsultationOnboardingContext = createContext<ConsultationOnboardingContextValue | null>(
  null,
);

function resolveConsultationType(
  params: ConsultationOnboardingRouteParams,
): ConsultationOnboardingFormState['consultationType'] {
  if (params.consultationType === 'video' || params.consultationType === 'phone') {
    return params.consultationType;
  }
  return mapCallTypeToConsultationType(params.callType);
}

function buildInitialForm(
  params: ConsultationOnboardingRouteParams,
  defaults?: { fullName: string; email: string; phone: string },
): ConsultationOnboardingFormState {
  const consultantId =
    params.consultantId != null && params.consultantId > 0 ? params.consultantId : null;

  return {
    consultantId,
    consultantSlug: params.consultantSlug,
    consultantName: params.consultantName,
    consultationType: resolveConsultationType(params),
    notes: '',
    price: params.price ?? 0,
    contact: {
      fullName: defaults?.fullName ?? '',
      email: defaults?.email ?? '',
      phone: defaults?.phone ?? '',
    },
    preferredDate: todayStart(),
    selectedTimeSlotId: null,
  };
}

function slotLabelFromApi(slot: { label?: string; startTime: string }): string {
  const label = slot.label?.trim();
  return label != null && label.length > 0 ? label : slot.startTime.trim();
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

  const [feeRates, setFeeRates] = useState<ConsultationFeeRates>(() => ({
    videoRate: 0,
    audioRate: 0,
    rate: props.params.price ?? 0,
  }));

  const preferredDateParam = useMemo(
    () => (form.preferredDate != null ? formatConsultationApiDate(form.preferredDate) : ''),
    [form.preferredDate],
  );

  const consultantSlug = form.consultantSlug?.trim() ?? '';

  const { data: consultantBySlug } = useGetPublicConsultantBySlugQuery(consultantSlug, {
    skip: consultantSlug.length === 0,
  });

  useEffect(() => {
    if (consultantBySlug == null) {
      return;
    }
    const parsedId = Number(consultantBySlug.id);
    const hasValidId = Number.isFinite(parsedId) && parsedId > 0;

    const nextFeeRates: ConsultationFeeRates = {
      videoRate: consultantBySlug.videoRate,
      audioRate: consultantBySlug.audioRate,
      rate: consultantBySlug.rate,
    };

    setFeeRates(nextFeeRates);

    setForm((prev) => {
      const resolvedFee = resolveConsultationFee(prev.consultationType, nextFeeRates);
      return {
        ...prev,
        consultantId: prev.consultantId ?? (hasValidId ? parsedId : null),
        consultantName: prev.consultantName ?? consultantBySlug.name,
        price: resolvedFee > 0 ? resolvedFee : prev.price,
      };
    });
  }, [consultantBySlug]);

  const canFetchSlots = consultantSlug.length > 0 && preferredDateParam.length > 0;

  const {
    data: slotsData,
    isFetching: slotsLoading,
    isError: slotsError,
  } = useGetAvailableSlotsQuery(
    { slug: consultantSlug, date: preferredDateParam },
    { skip: !canFetchSlots },
  );

  const slotGroups = useMemo((): ConsultationSlotGroup[] => {
    if (slotsData == null) {
      return [];
    }
    const labels = slotsData.slots.map(slotLabelFromApi).filter((label) => label.length > 0);
    return mapSlotLabelsToConsultationGroups(labels);
  }, [slotsData]);

  const allTimeSlots = useMemo(
    () => slotGroups.flatMap((group) => group.slots),
    [slotGroups],
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

  const setContactField = useCallback(
    (field: keyof ConsultationOnboardingFormState['contact'], value: string) => {
      setForm((prev) => ({
        ...prev,
        contact: { ...prev.contact, [field]: value },
      }));
    },
    [],
  );

  const setConsultationType = useCallback((type: ConsultationTypeApi) => {
    setForm((prev) => ({
      ...prev,
      consultationType: type,
      price: resolveConsultationFee(type, feeRates),
    }));
  }, [feeRates]);

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
    () => allTimeSlots.find((item) => item.id === form.selectedTimeSlotId) ?? null,
    [allTimeSlots, form.selectedTimeSlotId],
  );

  const value = useMemo(
    (): ConsultationOnboardingContextValue => ({
      form,
      feeRates,
      slotGroups,
      slotsLoading: canFetchSlots && slotsLoading,
      slotsError,
      setContactField,
      setConsultationType,
      setPreferredDate,
      setSelectedTimeSlotId,
      selectedTimeSlot,
    }),
    [
      canFetchSlots,
      feeRates,
      form,
      selectedTimeSlot,
      setContactField,
      setConsultationType,
      setPreferredDate,
      setSelectedTimeSlotId,
      slotGroups,
      slotsError,
      slotsLoading,
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
