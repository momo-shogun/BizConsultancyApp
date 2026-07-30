import { PermissionsAndroid, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';

import { store } from '@/store';

import { callsApi } from '../api/callsApi';
import { registerCallNotifeeForegroundHandler } from './callNotifeeEvents';
import { ensureCallNotificationsReady } from './callNotificationService';
import { handleIncomingCallRemoteMessage } from './callPushHandlers';

async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    return result === PermissionsAndroid.RESULTS.GRANTED;
  }
  const authStatus = await messaging().requestPermission();
  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  );
}

async function registerTokenWithServer(token: string): Promise<void> {
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
  await ensureCallNotificationsReady();
  const granted = await requestNotificationPermission();
  if (!granted && __DEV__) {
    console.warn('[calls] Notification permission not granted — tray may stay empty');
  }

  try {
    const token = await messaging().getToken();
    if (token.length === 0) {
      if (__DEV__) {
        console.warn('[calls] messaging().getToken() returned empty');
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

export function startCallPushListeners(): () => void {
  void ensureCallNotificationsReady();

  const unsubNotifee = registerCallNotifeeForegroundHandler();

  const unsubRefresh = messaging().onTokenRefresh((token) => {
    void registerTokenWithServer(token);
  });

  const unsubForeground = messaging().onMessage((message) => {
    void handleIncomingCallRemoteMessage(message, { delivery: 'foreground' });
  });

  const unsubOpened = messaging().onNotificationOpenedApp((message) => {
    void handleIncomingCallRemoteMessage(message, { delivery: 'opened' });
  });

  void messaging()
    .getInitialNotification()
    .then((message) => {
      void handleIncomingCallRemoteMessage(message, { delivery: 'opened' });
    });

  return () => {
    unsubNotifee();
    unsubRefresh();
    unsubForeground();
    unsubOpened();
  };
}
