import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import { formatWalletBalanceInr } from '@/features/Home/api/userWalletsApi';
import { CONSULTANT_WALLET_GRADIENT } from '@/features/Wallet/constants/consultantWalletTheme';
import { consultantWalletStyles as styles } from '@/features/Wallet/screens/consultantWallet.styles';

export interface ConsultantWalletBalanceHeroProps {
  balance: number | undefined;
  isLoading?: boolean;
  isFetching?: boolean;
  onRefresh?: () => void;
  hint?: string;
  showPills?: boolean;
  /** Renders inside green AccountHub header (no nested gradient card) */
  embeddedInHeader?: boolean;
}

export function ConsultantWalletBalanceHero({
  balance,
  isLoading = false,
  isFetching = false,
  onRefresh,
  hint = 'Earnings from consultations and services. Withdraw to your linked bank account.',
  showPills = true,
  embeddedInHeader = false,
}: ConsultantWalletBalanceHeroProps): React.ReactElement {
  const balanceLabel =
    isLoading && balance == null ? '…' : formatWalletBalanceInr(balance ?? 0);

  const body = (
    <View style={embeddedInHeader ? styles.headerBalanceInner : styles.balanceCardInner}>
      <View style={styles.balanceTop}>
        <View style={styles.balanceTextBlock}>
          <Text style={styles.balanceLabel}>Available balance</Text>
          {isLoading && balance == null ? (
            <ActivityIndicator color="#FFFFFF" style={styles.balanceLoader} />
          ) : (
            <Text
              style={[
                styles.balanceAmount,
                embeddedInHeader ? styles.balanceAmountHeader : null,
              ]}
            >
              {balanceLabel}
            </Text>
          )}
        </View>

        <View style={styles.balanceActions}>
          {onRefresh != null ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Refresh balance"
              onPress={onRefresh}
              style={styles.refreshBtnInline}
            >
              {isFetching ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="refresh-outline" size={20} color="#FFFFFF" />
              )}
            </Pressable>
          ) : null}
          {!embeddedInHeader ? (
            <View style={styles.balanceIconWrap}>
              <Ionicons name="wallet-outline" size={24} color="#FFFFFF" />
            </View>
          ) : null}
        </View>
      </View>

      {showPills && !embeddedInHeader ? (
        <View style={styles.balancePills}>
          <View style={styles.balancePill}>
            <Ionicons name="shield-checkmark-outline" size={12} color="#D1FAE5" />
            <Text style={styles.balancePillText}>Secure wallet</Text>
          </View>
          <View style={styles.balancePill}>
            <Ionicons name="trending-up-outline" size={12} color="#D1FAE5" />
            <Text style={styles.balancePillText}>Expert earnings</Text>
          </View>
        </View>
      ) : null}

      {hint.length > 0 ? (
        <Text style={[styles.balanceHint, embeddedInHeader ? styles.balanceHintHeader : null]}>
          {hint}
        </Text>
      ) : null}
    </View>
  );

  if (embeddedInHeader) {
    return <View style={styles.headerBalanceShell}>{body}</View>;
  }

  return (
    <LinearGradient
      colors={[...CONSULTANT_WALLET_GRADIENT]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.balanceCard}
    >
      {body}
    </LinearGradient>
  );
}
