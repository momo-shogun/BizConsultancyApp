import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Dialog } from '@/shared/components/dialog';

export interface ServiceOnboardingSuccessDialogProps {
  visible: boolean;
  onDone: () => void;
}

export function ServiceOnboardingSuccessDialog({
  visible,
  onDone,
}: ServiceOnboardingSuccessDialogProps): React.ReactElement {
  return (
    <Dialog
      visible={visible}
      onClose={onDone}
      variant="success"
      title="Registration complete"
      description="Your registration details have been received successfully."
      dismissible={false}
      closeOnBackdrop={false}
      actions={[{ label: 'Done', onPress: onDone }]}
    />
  );
}

interface PaymentMethodOptionProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  subtitle: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

function PaymentMethodOption({
  icon,
  title,
  subtitle,
  onPress,
  disabled = false,
  loading = false,
}: PaymentMethodOptionProps): React.ReactElement {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.optionCard,
        (pressed || disabled) && styles.optionCardPressed,
        disabled && styles.optionCardDisabled,
      ]}
    >
      <View style={styles.optionIconWrap}>
        {loading ? (
          <ActivityIndicator size="small" color="#0B3B66" />
        ) : (
          <Ionicons name={icon} size={22} color="#0B3B66" />
        )}
      </View>
      <View style={styles.optionTextBlock}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
    </Pressable>
  );
}

export interface ServiceOnboardingPaymentDialogProps {
  visible: boolean;
  amountLabel: string;
  canWallet: boolean;
  isWalletLoading: boolean;
  walletHint: string | null;
  onClose: () => void;
  onRazorpay: () => void;
  onWallet: () => void;
}

export function ServiceOnboardingPaymentDialog({
  visible,
  amountLabel,
  canWallet,
  isWalletLoading,
  walletHint,
  onClose,
  onRazorpay,
  onWallet,
}: ServiceOnboardingPaymentDialogProps): React.ReactElement {
  return (
    <Dialog
      visible={visible}
      onClose={onClose}
      variant="default"
      title="Choose payment method"
      description={`Pay ${amountLabel} to complete your registration.`}
      dismissible
      closeOnBackdrop
      actions={[{ label: 'Cancel', variant: 'ghost', onPress: onClose }]}
    >
      <View style={styles.paymentOptions}>
        <PaymentMethodOption
          icon="card-outline"
          title="Pay with Razorpay"
          subtitle="UPI, cards, netbanking & more"
          onPress={onRazorpay}
        />
        {canWallet ? (
          <PaymentMethodOption
            icon="wallet-outline"
            title="Pay with Wallet"
            subtitle="Use your available wallet balance"
            onPress={onWallet}
            loading={isWalletLoading}
          />
        ) : null}
        {walletHint != null && walletHint.length > 0 ? (
          <Text style={styles.walletHint}>{walletHint}</Text>
        ) : null}
      </View>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  paymentOptions: {
    width: '100%',
    gap: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FAFCFE',
  },
  optionCardPressed: {
    opacity: 0.88,
    backgroundColor: '#F1F5F9',
  },
  optionCardDisabled: {
    opacity: 0.55,
  },
  optionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTextBlock: {
    flex: 1,
    gap: 2,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B3258',
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  walletHint: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
});
