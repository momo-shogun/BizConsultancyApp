import { agoraMediaService } from '../services/agoraMediaService';

let warmedToken: string | null = null;

export const callWarmupCoordinator = {
  onAuthenticated(token: string, appId?: string): void {
    warmedToken = token;
    if (appId != null && appId.length > 0) {
      void agoraMediaService.warmup(appId);
    }
  },

  onLogout(): void {
    warmedToken = null;
    agoraMediaService.release();
  },

  getWarmedToken(): string | null {
    return warmedToken;
  },

  /** Placeholder for FCM/APNs token registration when Firebase is configured. */
  registerPushToken(_deviceToken: string): void {
    // Phase 2: POST device token to backend
  },
};
