import notifee, {
  AndroidCategory,
  AndroidForegroundServiceType,
  AndroidImportance,
  AndroidVisibility,
} from '@notifee/react-native';
import { Platform } from 'react-native';

import { ONGOING_CALL_CHANNEL_ID } from '../constants/callNotifications';

/** Single foreground-service / return notification per app. */
const ONGOING_CALL_NOTIFICATION_ID = 'ongoing_call';

/** Marks the return notification so a tap can reopen the right call screen. */
export const ONGOING_CALL_NOTIFICATION_TYPE = 'call.ongoing';

export type ReturnToCallStage = 'outgoing_ringing' | 'incoming_ringing' | 'in_call';

/** Timer text refresh — keep light so background transitions are not blocked by re-posts. */
const TIMER_REFRESH_MS = 5_000;

let channelReady = false;
let channelWarmPromise: Promise<void> | null = null;
let serviceRunning = false;
let updateTimer: ReturnType<typeof setInterval> | null = null;
let callTitle = 'Ongoing call';
let callIsVideo = false;
let connectedAtMs = 0;
let callSessionId = 0;
let callStage: ReturnToCallStage = 'in_call';
let renderInFlight: Promise<void> | null = null;

async function ensureOngoingCallChannel(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }
  if (channelReady) {
    return;
  }
  if (channelWarmPromise == null) {
    channelWarmPromise = notifee
      .createChannel({
        id: ONGOING_CALL_CHANNEL_ID,
        name: 'Ongoing calls',
        description: 'Shows an active or ringing call so you can return from the background',
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
      })
      .then(() => {
        channelReady = true;
      })
      .finally(() => {
        channelWarmPromise = null;
      });
  }
  await channelWarmPromise;
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

function buildBody(): string {
  if (callStage === 'outgoing_ringing') {
    return 'Calling… · Tap to return';
  }
  if (callStage === 'incoming_ringing') {
    return 'Incoming call · Tap to return';
  }
  const label = callIsVideo ? 'Video call' : 'Voice call';
  if (connectedAtMs <= 0) {
    return `${label} · Tap to return`;
  }
  const elapsed = formatDuration(Date.now() - connectedAtMs);
  return `${label} · ${elapsed} · Tap to return`;
}

async function renderOngoingCallNotification(): Promise<void> {
  if (Platform.OS !== 'android' || callSessionId <= 0) {
    return;
  }
  /**
   * Mic FGS only once the call is connected. Ringing must not hold a foreground service —
   * otherwise force-closing the app keeps the process (and socket) alive and the callee
   * keeps ringing / can still answer.
   */
  const useMicForegroundService = callStage === 'in_call';

  await notifee.displayNotification({
    id: ONGOING_CALL_NOTIFICATION_ID,
    title: callTitle,
    body: buildBody(),
    data: {
      type: ONGOING_CALL_NOTIFICATION_TYPE,
      sessionId: String(callSessionId),
      stage: callStage,
    },
    android: {
      channelId: ONGOING_CALL_CHANNEL_ID,
      category: AndroidCategory.CALL,
      ...(useMicForegroundService
        ? {
            asForegroundService: true,
            foregroundServiceTypes: [
              AndroidForegroundServiceType.FOREGROUND_SERVICE_TYPE_MICROPHONE,
            ],
          }
        : {}),
      importance: AndroidImportance.HIGH,
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

function queueRender(): Promise<void> {
  const next = (renderInFlight ?? Promise.resolve())
    .catch(() => undefined)
    .then(() => renderOngoingCallNotification());
  renderInFlight = next.then(
    () => undefined,
    () => undefined,
  );
  return next;
}

function shouldRunTimerRefresh(): boolean {
  return callStage === 'in_call' && connectedAtMs > 0;
}

/**
 * Android return-to-call tray entry for ringing + connected calls.
 * Connected / outgoing-ringing also run a mic foreground service so media survives backgrounding.
 */
export const callForegroundService = {
  /** Pre-create the channel during app/call init so the first paint is not blocked. */
  async warmUp(): Promise<void> {
    if (Platform.OS !== 'android') {
      return;
    }
    try {
      await ensureOngoingCallChannel();
    } catch {
      // Best-effort.
    }
  },

  async start(
    displayName: string,
    isVideo: boolean,
    startedAtMs: number,
    sessionId: number,
    stage: ReturnToCallStage = 'in_call',
  ): Promise<void> {
    if (Platform.OS !== 'android') {
      return;
    }
    callTitle = displayName.trim().length > 0 ? displayName.trim() : 'Ongoing call';
    callIsVideo = isVideo;
    connectedAtMs = startedAtMs > 0 ? startedAtMs : 0;
    callSessionId = sessionId;
    callStage = stage;
    serviceRunning = true;
    try {
      await ensureOngoingCallChannel();
      await queueRender();
      clearUpdateTimer();
      if (shouldRunTimerRefresh()) {
        updateTimer = setInterval(() => {
          void queueRender();
        }, TIMER_REFRESH_MS);
      }
    } catch {
      clearUpdateTimer();
      serviceRunning = false;
    }
  },

  /**
   * Re-post immediately when leaving the app so the tray entry is visible without waiting
   * for the next timer tick (or a full start() after Activity restart).
   */
  bump(): void {
    if (Platform.OS !== 'android' || !serviceRunning || callSessionId <= 0) {
      return;
    }
    void queueRender();
  },

  async stop(): Promise<void> {
    clearUpdateTimer();
    if (Platform.OS !== 'android' || !serviceRunning) {
      return;
    }
    serviceRunning = false;
    callSessionId = 0;
    callStage = 'in_call';
    try {
      await notifee.stopForegroundService();
    } catch {
      // ignore
    }
    try {
      await notifee.cancelNotification(ONGOING_CALL_NOTIFICATION_ID);
    } catch {
      // ignore — covers non-FGS incoming-ringing paints
    }
  },

  isRunning(): boolean {
    return serviceRunning;
  },
};
