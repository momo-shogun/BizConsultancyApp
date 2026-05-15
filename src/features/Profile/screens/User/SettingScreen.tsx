import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '@/app/providers/AuthProvider';
import { SafeAreaWrapper, ScreenHeader } from '@/shared/components';

import { styles } from './HelpSettingsScreen.styles';


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

export interface HelpSettingsScreenProps {
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
    subtitle: 'Manage your subscription',
    type: 'navigate',
  },
  {
    id: 'diagnosticPack',
    icon: '🩺',
    iconBgColor: 'rgba(56,189,248,0.13)',
    title: 'My Diagnostic Pack',
    subtitle: 'View your health packages',
    type: 'navigate',
  },
  {
    id: 'bookings',
    icon: '📅',
    iconBgColor: 'rgba(167,139,250,0.13)',
    title: 'My Bookings',
    subtitle: 'Upcoming & past bookings',
    type: 'navigate',
  },
  {
    id: 'callHistory',
    icon: '📞',
    iconBgColor: 'rgba(34,197,94,0.13)',
    title: 'Call History',
    subtitle: 'Recent consultation calls',
    type: 'navigate',
  },
  {
    id: 'profile',
    icon: '👤',
    iconBgColor: 'rgba(59,130,246,0.13)',
    title: 'My Profile',
    subtitle: 'Personal information',
    type: 'navigate',
  },
  {
    id: 'workshop',
    icon: '🎓',
    iconBgColor: 'rgba(236,72,153,0.13)',
    title: 'Workshop Bookings',
    subtitle: 'Manage workshop sessions',
    type: 'navigate',
  },
  {
    id: 'services',
    icon: '🛍',
    iconBgColor: 'rgba(14,165,233,0.13)',
    title: 'My Services',
    subtitle: 'Your active services',
    type: 'navigate',
  },
  {
    id: 'edp',
    icon: '💼',
    iconBgColor: 'rgba(249,115,22,0.13)',
    title: 'My EDP',
    subtitle: 'Entrepreneurship modules',
    type: 'navigate',
  },
  {
    id: 'locker',
    icon: '🔐',
    iconBgColor: 'rgba(168,85,247,0.13)',
    title: 'My Locker',
    subtitle: 'Secure document storage',
    type: 'navigate',
  },
  {
    id: 'wallet',
    icon: '💳',
    iconBgColor: 'rgba(16,185,129,0.13)',
    title: 'Wallet History',
    subtitle: 'Transactions & balance',
    type: 'navigate',
  },
  {
    id: 'bizCredits',
    icon: '✨',
    iconBgColor: 'rgba(244,114,182,0.13)',
    title: 'Biz AI credits',
    subtitle: 'Manage AI usage credits',
    type: 'navigate',
  },
  {
    id: 'feedback',
    icon: '💬',
    iconBgColor: 'rgba(59,130,246,0.13)',
    title: 'User Feedback',
    subtitle: 'Share your experience',
    type: 'navigate',
  },
  {
    id: 'guide',
    icon: '📖',
    iconBgColor: 'rgba(99,102,241,0.13)',
    title: 'User Guide',
    subtitle: 'Learn how to use the app',
    type: 'navigate',
  },
];


 const navigation = useNavigation();

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
function HelpSettingsScreen(props: HelpSettingsScreenProps): React.ReactElement {
  const navigation = useNavigation();
  const { logout } = useAuth();
  const appVersion = props.appVersion ?? '1.0.0';

  return (
    <SafeAreaWrapper edges={['top']} bgColor="white">
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
              onPress={() => props.onRowPress?.(row.id)}
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

export default HelpSettingsScreen;