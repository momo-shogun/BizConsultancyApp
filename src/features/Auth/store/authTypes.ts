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

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loginSession: LoginSession | null;
}
