import React, { useCallback, useMemo, useState } from 'react';

import { selectHasVerifiedLogin } from '@/features/Auth/store/authSelectors';
import { useNavigateToLogin } from '@/features/Profile/hooks/useNavigateToLogin';
import { Dialog } from '@/shared/components/dialog';
import { useAppSelector } from '@/store/typedHooks';

export const DIAGNOSIS_PURCHASE_LOGIN_MESSAGE =
  'To purchase the diagnostics package, you have to Login first';

const DIAGNOSIS_PURCHASE_LOGIN_TITLE = 'Login required';

interface UseDiagnosisPurchaseLoginGateOptions {
  onDismiss?: () => void;
}

export interface UseDiagnosisPurchaseLoginGateResult {
  promptDiagnosisLogin: () => void;
  diagnosisPurchaseLoginDialog: React.ReactElement;
}

export function useDiagnosisPurchaseLoginGate(
  options: UseDiagnosisPurchaseLoginGateOptions = {},
): UseDiagnosisPurchaseLoginGateResult {
  const hasVerifiedLogin = useAppSelector(selectHasVerifiedLogin);
  const navigateToLogin = useNavigateToLogin();
  const onDismiss = options.onDismiss;
  const [dialogVisible, setDialogVisible] = useState(false);

  const closeDialog = useCallback((): void => {
    setDialogVisible(false);
    onDismiss?.();
  }, [onDismiss]);

  const promptDiagnosisLogin = useCallback((): void => {
    if (hasVerifiedLogin) {
      return;
    }
    setDialogVisible(true);
  }, [hasVerifiedLogin]);

  const handleLogin = useCallback((): void => {
    setDialogVisible(false);
    navigateToLogin('user');
  }, [navigateToLogin]);

  const diagnosisPurchaseLoginDialog = useMemo(
    (): React.ReactElement => (
      <Dialog
        visible={dialogVisible}
        onClose={closeDialog}
        variant="default"
        title={DIAGNOSIS_PURCHASE_LOGIN_TITLE}
        description={DIAGNOSIS_PURCHASE_LOGIN_MESSAGE}
        actions={[
          { label: 'Not now', variant: 'ghost', onPress: closeDialog },
          { label: 'Log in', onPress: handleLogin },
        ]}
      />
    ),
    [closeDialog, dialogVisible, handleLogin],
  );

  return { promptDiagnosisLogin, diagnosisPurchaseLoginDialog };
}
