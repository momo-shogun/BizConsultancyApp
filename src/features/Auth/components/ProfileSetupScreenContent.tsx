import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { THEME } from '@/constants/theme';
import { Button, Input, KeyboardWrapper, ScrollWrapper, SafeAreaWrapper, ScreenHeader, ScreenWrapper } from '@/shared/components';

export interface ProfileSetupScreenContentProps {
  roleLabel: string;
  companyLabel: string;
  companyPlaceholder: string;
  onFinish: () => void;
  onBackPress?: () => void;
}

export function ProfileSetupScreenContent(props: ProfileSetupScreenContentProps): React.ReactElement {
  const [fullName, setFullName] = useState<string>('');
  const [company, setCompany] = useState<string>('');

  const canFinish = fullName.trim().length > 0;

  return (
    <SafeAreaWrapper edges={['top', 'bottom']}>
      <ScreenHeader title="Profile setup" onBackPress={props.onBackPress} />
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
              label={props.companyLabel}
              value={company}
              onChangeText={setCompany}
              placeholder={props.companyPlaceholder}
              autoCapitalize="words"
              accessibilityLabel="Company input"
            />

            <View style={styles.spacer} />

            <Button
              label="Finish"
              accessibilityLabel="Finish profile setup"
              disabled={!canFinish}
              onPress={props.onFinish}
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

