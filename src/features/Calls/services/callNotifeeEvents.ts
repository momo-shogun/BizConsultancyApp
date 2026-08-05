import notifee, { EventType, type Event } from '@notifee/react-native';

import { callEngine } from '../engine/CallEngine';
import { parseIncomingCallPushData } from './callPushPayload';
import { cancelIncomingCallNotification } from './callNotificationService';
import { ONGOING_CALL_NOTIFICATION_TYPE } from './callForegroundService';

function dataFromEvent(event: Event): Record<string, string | undefined> | undefined {
  const raw = event.detail.notification?.data;
  if (raw == null) {
    return undefined;
  }
  const normalized: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === 'string') {
      normalized[key] = value;
    }
  }
  return normalized;
}

function readSessionId(data: Record<string, string | undefined> | undefined): number | undefined {
  if (data?.sessionId == null || data.sessionId.length === 0) {
    return undefined;
  }
  const parsed = Number(data.sessionId);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

export async function handleCallNotifeeEvent(event: Event): Promise<void> {
  const { type, detail } = event;
  const pressId = detail.pressAction?.id;

  if (
    type !== EventType.ACTION_PRESS &&
    type !== EventType.PRESS &&
    type !== EventType.DELIVERED
  ) {
    return;
  }

  if (type === EventType.DELIVERED) {
    return;
  }

  const eventData = dataFromEvent(event);

  /** Tap on the ongoing-call foreground-service notification → reopen the in-call screen. */
  if (eventData?.type === ONGOING_CALL_NOTIFICATION_TYPE) {
    if (type === EventType.PRESS) {
      await callEngine.returnToActiveCall(readSessionId(eventData));
    }
    return;
  }

  const payload = parseIncomingCallPushData(eventData);
  if (payload == null) {
    return;
  }

  callEngine.bindSocketHandlers();
  const seeded = await callEngine.seedIncomingFromNotificationAsync(payload);
  if (!seeded) {
    await cancelIncomingCallNotification(payload.sessionId);
    return;
  }

  if (pressId === 'decline') {
    await callEngine.declineIncoming();
    await cancelIncomingCallNotification(payload.sessionId);
    return;
  }

  if (pressId === 'answer') {
    /** Queue retry for cold start — first accept may race auth / Agora native init. */
    callEngine.requestAcceptFromNotification(payload.sessionId);
    await callEngine.acceptIncoming();
    await cancelIncomingCallNotification(payload.sessionId);
  }
}

export function registerCallNotifeeForegroundHandler(): () => void {
  return notifee.onForegroundEvent((event) => {
    void handleCallNotifeeEvent(event);
  });
}

/** Cold start: user opened the app by tapping the ongoing-call notification. */
export async function consumeInitialOngoingCallNotification(): Promise<void> {
  try {
    const initial = await notifee.getInitialNotification();
    if (initial == null) {
      return;
    }
    const raw = initial.notification?.data;
    if (raw == null || raw.type !== ONGOING_CALL_NOTIFICATION_TYPE) {
      return;
    }
    const sessionRaw = raw.sessionId;
    const sessionId = typeof sessionRaw === 'string' || typeof sessionRaw === 'number'
      ? Number(sessionRaw)
      : NaN;
    await callEngine.returnToActiveCall(
      Number.isFinite(sessionId) && sessionId > 0 ? sessionId : undefined,
    );
  } catch {
    // ignore — restoreActiveCallIfNeeded still covers MMKV snapshot
  }
}
