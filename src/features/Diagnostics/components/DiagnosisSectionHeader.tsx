import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { DIAGNOSIS_THEME } from '../constants/diagnosisTheme';

export interface DiagnosisSectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  accentColor?: string;
}

export function DiagnosisSectionHeader({
  eyebrow,
  title,
  subtitle,
  accentColor = DIAGNOSIS_THEME.heroAccent,
}: DiagnosisSectionHeaderProps): React.ReactElement {
  return (
    <View style={styles.wrap}>
      {eyebrow != null && eyebrow.length > 0 ? (
        <View style={styles.eyebrowRow}>
          <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
          <Text style={[styles.eyebrow, { color: accentColor }]} numberOfLines={1}>
            {eyebrow}
          </Text>
        </View>
      ) : null}
      <Text style={styles.title}>{title}</Text>
      {subtitle != null && subtitle.length > 0 ? (
        <Text style={styles.subtitle}>{subtitle}</Text>
      ) : null}
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 16,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  accentBar: {
    width: 3,
    height: 14,
    borderRadius: 2,
    flexShrink: 0,
  },
  eyebrow: {
    flexShrink: 1,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    paddingRight: 4,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
    color: DIAGNOSIS_THEME.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 21,
    color: DIAGNOSIS_THEME.textSecondary,
  },
  line: {
    marginTop: 12,
    height: StyleSheet.hairlineWidth * 2,
    backgroundColor: 'rgba(15, 23, 42, 0.08)',
    borderRadius: 1,
  },
});
