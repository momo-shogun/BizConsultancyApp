import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { UserHelpSettingsScreen } from '@/features/Profile/screens/User/UserHelpSettingsScreen';
import { UserMembershipScreen } from '@/features/Profile/screens/User/UserMembershipScreen';
import { UserProfileScreen } from '@/features/Profile/screens/User/UserProfileScreen';

import { ROUTES } from '../routeNames';
import type { AccountStackParamList } from '../types';
import { accountStackScreenOptions } from './accountStackScreenOptions';

const Stack = createNativeStackNavigator<AccountStackParamList>();

export function UserAccountStackNavigator(): React.ReactElement {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.Account.Home}
      screenOptions={accountStackScreenOptions}
    >
      <Stack.Screen
        name={ROUTES.Account.Home}
        component={UserProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.Account.HelpSettings}
        component={UserHelpSettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.Account.Membership}
        component={UserMembershipScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
