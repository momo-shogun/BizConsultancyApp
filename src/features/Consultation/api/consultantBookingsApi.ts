import { baseApi } from '@/services/api/baseApi';

import type {
  ConsultantBookingResponse,
  CreateConsultantBookingPayload,
  RazorpayOrderResponse,
  VerifyConsultantBookingPaymentPayload,
} from '../types/consultantBooking.types';

export const consultantBookingsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createConsultantBooking: build.mutation<
      ConsultantBookingResponse,
      CreateConsultantBookingPayload
    >({
      query: (body) => ({
        url: 'consultant-bookings',
        method: 'POST',
        body,
      }),
    }),
    createConsultantBookingRazorpayOrder: build.mutation<RazorpayOrderResponse, number>({
      query: (bookingId) => ({
        url: `consultant-bookings/${bookingId}/create-order`,
        method: 'POST',
      }),
    }),
    verifyConsultantBookingPayment: build.mutation<
      ConsultantBookingResponse,
      { bookingId: number; body: VerifyConsultantBookingPaymentPayload }
    >({
      query: ({ bookingId, body }) => ({
        url: `consultant-bookings/${bookingId}/verify-payment`,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useCreateConsultantBookingMutation,
  useCreateConsultantBookingRazorpayOrderMutation,
  useVerifyConsultantBookingPaymentMutation,
} = consultantBookingsApi;
