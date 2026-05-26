import { baseApi } from '@/services/api/baseApi';
import {
  assetToMultipartFile,
  patchMultipartJsonPayload,
} from '@/services/api/multipartFetch';
import type { RootState } from '@/store';

import type { ConsultantBankDetailsPayload } from '../types/consultantBankDetails.types';
import type {
  ConsultantMyProfileDto,
  ConsultantProfileFormState,
  UpdateConsultantProfilePayload,
} from '../types/consultantProfile.types';
import { experienceDigitsToStored } from '../utils/consultantExperience';
import { parseConsultantMyProfileDto } from '../utils/consultantProfileParsing';
import { readApiErrorMessage } from '../utils/userProfileParsing';

function buildUpdatePayload(form: ConsultantProfileFormState): {
  consultant: {
    city: string;
    state: string;
    pincode: string;
    gender: string;
    email: string;
  };
  profile: {
    address: string;
    experience: string;
    dob: string;
    highestQualification: string;
    profileSummary: string;
    audioFee?: number;
    videoFee?: number;
  };
} {
  const audioRaw = form.audioFee.trim();
  const videoRaw = form.videoFee.trim();
  const audioFee = audioRaw.length > 0 ? Number(audioRaw) : undefined;
  const videoFee = videoRaw.length > 0 ? Number(videoRaw) : undefined;

  return {
    consultant: {
      city: form.city.trim(),
      state: form.state.trim(),
      pincode: form.pincode.replace(/\D/g, '').slice(0, 6),
      gender: form.gender.trim(),
      email: form.email.trim(),
    },
    profile: {
      address: form.address.trim(),
      experience: experienceDigitsToStored(form.experience),
      dob: form.dob.trim(),
      highestQualification: form.qualification.trim(),
      profileSummary: form.summary.trim(),
      audioFee: audioFee != null && Number.isFinite(audioFee) ? audioFee : undefined,
      videoFee: videoFee != null && Number.isFinite(videoFee) ? videoFee : undefined,
    },
  };
}

export const consultantProfileApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getConsultantMyProfile: build.query<ConsultantMyProfileDto, void>({
      query: () => ({ url: 'frontend/consultant/profile' }),
      transformResponse: (response: unknown) => parseConsultantMyProfileDto(response),
      providesTags: [{ type: 'ConsultantProfile', id: 'ME' }],
    }),
    updateConsultantMyProfile: build.mutation<ConsultantMyProfileDto, UpdateConsultantProfilePayload>({
      async queryFn(payload, api) {
        const state = api.getState() as RootState;
        const token = state.auth?.token ?? null;

        let filePayload = null;
        if (payload.imageAsset != null) {
          const mime = (payload.imageAsset.type ?? 'image/jpeg').toLowerCase();
          filePayload = assetToMultipartFile(
            payload.imageAsset,
            payload.imageAsset.fileName?.trim() ?? `consultant_profile_${Date.now()}.jpg`,
            mime === 'image/jpg' ? 'image/jpeg' : mime,
          );
        }

        const result = await patchMultipartJsonPayload(
          'frontend/consultant/profile',
          'payload',
          buildUpdatePayload(payload.form),
          filePayload != null ? 'thumbnailFile' : null,
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
          return { data: parseConsultantMyProfileDto(result.data) };
        } catch {
          return {
            error: {
              status: 500,
              data: 'Invalid profile response',
            },
          };
        }
      },
      invalidatesTags: [{ type: 'ConsultantProfile', id: 'ME' }],
    }),
    updateConsultantBankDetails: build.mutation<ConsultantMyProfileDto, ConsultantBankDetailsPayload>({
      async queryFn(payload, api) {
        const state = api.getState() as RootState;
        const token = state.auth?.token ?? null;

        const result = await patchMultipartJsonPayload(
          'frontend/consultant/profile',
          'payload',
          {
            profile: {
              bankName: payload.bankName ?? '',
              branchName: payload.branchName ?? '',
              accountName: payload.accountName ?? '',
              accountNo: payload.accountNo ?? '',
              ifscCode: payload.ifscCode ?? '',
            },
          },
          null,
          null,
          token,
        );

        if (!result.ok) {
          return {
            error: {
              status: result.status || 500,
              data: readApiErrorMessage(result.data, 'Failed to save bank details'),
            },
          };
        }

        try {
          return { data: parseConsultantMyProfileDto(result.data) };
        } catch {
          return {
            error: {
              status: 500,
              data: 'Invalid profile response',
            },
          };
        }
      },
      invalidatesTags: [{ type: 'ConsultantProfile', id: 'ME' }],
    }),
  }),
});

export const {
  useGetConsultantMyProfileQuery,
  useUpdateConsultantMyProfileMutation,
  useUpdateConsultantBankDetailsMutation,
} = consultantProfileApi;
