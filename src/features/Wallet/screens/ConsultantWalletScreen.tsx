import React, { useCallback } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useGetConsultantWalletBalanceQuery } from '@/features/Home/api/userWalletsApi';
import { ConsultantWalletBalanceHero } from '@/features/Wallet/components/ConsultantWalletBalanceHero';
import {
  CONSULTANT_WALLET_CANVAS,
  CONSULTANT_WALLET_HEADER_GRADIENT,
  CONSULTANT_WALLET_HEADER_STATUS_BAR,
} from '@/features/Wallet/constants/consultantWalletTheme';
import { consultantWalletStyles as styles } from '@/features/Wallet/screens/consultantWallet.styles';
import { ROUTES } from '@/navigation/routeNames';
import type { AccountStackParamList } from '@/navigation/types';
import { AccountHubScreenShell } from '@/shared/components';

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
      navigation.navigate(route as never);
    },
    [navigation],
  );

  const headerBalance = (
    <ConsultantWalletBalanceHero
      embeddedInHeader
      balance={balance}
      isLoading={isLoading}
      isFetching={isFetching}
      onRefresh={() => void refetch()}
      showPills={false}
    />
  );

  return (
    <AccountHubScreenShell
      title="My Wallet"
      onBackPress={() => navigation.goBack()}
      canvasColor={CONSULTANT_WALLET_CANVAS}
      headerColor={CONSULTANT_WALLET_HEADER_STATUS_BAR}
      headerGradientColors={CONSULTANT_WALLET_HEADER_GRADIENT}
      headerAccessory={headerBalance}
    >
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentSheet}>
          <Text style={styles.sectionLabel}>Manage wallet</Text>

          <View style={styles.menuBlock}>
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
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </Pressable>
            ))}
          </View>

          <View style={styles.tipRow}>
            <Ionicons name="information-circle-outline" size={18} color="#878787" />
            <Text style={styles.tipText}>
              Withdrawals are processed after review. Keep bank details updated in Help &
              Settings before requesting a payout.
            </Text>
          </View>
        </View>
      </ScrollView>
    </AccountHubScreenShell>
  );
}
