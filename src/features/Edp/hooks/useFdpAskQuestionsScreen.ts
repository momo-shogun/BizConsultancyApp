import { useCallback, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  selectDisplayName,
  selectIsAuthenticated,
  selectLoggedInEmail,
  selectLoggedInMobile,
} from '@/features/Auth/store/authSelectors';
import {
  useGetMasterCategoriesQuery,
  useGetMasterSegmentsQuery,
} from '@/features/consultant/api/consultantApi';
import { useSubmitEdpEnquiryMutation } from '@/features/Edp/api/edpEnquiryApi';
import { EDP_PROGRAMME_ENQUIRY_CATEGORY_ID } from '@/features/Edp/constants/edpEnquiryConfig';
import { useGetUserMeQuery } from '@/features/Profile/api/userProfileApi';
import { type ROUTES } from '@/navigation/routeNames';
import type { EdpStackParamList } from '@/navigation/types';
import { showGlobalToast } from '@/shared/components/toast';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatIndianMobile } from '@/utils/formatPhone';
import { useAppSelector } from '@/store/typedHooks';

import type {
  FdpAskQuestionsFormState,
  FdpMasterDropdownOption,
} from '../types/fdpAskQuestions.types';
import {
  buildEdpEnquiryMessage,
  findMasterName,
  toEnquiryPhone,
} from '../utils/edpEnquiryMessage';
import {
  sanitizeRemark,
  validateFdpAskQuestionsForm,
} from '../utils/fdpAskQuestionsValidation';

const EMPTY_FORM: FdpAskQuestionsFormState = {
  categoryId: '',
  segmentId: '',
  remark: '',
};

function pickDisplayValue(apiValue: string | null | undefined, authValue: string | null): string {
  const fromApi = apiValue?.trim() ?? '';
  if (fromApi.length > 0) {
    return fromApi;
  }
  const fromAuth = authValue?.trim() ?? '';
  if (fromAuth.length > 0) {
    return fromAuth;
  }
  return '';
}

function mapMasterOptions(
  items: Array<{ id: number; name: string }>,
): FdpMasterDropdownOption[] {
  return items.map((item) => ({
    label: item.name,
    value: String(item.id),
  }));
}

export interface UseFdpAskQuestionsScreenResult {
  form: FdpAskQuestionsFormState;
  categoryOptions: FdpMasterDropdownOption[];
  segmentOptions: FdpMasterDropdownOption[];
  name: string;
  mobile: string;
  email: string;
  isAuthenticated: boolean;
  isProfileLoading: boolean;
  isCategoriesLoading: boolean;
  isSegmentsLoading: boolean;
  isSubmitting: boolean;
  validationError: string | null;
  categoryError: string | null;
  segmentError: string | null;
  canSubmit: boolean;
  setCategoryId: (value: string) => void;
  setSegmentId: (value: string) => void;
  setRemark: (value: string) => void;
  handleSubmit: () => void;
  goBack: () => void;
}

export function useFdpAskQuestionsScreen(): UseFdpAskQuestionsScreenResult {
  type Nav = NativeStackNavigationProp<
    EdpStackParamList,
    typeof ROUTES.Edp.AskQuestions
  >;
  const navigation = useNavigation<Nav>();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const authName = useAppSelector(selectDisplayName);
  const authMobile = useAppSelector(selectLoggedInMobile);
  const authEmail = useAppSelector(selectLoggedInEmail);

  const { data: profile, isLoading: isProfileQueryLoading } = useGetUserMeQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [form, setForm] = useState<FdpAskQuestionsFormState>(EMPTY_FORM);
  const [submitAttempted, setSubmitAttempted] = useState<boolean>(false);
  const [submitEdpEnquiry, { isLoading: isSubmitting }] = useSubmitEdpEnquiryMutation();

  const { data: categories = [], isLoading: isCategoriesLoading } = useGetMasterCategoriesQuery();
  const { data: segments = [], isLoading: isSegmentsLoading } = useGetMasterSegmentsQuery(
    form.categoryId.length > 0 ? { categoryId: form.categoryId } : undefined,
    { skip: form.categoryId.length === 0 },
  );

  const name = useMemo(
    (): string => pickDisplayValue(profile?.name, authName),
    [authName, profile?.name],
  );

  const mobile = useMemo((): string => {
    const raw = pickDisplayValue(profile?.mobile, authMobile);
    if (raw.length === 0) {
      return '';
    }
    return formatIndianMobile(raw) ?? raw;
  }, [authMobile, profile?.mobile]);

  const email = useMemo(
    (): string => pickDisplayValue(profile?.email, authEmail),
    [authEmail, profile?.email],
  );

  const phoneForApi = useMemo((): string => {
    const raw = pickDisplayValue(profile?.mobile, authMobile);
    return toEnquiryPhone(raw);
  }, [authMobile, profile?.mobile]);

  const hasContactDetails =
    name.trim().length > 0 && email.trim().length > 0 && phoneForApi.length >= 10;

  const categoryOptions = useMemo(
    (): FdpMasterDropdownOption[] => mapMasterOptions(categories),
    [categories],
  );

  const segmentOptions = useMemo(
    (): FdpMasterDropdownOption[] => mapMasterOptions(segments),
    [segments],
  );

  const isProfileLoading = isAuthenticated && isProfileQueryLoading && profile == null;

  const validationError = useMemo((): string | null => validateFdpAskQuestionsForm(form), [form]);

  const categoryError = useMemo((): string | null => {
    if (!submitAttempted && form.categoryId.length === 0) {
      return null;
    }
    if (form.categoryId.trim().length === 0) {
      return 'Please select a category.';
    }
    return null;
  }, [form.categoryId, submitAttempted]);

  const segmentError = useMemo((): string | null => {
    if (!submitAttempted && form.segmentId.length === 0) {
      return null;
    }
    if (form.segmentId.trim().length === 0) {
      return 'Please select a segment.';
    }
    return null;
  }, [form.segmentId, submitAttempted]);

  const canSubmit =
    isAuthenticated &&
    hasContactDetails &&
    !isProfileLoading &&
    !isCategoriesLoading &&
    !isSubmitting &&
    validationError == null &&
    form.categoryId.trim().length > 0 &&
    form.segmentId.trim().length > 0;

  const setCategoryId = useCallback((value: string): void => {
    setForm((prev) => ({ ...prev, categoryId: value, segmentId: '' }));
  }, []);

  const setSegmentId = useCallback((value: string): void => {
    setForm((prev) => ({ ...prev, segmentId: value }));
  }, []);

  const setRemark = useCallback((value: string): void => {
    setForm((prev) => ({ ...prev, remark: sanitizeRemark(value) }));
  }, []);

  const handleSubmit = useCallback((): void => {
    if (!isAuthenticated) {
      showGlobalToast({ variant: 'error', message: 'Please sign in to submit a request.' });
      return;
    }

    if (!hasContactDetails) {
      showGlobalToast({
        variant: 'error',
        message: 'Your profile must include name, email, and mobile before submitting.',
      });
      return;
    }

    setSubmitAttempted(true);
    const fieldError = validateFdpAskQuestionsForm(form);
    if (fieldError != null) {
      showGlobalToast({ variant: 'error', message: fieldError });
      return;
    }

    const categoryId = Number(form.categoryId);
    const segmentId = Number(form.segmentId);
    if (!Number.isFinite(categoryId) || categoryId < 1 || !Number.isFinite(segmentId) || segmentId < 1) {
      showGlobalToast({ variant: 'error', message: 'Please select a valid category and segment.' });
      return;
    }

    const categoryName = findMasterName(categories, form.categoryId);
    const segmentName = findMasterName(segments, form.segmentId);
    const message = buildEdpEnquiryMessage({
      categoryName,
      segmentName,
      remark: form.remark,
    });

    void (async (): Promise<void> => {
      try {
        const result = await submitEdpEnquiry({
          name: name.trim(),
          email: email.trim(),
          phone: phoneForApi,
          enqCategoryId: EDP_PROGRAMME_ENQUIRY_CATEGORY_ID,
          categoryInterestedId: categoryId,
          message,
        }).unwrap();

        showGlobalToast({
          variant: 'success',
          title: 'Submitted',
          message: result.message,
        });
        navigation.goBack();
      } catch (error) {
        showGlobalToast({
          variant: 'error',
          message: getApiErrorMessage(error, 'Failed to submit request. Please try again.'),
        });
      }
    })();
  }, [
    categories,
    email,
    form,
    hasContactDetails,
    isAuthenticated,
    name,
    navigation,
    phoneForApi,
    segments,
    submitEdpEnquiry,
  ]);

  const goBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  return {
    form,
    categoryOptions,
    segmentOptions,
    name,
    mobile,
    email,
    isAuthenticated,
    isProfileLoading,
    isCategoriesLoading,
    isSegmentsLoading,
    isSubmitting,
    validationError,
    categoryError,
    segmentError,
    canSubmit,
    setCategoryId,
    setSegmentId,
    setRemark,
    handleSubmit,
    goBack,
  };
}
