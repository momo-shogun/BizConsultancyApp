import React from 'react';

import { MembershipPlansScreen } from '../Membership/MembershipPlansScreen';

export function UserMembershipScreen(): React.ReactElement {
  return (
    <MembershipPlansScreen
      config={{
        membershipApiType: 'users',
        headerTitle: 'Membership',
        pageTitle: 'Built for',
        pageTitleAccent: 'growing businesses',
        pageSubtitle:
          'Choose a plan with verified consultants, document locker, webinars, and business support tailored for users.',
      }}
    />
  );
}
