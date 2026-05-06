import React, { useCallback } from 'react';
import { FlatList, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { THEME } from '@/constants/theme';

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  accent: string;
}

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '').trim();
  const full = normalized.length === 3 ? normalized.split('').map((c) => c + c).join('') : normalized;
  const value = Number.parseInt(full, 16);
  if (Number.isNaN(value) || full.length !== 6) return `rgba(0,0,0,${alpha})`;
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

const STATS: StatItem[] = [
  { value: 10, suffix: 'K+', label: 'Happy Clients', accent: '#FF6A3D' },
  { value: 500, suffix: '+', label: 'Experts', accent: '#3DB2FF' },
  { value: 98, suffix: '%', label: 'Success Rate', accent: '#22C55E' },
  { value: 24, suffix: '/7', label: 'Support', accent: '#FACC15' },
];

const GRID_COLUMNS = 2;

const StatCard = React.memo(function StatCard({
  item,
  isRightColumn,
  valueFontSize,
}: {
  item: StatItem;
  isRightColumn: boolean;
  valueFontSize: number;
}): React.ReactElement {
  const glow = hexToRgba(item.accent, 0.12);
  const tint = hexToRgba(item.accent, 0.06);
  return (
    <View style={[styles.cardWrap, isRightColumn ? styles.cardRight : styles.cardLeft]}>
      <View style={[styles.card, { shadowColor: glow }]}>
        <View style={[styles.tint, { backgroundColor: tint }]} />
        <View style={[styles.accentRail, { backgroundColor: item.accent }]} />
        <View style={styles.cardInner}>
          <View style={styles.topRow}>
            <View style={[styles.accentDot, { backgroundColor: item.accent }]} />
            <Text style={styles.label} numberOfLines={1}>
              {item.label}
            </Text>
          </View>

          <Text
            style={[styles.value, { fontSize: valueFontSize, lineHeight: Math.round(valueFontSize * 1.1) }]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.82}
          >
            {item.value}
            <Text style={[styles.suffix, { color: item.accent }]}>{item.suffix}</Text>
          </Text>
        </View>
      </View>
    </View>
  );
});

export function StatsSection(): React.ReactElement {
  const { width } = useWindowDimensions();
  const valueFontSize = width <= 360 ? 30 : 34;

  const renderItem = useCallback(
    ({ item, index }: { item: StatItem; index: number }) => (
      <StatCard item={item} isRightColumn={index % GRID_COLUMNS === 1} valueFontSize={valueFontSize} />
    ),
    [valueFontSize],
  );

  return (
    <View style={styles.container}>
      <View style={styles.sectionCard}>
        <View style={styles.sectionTopAccent} />
        <View style={styles.sectionInner}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEyebrow}>Our impact</Text>
            <Text style={styles.sectionTitle}>By the numbers</Text>
          </View>

          <FlatList
            data={STATS}
            keyExtractor={(item: StatItem) => item.label}
            renderItem={renderItem}
            numColumns={GRID_COLUMNS}
            scrollEnabled={false}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </View>
    </View>
  );
}

const CARD_GAP = THEME.spacing[12];
const CARD_MIN_HEIGHT = 110;
const ACCENT_RAIL_WIDTH = 4;
const SECTION_ACCENT_HEIGHT = 8;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: THEME.spacing[16],
  },
  sectionCard: {
    borderRadius: THEME.radius[16],
    backgroundColor: THEME.colors.white,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    overflow: 'hidden',
    shadowColor: THEME.colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
  sectionTopAccent: {
    height: SECTION_ACCENT_HEIGHT,
    backgroundColor: THEME.colors.primary,
  },
  sectionInner: {
    paddingTop: THEME.spacing[16],
    paddingHorizontal: THEME.spacing[16],
    paddingBottom: THEME.spacing[4],
  },
  sectionHeader: {
    marginBottom: THEME.spacing[12],
    gap: THEME.spacing[4],
  },
  sectionEyebrow: {
    color: THEME.colors.textSecondary,
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    color: THEME.colors.textPrimary,
    fontSize: THEME.typography.size[20],
    fontWeight: THEME.typography.weight.bold,
    letterSpacing: -0.2,
  },
  listContent: {
    paddingVertical: THEME.spacing[8],
  },
  cardWrap: {
    flex: 1,
    minWidth: 0,
    marginBottom: CARD_GAP,
  },
  cardLeft: {
    paddingRight: CARD_GAP / 2,
  },
  cardRight: {
    paddingLeft: CARD_GAP / 2,
  },
  card: {
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: THEME.radius[16],
    minHeight: CARD_MIN_HEIGHT,
    overflow: 'hidden',
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  tint: {
    ...StyleSheet.absoluteFill,
  },
  accentRail: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: ACCENT_RAIL_WIDTH,
  },
  cardInner: {
    flex: 1,
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[12],
    paddingBottom: THEME.spacing[12],
    paddingLeft: THEME.spacing[16] + ACCENT_RAIL_WIDTH,
    justifyContent: 'space-between',
    gap: THEME.spacing[12],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
  },
  accentDot: {
    width: 9,
    height: 9,
    borderRadius: 999,
  },
  value: {
    color: THEME.colors.textPrimary,
    fontWeight: THEME.typography.weight.bold,
    letterSpacing: -0.8,
    includeFontPadding: false,
  },
  suffix: {
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.bold,
  },
  label: {
    color: THEME.colors.textSecondary,
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.medium,
    lineHeight: 18,
    flex: 1,
  },
});