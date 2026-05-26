import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type { ConsultantWithdrawalItem } from '@/features/Wallet/types/consultantWallet.types';
import {
  formatConsultantWalletAmount,
  formatConsultantWalletDateTime,
  withdrawalStatusColors,
  withdrawalStatusLabel,
} from '@/features/Wallet/utils/consultantWalletUtils';
import { THEME } from '@/constants/theme';

export interface WithdrawalRequestCardProps {
  item: ConsultantWithdrawalItem;
}

export function WithdrawalRequestCard({
  item,
}: WithdrawalRequestCardProps): React.ReactElement {
  const statusColors = withdrawalStatusColors(item.status);

  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Ionicons name="arrow-up-circle-outline" size={22} color="#059669" />
      </View>

      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text style={styles.amount}>{formatConsultantWalletAmount(item.amount)}</Text>
          <View style={[styles.statusPill, { backgroundColor: statusColors.bg }]}>
            <Text style={[styles.statusText, { color: statusColors.text }]}>
              {withdrawalStatusLabel(item.status)}
            </Text>
          </View>
        </View>
        <Text style={styles.date}>{formatConsultantWalletDateTime(item.createdAt)}</Text>
        <Text style={styles.ref}>Request #{item.id}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: THEME.spacing[14],
    backgroundColor: THEME.colors.white,
    borderRadius: 18,
    padding: THEME.spacing[16],
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.07)',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: { elevation: 2 },
      default: {},
    }),
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: 'rgba(5,150,105,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    minWidth: 0,
    gap: 5,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: THEME.spacing[8],
  },
  amount: {
    fontSize: THEME.typography.size[18],
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
    flex: 1,
  },
  statusPill: {
    paddingHorizontal: THEME.spacing[10],
    paddingVertical: 5,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  date: {
    fontSize: THEME.typography.size[14],
    color: '#64748B',
    fontWeight: '500',
  },
  ref: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
});
