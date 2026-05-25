import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import { WalletTransactionCard } from '@/features/Wallet/components/WalletTransactionCard';
import { useGetMyWalletTransactionsQuery } from '@/features/Wallet/api/walletApi';
import {
  formatWalletBalanceInr,
  useGetMyWalletBalanceQuery,
} from '@/features/Home/api/userWalletsApi';
import type { WalletTransaction, WalletTransactionSection } from '@/features/Wallet/types/wallet.types';
import { groupWalletTransactionsByDate } from '@/features/Wallet/utils/walletTransactionUtils';
import { THEME } from '@/constants/theme';
import { navigationRef } from '@/navigation/RootNavigator';
import { SafeAreaWrapper, ScreenHeader } from '@/shared/components';

const PAGE_SIZE = 20;

export function WalletTransactionsScreen(): React.ReactElement {
  const [page, setPage] = useState(1);

  const { data: balance } = useGetMyWalletBalanceQuery();
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

  const renderSectionHeader = useCallback(
    ({ section }: { section: WalletTransactionSection }) => (
      <Text style={styles.sectionTitle}>{section.title}</Text>
    ),
    [],
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

  const ListHeader = useMemo(
    (): React.ReactElement => (
      <LinearGradient
        colors={['#064E3B', '#059669', '#0D9488']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.summaryCard}
      >
        <View style={styles.summaryTop}>
          <View>
            <Text style={styles.summaryLabel}>Available balance</Text>
            <Text style={styles.summaryAmount}>
              {formatWalletBalanceInr(balance ?? 0)}
            </Text>
          </View>
          <View style={styles.summaryBadge}>
            <Ionicons name="wallet-outline" size={22} color="#FFFFFF" />
          </View>
        </View>
        <View style={styles.summaryFooter}>
          <Text style={styles.summaryMeta}>
            {meta.total} transaction{meta.total === 1 ? '' : 's'}
          </Text>
          <View style={styles.summaryPill}>
            <Ionicons name="shield-checkmark-outline" size={12} color="#D1FAE5" />
            <Text style={styles.summaryPillText}>Secured</Text>
          </View>
        </View>
      </LinearGradient>
    ),
    [balance, meta.total],
  );

  return (
    <SafeAreaWrapper edges={['top', 'bottom']} bgColor="#F1F5F9">
      <ScreenHeader
        title="Transactions"
        onBackPress={() => navigationRef.goBack()}
      />

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.loadingText}>Loading activity…</Text>
        </View>
      ) : isError ? (
        <View style={styles.centered}>
          <View style={styles.errorIcon}>
            <Ionicons name="cloud-offline-outline" size={32} color="#94A3B8" />
          </View>
          <Text style={styles.errorTitle}>Could not load transactions</Text>
          <Text style={styles.errorText}>Check your connection and try again.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => void refetch()}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          ItemSeparatorComponent={ItemSeparator}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={ListHeader}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !isLoading}
              onRefresh={() => void refetch()}
              tintColor="#059669"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <View style={styles.emptyIcon}>
                <Ionicons name="receipt-outline" size={36} color="#94A3B8" />
              </View>
              <Text style={styles.emptyTitle}>No transactions yet</Text>
              <Text style={styles.emptyText}>
                Top up your wallet to see your activity here.
              </Text>
            </View>
          }
          ListFooterComponent={
            meta.totalPages > 1 ? (
              <View style={styles.pagination}>
                <TouchableOpacity
                  style={[styles.pageChip, page <= 1 && styles.pageChipDisabled]}
                  disabled={page <= 1 || isFetching}
                  onPress={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <Ionicons
                    name="chevron-back"
                    size={16}
                    color={page <= 1 ? '#CBD5E1' : '#0F172A'}
                  />
                </TouchableOpacity>
                <Text style={styles.pageLabel}>
                  {meta.page} / {meta.totalPages}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.pageChip,
                    page >= meta.totalPages && styles.pageChipDisabled,
                  ]}
                  disabled={page >= meta.totalPages || isFetching}
                  onPress={() => setPage((p) => p + 1)}
                >
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={page >= meta.totalPages ? '#CBD5E1' : '#0F172A'}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.footerSpace} />
            )
          }
        />
      )}
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: THEME.spacing[16],
    paddingBottom: THEME.spacing[24],
    flexGrow: 1,
  },
  summaryCard: {
    borderRadius: 22,
    padding: THEME.spacing[16],
    marginBottom: THEME.spacing[20],
    marginTop: THEME.spacing[8],
  },
  summaryTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing[14],
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.78)',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  summaryAmount: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.6,
  },
  summaryBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryMeta: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
  },
  summaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  summaryPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ECFDF5',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    marginBottom: THEME.spacing[10],
    marginTop: THEME.spacing[4],
  },
  itemGap: {
    height: THEME.spacing[10],
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: THEME.spacing[24],
    gap: THEME.spacing[10],
  },
  loadingText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  errorIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: THEME.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing[8],
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  errorText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: THEME.spacing[8],
    paddingHorizontal: THEME.spacing[20],
    paddingVertical: THEME.spacing[12],
    borderRadius: 999,
    backgroundColor: '#059669',
  },
  retryText: {
    color: THEME.colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: THEME.spacing[20],
    gap: THEME.spacing[8],
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: THEME.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing[4],
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing[16],
    marginTop: THEME.spacing[20],
    paddingBottom: THEME.spacing[8],
  },
  pageChip: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: THEME.colors.white,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageChipDisabled: {
    opacity: 0.5,
  },
  pageLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  footerSpace: {
    height: THEME.spacing[12],
  },
});

export default WalletTransactionsScreen;
