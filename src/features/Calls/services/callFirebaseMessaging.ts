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
    return;
  }
  await store.dispatch(
    callsApi.endpoints.registerDeviceToken.initiate({
      token,
      platform: Platform.OS === 'ios' ? 'ios' : 'android',
    }),
  );
}

export async function syncFcmDeviceToken(): Promise<void> {
  await ensureCallNotificationsReady();
  await requestNotificationPermission();

  const token = await messaging().getToken();
  if (token.length === 0) {
    return;
  }
  await registerTokenWithServer(token);
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
