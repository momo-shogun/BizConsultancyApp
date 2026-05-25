import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  normalizeSubmissionStatus,
  type StatusTone,
} from '../utils/myServicesStatus';

const TONE_STYLES: Record<
  StatusTone,
  { bg: string; text: string; border: string }
> = {
  success: { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0' },
  warning: { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A' },
  info: { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
  neutral: { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' },
};

export interface MyServiceStatusBadgeProps {
  status: string | null | undefined;
}

export function MyServiceStatusBadge({
  status,
}: MyServiceStatusBadgeProps): React.ReactElement {
  const { label, tone } = normalizeSubmissionStatus(status);
  const colors = TONE_STYLES[tone];

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg, borderColor: colors.border }]}>
      <Text style={[styles.text, { color: colors.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
