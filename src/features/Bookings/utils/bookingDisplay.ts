import type { MyConsultantBooking } from '../types/myConsultantBooking.types';

export function getPaymentLabel(booking: MyConsultantBooking): string {
  if (booking.paymentStatus !== 'paid') {
    return booking.paymentStatus;
  }
  if ((booking.amount ?? 0) <= 0) {
    return 'Free';
  }
  if (booking.paymentMethod === 'wallet') {
    return 'Paid via Wallet';
  }
  if (booking.paymentMethod === 'online') {
    return 'Paid via Razorpay';
  }
  if (booking.razorpayPaymentId != null || booking.razorpayOrderId != null) {
    return 'Paid via Razorpay';
  }
  return 'Paid';
}

export type BookingStatusTone = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'default';

export function getBookingStatusTone(status: string): BookingStatusTone {
  const normalized = status.toLowerCase();
  if (normalized === 'pending') {
    return 'pending';
  }
  if (normalized === 'confirmed') {
    return 'confirmed';
  }
  if (normalized === 'completed') {
    return 'completed';
  }
  if (normalized === 'cancelled' || normalized === 'canceled') {
    return 'cancelled';
  }
  return 'default';
}

export type BookingConsultationKind = 'phone' | 'video' | 'other';

/** Normalizes API `consultationType` (`phone` | `video`). */
export function getBookingConsultationKind(consultationType: string): BookingConsultationKind {
  const type = consultationType.trim().toLowerCase();
  if (type === 'video') {
    return 'video';
  }
  if (type === 'phone') {
    return 'phone';
  }
  return 'other';
}

export function isCallableConsultation(consultationType: string): boolean {
  return getBookingConsultationKind(consultationType) !== 'other';
}

export function canShowCallAction(
  booking: MyConsultantBooking,
  filter: 'upcoming' | 'past',
): boolean {
  if (filter !== 'upcoming' || booking.status !== 'confirmed') {
    return false;
  }
  return isCallableConsultation(booking.consultationType);
}
