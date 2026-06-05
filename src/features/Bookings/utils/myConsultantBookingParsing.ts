import type {
  MyConsultantBooking,
  MyConsultantBookingsMeta,
  MyConsultantBookingsPage,
} from '../types/myConsultantBooking.types';
import { normalizeBookingDateString } from './bookingDateTime';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function parsePaymentMethod(value: unknown): 'wallet' | 'online' | null {
  if (value === 'wallet' || value === 'online') {
    return value;
  }
  return null;
}

export function parseMyConsultantBooking(raw: unknown): MyConsultantBooking | null {
  if (!isRecord(raw)) {
    return null;
  }
  const id = typeof raw.id === 'number' ? raw.id : null;
  const consultantId = typeof raw.consultantId === 'number' ? raw.consultantId : null;
  const bookingDate = normalizeBookingDateString(raw.bookingDate);
  const slotTime = typeof raw.slotTime === 'string' ? raw.slotTime : null;
  if (id == null || consultantId == null || bookingDate == null || slotTime == null) {
    return null;
  }

  return {
    id,
    consultantId,
    consultantName: typeof raw.consultantName === 'string' ? raw.consultantName : null,
    consultantSlug: typeof raw.consultantSlug === 'string' ? raw.consultantSlug : null,
    name: typeof raw.name === 'string' ? raw.name : '',
    email: typeof raw.email === 'string' ? raw.email : '',
    phone: typeof raw.phone === 'string' ? raw.phone : '',
    consultationType: typeof raw.consultationType === 'string' ? raw.consultationType : '',
    notes: typeof raw.notes === 'string' ? raw.notes : null,
    bookingDate,
    slotTime,
    status: typeof raw.status === 'string' ? raw.status : 'pending',
    paymentStatus: typeof raw.paymentStatus === 'string' ? raw.paymentStatus : '',
    paymentMethod: parsePaymentMethod(raw.paymentMethod),
    amount: typeof raw.amount === 'number' ? raw.amount : null,
    razorpayOrderId: typeof raw.razorpayOrderId === 'string' ? raw.razorpayOrderId : null,
    razorpayPaymentId:
      typeof raw.razorpayPaymentId === 'string' ? raw.razorpayPaymentId : null,
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : '',
  };
}

function parseMeta(raw: unknown): MyConsultantBookingsMeta {
  if (!isRecord(raw)) {
    return { total: 0, page: 1, limit: 20, totalPages: 1 };
  }
  return {
    total: typeof raw.total === 'number' ? raw.total : 0,
    page: typeof raw.page === 'number' ? raw.page : 1,
    limit: typeof raw.limit === 'number' ? raw.limit : 20,
    totalPages: typeof raw.totalPages === 'number' ? Math.max(1, raw.totalPages) : 1,
  };
}

export function parseMyConsultantBookingsPage(raw: unknown): MyConsultantBookingsPage {
  if (!isRecord(raw)) {
    return { data: [], meta: parseMeta(null) };
  }
  const rows = Array.isArray(raw.data) ? raw.data : [];
  const data = rows
    .map(parseMyConsultantBooking)
    .filter((row): row is MyConsultantBooking => row != null);

  return {
    data,
    meta: parseMeta(raw.meta),
  };
}

export function dedupeBookings(bookings: MyConsultantBooking[]): MyConsultantBooking[] {
  const seen = new Set<number>();
  return bookings.filter((b) => {
    if (seen.has(b.id)) {
      return false;
    }
    seen.add(b.id);
    return true;
  });
}
