import React from 'react';

import { ConsultantTodoPlaceholder } from '@/features/Profile/components/ConsultantTodoPlaceholder';

export function ConsultantMyServicesScreen(): React.ReactElement {
  return (
    <ConsultantTodoPlaceholder
      title="My Services"
      iconName="bag-outline"
      iconColor="#0284C7"
      iconBgColor="rgba(2,132,199,0.12)"
      todoMessage="TODO: Consultant services — list active offerings, onboarding status, and service management."
    />
  );
}
