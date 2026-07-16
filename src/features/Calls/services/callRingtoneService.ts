import { Platform, Vibration } from 'react-native';
import InCallManager from 'react-native-incall-manager';

/** Bundled `incallmanager_ringtone.mp3` / `incallmanager_ringback.mp3` in native projects. */
const BUNDLED_CALL_AUDIO = '_BUNDLE_';

let isIncomingRinging = false;
let isOutgoingRingback = false;

const ANDROID_VIBRATE_PATTERN = [0, 900, 400, 900] as const;

function startIncomingRingtone(): void {
  if (Platform.OS === 'android') {
    InCallManager.startRingtone(BUNDLED_CALL_AUDIO, [...ANDROID_VIBRATE_PATTERN], '', 60);
    return;
  }

  InCallManager.startRingtone(BUNDLED_CALL_AUDIO, [], 'playback', 60);
}

export const callRingtoneService = {
  /** Incoming call — plays bundled ringtone for callee (user or consultant). */
  start(): void {
    if (isIncomingRinging) {
      return;
    }
    isIncomingRinging = true;

    try {
      startIncomingRingtone();
    } catch {
      if (Platform.OS === 'android') {
        Vibration.vibrate([...ANDROID_VIBRATE_PATTERN], true);
      }
    }
  },

  /** Outgoing call — plays bundled ringback while waiting for the other party. */
  startOutgoing(): void {
    if (isOutgoingRingback) {
      return;
    }
    isOutgoingRingback = true;

    try {
      InCallManager.startRingback(BUNDLED_CALL_AUDIO);
    } catch {
      // ignore — call UI still works without ringback
    }
  },

  stop(): void {
    if (isIncomingRinging) {
      isIncomingRinging = false;
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
    }

    if (isOutgoingRingback) {
      isOutgoingRingback = false;
      try {
        InCallManager.stopRingback();
      } catch {
        // ignore
      }
    }
  },
};
