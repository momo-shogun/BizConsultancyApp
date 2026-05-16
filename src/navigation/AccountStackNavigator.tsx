import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '@/app/providers/AuthProvider';
import HelpSettingsScreen from '@/features/Profile/screens/User/SettingScreen';
import { ProfileScreen as ConsultantProfileScreen } from '@/features/Profile/screens/consultant/ProfileScreen';
import { ProfileScreen as UserProfileScreen } from '@/features/Profile/screens/User/ProfileScreen';

import { ROUTES } from './routeNames';
import type { AccountStackParamList } from './types';
import { MembershipScreen } from '@/features/Profile/screens/User/MemberShipScreen';

const Stack = createNativeStackNavigator<AccountStackParamList>();

function AccountHomeScreen(): React.ReactElement {
  const { state } = useAuth();

  if (state.userType === 'consultant') {
    return <ConsultantProfileScreen />;
  }

  return <UserProfileScreen />;
}

export function AccountStackNavigator(): React.ReactElement {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.Account.Home}
      screenOptions={{
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name={ROUTES.Account.Home}
        component={AccountHomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.Account.HelpSettings}
        component={HelpSettingsScreen}
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name={ROUTES.Account.Membership}
        component={MembershipScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
