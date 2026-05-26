import React from 'react';

import { ConsultantTodoPlaceholder } from '@/features/Profile/components/ConsultantTodoPlaceholder';

export function ConsultantExpertiseScreen(): React.ReactElement {
  return (
    <ConsultantTodoPlaceholder
      title="Expertise"
      iconName="ribbon-outline"
      iconColor="#DB2777"
      iconBgColor="rgba(219,39,119,0.12)"
      todoMessage="TODO: Expertise profile — categories, skills, certifications, and public showcase fields."
    />
  );
}
