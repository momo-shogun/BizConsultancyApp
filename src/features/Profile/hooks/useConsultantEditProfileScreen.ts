import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Asset } from 'react-native-image-picker';

import { selectIsAuthenticated } from '@/features/Auth/store/authSelectors';
import { setAuthProfile } from '@/features/Auth/store/authSlice';
import { formatIndianMobile } from '@/utils/formatPhone';
import { showGlobalError, showGlobalToast } from '@/shared/components';
import { useAppDispatch, useAppSelector } from '@/store/typedHooks';

import {
  useGetConsultantMyProfileQuery,
  useUpdateConsultantMyProfileMutation,
} from '../api/consultantProfileApi';
import type { ConsultantProfileFormState } from '../types/consultantProfile.types';
import { profileToFormState } from '../utils/consultantProfileParsing';
import { pickProfileImageFromLibrary } from '../utils/profileImagePicker';
import {
  normalizeConsultantProfileForm,
  validateConsultantProfileForm,
  type ConsultantProfileFieldErrors,
  type ConsultantProfileFieldKey,
} from '../validation/consultantProfileSchema';

function readQueryError(error: unknown): string {
  if (error != null && typeof error === 'object' && 'data' in error) {
    const data = (error as { data?: unknown }).data;
    if (typeof data === 'string' && data.trim().length > 0) {
      return data;
    }
  }
  return 'Failed to load profile';
}

export interface UseConsultantEditProfileScreenResult {
  isAuthenticated: boolean;
  isLoading: boolean;
  isSaving: boolean;
  loadError: string | null;
  readOnlyName: string;
  readOnlyMobile: string;
  avatarUri: string | null;
  avatarInitial: string;
  pendingImageName: string | null;
  form: ConsultantProfileFormState;
  dobDate: Date | null;
  fieldErrors: ConsultantProfileFieldErrors;
  setFormField: <K extends keyof ConsultantProfileFormState>(
    key: K,
    value: ConsultantProfileFormState[K],
  ) => void;
  setDobDate: (date: Date) => void;
  pickProfileImage: () => Promise<void>;
  handleSave: () => Promise<void>;
  refetch: () => void;
}

export function useConsultantEditProfileScreen(): UseConsultantEditProfileScreenResult {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { data: profile, isLoading, isFetching, error, refetch } = useGetConsultantMyProfileQuery(
    undefined,
    { skip: !isAuthenticated },
  );
  const [updateProfile, { isLoading: isSaving }] = useUpdateConsultantMyProfileMutation();

  const [form, setForm] = useState<ConsultantProfileFormState>({
    email: '',
    gender: '',
    pincode: '',
    city: '',
    state: '',
    address: '',
    experience: '',
    dob: '',
    qualification: '',
    summary: '',
    audioFee: '',
    videoFee: '',
  });
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [pendingImageName, setPendingImageName] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ConsultantProfileFieldErrors>({});

  useEffect(() => {
    if (profile != null) {
      setForm(profileToFormState(profile));
    }
  }, [profile]);

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
    return source.charAt(0).toUpperCase() || 'C';
  }, [profile?.name, readOnlyName]);

  const dobDate = useMemo((): Date | null => {
    if (form.dob.trim().length === 0) {
      return null;
    }
    const date = new Date(`${form.dob.trim()}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
  }, [form.dob]);

  const setFormField = useCallback(
    <K extends keyof ConsultantProfileFormState>(
      key: K,
      value: ConsultantProfileFormState[K],
    ): void => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setFieldErrors((prev) => {
        if (prev[key] == null) {
          return prev;
        }
        const next = { ...prev };
        delete next[key as ConsultantProfileFieldKey];
        return next;
      });
    },
    [],
  );

  const setDobDate = useCallback((date: Date): void => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    setFormField('dob', `${year}-${month}-${day}`);
  }, [setFormField]);

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

    const validation = validateConsultantProfileForm(form);
    if (!validation.success) {
      setFieldErrors(validation.errors);
      showGlobalError('Please fix the highlighted fields.');
      return;
    }

    const normalized = normalizeConsultantProfileForm(validation.data ?? form);

    try {
      const updated = await updateProfile({
        form: normalized,
        imageAsset: previewAsset,
      }).unwrap();

      setForm(profileToFormState(updated));
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

      showGlobalToast({
        title: 'Profile updated',
        message: 'Your consultant profile has been saved.',
        variant: 'success',
      });
    } catch (err: unknown) {
      showGlobalError(readQueryError(err));
    }
  }, [dispatch, form, isAuthenticated, previewAsset, updateProfile]);

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
    dobDate,
    fieldErrors,
    setFormField,
    setDobDate,
    pickProfileImage,
    handleSave,
    refetch: () => {
      void refetch();
    },
  };
}
