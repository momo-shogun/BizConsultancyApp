import React, { createContext, useCallback, useContext, useMemo, useReducer } from 'react';

import { authApi } from '@/features/Auth/api/authApi';
import { establishSession, logout as logoutAuth } from '@/features/Auth/store/authSlice';
import { selectAccountRole, selectIsAuthenticated } from '@/features/Auth/store/authSelectors';
import { useAppDispatch, useAppSelector } from '@/store/typedHooks';

interface AuthFlowState {
  userType: 'user' | 'consultant' | null;
  authIntent: 'login' | 'signup' | null;
}

type AuthFlowAction =
  | {
      type: 'AUTH/SET_ACCOUNT_CONTEXT';
      payload: { userType: 'user' | 'consultant' | null; authIntent: 'login' | 'signup' | null };
    }
  | { type: 'AUTH/CLEAR_FLOW' };

interface AuthContextValue {
  flow: AuthFlowState;
  completeOnboarding: () => void;
  logout: () => void;
  selectAccountContext: (input: {
    userType: 'user' | 'consultant';
    authIntent: 'login' | 'signup';
  }) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function authFlowReducer(state: AuthFlowState, action: AuthFlowAction): AuthFlowState {
  switch (action.type) {
    case 'AUTH/SET_ACCOUNT_CONTEXT':
      return {
        userType: action.payload.userType,
        authIntent: action.payload.authIntent,
      };
    case 'AUTH/CLEAR_FLOW':
      return { userType: null, authIntent: null };
    default: {
      const _exhaustive: never = action;
      return state;
    }
  }
}

export function AuthProvider(props: React.PropsWithChildren): React.ReactElement {
  const dispatch = useAppDispatch();
  const [flow, dispatchFlow] = useReducer(authFlowReducer, {
    userType: null,
    authIntent: null,
  });

  const completeOnboarding = useCallback((): void => {
    dispatch(establishSession());
  }, [dispatch]);

  const logout = useCallback((): void => {
    dispatchFlow({ type: 'AUTH/CLEAR_FLOW' });
    dispatch(logoutAuth());
    dispatch(authApi.util.resetApiState());
  }, [dispatch]);

  const selectAccountContext = useCallback(
    (input: { userType: 'user' | 'consultant'; authIntent: 'login' | 'signup' }): void => {
      dispatchFlow({
        type: 'AUTH/SET_ACCOUNT_CONTEXT',
        payload: { userType: input.userType, authIntent: input.authIntent },
      });
    },
    [],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      flow,
      completeOnboarding,
      logout,
      selectAccountContext,
    }),
    [flow, completeOnboarding, logout, selectAccountContext],
  );

  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
}

export function useAuth(): {
  state: {
    isAuthenticated: boolean;
    userType: 'user' | 'consultant' | null;
    authIntent: 'login' | 'signup' | null;
  };
  completeOnboarding: () => void;
  logout: () => void;
  selectAccountContext: (input: {
    userType: 'user' | 'consultant';
    authIntent: 'login' | 'signup';
  }) => void;
} {
  const context = useContext(AuthContext);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const accountRole = useAppSelector(selectAccountRole);

  if (context == null) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return {
    state: {
      isAuthenticated,
      userType: context.flow.userType ?? accountRole,
      authIntent: context.flow.authIntent,
    },
    completeOnboarding: context.completeOnboarding,
    logout: context.logout,
    selectAccountContext: context.selectAccountContext,
  };
}
