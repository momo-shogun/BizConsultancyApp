import React, { useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';

import { useAuth } from '@/app/providers/AuthProvider';
import { useRazorpayAvailability } from '@/features/AppSettings/hooks/useRazorpayAvailability';
import { filterHelpSettingsSections } from '@/features/Profile/components/helpSettings/filterHelpSettingsSections';
import { HelpSettingsScreenLayout } from '@/features/Profile/components/helpSettings/HelpSettingsScreenLayout';
import type { SettingsSectionConfig } from '@/features/Profile/components/helpSettings/helpSettings.types';
import { USER_HELP_SETTINGS_SECTIONS } from '@/features/Profile/components/helpSettings/userHelpSettingsConfig';
import { navigationRef } from '@/navigation/navigationContainerRef';
import { ROUTES } from '@/navigation/routeNames';
import type { AccountStackParamList } from '@/navigation/types';

export interface UserHelpSettingsScreenProps {
  onRowPress?: (id: string) => void;
  onLogout?: () => void;
  onPrivacyPolicy?: () => void;
  onSubscriberAgreement?: () => void;
}

export function UserHelpSettingsScreen(props: UserHelpSettingsScreenProps): React.ReactElement {
  const navigation = useNavigation<NavigationProp<AccountStackParamList>>();
  const { logout } = useAuth();
  const { canShowPaidPurchaseCtas } = useRazorpayAvailability();

  const sections = useMemo((): SettingsSectionConfig[] => {
    if (canShowPaidPurchaseCtas) {
      return USER_HELP_SETTINGS_SECTIONS;
    }
    return filterHelpSettingsSections(
      USER_HELP_SETTINGS_SECTIONS,
      new Set(['membership', 'wallet', 'bizCredits']),
    );
  }, [canShowPaidPurchaseCtas]);

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
      return;
    }
    if (rowId === 'myMembership') {
      navigation.navigate(ROUTES.Account.UserMyMembership);
      return;
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
      sections={sections}
      onBackPress={() => navigation.goBack()}
      onRowPress={handleRowPress}
      onLogout={props.onLogout ?? logout}
      onPrivacyPolicy={props.onPrivacyPolicy}
      onSubscriberAgreement={props.onSubscriberAgreement}
    />
  );
}
