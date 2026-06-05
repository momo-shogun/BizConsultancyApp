import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';

import { useAuth } from '@/app/providers/AuthProvider';
import { HelpSettingsScreenLayout } from '@/features/Profile/components/helpSettings/HelpSettingsScreenLayout';
import { USER_HELP_SETTINGS_SECTIONS } from '@/features/Profile/components/helpSettings/userHelpSettingsConfig';
import { navigationRef } from '@/navigation/navigationContainerRef';
import { ROUTES } from '@/navigation/routeNames';
import type { AccountStackParamList } from '@/navigation/types';

export interface UserHelpSettingsScreenProps {
  appVersion?: string;
  onRowPress?: (id: string) => void;
  onLogout?: () => void;
  onPrivacyPolicy?: () => void;
  onSubscriberAgreement?: () => void;
}

export function UserHelpSettingsScreen(props: UserHelpSettingsScreenProps): React.ReactElement {
  const navigation = useNavigation<NavigationProp<AccountStackParamList>>();
  const { logout } = useAuth();
  const appVersion = props.appVersion ?? '1.0.0';

  const handleRowPress = (rowId: string): void => {
    props.onRowPress?.(rowId);

    if (rowId === 'profile') {
      navigation.navigate(ROUTES.Account.EditProfile);
    }
    if (rowId === 'notifications') {
      navigation.navigate(ROUTES.Account.UserNotifications);
    }
    if (rowId === 'membership') {
      navigation.navigate(ROUTES.Account.Membership);
    }
    if (rowId === 'feedback') {
      navigation.navigate(ROUTES.Account.addReview);
    }
    if (rowId === 'guide') {
      navigation.navigate(ROUTES.Account.userGuide);
    }
    if (rowId === 'callHistory') {
      navigation.navigate(ROUTES.Account.userCallHis);
    }
    if (rowId === 'services') {
      navigation.navigate(ROUTES.Account.MyServices);
    }
    if (rowId === 'wallet') {
      navigationRef.navigate(ROUTES.Root.Wallet);
    }
    if (rowId === 'bizCredits') {
      navigation.navigate(ROUTES.Account.CreditsScreen);
    }
    if (rowId === 'diagnosticPack') {
      navigation.navigate(ROUTES.Account.MyDiagnosticPack);
    }
    if (rowId === 'bookings') {
      navigation.navigate(ROUTES.Account.MyBookings);
    }
    if (rowId === 'workshop') {
      navigation.navigate(ROUTES.Account.WorkshopBookings);
    }
    if (rowId === 'edp') {
      navigation.navigate(ROUTES.Account.MyEdp);
    }
    if (rowId === 'locker') {
      navigation.navigate(ROUTES.Account.UserLockers);
    }
  };

  return (
    <HelpSettingsScreenLayout
      sections={USER_HELP_SETTINGS_SECTIONS}
      appVersion={appVersion}
      onBackPress={() => navigation.goBack()}
      onRowPress={handleRowPress}
      onLogout={props.onLogout ?? logout}
      onPrivacyPolicy={props.onPrivacyPolicy}
      onSubscriberAgreement={props.onSubscriberAgreement}
    />
  );
}
