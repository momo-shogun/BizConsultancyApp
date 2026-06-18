import React, { useCallback, useMemo, useState } from 'react';

import { selectHasVerifiedLogin } from '@/features/Auth/store/authSelectors';
import { useNavigateToLogin } from '@/features/Profile/hooks/useNavigateToLogin';
import { Dialog } from '@/shared/components/dialog';
import { useAppSelector } from '@/store/typedHooks';

export const CONSULTANT_BOOKING_LOGIN_MESSAGE = 'Login first to book consultant';

const CONSULTANT_BOOKING_LOGIN_TITLE = 'Login required';

export interface UseConsultantBookingLoginGateResult {
  ensureVerifiedLogin: () => boolean;
  promptConsultantBookingLogin: () => void;
  consultantBookingLoginDialog: React.ReactElement;
}

export function useConsultantBookingLoginGate(): UseConsultantBookingLoginGateResult {
  const hasVerifiedLogin = useAppSelector(selectHasVerifiedLogin);
  const navigateToLogin = useNavigateToLogin();
  const [dialogVisible, setDialogVisible] = useState(false);

  const closeDialog = useCallback((): void => {
    setDialogVisible(false);
  }, []);

  const promptConsultantBookingLogin = useCallback((): void => {
    setDialogVisible(true);
  }, []);

  const ensureVerifiedLogin = useCallback((): boolean => {
    if (hasVerifiedLogin) {
      return true;
    }
    promptConsultantBookingLogin();
    return false;
  }, [hasVerifiedLogin, promptConsultantBookingLogin]);

  const handleLogin = useCallback((): void => {
    setDialogVisible(false);
    navigateToLogin('user');
  }, [navigateToLogin]);

  const consultantBookingLoginDialog = useMemo(
    (): React.ReactElement => (
      <Dialog
        visible={dialogVisible}
        onClose={closeDialog}
        variant="default"
        title={CONSULTANT_BOOKING_LOGIN_TITLE}
        description={CONSULTANT_BOOKING_LOGIN_MESSAGE}
        actions={[
          { label: 'Not now', variant: 'ghost', onPress: closeDialog },
          { label: 'Log in', onPress: handleLogin },
        ]}
      />
    ),
    [closeDialog, dialogVisible, handleLogin],
  );

  return {
    ensureVerifiedLogin,
    promptConsultantBookingLogin,
    consultantBookingLoginDialog,
  };
}
