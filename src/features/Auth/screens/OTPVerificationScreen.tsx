import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuth } from '@/app/providers/AuthProvider';
import { ROUTES } from '@/navigation/routeNames';
import type { AuthStackParamList } from '@/navigation/types';
import { Button, EmptyState, SafeAreaWrapper, ScreenWrapper } from '@/shared/components';
import { OTPVerificationScreenContent as UserOtpContent } from '@/features/Auth/User/screens/OTPVerificationScreenContent';
import { OTPVerificationScreenContent as ConsultantOtpContent } from '@/features/Auth/Consultant/screens/OTPVerificationScreenContent';

type Nav = NativeStackNavigationProp<AuthStackParamList, typeof ROUTES.Auth.OtpVerification>;
type Rt = RouteProp<AuthStackParamList, typeof ROUTES.Auth.OtpVerification>;

export function OTPVerificationScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const { state, completeOnboarding } = useAuth();

  const contact = route.params.contact;

  const onVerified = (): void => {
    if (state.userType === 'user') {
      completeOnboarding();
      return;
    }

    navigation.navigate(ROUTES.Auth.ProfileSetup);
  };

  if (!state.userType) {
    const next = state.authIntent ?? 'login';
    return (
      <SafeAreaWrapper edges={['top', 'bottom']}>
        <ScreenWrapper style={styles.wrapper}>
          <EmptyState title="Choose account type" description="Please select User or Consultant to continue." />
          <View style={styles.actionRow}>
            <Button
              label="Choose account type"
              accessibilityLabel="Choose account type"
              onPress={() => navigation.navigate(ROUTES.Auth.ChooseAccountType, { next })}
            />
          </View>
        </ScreenWrapper>
      </SafeAreaWrapper>
    );
  }

  return state.userType === 'user' ? (
    <UserOtpContent
      contact={contact}
      onVerified={onVerified}
      onBackPress={() => navigation.goBack()}
    />
  ) : (
    <ConsultantOtpContent
      contact={contact}
      onVerified={onVerified}
      onBackPress={() => navigation.goBack()}
    />
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
