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
  preferredDate: Date | null,
  selectedTimeSlotId: string | null,
): string | null {
  if (preferredDate == null) {
    return 'Please select a preferred date.';
  }
  if (selectedTimeSlotId == null || selectedTimeSlotId.trim().length === 0) {
    return 'Please select a preferred time slot.';
  }
  return null;
}

export function validateBookingSubmit(form: ConsultationOnboardingFormState): string | null {
  const contactError = validateContactStep(form.contact);
  if (contactError != null) {
    return contactError;
  }
  const scheduleError = validateScheduleStep(form.preferredDate, form.selectedTimeSlotId);
  if (scheduleError != null) {
    return scheduleError;
  }
  if (form.consultantId == null || form.consultantId <= 0) {
    return 'Consultant information is missing. Please go back and try again.';
  }
  return null;
}
