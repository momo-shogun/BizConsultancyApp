import React from 'react';

import { ConsultantTodoPlaceholder } from '@/features/Profile/components/ConsultantTodoPlaceholder';

export function ConsultantSlotTimeScreen(): React.ReactElement {
  return (
    <ConsultantTodoPlaceholder
      title="Slot Time"
      iconName="time-outline"
      iconColor="#16A34A"
      iconBgColor="rgba(22,163,74,0.12)"
      todoMessage="TODO: Manage available consultation slots — weekly schedule, duration, and availability toggles."
    />
  );
}
