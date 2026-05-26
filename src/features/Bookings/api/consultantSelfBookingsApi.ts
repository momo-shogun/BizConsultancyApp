import { baseApi } from '@/services/api/baseApi';

import type { ConsultantSelfBooking } from '../types/consultantSelfBooking.types';
import { parseConsultantSelfBookingsList } from '../utils/consultantSelfBookingParsing';

export const consultantSelfBookingsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getConsultantSelfBookings: build.query<ConsultantSelfBooking[], void>({
      query: () => ({ url: 'frontend/consultant/bookings' }),
      transformResponse: (response: unknown): ConsultantSelfBooking[] =>
        parseConsultantSelfBookingsList(response),
      providesTags: [{ type: 'ConsultantBooking', id: 'SELF_LIST' }],
    }),
  }),
});

export const { useGetConsultantSelfBookingsQuery } = consultantSelfBookingsApi;
