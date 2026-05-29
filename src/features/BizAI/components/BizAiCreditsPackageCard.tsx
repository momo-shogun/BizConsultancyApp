import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import type { AiCreditPackage } from '../types/aiCredits.types';
import { packageCardStyles as s } from './BizAiCreditsPackageCard.styles';

export interface BizAiCreditsPackageCardProps {
  pkg: AiCreditPackage;
  isPopular: boolean;
  walletOk: boolean;
  busy: boolean;
  buyMode: 'razorpay' | 'wallet' | null;
  onWalletPress: () => void;
  onRazorpayPress: () => void;
}

function formatInr(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export function BizAiCreditsPackageCard({
  pkg,
  isPopular,
  walletOk,
  busy,
  buyMode,
  onWalletPress,
  onRazorpayPress,
}: BizAiCreditsPackageCardProps): React.ReactElement {
  const perCredit =
    pkg.credits > 0 ? (pkg.price / pkg.credits).toFixed(2) : '0';

  return (
    <View style={[s.card, isPopular ? s.cardPopular : null]}>
      {isPopular ? (
        <View style={s.popularRibbon}>
          <Ionicons name="star" size={10} color="#FFFFFF" />
          <Text style={s.popularRibbonText}>Popular</Text>
        </View>
      ) : null}

      <View style={s.cardBody}>
        <View style={s.topRow}>
          <View style={s.titleBlock}>
            <Text style={s.packName}>{pkg.name}</Text>
            <View style={s.creditsRow}>
              <Ionicons name="sparkles" size={14} color="#8B5CF6" />
              <Text style={s.creditsText}>
                {pkg.credits.toLocaleString('en-IN')} credits
              </Text>
            </View>
          </View>
          <View style={s.priceBlock}>
            <Text style={s.priceLabel}>Price</Text>
            <Text style={s.priceValue}>{formatInr(pkg.price)}</Text>
            <Text style={s.perCredit}>₹{perCredit} / credit</Text>
          </View>
        </View>

        <View style={s.actionsRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Pay with wallet for ${pkg.name}`}
            onPress={onWalletPress}
            disabled={busy || !walletOk}
            style={({ pressed }) => [
              s.walletBtn,
              (busy || !walletOk) && s.walletBtnDisabled,
              pressed && walletOk && !busy ? s.walletBtnPressed : null,
            ]}
          >
            {busy && buyMode === 'wallet' ? (
              <ActivityIndicator size="small" color="#8B5CF6" />
            ) : (
              <>
                <Ionicons name="wallet-outline" size={17} color="#8B5CF6" />
                <Text style={s.walletBtnText}>Wallet</Text>
              </>
            )}
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Pay with Razorpay for ${pkg.name}`}
            onPress={onRazorpayPress}
            disabled={busy}
            style={({ pressed }) => [
              s.razorpayBtn,
              busy ? s.razorpayBtnDisabled : null,
              pressed && !busy ? s.razorpayBtnPressed : null,
            ]}
          >
            {busy && buyMode === 'razorpay' ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="card-outline" size={17} color="#FFFFFF" />
                <Text style={s.razorpayBtnText}>Razorpay</Text>
              </>
            )}
          </Pressable>
        </View>

        {!walletOk ? (
          <View style={s.insufficientRow}>
            <Ionicons name="information-circle-outline" size={16} color="#D97706" />
            <Text style={s.insufficientText}>
              Low wallet balance — top up your wallet or pay with Razorpay.
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
