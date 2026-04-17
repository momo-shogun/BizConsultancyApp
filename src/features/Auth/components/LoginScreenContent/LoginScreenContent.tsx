import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { THEME } from '@/constants/theme';
import { Button, Input, KeyboardWrapper, ScrollWrapper, ScreenWrapper, SafeAreaWrapper, ScreenHeader } from '@/shared/components';

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
      <ScreenHeader title="Log in" onBackPress={props.onBackPress} />
      <KeyboardWrapper>
        <ScreenWrapper>
          <ScrollWrapper contentContainerStyle={styles.content}>
            <Text style={styles.help}>
              Use your email or phone number to continue as {props.roleLabel}.
            </Text>

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

            <View style={styles.spacer} />

            <Button
              label="Continue"
              accessibilityLabel="Continue to OTP verification"
              disabled={!canContinue}
              onPress={() => props.onContinue(contact.trim())}
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

