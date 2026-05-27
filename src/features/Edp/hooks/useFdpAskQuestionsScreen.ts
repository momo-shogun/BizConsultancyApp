import { useCallback, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  selectDisplayName,
  selectIsAuthenticated,
  selectLoggedInEmail,
  selectLoggedInMobile,
} from '@/features/Auth/store/authSelectors';
import { useGetUserMeQuery } from '@/features/Profile/api/userProfileApi';
import { ROUTES } from '@/navigation/routeNames';
import type { EdpStackParamList } from '@/navigation/types';
import { showGlobalToast } from '@/shared/components/toast';
import { formatIndianMobile } from '@/utils/formatPhone';
import { useAppSelector } from '@/store/typedHooks';

import type {
  FdpAskQuestionsFormState,
  FdpCategoryOption,
} from '../types/fdpAskQuestions.types';
import {
  sanitizeRemark,
  validateFdpAskQuestionsForm,
} from '../utils/fdpAskQuestionsValidation';

const EMPTY_FORM: FdpAskQuestionsFormState = {
  category: '',
  remark: '',
};

export const FDP_CATEGORY_OPTIONS: FdpCategoryOption[] = [
  { label: 'Professional', value: 'professional' },
  { label: 'Student', value: 'student' },
  { label: 'Business Owner', value: 'business_owner' },
  { label: 'Consultant', value: 'consultant' },
];

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

export interface UseFdpAskQuestionsScreenResult {
  form: FdpAskQuestionsFormState;
  categoryOptions: FdpCategoryOption[];
  name: string;
  mobile: string;
  email: string;
  isAuthenticated: boolean;
  isProfileLoading: boolean;
  isSubmitting: boolean;
  validationError: string | null;
  categoryError: string | null;
  canSubmit: boolean;
  setCategory: (value: string) => void;
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

  const { data: profile, isLoading } = useGetUserMeQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [form, setForm] = useState<FdpAskQuestionsFormState>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitAttempted, setSubmitAttempted] = useState<boolean>(false);

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

  const isProfileLoading = isAuthenticated && isLoading && profile == null;

  const validationError = useMemo((): string | null => validateFdpAskQuestionsForm(form), [form]);

  const categoryError = useMemo((): string | null => {
    if (!submitAttempted && form.category.length === 0) {
      return null;
    }
    if (form.category.trim().length === 0) {
      return 'Please select a category.';
    }
    return null;
  }, [form.category, submitAttempted]);

  const canSubmit =
    isAuthenticated &&
    !isProfileLoading &&
    !isSubmitting &&
    validationError == null &&
    form.category.trim().length > 0;

  const setCategory = useCallback((value: string): void => {
    setForm((prev) => ({ ...prev, category: value }));
  }, []);

  const setRemark = useCallback((value: string): void => {
    setForm((prev) => ({ ...prev, remark: sanitizeRemark(value) }));
  }, []);

  const handleSubmit = useCallback((): void => {
    if (!isAuthenticated) {
      showGlobalToast({ variant: 'error', message: 'Please sign in to submit a request.' });
      return;
    }

    setSubmitAttempted(true);
    const fieldError = validateFdpAskQuestionsForm(form);
    if (fieldError != null) {
      showGlobalToast({ variant: 'error', message: fieldError });
      return;
    }

    void (async (): Promise<void> => {
      setIsSubmitting(true);
      try {
        await new Promise<void>((resolve) => {
          setTimeout(resolve, 600);
        });
        showGlobalToast({
          variant: 'success',
          title: 'Submitted',
          message: 'Your programme guidance request has been received.',
        });
        navigation.goBack();
      } catch {
        showGlobalToast({
          variant: 'error',
          message: 'Failed to submit request. Please try again.',
        });
      } finally {
        setIsSubmitting(false);
      }
    })();
  }, [form, isAuthenticated, navigation]);

  const goBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  return {
    form,
    categoryOptions: FDP_CATEGORY_OPTIONS,
    name,
    mobile,
    email,
    isAuthenticated,
    isProfileLoading,
    isSubmitting,
    validationError,
    categoryError,
    canSubmit,
    setCategory,
    setRemark,
    handleSubmit,
    goBack,
  };
}
