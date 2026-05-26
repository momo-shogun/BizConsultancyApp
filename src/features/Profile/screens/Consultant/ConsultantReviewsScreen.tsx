import React from 'react';

import { ConsultantTodoPlaceholder } from '@/features/Profile/components/ConsultantTodoPlaceholder';

export function ConsultantReviewsScreen(): React.ReactElement {
  return (
    <ConsultantTodoPlaceholder
      title="Review"
      iconName="star-outline"
      iconColor="#2563EB"
      iconBgColor="rgba(37,99,235,0.10)"
      todoMessage="TODO: Reviews — read client feedback, ratings summary, and reply or report options."
    />
  );
}
