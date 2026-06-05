import type { CreateConsultantBookingPayload } from '../types/consultantBooking.types';
import type { ConsultationOnboardingFormState } from '../types/consultationOnboarding.types';
import { formatConsultationApiDate } from './consultationSlots';

export function mapCallTypeToConsultationType(
  callType: string | undefined,
): 'video' | 'phone' {
  const normalized = (callType ?? '').toLowerCase();
  if (normalized.includes('phone') || normalized.includes('voice')) {
    return 'phone';
  }
  return 'video';
}

export function consultationTypeLabel(type: 'video' | 'phone'): string {
  return type === 'phone' ? 'Audio call' : 'Video call';
}

export interface ConsultationTypeOption extends Record<string, unknown> {
  label: string;
  value: 'video' | 'phone';
}

export function buildConsultationTypeOptions(fees: ConsultationFeeRates): ConsultationTypeOption[] {
  const types: Array<'video' | 'phone'> = ['video', 'phone'];
  return types.map((type) => {
    const fee = resolveConsultationFee(type, fees);
    const baseLabel = consultationTypeLabel(type);
    return {
      value: type,
      label:
        fee > 0 ? `${baseLabel} — ₹${Math.round(fee).toLocaleString('en-IN')}/hr` : baseLabel,
    };
  });
}

export interface ConsultationFeeRates {
  videoRate: number;
  audioRate: number;
  rate: number;
}

/** Mirrors web `selectedFee` logic on consultant profile booking. */
export function resolveConsultationFee(
  consultationType: 'video' | 'phone',
  fees: ConsultationFeeRates,
): number {
  if (consultationType === 'video') {
    if (fees.videoRate > 0) {
      return fees.videoRate;
    }
    if (fees.audioRate > 0) {
      return fees.audioRate;
    }
    return fees.rate;
  }
  if (fees.audioRate > 0) {
    return fees.audioRate;
  }
  if (fees.videoRate > 0) {
    return fees.videoRate;
  }
  return fees.rate;
}

export function buildCreateConsultantBookingPayload(
  form: ConsultationOnboardingFormState,
  slotTime: string,
): CreateConsultantBookingPayload | null {
  if (form.consultantId == null || form.consultantId <= 0) {
    return null;
  }
  if (form.preferredDate == null || slotTime.trim().length === 0) {
    return null;
  }

  const name = form.contact.fullName.trim();
  const phone = form.contact.phone.trim();
  const email = form.contact.email.trim();

  if (name.length < 2 || phone.length === 0) {
    return null;
  }

  const payload: CreateConsultantBookingPayload = {
    consultantId: form.consultantId,
    name,
    phone,
    consultationType: form.consultationType,
    bookingDate: formatConsultationApiDate(form.preferredDate),
    slotTime: slotTime.trim(),
  };

  if (email.length > 0) {
    payload.email = email;
  }

  const notes = form.notes.trim();
  if (notes.length > 0) {
    payload.notes = notes;
  }

  return payload;
}
