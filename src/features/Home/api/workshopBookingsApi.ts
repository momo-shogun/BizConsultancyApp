import { baseApi } from '@/services/api/baseApi';

export interface WorkshopBookingItem {
  id: number;
  workshopId: number;
  paymentStatus: string;
  amount: number;
  bookingStatus: string;
  type: string;
  createdAt: string;
}

export interface CreateWorkshopBookingRequest {
  workshopId: number;
  type: 'free' | 'online' | 'wallet';
}

export interface CreateWorkshopBookingFreeResult {
  id: number;
  workshopId: number;
  paymentStatus: string;
  amount: number;
  bookingStatus: string;
  type: string;
}

export interface CreateWorkshopBookingPaidResult {
  booking: CreateWorkshopBookingFreeResult;
  razorpayOrderId: string;
  razorpayKeyId: string;
  /** Amount in paise for Razorpay checkout. */
  amount: number;
}

export interface ConfirmWorkshopBookingRequest {
  orderId: string;
  paymentId: string;
}

export interface ConfirmWorkshopBookingResult {
  id: number;
  paymentStatus: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function parseBookingRow(raw: Record<string, unknown>): WorkshopBookingItem | null {
  const id = Number(raw.id);
  const workshopId = Number(raw.workshopId);
  if (!Number.isFinite(id) || !Number.isFinite(workshopId)) {
    return null;
  }
  return {
    id,
    workshopId,
    paymentStatus: String(raw.paymentStatus ?? ''),
    amount: Number(raw.amount ?? 0),
    bookingStatus: String(raw.bookingStatus ?? ''),
    type: String(raw.type ?? ''),
    createdAt: String(raw.createdAt ?? ''),
  };
}

function parseBookingList(raw: unknown): WorkshopBookingItem[] {
  const rows = Array.isArray(raw) ? raw : isRecord(raw) && Array.isArray(raw.data) ? raw.data : [];
  const result: WorkshopBookingItem[] = [];
  for (const item of rows) {
    if (!isRecord(item)) {
      continue;
    }
    const row = parseBookingRow(item);
    if (row != null) {
      result.push(row);
    }
  }
  return result;
}

function parseFreeBooking(raw: Record<string, unknown>): CreateWorkshopBookingFreeResult {
  return {
    id: Number(raw.id),
    workshopId: Number(raw.workshopId),
    paymentStatus: String(raw.paymentStatus ?? ''),
    amount: Number(raw.amount ?? 0),
    bookingStatus: String(raw.bookingStatus ?? ''),
    type: String(raw.type ?? ''),
  };
}

export function parseCreateWorkshopBookingResponse(
  raw: unknown,
): CreateWorkshopBookingFreeResult | CreateWorkshopBookingPaidResult {
  if (!isRecord(raw)) {
    throw new Error('Invalid workshop booking response');
  }

  const orderId =
    typeof raw.razorpayOrderId === 'string'
      ? raw.razorpayOrderId
      : typeof raw.razorpay_order_id === 'string'
        ? raw.razorpay_order_id
        : null;
  const keyId =
    typeof raw.razorpayKeyId === 'string'
      ? raw.razorpayKeyId
      : typeof raw.razorpay_key_id === 'string'
        ? raw.razorpay_key_id
        : null;

  if (orderId != null && keyId != null) {
    const bookingRaw = isRecord(raw.booking) ? raw.booking : raw;
    return {
      booking: parseFreeBooking(bookingRaw),
      razorpayOrderId: orderId,
      razorpayKeyId: keyId,
      amount: Number(raw.amount ?? 0),
    };
  }

  return parseFreeBooking(raw);
}

export function isPaidWorkshopBookingResult(
  result: CreateWorkshopBookingFreeResult | CreateWorkshopBookingPaidResult,
): result is CreateWorkshopBookingPaidResult {
  return 'razorpayOrderId' in result && 'razorpayKeyId' in result;
}

export const workshopBookingsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMyWorkshopBookings: build.query<WorkshopBookingItem[], void>({
      query: () => ({ url: 'workshop-bookings/me' }),
      transformResponse: (response: unknown) => parseBookingList(response),
      providesTags: [{ type: 'WorkshopBooking', id: 'ME' }],
    }),
    createWorkshopBooking: build.mutation<
      CreateWorkshopBookingFreeResult | CreateWorkshopBookingPaidResult,
      CreateWorkshopBookingRequest
    >({
      query: (body) => ({
        url: 'workshop-bookings',
        method: 'POST',
        body,
      }),
      transformResponse: (response: unknown) => parseCreateWorkshopBookingResponse(response),
      invalidatesTags: [{ type: 'WorkshopBooking', id: 'ME' }, 'Wallet'],
    }),
    confirmWorkshopBooking: build.mutation<ConfirmWorkshopBookingResult, ConfirmWorkshopBookingRequest>({
      query: (body) => ({
        url: 'workshop-bookings/confirm',
        method: 'POST',
        body,
      }),
      transformResponse: (response: unknown): ConfirmWorkshopBookingResult => {
        if (!isRecord(response)) {
          throw new Error('Invalid confirm booking response');
        }
        return {
          id: Number(response.id),
          paymentStatus: String(response.paymentStatus ?? 'paid'),
        };
      },
      invalidatesTags: [{ type: 'WorkshopBooking', id: 'ME' }, 'Wallet'],
    }),
  }),
});

export const {
  useGetMyWorkshopBookingsQuery,
  useCreateWorkshopBookingMutation,
  useConfirmWorkshopBookingMutation,
} = workshopBookingsApi;
