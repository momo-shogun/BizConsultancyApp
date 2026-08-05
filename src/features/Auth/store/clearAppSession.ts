import { callWarmupCoordinator } from '@/features/Calls/engine/CallWarmupCoordinator';
import { unregisterFcmDeviceToken } from '@/features/Calls/services/callFirebaseMessaging';
import { baseApi } from '@/services/api/baseApi';
import type { AppDispatch } from '@/store';

import { logout } from './authSlice';

type SessionDispatch = AppDispatch | ((action: unknown) => unknown);

/**
 * Clears FCM registration (while JWT still valid), then auth state and RTK Query cache.
 */
export async function clearAppSession(dispatch: SessionDispatch): Promise<void> {
  await unregisterFcmDeviceToken(dispatch as AppDispatch);
  callWarmupCoordinator.onLogout();
  dispatch(logout());
  dispatch(baseApi.util.resetApiState());
}
