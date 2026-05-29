import React, { useMemo } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type { ConsultantWalletTransactionItem } from '@/features/Wallet/types/consultantWallet.types';
import {
  formatConsultantTransactionAmount,
  formatConsultantWalletDateTime,
} from '@/features/Wallet/utils/consultantWalletUtils';
import { THEME } from '@/constants/theme';

export interface ConsultantWalletTransactionCardProps {
  item: ConsultantWalletTransactionItem;
  variant?: 'card' | 'flat';
  isLastInSection?: boolean;
}

function transactionTitle(item: ConsultantWalletTransactionItem): string {
  if (item.transactionDetail != null && item.transactionDetail.trim().length > 0) {
    return item.transactionDetail.trim();
  }
  if (item.userName != null && item.userName.trim().length > 0) {
    return item.userName.trim();
  }
  return item.transactionType.toLowerCase() === 'credit' ? 'Credit' : 'Debit';
}

export function ConsultantWalletTransactionCard({
  item,
  variant = 'card',
  isLastInSection = false,
}: ConsultantWalletTransactionCardProps): React.ReactElement {
  const isCredit = item.transactionType.toLowerCase() === 'credit';
  const title = useMemo(() => transactionTitle(item), [item]);
  const amountLabel = useMemo(
    () => formatConsultantTransactionAmount(item.transactionAmount, isCredit),
    [isCredit, item.transactionAmount],
  );
  const timeLabel = useMemo(
    () => formatConsultantWalletDateTime(item.createdAt),
    [item.createdAt],
  );

  const iconName = isCredit ? 'arrow-down-circle' : 'arrow-up-circle';
  const accent = isCredit ? '#059669' : '#DC2626';
  const accentSoft = isCredit ? 'rgba(5,150,105,0.12)' : 'rgba(220,38,38,0.10)';

  const isFlat = variant === 'flat';

  return (
    <View
      style={[
        styles.card,
        isFlat ? styles.cardFlat : null,
        isFlat && !isLastInSection ? styles.cardFlatBorder : null,
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: accentSoft }]}>
        <Ionicons name={iconName} size={22} color={accent} />
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.metaText}>{timeLabel}</Text>
        {item.bookingId != null ? (
          <Text style={styles.bookingRef}>Booking #{item.bookingId}</Text>
        ) : null}
        {item.commissionAmount > 0 ? (
          <Text style={styles.commissionText}>
            Commission {formatConsultantTransactionAmount(item.commissionAmount, false)}
          </Text>
        ) : null}
      </View>

      <Text
        style={[styles.amount, isCredit ? styles.amountCredit : styles.amountDebit]}
      >
        {amountLabel}
      </Text>
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
  cardFlat: {
    borderRadius: 0,
    borderWidth: 0,
    paddingVertical: THEME.spacing[14],
    paddingHorizontal: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  cardFlatBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F0F0F0',
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    minWidth: 0,
    gap: 4,
    paddingTop: 2,
  },
  title: {
    fontSize: THEME.typography.size[16],
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
    lineHeight: 22,
  },
  metaText: {
    fontSize: THEME.typography.size[12],
    color: '#64748B',
    fontWeight: '500',
  },
  bookingRef: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  commissionText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  amount: {
    fontSize: THEME.typography.size[16],
    fontWeight: '800',
    letterSpacing: -0.3,
    paddingTop: 6,
    maxWidth: 100,
    textAlign: 'right',
  },
  amountCredit: {
    color: '#059669',
  },
  amountDebit: {
    color: '#DC2626',
  },
});
