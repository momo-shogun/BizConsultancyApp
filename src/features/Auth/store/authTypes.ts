import type { AuthRole } from '../types/authApi.types';

export interface User {
  id: string;
  name: string;
  phone: string;
}

export interface LoginSession {
  mobile: string;
  role: AuthRole;
  isRegistered: boolean;
}

export interface AuthProfile {
  displayName: string | null;
  accountRole: AuthRole | null;
}

export interface AuthSessionPayload {
  accessToken: string;
  refreshToken?: string | null;
  tokenExpiresAt?: number | null;
  userId: string;
  displayName?: string | null;
  mobile: string;
  accountRole: AuthRole;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  tokenExpiresAt: number | null;
  isAuthenticated: boolean;
  isRestoringSession: boolean;
  /** Persisted mobile from login / OTP (shown on profile). */
  mobile: string | null;
  displayName: string | null;
  accountRole: AuthRole | null;
  loginSession: LoginSession | null;
}
