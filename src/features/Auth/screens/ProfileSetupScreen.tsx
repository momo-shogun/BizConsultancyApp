import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuth } from '@/app/providers/AuthProvider';
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

type Nav = NativeStackNavigationProp<AuthStackParamList, typeof ROUTES.Auth.ProfileSetup>;

export function ProfileSetupScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const { completeOnboarding } = useAuth();

  const [fullName, setFullName] = useState<string>('');
  const [company, setCompany] = useState<string>('');

  const canFinish = fullName.trim().length > 0;

  return (
    <SafeAreaWrapper edges={['top', 'bottom']}>
      <ScreenHeader title="Profile setup" onBackPress={() => navigation.goBack()} />
      <KeyboardWrapper>
        <ScreenWrapper>
          <ScrollWrapper contentContainerStyle={styles.content}>
            <Text style={styles.help}>Tell us a bit about you.</Text>

            <Input
              label="Full name"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Your name"
              textContentType="name"
              autoCapitalize="words"
              accessibilityLabel="Full name input"
            />
            <Input
              label="Company (optional)"
              value={company}
              onChangeText={setCompany}
              placeholder="Company"
              autoCapitalize="words"
              accessibilityLabel="Company input"
            />

            <View style={styles.spacer} />

            <Button
              label="Finish"
              accessibilityLabel="Finish profile setup"
              disabled={!canFinish}
              onPress={completeOnboarding}
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

