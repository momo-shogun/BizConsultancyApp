import React from 'react';
import { Pressable, Text, View } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { bizAiCreditsScreenStyles as s } from '../screens/BizAiCreditsScreen.styles';

export interface BizAiCreditsHeroProps {
  remainingCredits: number | null;
  onRefresh: () => void;
}

export function BizAiCreditsHero({
  remainingCredits,
  onRefresh,
}: BizAiCreditsHeroProps): React.ReactElement {
  const displayCredits = remainingCredits == null ? '—' : remainingCredits.toLocaleString('en-IN');

  return (
    <View style={s.heroCard}>
      <LinearGradient
        colors={['#0F172A', '#1E1B4B', '#312E81']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={s.heroGradient}
      >
        <View pointerEvents="none" style={s.heroGlow} />
        <View pointerEvents="none" style={s.heroGlowSecondary} />

        <View style={s.heroTopRow}>
          <View style={s.heroTitleBlock}>
            <Text style={s.heroEyebrow}>Biz AI</Text>
            <Text style={s.heroTitle}>Your credits</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Refresh credit balance"
            onPress={onRefresh}
            style={({ pressed }) => [s.refreshPill, pressed ? s.refreshPillPressed : null]}
          >
            <Ionicons name="refresh" size={14} color="#FFFFFF" />
            <Text style={s.refreshPillText}>Refresh</Text>
          </Pressable>
        </View>

        <View style={s.balanceBlock}>
          <View style={s.balanceValueRow}>
            <Text style={s.balanceValue}>{displayCredits}</Text>
            <Text style={s.balanceUnit}>credits</Text>
          </View>
          <Text style={s.balanceHint}>
            Use credits for Biz AI replies after your free questions run out.
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}
