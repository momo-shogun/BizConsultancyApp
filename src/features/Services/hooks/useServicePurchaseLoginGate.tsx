import React, { useCallback, useMemo, useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { selectHasVerifiedLogin } from '@/features/Auth/store/authSelectors';
import { useNavigateToLogin } from '@/features/Profile/hooks/useNavigateToLogin';
import { ROUTES } from '@/navigation/routeNames';
import type { ServicesStackParamList } from '@/navigation/types';
import { Dialog } from '@/shared/components/dialog';
import { useAppSelector } from '@/store/typedHooks';

export const SERVICE_PURCHASE_LOGIN_MESSAGE =
  'To purchase this service, you have to Login first';

const SERVICE_PURCHASE_LOGIN_TITLE = 'Login required';

interface UseServicePurchaseLoginGateOptions {
  onDismiss?: () => void;
}

export interface UseServicePurchaseLoginGateResult {
  handleGetStarted: (slug: string) => void;
  promptServiceLogin: () => void;
  servicePurchaseLoginDialog: React.ReactElement;
}

export function useServicePurchaseLoginGate(
  options: UseServicePurchaseLoginGateOptions = {},
): UseServicePurchaseLoginGateResult {
  const navigation = useNavigation<NativeStackNavigationProp<ServicesStackParamList>>();
  const hasVerifiedLogin = useAppSelector(selectHasVerifiedLogin);
  const navigateToLogin = useNavigateToLogin();
  const onDismiss = options.onDismiss;
  const [dialogVisible, setDialogVisible] = useState(false);

  const closeDialog = useCallback((): void => {
    setDialogVisible(false);
    onDismiss?.();
  }, [onDismiss]);

  const promptServiceLogin = useCallback((): void => {
    setDialogVisible(true);
  }, []);

  const handleGetStarted = useCallback(
    (slug: string): void => {
      if (!hasVerifiedLogin) {
        promptServiceLogin();
        return;
      }
      navigation.navigate(ROUTES.Services.Onboarding, { slug });
    },
    [hasVerifiedLogin, navigation, promptServiceLogin],
  );

  const handleLogin = useCallback((): void => {
    setDialogVisible(false);
    navigateToLogin('user');
  }, [navigateToLogin]);

  const servicePurchaseLoginDialog = useMemo(
    (): React.ReactElement => (
      <Dialog
        visible={dialogVisible}
        onClose={closeDialog}
        variant="default"
        title={SERVICE_PURCHASE_LOGIN_TITLE}
        description={SERVICE_PURCHASE_LOGIN_MESSAGE}
        actions={[
          { label: 'Not now', variant: 'ghost', onPress: closeDialog },
          { label: 'Log in', onPress: handleLogin },
        ]}
      />
    ),
    [closeDialog, dialogVisible, handleLogin],
  );

  return { handleGetStarted, promptServiceLogin, servicePurchaseLoginDialog };
}
