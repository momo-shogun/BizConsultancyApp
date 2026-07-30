import { NativeModules, Platform } from 'react-native';

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

  callEngine.bindSocketHandlers();
  callEngine.seedIncomingFromNotification(payload);

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

  return true;
}
