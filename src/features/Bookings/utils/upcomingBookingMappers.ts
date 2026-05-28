import type { UpcomingBookingItem } from '@/shared/components';

import type { ConsultantSelfBooking } from '../types/consultantSelfBooking.types';
import type { MyConsultantBooking } from '../types/myConsultantBooking.types';
import {
  buildBookingDateTime,
  formatBookingDate,
  hasBookingStarted,
  isBookingUpcoming,
} from './bookingDateTime';
import {
  canShowCallAction,
  getBookingConsultationKind,
  isBookingConfirmed,
} from './bookingDisplay';
import { canConsultantStartCall, formatConsultationTypeLabel } from './consultantSelfBookingDisplay';

const HOME_UPCOMING_PREVIEW_LIMIT = 5;

function formatStatusLabel(status: string): string {
  const normalized = status.trim();
  if (normalized.length === 0) {
    return 'Upcoming';
  }
  return normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
}

function mapConsultationToCallType(consultationType: string): UpcomingBookingItem['callType'] {
  return getBookingConsultationKind(consultationType) === 'video' ? 'video' : 'audio';
}

function sortBySlotAscending<T extends { bookingDate: string; slotTime: string }>(
  bookings: T[],
): T[] {
  return [...bookings].sort((a, b) => {
    const aTime = buildBookingDateTime(a.bookingDate, a.slotTime)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    const bTime = buildBookingDateTime(b.bookingDate, b.slotTime)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    return aTime - bTime;
  });
}

export function mapUserBookingToUpcomingItem(booking: MyConsultantBooking): UpcomingBookingItem {
  const consultantName = booking.consultantName?.trim() || booking.name?.trim() || 'Consultant';
  const consultationLabel = formatConsultationTypeLabel(booking.consultationType);

  return {
    id: String(booking.id),
    dateLabel: formatBookingDate(booking.bookingDate),
    timeLabel: booking.slotTime,
    consultantName,
    consultantTitle: `${consultationLabel} consultation`,
    callType: mapConsultationToCallType(booking.consultationType),
    statusLabel: isBookingConfirmed(booking.status) ? 'Confirmed' : formatStatusLabel(booking.status),
  };
}

export function mapConsultantBookingToUpcomingItem(booking: ConsultantSelfBooking): UpcomingBookingItem {
  const clientName = booking.name.trim() || 'Client';
  const consultationLabel = formatConsultationTypeLabel(booking.consultationType);

  return {
    id: String(booking.id),
    dateLabel: formatBookingDate(booking.bookingDate),
    timeLabel: booking.slotTime,
    consultantName: clientName,
    consultantTitle: `${consultationLabel} session`,
    callType: mapConsultationToCallType(booking.consultationType),
    statusLabel:
      booking.status.toLowerCase() === 'confirmed' ? 'Confirmed' : formatStatusLabel(booking.status),
  };
}

export function canJoinUserBookingFromHome(booking: MyConsultantBooking): boolean {
  return (
    canShowCallAction(booking, 'upcoming') && hasBookingStarted(booking.bookingDate, booking.slotTime)
  );
}

export function canJoinConsultantBookingFromHome(booking: ConsultantSelfBooking): boolean {
  return canConsultantStartCall(booking, 'upcoming');
}

export function selectUserUpcomingBookingsForHome(
  bookings: MyConsultantBooking[],
  limit = HOME_UPCOMING_PREVIEW_LIMIT,
): MyConsultantBooking[] {
  const upcoming = bookings.filter((b) => isBookingUpcoming(b.bookingDate, b.slotTime));
  return sortBySlotAscending(upcoming).slice(0, limit);
}

export function selectConsultantUpcomingBookingsForHome(
  bookings: ConsultantSelfBooking[],
  limit = HOME_UPCOMING_PREVIEW_LIMIT,
): ConsultantSelfBooking[] {
  const upcoming = bookings.filter((b) => isBookingUpcoming(b.bookingDate, b.slotTime));
  return sortBySlotAscending(upcoming).slice(0, limit);
}

export const HOME_UPCOMING_BOOKINGS_LIMIT = HOME_UPCOMING_PREVIEW_LIMIT;
