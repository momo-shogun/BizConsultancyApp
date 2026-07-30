/**
 * @format
 */

import 'react-native-gesture-handler';
import './src/polyfills/readableStream';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import { AppRegistry } from 'react-native';

import { handleCallNotifeeEvent } from './src/features/Calls/services/callNotifeeEvents';
import { handleIncomingCallRemoteMessage } from './src/features/Calls/services/callPushHandlers';

import App from './App';
import { name as appName } from './app.json';

notifee.onBackgroundEvent(async (event) => {
  await handleCallNotifeeEvent(event);
});

// Ongoing-call microphone foreground service runner. The task stays pending for the
// service lifetime; `callForegroundService.stop()` (notifee.stopForegroundService) ends it.
notifee.registerForegroundService(() => {
  return new Promise(() => {});
});

/**
 * Background / quit FCM. Display Notifee first; never let CallEngine errors drop the tray UI.
 * Killed-state Android also uses native `IncomingCallFcmReceiver` when the process is dead.
 */
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  try {
    await handleIncomingCallRemoteMessage(remoteMessage, { delivery: 'background' });
  } catch (error) {
    console.warn('[calls] background FCM handler failed', error);
  }
});

AppRegistry.registerComponent(appName, () => App);
