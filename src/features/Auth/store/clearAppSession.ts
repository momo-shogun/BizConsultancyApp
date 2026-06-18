import { baseApi } from '@/services/api/baseApi';
import type { AppDispatch } from '@/store';

import { logout } from './authSlice';

/** Clears auth state and all RTK Query cached user data (bookings, wallet, profile, …). */
export function clearAppSession(dispatch: AppDispatch): void {
  dispatch(logout());
  dispatch(baseApi.util.resetApiState());
}
