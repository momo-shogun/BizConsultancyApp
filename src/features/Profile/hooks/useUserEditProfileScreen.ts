import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Asset } from 'react-native-image-picker';

import { setAuthProfile } from '@/features/Auth/store/authSlice';
import { selectIsAuthenticated } from '@/features/Auth/store/authSelectors';
import { formatIndianMobile } from '@/utils/formatPhone';
import { useAppDispatch, useAppSelector } from '@/store/typedHooks';
import { showGlobalError, showGlobalToast } from '@/shared/components/toast';

import { useGetUserMeQuery, useUpdateUserMeMutation } from '../api/userProfileApi';
import type { UserGenderValue, UserProfileFormState } from '../types/userProfile.types';
import { pickProfileImageFromLibrary } from '../utils/profileImagePicker';
import {
  normalizeUserProfileForm,
  validateUserProfileForm,
  type UserProfileFieldErrors,
  type UserProfileFieldKey,
} from '../validation/userProfileSchema';

function formFromProfile(profile: {
  email: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  gender: UserGenderValue;
}): UserProfileFormState {
  return {
    email: profile.email ?? '',
    city: profile.city ?? '',
    state: profile.state ?? '',
    pincode: profile.pincode ?? '',
    gender: profile.gender,
  };
}

function readQueryError(error: unknown): string {
  if (error != null && typeof error === 'object' && 'data' in error) {
    const data = (error as { data?: unknown }).data;
    if (typeof data === 'string' && data.trim().length > 0) {
      return data;
    }
    if (data != null && typeof data === 'object' && 'message' in data) {
      const message = (data as { message: unknown }).message;
      if (typeof message === 'string' && message.trim().length > 0) {
        return message;
      }
    }
  }
  return 'Failed to load profile';
}

export interface UseUserEditProfileScreenResult {
  isAuthenticated: boolean;
  isLoading: boolean;
  isSaving: boolean;
  loadError: string | null;
  readOnlyName: string;
  readOnlyMobile: string;
  avatarUri: string | null;
  avatarInitial: string;
  pendingImageName: string | null;
  form: UserProfileFormState;
  fieldErrors: UserProfileFieldErrors;
  setFormField: <K extends keyof UserProfileFormState>(
    key: K,
    value: UserProfileFormState[K],
  ) => void;
  pickProfileImage: () => Promise<void>;
  handleSave: () => Promise<void>;
  refetch: () => void;
}

export function useUserEditProfileScreen(): UseUserEditProfileScreenResult {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { data: profile, isLoading, isFetching, error, refetch } = useGetUserMeQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [updateUserMe, { isLoading: isSaving }] = useUpdateUserMeMutation();

  const [form, setForm] = useState<UserProfileFormState>({
    email: '',
    city: '',
    state: '',
    pincode: '',
    gender: '',
  });
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [pendingImageName, setPendingImageName] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<UserProfileFieldErrors>({});

  useEffect(() => {
    if (profile != null) {
      setForm(formFromProfile(profile));
    }
  }, [profile]);

  useEffect(() => {
    return () => {
      if (previewUri != null && previewUri.startsWith('file://')) {
        // Local preview only; no revoke needed on RN file URIs.
      }
    };
  }, [previewUri]);

  const readOnlyName = profile?.name?.trim() ?? '—';
  const readOnlyMobile = useMemo((): string => {
    const mobile = profile?.mobile?.trim() ?? '';
    if (mobile.length === 0) {
      return '—';
    }
    return formatIndianMobile(mobile) ?? mobile;
  }, [profile?.mobile]);

  const avatarUri = previewUri ?? profile?.thumbnail ?? null;
  const avatarInitial = useMemo((): string => {
    const source = profile?.name?.trim() || readOnlyName;
    return source.charAt(0).toUpperCase() || 'U';
  }, [profile?.name, readOnlyName]);

  const setFormField = useCallback(
    <K extends keyof UserProfileFormState>(key: K, value: UserProfileFormState[K]): void => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setFieldErrors((prev) => {
        if (prev[key] == null) {
          return prev;
        }
        const next = { ...prev };
        delete next[key as UserProfileFieldKey];
        return next;
      });
    },
    [],
  );

  const pickProfileImage = useCallback(async (): Promise<void> => {
    const result = await pickProfileImageFromLibrary();
    if (result.errorMessage != null) {
      showGlobalError(result.errorMessage);
      return;
    }
    if (result.asset == null) {
      return;
    }
    setPreviewAsset(result.asset);
    setPreviewUri(result.asset.uri ?? null);
    setPendingImageName(result.asset.fileName?.trim() ?? 'Selected image');
  }, []);

  const handleSave = useCallback(async (): Promise<void> => {
    if (!isAuthenticated) {
      showGlobalError('Please sign in to update your profile.');
      return;
    }

    const validation = validateUserProfileForm(form);
    if (!validation.success) {
      setFieldErrors(validation.errors);
      showGlobalError('Please fix the highlighted fields.');
      return;
    }

    const normalized = normalizeUserProfileForm(validation.data ?? form);

    try {
      const updated = await updateUserMe({
        ...normalized,
        imageAsset: previewAsset,
      }).unwrap();

      setForm(formFromProfile(updated));
      setFieldErrors({});
      setPreviewAsset(null);
      setPreviewUri(null);
      setPendingImageName(null);

      dispatch(
        setAuthProfile({
          displayName: updated.name,
          email: updated.email,
          mobile: updated.mobile,
        }),
      );

      showGlobalToast('Profile updated');
    } catch (err) {
      showGlobalError(readQueryError(err));
    }
  }, [dispatch, form, isAuthenticated, previewAsset, updateUserMe]);

  const loadError =
    !isAuthenticated
      ? null
      : error != null && profile == null
        ? readQueryError(error)
        : null;

  return {
    isAuthenticated,
    isLoading: isAuthenticated && (isLoading || isFetching) && profile == null,
    isSaving,
    loadError,
    readOnlyName,
    readOnlyMobile,
    avatarUri,
    avatarInitial,
    pendingImageName,
    form,
    fieldErrors,
    setFormField,
    pickProfileImage,
    handleSave,
    refetch: () => {
      void refetch();
    },
  };
}
