import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuth } from '@/app/providers/AuthProvider';
import { ROUTES } from '@/navigation/routeNames';
import type { AuthStackParamList } from '@/navigation/types';

type AuthIntent = 'login' | 'signup';

type Nav = NativeStackNavigationProp<AuthStackParamList>;

export function useNavigateToChooseRole(authIntent: AuthIntent): () => void {
  const navigation = useNavigation<Nav>();
  const { clearAccountContext } = useAuth();

  return useCallback((): void => {
    clearAccountContext();
    navigation.replace(ROUTES.Auth.ChooseAccountType, {
      next: authIntent,
      skipAutoSelect: true,
    });
  }, [authIntent, clearAccountContext, navigation]);
}
