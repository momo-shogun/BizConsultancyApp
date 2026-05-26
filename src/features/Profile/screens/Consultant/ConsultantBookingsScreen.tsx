import React from 'react';

import { ConsultantTodoPlaceholder } from '@/features/Profile/components/ConsultantTodoPlaceholder';

export function ConsultantBookingsScreen(): React.ReactElement {
  return (
    <ConsultantTodoPlaceholder
      title="Bookings"
      iconName="calendar-outline"
      iconColor="#7C3AED"
      iconBgColor="rgba(124,58,237,0.12)"
      todoMessage="TODO: Consultant bookings list — upcoming and past sessions, filters, and booking details."
    />
  );
}
