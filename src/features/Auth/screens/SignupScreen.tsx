import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuth } from '@/app/providers/AuthProvider';
import {
  SignupScreenContent,
  type SignupStep,
} from '@/features/Auth/components/SignupScreenContent';
import { useSignupFlow } from '@/features/Auth/hooks/useSignupFlow';
import { selectPreferredAccountRole } from '@/features/Auth/store/authSelectors';
import { setAuthProfile } from '@/features/Auth/store/authSlice';
import { registerAndLogin } from '@/features/Auth/store/authThunks';
import type { AuthRole } from '@/features/Auth/types/authApi.types';
import { ROUTES } from '@/navigation/routeNames';
import type { AuthStackParamList } from '@/navigation/types';
import { showGlobalToast } from '@/shared/components/toast';
import { useAppDispatch, useAppSelector } from '@/store/typedHooks';
import { getApiErrorMessage } from '@/utils/apiError';

type Nav = NativeStackNavigationProp<AuthStackParamList, typeof ROUTES.Auth.Signup>;
type Rt = RouteProp<AuthStackParamList, typeof ROUTES.Auth.Signup>;

const RESEND_COOLDOWN_SECONDS = 30;

export function SignupScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const dispatch = useAppDispatch();
  const preferredRole = useAppSelector(selectPreferredAccountRole);
  const { state, selectAccountContext, completeOnboarding } = useAuth();
  const {
    verifyAndSendOtp,
    resendOtp,
    isVerifyingMobile,
    isResendingOtp,
    error,
    clearError,
  } = useSignupFlow();

  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  const activeRole: AuthRole = state.userType ?? preferredRole ?? 'user';

  const [step, setStep] = useState<SignupStep>('mobile');
  const [mobile, setMobile] = useState<string>(route.params?.mobile ?? '');
  const [otp, setOtp] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [alreadyRegistered, setAlreadyRegistered] = useState<boolean>(false);
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const didInitContextRef = useRef<boolean>(false);

  useEffect(() => {
    if (didInitContextRef.current) {
      return;
    }

    didInitContextRef.current = true;
    const role = state.userType ?? preferredRole ?? 'user';
    selectAccountContext({ userType: role, authIntent: 'signup' });
  }, [preferredRole, selectAccountContext, state.userType]);

  useEffect(() => {
    if (resendCooldown <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  const onBackPress = useCallback((): void => {
    const previousRoute = navigation.getState().routes[navigation.getState().index - 1];

    if (previousRoute?.name === ROUTES.Auth.Login) {
      navigation.goBack();
      return;
    }

    if (step === 'register') {
      setStep('mobile');
      setOtp('');
      setAlreadyRegistered(false);
      clearError();
      return;
    }

    navigation.goBack();
  }, [clearError, navigation, step]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onBackPress();
      return true;
    });
    return () => subscription.remove();
  }, [onBackPress]);

  const cleanedMobile = mobile.replace(/[^0-9]/g, '').slice(0, 10);

  const resetRegistrationFields = (): void => {
    setStep('mobile');
    setOtp('');
    setFullName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setAlreadyRegistered(false);
    setResendCooldown(0);
    clearError();
  };

  const onRoleChange = (role: AuthRole): void => {
    selectAccountContext({ userType: role, authIntent: 'signup' });
    clearError();
    setAlreadyRegistered(false);
  };

  const onVerifyMobile = async (): Promise<void> => {
    clearError();
    setRegistrationError(null);
    setAlreadyRegistered(false);

    const result = await verifyAndSendOtp(cleanedMobile, activeRole);

    if (result === 'already_registered') {
      setAlreadyRegistered(true);
      return;
    }

    if (result === 'otp_sent') {
      setStep('register');
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    }
  };

  const onResendOtpPress = async (): Promise<void> => {
    if (resendCooldown > 0 || isResendingOtp) {
      return;
    }

    const sent = await resendOtp(cleanedMobile);
    if (sent) {
      showGlobalToast({
        variant: 'success',
        message: 'A new verification code has been sent to your number.',
      });
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    }
  };

  const onRegister = async (): Promise<void> => {
    clearError();
    setRegistrationError(null);
    setIsRegistering(true);

    try {
      await dispatch(
        registerAndLogin({
          mobile: cleanedMobile,
          otp,
          role: activeRole,
          name: fullName.trim(),
          email: email.trim(),
          password,
        }),
      ).unwrap();

      dispatch(
        setAuthProfile({
          mobile: cleanedMobile,
          displayName: fullName.trim(),
          email: email.trim(),
          accountRole: activeRole,
        }),
      );

      if (activeRole === 'user') {
        completeOnboarding();
        return;
      }

      navigation.navigate(ROUTES.Auth.ProfileSetup);
    } catch (err: unknown) {
      setRegistrationError(getApiErrorMessage(err, 'Registration failed. Please try again.'));
    } finally {
      setIsRegistering(false);
    }
  };

  const onGoToLogin = (): void => {
    selectAccountContext({ userType: activeRole, authIntent: 'login' });
    navigation.navigate(ROUTES.Auth.Login);
  };

  return (
    <SignupScreenContent
      role={activeRole}
      onRoleChange={onRoleChange}
      step={step}
      mobile={mobile}
      onMobileChange={setMobile}
      onVerifyMobile={() => {
        void onVerifyMobile();
      }}
      onChangeNumber={resetRegistrationFields}
      otp={otp}
      onOtpChange={setOtp}
      onResendOtp={() => {
        void onResendOtpPress();
      }}
      canResendOtp={resendCooldown <= 0 && !isResendingOtp}
      isResendingOtp={isResendingOtp}
      resendCooldown={resendCooldown}
      fullName={fullName}
      onFullNameChange={setFullName}
      email={email}
      onEmailChange={setEmail}
      password={password}
      onPasswordChange={setPassword}
      confirmPassword={confirmPassword}
      onConfirmPasswordChange={setConfirmPassword}
      onRegister={() => {
        void onRegister();
      }}
      onBackPress={onBackPress}
      onGoToLogin={onGoToLogin}
      isVerifyingMobile={isVerifyingMobile}
      isRegistering={isRegistering}
      errorMessage={registrationError ?? error}
      alreadyRegistered={alreadyRegistered}
    />
  );
}
