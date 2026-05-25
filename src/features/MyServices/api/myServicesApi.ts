import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { baseApi } from '@/services/api/baseApi';
import { postMultipartForm } from '@/services/api/multipartFetch';
import type { RootState } from '@/store';
import { parseOnboardingQuestion } from '@/features/Services/utils/serviceApiParsing';
import type { OnboardingFormQuestion } from '@/features/Services/types/serviceOnboarding.types';

import type {
  MyOnboardingSubmission,
  MyOnboardingSubmissionDetail,
  MyOnboardingSubmissionFullDetail,
  OnboardingDetailRow,
  ServiceDetailFormContext,
  SubmissionDocumentRequirements,
  VaultDocumentOption,
} from '../types/myServices.types';
import {
  parseMyOnboardingSubmissionDetail,
  parseMyOnboardingSubmissionFullDetail,
  parseMyOnboardingSubmissionList,
  parseServiceDetailFormContext,
  parseSubmissionDocumentRequirements,
  parseVaultDocumentOption,
} from '../utils/myServicesParsing';
function isFetchNotFound(error: unknown): boolean {
  if (error == null || typeof error !== 'object') {
    return false;
  }
  return (error as FetchBaseQueryError).status === 404;
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

function buildOnboardingRowsFromAnswers(
  answers: Record<string, unknown>,
  formQuestions: OnboardingFormQuestion[],
): MyOnboardingSubmissionFullDetail['onboarding']['rows'] {
  const questionList = [...formQuestions].sort((a, b) => a.order - b.order || a.id - b.id);
  if (questionList.length === 0) {
    return Object.entries(answers).map(([key, value], idx) => {
      const qid = Number(key);
      return {
        questionId: Number.isFinite(qid) ? qid : 0,
        question: `Answer key: ${key}`,
        type: 'text',
        step: 0,
        order: idx,
        answer: value as OnboardingDetailRow['answer'],
      };
    });
  }

  const idSet = new Set<string>();
  const rows = questionList.map((q) => {
    const key = String(q.id);
    idSet.add(key);
    return {
      questionId: q.id,
      question: q.question,
      type: q.type,
      step: q.step,
      order: q.order,
      answer: (answers[key] ?? null) as OnboardingDetailRow['answer'],
    };
  });

  for (const [key, value] of Object.entries(answers)) {
    if (!idSet.has(key)) {
      rows.push({
        questionId: Number(key) || 0,
        question: `Unmapped answer key: ${key}`,
        type: 'text',
        step: 0,
        order: 9999,
        answer: value as OnboardingDetailRow['answer'],
      });
    }
  }

  return rows;
}

export const myServicesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMyOnboardingSubmissions: build.query<MyOnboardingSubmission[], void>({
      query: () => ({ url: 'service-forms/my-submissions' }),
      transformResponse: (response: unknown) => parseMyOnboardingSubmissionList(response),
      providesTags: [{ type: 'MyServices', id: 'LIST' }],
    }),
    getMyOnboardingSubmissionById: build.query<MyOnboardingSubmissionDetail, number>({
      query: (submissionId) => ({
        url: `service-forms/my-submissions/${submissionId}`,
      }),
      transformResponse: (response: unknown) => {
        const row = parseMyOnboardingSubmissionDetail(response);
        if (row == null) {
          throw new Error('Submission not found');
        }
        return row;
      },
      providesTags: (_r, _e, id) => [{ type: 'MyServices', id }],
    }),
    getMyOnboardingSubmissionFullDetail: build.query<
      MyOnboardingSubmissionFullDetail,
      number
    >({
      async queryFn(submissionId, _api, _extra, baseQuery) {
        const detailResult = await baseQuery({
          url: `service-forms/my-submissions/${submissionId}/detail`,
        });

        if (detailResult.data != null) {
          const parsed = parseMyOnboardingSubmissionFullDetail(detailResult.data);
          if (parsed != null && parsed.onboarding.rows.length > 0) {
            return { data: parsed };
          }
        }

        if (detailResult.error != null && !isFetchNotFound(detailResult.error)) {
          return { error: detailResult.error };
        }

        const submissionResult = await baseQuery({
          url: `service-forms/my-submissions/${submissionId}`,
        });
        if (submissionResult.error != null) {
          return { error: submissionResult.error };
        }

        const submission = parseMyOnboardingSubmissionDetail(submissionResult.data);
        if (submission == null) {
          return { error: { status: 404, data: 'Submission not found' } as FetchBaseQueryError };
        }

        const [detailFormResult, docReqResult, questionsResult] = await Promise.all([
          baseQuery({
            url: `service-detail-forms/me/context/${submissionId}`,
          }),
          baseQuery({
            url: `document-vault/onboarding-submissions/${submissionId}/document-requirements`,
          }),
          baseQuery({
            url: `service-forms/my-submissions/${submissionId}/questions`,
          }),
        ]);

        const serviceDetailsCtx =
          detailFormResult.data != null
            ? parseServiceDetailFormContext(detailFormResult.data)
            : null;
        const docRequirements =
          docReqResult.data != null
            ? parseSubmissionDocumentRequirements(docReqResult.data)
            : null;

        let formQuestions: OnboardingFormQuestion[] = [];
        if (questionsResult.data != null) {
          formQuestions = parseQuestionsList(questionsResult.data);
        }

        const onboardingRows = buildOnboardingRowsFromAnswers(
          submission.answers,
          formQuestions,
        );

        const serviceDetailsAnswers =
          serviceDetailsCtx?.submission?.answers.map((a) => {
            const q = serviceDetailsCtx.form?.questions.find(
              (question) => question.id === a.questionId,
            );
            return {
              questionId: a.questionId,
              questionLabel: q?.questionLabel ?? `Question #${a.questionId}`,
              answerType: q?.answerType ?? 'text',
              value: a.answerJson != null ? a.answerJson : a.answerText,
            };
          }) ?? [];

        const selectedDocuments =
          docRequirements?.items.flatMap((item) =>
            item.selectedUserDocumentIds
              .map((selectedId) =>
                item.availableDocuments.find((doc) => doc.id === selectedId),
              )
              .filter((doc): doc is NonNullable<typeof doc> => doc != null)
              .map((doc) => ({
                selectionId: Number(`${item.serviceDocumentId}${doc.id}`),
                requirementDocumentType: item.documentTypeName ?? '—',
                isRequired: item.isRequired ?? null,
                userFileDocumentType: item.documentTypeName ?? '—',
                documentUrl: doc.documentUrl ?? null,
                originalFilename: doc.originalFilename ?? null,
                mimeType: doc.mimeType ?? null,
                fileSize: null,
              })),
          ) ?? [];

        const fallback: MyOnboardingSubmissionFullDetail = {
          submission,
          resolvedServiceSlug: submission.serviceSlug ?? null,
          servicePage: serviceDetailsCtx?.servicePage
            ? {
                id: serviceDetailsCtx.servicePage.id,
                slug: serviceDetailsCtx.servicePage.slug,
                title: serviceDetailsCtx.servicePage.title,
              }
            : null,
          onboarding: {
            form: submission.formId
              ? { id: submission.formId, name: 'Onboarding Form' }
              : null,
            rows: onboardingRows,
          },
          serviceDetails: {
            submission: serviceDetailsCtx?.submission
              ? {
                  id: serviceDetailsCtx.submission.id,
                  status: serviceDetailsCtx.submission.status,
                  userId: 0,
                  userType: submission.userType ?? 'user',
                  createdAt: submission.createdAt,
                  updatedAt: submission.updatedAt,
                }
              : null,
            formName: serviceDetailsCtx?.form?.name ?? null,
            answers: serviceDetailsAnswers,
          },
          documents: selectedDocuments,
        };

        if (detailResult.data != null) {
          const parsed = parseMyOnboardingSubmissionFullDetail(detailResult.data);
          if (parsed != null) {
            return {
              data: {
                ...parsed,
                onboarding: {
                  form:
                    parsed.onboarding.form ??
                    (submission.formId
                      ? { id: submission.formId, name: 'Onboarding Form' }
                      : null),
                  rows: onboardingRows.length > 0 ? onboardingRows : parsed.onboarding.rows,
                },
              },
            };
          }
        }

        return { data: fallback };
      },
      providesTags: (_r, _e, id) => [{ type: 'MyServices', id: `detail-${id}` }],
    }),
    applyMyOnboardingSubmission: build.mutation<{ ok: true; status: 'applied' }, number>({
      async queryFn(submissionId, _api, _extra, baseQuery) {
        let result = await baseQuery({
          url: `service-forms/my-submissions/${submissionId}/apply`,
          method: 'PATCH',
        });
        if (result.error != null) {
          const status = (result.error as FetchBaseQueryError).status;
          if (status === 404 || status === 405) {
            result = await baseQuery({
              url: `service-forms/my-submissions/${submissionId}/apply`,
              method: 'POST',
            });
          }
        }
        if (result.error != null) {
          return { error: result.error };
        }
        return { data: { ok: true as const, status: 'applied' as const } };
      },
      invalidatesTags: (_r, _e, submissionId) => [
        { type: 'MyServices', id: 'LIST' },
        { type: 'MyServices', id: submissionId },
        { type: 'MyServices', id: `detail-${submissionId}` },
      ],
    }),
    getServiceDetailFormContext: build.query<ServiceDetailFormContext, number>({
      query: (submissionId) => ({
        url: `service-detail-forms/me/context/${submissionId}`,
      }),
      transformResponse: (response: unknown) => {
        const ctx = parseServiceDetailFormContext(response);
        if (ctx == null) {
          throw new Error('Invalid service detail form context');
        }
        return ctx;
      },
      providesTags: (_r, _e, id) => [{ type: 'MyServices', id: `apply-ctx-${id}` }],
    }),
    getSubmissionDocumentRequirements: build.query<
      SubmissionDocumentRequirements,
      number
    >({
      query: (submissionId) => ({
        url: `document-vault/onboarding-submissions/${submissionId}/document-requirements`,
      }),
      transformResponse: (response: unknown) => {
        const parsed = parseSubmissionDocumentRequirements(response);
        if (parsed == null) {
          throw new Error('Invalid document requirements');
        }
        return parsed;
      },
      providesTags: (_r, _e, id) => [{ type: 'MyServices', id: `apply-docs-${id}` }],
    }),
    saveServiceDetailFormAnswers: build.mutation<
      { ok: true; submissionId: number },
      {
        submissionId: number;
        answers: Array<{
          questionId: number;
          answerText?: string | null;
          answerJson?: unknown;
        }>;
      }
    >({
      query: ({ submissionId, answers }) => ({
        url: `service-detail-forms/me/submissions/${submissionId}`,
        method: 'PUT',
        body: { answers },
      }),
      invalidatesTags: (_r, _e, { submissionId }) => [
        { type: 'MyServices', id: `apply-ctx-${submissionId}` },
        { type: 'MyServices', id: `detail-${submissionId}` },
      ],
    }),
    saveSubmissionDocumentSelections: build.mutation<
      { ok: true },
      {
        submissionId: number;
        items: Array<{ serviceDocumentId: number; userDocumentIds: number[] }>;
      }
    >({
      query: ({ submissionId, items }) => ({
        url: `document-vault/onboarding-submissions/${submissionId}/document-selections`,
        method: 'PUT',
        body: { items },
      }),
      invalidatesTags: (_r, _e, { submissionId }) => [
        { type: 'MyServices', id: `apply-docs-${submissionId}` },
        { type: 'MyServices', id: `detail-${submissionId}` },
      ],
    }),
    uploadMyVaultDocument: build.mutation<
      VaultDocumentOption,
      {
        submissionId: number;
        serviceDocumentId: number;
        documentTypeId: number;
        file: { uri: string; name: string; type: string };
      }
    >({
      async queryFn(
        { documentTypeId, file },
        { getState },
      ) {
        if (!Number.isFinite(documentTypeId) || documentTypeId <= 0) {
          return {
            error: {
              status: 400,
              data: { message: 'Invalid document type for this requirement.' },
            } as FetchBaseQueryError,
          };
        }

        try {
          const token = (getState() as RootState).auth?.token ?? null;
          const uploadResult = await postMultipartForm(
            'document-vault/me/documents',
            { documentTypeId: String(documentTypeId) },
            'file',
            file,
            token,
          );

          if (!uploadResult.ok) {
            return {
              error: {
                status: uploadResult.status === 0 ? 'FETCH_ERROR' : uploadResult.status,
                data: uploadResult.data,
                error:
                  uploadResult.data != null &&
                  typeof uploadResult.data === 'object' &&
                  'message' in uploadResult.data &&
                  typeof (uploadResult.data as { message?: unknown }).message === 'string'
                    ? (uploadResult.data as { message: string }).message
                    : 'Upload failed',
              } as FetchBaseQueryError,
            };
          }

          const parsed = parseVaultDocumentOption(uploadResult.data);
          if (parsed == null) {
            return {
              error: {
                status: 'PARSING_ERROR',
                data: 'Invalid vault upload response',
                error: 'Invalid vault upload response',
              } as FetchBaseQueryError,
            };
          }

          return { data: parsed };
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Upload failed';
          return {
            error: {
              status: 'FETCH_ERROR',
              data: { message },
              error: message,
            } as FetchBaseQueryError,
          };
        }
      },
      async onQueryStarted(
        { submissionId, serviceDocumentId },
        { dispatch, queryFulfilled },
      ) {
        try {
          const { data: uploaded } = await queryFulfilled;
          dispatch(
            myServicesApi.util.updateQueryData(
              'getSubmissionDocumentRequirements',
              submissionId,
              (draft) => {
                const item = draft.items.find(
                  (row) => row.serviceDocumentId === serviceDocumentId,
                );
                if (item == null) {
                  return;
                }
                const exists = item.availableDocuments.some((doc) => doc.id === uploaded.id);
                if (!exists) {
                  item.availableDocuments = [uploaded, ...item.availableDocuments];
                }
                const selected = item.selectedUserDocumentIds;
                if (!selected.includes(uploaded.id)) {
                  item.selectedUserDocumentIds = [...selected, uploaded.id];
                }
              },
            ),
          );
        } catch {
          // Error surfaced by mutation caller.
        }
      },
    }),
    deleteMyVaultDocument: build.mutation<
      { ok: true },
      { submissionId: number; documentId: number }
    >({
      query: ({ documentId }) => ({
        url: `document-vault/me/documents/${documentId}`,
        method: 'DELETE',
      }),
      transformResponse: () => ({ ok: true as const }),
      async onQueryStarted({ submissionId, documentId }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          myServicesApi.util.updateQueryData(
            'getSubmissionDocumentRequirements',
            submissionId,
            (draft) => {
              for (const item of draft.items) {
                item.availableDocuments = item.availableDocuments.filter(
                  (doc) => doc.id !== documentId,
                );
                item.selectedUserDocumentIds = item.selectedUserDocumentIds.filter(
                  (id) => id !== documentId,
                );
              }
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),
  }),
});

export const {
  useGetMyOnboardingSubmissionsQuery,
  useGetMyOnboardingSubmissionByIdQuery,
  useGetMyOnboardingSubmissionFullDetailQuery,
  useLazyGetMyOnboardingSubmissionFullDetailQuery,
  useApplyMyOnboardingSubmissionMutation,
  useGetServiceDetailFormContextQuery,
  useGetSubmissionDocumentRequirementsQuery,
  useSaveServiceDetailFormAnswersMutation,
  useSaveSubmissionDocumentSelectionsMutation,
  useUploadMyVaultDocumentMutation,
  useDeleteMyVaultDocumentMutation,
} = myServicesApi;
