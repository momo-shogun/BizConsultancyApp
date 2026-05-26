import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuth } from '@/app/providers/AuthProvider';
import { selectPreferredAccountRole } from '@/features/Auth/store/authSelectors';
import type { AuthRole } from '@/features/Auth/types/authApi.types';
import { ROUTES } from '@/navigation/routeNames';
import type { AuthStackParamList } from '@/navigation/types';
import { useAppSelector } from '@/store/typedHooks';

type AuthIntent = 'login' | 'signup';

type Nav = NativeStackNavigationProp<AuthStackParamList>;

export function useAuthRoleEntry(): {
  preferredRole: AuthRole | null;
  startAuthFlow: (intent: AuthIntent) => void;
} {
  const navigation = useNavigation<Nav>();
  const { selectAccountContext } = useAuth();
  const preferredRole = useAppSelector(selectPreferredAccountRole);

  const startAuthFlow = useCallback(
    (intent: AuthIntent): void => {
      if (preferredRole != null) {
        selectAccountContext({ userType: preferredRole, authIntent: intent });
        navigation.navigate(
          intent === 'login' ? ROUTES.Auth.Login : ROUTES.Auth.Signup,
        );
        return;
      }
      navigation.navigate(ROUTES.Auth.ChooseAccountType, { next: intent });
    },
    [navigation, preferredRole, selectAccountContext],
  );

  return { preferredRole, startAuthFlow };
}
