import React from 'react';

import { MyMembershipScreenView } from '@/features/Profile/screens/Membership/MyMembershipScreenView';

export function UserMyMembershipScreen(): React.ReactElement {
  return <MyMembershipScreenView membershipLine="users" />;
}

export default UserMyMembershipScreen;
