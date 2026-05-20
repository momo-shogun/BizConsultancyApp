import notifee, {
  AndroidCategory,
  AndroidImportance,
  AndroidVisibility,
  AuthorizationStatus,
} from '@notifee/react-native';
import { AppState, Platform } from 'react-native';

import { INCOMING_CALLS_CHANNEL_ID } from '../constants/callNotifications';
import type { CallIncomingPayload } from '../types/callApi.types';
import { resolveCallPartyImageUrl } from '../utils/callPartyMedia';

let channelReady = false;
let iosCategoriesReady = false;

export type CallPushDelivery = 'foreground' | 'background' | 'opened';

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
    /** No channel sound/vibration — `callRingtoneService` (InCallManager) is the only ringer. */
    bypassDnd: true,
  });
  channelReady = true;
}

async function ensureIosCallCategories(): Promise<void> {
  if (Platform.OS !== 'ios' || iosCategoriesReady) {
    return;
  }
  await notifee.setNotificationCategories([
    {
      id: 'incoming_call',
      actions: [
        {
          id: 'decline',
          title: 'Decline',
          destructive: true,
          authenticationRequired: false,
        },
        {
          id: 'answer',
          title: 'Answer',
          foreground: true,
          authenticationRequired: false,
        },
      ],
    },
  ]);
  iosCategoriesReady = true;
}

function callerDisplayName(payload: CallIncomingPayload): string {
  const name = payload.callerName?.trim();
  return name != null && name.length > 0 ? name : 'Incoming caller';
}

async function ensureIosNotificationPermission(): Promise<void> {
  if (Platform.OS !== 'ios') {
    return;
  }
  const settings = await notifee.requestPermission({
    alert: true,
    sound: true,
    badge: false,
    criticalAlert: false,
    provisional: false,
  });
  if (settings.authorizationStatus === AuthorizationStatus.DENIED) {
    return;
  }
}

/** Public so `AppProviders` / feature init can preload categories early. */
export async function ensureCallNotificationsReady(): Promise<void> {
  await ensureIosCallCategories();
  await ensureIosNotificationPermission();
}

/**
 * Incoming-call tray / lock-screen delivery with Accept / Decline.
 * Uses `delivery` so FCM quit/background wakes always paint a callable notification without
 * relying solely on AppState === 'background' (unreliable in some headless wakes).
 */
export async function displayIncomingCallNotification(
  payload: CallIncomingPayload,
  opts?: { delivery?: CallPushDelivery },
): Promise<void> {
  const delivery = opts?.delivery ?? 'foreground';

  /** User tapped a system banner / cold-opened from notification center — app handles routing. */
  if (delivery === 'opened') {
    return;
  }

  /** In-app IncomingCall screen owns UX while the bridge is foregrounded. */
  if (delivery === 'foreground' && AppState.currentState === 'active') {
    return;
  }

  await ensureIosCallCategories();
  await ensureIosNotificationPermission();

  const callerName = callerDisplayName(payload);
  const isVideo = payload.callType === 'video';
  const body = isVideo ? 'Incoming video call' : 'Incoming voice call';

  const data: Record<string, string> = {
    type: 'call.incoming',
    sessionId: String(payload.sessionId),
    callType: payload.callType,
    callerUserId: String(payload.callerUserId),
    callerRole: payload.callerRole,
    calleeUserId: String(payload.calleeUserId),
    calleeRole: payload.calleeRole,
    callerName,
    callerThumbnail: payload.callerThumbnail ?? '',
    status: payload.status,
  };
  if (payload.eventId != null && payload.eventId.length > 0) {
    data.eventId = payload.eventId;
  }
  if (payload.eventVersion != null) {
    data.eventVersion = String(payload.eventVersion);
  }
  if (payload.timestamp != null) {
    data.timestamp = String(payload.timestamp);
  }

  if (Platform.OS === 'android') {
    await ensureIncomingCallChannel();
    const avatarKey = payload.callerThumbnail;
    let largeIcon: string | undefined;
    if (avatarKey != null && avatarKey.trim().length > 0) {
      const resolved = resolveCallPartyImageUrl(avatarKey);
      if (resolved != null && resolved.trim().length > 0) {
        largeIcon = resolved.trim();
      }
    }

    await notifee.displayNotification({
      id: String(payload.sessionId),
      title: callerName,
      body,
      data,
      android: {
        channelId: INCOMING_CALLS_CHANNEL_ID,
        category: AndroidCategory.CALL,
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
        ongoing: true,
        autoCancel: false,
        ...(largeIcon != null ? { largeIcon } : {}),
        pressAction: {
          id: 'default',
          launchActivity: 'default',
        },
        fullScreenAction: {
          id: 'incoming_call',
          launchActivity: 'default',
        },
        lights: ['#FFFFFF', 400, 800],
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
    return;
  }

  if (Platform.OS === 'ios') {
    await notifee.displayNotification({
      id: String(payload.sessionId),
      title: callerName,
      subtitle: body,
      body,
      data,
      ios: {
        sound: 'default',
        interruptionLevel: 'timeSensitive',
        categoryId: 'incoming_call',
        foregroundPresentationOptions: {
          alert: true,
          badge: false,
          sound: true,
        },
      },
    });
  }
}

export async function cancelIncomingCallNotification(sessionId: number | null): Promise<void> {
  if (sessionId == null) {
    return;
  }
  await notifee.cancelNotification(String(sessionId));
}

export async function cancelAllCallNotifications(): Promise<void> {
  await notifee.cancelAllNotifications();
}
