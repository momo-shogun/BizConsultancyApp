import type { ComponentType } from 'react';

export type ConsultationAvailability = 'limited' | 'available';

export type ConsultationTimePeriod = 'morning' | 'afternoon' | 'evening' | 'night';

export interface ConsultationDateOption {
  id: string;
  date: Date;
  label: string;
  slotCount: number;
  availability: ConsultationAvailability;
}

export interface ConsultationTimeSlot {
  id: string;
  label: string;
  period: ConsultationTimePeriod;
  available: boolean;
}

export interface ConsultationBookingMeta {
  consultantSlug?: string;
  consultantName?: string;
  problemCategory: string;
  problemSubCategory: string;
  consultationType: string;
  callType: string;
  city: string;
  language: string;
  price: number;
}

export interface ConsultationContactDetails {
  fullName: string;
  email: string;
  phone: string;
}

export interface ConsultationOnboardingFormState extends ConsultationBookingMeta {
  contact: ConsultationContactDetails;
  selectedDateId: string | null;
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
  consultantSlug?: string;
  consultantName?: string;
  problemCategory?: string;
  problemSubCategory?: string;
  consultationType?: string;
  callType?: string;
  city?: string;
  language?: string;
  price?: number;
}
