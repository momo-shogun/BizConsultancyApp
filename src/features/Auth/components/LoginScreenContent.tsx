
import React, { useMemo, useState } from 'react';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';
import {
  Button,
  KeyboardWrapper,
  SafeAreaWrapper,
  ScreenWrapper,
  ScrollWrapper,
} from '@/shared/components';
import { Input } from '@/shared/components/ui/Input/Input';

import heroIllustration from '../../../assets/tuxpi.com.1776427891.jpg';

export interface LoginScreenContentProps {
  roleLabel: string;
  onContinue: (phoneNumber: string) => void;
  onSkip?: () => void;
  onBackPress?: () => void;
}

export function LoginScreenContent(
  props: LoginScreenContentProps,
): React.ReactElement {
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const cleanedPhone = useMemo(
    () => phoneNumber.replace(/[^0-9]/g, '').slice(0, 10),
    [phoneNumber],
  );

  const canContinue = cleanedPhone.length === 10;

  return (
    <SafeAreaWrapper edges={['top', 'bottom']}>
      <KeyboardWrapper>
        <ScreenWrapper>
          <ScrollWrapper
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.heroSection}>
              <ImageBackground
                source={heroIllustration}
                style={styles.heroImage}
                imageStyle={styles.heroImageRadius}
                resizeMode="cover"
              >
                {props.onBackPress ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Go back"
                    onPress={props.onBackPress}
                    style={styles.backButton}
                    hitSlop={10}
                  >
                    <Ionicons name="arrow-back" size={18} color={THEME.colors.textPrimary} />
                  </Pressable>
                ) : null}

                <LinearGradient
                  colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.9)', '#FFFFFF']}
                  locations={[0, 0.55, 1]}
                  style={styles.heroFade}
                />
              </ImageBackground>
            </View>

            <View style={styles.headerCopy}>
              <Text style={styles.title}>Start Your Business
              </Text>

              <Text style={styles.subtitle}>
                Log in to continue as {props.roleLabel}.
              </Text>
            </View>

            <View style={styles.card}>
              {/* <Text style={styles.inputLabel}>Mobile Number</Text> */}


              <Input
                label="Mobile Number"
                value={cleanedPhone}
                onChangeText={setPhoneNumber}
                placeholder="Enter 10-digit mobile number"
                keyboardType="number-pad"
                accessibilityLabel="Phone number input"
                containerStyle={styles.inputContainer}
                inputStyle={styles.input}
                maxLength={10}
                rightAdornment={
                  cleanedPhone.length > 0 ? (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Clear phone number"
                      onPress={() => setPhoneNumber('')}
                      hitSlop={10}
                      style={styles.clearButton}
                    >
                      <Ionicons
                        name="close-circle"
                        size={18}
                        color={THEME.colors.textSecondary}
                      />
                    </Pressable>
                  ) : null
                }
              />


              <View style={styles.infoRow}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={16}
                  color={THEME.colors.success || '#16A34A'}
                />
                <Text style={styles.infoText}>
                  OTP will be sent for secure verification
                </Text>
              </View>

              <Button
                label="Continue"
                accessibilityLabel="Continue to OTP verification"
                disabled={!canContinue}
                onPress={() => props.onContinue(cleanedPhone)}
                style={styles.button}
              />

              {props.onSkip ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Skip login"
                  onPress={props.onSkip}
                  hitSlop={10}
                  style={({ pressed }) => [styles.skipBtn, pressed ? styles.skipPressed : null]}
                >
                  <Text style={styles.skipText}>Skip for now</Text>
                </Pressable>
              ) : null}
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
    paddingBottom: THEME.spacing[24],
    backgroundColor: THEME.colors.background,
  },

  heroSection: {
    paddingTop: THEME.spacing[20],
    paddingHorizontal: THEME.spacing[16],
  },

  heroImage: {
    height: 240,
    width: '100%',
    overflow: 'hidden',
    borderRadius: 24,
    backgroundColor: THEME.colors.surface,
  },

  heroImageRadius: {
    borderRadius: 24,
  },

  heroFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 140,
  },

  backButton: {
    position: 'absolute',
    top: 14,
    left: 14,
    height: 40,
    width: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },

  headerCopy: {
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[12],
    paddingBottom: THEME.spacing[16],
    alignItems: 'center',
    gap: THEME.spacing[8],
  },

  title: {
    fontSize: 28,
    fontWeight: '900',
    color: THEME.colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.6,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
  },

  card: {
    marginTop: THEME.spacing[8],
    marginHorizontal: THEME.spacing[16],
    backgroundColor: THEME.colors.white,
    borderRadius: 24,
    padding: THEME.spacing[16],
    borderWidth: 1,
    borderColor: 'rgba(15,81,50,0.10)',
    shadowColor: '#0B3D2C',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.10,
    shadowRadius: 26,
    elevation: 10,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginBottom: THEME.spacing[12],
  },

  inputContainer: {
    flex: 1,
    marginBottom: 0,
    minHeight: 52,
    borderRadius: 18,
  },

  input: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    fontSize: 16,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: THEME.spacing[16],
    marginBottom: THEME.spacing[24],
  },

  infoText: {
    flex: 1,
    fontSize: 13,
    color: THEME.colors.textSecondary,
    lineHeight: 18,
  },

  button: {
    borderRadius: 18,
    minHeight: 56,
  },
  skipBtn: {
    marginTop: THEME.spacing[12],
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  skipPressed: {
    opacity: 0.75,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
    textDecorationLine: 'underline',
  },

  clearButton: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: THEME.colors.surface,
  },
});
