import { store } from '@/store';

import { callsApi } from '../api/callsApi';
import { agoraMediaService } from '../services/agoraMediaService';
import { syncFcmDeviceToken } from '../services/callFirebaseMessaging';
import { cancelAllCallNotifications } from '../services/callNotificationService';

let warmedToken: string | null = null;

export const callWarmupCoordinator = {
  onAuthenticated(token: string, appId?: string): void {
    warmedToken = token;
    if (appId != null && appId.length > 0) {
      void agoraMediaService.warmup(appId);
    }
    void syncFcmDeviceToken();
  },

  /**
   * Must run while the JWT is still valid so DELETE /calls/device-token succeeds.
   * Stops this device receiving call pushes for a logged-out account.
   */
  async onLogout(): Promise<void> {
    warmedToken = null;
    agoraMediaService.release();
    try {
      await store.dispatch(callsApi.endpoints.clearDeviceToken.initiate());
    } catch {
      // Best-effort — local cleanup still proceeds.
    }
    void cancelAllCallNotifications();
  },

  getWarmedToken(): string | null {
    return warmedToken;
  },
};
