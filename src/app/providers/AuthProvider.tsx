import React, { createContext, useCallback, useContext, useMemo, useReducer } from 'react';

interface AuthState {
  isAuthenticated: boolean;
}

type AuthAction =
  | { type: 'AUTH/COMPLETE_ONBOARDING' }
  | { type: 'AUTH/LOGOUT' };

interface AuthContextValue {
  state: AuthState;
  completeOnboarding: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH/COMPLETE_ONBOARDING':
      return { ...state, isAuthenticated: true };
    case 'AUTH/LOGOUT':
      return { ...state, isAuthenticated: false };
    default: {
      const _exhaustive: never = action;
      return state;
    }
  }
}

export function AuthProvider(props: React.PropsWithChildren): React.ReactElement {
  const [state, dispatch] = useReducer(authReducer, { isAuthenticated: false });

  const completeOnboarding = useCallback((): void => {
    dispatch({ type: 'AUTH/COMPLETE_ONBOARDING' });
  }, []);

  const logout = useCallback((): void => {
    dispatch({ type: 'AUTH/LOGOUT' });
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    return {
      state,
      completeOnboarding,
      logout,
    };
  }, [state, completeOnboarding, logout]);

  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return value;
}

