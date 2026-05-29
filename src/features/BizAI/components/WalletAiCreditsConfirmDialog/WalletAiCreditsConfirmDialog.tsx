import React, { useMemo } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { Dialog } from '@/shared/components/dialog';

import type { AiCreditPackage } from '../../types/aiCredits.types';
import { walletConfirmDialogStyles as s } from './WalletAiCreditsConfirmDialog.styles';

function formatInrAmount(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export interface WalletAiCreditsConfirmDialogProps {
  visible: boolean;
  creditPackage: AiCreditPackage | null;
  walletInr: number | null;
  isConsultant: boolean;
  isBusy: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function WalletDialogIcon(): React.ReactElement {
  return (
    <View style={s.iconWrap}>
      <Ionicons name="wallet-outline" size={26} color="#7C3AED" />
      <View style={s.iconBadge}>
        <Ionicons name="sparkles" size={11} color="#FFFFFF" />
      </View>
    </View>
  );
}

export function WalletAiCreditsConfirmDialog({
  visible,
  creditPackage,
  walletInr,
  isConsultant,
  isBusy,
  onClose,
  onConfirm,
}: WalletAiCreditsConfirmDialogProps): React.ReactElement {
  const balanceAfter =
    creditPackage != null && walletInr != null
      ? Math.max(0, walletInr - creditPackage.price)
      : null;

  const confirmLabel = useMemo((): string => {
    if (isBusy) {
      return 'Processing…';
    }
    if (creditPackage != null) {
      return `Pay ${formatInrAmount(creditPackage.price)}`;
    }
    return 'Confirm payment';
  }, [creditPackage, isBusy]);

  return (
    <Dialog
      visible={visible}
      onClose={onClose}
      variant="default"
      title="Confirm wallet payment"
      description="Double-check the pack and balance before you pay."
      icon={<WalletDialogIcon />}
      dismissible={!isBusy}
      closeOnBackdrop={!isBusy}
      contentStyle={s.dialogContent}
      actions={[
        { label: 'Not now', variant: 'ghost', onPress: onClose },
        {
          label: confirmLabel,
          variant: 'default',
          onPress: onConfirm,
        },
      ]}
    >
      <View style={s.walletTypeTag}>
        <Text style={s.walletTypeText}>
          {isConsultant ? 'Consultant wallet' : 'User wallet'}
        </Text>
      </View>

      {creditPackage != null ? (
        <View style={s.summaryCard}>
          <View style={s.summaryHero}>
            <Text style={s.packLabel}>Credit pack</Text>
            <Text style={s.packName}>{creditPackage.name}</Text>
            <View style={s.creditsPill}>
              <Ionicons name="sparkles-outline" size={12} color="#7C3AED" />
              <Text style={s.creditsPillText}>
                {creditPackage.credits.toLocaleString('en-IN')} credits
              </Text>
            </View>
          </View>

          <View style={s.rows}>
            <View style={s.row}>
              <Text style={s.rowLabel}>Amount to debit</Text>
              <Text style={s.rowValueAccent}>{formatInrAmount(creditPackage.price)}</Text>
            </View>
            <View style={s.divider} />
            <View style={s.row}>
              <Text style={s.rowLabel}>Payment method</Text>
              <Text style={s.rowValue}>Wallet (instant)</Text>
            </View>
          </View>

          {walletInr != null && balanceAfter != null ? (
            <View style={s.balanceBlock}>
              <View style={s.balanceRow}>
                <View style={s.balanceChip}>
                  <Text style={s.balanceChipLabel}>Current balance</Text>
                  <Text style={s.balanceChipValue}>{formatInrAmount(walletInr)}</Text>
                </View>
                <View style={s.balanceArrow}>
                  <Ionicons name="arrow-forward" size={16} color="#94A3B8" />
                </View>
                <View style={[s.balanceChip, { alignItems: 'flex-end' }]}>
                  <Text style={s.balanceChipLabel}>After purchase</Text>
                  <Text style={[s.balanceChipValue, { color: '#059669' }]}>
                    {formatInrAmount(balanceAfter)}
                  </Text>
                </View>
              </View>
            </View>
          ) : null}
        </View>
      ) : null}

      <Text style={s.footnote}>
        Credits are added to your Biz AI balance immediately after a successful wallet debit.
      </Text>

      {isBusy ? (
        <View style={s.busyWrap}>
          <ActivityIndicator size="small" color="#059669" />
          <Text style={s.busyText}>Processing wallet payment…</Text>
        </View>
      ) : null}
    </Dialog>
  );
}
