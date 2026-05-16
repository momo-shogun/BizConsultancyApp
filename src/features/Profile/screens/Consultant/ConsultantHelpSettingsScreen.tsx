import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { AccountStackParamList } from '@/navigation/types';

import { useAuth } from '@/app/providers/AuthProvider';
import { SafeAreaWrapper, ScreenHeader } from '@/shared/components';

import { styles } from './ConsultantHelpSettingsScreen.styles';
// ── Types ─────────────────────────────────────────────────────────────────────
type RowType = 'navigate' | 'expand';

interface SettingsRow {
  id: string;
  icon: string;
  iconBgColor: string;
  title: string;
  subtitle: string;
  type: RowType;
}

export interface ConsultantHelpSettingsScreenProps {
  appVersion?: string;
  onRowPress?: (id: string) => void;
  onLogout?: () => void;
  onPrivacyPolicy?: () => void;
  onSubscriberAgreement?: () => void;
}

// ── Config ────────────────────────────────────────────────────────────────────
const SETTINGS_ROWS: SettingsRow[] = [
  {
    id: 'membership',
    icon: '👑',
    iconBgColor: 'rgba(251,191,36,0.15)',
    title: 'My Membership',
    subtitle: 'Manage your subscription plans',
    type: 'navigate',
  },
  {
    id: 'diagnosticPack',
    icon: '🩺',
    iconBgColor: 'rgba(56,189,248,0.13)',
    title: 'My Diagnostic Pack',
    subtitle: 'View your diagnostic packages',
    type: 'navigate',
  },
  {
    id: 'bookings',
    icon: '📅',
    iconBgColor: 'rgba(167,139,250,0.13)',
    title: 'Bookings',
    subtitle: 'Track your upcoming bookings',
    type: 'navigate',
  },
  {
    id: 'slotTime',
    icon: '🕒',
    iconBgColor: 'rgba(34,197,94,0.13)',
    title: 'Slot Time',
    subtitle: 'Manage your available slots',
    type: 'navigate',
  },
  {
    id: 'profile',
    icon: '👤',
    iconBgColor: 'rgba(59,130,246,0.13)',
    title: 'My Profile',
    subtitle: 'Update your personal details',
    type: 'navigate',
  },
  {
    id: 'services',
    icon: '🛍',
    iconBgColor: 'rgba(14,165,233,0.13)',
    title: 'My Services',
    subtitle: 'Check your active services',
    type: 'navigate',
  },
  {
    id: 'locker',
    icon: '🔐',
    iconBgColor: 'rgba(168,85,247,0.13)',
    title: 'My Lockers',
    subtitle: 'Securely manage your documents',
    type: 'navigate',
  },
  {
    id: 'expertise',
    icon: '🎓',
    iconBgColor: 'rgba(236,72,153,0.13)',
    title: 'Expertise',
    subtitle: 'Showcase your expertise details',
    type: 'navigate',
  },
  {
    id: 'expertVideo',
    icon: '🎥',
    iconBgColor: 'rgba(249,115,22,0.13)',
    title: 'Expert Video',
    subtitle: 'Manage your expert video sessions',
    type: 'navigate',
  },
  {
    id: 'review',
    icon: '💬',
    iconBgColor: 'rgba(59,130,246,0.13)',
    title: 'Review',
    subtitle: 'Read and manage your reviews',
    type: 'navigate',
  },
  {
    id: 'bankDetails',
    icon: '🏦',
    iconBgColor: 'rgba(99,102,241,0.13)',
    title: 'Bank Details',
    subtitle: 'Manage your bank information',
    type: 'navigate',
  },
  {
    id: 'withdrawals',
    icon: '💵',
    iconBgColor: 'rgba(16,185,129,0.13)',
    title: 'Withdrawals',
    subtitle: 'Track your withdrawal requests',
    type: 'navigate',
  },
  {
    id: 'wallet',
    icon: '💳',
    iconBgColor: 'rgba(16,185,129,0.13)',
    title: 'My Wallet',
    subtitle: 'Check wallet balance & history',
    type: 'navigate',
  },
  {
    id: 'bizCredits',
    icon: '✨',
    iconBgColor: 'rgba(244,114,182,0.13)',
    title: 'Biz AI credits',
    subtitle: 'Monitor your AI credit usage',
    type: 'navigate',
  },
  {
    id: 'transactionHistory',
    icon: '📜',
    iconBgColor: 'rgba(156,163,175,0.13)',
    title: 'Transaction History',
    subtitle: 'View all your transactions',
    type: 'navigate',
  },
];


// ── Sub-components ────────────────────────────────────────────────────────────
const SettingsRowItem: React.FC<{
  row: SettingsRow;
  isLast: boolean;
  onPress?: () => void;
}> = ({ row, isLast, onPress }) => (
  <TouchableOpacity
    style={isLast ? styles.menuCardItemLast : styles.menuCardItem}
    onPress={onPress}
    activeOpacity={0.75}
  >
    <View style={styles.menuIconContainer}>
      <View style={[styles.menuIconInner, { backgroundColor: row.iconBgColor }]}>
        <Text style={styles.menuIcon}>{row.icon}</Text>
      </View>
    </View>

    <View style={styles.menuTextGroup}>
      <Text style={styles.menuTitle}>{row.title}</Text>
      <Text style={styles.menuSubtitle}>{row.subtitle}</Text>
    </View>

    <Text style={row.type === 'navigate' ? styles.menuChevron : styles.menuChevronDown}>
      {row.type === 'navigate' ? '›' : '⌄'}
    </Text>
  </TouchableOpacity>
);

// ── Main Export ───────────────────────────────────────────────────────────────
export function ConsultantHelpSettingsScreen(props: ConsultantHelpSettingsScreenProps): React.ReactElement {
  const navigation = useNavigation<NavigationProp<AccountStackParamList>>();
  const { logout } = useAuth();
  const appVersion = props.appVersion ?? '1.0.0';

  const handleRowPress = (rowId: string): void => {
    props.onRowPress?.(rowId);
    if (rowId === 'membership') {
      return;
    }
  };

  return (
    <SafeAreaWrapper edges={['top', 'bottom']} bgColor="white">
      <ScreenHeader
        title="Help & Settings"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.menuCard}>
          <View style={styles.menuCardShimmer} />
          {SETTINGS_ROWS.map((row, index) => (
            <SettingsRowItem
              key={row.id}
              row={row}
              isLast={index === SETTINGS_ROWS.length - 1}
              onPress={() => handleRowPress(row.id)}
            />
          ))}
        </View>

        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutBtn} onPress={props.onLogout ?? logout}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerLinks}>
            <TouchableOpacity onPress={props.onPrivacyPolicy}>
              <Text style={styles.footerLink}>Privacy Policy</Text>
            </TouchableOpacity>
            <Text style={styles.footerDot}>•</Text>
            <TouchableOpacity onPress={props.onSubscriberAgreement}>
              <Text style={styles.footerLink}>Subscriber Agreement</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.footerVersion}>App Version {appVersion}</Text>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}
