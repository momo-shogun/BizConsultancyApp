import { PermissionsAndroid, Platform } from 'react-native';
import {
  AuthorizationStatus,
  deleteToken,
  getInitialNotification,
  getMessaging,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  onTokenRefresh,
  requestPermission,
} from '@react-native-firebase/messaging';

import type { AppDispatch } from '@/store';
import { store } from '@/store';

import { callsApi } from '../api/callsApi';
import { registerCallNotifeeForegroundHandler } from './callNotifeeEvents';
import {
  ensureCallNotificationsReady,
  setNativeIncomingCallPushEnabled,
} from './callNotificationService';
import { handleIncomingCallRemoteMessage } from './callPushHandlers';

const messaging = getMessaging();

/**
 * Gate for POST /calls/device-token.
 * `deleteToken()` rotates the FCM token and fires `onTokenRefresh` — if registration is still
 * allowed while logout is mid-flight, the new token is saved and pushes keep arriving.
 */
let fcmRegistrationEnabled = false;

async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    return result === PermissionsAndroid.RESULTS.GRANTED;
  }
  const authStatus = await requestPermission(messaging);
  return (
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL
  );
}

async function registerTokenWithServer(token: string): Promise<void> {
  if (!fcmRegistrationEnabled) {
    if (__DEV__) {
      console.log('[calls] FCM token register skipped (registration disabled)');
    }
    return;
  }
  const authToken = store.getState().auth?.token;
  if (authToken == null || authToken.length === 0) {
    if (__DEV__) {
      console.warn('[calls] FCM token not registered: missing auth token');
    }
    return;
  }
  const result = await store.dispatch(
    callsApi.endpoints.registerDeviceToken.initiate({
      token,
      platform: Platform.OS === 'ios' ? 'ios' : 'android',
    }),
  );
  if (__DEV__) {
    if ('error' in result) {
      console.warn('[calls] FCM device-token API failed', result.error);
    } else {
      console.log(`[calls] FCM device-token synced …${token.slice(-8)}`);
    }
  }
}

export async function syncFcmDeviceToken(): Promise<void> {
  fcmRegistrationEnabled = true;
  setNativeIncomingCallPushEnabled(true);
  await ensureCallNotificationsReady();
  const granted = await requestNotificationPermission();
  if (!granted && __DEV__) {
    console.warn('[calls] Notification permission not granted — tray may stay empty');
  }

  try {
    const token = await getToken(messaging);
    if (token.length === 0) {
      if (__DEV__) {
        console.warn('[calls] getToken() returned empty');
      }
      return;
    }
    await registerTokenWithServer(token);
  } catch (err) {
    if (__DEV__) {
      console.warn('[calls] syncFcmDeviceToken failed', err);
    }
  }
}

/**
 * Clear this device's FCM registration for the current account, then invalidate the local token.
 * Must run while the auth JWT is still present so the DELETE call is authorized.
 */
export async function unregisterFcmDeviceToken(dispatch: AppDispatch): Promise<void> {
  // Block onTokenRefresh → register races before we rotate the local token.
  fcmRegistrationEnabled = false;
  setNativeIncomingCallPushEnabled(false);

  try {
    await dispatch(callsApi.endpoints.clearDeviceToken.initiate()).unwrap();
    if (__DEV__) {
      console.log('[calls] FCM device-token cleared on server');
    }
  } catch (err) {
    if (__DEV__) {
      console.warn('[calls] clear device-token API failed', err);
    }
  }

  try {
    await deleteToken(messaging);
    if (__DEV__) {
      console.log('[calls] local FCM token deleted');
    }
  } catch (err) {
    if (__DEV__) {
      console.warn('[calls] deleteToken failed', err);
    }
  }

  /**
   * `deleteToken` can race a refresh that registered a brand-new token under the still-valid JWT.
   * Clear again so the account row is empty even if that happened.
   */
  try {
    await dispatch(callsApi.endpoints.clearDeviceToken.initiate()).unwrap();
  } catch {
    // Best-effort — JWT may already be mid-teardown.
  }
}

export function startCallPushListeners(): () => void {
  fcmRegistrationEnabled = true;
  void ensureCallNotificationsReady();

  const unsubNotifee = registerCallNotifeeForegroundHandler();

  const unsubRefresh = onTokenRefresh(messaging, (token) => {
    void registerTokenWithServer(token);
  });

  const unsubForeground = onMessage(messaging, (message) => {
    void handleIncomingCallRemoteMessage(message, { delivery: 'foreground' });
  });

  const unsubOpened = onNotificationOpenedApp(messaging, (message) => {
    void handleIncomingCallRemoteMessage(message, { delivery: 'opened' });
  });

  void getInitialNotification(messaging).then((message) => {
    void handleIncomingCallRemoteMessage(message, { delivery: 'opened' });
  });

  return () => {
    fcmRegistrationEnabled = false;
    unsubNotifee();
    unsubRefresh();
    unsubForeground();
    unsubOpened();
  };
}
