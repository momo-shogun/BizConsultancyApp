import { baseApi } from '@/services/api/baseApi';

import type { MyMembershipDashboardDto, MyMembershipPurchaseStateDto } from '../types/membershipDashboard.types';
import type {
  CreateMembershipRegistrationPayload,
  CreateMembershipRegistrationResult,
  VerifyMembershipPaymentPayload,
} from '../types/membershipRegistration.types';
import {
  parseMyMembershipDashboardDto,
  parseMyMembershipPurchaseStateDto,
} from '../utils/membershipDashboardParsing';
import { parseCreateMembershipRegistration } from '../utils/membershipRegistrationParsing';

export const membershipRegistrationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMyMembershipDashboard: build.query<MyMembershipDashboardDto, void>({
      query: () => ({ url: 'member-ship-registrations/my/dashboard' }),
      transformResponse: (response: unknown) => parseMyMembershipDashboardDto(response),
      providesTags: [{ type: 'UserMembership', id: 'DASHBOARD' }],
    }),
    getMyMembershipPurchaseState: build.query<MyMembershipPurchaseStateDto, void>({
      query: () => ({ url: 'member-ship-registrations/my/purchase-state' }),
      transformResponse: (response: unknown) => parseMyMembershipPurchaseStateDto(response),
      providesTags: [{ type: 'UserMembership', id: 'PURCHASE_STATE' }],
    }),
    createMembershipRegistration: build.mutation<
      CreateMembershipRegistrationResult,
      CreateMembershipRegistrationPayload
    >({
      query: (body) => ({
        url: 'member-ship-registrations',
        method: 'POST',
        body,
      }),
      transformResponse: (response: unknown) => parseCreateMembershipRegistration(response),
      invalidatesTags: [
        { type: 'UserMembership', id: 'DASHBOARD' },
        { type: 'UserMembership', id: 'PURCHASE_STATE' },
        { type: 'Membership', id: 'LIST' },
        'Wallet',
      ],
    }),
    verifyMembershipPayment: build.mutation<
      { paymentStatus: string },
      VerifyMembershipPaymentPayload
    >({
      query: (body) => ({
        url: 'member-ship-registrations/verify-payment',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'UserMembership', id: 'DASHBOARD' },
        { type: 'UserMembership', id: 'PURCHASE_STATE' },
        { type: 'Membership', id: 'LIST' },
        'Wallet',
      ],
    }),
  }),
});

export const {
  useGetMyMembershipDashboardQuery,
  useGetMyMembershipPurchaseStateQuery,
  useCreateMembershipRegistrationMutation,
  useVerifyMembershipPaymentMutation,
} = membershipRegistrationApi;
