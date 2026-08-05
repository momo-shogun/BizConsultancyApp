import type { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

import { store } from '@/store';

import { callEngine } from '../engine/CallEngine';
import {
  cancelIncomingCallNotification,
  displayIncomingCallNotification,
  type CallPushDelivery,
} from './callNotificationService';
import { parseCallEndedPushData, parseIncomingCallPushData } from './callPushPayload';

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

async function handleCallEndedRemoteMessage(
  data: Record<string, string | undefined> | undefined,
): Promise<void> {
  const payload = parseCallEndedPushData(data);
  if (payload == null) {
    return;
  }
  if (__DEV__) {
    console.log(`[calls] FCM call.ended session=${payload.sessionId} status=${payload.status}`);
  }
  await cancelIncomingCallNotification(payload.sessionId);
  callEngine.applyRemoteCallEnded(payload);
}

/**
 * FCM entry for call pushes (incoming ring + ended/cancel).
 */
export async function handleIncomingCallRemoteMessage(
  message: FirebaseMessagingTypes.RemoteMessage | null | undefined,
  opts?: { delivery?: CallPushDelivery },
): Promise<void> {
  if (message == null) {
    return;
  }
  const data = normalizeFcmData(message.data);
  const type = data?.type;

  if (type === 'call.ended') {
    await handleCallEndedRemoteMessage(data);
    return;
  }

  const payload = parseIncomingCallPushData(data);
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
  const accepted = await callEngine.handleIncomingAsync(payload, {
    // Notification-center / cold tap: only open UI if status confirms still ringing.
    // Live FCM must not fail-closed — that cancels the native Answer/Decline popup.
    requireConfirmedRinging: opts?.delivery === 'opened',
  });
  if (!accepted) {
    const callState = store.getState().call;
    const stillRingingThisSession =
      callState.phase === 'incoming_ringing' &&
      callState.sessionId === payload.sessionId;
    // Duplicate FCM/socket must not wipe Answer/Decline while this session is still ringing.
    if (!stillRingingThisSession) {
      await cancelIncomingCallNotification(payload.sessionId);
    }
    return;
  }

  /** Paint tray only after we know the session is still ringing. */
  await displayIncomingCallNotification(payload, { delivery: opts?.delivery });
}
