import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

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

const WALLET_CANVAS = '#F4F7FB';

const QUICK_AMOUNTS = [500, 1000, 2000, 5000];

export function WalletScreen(): React.ReactElement {
  const { data: balance, isLoading, isFetching, refetch } =
    useGetMyWalletBalanceQuery();

  const {
    amountInput,
    setAmountInput,
    isProceeding,
    handleAddBalance,
  } = useWalletTopup();

  const balanceLabel =
    isLoading && balance == null
      ? '₹0'
      : formatWalletBalanceInr(balance ?? 0);

  return (
    <AccountHubScreenShell
      title="Biz Wallet"
      onBackPress={() => navigationRef.goBack()}
      canvasColor={WALLET_CANVAS}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Wallet Balance Card */}
        <LinearGradient
          colors={['#111827', '#1F2937', '#374151']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceCard}
        >
          <View style={styles.balanceTopRow}>
            <View style={styles.walletBadge}>
              <Ionicons name="wallet-outline" size={18} color="#FFFFFF" />
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => void refetch()}
              style={styles.refreshButton}
            >
              {isFetching ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons
                  name="refresh-outline"
                  size={18}
                  color="#FFFFFF"
                />
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.balanceLabel}>Available Balance</Text>

          {isLoading && balance == null ? (
            <ActivityIndicator
              size="large"
              color="#FFFFFF"
              style={styles.balanceLoader}
            />
          ) : (
            <Text style={styles.balanceAmount}>{balanceLabel}</Text>
          )}

          <View style={styles.balanceFooter}>
            <Ionicons
              name="shield-checkmark-outline"
              size={14}
              color="#D1FAE5"
            />
            <Text style={styles.balanceFooterText}>
              Secure & instant wallet top-up
            </Text>
          </View>
        </LinearGradient>

        {/* Add Money Section */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Add Money</Text>

            <View style={styles.limitBadge}>
              <Text style={styles.limitBadgeText}>
                ₹{WALLET_TOPUP_MIN_AMOUNT} - ₹
                {WALLET_TOPUP_MAX_AMOUNT.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.currencyContainer}>
              <Text style={styles.currency}>₹</Text>
            </View>

            <TextInput
              value={amountInput}
              onChangeText={setAmountInput}
              keyboardType="numeric"
              placeholder="Enter amount"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              editable={!isProceeding}
            />
          </View>

          {/* Quick Amounts */}
          <View style={styles.quickAmountContainer}>
            {QUICK_AMOUNTS.map(item => {
              const isSelected = amountInput === String(item);

              return (
                <TouchableOpacity
                  key={item}
                  activeOpacity={0.85}
                  style={[
                    styles.quickAmountChip,
                    isSelected && styles.quickAmountChipActive,
                  ]}
                  onPress={() => setAmountInput(String(item))}
                >
                  <Text
                    style={[
                      styles.quickAmountText,
                      isSelected && styles.quickAmountTextActive,
                    ]}
                  >
                    ₹{item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            activeOpacity={0.9}
            style={[
              styles.addButton,
              isProceeding && styles.addButtonDisabled,
            ]}
            disabled={isProceeding}
            onPress={() => void handleAddBalance()}
          >
            {isProceeding ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons
                  name="add-circle-outline"
                  size={18}
                  color="#FFFFFF"
                />

                <Text style={styles.addButtonText}>Add Balance</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Menu Card */}
        <View style={styles.card}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.optionRow}
            onPress={() => {
              if (navigationRef.isReady()) {
                navigationRef.navigate(ROUTES.Root.WalletTransactions);
              }
            }}
          >
            <View style={styles.optionLeft}>
              <View style={styles.optionIconContainer}>
                <Ionicons
                  name="receipt-outline"
                  size={20}
                  color="#059669"
                />
              </View>

              <View>
                <Text style={styles.optionTitle}>Transactions</Text>
                <Text style={styles.optionSubtitle}>
                  View wallet history & payments
                </Text>
              </View>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#94A3B8"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AccountHubScreenShell>
  );
}

export default WalletScreen;
// REDUCE SPACING + HEIGHTS ONLY
// keep your current improved UI and replace these styles

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },

  balanceCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },

  balanceTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  walletBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  balanceLabel: {
    color: '#D1D5DB',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 6,
  },

  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },

  balanceLoader: {
    marginVertical: 8,
  },

  balanceFooter: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  balanceFooterText: {
    marginLeft: 6,
    color: '#D1FAE5',
    fontSize: 12,
    fontWeight: '500',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,

    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  limitBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 999,
  },

  limitBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },

  inputWrapper: {
    height: 56,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  currencyContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  currency: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },

  input: {
    flex: 1,
    fontSize: 20,
    color: '#111827',
    fontWeight: '700',
    padding: 0,
  },

  quickAmountContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 14,
    marginBottom: 18,
  },

  quickAmountChip: {
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
  },

  quickAmountChipActive: {
    backgroundColor: '#059669',
  },

  quickAmountText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },

  quickAmountTextActive: {
    color: '#FFFFFF',
  },

  addButton: {
    height: 50,
    borderRadius: 16,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',

    shadowColor: '#059669',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },

  addButtonDisabled: {
    opacity: 0.65,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginLeft: 6,
  },

  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  optionIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  optionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },

  optionSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 1,
  },
});