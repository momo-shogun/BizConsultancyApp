import type {
  ConsultantBookingsFilter,
  ConsultantSelfBooking,
} from '../types/consultantSelfBooking.types';

export function getConsultantBookingPaymentLabel(booking: ConsultantSelfBooking): string {
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
  return 'Paid';
}

export function canConsultantStartCall(
  booking: ConsultantSelfBooking,
  filter: ConsultantBookingsFilter,
): boolean {
  if (filter !== 'upcoming' || booking.status !== 'confirmed') {
    return false;
  }
  const type = booking.consultationType.toLowerCase();
  return type === 'video' || type === 'phone';
}

export function getCustomerInitial(name: string): string {
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    return 'U';
  }
  return trimmed.charAt(0).toUpperCase();
}

export function formatConsultationTypeLabel(consultationType: string): string {
  const type = consultationType.toLowerCase();
  if (type === 'video') {
    return 'Video';
  }
  if (type === 'phone') {
    return 'Phone';
  }
  return consultationType;
}
