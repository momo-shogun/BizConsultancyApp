import notifee, { EventType, type Event } from '@notifee/react-native';

import { callEngine } from '../engine/CallEngine';
import { parseIncomingCallPushData } from './callPushPayload';
import { cancelIncomingCallNotification } from './callNotificationService';

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

  const payload = parseIncomingCallPushData(dataFromEvent(event));
  if (payload == null) {
    return;
  }

  callEngine.bindSocketHandlers();
  callEngine.handleIncoming(payload);

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
