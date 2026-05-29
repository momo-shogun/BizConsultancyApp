import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  ACCOUNT_HUB_GREEN_HEADER_GRADIENT,
  ACCOUNT_HUB_GREEN_HEADER_STATUS_BAR,
} from '@/constants/accountScreenTheme';
import {
  formatWalletBalanceInr,
  useGetMyWalletBalanceQuery,
} from '@/features/Home/api/userWalletsApi';
import { useWalletTopup } from '@/features/Wallet/hooks/useWalletTopup';
import {
  WALLET_TOPUP_MAX_AMOUNT,
  WALLET_TOPUP_MIN_AMOUNT,
} from '@/features/Wallet/utils/walletTransactionUtils';
import { navigationRef } from '@/navigation/RootNavigator';
import { ROUTES } from '@/navigation/routeNames';
import { AccountHubScreenShell } from '@/shared/components';

import { styles, WALLET_CANVAS } from './WalletScreen.styles';

const QUICK_AMOUNTS = [500, 1000, 2000, 5000];

export function WalletScreen(): React.ReactElement {
  const { data: balance, isLoading, isFetching, refetch } = useGetMyWalletBalanceQuery();
  const [amountFocused, setAmountFocused] = useState(false);

  const { amountInput, setAmountInput, isProceeding, handleAddBalance } = useWalletTopup();

  const balanceLabel =
    isLoading && balance == null ? '₹0' : formatWalletBalanceInr(balance ?? 0);

  const headerBalance = (
    <View style={styles.headerBalanceShell}>
      <View style={styles.headerBalanceTop}>
        <View style={styles.headerBalanceText}>
          <Text style={styles.headerBalanceLabel}>Available balance</Text>
          {isLoading && balance == null ? (
            <ActivityIndicator color="#FFFFFF" style={styles.headerBalanceLoader} />
          ) : (
            <Text style={styles.headerBalanceAmount}>{balanceLabel}</Text>
          )}
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Refresh balance"
          onPress={() => void refetch()}
          style={styles.headerRefreshBtn}
        >
          {isFetching ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons name="refresh-outline" size={20} color="#FFFFFF" />
          )}
        </Pressable>
      </View>
      <Text style={styles.headerBalanceHint}>Secure instant top-up for bookings and services</Text>
    </View>
  );

  return (
    <AccountHubScreenShell
      title="Biz Wallet"
      onBackPress={() => navigationRef.goBack()}
      canvasColor={WALLET_CANVAS}
      headerColor={ACCOUNT_HUB_GREEN_HEADER_STATUS_BAR}
      headerGradientColors={ACCOUNT_HUB_GREEN_HEADER_GRADIENT}
      headerAccessory={headerBalance}
    >
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.contentSheet}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add money</Text>
            <Text style={styles.sectionMeta}>
              Min ₹{WALLET_TOPUP_MIN_AMOUNT} · Max ₹{WALLET_TOPUP_MAX_AMOUNT.toLocaleString('en-IN')}
            </Text>

            <View style={[styles.inputRow, amountFocused ? styles.inputRowFocused : null]}>
              <Text style={styles.currency}>₹</Text>
              <TextInput
                value={amountInput}
                onChangeText={setAmountInput}
                keyboardType="numeric"
                placeholder="Enter amount"
                placeholderTextColor="#B0B0B0"
                style={styles.input}
                editable={!isProceeding}
                onFocus={() => setAmountFocused(true)}
                onBlur={() => setAmountFocused(false)}
                accessibilityLabel="Top-up amount"
              />
            </View>

            <View style={styles.quickRow}>
              {QUICK_AMOUNTS.map((item) => {
                const isSelected = amountInput === String(item);
                return (
                  <Pressable
                    key={item}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => setAmountInput(String(item))}
                    style={[styles.quickChip, isSelected ? styles.quickChipActive : null]}
                  >
                    <Text
                      style={[
                        styles.quickChipText,
                        isSelected ? styles.quickChipTextActive : null,
                      ]}
                    >
                      ₹{item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              accessibilityRole="button"
              disabled={isProceeding}
              onPress={() => void handleAddBalance()}
              style={({ pressed }) => [
                styles.addButton,
                isProceeding ? styles.addButtonDisabled : null,
                pressed && !isProceeding ? styles.addButtonPressed : null,
              ]}
            >
              {isProceeding ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.addButtonText}>Add balance</Text>
                </>
              )}
            </Pressable>
          </View>

          <Text style={styles.sectionTitle}>More</Text>
          <View style={styles.menuBlock}>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                if (navigationRef.isReady()) {
                  navigationRef.navigate(ROUTES.Root.WalletTransactions);
                }
              }}
              style={({ pressed }) => [styles.menuRow, pressed ? styles.menuRowPressed : null]}
            >
              <View style={styles.menuIcon}>
                <Ionicons name="receipt-outline" size={20} color="#059669" />
              </View>
              <View style={styles.menuBody}>
                <Text style={styles.menuTitle}>Transactions</Text>
                <Text style={styles.menuSubtitle}>Wallet history and payments</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </AccountHubScreenShell>
  );
}

export default WalletScreen;
