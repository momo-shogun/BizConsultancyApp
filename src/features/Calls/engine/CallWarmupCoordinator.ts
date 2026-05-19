import { agoraMediaService } from '../services/agoraMediaService';
import { syncFcmDeviceToken } from '../services/callFirebaseMessaging';

let warmedToken: string | null = null;

export const callWarmupCoordinator = {
  onAuthenticated(token: string, appId?: string): void {
    warmedToken = token;
    if (appId != null && appId.length > 0) {
      void agoraMediaService.warmup(appId);
    }
    void syncFcmDeviceToken();
  },

  onLogout(): void {
    warmedToken = null;
    agoraMediaService.release();
  },

  getWarmedToken(): string | null {
    return warmedToken;
  },


};
