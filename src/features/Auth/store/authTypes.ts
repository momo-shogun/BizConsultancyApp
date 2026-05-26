import type { AuthRole } from '../types/authApi.types';

export interface User {
  id: string;
  name: string;
  phone: string;
  /** Present when backend sends `auth.user.email` (e.g. after OTP / refresh). */
  email?: string | null;
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
  email?: string | null;
  accountRole: AuthRole;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  tokenExpiresAt: number | null;
  isAuthenticated: boolean;
  /** Browsing app without OTP/login; 401 responses must not force logout. */
  isGuestSession: boolean;
  isRestoringSession: boolean;
  /** Persisted mobile from login / OTP (shown on profile). */
  mobile: string | null;
  displayName: string | null;
  email: string | null;
  accountRole: AuthRole | null;
  /** Last chosen role; kept across logout so login/signup can skip role picker. */
  preferredAccountRole: AuthRole | null;
  loginSession: LoginSession | null;
}
