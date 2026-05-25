import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { UserHelpSettingsScreen } from '@/features/Profile/screens/User/UserHelpSettingsScreen';
import { UserMembershipScreen } from '@/features/Profile/screens/User/UserMembershipScreen';
import { UserProfileScreen } from '@/features/Profile/screens/User/UserProfileScreen';

import { ROUTES } from '../routeNames';
import type { AccountStackParamList } from '../types';
import { accountStackScreenOptions } from './accountStackScreenOptions';
import AddReviewScreen from '@/features/Profile/screens/User/AddReviewScreen';
import UserGuideScreen from '@/features/Profile/screens/User/UserGuideScreen';
import CallHistoryScreen from '@/features/Profile/screens/User/CallHistoryScreen';
import { ApplyServiceScreen } from '@/features/MyServices/screens/ApplyServiceScreen';
import { MyServicesScreen } from '@/features/MyServices/screens/MyServicesScreen';

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
      <Stack.Screen
        name={ROUTES.Account.addReview}
        component={AddReviewScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.Account.userGuide}
        component={UserGuideScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.Account.userCallHis}
        component={CallHistoryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.Account.MyServices}
        component={MyServicesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.Account.ApplyService}
        component={ApplyServiceScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
