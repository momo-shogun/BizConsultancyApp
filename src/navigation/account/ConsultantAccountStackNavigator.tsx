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
import UserGuideScreen from '@/features/Profile/screens/User/UserGuideScreen';

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
    </Stack.Navigator>
  );
}
