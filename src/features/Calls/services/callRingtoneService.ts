import { Platform, Vibration } from 'react-native';
import InCallManager from 'react-native-incall-manager';

import { INCOMING_RING_TIMEOUT_MS } from '@/constants/calls';

/** Bundled `incallmanager_ringtone.mp3` / `incallmanager_ringback.mp3` in native projects. */
const BUNDLED_CALL_AUDIO = '_BUNDLE_';

let isIncomingRinging = false;
let isOutgoingRingback = false;

const ANDROID_VIBRATE_PATTERN = [0, 900, 400, 900] as const;

/** Never ring past the point where the session can still be answered. */
const RINGTONE_MAX_SECONDS = Math.ceil(INCOMING_RING_TIMEOUT_MS / 1000);

function startIncomingRingtone(): void {
  if (Platform.OS === 'android') {
    InCallManager.startRingtone(
      BUNDLED_CALL_AUDIO,
      [...ANDROID_VIBRATE_PATTERN],
      '',
      RINGTONE_MAX_SECONDS,
    );
    return;
  }

  InCallManager.startRingtone(BUNDLED_CALL_AUDIO, [], 'playback', RINGTONE_MAX_SECONDS);
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
