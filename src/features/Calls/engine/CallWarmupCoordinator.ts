import { agoraMediaService } from '../services/agoraMediaService';
import { syncFcmDeviceToken } from '../services/callFirebaseMessaging';
import { cancelAllCallNotifications } from '../services/callNotificationService';
import { callEngine } from './CallEngine';

let warmedToken: string | null = null;

export const callWarmupCoordinator = {
  onAuthenticated(token: string, appId?: string): void {
    warmedToken = token;
    if (appId != null && appId.length > 0) {
      void agoraMediaService.warmup(appId);
    }
    void syncFcmDeviceToken();
  },

  /** Drop media + call socket so the next login cannot keep the previous account's rooms. */
  onLogout(): void {
    warmedToken = null;
    agoraMediaService.release();
    callEngine.unbindSocketHandlers();
    void cancelAllCallNotifications();
  },

  getWarmedToken(): string | null {
    return warmedToken;
  },
};
