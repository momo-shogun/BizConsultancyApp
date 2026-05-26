import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ConsultantHelpSettingsScreen } from '@/features/Profile/screens/Consultant/ConsultantHelpSettingsScreen';
import { ConsultantMembershipScreen } from '@/features/Profile/screens/Consultant/ConsultantMembershipScreen';
import { ConsultantProfileScreen } from '@/features/Profile/screens/Consultant/ConsultantProfileScreen';


import { ROUTES } from '../routeNames';
import type { AccountStackParamList } from '../types';
import { accountStackScreenOptions } from './accountStackScreenOptions';
import { ConsultantBankDetailsScreen } from '@/features/Profile/screens/Consultant/Consultantbankdetailsscreen ';
import { ExpertVideosScreen } from '@/features/Profile/screens/Consultant/Expertvideosscreen';
import { ConsultantEditProfileScreen } from '@/features/Profile/screens/Consultant/ConsultantEditProfileScreen';
import CreditsScreen from '@/features/Profile/screens/Consultant/CreditsScreen';
import { ConsultantWalletScreen } from '@/features/Wallet/screens/ConsultantWalletScreen';
import { ConsultantWithdrawalsScreen } from '@/features/Wallet/screens/ConsultantWithdrawalsScreen';
import { ConsultantWalletTransactionsScreen } from '@/features/Wallet/screens/ConsultantWalletTransactionsScreen';
import { MyDiagnosticPackScreen } from '@/features/Diagnostics/screens/MyDiagnosticPackScreen';
import { ConsultantBookingsScreen } from '@/features/Profile/screens/Consultant/ConsultantBookingsScreen';
import { ConsultantSlotTimeScreen } from '@/features/Profile/screens/Consultant/ConsultantSlotTimeScreen';
import { ConsultantMyServicesScreen } from '@/features/Profile/screens/Consultant/ConsultantMyServicesScreen';
import { ConsultantLockersScreen } from '@/features/Profile/screens/Consultant/ConsultantLockersScreen';
import { ConsultantExpertiseScreen } from '@/features/Profile/screens/Consultant/ConsultantExpertiseScreen';
import { ConsultantReviewsScreen } from '@/features/Profile/screens/Consultant/ConsultantReviewsScreen';

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
      <Stack.Screen
        name={ROUTES.Account.Membership}
        component={ConsultantMembershipScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.Account.ConsultantBankDetailsScreen}
        component={ConsultantBankDetailsScreen}
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name={ROUTES.Account.ExpertVideosScreen}
        component={ExpertVideosScreen}
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name={ROUTES.Account.EditProfile}
        component={ConsultantEditProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.Account.ConsultantWallet}
        component={ConsultantWalletScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.Account.ConsultantWithdrawals}
        component={ConsultantWithdrawalsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.Account.TransactionHis}
        component={ConsultantWalletTransactionsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.Account.CreditsScreen}
        component={CreditsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.Account.MyDiagnosticPack}
        component={MyDiagnosticPackScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.Account.ConsultantBookings}
        component={ConsultantBookingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.Account.ConsultantSlotTime}
        component={ConsultantSlotTimeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.Account.ConsultantMyServices}
        component={ConsultantMyServicesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.Account.ConsultantLockers}
        component={ConsultantLockersScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.Account.ConsultantExpertise}
        component={ConsultantExpertiseScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.Account.ConsultantReviews}
        component={ConsultantReviewsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
