import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useAuth } from '@/app/providers/AuthProvider';
import { HelpSettingsSection } from '@/features/Profile/components/helpSettings/HelpSettingsSection';
import { USER_HELP_SETTINGS_SECTIONS } from '@/features/Profile/components/helpSettings/userHelpSettingsConfig';
import {
  HELP_SETTINGS_CANVAS,
  helpSettingsStyles,
} from '@/features/Profile/components/helpSettings/helpSettings.styles';
import { navigationRef } from '@/navigation/navigationContainerRef';
import { ROUTES } from '@/navigation/routeNames';
import type { AccountStackParamList } from '@/navigation/types';
import { SafeAreaWrapper, ScreenHeader } from '@/shared/components';

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
  };

  return (
    <SafeAreaWrapper edges={['top', 'bottom']} bgColor={HELP_SETTINGS_CANVAS}>
      <ScreenHeader title="Help & Settings" onBackPress={() => navigation.goBack()} />

      <ScrollView
        style={helpSettingsStyles.screen}
        contentContainerStyle={helpSettingsStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {USER_HELP_SETTINGS_SECTIONS.map((section, index) => (
          <HelpSettingsSection
            key={section.id}
            section={section}
            isFirst={index === 0}
            onRowPress={handleRowPress}
          />
        ))}

        <View style={helpSettingsStyles.logoutContainer}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Log out"
            onPress={props.onLogout ?? logout}
            style={({ pressed }) => [
              helpSettingsStyles.logoutBtn,
              pressed ? { opacity: 0.9 } : null,
            ]}
          >
            <Ionicons name="log-out-outline" size={18} color="#E5484D" />
            <Text style={helpSettingsStyles.logoutText}>Log Out</Text>
          </Pressable>
        </View>

        <View style={helpSettingsStyles.footer}>
          <View style={helpSettingsStyles.footerLinks}>
            <Pressable accessibilityRole="button" onPress={props.onPrivacyPolicy}>
              <Text style={helpSettingsStyles.footerLink}>Privacy Policy</Text>
            </Pressable>
            <Text style={helpSettingsStyles.footerDot}>•</Text>
            <Pressable accessibilityRole="button" onPress={props.onSubscriberAgreement}>
              <Text style={helpSettingsStyles.footerLink}>Subscriber Agreement</Text>
            </Pressable>
          </View>
          <Text style={helpSettingsStyles.footerVersion}>App Version {appVersion}</Text>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}
