import { useCallback } from 'react';

import { useAuth } from '@/app/providers/AuthProvider';
import { setPreferredAccountRole } from '@/features/Auth/store/authSlice';
import type { AuthRole } from '@/features/Auth/types/authApi.types';
import { useAppDispatch } from '@/store/typedHooks';

export function useNavigateToLogin(): (role?: AuthRole) => void {
  const dispatch = useAppDispatch();
  const { logout, selectAccountContext } = useAuth();

  return useCallback(
    (role: AuthRole = 'user'): void => {
      dispatch(setPreferredAccountRole(role));
      logout();
      selectAccountContext({ userType: role, authIntent: 'login' });
    },
    [dispatch, logout, selectAccountContext],
  );
}
