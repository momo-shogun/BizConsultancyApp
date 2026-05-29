import React from 'react';
import { Pressable, Text, View } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { bizAiCreditsScreenStyles as s } from '../screens/BizAiCreditsScreen.styles';

export interface BizAiCreditsWalletCardProps {
  isConsultant: boolean;
  walletInr: number | null;
  onTopUp: () => void;
}

export function BizAiCreditsWalletCard({
  isConsultant,
  walletInr,
  onTopUp,
}: BizAiCreditsWalletCardProps): React.ReactElement {
  const walletLabel = isConsultant ? 'Consultant wallet' : 'Your wallet';
  const amountLabel =
    walletInr == null ? '—' : `₹${walletInr.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

  return (
    <View style={s.walletFloatCard}>
      <View style={s.walletIconWrap}>
        <Ionicons name="wallet-outline" size={22} color="#7C3AED" />
      </View>
      <View style={s.walletBody}>
        <Text style={s.walletLabel}>{walletLabel}</Text>
        <Text style={s.walletAmount}>{amountLabel}</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Top up wallet"
        onPress={onTopUp}
        style={({ pressed }) => [s.topUpBtn, pressed ? s.topUpBtnPressed : null]}
      >
        <Text style={s.topUpBtnText}>Top up</Text>
      </Pressable>
    </View>
  );
}
