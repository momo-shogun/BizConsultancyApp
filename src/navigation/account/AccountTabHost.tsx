import React from 'react';

import { useAuth } from '@/app/providers/AuthProvider';

import { ConsultantAccountStackNavigator } from './ConsultantAccountStackNavigator';
import { UserAccountStackNavigator } from './UserAccountStackNavigator';

export function AccountTabHost(): React.ReactElement {
  const { state } = useAuth();

  if (state.userType === 'consultant') {
    return <ConsultantAccountStackNavigator />;
  }

  return <UserAccountStackNavigator />;
}
