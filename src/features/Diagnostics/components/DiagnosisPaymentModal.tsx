import React from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { THEME } from '@/constants/theme';
import { DIAGNOSIS_THEME, hexToRgba } from '../constants/diagnosisTheme';

export interface DiagnosisPaymentModalProps {
  visible: boolean;
  packTitle: string;
  amountRupees: number;
  walletBalanceRupees: number | null;
  canPayWithWallet: boolean;
  payingWith: 'razorpay' | 'wallet' | null;
  isBusy: boolean;
  onClose: () => void;
  onPayRazorpay: () => void;
  onPayWallet: () => void;
}

interface PaymentOptionProps {
  icon: string;
  iconBg: string;
  title: string;
  subtitle: string;
  disabled: boolean;
  loading: boolean;
  onPress: () => void;
}

function PaymentOptionCard({
  icon,
  iconBg,
  title,
  subtitle,
  disabled,
  loading,
  onPress,
}: PaymentOptionProps): React.ReactElement {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.optionCard,
        disabled && styles.optionCardDisabled,
        pressed && !disabled ? styles.optionCardPressed : null,
      ]}
    >
      <View style={[styles.optionIconWrap, { backgroundColor: iconBg }]}>
        {loading ? (
          <ActivityIndicator size="small" color={DIAGNOSIS_THEME.brandPrimary} />
        ) : (
          <Ionicons
            name={icon as React.ComponentProps<typeof Ionicons>['name']}
            size={22}
            color={DIAGNOSIS_THEME.brandPrimary}
          />
        )}
      </View>
      <View style={styles.optionTextCol}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
    </Pressable>
  );
}

export function DiagnosisPaymentModal(props: DiagnosisPaymentModalProps): React.ReactElement {
  const insets = useSafeAreaInsets();
  const {
    visible,
    packTitle,
    amountRupees,
    walletBalanceRupees,
    canPayWithWallet,
    payingWith,
    isBusy,
    onClose,
    onPayRazorpay,
    onPayWallet,
  } = props;

  const amountLabel = `₹${amountRupees.toLocaleString('en-IN')}`;
  const walletDisabled = isBusy || !canPayWithWallet;
  const razorpayDisabled = isBusy;

  const handleBackdropPress = (): void => {
    if (isBusy) {
      return;
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      presentationStyle="overFullScreen"
      onRequestClose={handleBackdropPress}
    >
      <View style={styles.overlay}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close payment options"
          style={styles.backdropPressable}
          onPress={handleBackdropPress}
          disabled={isBusy}
        />

        <View style={[styles.sheetWrap, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <View style={styles.sheet}>
            <View style={styles.handle} />

            <View style={styles.sheetHeader}>
              <View style={styles.headerTextCol}>
                <Text style={styles.eyebrow}>Payment</Text>
                <Text style={styles.title}>Choose payment method</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close"
                onPress={handleBackdropPress}
                disabled={isBusy}
                hitSlop={10}
                style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}
              >
                <Ionicons name="close" size={20} color={DIAGNOSIS_THEME.textSecondary} />
              </Pressable>
            </View>

            <LinearGradient
              colors={[
                hexToRgba(DIAGNOSIS_THEME.heroAccent, 0.14),
                hexToRgba(DIAGNOSIS_THEME.brandPrimary, 0.08),
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.amountCard}
            >
              <View style={styles.amountCardTop}>
                <View style={styles.packIconWrap}>
                  <Ionicons name="medkit-outline" size={20} color={DIAGNOSIS_THEME.brandPrimary} />
                </View>
                <View style={styles.amountTextCol}>
                  <Text style={styles.packLabel} numberOfLines={2}>
                    {packTitle}
                  </Text>
                  <Text style={styles.amountHint}>Diagnostic pack</Text>
                </View>
              </View>
              <Text style={styles.amountValue}>{amountLabel}</Text>
            </LinearGradient>

            <Text style={styles.optionsLabel}>Pay with</Text>

            <PaymentOptionCard
              icon="card-outline"
              iconBg={hexToRgba(DIAGNOSIS_THEME.heroAccent, 0.12)}
              title="Razorpay"
              subtitle="UPI, cards, netbanking & more"
              disabled={razorpayDisabled}
              loading={payingWith === 'razorpay'}
              onPress={onPayRazorpay}
            />

            <PaymentOptionCard
              icon="wallet-outline"
              iconBg={hexToRgba(DIAGNOSIS_THEME.brandPrimary, 0.12)}
              title="Biz Wallet"
              subtitle={
                canPayWithWallet
                  ? 'Instant debit from your wallet'
                  : 'Insufficient balance for this pack'
              }
              disabled={walletDisabled}
              loading={payingWith === 'wallet'}
              onPress={onPayWallet}
            />

            <View style={styles.walletInfoCard}>
              <Ionicons name="information-circle-outline" size={18} color={DIAGNOSIS_THEME.brandPrimary} />
              <Text style={styles.walletInfoText}>
                Wallet balance:{' '}
                {walletBalanceRupees == null ? (
                  <Text style={styles.walletInfoValue}>Loading…</Text>
                ) : (
                  <Text style={styles.walletInfoValue}>
                    ₹{walletBalanceRupees.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </Text>
                )}
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cancel"
              onPress={handleBackdropPress}
              disabled={isBusy}
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && !isBusy ? styles.cancelButtonPressed : null,
                isBusy && styles.cancelButtonDisabled,
              ]}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.58)',
  },
  backdropPressable: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetWrap: {
    width: '100%',
    zIndex: 2,
  },
  sheet: {
    backgroundColor: DIAGNOSIS_THEME.contentBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: THEME.spacing[20],
    paddingTop: THEME.spacing[8],
    shadowColor: DIAGNOSIS_THEME.shadow,
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 12,
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    marginBottom: THEME.spacing[12],
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing[16],
    gap: 12,
  },
  headerTextCol: {
    flex: 1,
    gap: 4,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    color: DIAGNOSIS_THEME.heroAccent,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: DIAGNOSIS_THEME.textPrimary,
    letterSpacing: -0.3,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DIAGNOSIS_THEME.pageBg,
    borderWidth: 1,
    borderColor: DIAGNOSIS_THEME.border,
  },
  closeBtnPressed: {
    opacity: 0.8,
  },
  amountCard: {
    borderRadius: 16,
    padding: THEME.spacing[16],
    marginBottom: THEME.spacing[18],
    borderWidth: 1,
    borderColor: hexToRgba(DIAGNOSIS_THEME.heroAccent, 0.2),
  },
  amountCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  packIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: DIAGNOSIS_THEME.contentBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountTextCol: {
    flex: 1,
    gap: 2,
  },
  packLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: DIAGNOSIS_THEME.textPrimary,
    letterSpacing: -0.2,
  },
  amountHint: {
    fontSize: 12,
    color: DIAGNOSIS_THEME.textSecondary,
    fontWeight: '600',
  },
  amountValue: {
    fontSize: 28,
    fontWeight: '900',
    color: DIAGNOSIS_THEME.brandPrimary,
    letterSpacing: -0.5,
  },
  optionsLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: DIAGNOSIS_THEME.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: THEME.spacing[10],
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
    backgroundColor: DIAGNOSIS_THEME.pageBg,
    marginBottom: 10,
    shadowColor: DIAGNOSIS_THEME.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 1,
  },
  optionCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  optionCardDisabled: {
    opacity: 0.52,
  },
  optionIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTextCol: {
    flex: 1,
    gap: 2,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: DIAGNOSIS_THEME.textPrimary,
  },
  optionSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    color: DIAGNOSIS_THEME.textSecondary,
  },
  walletInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    marginBottom: THEME.spacing[14],
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: hexToRgba(DIAGNOSIS_THEME.brandPrimary, 0.06),
    borderWidth: 1,
    borderColor: hexToRgba(DIAGNOSIS_THEME.brandPrimary, 0.1),
  },
  walletInfoText: {
    flex: 1,
    fontSize: 13,
    color: DIAGNOSIS_THEME.textSecondary,
    lineHeight: 18,
  },
  walletInfoValue: {
    fontWeight: '800',
    color: DIAGNOSIS_THEME.textPrimary,
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: DIAGNOSIS_THEME.border,
    backgroundColor: DIAGNOSIS_THEME.contentBg,
    marginBottom: THEME.spacing[4],
  },
  cancelButtonPressed: {
    backgroundColor: DIAGNOSIS_THEME.pageBg,
  },
  cancelButtonDisabled: {
    opacity: 0.6,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: DIAGNOSIS_THEME.textSecondary,
  },
});
