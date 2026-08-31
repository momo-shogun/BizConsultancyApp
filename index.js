/**
 * @format
 */

import 'react-native-gesture-handler';
import './src/polyfills/readableStream';
import {
  getMessaging,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import { AppRegistry, Platform } from 'react-native';

import App from './App';
import { name as appName } from './app.json';

const messaging = getMessaging();

notifee.onBackgroundEvent(async (event) => {
  const { handleCallNotifeeEvent } = require('./src/features/Calls/services/callNotifeeEvents');
  await handleCallNotifeeEvent(event);
});

if (Platform.OS === 'android') {
  notifee.registerForegroundService(() => {
    return new Promise(() => {});
  });
}

setBackgroundMessageHandler(messaging, async (remoteMessage) => {
  try {
    const { handleIncomingCallRemoteMessage } = require('./src/features/Calls/services/callPushHandlers');
    await handleIncomingCallRemoteMessage(remoteMessage, { delivery: 'background' });
  } catch (error) {
    console.warn('[calls] background FCM handler failed', error);
  }
});

AppRegistry.registerComponent(appName, () => App);
