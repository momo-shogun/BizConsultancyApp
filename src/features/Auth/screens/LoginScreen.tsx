import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ROUTES } from '@/navigation/routeNames';
import type { AuthStackParamList } from '@/navigation/types';
import { useAuth } from '@/app/providers/AuthProvider';
import { establishGuestSession } from '@/features/Auth/store/authSlice';
import { useAppDispatch } from '@/store/typedHooks';
import { Button, EmptyState, ScreenWrapper, SafeAreaWrapper } from '@/shared/components';
import { useLoginFlow } from '@/features/Auth/hooks/useLoginFlow';
import { LoginScreenContent as UserLoginScreenContent } from '@/features/Auth/User/screens/LoginScreenContent';
import { LoginScreenContent as ConsultantLoginScreenContent } from '@/features/Auth/Consultant/screens/LoginScreenContent';

type Nav = NativeStackNavigationProp<AuthStackParamList, typeof ROUTES.Auth.Login>;

export function LoginScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const { state } = useAuth();
  const { submitMobile, isLoading, error } = useLoginFlow();

  const onSkip = (): void => {
    dispatch(
      establishGuestSession({
        accountRole: state.userType ?? 'user',
      }),
    );
  };

  const onContinue = async (contact: string): Promise<void> => {
    const success = await submitMobile(contact);
    if (success) {
      navigation.navigate(ROUTES.Auth.OtpVerification, { contact });
    }
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
      isSubmitting={isLoading}
      errorMessage={error}
    />
  ) : (
    <ConsultantLoginScreenContent
      onContinue={onContinue}
      onSkip={onSkip}
      onBackPress={() => navigation.goBack()}
      isSubmitting={isLoading}
      errorMessage={error}
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
