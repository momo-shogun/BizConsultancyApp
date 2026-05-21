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
  amount: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function parseBookingList(raw: unknown): WorkshopBookingItem[] {
  const rows = Array.isArray(raw) ? raw : isRecord(raw) && Array.isArray(raw.data) ? raw.data : [];
  const result: WorkshopBookingItem[] = [];
  for (const item of rows) {
    if (!isRecord(item)) continue;
    const id = Number(item.id);
    const workshopId = Number(item.workshopId);
    if (!Number.isFinite(id) || !Number.isFinite(workshopId)) continue;
    result.push({
      id,
      workshopId,
      paymentStatus: String(item.paymentStatus ?? ''),
      amount: Number(item.amount ?? 0),
      bookingStatus: String(item.bookingStatus ?? ''),
      type: String(item.type ?? ''),
      createdAt: String(item.createdAt ?? ''),
    });
  }
  return result;
}

function parseCreateBookingResponse(
  raw: unknown,
): CreateWorkshopBookingFreeResult | CreateWorkshopBookingPaidResult {
  if (!isRecord(raw)) {
    throw new Error('Invalid booking response');
  }
  const orderId = raw.razorpayOrderId;
  const keyId = raw.razorpayKeyId;
  if (typeof orderId === 'string' && typeof keyId === 'string') {
    const bookingRaw = isRecord(raw.booking) ? raw.booking : raw;
    return {
      booking: {
        id: Number(bookingRaw.id),
        workshopId: Number(bookingRaw.workshopId),
        paymentStatus: String(bookingRaw.paymentStatus ?? ''),
        amount: Number(bookingRaw.amount ?? 0),
        bookingStatus: String(bookingRaw.bookingStatus ?? ''),
        type: String(bookingRaw.type ?? ''),
      },
      razorpayOrderId: orderId,
      razorpayKeyId: keyId,
      amount: Number(raw.amount ?? 0),
    };
  }
  return {
    id: Number(raw.id),
    workshopId: Number(raw.workshopId),
    paymentStatus: String(raw.paymentStatus ?? ''),
    amount: Number(raw.amount ?? 0),
    bookingStatus: String(raw.bookingStatus ?? ''),
    type: String(raw.type ?? ''),
  };
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
      transformResponse: (response: unknown) => parseCreateBookingResponse(response),
      invalidatesTags: [{ type: 'WorkshopBooking', id: 'ME' }],
    }),
    confirmWorkshopBooking: build.mutation<{ id: number; paymentStatus: string }, {
      orderId: string;
      paymentId: string;
    }>({
      query: (body) => ({
        url: 'workshop-bookings/confirm',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'WorkshopBooking', id: 'ME' }],
    }),
  }),
});

export const {
  useGetMyWorkshopBookingsQuery,
  useCreateWorkshopBookingMutation,
  useConfirmWorkshopBookingMutation,
} = workshopBookingsApi;
