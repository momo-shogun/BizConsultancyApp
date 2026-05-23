import React from 'react';

import { MembershipPlansScreen } from '../Membership/MembershipPlansScreen';

export function UserMembershipScreen(): React.ReactElement {
  return (
    <MembershipPlansScreen
      config={{
        membershipApiType: 'users',
        headerTitle: 'Membership',
        pageTitle: 'Membership plans',
        pageSubtitle: 'Compare plans, inclusions, and pricing. All details are loaded from your account catalog.',
      }}
    />
  );
}
