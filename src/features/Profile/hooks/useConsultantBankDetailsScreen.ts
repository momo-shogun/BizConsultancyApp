import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';

import {
  useGetConsultantMyProfileQuery,
  useUpdateConsultantBankDetailsMutation,
} from '@/features/Profile/api/consultantProfileApi';
import type { ConsultantBankFormState } from '@/features/Profile/types/consultantBankDetails.types';
import {
  bankProfileToForm,
  EMPTY_BANK_FORM,
  formToBankPayload,
  sanitizeAccountNumber,
  sanitizeIfscCode,
  validateBankForm,
} from '@/features/Profile/utils/consultantBankDetails';
import type { AccountStackParamList } from '@/navigation/types';
import { showGlobalToast } from '@/shared/components/toast';
import { getApiErrorMessage } from '@/utils/apiError';

export interface UseConsultantBankDetailsScreenResult {
  form: ConsultantBankFormState;
  isLoading: boolean;
  isRefreshing: boolean;
  isSaving: boolean;
  loadError: string | null;
  validationError: string | null;
  accountMismatch: boolean;
  canSave: boolean;
  setField: (key: keyof ConsultantBankFormState, value: string) => void;
  handleSave: () => void;
  refetch: () => void;
  goBack: () => void;
}

export function useConsultantBankDetailsScreen(): UseConsultantBankDetailsScreenResult {
  const navigation = useNavigation<NavigationProp<AccountStackParamList>>();
  const { data, isLoading, isFetching, error, refetch } = useGetConsultantMyProfileQuery();
  const [updateBank, { isLoading: isSaving }] = useUpdateConsultantBankDetailsMutation();

  const [form, setForm] = useState<ConsultantBankFormState>(EMPTY_BANK_FORM);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (data != null && !hydrated) {
      setForm(bankProfileToForm(data));
      setHydrated(true);
    }
  }, [data, hydrated]);

  const loadError =
    error != null ? getApiErrorMessage(error, 'Failed to load bank details') : null;

  const validationError = useMemo((): string | null => validateBankForm(form), [form]);

  const accountMismatch = useMemo((): boolean => {
    if (form.confirmAccountNumber.length === 0) {
      return false;
    }
    return (
      sanitizeAccountNumber(form.accountNumber) !==
      sanitizeAccountNumber(form.confirmAccountNumber)
    );
  }, [form.accountNumber, form.confirmAccountNumber]);

  const canSave =
    hydrated &&
    !isLoading &&
    !isSaving &&
    validationError == null &&
    !accountMismatch;

  const setField = useCallback((key: keyof ConsultantBankFormState, value: string): void => {
    if (key === 'accountNumber' || key === 'confirmAccountNumber') {
      setForm((prev) => ({ ...prev, [key]: sanitizeAccountNumber(value) }));
      return;
    }
    if (key === 'ifscCode') {
      setForm((prev) => ({ ...prev, ifscCode: sanitizeIfscCode(value) }));
      return;
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = useCallback((): void => {
    const fieldError = validateBankForm(form);
    if (fieldError != null) {
      showGlobalToast({ variant: 'error', message: fieldError });
      return;
    }

    void (async (): Promise<void> => {
      try {
        const updated = await updateBank(formToBankPayload(form)).unwrap();
        setForm(bankProfileToForm(updated));
        showGlobalToast('Bank details saved');
      } catch (err: unknown) {
        showGlobalToast(getApiErrorMessage(err, 'Failed to save bank details'));
      }
    })();
  }, [form, updateBank]);

  const goBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  return {
    form,
    isLoading: isLoading && !hydrated,
    isRefreshing: isFetching && hydrated,
    isSaving,
    loadError,
    validationError,
    accountMismatch,
    canSave,
    setField,
    handleSave,
    refetch,
    goBack,
  };
}
