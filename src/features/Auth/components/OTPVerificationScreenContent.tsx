import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { THEME } from '@/constants/theme';
import { Button, KeyboardWrapper, OTPInput, ScrollWrapper, SafeAreaWrapper, ScreenHeader, ScreenWrapper } from '@/shared/components';

export interface OTPVerificationScreenContentProps {
  roleLabel: string;
  contact: string;
  onVerified: () => void;
  onBackPress?: () => void;
}

export function OTPVerificationScreenContent(
  props: OTPVerificationScreenContentProps,
): React.ReactElement {
  const { contact } = props;

  const [otp, setOtp] = useState<string>('');

  const masked = useMemo((): string => {
    const c = contact.trim();
    if (c.includes('@')) return c.replace(/(^.).*(@.*$)/, '$1***$2');
    if (c.length >= 4) return `${c.slice(0, 2)}***${c.slice(-2)}`;
    return c;
  }, [contact]);

  const canVerify = otp.length === 6;

  return (
    <SafeAreaWrapper edges={['top', 'bottom']}>
      <ScreenHeader title="Verify OTP" onBackPress={props.onBackPress} />
      <KeyboardWrapper>
        <ScreenWrapper>
          <ScrollWrapper contentContainerStyle={styles.content}>
            <Text style={styles.help}>
              Enter the 6-digit code sent to {masked}. (Account: {props.roleLabel})
            </Text>

            <OTPInput value={otp} onChange={setOtp} accessibilityLabel="OTP input" />

            <TextInput
              accessibilityLabel="Hidden OTP input"
              value={otp}
              onChangeText={(t) => setOtp(t.replace(/\D/g, '').slice(0, 6))}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              style={styles.hiddenInput}
              autoFocus
            />

            <View style={styles.spacer} />

            <Button
              label="Verify"
              accessibilityLabel="Verify OTP"
              disabled={!canVerify}
              onPress={props.onVerified}
            />
          </ScrollWrapper>
        </ScreenWrapper>
      </KeyboardWrapper>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: THEME.spacing[16],
    gap: THEME.spacing[16],
  },
  help: {
    fontSize: THEME.typography.size[14],
    color: THEME.colors.textSecondary,
  },
  spacer: {
    height: THEME.spacing[8],
  },
  hiddenInput: {
    height: 0,
    width: 0,
    opacity: 0,
  },
});

