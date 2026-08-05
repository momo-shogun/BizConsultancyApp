import { NativeModules, Platform } from 'react-native';

import { store } from '@/store';

import { callsApi } from '../api/callsApi';
import { callEngine } from '../engine/CallEngine';
import { parseIncomingCallPushData } from './callPushPayload';
import { cancelIncomingCallNotification } from './callNotificationService';

interface PendingNativeIncomingCall {
  action: string;
  data: Record<string, string | undefined>;
}

interface CallAndroidPermissionsNative {
  consumePendingIncomingCall: () => Promise<PendingNativeIncomingCall | null>;
}

function getNativeModule(): CallAndroidPermissionsNative | null {
  if (Platform.OS !== 'android') {
    return null;
  }
  const mod = NativeModules.CallAndroidPermissions as CallAndroidPermissionsNative | undefined;
  if (mod == null || typeof mod.consumePendingIncomingCall !== 'function') {
    return null;
  }
  return mod;
}

async function isSessionStillRinging(sessionId: number): Promise<boolean> {
  const result = await store.dispatch(
    callsApi.endpoints.getCallStatus.initiate(sessionId, { forceRefetch: true }),
  );
  if ('error' in result || result.data == null) {
    // Fail closed on cold start — never reopen a missed call UI when status is unknown.
    return false;
  }
  return result.data.status === 'initiated' || result.data.status === 'ringing';
}

/**
 * Apply a killed-state native incoming-call notification action (open / answer / decline).
 * Native FCM receiver shows the tray when JS headless cannot start.
 */
export async function consumeNativePendingIncomingCall(): Promise<boolean> {
  const native = getNativeModule();
  if (native == null) {
    return false;
  }

  let pending: PendingNativeIncomingCall | null;
  try {
    pending = await native.consumePendingIncomingCall();
  } catch {
    return false;
  }
  if (pending == null) {
    return false;
  }

  const payload = parseIncomingCallPushData(pending.data);
  if (payload == null) {
    return false;
  }

  // Missed / ended / timed-out: never reopen IncomingCall just because pending prefs remained.
  if (!(await isSessionStillRinging(payload.sessionId))) {
    await cancelIncomingCallNotification(payload.sessionId);
    return false;
  }

  callEngine.bindSocketHandlers();
  const seeded = await callEngine.seedIncomingFromNotificationAsync(payload);
  if (!seeded) {
    await cancelIncomingCallNotification(payload.sessionId);
    return false;
  }

  const action = pending.action;
  if (action === 'decline') {
    await callEngine.declineIncoming();
    await cancelIncomingCallNotification(payload.sessionId);
    return true;
  }

  if (action === 'answer') {
    callEngine.requestAcceptFromNotification(payload.sessionId);
    await callEngine.acceptIncoming();
    await cancelIncomingCallNotification(payload.sessionId);
    return true;
  }

  // action === open (notification body tap while still ringing)
  return true;
}
