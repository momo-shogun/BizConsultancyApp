import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  Linking,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';
import {
  KeyboardWrapper,
  OTPInput,
  ScrollWrapper,
  SafeAreaWrapper,
  ScreenWrapper,
} from '@/shared/components';

import lightLogo from '@/assets/lightlogo.png';
import { useOtpAutofill } from '@/features/Auth/hooks/useOtpAutofill';

export interface OTPVerificationScreenContentProps {
  roleLabel: string;
  contact: string;
  onVerified: (otp: string) => void;
  onResendOtp?: () => void;
  onBackPress?: () => void;
  onClearError?: () => void;
  errorMessage?: string | null;
  isResending?: boolean;
  resendCooldownSeconds?: number; // used as the duration, default 30
}

const DEFAULT_COOLDOWN = 30;

function handleOtpChange(
  value: string,
  setOtp: React.Dispatch<React.SetStateAction<string>>,
  onClearError?: () => void,
): void {
  const cleaned = value.replace(/\D/g, '').slice(0, 6);
  setOtp(cleaned);
  onClearError?.();
}

export function OTPVerificationScreenContent(
  props: OTPVerificationScreenContentProps,
): React.ReactElement {
  const { contact } = props;
  const insets = useSafeAreaInsets();
  const otpInputRef = useRef<TextInput>(null);

  const [otp, setOtp] = useState<string>('');

  const applyOtp = useCallback(
    (value: string): void => {
      handleOtpChange(value, setOtp, props.onClearError);
    },
    [props.onClearError],
  );

  const { restartSmsListener } = useOtpAutofill({
    otp,
    onOtpFilled: applyOtp,
    onOtpComplete: props.onVerified,
  });

  const focusOtpInput = useCallback((): void => {
    requestAnimationFrame(() => {
      otpInputRef.current?.focus();
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      focusOtpInput();
    }, 300);
    return () => clearTimeout(timer);
  }, [focusOtpInput]);

  // ✅ Cooldown is now internal state, initialized to duration so it starts counting immediately
  const cooldownDuration = props.resendCooldownSeconds ?? DEFAULT_COOLDOWN;
  const [cooldown, setCooldown] = useState<number>(cooldownDuration);

  // Start countdown when cooldown is active (including on mount).
  useEffect(() => {
    if (cooldown <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const masked = useMemo((): string => {
    const c = contact.trim();
    if (c.includes('@')) return c.replace(/(^.).*(@.*$)/, '$1***$2');
    if (c.length >= 4) return `${c.slice(0, 2)}***${c.slice(-2)}`;
    return c;
  }, [contact]);

  const canVerify = otp.length === 6;
  const canResend = cooldown <= 0 && !props.isResending;

  const handleResend = (): void => {
    if (!canResend || props.onResendOtp == null) return;

    setOtp('');
    props.onClearError?.();
    focusOtpInput();
    restartSmsListener();
    props.onResendOtp();

    // Restart the cooldown timer after resend
    setCooldown(cooldownDuration);
  };

  return (
    <SafeAreaWrapper edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.background} />
      <KeyboardWrapper>
        <ScreenWrapper>
          <ScrollWrapper contentContainerStyle={styles.content}>
            <View style={[styles.top, { paddingTop: insets.top + THEME.spacing[8] }]}>
              <Image
                source={lightLogo}
                accessibilityLabel="Biz Consultancy"
                style={styles.brandMark}
                resizeMode="contain"
              />
              <View style={styles.progressTrack}>
                <View style={styles.progressActive} />
              </View>
            </View>

            <Text style={styles.title}>We just texted you, what's the code?</Text>

            <View style={[styles.otpInputContainer, styles.otpRow]}>
              <OTPInput
                value={otp}
                onChange={applyOtp}
                accessibilityLabel="OTP input"
                activeIndex={Math.min(otp.length, 5)}
              />
              <TextInput
                ref={otpInputRef}
                accessibilityLabel="OTP input field"
                value={otp}
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
              />
            </View>

            {props.errorMessage != null && props.errorMessage.length > 0 ? (
              <Text style={styles.errorText} accessibilityRole="alert">
                {props.errorMessage}
              </Text>
            ) : null}

            <Text style={styles.help}>
              We've sent a verification code to <Text style={styles.helpStrong}>{masked}</Text>
            </Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                cooldown > 0 ? `Resend code in ${cooldown} seconds` : 'Resend code'
              }
              onPress={handleResend}
              disabled={!canResend}
              style={({ pressed }) => [
                styles.resend,
                !canResend ? styles.resendDisabled : null,
                pressed && canResend ? styles.resendPressed : null,
              ]}
              hitSlop={8}
            >
              <Ionicons
                name="refresh"
                size={16}
                color={canResend ? THEME.colors.textPrimary : THEME.colors.textSecondary}
              />
              <Text style={[styles.resendText, !canResend ? styles.resendTextDisabled : null]}>
                {props.isResending
                  ? 'Sending…'
                  : cooldown > 0
                    ? `Resend code in ${cooldown}s`
                    : 'Resend code'}
              </Text>
            </Pressable>

            <View style={styles.flexSpacer} />

            <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
              {props.onBackPress ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Go back"
                  onPress={props.onBackPress}
                  style={styles.roundBtn}
                  hitSlop={10}
                >
                  <Ionicons name="arrow-back" size={18} color={THEME.colors.textPrimary} />
                </Pressable>
              ) : (
                <View style={styles.roundBtnSpacer} />
              )}

              <Text style={styles.footerHelp}>
                Experiencing issues? Email our team:{'\n'}
                <Pressable onPress={() => Linking.openURL('mailto:bizconsultancy@iid.org.in')}>
                  <Text style={styles.footerHelpStrong}>bizconsultancy@iid.org.in</Text>
                </Pressable>
              </Text>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Verify OTP"
                disabled={!canVerify}
                onPress={() => props.onVerified(otp)}
                style={({ pressed }) => [
                  styles.roundBtn,
                  styles.roundBtnPrimary,
                  !canVerify ? styles.roundBtnDisabled : null,
                  pressed && canVerify ? styles.roundBtnPressed : null,
                ]}
                hitSlop={10}
              >
                <Ionicons name="arrow-forward" size={18} color={THEME.colors.white} />
              </Pressable>
            </View>
          </ScrollWrapper>
        </ScreenWrapper>
      </KeyboardWrapper>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: THEME.spacing[16],
    paddingBottom: THEME.spacing[16],
    backgroundColor: THEME.colors.background,
  },
  top: {
    gap: THEME.spacing[12],
  },
  brandMark: {
    height: 34,
    width: 180,
    alignSelf: 'center',
  },
  progressTrack: {
    height: 3,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressActive: {
    width: 64,
    height: 3,
    backgroundColor: '#FF5A1F',
  },
  title: {
    marginTop: THEME.spacing[16],
    fontSize: 30,
    fontWeight: '900',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.9,
  },
  otpRow: {
    marginTop: THEME.spacing[16],
  },
  otpInputContainer: {
    position: 'relative',
    minHeight: 48,
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
  errorText: {
    marginTop: THEME.spacing[10],
    fontSize: THEME.typography.size[12],
    lineHeight: 18,
    color: THEME.colors.danger,
    fontWeight: THEME.typography.weight.medium as '500',
  },
  help: {
    marginTop: THEME.spacing[12],
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
  },
  helpStrong: {
    color: THEME.colors.textPrimary,
    fontWeight: THEME.typography.weight.semibold,
  },
  resend: {
    marginTop: THEME.spacing[8],
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[8],
    borderRadius: 999,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  resendPressed: {
    opacity: 0.85,
  },
  resendDisabled: {
    opacity: 0.55,
  },
  resendText: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold,
    color: THEME.colors.textPrimary,
  },
  resendTextDisabled: {
    color: THEME.colors.textSecondary,
  },
  flexSpacer: {
    flex: 1,
    minHeight: THEME.spacing[24],
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: THEME.spacing[12],
  },
  roundBtnSpacer: {
    width: 48,
    height: 48,
  },
  roundBtn: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundBtnPrimary: {
    backgroundColor: THEME.colors.primary,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  roundBtnDisabled: {
    opacity: 0.45,
  },
  roundBtnPressed: {
    opacity: 0.85,
  },
  footerHelp: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 15,
    color: THEME.colors.textSecondary,
  },
  footerHelpStrong: {
    color: 'blue',
    fontWeight: THEME.typography.weight.semibold,
    fontSize: 12,
  },
});