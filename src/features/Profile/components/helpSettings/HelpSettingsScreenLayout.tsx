import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { AccountHubScreenShell } from '@/shared/components';

import { HelpSettingsSection } from './HelpSettingsSection';
import { HELP_SETTINGS_CANVAS, helpSettingsStyles } from './helpSettings.styles';
import type { SettingsSectionConfig } from './helpSettings.types';

export interface HelpSettingsScreenLayoutProps {
  sections: SettingsSectionConfig[];
  appVersion: string;
  onBackPress: () => void;
  onRowPress: (rowId: string) => void;
  onLogout: () => void;
  onPrivacyPolicy?: () => void;
  onSubscriberAgreement?: () => void;
}

export function HelpSettingsScreenLayout(
  props: HelpSettingsScreenLayoutProps,
): React.ReactElement {
  const {
    sections,
    appVersion,
    onBackPress,
    onRowPress,
    onLogout,
    onPrivacyPolicy,
    onSubscriberAgreement,
  } = props;

  return (
    <AccountHubScreenShell
      title="Help & Settings"
      onBackPress={onBackPress}
      canvasColor={HELP_SETTINGS_CANVAS}
    >
      <ScrollView
        style={helpSettingsStyles.screen}
        contentContainerStyle={helpSettingsStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {sections.map((section, index) => (
          <HelpSettingsSection
            key={section.id}
            section={section}
            isFirst={index === 0}
            onRowPress={onRowPress}
          />
        ))}

        <View style={helpSettingsStyles.logoutContainer}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Log out"
            onPress={onLogout}
            style={({ pressed }) => [
              helpSettingsStyles.logoutBtn,
              pressed ? helpSettingsStyles.logoutBtnPressed : null,
            ]}
          >
            <Ionicons name="log-out-outline" size={20} color="#DC2626" />
            <Text style={helpSettingsStyles.logoutText}>Log out</Text>
          </Pressable>
        </View>

        <View style={helpSettingsStyles.footerCard}>
          <View style={helpSettingsStyles.footerLinks}>
            {onPrivacyPolicy != null ? (
              <Pressable accessibilityRole="button" onPress={onPrivacyPolicy}>
                <Text style={helpSettingsStyles.footerLink}>Privacy Policy</Text>
              </Pressable>
            ) : null}
            {onPrivacyPolicy != null && onSubscriberAgreement != null ? (
              <Text style={helpSettingsStyles.footerDot}>•</Text>
            ) : null}
            {onSubscriberAgreement != null ? (
              <Pressable accessibilityRole="button" onPress={onSubscriberAgreement}>
                <Text style={helpSettingsStyles.footerLink}>Subscriber Agreement</Text>
              </Pressable>
            ) : null}
          </View>
          <Text style={helpSettingsStyles.footerVersion}>App version {appVersion}</Text>
        </View>
      </ScrollView>
    </AccountHubScreenShell>
  );
}
