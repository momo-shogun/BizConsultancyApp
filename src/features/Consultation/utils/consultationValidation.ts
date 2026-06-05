import { isValidIndianMobile } from '@/utils/formatPhone';

import type {
  ConsultationOnboardingFormState,
  ConsultationTimeSlot,
} from '../types/consultationOnboarding.types';

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
  selectedTimeSlot: ConsultationTimeSlot | null,
): string | null {
  if (preferredDate == null) {
    return 'Please select a preferred date.';
  }
  if (selectedTimeSlot == null || selectedTimeSlot.id.trim().length === 0) {
    return 'Please select a preferred time slot.';
  }
  if (selectedTimeSlot.available === false) {
    return 'Selected time slot is no longer available. Please choose another.';
  }
  return null;
}

export function validateBookingSubmit(
  form: ConsultationOnboardingFormState,
  selectedTimeSlot: ConsultationTimeSlot | null,
): string | null {
  const contactError = validateContactStep(form.contact);
  if (contactError != null) {
    return contactError;
  }
  const scheduleError = validateScheduleStep(form.preferredDate, selectedTimeSlot);
  if (scheduleError != null) {
    return scheduleError;
  }
  if (form.consultantId == null || form.consultantId <= 0) {
    return 'Consultant information is missing. Please go back and try again.';
  }
  return null;
}
