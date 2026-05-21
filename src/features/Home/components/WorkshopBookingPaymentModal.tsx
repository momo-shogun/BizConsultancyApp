import React from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { THEME } from '@/constants/theme';

const COLORS = {
  white: '#FFFFFF',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  surface: '#F8FAFC',
} as const;

export interface WorkshopBookingPaymentModalProps {
  visible: boolean;
  workshopName: string;
  amountRupees: number;
  walletBalanceRupees: number | null;
  canPayWithWallet: boolean;
  payingWith: 'razorpay' | 'wallet' | null;
  isBusy: boolean;
  onClose: () => void;
  onPayRazorpay: () => void;
  onPayWallet: () => void;
}

export function WorkshopBookingPaymentModal(
  props: WorkshopBookingPaymentModalProps,
): React.ReactElement {
  const insets = useSafeAreaInsets();
  const {
    visible,
    workshopName,
    amountRupees,
    walletBalanceRupees,
    canPayWithWallet,
    payingWith,
    isBusy,
    onClose,
    onPayRazorpay,
    onPayWallet,
  } = props;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close payment options" />
      <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <View style={styles.handle} />
        <Text style={styles.title}>Choose payment method</Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {workshopName} · ₹{amountRupees.toLocaleString('en-IN')}
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Pay with Razorpay"
          disabled={isBusy}
          onPress={onPayRazorpay}
          style={({ pressed }) => [
            styles.optionRow,
            pressed && !isBusy ? styles.optionPressed : null,
            isBusy && payingWith !== 'razorpay' ? styles.optionDisabled : null,
          ]}
        >
          {payingWith === 'razorpay' ? (
            <ActivityIndicator size="small" color={THEME.colors.primary} />
          ) : (
            <Ionicons name="card-outline" size={22} color={THEME.colors.primary} />
          )}
          <Text style={styles.optionText}>Pay with Razorpay</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Pay with wallet"
          disabled={isBusy || !canPayWithWallet}
          onPress={onPayWallet}
          style={({ pressed }) => [
            styles.optionRow,
            pressed && canPayWithWallet && !isBusy ? styles.optionPressed : null,
            (!canPayWithWallet || (isBusy && payingWith !== 'wallet')) && styles.optionDisabled,
          ]}
        >
          {payingWith === 'wallet' ? (
            <ActivityIndicator size="small" color={THEME.colors.primary} />
          ) : (
            <Ionicons name="wallet-outline" size={22} color={THEME.colors.primary} />
          )}
          <Text style={styles.optionText}>Pay with Wallet</Text>
        </Pressable>

        <Text style={styles.balanceHint}>
          Wallet balance:{' '}
          {walletBalanceRupees == null ? (
            'Loading…'
          ) : (
            <Text style={styles.balanceValue}>₹{walletBalanceRupees.toFixed(2)}</Text>
          )}
        </Text>
        {walletBalanceRupees != null && !canPayWithWallet ? (
          <Text style={styles.insufficientHint}>
            Wallet balance is insufficient for this workshop.
          </Text>
        ) : null}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cancel"
          onPress={onClose}
          disabled={isBusy}
          style={({ pressed }) => [styles.cancelButton, pressed && styles.optionPressed]}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    marginBottom: 10,
  },
  optionPressed: {
    opacity: 0.85,
  },
  optionDisabled: {
    opacity: 0.5,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  balanceHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    marginBottom: 4,
  },
  balanceValue: {
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  insufficientHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 8,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
});
