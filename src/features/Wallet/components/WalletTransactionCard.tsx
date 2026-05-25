import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type { WalletTransaction } from '@/features/Wallet/types/wallet.types';
import {
  formatWalletTransactionAmount,
  formatWalletTransactionTime,
  getTransactionTitle,
  getTransactionVisual,
  shortenOrderId,
} from '@/features/Wallet/utils/walletTransactionUtils';
import { THEME } from '@/constants/theme';

export interface WalletTransactionCardProps {
  item: WalletTransaction;
}

export function WalletTransactionCard({
  item,
}: WalletTransactionCardProps): React.ReactElement {
  const isCredit = item.transactionType.toLowerCase() === 'credit';
  const visual = useMemo(() => getTransactionVisual(item), [item]);
  const title = useMemo(() => getTransactionTitle(item), [item]);
  const amountLabel = useMemo(
    () => formatWalletTransactionAmount(item.transactionAmount, isCredit),
    [isCredit, item.transactionAmount],
  );
  const timeLabel = useMemo(
    () => formatWalletTransactionTime(item.createdAt),
    [item.createdAt],
  );
  const orderRef = useMemo(
    () => shortenOrderId(item.transactionId),
    [item.transactionId],
  );

  return (
    <View style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: visual.accentSoft }]}>
        <Ionicons name={visual.iconName} size={22} color={visual.accent} />
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <View style={[styles.typePill, { backgroundColor: visual.accentSoft }]}>
            <Text style={[styles.typePillText, { color: visual.accent }]}>
              {visual.label}
            </Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          {timeLabel.length > 0 ? (
            <Text style={styles.metaText}>{timeLabel}</Text>
          ) : null}
          {orderRef != null ? (
            <>
              <Text style={styles.metaDot}>·</Text>
              <Text style={styles.metaText} numberOfLines={1}>
                {orderRef}
              </Text>
            </>
          ) : null}
        </View>

        <View style={styles.statusRow}>
          <Ionicons name="checkmark-circle" size={14} color="#10B981" />
          <Text style={styles.statusText}>Completed</Text>
        </View>
      </View>

      <View style={styles.amountCol}>
        <Text
          style={[
            styles.amount,
            isCredit ? styles.amountCredit : styles.amountDebit,
          ]}
        >
          {amountLabel}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: THEME.spacing[12],
    backgroundColor: THEME.colors.white,
    borderRadius: 18,
    padding: THEME.spacing[14],
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.06)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    minWidth: 0,
    gap: 6,
    paddingTop: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  typePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  typePillText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  metaDot: {
    fontSize: 12,
    color: '#CBD5E1',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#10B981',
  },
  amountCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingTop: 4,
  },
  amount: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  amountCredit: {
    color: '#059669',
  },
  amountDebit: {
    color: '#DC2626',
  },
});
