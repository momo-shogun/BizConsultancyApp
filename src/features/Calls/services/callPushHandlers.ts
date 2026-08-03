import type { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

import { store } from '@/store';

import { callEngine } from '../engine/CallEngine';
import {
  cancelIncomingCallNotification,
  displayIncomingCallNotification,
  type CallPushDelivery,
} from './callNotificationService';
import { parseIncomingCallPushData } from './callPushPayload';

function normalizeFcmData(
  data: FirebaseMessagingTypes.RemoteMessage['data'],
): Record<string, string | undefined> | undefined {
  if (data == null) {
    return undefined;
  }
  const normalized: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      normalized[key] = value;
    }
  }
  return normalized;
}

export async function handleIncomingCallRemoteMessage(
  message: FirebaseMessagingTypes.RemoteMessage | null | undefined,
  opts?: { delivery?: CallPushDelivery },
): Promise<void> {
  if (message == null) {
    return;
  }
  const payload = parseIncomingCallPushData(normalizeFcmData(message.data));
  if (payload == null) {
    if (__DEV__) {
      console.warn('[calls] FCM ignored: not a call.incoming payload', message.data);
    }
    return;
  }

  const authToken = store.getState().auth?.token;
  if (authToken == null || authToken.length === 0) {
    if (__DEV__) {
      console.warn('[calls] FCM call.incoming ignored: not authenticated');
    }
    return;
  }

  if (__DEV__) {
    console.log(
      `[calls] FCM call.incoming delivery=${opts?.delivery ?? '?'} session=${payload.sessionId}`,
    );
  }

  callEngine.bindSocketHandlers();
  const accepted = await callEngine.handleIncomingAsync(payload);
  if (!accepted) {
    await cancelIncomingCallNotification(payload.sessionId);
    return;
  }

  /** Paint tray only after we know the session is still ringing. */
  await displayIncomingCallNotification(payload, { delivery: opts?.delivery });
}
