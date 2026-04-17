import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { THEME } from '@/constants/theme';
import { Button, Input, KeyboardWrapper, ScrollWrapper, ScreenWrapper, SafeAreaWrapper, ScreenHeader } from '@/shared/components';

export interface SignupScreenContentProps {
  roleLabel: string;
  onSendOtp: (contact: string) => void;
  onBackPress?: () => void;
}

export function SignupScreenContent(props: SignupScreenContentProps): React.ReactElement {
  const [name, setName] = useState<string>('');
  const [contact, setContact] = useState<string>('');

  const canContinue = name.trim().length > 0 && contact.trim().length > 0;

  return (
    <SafeAreaWrapper edges={['top', 'bottom']}>
      <ScreenHeader title="Create account" onBackPress={props.onBackPress} />
      <KeyboardWrapper>
        <ScreenWrapper>
          <ScrollWrapper contentContainerStyle={styles.content}>
            <Text style={styles.help}>Create your account as {props.roleLabel} in a few steps.</Text>

            <Input
              label="Full name"
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              textContentType="name"
              autoCapitalize="words"
              accessibilityLabel="Full name input"
            />
            <Input
              label="Email or phone"
              value={contact}
              onChangeText={setContact}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              accessibilityLabel="Email or phone input"
            />

            <View style={styles.spacer} />

            <Button
              label="Send OTP"
              accessibilityLabel="Send OTP"
              disabled={!canContinue}
              onPress={() => props.onSendOtp(contact.trim())}
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
});

