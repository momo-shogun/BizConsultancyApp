import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { DIAGNOSIS_THEME, hexToRgba } from '../constants/diagnosisTheme';

export interface DiagnosisFeatureCardProps {
  icon: string;
  title: string;
  description: string;
  accentColor?: string;
}

export function DiagnosisFeatureCard({
  icon,
  title,
  description,
  accentColor = DIAGNOSIS_THEME.heroAccent,
}: DiagnosisFeatureCardProps): React.ReactElement {
  const tagBg = useMemo(() => hexToRgba(accentColor, 0.1), [accentColor]);
  const iconBg = useMemo(() => hexToRgba(accentColor, 0.14), [accentColor]);

  return (
    <View style={styles.card}>
      <LinearGradient
        colors={[hexToRgba(accentColor, 0.22), hexToRgba(accentColor, 0.04)]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.topBand}
      >
        <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
          <Ionicons name={icon} size={20} color={accentColor} />
        </View>
      </LinearGradient>

      <View style={styles.body}>
        <View style={[styles.tag, { backgroundColor: tagBg }]}>
          <Text style={[styles.tagText, { color: accentColor }]}>Included</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description} numberOfLines={3}>
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: DIAGNOSIS_THEME.contentBg,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.06)',
    shadowColor: DIAGNOSIS_THEME.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  topBand: {
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: 12,
    paddingBottom: 14,
    gap: 6,
  },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  tagText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: DIAGNOSIS_THEME.textPrimary,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 12,
    lineHeight: 17,
    color: DIAGNOSIS_THEME.textSecondary,
  },
});
