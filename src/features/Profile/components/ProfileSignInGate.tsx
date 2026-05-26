import React, { type ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

import { THEME } from '@/constants/theme';

interface ProfileSignInGateProps {
  onSignIn: () => void;
}

const BENEFITS: Array<{ icon: IoniconName; text: string }> = [
  { icon: 'person-circle-outline', text: 'Save your profile and photo' },
  { icon: 'card-outline', text: 'Manage membership and bookings' },
  { icon: 'settings-outline', text: 'Access settings and preferences' },
];

export function ProfileSignInGate(props: ProfileSignInGateProps): React.ReactElement {
  const { onSignIn } = props;

  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Ionicons name="shield-checkmark-outline" size={32} color="#059669" />
      </View>

      <Text style={styles.title}>Sign in to your account</Text>
      <Text style={styles.subtitle}>
        You are browsing as a guest. Log in with your mobile number to unlock your profile and
        saved data.
      </Text>

      <View style={styles.benefits}>
        {BENEFITS.map((item) => (
          <View key={item.text} style={styles.benefitRow}>
            <Ionicons name={item.icon} size={18} color="#059669" />
            <Text style={styles.benefitText}>{item.text}</Text>
          </View>
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Log in"
        onPress={onSignIn}
        style={({ pressed }) => [styles.primaryBtn, pressed ? { opacity: 0.92 } : null]}
      >
        <Text style={styles.primaryBtnText}>Log in</Text>
        <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
      </Pressable>

      <Text style={styles.footerNote}>Quick OTP verification · No password needed</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: THEME.spacing[20],
    gap: THEME.spacing[14],
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(5,150,105,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: THEME.typography.size[18],
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: THEME.typography.size[14],
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 21,
  },
  benefits: {
    alignSelf: 'stretch',
    gap: THEME.spacing[10],
    paddingVertical: THEME.spacing[4],
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[10],
  },
  benefitText: {
    flex: 1,
    fontSize: THEME.typography.size[14],
    color: '#334155',
    lineHeight: 20,
    fontWeight: '500',
  },
  primaryBtn: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: THEME.spacing[14],
    borderRadius: 14,
    backgroundColor: '#059669',
  },
  primaryBtnText: {
    fontSize: THEME.typography.size[16],
    fontWeight: '700',
    color: '#FFFFFF',
  },
  footerNote: {
    fontSize: THEME.typography.size[12],
    color: '#94A3B8',
    textAlign: 'center',
  },
});
