import React, { createContext, useCallback, useContext, useMemo, useReducer } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  userType: 'user' | 'consultant' | null;
  authIntent: 'login' | 'signup' | null;
}

type AuthAction =
  | { type: 'AUTH/COMPLETE_ONBOARDING' }
  | { type: 'AUTH/LOGOUT' }
  | {
      type: 'AUTH/SET_ACCOUNT_CONTEXT';
      payload: { userType: 'user' | 'consultant' | null; authIntent: 'login' | 'signup' | null };
    };

interface AuthContextValue {
  state: AuthState;
  completeOnboarding: () => void;
  logout: () => void;
  selectAccountContext: (input: { userType: 'user' | 'consultant'; authIntent: 'login' | 'signup' }) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH/COMPLETE_ONBOARDING':
      return { ...state, isAuthenticated: true };
    case 'AUTH/LOGOUT':
      return { ...state, isAuthenticated: false, userType: null, authIntent: null };
    case 'AUTH/SET_ACCOUNT_CONTEXT':
      return {
        ...state,
        userType: action.payload.userType,
        authIntent: action.payload.authIntent,
      };
    default: {
      const _exhaustive: never = action;
      return state;
    }
  }
}

export function AuthProvider(props: React.PropsWithChildren): React.ReactElement {
  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    userType: null,
    authIntent: null,
  });

  const completeOnboarding = useCallback((): void => {
    dispatch({ type: 'AUTH/COMPLETE_ONBOARDING' });
  }, []);

  const logout = useCallback((): void => {
    dispatch({ type: 'AUTH/LOGOUT' });
  }, []);

  const selectAccountContext = useCallback(
    (input: { userType: 'user' | 'consultant'; authIntent: 'login' | 'signup' }): void => {
      dispatch({
        type: 'AUTH/SET_ACCOUNT_CONTEXT',
        payload: { userType: input.userType, authIntent: input.authIntent },
      });
    },
    [],
  );

  const value = useMemo<AuthContextValue>(() => {
    return {
      state,
      completeOnboarding,
      logout,
      selectAccountContext,
    };
  }, [state, completeOnboarding, logout, selectAccountContext]);

  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return value;
}

