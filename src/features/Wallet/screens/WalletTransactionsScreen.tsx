import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  SectionList,
  Text,
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
import { useGetMyWalletTransactionsQuery } from '@/features/Wallet/api/walletApi';
import { WalletTransactionCard } from '@/features/Wallet/components/WalletTransactionCard';
import type { WalletTransaction, WalletTransactionSection } from '@/features/Wallet/types/wallet.types';
import { groupWalletTransactionsByDate } from '@/features/Wallet/utils/walletTransactionUtils';
import { navigationRef } from '@/navigation/RootNavigator';
import { AccountHubScreenShell } from '@/shared/components';

import { styles as walletStyles, WALLET_CANVAS } from './WalletScreen.styles';
import { styles } from './WalletTransactionsScreen.styles';

const PAGE_SIZE = 20;

export function WalletTransactionsScreen(): React.ReactElement {
  const [page, setPage] = useState(1);

  const {
    data: balance,
    isLoading: isBalanceLoading,
    isFetching: isBalanceFetching,
    refetch: refetchBalance,
  } = useGetMyWalletBalanceQuery();
  const { data, isLoading, isFetching, isError, refetch } = useGetMyWalletTransactionsQuery({
    page,
    limit: PAGE_SIZE,
  });

  const transactions = data?.data ?? [];
  const meta = data?.meta ?? { total: 0, page: 1, limit: PAGE_SIZE, totalPages: 1 };

  const sections = useMemo(
    (): WalletTransactionSection[] => groupWalletTransactionsByDate(transactions),
    [transactions],
  );

  const balanceLabel =
    isBalanceLoading && balance == null ? '₹0' : formatWalletBalanceInr(balance ?? 0);

  const balanceHint = `${meta.total} transaction${meta.total === 1 ? '' : 's'} on record`;

  const headerBalance = (
    <View style={walletStyles.headerBalanceShell}>
      <View style={walletStyles.headerBalanceTop}>
        <View style={walletStyles.headerBalanceText}>
          <Text style={walletStyles.headerBalanceLabel}>Available balance</Text>
          {isBalanceLoading && balance == null ? (
            <ActivityIndicator color="#FFFFFF" style={walletStyles.headerBalanceLoader} />
          ) : (
            <Text style={walletStyles.headerBalanceAmount}>{balanceLabel}</Text>
          )}
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Refresh balance"
          onPress={() => void refetchBalance()}
          style={walletStyles.headerRefreshBtn}
        >
          {isBalanceFetching ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons name="refresh-outline" size={20} color="#FFFFFF" />
          )}
        </Pressable>
      </View>
      <Text style={walletStyles.headerBalanceHint}>{balanceHint}</Text>
    </View>
  );

  const shellProps = {
    title: 'Transactions',
    onBackPress: () => navigationRef.goBack(),
    canvasColor: WALLET_CANVAS,
    headerColor: ACCOUNT_HUB_GREEN_HEADER_STATUS_BAR,
    headerGradientColors: ACCOUNT_HUB_GREEN_HEADER_GRADIENT,
    headerAccessory: headerBalance,
  } as const;

  const renderSectionHeader = useCallback(
    ({ section }: { section: WalletTransactionSection }) => {
      const isFirst = sections[0]?.title === section.title;
      return (
        <Text
          style={[styles.sectionTitle, isFirst ? styles.sectionTitleFirst : null]}
        >
          {section.title}
        </Text>
      );
    },
    [sections],
  );

  const renderItem = useCallback(
    ({ item }: { item: WalletTransaction }) => <WalletTransactionCard item={item} />,
    [],
  );

  const keyExtractor = useCallback((item: WalletTransaction): string => String(item.id), []);

  const ItemSeparator = useCallback(
    (): React.ReactElement => <View style={styles.itemGap} />,
    [],
  );

  const listHeader = useMemo(
    (): React.ReactElement => (
      <View style={styles.listHeader}>
        <Text style={styles.listHeaderTitle}>Recent activity</Text>
        <Text style={styles.listHeaderMeta}>
          Page {meta.page} of {Math.max(meta.totalPages, 1)}
        </Text>
      </View>
    ),
    [meta.page, meta.totalPages],
  );

  const listFooter = useMemo((): React.ReactElement => {
    if (meta.totalPages <= 1) {
      return <View style={styles.footerSpace} />;
    }
    return (
      <View style={styles.pagination}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Previous page"
          disabled={page <= 1 || isFetching}
          onPress={() => setPage((p) => Math.max(1, p - 1))}
          style={({ pressed }) => [
            styles.pageChip,
            page <= 1 ? styles.pageChipDisabled : null,
            pressed && page > 1 ? { opacity: 0.88 } : null,
          ]}
        >
          <Ionicons
            name="chevron-back"
            size={16}
            color={page <= 1 ? '#CBD5E1' : '#0F172A'}
          />
        </Pressable>
        <Text style={styles.pageLabel}>
          {meta.page} / {meta.totalPages}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next page"
          disabled={page >= meta.totalPages || isFetching}
          onPress={() => setPage((p) => p + 1)}
          style={({ pressed }) => [
            styles.pageChip,
            page >= meta.totalPages ? styles.pageChipDisabled : null,
            pressed && page < meta.totalPages ? { opacity: 0.88 } : null,
          ]}
        >
          <Ionicons
            name="chevron-forward"
            size={16}
            color={page >= meta.totalPages ? '#CBD5E1' : '#0F172A'}
          />
        </Pressable>
      </View>
    );
  }, [isFetching, meta.page, meta.totalPages, page]);

  const emptyComponent = useMemo(
    (): React.ReactElement => (
      <View style={styles.emptyWrap}>
        <View style={styles.emptyIcon}>
          <Ionicons name="receipt-outline" size={28} color="#94A3B8" />
        </View>
        <Text style={styles.emptyTitle}>No transactions yet</Text>
        <Text style={styles.emptyText}>
          Top up your wallet to see your activity here.
        </Text>
      </View>
    ),
    [],
  );

  if (isLoading) {
    return (
      <AccountHubScreenShell {...shellProps}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.loadingText}>Loading activity…</Text>
        </View>
      </AccountHubScreenShell>
    );
  }

  if (isError) {
    return (
      <AccountHubScreenShell {...shellProps}>
        <View style={styles.centered}>
          <View style={styles.errorIcon}>
            <Ionicons name="cloud-offline-outline" size={32} color="#94A3B8" />
          </View>
          <Text style={styles.errorTitle}>Could not load transactions</Text>
          <Text style={styles.errorText}>Check your connection and try again.</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => void refetch()}
            style={styles.retryButton}
          >
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      </AccountHubScreenShell>
    );
  }

  return (
    <AccountHubScreenShell {...shellProps}>
      <View style={styles.listSheet}>
        <SectionList
          sections={sections}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          ItemSeparatorComponent={ItemSeparator}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          style={styles.screen}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={emptyComponent}
          ListFooterComponent={listFooter}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !isLoading}
              onRefresh={() => void refetch()}
              tintColor="#059669"
            />
          }
        />
      </View>
    </AccountHubScreenShell>
  );
}

export default WalletTransactionsScreen;
