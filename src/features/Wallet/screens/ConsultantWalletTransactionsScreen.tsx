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
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useGetConsultantWalletBalanceQuery } from '@/features/Home/api/userWalletsApi';
import { useGetConsultantWalletTransactionsQuery } from '@/features/Wallet/api/consultantWalletTransactionsApi';
import { ConsultantWalletBalanceHero } from '@/features/Wallet/components/ConsultantWalletBalanceHero';
import { ConsultantWalletTransactionCard } from '@/features/Wallet/components/ConsultantWalletTransactionCard';
import { CONSULTANT_WALLET_CANVAS } from '@/features/Wallet/constants/consultantWalletTheme';
import type {
  ConsultantWalletTransactionItem,
  ConsultantWalletTransactionSection,
} from '@/features/Wallet/types/consultantWallet.types';
import { groupConsultantTransactionsByDate } from '@/features/Wallet/utils/consultantWalletUtils';
import { consultantWalletStyles as styles } from '@/features/Wallet/screens/consultantWallet.styles';
import { THEME } from '@/constants/theme';
import { SafeAreaWrapper, ScreenHeader } from '@/shared/components';

const PAGE_SIZE = 20;

const localStyles = StyleSheet.create({
  sectionTitle: {
    fontSize: THEME.typography.size[12],
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: THEME.spacing[10],
    marginTop: THEME.spacing[16],
  },
  headerWrap: {
    marginBottom: THEME.spacing[4],
  },
  activityLabel: {
    fontSize: THEME.typography.size[14],
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    marginTop: THEME.spacing[20],
    marginBottom: THEME.spacing[12],
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing[16],
    marginTop: THEME.spacing[24],
    paddingBottom: THEME.spacing[8],
  },
  pageChip: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: THEME.colors.white,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageChipDisabled: {
    opacity: 0.45,
  },
  pageLabel: {
    fontSize: THEME.typography.size[14],
    fontWeight: '700',
    color: '#334155',
    minWidth: 56,
    textAlign: 'center',
  },
  footerSpace: {
    height: THEME.spacing[12],
  },
});

export function ConsultantWalletTransactionsScreen(): React.ReactElement {
  const navigation = useNavigation();
  const [page, setPage] = useState(1);

  const { data: balance, isFetching: isBalanceFetching, refetch: refetchBalance } =
    useGetConsultantWalletBalanceQuery();
  const { data, isLoading, isFetching, isError, refetch } =
    useGetConsultantWalletTransactionsQuery({
      page,
      limit: PAGE_SIZE,
    });

  const transactions = data?.data ?? [];
  const meta = data?.meta ?? { total: 0, page: 1, limit: PAGE_SIZE, totalPages: 1 };

  const sections = useMemo(
    (): ConsultantWalletTransactionSection[] =>
      groupConsultantTransactionsByDate(transactions),
    [transactions],
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: ConsultantWalletTransactionSection }) => (
      <Text style={localStyles.sectionTitle}>{section.title}</Text>
    ),
    [],
  );

  const renderItem = useCallback(
    ({ item }: { item: ConsultantWalletTransactionItem }) => (
      <ConsultantWalletTransactionCard item={item} />
    ),
    [],
  );

  const keyExtractor = useCallback(
    (item: ConsultantWalletTransactionItem): string => String(item.id),
    [],
  );

  const ItemSeparator = useCallback(
    (): React.ReactElement => <View style={styles.itemGap} />,
    [],
  );

  const ListHeader = useMemo(
    (): React.ReactElement => (
      <View style={localStyles.headerWrap}>
        <ConsultantWalletBalanceHero
          balance={balance}
          onRefresh={() => void refetchBalance()}
          isFetching={isBalanceFetching}
          hint={`${meta.total} wallet transaction${meta.total === 1 ? '' : 's'} on record.`}
          showPills={false}
        />
        <Text style={localStyles.activityLabel}>Recent activity</Text>
      </View>
    ),
    [balance, isBalanceFetching, meta.total, refetchBalance],
  );

  return (
    <SafeAreaWrapper edges={['top', 'bottom']} bgColor={CONSULTANT_WALLET_CANVAS}>
      <ScreenHeader
        title="Transaction History"
        onBackPress={() => navigation.goBack()}
      />

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.emptyText}>Loading activity…</Text>
        </View>
      ) : isError ? (
        <View style={styles.centered}>
          <Text style={styles.emptyTitle}>Could not load transactions</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => void refetch()}>
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
            <View style={styles.emptyCard}>
              <View style={styles.emptyIconWrap}>
                <Ionicons name="receipt-outline" size={32} color="#94A3B8" />
              </View>
              <Text style={styles.emptyTitle}>No transactions yet</Text>
              <Text style={styles.emptyText}>
                Wallet activity from bookings and payouts will appear here.
              </Text>
            </View>
          }
          ListFooterComponent={
            meta.totalPages > 1 ? (
              <View style={localStyles.pagination}>
                <TouchableOpacity
                  style={[localStyles.pageChip, page <= 1 && localStyles.pageChipDisabled]}
                  disabled={page <= 1 || isFetching}
                  onPress={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <Ionicons
                    name="chevron-back"
                    size={18}
                    color={page <= 1 ? '#CBD5E1' : '#0F172A'}
                  />
                </TouchableOpacity>
                <Text style={localStyles.pageLabel}>
                  {meta.page} / {meta.totalPages}
                </Text>
                <TouchableOpacity
                  style={[
                    localStyles.pageChip,
                    page >= meta.totalPages && localStyles.pageChipDisabled,
                  ]}
                  disabled={page >= meta.totalPages || isFetching}
                  onPress={() => setPage((p) => p + 1)}
                >
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={page >= meta.totalPages ? '#CBD5E1' : '#0F172A'}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={localStyles.footerSpace} />
            )
          }
        />
      )}
    </SafeAreaWrapper>
  );
}
