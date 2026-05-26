import { baseApi } from '@/services/api/baseApi';
import { assetToMultipartFile, patchMultipartForm } from '@/services/api/multipartFetch';
import type { RootState } from '@/store';

import type { UpdateUserProfilePayload, UserMeDto } from '../types/userProfile.types';
import { parseUserMeDto, readApiErrorMessage } from '../utils/userProfileParsing';

function profileFieldsFromPayload(payload: UpdateUserProfilePayload): Record<string, string> {
  const fields: Record<string, string> = {};
  const email = payload.email.trim();
  if (email.length > 0) {
    fields.email = email;
  }
  if (payload.city.trim().length > 0) {
    fields.city = payload.city.trim();
  }
  if (payload.state.trim().length > 0) {
    fields.state = payload.state.trim();
  }
  const pincode = payload.pincode.replace(/\D/g, '').slice(0, 6);
  if (pincode.length > 0) {
    fields.pincode = pincode;
  }
  if (payload.gender.length > 0) {
    fields.gender = payload.gender;
  }
  return fields;
}

export const userProfileApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUserMe: build.query<UserMeDto, void>({
      query: () => ({ url: 'users/me' }),
      transformResponse: (response: unknown) => parseUserMeDto(response),
      providesTags: [{ type: 'UserProfile', id: 'ME' }],
    }),
    updateUserMe: build.mutation<UserMeDto, UpdateUserProfilePayload>({
      async queryFn(payload, api) {
        const state = api.getState() as RootState;
        const token = state.auth?.token ?? null;

        let filePayload = null;
        if (payload.imageAsset != null) {
          const mime = (payload.imageAsset.type ?? 'image/jpeg').toLowerCase();
          filePayload = assetToMultipartFile(
            payload.imageAsset,
            payload.imageAsset.fileName?.trim() ?? `profile_${Date.now()}.jpg`,
            mime === 'image/jpg' ? 'image/jpeg' : mime,
          );
        }

        const result = await patchMultipartForm(
          'users/me',
          profileFieldsFromPayload(payload),
          filePayload != null ? 'file' : null,
          filePayload,
          token,
        );

        if (!result.ok) {
          return {
            error: {
              status: result.status || 500,
              data: readApiErrorMessage(result.data, 'Failed to update profile'),
            },
          };
        }

        try {
          return { data: parseUserMeDto(result.data) };
        } catch {
          return {
            error: {
              status: 500,
              data: 'Invalid profile response',
            },
          };
        }
      },
      invalidatesTags: [{ type: 'UserProfile', id: 'ME' }],
    }),
  }),
});

export const { useGetUserMeQuery, useUpdateUserMeMutation } = userProfileApi;
