import type {
  ConsultantBookingsFilter,
  ConsultantSelfBooking,
} from '../types/consultantSelfBooking.types';
import { isBookingUpcoming, parseBookingDate } from './bookingDateTime';

export function categorizeConsultantBooking(
  booking: ConsultantSelfBooking,
  now = new Date(),
): ConsultantBookingsFilter {
  const status = booking.status.toLowerCase();
  const paymentStatus = booking.paymentStatus.toLowerCase();

  if (status === 'cancelled' || paymentStatus === 'failed' || paymentStatus === 'refunded') {
    return 'past';
  }
  if (isBookingUpcoming(booking.bookingDate, booking.slotTime, now)) {
    return 'upcoming';
  }

  const dateOnly = parseBookingDate(booking.bookingDate);
  if (dateOnly == null) {
    return 'past';
  }

  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  return dateOnly.getTime() >= today.getTime() ? 'upcoming' : 'past';
}

export function groupConsultantBookingsByTab(
  bookings: ConsultantSelfBooking[],
  now = new Date(),
): Record<ConsultantBookingsFilter, ConsultantSelfBooking[]> {
  const grouped: Record<ConsultantBookingsFilter, ConsultantSelfBooking[]> = {
    upcoming: [],
    past: [],
  };

  for (const booking of bookings) {
    const tab = categorizeConsultantBooking(booking, now);
    grouped[tab].push(booking);
  }

  return grouped;
}

export function filterConsultantBookingsBySearch(
  bookings: ConsultantSelfBooking[],
  query: string,
): ConsultantSelfBooking[] {
  const q = query.trim().toLowerCase();
  if (q.length === 0) {
    return bookings;
  }
  return bookings.filter((b) => {
    const name = b.name.toLowerCase();
    const email = b.email.toLowerCase();
    return name.includes(q) || email.includes(q);
  });
}
