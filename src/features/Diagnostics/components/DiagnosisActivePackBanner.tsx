import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type { DiagnosisPurchaseState } from '../types/diagnostics.types';
import { DIAGNOSIS_THEME } from '../constants/diagnosisTheme';

export interface DiagnosisActivePackBannerProps {
  purchaseState: DiagnosisPurchaseState;
}

export function DiagnosisActivePackBanner({
  purchaseState,
}: DiagnosisActivePackBannerProps): React.ReactElement {
  const label = purchaseState.packName ?? 'Your diagnostic pack';

  return (
    <LinearGradient
      colors={[DIAGNOSIS_THEME.brandGreenSoft, 'rgba(255,255,255,0.95)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.banner}
    >
      <View style={styles.iconWrap}>
        <Ionicons name="shield-checkmark" size={22} color={DIAGNOSIS_THEME.brandPrimary} />
      </View>
      <View style={styles.textCol}>
        <Text style={styles.eyebrow}>Active pack</Text>
        <Text style={styles.title} numberOfLines={1}>
          {label}
        </Text>
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Live</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(15, 81, 50, 0.14)',
    marginBottom: 16,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: DIAGNOSIS_THEME.contentBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: DIAGNOSIS_THEME.brandPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: DIAGNOSIS_THEME.textPrimary,
  },
  badge: {
    backgroundColor: DIAGNOSIS_THEME.brandPrimary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: DIAGNOSIS_THEME.contentBg,
  },
});
