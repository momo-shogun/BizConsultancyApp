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
    <View style={styles.banner}>
      <LinearGradient
        colors={[DIAGNOSIS_THEME.brandGreenSoft, 'rgba(255,255,255,0.95)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.iconWrap}>
        <Ionicons name="shield-checkmark" size={22} color={DIAGNOSIS_THEME.brandPrimary} />
      </View>
      <View style={styles.textCol}>
        <Text style={styles.eyebrow}>Active pack</Text>
        <Text style={styles.title} numberOfLines={2}>
          {label}
        </Text>
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Live</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'relative',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(15, 81, 50, 0.14)',
    marginBottom: 16,
    minHeight: 72,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: DIAGNOSIS_THEME.contentBg,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textCol: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  eyebrow: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
    color: DIAGNOSIS_THEME.brandPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    paddingRight: 2,
  },
  title: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
    color: DIAGNOSIS_THEME.textPrimary,
  },
  badge: {
    backgroundColor: DIAGNOSIS_THEME.brandPrimary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    flexShrink: 0,
  },
  badgeText: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '800',
    color: DIAGNOSIS_THEME.contentBg,
  },
});
