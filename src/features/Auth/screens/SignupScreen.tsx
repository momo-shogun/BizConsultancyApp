import React, { useCallback, useEffect } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuth } from '@/app/providers/AuthProvider';
import { ROUTES } from '@/navigation/routeNames';
import type { AuthStackParamList } from '@/navigation/types';
import { Button, EmptyState, SafeAreaWrapper, ScreenWrapper } from '@/shared/components';
import { useNavigateToChooseRole } from '@/features/Auth/hooks/useNavigateToChooseRole';
import { SignupScreenContent as UserSignupScreenContent } from '@/features/Auth/User/screens/SignupScreenContent';
import { SignupScreenContent as ConsultantSignupScreenContent } from '@/features/Auth/Consultant/screens/SignupScreenContent';

type Nav = NativeStackNavigationProp<AuthStackParamList, typeof ROUTES.Auth.Signup>;

export function SignupScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const { state } = useAuth();
  const onBackToChooseRole = useNavigateToChooseRole('signup');

  const onBackPress = useCallback((): void => {
    const previousRoute = navigation.getState().routes[navigation.getState().index - 1];

    if (previousRoute?.name === ROUTES.Auth.Login) {
      navigation.goBack();
      return;
    }

    onBackToChooseRole();
  }, [navigation, onBackToChooseRole]);

  useEffect(() => {
    if (!state.userType) {
      return undefined;
    }
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onBackPress();
      return true;
    });
    return () => subscription.remove();
  }, [onBackPress, state.userType]);

  const onSendOtp = (contact: string): void => {
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
              onPress={() => navigation.navigate(ROUTES.Auth.ChooseAccountType, { next: 'signup' })}
            />
          </View>
        </ScreenWrapper>
      </SafeAreaWrapper>
    );
  }

  return state.userType === 'user' ? (
    <UserSignupScreenContent onSendOtp={onSendOtp} onBackPress={onBackPress} />
  ) : (
    <ConsultantSignupScreenContent onSendOtp={onSendOtp} onBackPress={onBackPress} />
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
