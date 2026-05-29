import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  SectionList,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useGetConsultantWalletBalanceQuery } from '@/features/Home/api/userWalletsApi';
import { useGetConsultantWalletTransactionsQuery } from '@/features/Wallet/api/consultantWalletTransactionsApi';
import { ConsultantWalletBalanceHero } from '@/features/Wallet/components/ConsultantWalletBalanceHero';
import { ConsultantWalletTransactionCard } from '@/features/Wallet/components/ConsultantWalletTransactionCard';
import {
  CONSULTANT_WALLET_CANVAS,
  CONSULTANT_WALLET_HEADER_GRADIENT,
  CONSULTANT_WALLET_HEADER_STATUS_BAR,
} from '@/features/Wallet/constants/consultantWalletTheme';
import type {
  ConsultantWalletTransactionItem,
  ConsultantWalletTransactionSection,
} from '@/features/Wallet/types/consultantWallet.types';
import { groupConsultantTransactionsByDate } from '@/features/Wallet/utils/consultantWalletUtils';
import { ROUTES } from '@/navigation/routeNames';
import type { AccountStackParamList } from '@/navigation/types';
import { AccountHubScreenShell } from '@/shared/components';

import { styles } from './ConsultantWalletTransactionsScreen.styles';

const PAGE_SIZE = 20;

type Nav = NativeStackNavigationProp<
  AccountStackParamList,
  typeof ROUTES.Account.TransactionHis
>;

export function ConsultantWalletTransactionsScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const [page, setPage] = useState(1);

  const {
    data: balance,
    isLoading: isBalanceLoading,
    isFetching: isBalanceFetching,
    refetch: refetchBalance,
  } = useGetConsultantWalletBalanceQuery();
  const { data, isLoading, isFetching, isError, refetch } =
    useGetConsultantWalletTransactionsQuery({
      page,
      limit: PAGE_SIZE,
    });

  const meta = data?.meta ?? { total: 0, page: 1, limit: PAGE_SIZE, totalPages: 1 };

  const sections = useMemo(
    (): ConsultantWalletTransactionSection[] =>
      groupConsultantTransactionsByDate(data?.data ?? []),
    [data?.data],
  );

  const balanceHint = `${meta.total} wallet transaction${meta.total === 1 ? '' : 's'} on record`;

  const headerBalance = (
    <ConsultantWalletBalanceHero
      embeddedInHeader
      balance={balance}
      isLoading={isBalanceLoading}
      isFetching={isBalanceFetching}
      onRefresh={() => void refetchBalance()}
      hint={balanceHint}
      showPills={false}
    />
  );

  const shellProps = {
    title: 'Transaction History',
    onBackPress: () => navigation.goBack(),
    canvasColor: CONSULTANT_WALLET_CANVAS,
    headerColor: CONSULTANT_WALLET_HEADER_STATUS_BAR,
    headerGradientColors: CONSULTANT_WALLET_HEADER_GRADIENT,
    headerAccessory: headerBalance,
  } as const;

  const renderSectionHeader = useCallback(
    ({ section }: { section: ConsultantWalletTransactionSection }) => {
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
    ({
      item,
      index,
      section,
    }: {
      item: ConsultantWalletTransactionItem;
      index: number;
      section: ConsultantWalletTransactionSection;
    }) => (
      <ConsultantWalletTransactionCard
        item={item}
        variant="flat"
        isLastInSection={index === section.data.length - 1}
      />
    ),
    [],
  );

  const keyExtractor = useCallback(
    (item: ConsultantWalletTransactionItem): string => String(item.id),
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
            styles.pageBtn,
            page <= 1 ? styles.pageBtnDisabled : null,
            pressed && page > 1 ? { opacity: 0.88 } : null,
          ]}
        >
          <Ionicons name="chevron-back" size={18} color={page <= 1 ? '#CBD5E1' : '#0F172A'} />
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
            styles.pageBtn,
            page >= meta.totalPages ? styles.pageBtnDisabled : null,
            pressed && page < meta.totalPages ? { opacity: 0.88 } : null,
          ]}
        >
          <Ionicons
            name="chevron-forward"
            size={18}
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
          Wallet activity from bookings and payouts will appear here.
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
          <Text style={styles.emptyTitle}>Could not load transactions</Text>
          <Text style={styles.emptyText}>Check your connection and try again.</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => void refetch()}
            style={styles.retryBtn}
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
