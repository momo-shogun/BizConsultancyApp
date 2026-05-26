import type { ConsultantSelfBooking } from '../types/consultantSelfBooking.types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function parsePaymentMethod(value: unknown): 'wallet' | 'online' | null {
  if (value === 'wallet' || value === 'online') {
    return value;
  }
  return null;
}

function normalizeBookingDate(value: unknown): string | null {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }
  return null;
}

export function parseConsultantSelfBooking(raw: unknown): ConsultantSelfBooking | null {
  if (!isRecord(raw)) {
    return null;
  }
  const id = typeof raw.id === 'number' ? raw.id : null;
  const consultantId = typeof raw.consultantId === 'number' ? raw.consultantId : null;
  const bookingDate = normalizeBookingDate(raw.bookingDate);
  const slotTime = typeof raw.slotTime === 'string' ? raw.slotTime : null;
  if (id == null || consultantId == null || bookingDate == null || slotTime == null) {
    return null;
  }

  return {
    id,
    consultantId,
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
  };
}

export function parseConsultantSelfBookingsList(raw: unknown): ConsultantSelfBooking[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw
    .map(parseConsultantSelfBooking)
    .filter((row): row is ConsultantSelfBooking => row != null);
}
