import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ROUTES } from '@/navigation/routeNames';
import type { AuthStackParamList } from '@/navigation/types';
import { useAuth } from '@/app/providers/AuthProvider';
import { navigationRef } from '@/navigation/RootNavigator';
import { Button, EmptyState, ScreenWrapper, SafeAreaWrapper } from '@/shared/components';
import { LoginScreenContent as UserLoginScreenContent } from '@/features/Auth/User/screens/LoginScreenContent';
import { LoginScreenContent as ConsultantLoginScreenContent } from '@/features/Auth/Consultant/screens/LoginScreenContent';

type Nav = NativeStackNavigationProp<AuthStackParamList, typeof ROUTES.Auth.Login>;

export function LoginScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const { state, completeOnboarding } = useAuth();

  const onSkip = (): void => {
    completeOnboarding();
    // Force landing on dashboard even if auth stack doesn't re-render immediately.
    if (navigationRef.isReady()) {
      navigationRef.resetRoot({
        index: 0,
        routes: [{ name: ROUTES.Root.App }],
      });
    }
  };

  const onContinue = (contact: string): void => {
    navigation.navigate(ROUTES.Auth.OtpVerification, { contact });
  };

  if (!state.userType) {
    return (
      <SafeAreaWrapper edges={['top', 'bottom']}>
        <ScreenWrapper style={styles.wrapper}>
          <EmptyState title="Choose account type" description="Please select User or Consultant to continue." />
          <View style={styles.actionRow}>
            <Button
              label="Choose account type"
              accessibilityLabel="Choose account type"
              onPress={() => navigation.navigate(ROUTES.Auth.ChooseAccountType, { next: 'login' })}
            />
          </View>
        </ScreenWrapper>
      </SafeAreaWrapper>
    );
  }

  return state.userType === 'user' ? (
    <UserLoginScreenContent
      onContinue={onContinue}
      onSkip={onSkip}
      onBackPress={() => navigation.goBack()}
    />
  ) : (
    <ConsultantLoginScreenContent onContinue={onContinue} onBackPress={() => navigation.goBack()} />
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 24,
  },
  actionRow: {
    marginTop: 16,
  },
});

