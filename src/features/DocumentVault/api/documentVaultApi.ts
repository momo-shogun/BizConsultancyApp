import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { baseApi } from '@/services/api/baseApi';
import { postMultipartForm } from '@/services/api/multipartFetch';
import type { RootState } from '@/store';

import type {
  VaultDocument,
  VaultDocumentShare,
  VaultDocumentSharesResult,
  VaultDocumentType,
  VaultShareTarget,
} from '../types/documentVault.types';
import {
  parseVaultDocument,
  parseVaultDocumentShare,
  parseVaultDocumentShares,
  parseVaultDocumentTypes,
  parseVaultDocuments,
  parseVaultShareTargets,
} from '../utils/documentVaultParsing';

export const documentVaultApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getVaultDocumentTypes: build.query<VaultDocumentType[], void>({
      query: () => 'document-vault/document-types',
      transformResponse: (response: unknown) => parseVaultDocumentTypes(response),
      providesTags: [{ type: 'DocumentVault', id: 'TYPES' }],
    }),
    getMyVaultDocuments: build.query<VaultDocument[], void>({
      query: () => ({
        url: 'document-vault/me/documents',
        params: { includeShared: 'true' },
      }),
      transformResponse: (response: unknown) => parseVaultDocuments(response),
      providesTags: [{ type: 'DocumentVault', id: 'LIST' }],
    }),
    getMyVaultDocumentShares: build.query<VaultDocumentSharesResult, void>({
      query: () => ({
        url: 'document-vault/me/document-shares',
        params: { direction: 'all' },
      }),
      transformResponse: (response: unknown) => parseVaultDocumentShares(response),
      providesTags: [{ type: 'DocumentVault', id: 'SHARES' }],
    }),
    getMyVaultShareTargets: build.query<VaultShareTarget[], void>({
      query: () => 'document-vault/me/share-targets',
      transformResponse: (response: unknown) => parseVaultShareTargets(response),
      providesTags: [{ type: 'DocumentVault', id: 'TARGETS' }],
    }),
    uploadVaultDocument: build.mutation<
      VaultDocument,
      {
        documentTypeId: number;
        file: { uri: string; name: string; type: string };
      }
    >({
      async queryFn({ documentTypeId, file }, { getState }) {
        if (!Number.isFinite(documentTypeId) || documentTypeId <= 0) {
          return {
            error: {
              status: 400,
              data: { message: 'Select a document type' },
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

          const parsed = parseVaultDocument(uploadResult.data);
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
      invalidatesTags: [
        { type: 'DocumentVault', id: 'LIST' },
        { type: 'DocumentVault', id: 'SHARES' },
      ],
    }),
    deleteVaultDocument: build.mutation<{ ok: true }, number>({
      query: (documentId) => ({
        url: `document-vault/me/documents/${documentId}`,
        method: 'DELETE',
      }),
      transformResponse: () => ({ ok: true as const }),
      invalidatesTags: [
        { type: 'DocumentVault', id: 'LIST' },
        { type: 'DocumentVault', id: 'SHARES' },
      ],
    }),
    createVaultDocumentShare: build.mutation<
      VaultDocumentShare,
      {
        userDocumentId: number;
        targetUserId: number;
        targetUserType: 'user' | 'consultant';
      }
    >({
      query: (body) => ({
        url: 'document-vault/me/document-shares',
        method: 'POST',
        body: {
          userDocumentId: body.userDocumentId,
          targetUserType: body.targetUserType,
          targetUserId: body.targetUserId,
        },
      }),
      transformResponse: (response: unknown) => {
        const share = parseVaultDocumentShare(response);
        if (share == null) {
          throw new Error('Invalid share response');
        }
        return share;
      },
      invalidatesTags: [{ type: 'DocumentVault', id: 'SHARES' }],
    }),
    deleteVaultDocumentShare: build.mutation<{ ok: true }, number>({
      query: (shareId) => ({
        url: `document-vault/me/document-shares/${shareId}`,
        method: 'DELETE',
      }),
      transformResponse: () => ({ ok: true as const }),
      invalidatesTags: [{ type: 'DocumentVault', id: 'SHARES' }],
    }),
  }),
});

export const {
  useGetVaultDocumentTypesQuery,
  useGetMyVaultDocumentsQuery,
  useGetMyVaultDocumentSharesQuery,
  useGetMyVaultShareTargetsQuery,
  useUploadVaultDocumentMutation,
  useDeleteVaultDocumentMutation,
  useCreateVaultDocumentShareMutation,
  useDeleteVaultDocumentShareMutation,
} = documentVaultApi;
