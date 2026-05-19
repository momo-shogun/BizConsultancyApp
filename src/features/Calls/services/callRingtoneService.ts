import { Platform, Vibration } from 'react-native';
import InCallManager from 'react-native-incall-manager';

let isRinging = false;

const ANDROID_VIBRATE_PATTERN = [0, 900, 400, 900] as const;

export const callRingtoneService = {
  start(): void {
    if (isRinging) {
      return;
    }
    isRinging = true;

    try {
      if (Platform.OS === 'android') {
        InCallManager.startRingtone('_DEFAULT_', [...ANDROID_VIBRATE_PATTERN], '', 60);
      } else {
        InCallManager.startRingtone('_DEFAULT_');
      }
    } catch {
      if (Platform.OS === 'android') {
        Vibration.vibrate([...ANDROID_VIBRATE_PATTERN], true);
      }
    }
  },

  stop(): void {
    if (!isRinging) {
      return;
    }
    isRinging = false;

    try {
      InCallManager.stopRingtone();
    } catch {
      // ignore
    }

    try {
      Vibration.cancel();
    } catch {
      // ignore
    }
  },
};
