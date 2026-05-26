import React, { useCallback, useMemo, useState } from 'react';

import type { AuthRole } from '@/features/Auth/types/authApi.types';
import { Dialog } from '@/shared/components/dialog';

import { useNavigateToLogin } from './useNavigateToLogin';

interface ProfileLoginPromptOptions {
  title?: string;
  message?: string;
  role?: AuthRole;
}

interface LoginDialogState {
  title: string;
  message: string;
  role: AuthRole;
}

const DEFAULT_DIALOG: LoginDialogState = {
  title: 'Sign in required',
  message: 'Log in with your mobile number to use this feature and save your information.',
  role: 'user',
};

export interface UseProfileLoginPromptResult {
  promptLogin: (options?: ProfileLoginPromptOptions) => void;
  profileLoginDialog: React.ReactElement;
}

export function useProfileLoginPrompt(): UseProfileLoginPromptResult {
  const navigateToLogin = useNavigateToLogin();
  const [dialogState, setDialogState] = useState<LoginDialogState | null>(null);

  const closeDialog = useCallback((): void => {
    setDialogState(null);
  }, []);

  const promptLogin = useCallback((options?: ProfileLoginPromptOptions): void => {
    setDialogState({
      title: options?.title ?? DEFAULT_DIALOG.title,
      message: options?.message ?? DEFAULT_DIALOG.message,
      role: options?.role ?? DEFAULT_DIALOG.role,
    });
  }, []);

  const handleLogin = useCallback((): void => {
    const role = dialogState?.role ?? 'user';
    closeDialog();
    navigateToLogin(role);
  }, [closeDialog, dialogState?.role, navigateToLogin]);

  const profileLoginDialog = useMemo(
    (): React.ReactElement => (
      <Dialog
        visible={dialogState != null}
        onClose={closeDialog}
        variant="default"
        title={dialogState?.title ?? DEFAULT_DIALOG.title}
        description={dialogState?.message ?? DEFAULT_DIALOG.message}
        actions={[
          { label: 'Not now', variant: 'ghost', onPress: closeDialog },
          { label: 'Log in', onPress: handleLogin },
        ]}
      />
    ),
    [closeDialog, dialogState, handleLogin],
  );

  return { promptLogin, profileLoginDialog };
}
