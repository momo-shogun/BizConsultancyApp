import React from 'react';

import { MyMembershipScreenView } from '@/features/Profile/screens/Membership/MyMembershipScreenView';

export function ConsultantMyMembershipScreen(): React.ReactElement {
  return (
    <MyMembershipScreenView
      membershipLine="experts"
      emptySubtitle="Purchase a consultant membership plan to view your plan details here."
    />
  );
}

export default ConsultantMyMembershipScreen;
