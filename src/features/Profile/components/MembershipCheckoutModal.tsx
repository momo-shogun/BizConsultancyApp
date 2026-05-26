import React from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { THEME } from '@/constants/theme';
import { Dropdown } from '@/shared/components/dropdown/dropdown';

import type { UseMembershipPurchaseResult } from '../hooks/useMembershipPurchase';

import { styles } from './MembershipCheckoutModal.styles';

export interface MembershipCheckoutModalProps {
  purchase: UseMembershipPurchaseResult;
}

function formatRupee(value: number): string {
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

export function MembershipCheckoutModal(props: MembershipCheckoutModalProps): React.ReactElement {
  const { purchase } = props;
  const insets = useSafeAreaInsets();
  const plan = purchase.selectedPlan;

  if (plan == null) {
    return <></>;
  }

  return (
    <Modal
      visible={purchase.checkoutVisible}
      transparent
      animationType="slide"
      onRequestClose={purchase.closeCheckout}
    >
      <Pressable
        style={styles.backdrop}
        onPress={purchase.closeCheckout}
        accessibilityRole="button"
        accessibilityLabel="Close checkout"
      />
      <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <View style={styles.handle} />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {!purchase.paymentStepVisible ? (
            <>
              <Text style={styles.title}>Complete your purchase</Text>
              <Text style={styles.subtitle}>
                {plan.name} · {formatRupee(plan.amount)} · {plan.days > 0 ? `${plan.days} days` : 'Plan validity'}
              </Text>

              <View style={styles.fieldBlock}>
                <Text style={styles.fieldLabel}>Business category</Text>
                <Dropdown
                  data={purchase.categoryOptions}
                  labelField="label"
                  valueField="value"
                  placeholder="Select category"
                  value={purchase.categoryId || null}
                  onChange={(item) => {
                    if (item != null && typeof item.value === 'string') {
                      purchase.setCategoryId(item.value);
                    }
                  }}
                  error={purchase.categoryError != null}
                  disable={purchase.categoriesLoading || purchase.isBusy}
                />
                {purchase.categoryError != null ? (
                  <Text style={styles.fieldError}>{purchase.categoryError}</Text>
                ) : null}
              </View>

              <View style={styles.fieldBlock}>
                <Text style={styles.fieldLabel}>Business segment</Text>
                <Dropdown
                  data={purchase.segmentOptions}
                  labelField="label"
                  valueField="value"
                  placeholder={
                    purchase.categoryId.length === 0
                      ? 'Select category first'
                      : 'Select segment'
                  }
                  value={purchase.segmentId || null}
                  onChange={(item) => {
                    if (item != null && typeof item.value === 'string') {
                      purchase.setSegmentId(item.value);
                    }
                  }}
                  error={purchase.segmentError != null}
                  disable={
                    purchase.categoryId.length === 0 ||
                    purchase.segmentsLoading ||
                    purchase.isBusy
                  }
                />
                {purchase.segmentError != null ? (
                  <Text style={styles.fieldError}>{purchase.segmentError}</Text>
                ) : null}
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Continue to payment"
                disabled={purchase.isBusy}
                onPress={purchase.proceedToPayment}
                style={({ pressed }) => [
                  styles.primaryBtn,
                  pressed ? styles.primaryBtnPressed : null,
                  purchase.isBusy ? styles.primaryBtnDisabled : null,
                ]}
              >
                <Text style={styles.primaryBtnText}>Continue to payment</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back to business details"
                onPress={purchase.backToDetails}
                disabled={purchase.isBusy}
                style={styles.backLink}
              >
                <Text style={styles.backLinkText}>← Back</Text>
              </Pressable>

              <Text style={styles.title}>Choose payment method</Text>
              <Text style={styles.subtitle}>
                {plan.name} · {formatRupee(purchase.amountRupees)}
              </Text>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Pay with Razorpay"
                disabled={purchase.isBusy}
                onPress={() => void purchase.payWithRazorpay()}
                style={({ pressed }) => [
                  styles.optionRow,
                  pressed && !purchase.isBusy ? styles.optionPressed : null,
                  purchase.isBusy && purchase.payingWith !== 'razorpay'
                    ? styles.optionDisabled
                    : null,
                ]}
              >
                {purchase.payingWith === 'razorpay' ? (
                  <ActivityIndicator size="small" color={THEME.colors.primary} />
                ) : (
                  <Ionicons name="card-outline" size={22} color={THEME.colors.primary} />
                )}
                <Text style={styles.optionText}>Pay with Razorpay</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Pay with wallet"
                disabled={purchase.isBusy || !purchase.canPayWithWallet}
                onPress={() => void purchase.payWithWallet()}
                style={({ pressed }) => [
                  styles.optionRow,
                  pressed && purchase.canPayWithWallet && !purchase.isBusy
                    ? styles.optionPressed
                    : null,
                  (!purchase.canPayWithWallet ||
                    (purchase.isBusy && purchase.payingWith !== 'wallet')) &&
                    styles.optionDisabled,
                ]}
              >
                {purchase.payingWith === 'wallet' ? (
                  <ActivityIndicator size="small" color={THEME.colors.primary} />
                ) : (
                  <Ionicons name="wallet-outline" size={22} color={THEME.colors.primary} />
                )}
                <Text style={styles.optionText}>Pay with Wallet</Text>
              </Pressable>

              <Text style={styles.balanceHint}>
                Wallet balance:{' '}
                {purchase.walletBalanceRupees == null ? (
                  'Loading…'
                ) : (
                  <Text style={styles.balanceValue}>
                    ₹{purchase.walletBalanceRupees.toFixed(2)}
                  </Text>
                )}
              </Text>
              {purchase.walletBalanceRupees != null && !purchase.canPayWithWallet ? (
                <Text style={styles.insufficientHint}>
                  Wallet balance is insufficient for this membership.
                </Text>
              ) : null}
            </>
          )}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cancel"
            onPress={purchase.closeCheckout}
            disabled={purchase.isBusy}
            style={({ pressed }) => [styles.cancelButton, pressed ? styles.optionPressed : null]}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </ScrollView>
      </View>
    </Modal>
  );
}
