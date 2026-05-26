import type { CreateMembershipRegistrationResult } from '../types/membershipRegistration.types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

export function parseCreateMembershipRegistration(
  raw: unknown,
): CreateMembershipRegistrationResult {
  const root = isRecord(raw) ? raw : {};
  const registration = isRecord(root.registration) ? root.registration : root;

  const paymentStatus =
    typeof root.paymentStatus === 'string'
      ? root.paymentStatus
      : typeof registration.paymentStatus === 'string'
        ? registration.paymentStatus
        : '';

  const razorpayOrderId =
    typeof root.razorpayOrderId === 'string'
      ? root.razorpayOrderId
      : typeof registration.razorpayOrderId === 'string'
        ? registration.razorpayOrderId
        : typeof registration.orderId === 'string'
          ? registration.orderId
          : null;

  const razorpayKeyId =
    typeof root.razorpayKeyId === 'string' ? root.razorpayKeyId : null;

  const amountRaw = root.amount ?? registration.amount;
  const amountPaise =
    typeof amountRaw === 'number' && Number.isFinite(amountRaw) ? amountRaw : null;

  return {
    paymentStatus,
    razorpayOrderId,
    razorpayKeyId,
    amountPaise,
  };
}

export function readMembershipApiErrorMessage(error: unknown, fallback: string): string {
  if (
    error != null &&
    typeof error === 'object' &&
    'data' in error &&
    error.data != null &&
    typeof error.data === 'object'
  ) {
    const message = (error.data as { message?: unknown }).message;
    if (typeof message === 'string' && message.trim().length > 0) {
      return message;
    }
    if (Array.isArray(message)) {
      return message.map((part) => String(part)).join(', ');
    }
  }
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }
  return fallback;
}
