import { baseApi } from '@/services/api/baseApi';

import {
  mapDiagnosisPurchaseState,
  mapDiagnosticsMembership,
} from '../utils/diagnosticsMappers';
import type {
  CreateDiagnosisRegistrationResult,
  DiagnosisPurchaseState,
  DiagnosticsMembership,
} from '../types/diagnostics.types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function parseCreateDiagnosisRegistration(raw: unknown): CreateDiagnosisRegistrationResult {
  const root = isRecord(raw) ? raw : {};
  const registration = isRecord(root.registration) ? root.registration : root;

  const paymentStatus =
    typeof root.paymentStatus === 'string'
      ? root.paymentStatus
      : typeof registration.paymentStatus === 'string'
        ? registration.paymentStatus
        : '';

  const razorpayOrderId =
    typeof root.razorpayOrderId === 'string'
      ? root.razorpayOrderId
      : typeof registration.orderId === 'string'
        ? registration.orderId
        : null;

  const razorpayKeyId =
    typeof root.razorpayKeyId === 'string' ? root.razorpayKeyId : null;

  const amountRaw = root.amount ?? registration.amount;
  const amountPaise =
    typeof amountRaw === 'number' && Number.isFinite(amountRaw) ? amountRaw : null;

  return {
    paymentStatus,
    razorpayOrderId,
    razorpayKeyId,
    amountPaise,
  };
}

export const diagnosticsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPublicDiagnosticsMemberships: build.query<DiagnosticsMembership[], void>({
      query: () => 'public/diagnostics-memberships',
      transformResponse: (response: unknown): DiagnosticsMembership[] => {
        if (!Array.isArray(response)) {
          return [];
        }
        return response
          .map(mapDiagnosticsMembership)
          .filter((row): row is DiagnosticsMembership => row != null)
          .sort((a, b) => a.tierRank - b.tierRank);
      },
    }),
    getMyDiagnosisPurchaseState: build.query<DiagnosisPurchaseState | null, void>({
      query: () => 'diagnosis-registrations/my/purchase-state',
      transformResponse: (response: unknown) => mapDiagnosisPurchaseState(response),
      providesTags: ['Diagnostics'],
    }),
    createDiagnosisRegistration: build.mutation<
      CreateDiagnosisRegistrationResult,
      { diagnosticsMembershipId: number; paymentGateway: 'wallet' | 'razor_pay' }
    >({
      query: (body) => ({
        url: 'diagnosis-registrations',
        method: 'POST',
        body,
      }),
      transformResponse: (response: unknown) => parseCreateDiagnosisRegistration(response),
      invalidatesTags: ['Diagnostics', 'Wallet'],
    }),
    verifyDiagnosisPayment: build.mutation<
      { paymentStatus: string },
      { orderId: string; paymentId: string }
    >({
      query: (body) => ({
        url: 'diagnosis-registrations/verify-payment',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Diagnostics', 'Wallet'],
    }),
  }),
});

export const {
  useGetPublicDiagnosticsMembershipsQuery,
  useGetMyDiagnosisPurchaseStateQuery,
  useCreateDiagnosisRegistrationMutation,
  useVerifyDiagnosisPaymentMutation,
} = diagnosticsApi;
