import { baseApi } from '@/services/api/baseApi';

import type { MyConsultantBookingsPage } from '../types/myConsultantBooking.types';
import { parseMyConsultantBookingsPage } from '../utils/myConsultantBookingParsing';

export interface FetchMyConsultantBookingsArgs {
  page?: number;
  limit?: number;
}

export const myConsultantBookingsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMyConsultantBookingsPage: build.query<
      MyConsultantBookingsPage,
      FetchMyConsultantBookingsArgs | void
    >({
      query: (args) => {
        const page = args?.page ?? 1;
        const limit = args?.limit ?? 100;
        return `consultant-bookings/my?page=${page}&limit=${limit}`;
      },
      transformResponse: (response: unknown) => parseMyConsultantBookingsPage(response),
      providesTags: [{ type: 'ConsultantBooking', id: 'MY' }],
    }),
  }),
});

export const { useGetMyConsultantBookingsPageQuery, useLazyGetMyConsultantBookingsPageQuery } =
  myConsultantBookingsApi;
