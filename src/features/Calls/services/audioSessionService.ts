import { Platform } from 'react-native';

import { agoraMediaService } from './agoraMediaService';

/**
 * Audio routing facade. Full native CallKit / ConnectionService integration
 * can extend this module without touching CallEngine.
 */
export const audioSessionService = {
  configureForCall(): void {
    agoraMediaService.refreshVoiceAudio();
    agoraMediaService.setSpeakerphone(true);
  },

  setSpeakerphone(enabled: boolean): void {
    agoraMediaService.setSpeakerphone(enabled);
  },

  onInterruptionBegan(): void {
    agoraMediaService.setMuted(true);
  },

  onInterruptionEnded(): void {
    if (Platform.OS === 'ios') {
      agoraMediaService.setMuted(false);
    }
  },
};
