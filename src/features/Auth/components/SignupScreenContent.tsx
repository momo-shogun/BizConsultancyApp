import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { THEME } from '@/constants/theme';
import { useOtpAutofill } from '@/features/Auth/hooks/useOtpAutofill';
import type { AuthRole } from '@/features/Auth/types/authApi.types';
import { isValidEmail } from '@/features/Consultation/utils/consultationValidation';
import {
  Button,
  Input,
  OTPInput,
  SafeAreaWrapper,
  ScreenHeader,
  ScreenWrapper,
} from '@/shared/components';

export const SIGNUP_ALREADY_REGISTERED_MESSAGE =
  'This number is already registered. Please login.';
export const SIGNUP_NUMBER_NOT_FOUND_INFO =
  'We could not find an account with this number. Please complete registration to continue.';
export const SIGNUP_NUMBER_NOT_FOUND_OTP_HINT =
  'Number not found. Please complete registration after OTP.';

export type SignupStep = 'mobile' | 'register';

export interface SignupScreenContentProps {
  role: AuthRole;
  onRoleChange: (role: AuthRole) => void;
  step: SignupStep;
  mobile: string;
  onMobileChange: (mobile: string) => void;
  onVerifyMobile: () => void;
  onChangeNumber: () => void;
  otp: string;
  onOtpChange: (otp: string) => void;
  onResendOtp: () => void;
  canResendOtp: boolean;
  isResendingOtp: boolean;
  resendCooldown: number;
  fullName: string;
  onFullNameChange: (name: string) => void;
  email: string;
  onEmailChange: (email: string) => void;
  password: string;
  onPasswordChange: (password: string) => void;
  confirmPassword: string;
  onConfirmPasswordChange: (password: string) => void;
  onRegister: () => void;
  onBackPress?: () => void;
  onGoToLogin?: () => void;
  isVerifyingMobile: boolean;
  isRegistering: boolean;
  errorMessage: string | null;
  alreadyRegistered: boolean;
}

const RESEND_LABEL = "Didn't receive it?";
const MIN_PASSWORD_LENGTH = 6;
const SCROLL_FOCUS_TOP_GAP = 88;
const SCROLL_FOCUS_DELAY_MS = Platform.OS === 'android' ? 220 : 120;
const KEYBOARD_EXTRA_PADDING = 24;

function RoleToggle(props: {
  role: AuthRole;
  onRoleChange: (role: AuthRole) => void;
  disabled: boolean;
}): React.ReactElement {
  return (
    <View style={styles.roleToggleRow}>
      {(['user', 'consultant'] as const).map((option) => {
        const selected = props.role === option;
        const label = option === 'user' ? 'User' : 'Consultant';
        return (
          <Pressable
            key={option}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={`Continue as ${label}`}
            disabled={props.disabled}
            onPress={() => props.onRoleChange(option)}
            style={({ pressed }) => [
              styles.roleToggleButton,
              selected ? styles.roleToggleButtonSelected : null,
              props.disabled ? styles.roleToggleButtonDisabled : null,
              pressed && !props.disabled ? styles.roleToggleButtonPressed : null,
            ]}
          >
            <Text style={[styles.roleToggleText, selected ? styles.roleToggleTextSelected : null]}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function handleOtpChange(
  value: string,
  onOtpChange: (otp: string) => void,
  onClearError?: () => void,
): void {
  const cleaned = value.replace(/\D/g, '').slice(0, 6);
  onOtpChange(cleaned);
  onClearError?.();
}

export function SignupScreenContent(props: SignupScreenContentProps): React.ReactElement {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const contentRef = useRef<View>(null);
  const mobileFieldRef = useRef<View>(null);
  const otpSectionRef = useRef<View>(null);
  const fullNameFieldRef = useRef<View>(null);
  const emailFieldRef = useRef<View>(null);
  const passwordFieldRef = useRef<View>(null);
  const confirmPasswordFieldRef = useRef<View>(null);
  const otpInputRef = useRef<TextInput>(null);
  const [keyboardInset, setKeyboardInset] = useState<number>(0);
  const roleLabel = props.role === 'user' ? 'User' : 'Consultant';

  const cleanedMobile = useMemo(
    () => props.mobile.replace(/[^0-9]/g, '').slice(0, 10),
    [props.mobile],
  );

  const applyOtp = useCallback(
    (value: string): void => {
      handleOtpChange(value, props.onOtpChange);
    },
    [props.onOtpChange],
  );

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (event) => {
      setKeyboardInset(event.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardInset(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const scrollIntoView = useCallback((targetRef: React.RefObject<View | null>): void => {
    setTimeout(() => {
      const target = targetRef.current;
      const content = contentRef.current;
      const scroll = scrollRef.current;

      if (target == null || content == null || scroll == null) {
        return;
      }

      target.measureLayout(
        content,
        (_x, y) => {
          scroll.scrollTo({
            y: Math.max(0, y - SCROLL_FOCUS_TOP_GAP),
            animated: true,
          });
        },
        () => undefined,
      );
    }, SCROLL_FOCUS_DELAY_MS);
  }, []);

  const scrollContentPaddingBottom =
    keyboardInset > 0
      ? keyboardInset + KEYBOARD_EXTRA_PADDING
      : THEME.spacing[32];

  const keyboardVerticalOffset = insets.top + THEME.spacing[8];

  const { restartSmsListener } = useOtpAutofill({
    otp: props.otp,
    enabled: props.step === 'register',
    onOtpFilled: applyOtp,
    onOtpComplete: () => undefined,
  });

  const focusOtpInput = useCallback((): void => {
    requestAnimationFrame(() => {
      otpInputRef.current?.focus();
    });
  }, []);

  useEffect(() => {
    if (props.step !== 'register') {
      return;
    }

    const timer = setTimeout(() => {
      focusOtpInput();
    }, 300);

    return () => clearTimeout(timer);
  }, [focusOtpInput, props.step]);

  const passwordMismatch =
    props.confirmPassword.length > 0 && props.password !== props.confirmPassword;
  const emailInvalid = props.email.trim().length > 0 && !isValidEmail(props.email);
  const canVerifyMobile = cleanedMobile.length === 10 && !props.isVerifyingMobile;
  const canRegister =
    props.fullName.trim().length >= 2 &&
    isValidEmail(props.email) &&
    props.password.length >= MIN_PASSWORD_LENGTH &&
    props.password === props.confirmPassword &&
    props.otp.length === 6 &&
    !props.isRegistering;

  const handleResend = (): void => {
    if (!props.canResendOtp || props.isResendingOtp) {
      return;
    }

    props.onOtpChange('');
    focusOtpInput();
    restartSmsListener();
    props.onResendOtp();
  };

  return (
    <SafeAreaWrapper edges={['top', 'bottom']}>
      <ScreenHeader title="Register" onBackPress={props.onBackPress} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <ScreenWrapper style={styles.flex}>
          <ScrollView
            ref={scrollRef}
            style={styles.flex}
            contentContainerStyle={[
              styles.content,
              { paddingBottom: scrollContentPaddingBottom },
            ]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
          >
            <View ref={contentRef} style={styles.formContent} collapsable={false}>
            <Text style={styles.subtitle}>
              Continue as {roleLabel} using your mobile number and a one-time password.
            </Text>

            <RoleToggle
              role={props.role}
              onRoleChange={props.onRoleChange}
              disabled={props.step === 'register'}
            />

            <View ref={mobileFieldRef} style={styles.section} collapsable={false}>
              <View style={styles.mobileHeaderRow}>
                <Text style={styles.sectionLabel}>Mobile number</Text>
                {props.step === 'register' ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Change mobile number"
                    onPress={props.onChangeNumber}
                    hitSlop={8}
                  >
                    <Text style={styles.changeNumberText}>Change number</Text>
                  </Pressable>
                ) : null}
              </View>

              <View style={styles.mobileRow}>
                <View style={styles.countryCode}>
                  <Text style={styles.countryCodeText}>+91</Text>
                </View>
                <View style={styles.mobileInputWrap}>
                  <Input
                    value={cleanedMobile}
                    onChangeText={props.onMobileChange}
                    placeholder="10-digit mobile number"
                    keyboardType="number-pad"
                    accessibilityLabel="Mobile number input"
                    maxLength={10}
                    editable={props.step === 'mobile'}
                    onFocus={() => scrollIntoView(mobileFieldRef)}
                  />
                </View>
              </View>
            </View>

            {props.step === 'mobile' ? (
              <Button
                label="Send OTP"
                accessibilityLabel="Send OTP to mobile number"
                disabled={!canVerifyMobile}
                loading={props.isVerifyingMobile}
                onPress={props.onVerifyMobile}
              />
            ) : null}

            {props.step === 'register' ? (
              <>
                <View style={styles.infoBanner}>
                  <Ionicons name="information-circle-outline" size={18} color={THEME.colors.primary} />
                  <Text style={styles.infoBannerText}>{SIGNUP_NUMBER_NOT_FOUND_INFO}</Text>
                </View>

                <View ref={otpSectionRef} style={styles.section} collapsable={false}>
                  <Text style={styles.sectionLabel}>OTP</Text>
                  <Text style={styles.otpHint}>{SIGNUP_NUMBER_NOT_FOUND_OTP_HINT}</Text>
                  <Text style={styles.otpSubLabel}>Enter the 6-digit code sent to your mobile</Text>

                  <View style={[styles.otpInputContainer, styles.otpRow]}>
                    <OTPInput
                      value={props.otp}
                      onChange={applyOtp}
                      accessibilityLabel="Signup OTP input"
                      activeIndex={Math.min(props.otp.length, 5)}
                    />
                    <TextInput
                      ref={otpInputRef}
                      accessibilityLabel="Signup OTP input field"
                      value={props.otp}
                      onChangeText={applyOtp}
                      keyboardType={Platform.OS === 'android' ? 'number-pad' : 'default'}
                      inputMode="numeric"
                      textContentType="oneTimeCode"
                      autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
                      importantForAutofill="yes"
                      autoCorrect={false}
                      autoCapitalize="none"
                      spellCheck={false}
                      caretHidden
                      maxLength={6}
                      showSoftInputOnFocus
                      style={styles.otpOverlayInput}
                      onFocus={() => scrollIntoView(otpSectionRef)}
                    />
                  </View>

                  <View style={styles.resendRow}>
                    <Text style={styles.resendLabel}>{RESEND_LABEL}</Text>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Resend OTP"
                      disabled={!props.canResendOtp || props.isResendingOtp}
                      onPress={handleResend}
                      hitSlop={8}
                    >
                      <Text
                        style={[
                          styles.resendAction,
                          !props.canResendOtp || props.isResendingOtp
                            ? styles.resendActionDisabled
                            : null,
                        ]}
                      >
                        {props.isResendingOtp
                          ? 'Sending…'
                          : props.resendCooldown > 0
                            ? `Resend OTP (${props.resendCooldown}s)`
                            : 'Resend OTP'}
                      </Text>
                    </Pressable>
                  </View>
                </View>

                <View ref={fullNameFieldRef} collapsable={false}>
                <Input
                  label="Full name"
                  value={props.fullName}
                  onChangeText={props.onFullNameChange}
                  placeholder="Enter your full name"
                  textContentType="name"
                  autoCapitalize="words"
                  accessibilityLabel="Full name input"
                  onFocus={() => scrollIntoView(fullNameFieldRef)}
                />
                </View>

                <View ref={emailFieldRef} collapsable={false}>
                <Input
                  label="Email"
                  value={props.email}
                  onChangeText={props.onEmailChange}
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  textContentType="emailAddress"
                  accessibilityLabel="Email input"
                  error={emailInvalid ? 'Please enter a valid email address.' : null}
                  onFocus={() => scrollIntoView(emailFieldRef)}
                />
                </View>

                <View ref={passwordFieldRef} collapsable={false}>
                <Input
                  label="Password"
                  value={props.password}
                  onChangeText={props.onPasswordChange}
                  placeholder="Enter password"
                  secureTextEntry
                  textContentType="password"
                  autoCapitalize="none"
                  accessibilityLabel="Password input"
                  onFocus={() => scrollIntoView(passwordFieldRef)}
                />
                </View>

                <View ref={confirmPasswordFieldRef} collapsable={false}>
                <Input
                  label="Confirm password"
                  value={props.confirmPassword}
                  onChangeText={props.onConfirmPasswordChange}
                  placeholder="Re-enter password"
                  secureTextEntry
                  textContentType="password"
                  autoCapitalize="none"
                  accessibilityLabel="Confirm password input"
                  error={passwordMismatch ? 'Passwords do not match.' : null}
                  onFocus={() => scrollIntoView(confirmPasswordFieldRef)}
                />
                </View>

                <Button
                  label="Register"
                  accessibilityLabel="Complete registration"
                  disabled={!canRegister}
                  loading={props.isRegistering}
                  onPress={props.onRegister}
                />
              </>
            ) : null}

            {props.alreadyRegistered ? (
              <View style={styles.alreadyRegisteredBox}>
                <Text style={styles.errorText} accessibilityRole="alert">
                  {SIGNUP_ALREADY_REGISTERED_MESSAGE}
                </Text>
                {props.onGoToLogin != null ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Go to login"
                    onPress={props.onGoToLogin}
                    hitSlop={8}
                  >
                    <Text style={styles.loginLink}>Go to login</Text>
                  </Pressable>
                ) : null}
              </View>
            ) : null}

            {props.errorMessage != null && props.errorMessage.length > 0 ? (
              <Text style={styles.errorText} accessibilityRole="alert">
                {props.errorMessage}
              </Text>
            ) : null}
            </View>
          </ScrollView>
        </ScreenWrapper>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    padding: THEME.spacing[16],
    flexGrow: 1,
  },
  formContent: {
    gap: THEME.spacing[16],
  },
  subtitle: {
    fontSize: THEME.typography.size[14],
    lineHeight: 20,
    color: THEME.colors.textSecondary,
  },
  roleToggleRow: {
    flexDirection: 'row',
    gap: THEME.spacing[8],
    padding: 4,
    borderRadius: THEME.radius[12],
    backgroundColor: '#F1F5F9',
  },
  roleToggleButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: THEME.radius[8],
  },
  roleToggleButtonSelected: {
    backgroundColor: THEME.colors.white,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  roleToggleButtonDisabled: {
    opacity: 0.7,
  },
  roleToggleButtonPressed: {
    opacity: 0.85,
  },
  roleToggleText: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.medium as '500',
    color: THEME.colors.textSecondary,
  },
  roleToggleTextSelected: {
    color: THEME.colors.textPrimary,
    fontWeight: THEME.typography.weight.semibold as '600',
  },
  section: {
    gap: THEME.spacing[8],
  },
  sectionLabel: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textPrimary,
  },
  mobileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  changeNumberText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.primary,
    textDecorationLine: 'underline',
  },
  mobileRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: THEME.spacing[8],
  },
  countryCode: {
    minWidth: 56,
    height: 48,
    borderRadius: THEME.radius[12],
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    marginTop: 0,
  },
  countryCodeText: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textPrimary,
  },
  mobileInputWrap: {
    flex: 1,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: THEME.spacing[8],
    padding: THEME.spacing[12],
    borderRadius: THEME.radius[12],
    backgroundColor: '#EFF6FF',
  },
  infoBannerText: {
    flex: 1,
    fontSize: THEME.typography.size[12],
    lineHeight: 18,
    color: '#1E3A8A',
  },
  otpHint: {
    fontSize: THEME.typography.size[12],
    lineHeight: 18,
    color: THEME.colors.textSecondary,
  },
  otpSubLabel: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
  },
  otpInputContainer: {
    position: 'relative',
    minHeight: 48,
  },
  otpRow: {
    marginTop: THEME.spacing[4],
  },
  otpOverlayInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    fontSize: 16,
    color: 'transparent',
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
    flexWrap: 'wrap',
  },
  resendLabel: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
  },
  resendAction: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.primary,
    textDecorationLine: 'underline',
  },
  resendActionDisabled: {
    color: THEME.colors.textSecondary,
    textDecorationLine: 'none',
  },
  alreadyRegisteredBox: {
    gap: THEME.spacing[8],
  },
  errorText: {
    fontSize: THEME.typography.size[12],
    lineHeight: 18,
    color: THEME.colors.danger,
    fontWeight: THEME.typography.weight.medium as '500',
  },
  loginLink: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.primary,
    textDecorationLine: 'underline',
  },
});
