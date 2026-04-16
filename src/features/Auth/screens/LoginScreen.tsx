import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { THEME } from '@/constants/theme';
import { ROUTES } from '@/navigation/routeNames';
import type { AuthStackParamList } from '@/navigation/types';
import { Button, Input, KeyboardWrapper, SafeAreaWrapper, ScreenHeader, ScrollWrapper, ScreenWrapper } from '@/shared/components';

type Nav = NativeStackNavigationProp<AuthStackParamList, typeof ROUTES.Auth.Login>;

export function LoginScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const [contact, setContact] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const canContinue = contact.trim().length > 0 && password.trim().length > 0;

  return (
    <SafeAreaWrapper edges={['top', 'bottom']}>
      <ScreenHeader title="Log in" onBackPress={() => navigation.goBack()} />
      <KeyboardWrapper>
        <ScreenWrapper>
          <ScrollWrapper contentContainerStyle={styles.content}>
            <Text style={styles.help}>Use your email or phone number to continue.</Text>

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
              onPress={() => navigation.navigate(ROUTES.Auth.OtpVerification, { contact: contact.trim() })}
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

