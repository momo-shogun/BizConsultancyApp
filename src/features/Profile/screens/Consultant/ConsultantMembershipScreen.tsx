import React from 'react';

import { MembershipPlansScreen } from '../Membership/MembershipPlansScreen';

export function ConsultantMembershipScreen(): React.ReactElement {
  return (
    <MembershipPlansScreen
      config={{
        membershipApiType: 'experts',
        headerTitle: 'Consultant membership',
        pageTitle: 'Consultant membership',
        pageSubtitle:
          'Plans, pricing, and inclusions for consultants. Details reflect the live membership catalog.',
      }}
    />
  );
}
