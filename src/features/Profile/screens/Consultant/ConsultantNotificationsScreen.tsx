import React from 'react';

import { NotificationsScreenContent } from '@/features/Profile/components/notifications/NotificationsScreenContent';
import { CONSULTANT_NOTIFICATIONS } from '@/features/Profile/constants/consultantNotificationsMock';

export function ConsultantNotificationsScreen(): React.ReactElement {
  return (
    <NotificationsScreenContent variant="consultant" items={CONSULTANT_NOTIFICATIONS} />
  );
}

export default ConsultantNotificationsScreen;
