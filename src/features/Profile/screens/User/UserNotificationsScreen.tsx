import React from 'react';

import { NotificationsScreenContent } from '@/features/Profile/components/notifications/NotificationsScreenContent';
import { USER_NOTIFICATIONS } from '@/features/Profile/constants/userNotificationsMock';

export function UserNotificationsScreen(): React.ReactElement {
  return <NotificationsScreenContent variant="user" items={USER_NOTIFICATIONS} />;
}

export default UserNotificationsScreen;
