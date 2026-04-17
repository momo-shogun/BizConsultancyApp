import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { THEME } from '@/constants/theme';
import {
  Button,
  Card,
  CardContent,
  Input,
  KeyboardWrapper,
  SafeAreaWrapper,
  ScreenHeader,
  ScrollWrapper,
} from '@/shared/components';

const { width } = Dimensions.get('window');

export interface LoginScreenContentProps {
  roleLabel: string;
  onContinue: (contact: string) => void;
  onBackPress?: () => void;
}

export function LoginScreenContent(props: LoginScreenContentProps): React.ReactElement {
  const [contact, setContact] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const canContinue = contact.trim().length > 0 && password.trim().length > 0;

  return (
    <SafeAreaWrapper edges={['top', 'bottom']}>
      <LinearGradient
        colors={[THEME.colors.chooseAccountBg1, THEME.colors.chooseAccountBg2, THEME.colors.chooseAccountBg3]}
        style={styles.container}
      >
        <View style={styles.topGlow} />
        <View style={styles.bottomGlow} />

        <ScreenHeader title="Log in" onBackPress={props.onBackPress} />

        <KeyboardWrapper>
          <ScrollWrapper contentContainerStyle={styles.content}>
            <View style={styles.header}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Secure login</Text>
              </View>

              <Text style={styles.title}>Welcome back</Text>

              <Text style={styles.subtitle}>
                Sign in with your email or phone to continue as <Text style={styles.subtitleStrong}>{props.roleLabel}</Text>.
              </Text>
            </View>

            <Card style={styles.card}>
              <CardContent style={styles.cardContent}>
                <Input
                  label="Email or phone"
                  value={contact}
                  onChangeText={setContact}
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  accessibilityLabel="Email or phone input"
                />
                <Input
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  secureTextEntry
                  textContentType="password"
                  accessibilityLabel="Password input"
                />

                <View style={styles.actions}>
                  <Button
                    label="Continue"
                    accessibilityLabel="Continue"
                    disabled={!canContinue}
                    onPress={() => props.onContinue(contact.trim())}
                  />
                </View>
              </CardContent>
            </Card>

            <Text style={styles.footerHint}>
              Tip: Use a strong password and never share your OTP.
            </Text>
          </ScrollWrapper>
        </KeyboardWrapper>
      </LinearGradient>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: THEME.spacing[24],
    paddingTop: THEME.spacing[16],
    paddingBottom: THEME.spacing[24],
    gap: THEME.spacing[16],
  },
  topGlow: {
    position: 'absolute',
    top: -90,
    right: -50,
    width: 240,
    height: 240,
    borderRadius: 240,
    backgroundColor: THEME.colors.chooseAccountGlowUser,
  },
  bottomGlow: {
    position: 'absolute',
    bottom: -120,
    left: -80,
    width: 280,
    height: 280,
    borderRadius: 280,
    backgroundColor: THEME.colors.chooseAccountGlowConsultant,
  },
  header: {
    paddingTop: THEME.spacing[8],
    marginBottom: THEME.spacing[8],
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: THEME.colors.chooseAccountBadgeBg,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.chooseAccountBadgeText,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: THEME.colors.chooseAccountTitle,
    letterSpacing: -1,
  },
  subtitle: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 24,
    color: THEME.colors.chooseAccountSubtitle,
    maxWidth: width * 0.86,
  },
  subtitleStrong: {
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  card: {
    backgroundColor: THEME.colors.chooseAccountCardBg,
    borderColor: THEME.colors.chooseAccountCardBorder,
    borderRadius: THEME.radius[16],
  },
  cardContent: {
    gap: THEME.spacing[16],
  },
  actions: {
    paddingTop: THEME.spacing[8],
  },
  footerHint: {
    marginTop: THEME.spacing[4],
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
    textAlign: 'center',
  },
});

