import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { UserHelpSettingsScreen } from '@/features/Profile/screens/User/UserHelpSettingsScreen';
import { UserMembershipScreen } from '@/features/Profile/screens/User/UserMembershipScreen';
import { UserEditProfileScreen } from '@/features/Profile/screens/User/UserEditProfileScreen';
import { UserProfileScreen } from '@/features/Profile/screens/User/UserProfileScreen';

import { ROUTES } from '../routeNames';
import type { AccountStackParamList } from '../types';
import { accountStackScreenOptions } from './accountStackScreenOptions';
import UserFeedbackScreen from '@/features/Profile/screens/User/UserFeedbackScreen';
import UserGuideScreen from '@/features/Profile/screens/User/UserGuideScreen';
import CallHistoryScreen from '@/features/Profile/screens/User/CallHistoryScreen';
import { ApplyServiceScreen } from '@/features/MyServices/screens/ApplyServiceScreen';
import { MyBookingsScreen } from '@/features/Bookings/screens/MyBookingsScreen';
import { MyDiagnosticPackScreen } from '@/features/Diagnostics/screens/MyDiagnosticPackScreen';
import { MyEdpScreen } from '@/features/Edp/screens/MyEdpScreen';
import { WorkshopBookingsScreen } from '@/features/WorkshopBookings/screens/WorkshopBookingsScreen';
import { MyServicesScreen } from '@/features/MyServices/screens/MyServicesScreen';
import { UserAiCreditsScreen } from '@/features/Profile/screens/User/UserAiCreditsScreen';
import { UserDocumentVaultScreen } from '@/features/DocumentVault/screens/UserDocumentVaultScreen';
import { UserNotificationsScreen } from '@/features/Profile/screens/User/UserNotificationsScreen';

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
        name={ROUTES.Account.EditProfile}
        component={UserEditProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.Account.Membership}
        component={UserMembershipScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.Account.CreditsScreen}
        component={UserAiCreditsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.Account.addReview}
        component={UserFeedbackScreen}
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
      <Stack.Screen
        name={ROUTES.Account.MyDiagnosticPack}
        component={MyDiagnosticPackScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.Account.MyBookings}
        component={MyBookingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.Account.WorkshopBookings}
        component={WorkshopBookingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.Account.MyEdp}
        component={MyEdpScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.Account.UserLockers}
        component={UserDocumentVaultScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.Account.UserNotifications}
        component={UserNotificationsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
