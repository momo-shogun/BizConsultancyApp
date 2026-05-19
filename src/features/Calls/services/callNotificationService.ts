import notifee, {
  AndroidCategory,
  AndroidImportance,
  AndroidVisibility,
} from '@notifee/react-native';
import { AppState, Platform } from 'react-native';

import { INCOMING_CALLS_CHANNEL_ID } from '../constants/callNotifications';
import type { CallIncomingPayload } from '../types/callApi.types';

let channelReady = false;

async function ensureIncomingCallChannel(): Promise<void> {
  if (channelReady || Platform.OS !== 'android') {
    return;
  }
  await notifee.createChannel({
    id: INCOMING_CALLS_CHANNEL_ID,
    name: 'Incoming calls',
    description: 'Alerts for incoming voice and video calls',
    importance: AndroidImportance.HIGH,
    visibility: AndroidVisibility.PUBLIC,
    sound: 'default',
    vibration: true,
    bypassDnd: true,
  });
  channelReady = true;
}

function callerDisplayName(payload: CallIncomingPayload): string {
  const name = payload.callerName?.trim();
  return name != null && name.length > 0 ? name : 'Incoming caller';
}

/** Heads-up / lock-screen notification for background incoming calls (Android). */
export async function displayIncomingCallNotification(
  payload: CallIncomingPayload,
): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }

  const appState = AppState.currentState;
  if (appState === 'active') {
    return;
  }

  await ensureIncomingCallChannel();

  const callerName = callerDisplayName(payload);
  const isVideo = payload.callType === 'video';

  await notifee.displayNotification({
    id: String(payload.sessionId),
    title: callerName,
    body: isVideo ? 'Incoming video call' : 'Incoming voice call',
    data: {
      type: 'call.incoming',
      sessionId: String(payload.sessionId),
      callType: payload.callType,
      callerUserId: String(payload.callerUserId),
      callerRole: payload.callerRole,
      calleeUserId: String(payload.calleeUserId),
      calleeRole: payload.calleeRole,
      callerName: callerName,
      callerThumbnail: payload.callerThumbnail ?? '',
    },
    android: {
      channelId: INCOMING_CALLS_CHANNEL_ID,
      category: AndroidCategory.CALL,
      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
      ongoing: true,
      autoCancel: false,
      sound: 'default',
      vibrationPattern: [0, 900, 400, 900],
      pressAction: {
        id: 'default',
        launchActivity: 'default',
      },
      fullScreenAction: {
        id: 'incoming_call',
        launchActivity: 'default',
      },
      actions: [
        {
          title: 'Decline',
          pressAction: { id: 'decline' },
        },
        {
          title: 'Answer',
          pressAction: { id: 'answer', launchActivity: 'default' },
        },
      ],
    },
  });
}

export async function cancelIncomingCallNotification(sessionId: number | null): Promise<void> {
  if (Platform.OS !== 'android' || sessionId == null) {
    return;
  }
  await notifee.cancelNotification(String(sessionId));
}

export async function cancelAllCallNotifications(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }
  await notifee.cancelAllNotifications();
}
