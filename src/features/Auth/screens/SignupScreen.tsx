import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { THEME } from '@/constants/theme';
import { ROUTES } from '@/navigation/routeNames';
import type { AuthStackParamList } from '@/navigation/types';
import {
  Button,
  Input,
  KeyboardWrapper,
  SafeAreaWrapper,
  ScreenHeader,
  ScreenWrapper,
  ScrollWrapper,
} from '@/shared/components';

type Nav = NativeStackNavigationProp<AuthStackParamList, typeof ROUTES.Auth.Signup>;

export function SignupScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const [name, setName] = useState<string>('');
  const [contact, setContact] = useState<string>('');

  const canContinue = name.trim().length > 0 && contact.trim().length > 0;

  return (
    <SafeAreaWrapper edges={['top', 'bottom']}>
      <ScreenHeader title="Create account" onBackPress={() => navigation.goBack()} />
      <KeyboardWrapper>
        <ScreenWrapper>
          <ScrollWrapper contentContainerStyle={styles.content}>
            <Text style={styles.help}>Create your account in a few steps.</Text>

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

