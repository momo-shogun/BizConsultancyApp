import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuth } from '@/app/providers/AuthProvider';
import { useSendOtpMutation } from '@/features/Auth/api/authApi';
import { setAuthProfile } from '@/features/Auth/store/authSlice';
import { verifyOtpAndLogin } from '@/features/Auth/store/authThunks';
import { ROUTES } from '@/navigation/routeNames';
import { useAppDispatch } from '@/store/typedHooks';
import type { AuthStackParamList } from '@/navigation/types';
import { Button, EmptyState, SafeAreaWrapper, ScreenWrapper } from '@/shared/components';
import { showGlobalError, showGlobalToast } from '@/shared/components/toast';
import { getApiErrorMessage } from '@/utils/apiError';
import { OTPVerificationScreenContent as UserOtpContent } from '@/features/Auth/User/screens/OTPVerificationScreenContent';
import { OTPVerificationScreenContent as ConsultantOtpContent } from '@/features/Auth/Consultant/screens/OTPVerificationScreenContent';

type Nav = NativeStackNavigationProp<AuthStackParamList, typeof ROUTES.Auth.OtpVerification>;
type Rt = RouteProp<AuthStackParamList, typeof ROUTES.Auth.OtpVerification>;

const RESEND_COOLDOWN_SECONDS = 30;

export function OTPVerificationScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const dispatch = useAppDispatch();
  const { state, completeOnboarding } = useAuth();
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [sendOtp, { isLoading: isResending }] = useSendOtpMutation();

  const contact = route.params.contact;

  useEffect(() => {
    if (resendCooldown <= 0) {
      return;
    }
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const onResendOtp = useCallback(async (): Promise<void> => {
    if (resendCooldown > 0 || isResending) {
      return;
    }

    try {
      const result = await sendOtp({ mobile: contact }).unwrap();
      if (!result.sent) {
        showGlobalError('Could not resend the code. Please try again.');
        return;
      }
      showGlobalToast({
        variant: 'success',
        message: 'A new verification code has been sent to your number.',
      });
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error: unknown) {
      showGlobalError(getApiErrorMessage(error, 'Could not resend the code. Please try again.'));
    }
  }, [contact, isResending, resendCooldown, sendOtp]);

  const onVerified = useCallback(
    async (otp: string): Promise<void> => {
      if (state.userType == null) {
        return;
      }

      setIsVerifying(true);
      try {
        await dispatch(
          verifyOtpAndLogin({
            mobile: contact,
            otp,
            role: state.userType,
          }),
        ).unwrap();

        dispatch(
          setAuthProfile({
            mobile: contact,
            accountRole: state.userType,
          }),
        );

        if (state.userType === 'user') {
          completeOnboarding();
          return;
        }

        navigation.navigate(ROUTES.Auth.ProfileSetup);
      } catch (error: unknown) {
        showGlobalError(getApiErrorMessage(error, 'Could not verify OTP. Please try again.'));
      } finally {
        setIsVerifying(false);
      }
    },
    [completeOnboarding, contact, dispatch, navigation, state.userType],
  );

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

  const otpContentProps = {
    contact,
    onVerified: (otp: string) => void onVerified(otp),
    onResendOtp: () => void onResendOtp(),
    onBackPress: () => navigation.goBack(),
    isResending,
    resendCooldownSeconds: resendCooldown,
  };

  return state.userType === 'user' ? (
    <UserOtpContent {...otpContentProps} />
  ) : (
    <ConsultantOtpContent {...otpContentProps} />
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
