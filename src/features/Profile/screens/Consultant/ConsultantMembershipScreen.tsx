import React from 'react';

import { MembershipPlansScreen } from '../Membership/MembershipPlansScreen';

export function ConsultantMembershipScreen(): React.ReactElement {
  return (
    <MembershipPlansScreen
      config={{
        membershipApiType: 'experts',
        headerTitle: 'Consultant membership',
        pageTitle: 'Built for',
        pageTitleAccent: 'professional consultants',
        pageSubtitle:
          'Unlock unlimited sessions, advanced analytics, and premium visibility with consultant membership plans.',
      }}
    />
  );
}
