import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ConsultantHelpSettingsScreen } from '@/features/Profile/screens/Consultant/ConsultantHelpSettingsScreen';
import { ConsultantProfileScreen } from '@/features/Profile/screens/Consultant/ConsultantProfileScreen';

import { ROUTES } from '../routeNames';
import type { AccountStackParamList } from '../types';
import { accountStackScreenOptions } from './accountStackScreenOptions';

const Stack = createNativeStackNavigator<AccountStackParamList>();

export function ConsultantAccountStackNavigator(): React.ReactElement {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.Account.Home}
      screenOptions={accountStackScreenOptions}
    >
      <Stack.Screen
        name={ROUTES.Account.Home}
        component={ConsultantProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.Account.HelpSettings}
        component={ConsultantHelpSettingsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
