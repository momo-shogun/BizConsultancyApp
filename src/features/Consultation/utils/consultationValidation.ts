import { isValidIndianMobile } from '@/utils/formatPhone';

import type { ConsultationOnboardingFormState } from '../types/consultationOnboarding.types';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

export function validateContactStep(
  contact: ConsultationOnboardingFormState['contact'],
): string | null {
  if (contact.fullName.trim().length < 2) {
    return 'Please enter your full name.';
  }
  if (!isValidEmail(contact.email)) {
    return 'Please enter a valid email address.';
  }
  if (!isValidIndianMobile(contact.phone)) {
    return 'Please enter a valid 10-digit mobile number.';
  }
  return null;
}

export function validateScheduleStep(
  selectedDateId: string | null,
  selectedTimeSlotId: string | null,
): string | null {
  if (selectedDateId == null) {
    return 'Please select a preferred date.';
  }
  if (selectedTimeSlotId == null) {
    return 'Please select a preferred time slot.';
  }
  return null;
}
