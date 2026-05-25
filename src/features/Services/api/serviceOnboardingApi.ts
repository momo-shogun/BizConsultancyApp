import { baseApi } from '@/services/api/baseApi';

import type {
  OnboardingCreateOrderPayload,
  OnboardingCreateOrderResponse,
  OnboardingDraftPayload,
  OnboardingFormQuestion,
  OnboardingSubmissionRow,
  OnboardingSubmitPayload,
  ServiceRegistrationIntakePayload,
} from '../types/serviceOnboarding.types';
import { parseOnboardingQuestion } from '../utils/serviceApiParsing';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function parseSubmissionRow(raw: unknown): OnboardingSubmissionRow | null {
  if (!isRecord(raw)) {
    return null;
  }
  const id = Number(raw.id);
  if (!Number.isFinite(id)) {
    return null;
  }
  const answers =
    raw.answers != null && typeof raw.answers === 'object' && !Array.isArray(raw.answers)
      ? (raw.answers as Record<string, unknown>)
      : {};

  return {
    id,
    userId: raw.userId != null ? Number(raw.userId) : null,
    userType: typeof raw.userType === 'string' ? raw.userType : null,
    formId: raw.formId != null ? Number(raw.formId) : null,
    serviceSlug: typeof raw.serviceSlug === 'string' ? raw.serviceSlug : null,
    serviceName: typeof raw.serviceName === 'string' ? raw.serviceName : null,
    name: typeof raw.name === 'string' ? raw.name : null,
    email: typeof raw.email === 'string' ? raw.email : null,
    mobile: typeof raw.mobile === 'string' ? raw.mobile : null,
    city: typeof raw.city === 'string' ? raw.city : null,
    paymentMode: typeof raw.paymentMode === 'string' ? raw.paymentMode : null,
    orderId: typeof raw.orderId === 'string' ? raw.orderId : null,
    paymentId: typeof raw.paymentId === 'string' ? raw.paymentId : null,
    transactionDate:
      typeof raw.transactionDate === 'string' ? raw.transactionDate : null,
    amount: raw.amount != null ? String(raw.amount) : null,
    status:
      typeof raw.status === 'string'
        ? (raw.status as OnboardingSubmissionRow['status'])
        : null,
    answers,
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : undefined,
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : undefined,
  };
}

function parseIntakeResponse(raw: unknown): { id: number } {
  const row = parseSubmissionRow(raw);
  if (row != null) {
    return { id: row.id };
  }
  if (isRecord(raw) && Number.isFinite(Number(raw.id))) {
    return { id: Number(raw.id) };
  }
  throw new Error('Invalid intake response');
}

function parseCreateOrderResponse(raw: unknown): OnboardingCreateOrderResponse {
  if (!isRecord(raw)) {
    throw new Error('Invalid order response');
  }
  const orderId =
    typeof raw.razorpayOrderId === 'string'
      ? raw.razorpayOrderId
      : typeof raw.orderId === 'string'
        ? raw.orderId
        : '';
  const keyId =
    typeof raw.razorpayKeyId === 'string'
      ? raw.razorpayKeyId
      : typeof raw.keyId === 'string'
        ? raw.keyId
        : '';
  const amount = Number(raw.amount ?? 0);
  if (!orderId || !keyId) {
    throw new Error('Could not create payment order');
  }
  return {
    razorpayOrderId: orderId,
    razorpayKeyId: keyId,
    amount: Number.isFinite(amount) ? amount : 0,
  };
}

function parseQuestionsList(raw: unknown): OnboardingFormQuestion[] {
  const rows = Array.isArray(raw) ? raw : [];
  const result: OnboardingFormQuestion[] = [];
  for (const row of rows) {
    const q = parseOnboardingQuestion(row);
    if (q != null) {
      result.push(q);
    }
  }
  return result.sort((a, b) => a.order - b.order || a.id - b.id);
}

export const serviceOnboardingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    upsertServiceIntake: build.mutation<{ id: number }, ServiceRegistrationIntakePayload>({
      query: (body) => ({
        url: 'service-forms/submissions/intake',
        method: 'POST',
        body,
      }),
      transformResponse: (response: unknown) => parseIntakeResponse(response),
      invalidatesTags: [{ type: 'ServiceOnboarding', id: 'LIST' }],
    }),
    saveOnboardingDraft: build.mutation<OnboardingSubmissionRow, OnboardingDraftPayload>({
      query: (body) => ({
        url: 'service-forms/submissions/draft',
        method: 'POST',
        body,
      }),
      transformResponse: (response: unknown) => {
        const row = parseSubmissionRow(response);
        if (row == null) {
          throw new Error('Invalid draft response');
        }
        return row;
      },
      invalidatesTags: [{ type: 'ServiceOnboarding', id: 'LIST' }],
    }),
    submitOnboarding: build.mutation<OnboardingSubmissionRow, OnboardingSubmitPayload>({
      query: (body) => ({
        url: 'service-forms/submissions',
        method: 'POST',
        body,
      }),
      transformResponse: (response: unknown) => {
        const row = parseSubmissionRow(response);
        if (row == null) {
          throw new Error('Invalid submission response');
        }
        return row;
      },
      invalidatesTags: [{ type: 'ServiceOnboarding', id: 'LIST' }],
    }),
    createOnboardingOrder: build.mutation<
      OnboardingCreateOrderResponse,
      OnboardingCreateOrderPayload
    >({
      query: (body) => ({
        url: 'service-forms/onboarding/create-order',
        method: 'POST',
        body,
      }),
      transformResponse: (response: unknown) => parseCreateOrderResponse(response),
    }),
    getMyOnboardingSubmission: build.query<OnboardingSubmissionRow, number>({
      query: (submissionId) => ({
        url: `service-forms/my-submissions/${submissionId}`,
      }),
      transformResponse: (response: unknown) => {
        const row = parseSubmissionRow(response);
        if (row == null) {
          throw new Error('Submission not found');
        }
        return row;
      },
      providesTags: (_result, _err, id) => [{ type: 'ServiceOnboarding', id }],
    }),
    getMyOnboardingSubmissionQuestions: build.query<OnboardingFormQuestion[], number>({
      query: (submissionId) => ({
        url: `service-forms/my-submissions/${submissionId}/questions`,
      }),
      transformResponse: (response: unknown) => parseQuestionsList(response),
      providesTags: (_result, _err, id) => [
        { type: 'ServiceOnboarding', id: `questions-${id}` },
      ],
    }),
  }),
});

export const {
  useUpsertServiceIntakeMutation,
  useSaveOnboardingDraftMutation,
  useSubmitOnboardingMutation,
  useCreateOnboardingOrderMutation,
  useGetMyOnboardingSubmissionQuery,
  useGetMyOnboardingSubmissionQuestionsQuery,
  useLazyGetMyOnboardingSubmissionQuery,
  useLazyGetMyOnboardingSubmissionQuestionsQuery,
} = serviceOnboardingApi;
