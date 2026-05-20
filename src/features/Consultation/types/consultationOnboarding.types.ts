import type { ComponentType } from 'react';

import type { ConsultationTypeApi } from './consultantBooking.types';

export type ConsultationTimePeriod = 'morning' | 'afternoon' | 'evening' | 'night';

export interface ConsultationTimeSlot {
  id: string;
  label: string;
  period: ConsultationTimePeriod;
  available: boolean;
}

/** Morning / Afternoon / Evening groups from available-slots API. */
export interface ConsultationSlotGroup {
  label: string;
  period: ConsultationTimePeriod;
  slots: ConsultationTimeSlot[];
}

export interface ConsultationContactDetails {
  fullName: string;
  email: string;
  phone: string;
}

export interface ConsultationOnboardingFormState {
  consultantId: number | null;
  consultantSlug?: string;
  consultantName?: string;
  consultationType: ConsultationTypeApi;
  notes: string;
  /** Shown on payment step only; not sent in create-booking payload. */
  price: number;
  contact: ConsultationContactDetails;
  preferredDate: Date | null;
  /** Slot label from API, e.g. `"9:00 AM"`. */
  selectedTimeSlotId: string | null;
}

export interface ConsultationStepComponentProps {
  stepIndex: number;
  totalSteps: number;
}

export interface ConsultationStepConfig {
  key: string;
  title: string;
  description: string;
  component: ComponentType<ConsultationStepComponentProps>;
}

export interface ConsultationOnboardingRouteParams {
  consultantId?: number;
  consultantSlug?: string;
  consultantName?: string;
  /** API value: `video` | `phone`. */
  consultationType?: ConsultationTypeApi;
  /** Legacy UI label; mapped to `consultationType` when needed. */
  callType?: string;
  price?: number;
}
