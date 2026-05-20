/**
 * @format
 */

import 'react-native-gesture-handler';
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

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  await handleIncomingCallRemoteMessage(remoteMessage, { delivery: 'background' });
});

AppRegistry.registerComponent(appName, () => App);
