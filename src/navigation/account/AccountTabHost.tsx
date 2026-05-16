import React from 'react';

import { useAuth } from '@/app/providers/AuthProvider';
import { selectAccountRole } from '@/features/Auth/store/authSelectors';
import { useAppSelector } from '@/store/typedHooks';

import { ConsultantAccountStackNavigator } from './ConsultantAccountStackNavigator';
import { UserAccountStackNavigator } from './UserAccountStackNavigator';

export function AccountTabHost(): React.ReactElement {
  const { state } = useAuth();
  const persistedRole = useAppSelector(selectAccountRole);
  const role = persistedRole ?? state.userType;

  if (role === 'consultant') {
    return <ConsultantAccountStackNavigator />;
  }

  return <UserAccountStackNavigator />;
}
