import notifee, {
  AndroidCategory,
  AndroidForegroundServiceType,
  AndroidImportance,
  AndroidVisibility,
} from '@notifee/react-native';
import { Platform } from 'react-native';

import { ONGOING_CALL_CHANNEL_ID } from '../constants/callNotifications';

/** Single foreground-service notification per app; a stable id keeps updates in-place. */
const ONGOING_CALL_NOTIFICATION_ID = 'ongoing_call';

/** Marks the FGS notification so a tap can be routed back to the in-call screen. */
export const ONGOING_CALL_NOTIFICATION_TYPE = 'call.ongoing';

let channelReady = false;
let serviceRunning = false;
let updateTimer: ReturnType<typeof setInterval> | null = null;
let callTitle = 'Ongoing call';
let callIsVideo = false;
let connectedAtMs = 0;
let callSessionId = 0;

async function ensureOngoingCallChannel(): Promise<void> {
  if (channelReady || Platform.OS !== 'android') {
    return;
  }
  await notifee.createChannel({
    id: ONGOING_CALL_CHANNEL_ID,
    name: 'Ongoing calls',
    description: 'Keeps voice and video calls connected while the app is in the background',
    importance: AndroidImportance.LOW,
    visibility: AndroidVisibility.PUBLIC,
  });
  channelReady = true;
}

/** `mm:ss`, or `h:mm:ss` past an hour — same style as the in-call timer. */
function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}

function clearUpdateTimer(): void {
  if (updateTimer != null) {
    clearInterval(updateTimer);
    updateTimer = null;
  }
}

async function renderOngoingCallNotification(): Promise<void> {
  const label = callIsVideo ? 'Video call' : 'Voice call';
  const elapsed = formatDuration(Date.now() - connectedAtMs);
  await notifee.displayNotification({
    id: ONGOING_CALL_NOTIFICATION_ID,
    title: callTitle,
    body: `${label} · ${elapsed}`,
    data: {
      type: ONGOING_CALL_NOTIFICATION_TYPE,
      sessionId: String(callSessionId),
    },
    android: {
      channelId: ONGOING_CALL_CHANNEL_ID,
      category: AndroidCategory.CALL,
      asForegroundService: true,
      foregroundServiceTypes: [AndroidForegroundServiceType.FOREGROUND_SERVICE_TYPE_MICROPHONE],
      importance: AndroidImportance.LOW,
      visibility: AndroidVisibility.PUBLIC,
      ongoing: true,
      autoCancel: false,
      onlyAlertOnce: true,
      pressAction: {
        id: 'default',
        launchActivity: 'default',
      },
    },
  });
}

/**
 * Android microphone foreground service for an active call. Legitimately backs the declared
 * `FOREGROUND_SERVICE` + `FOREGROUND_SERVICE_MICROPHONE` permissions so the mic keeps streaming
 * (Agora) once the app is backgrounded. The notification shows a live call timer, updated every
 * second (Notifee has no native chronometer). iOS handles background audio via its audio session.
 */
export const callForegroundService = {
  async start(
    displayName: string,
    isVideo: boolean,
    startedAtMs: number,
    sessionId: number,
  ): Promise<void> {
    if (Platform.OS !== 'android' || serviceRunning) {
      return;
    }
    serviceRunning = true;
    callTitle = displayName.trim().length > 0 ? displayName.trim() : 'Ongoing call';
    callIsVideo = isVideo;
    connectedAtMs = startedAtMs > 0 ? startedAtMs : Date.now();
    callSessionId = sessionId;
    try {
      await ensureOngoingCallChannel();
      await renderOngoingCallNotification();
      clearUpdateTimer();
      updateTimer = setInterval(() => {
        void renderOngoingCallNotification();
      }, 1000);
    } catch {
      clearUpdateTimer();
      serviceRunning = false;
    }
  },

  async stop(): Promise<void> {
    clearUpdateTimer();
    if (Platform.OS !== 'android' || !serviceRunning) {
      return;
    }
    serviceRunning = false;
    try {
      await notifee.stopForegroundService();
    } catch {
      // ignore — notification is removed when the service stops
    }
  },
};
