import { baseApi } from '@/services/api/baseApi';

import type {
  AcceptCallResponse,
  CallSessionStatusResponse,
  CallSyncResponse,
  EndCallPayload,
  InitiateCallPayload,
  InitiateCallResponse,
} from '../types/callApi.types';

export interface InitiateCallFromBookingPayload {
  bookingId: number;
}

export const callsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    initiateCall: build.mutation<InitiateCallResponse, InitiateCallPayload>({
      query: (body) => ({
        url: 'calls/initiate',
        method: 'POST',
        body,
      }),
    }),
    initiateCallFromBooking: build.mutation<InitiateCallResponse, InitiateCallFromBookingPayload>({
      query: (body) => ({
        url: 'calls/initiate-from-consultant-booking',
        method: 'POST',
        body,
      }),
    }),
    acceptCall: build.mutation<AcceptCallResponse, number>({
      query: (sessionId) => ({
        url: `calls/${sessionId}/accept`,
        method: 'POST',
      }),
    }),
    declineCall: build.mutation<CallSessionStatusResponse, number>({
      query: (sessionId) => ({
        url: `calls/${sessionId}/decline`,
        method: 'POST',
      }),
    }),
    endCall: build.mutation<CallSessionStatusResponse, { sessionId: number; body?: EndCallPayload }>({
      query: ({ sessionId, body }) => ({
        url: `calls/${sessionId}/end`,
        method: 'POST',
        body: body ?? {},
      }),
    }),
    rejoinCall: build.mutation<AcceptCallResponse, number>({
      query: (sessionId) => ({
        url: `calls/${sessionId}/rejoin-token`,
        method: 'POST',
      }),
    }),
    getCallStatus: build.query<CallSessionStatusResponse, number>({
      query: (sessionId) => `calls/${sessionId}/status`,
    }),
    syncCall: build.query<CallSyncResponse, { sessionId: number; sinceVersion?: number }>({
      query: ({ sessionId, sinceVersion }) => {
        const q =
          sinceVersion != null && sinceVersion > 0 ? `?sinceVersion=${sinceVersion}` : '';
        return `calls/${sessionId}/sync${q}`;
      },
    }),
  }),
});

export const {
  useInitiateCallMutation,
  useInitiateCallFromBookingMutation,
  useAcceptCallMutation,
  useDeclineCallMutation,
  useEndCallMutation,
  useRejoinCallMutation,
  useGetCallStatusQuery,
  useLazySyncCallQuery,
  useLazyGetCallStatusQuery,
} = callsApi;
