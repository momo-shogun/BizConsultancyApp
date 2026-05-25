import React, { memo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type { MyOnboardingSubmission } from '../types/myServices.types';
import {
  formatDisplayDate,
  formatInrAmount,
} from '../utils/myServicesStatus';
import { MyServiceStatusBadge } from './MyServiceStatusBadge';

export interface MyServiceCardProps {
  item: MyOnboardingSubmission;
  showContinue: boolean;
  showApply: boolean;
  isContinueLoading: boolean;
  onPressDetails: () => void;
  onPressContinue: () => void;
  onPressApply: () => void;
}

function PaymentChip({ mode }: { mode: string | null }): React.ReactElement {
  const label = mode?.trim() ? mode.replace(/_/g, ' ') : '—';
  const isWallet = label.toLowerCase().includes('wallet');
  if (!mode?.trim()) {
    return <Text style={styles.metaMuted}>—</Text>;
  }
  return (
    <View style={styles.paymentChip}>
      <Ionicons
        name={isWallet ? 'wallet-outline' : 'card-outline'}
        size={12}
        color="#0F5132"
      />
      <Text style={styles.paymentText}>{label}</Text>
    </View>
  );
}

function MyServiceCardComponent({
  item,
  showContinue,
  showApply,
  isContinueLoading,
  onPressDetails,
  onPressContinue,
  onPressApply,
}: MyServiceCardProps): React.ReactElement {
  const title = item.serviceName || item.serviceSlug || `Form #${item.formId ?? item.id}`;
  const dateLabel = formatDisplayDate(item.transactionDate || item.createdAt);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPressDetails}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.accent} />
      <View style={styles.body}>
        <View style={styles.topRow}>
          <View style={styles.titleBlock}>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
            {item.orderId ? (
              <Text style={styles.orderId} numberOfLines={1}>
                Order {item.orderId}
              </Text>
            ) : null}
          </View>
          <MyServiceStatusBadge status={item.status} />
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.amount}>{formatInrAmount(item.amount)}</Text>
          <PaymentChip mode={item.paymentMode} />
          <Text style={styles.date}>{dateLabel}</Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            onPress={onPressDetails}
            style={({ pressed }) => [styles.actionOutline, pressed && styles.actionPressed]}
          >
            <Ionicons name="eye-outline" size={16} color="#0B3B66" />
            <Text style={styles.actionOutlineText}>Details</Text>
          </Pressable>

          {showContinue ? (
            <Pressable
              accessibilityRole="button"
              disabled={isContinueLoading}
              onPress={onPressContinue}
              style={({ pressed }) => [styles.actionPrimary, pressed && styles.actionPressed]}
            >
              {isContinueLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.actionPrimaryText}>Continue</Text>
                  <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
                </>
              )}
            </Pressable>
          ) : null}

          {showApply ? (
            <Pressable
              accessibilityRole="button"
              onPress={onPressApply}
              style={({ pressed }) => [styles.actionApply, pressed && styles.actionPressed]}
            >
              <Text style={styles.actionPrimaryText}>Apply</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

export const MyServiceCard = memo(MyServiceCardComponent);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8EDF2',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.94,
  },
  accent: {
    width: 4,
    backgroundColor: '#0F5132',
  },
  body: {
    flex: 1,
    padding: 14,
    gap: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  titleBlock: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B3258',
    lineHeight: 21,
  },
  orderId: {
    fontSize: 11,
    color: '#64748B',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  amount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F5132',
  },
  paymentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  paymentText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#166534',
    textTransform: 'capitalize',
  },
  metaMuted: {
    fontSize: 12,
    color: '#94A3B8',
  },
  date: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 'auto',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  actionOutlineText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0B3B66',
  },
  actionPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#0B3B66',
    minWidth: 100,
    justifyContent: 'center',
  },
  actionApply: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#219653',
  },
  actionPrimaryText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  actionPressed: {
    opacity: 0.88,
  },
});
