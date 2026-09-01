import React, { useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';

import { useAuth } from '@/app/providers/AuthProvider';
import { useRazorpayAvailability } from '@/features/AppSettings/hooks/useRazorpayAvailability';
import { CONSULTANT_HELP_SETTINGS_SECTIONS } from '@/features/Profile/components/helpSettings/consultantHelpSettingsConfig';
import { filterHelpSettingsSections } from '@/features/Profile/components/helpSettings/filterHelpSettingsSections';
import { HelpSettingsScreenLayout } from '@/features/Profile/components/helpSettings/HelpSettingsScreenLayout';
import type { SettingsSectionConfig } from '@/features/Profile/components/helpSettings/helpSettings.types';
import { ROUTES } from '@/navigation/routeNames';
import type { AccountStackParamList } from '@/navigation/types';

export interface ConsultantHelpSettingsScreenProps {
  appVersion?: string;
  onRowPress?: (id: string) => void;
  onLogout?: () => void;
  onPrivacyPolicy?: () => void;
  onSubscriberAgreement?: () => void;
}

export function ConsultantHelpSettingsScreen(
  props: ConsultantHelpSettingsScreenProps,
): React.ReactElement {
  const navigation = useNavigation<NavigationProp<AccountStackParamList>>();
  const { logout } = useAuth();
  const appVersion = props.appVersion ?? '1.0.0';
  const { canShowPaidPurchaseCtas } = useRazorpayAvailability();

  const sections = useMemo((): SettingsSectionConfig[] => {
    if (canShowPaidPurchaseCtas) {
      return CONSULTANT_HELP_SETTINGS_SECTIONS;
    }
    return filterHelpSettingsSections(
      CONSULTANT_HELP_SETTINGS_SECTIONS,
      new Set(['membership']),
    );
  }, [canShowPaidPurchaseCtas]);

  const handleRowPress = (rowId: string): void => {
    props.onRowPress?.(rowId);

    if (rowId === 'membership') {
      navigation.navigate(ROUTES.Account.Membership);
      return;
    }
    if (rowId === 'myMembership') {
      navigation.navigate(ROUTES.Account.ConsultantMyMembership);
      return;
    }
    if (rowId === 'profile') {
      navigation.navigate(ROUTES.Account.EditProfile);
      return;
    }
    if (rowId === 'notifications') {
      navigation.navigate(ROUTES.Account.ConsultantNotifications);
      return;
    }
    if (rowId === 'wallet') {
      navigation.navigate(ROUTES.Account.ConsultantWallet);
      return;
    }
    if (rowId === 'withdrawals') {
      navigation.navigate(ROUTES.Account.ConsultantWithdrawals);
      return;
    }
    if (rowId === 'transactionHistory') {
      navigation.navigate(ROUTES.Account.TransactionHis);
      return;
    }
    if (rowId === 'bankDetails') {
      navigation.navigate(ROUTES.Account.ConsultantBankDetailsScreen);
      return;
    }
    if (rowId === 'expertVideo') {
      navigation.navigate(ROUTES.Account.ExpertVideosScreen);
      return;
    }
    if (rowId === 'bizCredits') {
      navigation.navigate(ROUTES.Account.CreditsScreen);
      return;
    }
    if (rowId === 'diagnosticPack') {
      navigation.navigate(ROUTES.Account.MyDiagnosticPack);
      return;
    }
    if (rowId === 'bookings') {
      navigation.navigate(ROUTES.Account.ConsultantBookings);
      return;
    }
    if (rowId === 'slotTime') {
      navigation.navigate(ROUTES.Account.ConsultantSlotTime);
      return;
    }
    if (rowId === 'services') {
      navigation.navigate(ROUTES.Account.ConsultantMyServices);
      return;
    }
    if (rowId === 'locker') {
      navigation.navigate(ROUTES.Account.ConsultantLockers);
      return;
    }
    if (rowId === 'expertise') {
      navigation.navigate(ROUTES.Account.ConsultantExpertise);
      return;
    }
    if (rowId === 'review') {
      navigation.navigate(ROUTES.Account.ConsultantReviews);
      return;
    }
  };

  return (
    <HelpSettingsScreenLayout
      sections={sections}
      appVersion={appVersion}
      onBackPress={() => navigation.goBack()}
      onRowPress={handleRowPress}
      onLogout={props.onLogout ?? logout}
      onPrivacyPolicy={props.onPrivacyPolicy}
      onSubscriberAgreement={props.onSubscriberAgreement}
    />
  );
}
