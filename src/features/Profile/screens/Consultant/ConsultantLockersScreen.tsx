import React from 'react';

import { ConsultantTodoPlaceholder } from '@/features/Profile/components/ConsultantTodoPlaceholder';

export function ConsultantLockersScreen(): React.ReactElement {
  return (
    <ConsultantTodoPlaceholder
      title="My Lockers"
      iconName="lock-closed-outline"
      iconColor="#9333EA"
      iconBgColor="rgba(147,51,234,0.12)"
      todoMessage="TODO: Document locker — upload, organize, and share secure files with clients."
    />
  );
}
