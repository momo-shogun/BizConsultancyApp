import type {
  OnboardingDraftPayload,
  OnboardingFieldValue,
  OnboardingForm,
  OnboardingSubmitPayload,
  ServiceRegistrationIntakePayload,
} from '../../types/serviceOnboarding.types';

export interface OnboardingContactFields {
  name: string;
  email: string;
  mobile: string;
  city: string;
}

export function normalizeIndianMobile(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 10) {
    return digits;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  if (digits.length > 10) {
    return digits.slice(-10);
  }
  return digits;
}

export function buildIntakePayload(params: {
  serviceSlug: string;
  form: OnboardingForm | null;
  serviceTitle: string;
  contact: OnboardingContactFields;
}): ServiceRegistrationIntakePayload {
  return {
    serviceSlug: params.serviceSlug.trim(),
    formId: params.form?.id ?? null,
    name: params.contact.name.trim(),
    email: params.contact.email.trim(),
    mobile: normalizeIndianMobile(params.contact.mobile),
    city: params.contact.city.trim() || null,
    serviceName: params.serviceTitle.trim() || null,
  };
}

export function buildDraftPayload(params: {
  submissionId: number | null;
  form: OnboardingForm | null;
  serviceSlug: string;
  serviceTitle: string;
  contact: OnboardingContactFields;
  formValues: Record<string, OnboardingFieldValue>;
}): OnboardingDraftPayload {
  return {
    existingSubmissionId: params.submissionId ?? undefined,
    formId: params.form?.id ?? undefined,
    serviceSlug: params.serviceSlug.trim() || undefined,
    answers: params.formValues as Record<string, unknown>,
    name: params.contact.name.trim() || undefined,
    email: params.contact.email.trim() || undefined,
    mobile: normalizeIndianMobile(params.contact.mobile) || undefined,
    city: params.contact.city.trim() || undefined,
    serviceName: params.serviceTitle.trim() || undefined,
  };
}

export function buildSubmitPayload(params: {
  submissionId: number | null;
  form: OnboardingForm | null;
  serviceSlug: string;
  serviceTitle: string;
  contact: OnboardingContactFields;
  formValues: Record<string, OnboardingFieldValue>;
  paymentMode?: 'razorpay' | 'wallet';
  orderId?: string;
  paymentId?: string;
  amountInPaise?: number;
}): OnboardingSubmitPayload {
  const payload: OnboardingSubmitPayload = {
    existingSubmissionId: params.submissionId ?? undefined,
    formId: params.form?.id ?? undefined,
    serviceSlug: params.serviceSlug.trim() || undefined,
    answers: (params.formValues as Record<string, unknown>) ?? {},
    name: params.contact.name.trim() || undefined,
    email: params.contact.email.trim() || undefined,
    mobile: normalizeIndianMobile(params.contact.mobile) || undefined,
    city: params.contact.city.trim() || undefined,
    serviceName: params.serviceTitle.trim() || undefined,
  };

  if (params.form == null) {
    payload.answers = {};
  }

  if (params.paymentMode === 'razorpay' && params.orderId != null && params.paymentId != null) {
    payload.paymentMode = 'razorpay';
    payload.orderId = params.orderId;
    payload.paymentId = params.paymentId;
    payload.transactionDate = new Date().toISOString();
    payload.amount =
      params.amountInPaise != null
        ? (params.amountInPaise / 100).toFixed(2)
        : undefined;
  } else if (params.paymentMode === 'wallet') {
    payload.paymentMode = 'wallet';
    payload.transactionDate = new Date().toISOString();
    payload.amount =
      params.amountInPaise != null
        ? (params.amountInPaise / 100).toFixed(2)
        : undefined;
  }

  return payload;
}
