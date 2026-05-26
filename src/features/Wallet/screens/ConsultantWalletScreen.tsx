import React, { useCallback } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useGetConsultantWalletBalanceQuery } from '@/features/Home/api/userWalletsApi';
import { ConsultantWalletBalanceHero } from '@/features/Wallet/components/ConsultantWalletBalanceHero';
import { CONSULTANT_WALLET_CANVAS } from '@/features/Wallet/constants/consultantWalletTheme';
import { consultantWalletStyles as styles } from '@/features/Wallet/screens/consultantWallet.styles';
import { ROUTES } from '@/navigation/routeNames';
import type { AccountStackParamList } from '@/navigation/types';
import { SafeAreaWrapper, ScreenHeader } from '@/shared/components';

interface WalletActionRow {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  route: keyof AccountStackParamList;
}

const ACTION_ROWS: WalletActionRow[] = [
  {
    id: 'withdrawals',
    title: 'Withdrawals',
    subtitle: 'Request payout and track approval status',
    icon: 'cash-outline',
    iconColor: '#059669',
    iconBg: 'rgba(5,150,105,0.10)',
    route: ROUTES.Account.ConsultantWithdrawals,
  },
  {
    id: 'transactions',
    title: 'Transaction history',
    subtitle: 'Credits, debits and booking earnings',
    icon: 'receipt-outline',
    iconColor: '#2563EB',
    iconBg: 'rgba(37,99,235,0.10)',
    route: ROUTES.Account.TransactionHis,
  },
];

export function ConsultantWalletScreen(): React.ReactElement {
  const navigation = useNavigation<NavigationProp<AccountStackParamList>>();
  const { data: balance, isLoading, isFetching, refetch } =
    useGetConsultantWalletBalanceQuery();

  const onActionPress = useCallback(
    (route: keyof AccountStackParamList): void => {
      navigation.navigate(route);
    },
    [navigation],
  );

  return (
    <SafeAreaWrapper edges={['top', 'bottom']} bgColor={CONSULTANT_WALLET_CANVAS}>
      <ScreenHeader title="My Wallet" onBackPress={() => navigation.goBack()} />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <ConsultantWalletBalanceHero
          balance={balance}
          isLoading={isLoading}
          isFetching={isFetching}
          onRefresh={() => void refetch()}
        />

        <Text style={styles.sectionLabel}>Manage wallet</Text>

        <View style={styles.menuCard}>
          {ACTION_ROWS.map((row, index) => (
            <Pressable
              key={row.id}
              accessibilityRole="button"
              onPress={() => onActionPress(row.route)}
              style={({ pressed }) => [
                styles.menuRow,
                index < ACTION_ROWS.length - 1 ? styles.menuRowBorder : null,
                pressed ? styles.menuRowPressed : null,
              ]}
            >
              <View style={[styles.menuIcon, { backgroundColor: row.iconBg }]}>
                <Ionicons name={row.icon} size={22} color={row.iconColor} />
              </View>
              <View style={styles.menuBody}>
                <Text style={styles.menuTitle}>{row.title}</Text>
                <Text style={styles.menuSubtitle}>{row.subtitle}</Text>
              </View>
              <View style={styles.menuChevron}>
                <Ionicons name="chevron-forward" size={16} color="#64748B" />
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.tipCard}>
          <Ionicons name="information-circle-outline" size={20} color="#059669" />
          <Text style={styles.tipText}>
            Withdrawals are processed after review. Ensure your bank details are up to date in
            Help & Settings before requesting a payout.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaWrapper>
  );
}
