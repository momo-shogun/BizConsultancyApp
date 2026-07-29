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

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  await handleIncomingCallRemoteMessage(remoteMessage, { delivery: 'background' });
});

AppRegistry.registerComponent(appName, () => App);
