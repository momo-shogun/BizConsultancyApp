import type { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

import { callEngine } from '../engine/CallEngine';
import { displayIncomingCallNotification, type CallPushDelivery } from './callNotificationService';
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
    return;
  }

  await displayIncomingCallNotification(payload, { delivery: opts?.delivery });
  callEngine.bindSocketHandlers();
  callEngine.handleIncoming(payload);
}
