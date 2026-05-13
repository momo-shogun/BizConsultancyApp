import React, { useCallback, useMemo } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { THEME } from '@/constants/theme';

export interface MentorshipStatItem {
  label: string;
  value: number;
  /** Shown under the value (e.g. programme code). */
  tag: string;
}

const DEFAULT_MENTORSHIP_STATS: readonly MentorshipStatItem[] = [
  { label: 'Total Videos', value: 144, tag: 'EDP' },
  { label: 'PDFs', value: 147, tag: 'EDP' },
  { label: 'Modules', value: 22, tag: 'EDP' },
  { label: 'Assessments', value: 0, tag: 'EDP' },
  { label: 'Enrolled Users', value: 0, tag: 'EDP' },
] as const;

const STAT_ACCENTS_REST = ['#0EA5E9', THEME.colors.primary, '#6366F1', '#0891B2'] as const;

const GRID_COLUMNS = 2;
const CARD_GAP = THEME.spacing[8];
const CARD_MIN_HEIGHT = 68;
const ACCENT_RAIL_WIDTH = 3;

type Props = {
  backgroundColor?: string;
  accentColor?: string;
  stats?: readonly MentorshipStatItem[];
};

const StatCell = React.memo(function StatCell({
  item,
  accent,
  isRightColumn,
  valueFontSize,
}: {
  item: MentorshipStatItem;
  accent: string;
  isRightColumn: boolean;
  valueFontSize: number;
}): React.ReactElement {
  return (
    <View style={[styles.cellWrap, isRightColumn ? styles.cellRight : styles.cellLeft]}>
      <View style={styles.statCell}>
        <View style={[styles.statAccentRail, { backgroundColor: accent }]} />
        <View style={styles.statCellInner}>
          <Text style={styles.statLabel} numberOfLines={2}>
            {item.label}
          </Text>
          <Text
            style={[
              styles.statValue,
              { fontSize: valueFontSize, lineHeight: Math.round(valueFontSize * 1.12) },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.88}
          >
            {item.value}
          </Text>
          <Text style={[styles.statTag, { color: accent }]} numberOfLines={1}>
            {item.tag}
          </Text>
        </View>
      </View>
    </View>
  );
});

export function MentorshipProgram({
  backgroundColor = '#F8FAFC',
  accentColor = '#2563EB',
  stats = DEFAULT_MENTORSHIP_STATS,
}: Props): React.ReactElement {
  const { width } = useWindowDimensions();
  const valueFontSize = width <= 360 ? 19 : 21;

  const statList = useMemo(() => [...stats], [stats]);

  const accentPalette = useMemo(
    () => [accentColor, ...STAT_ACCENTS_REST] as const,
    [accentColor],
  );

  const renderStat = useCallback(
    ({ item, index }: { item: MentorshipStatItem; index: number }) => {
      const accent = accentPalette[index % accentPalette.length];
      return (
        <StatCell
          item={item}
          accent={accent}
          isRightColumn={index % GRID_COLUMNS === 1}
          valueFontSize={valueFontSize}
        />
      );
    },
    [valueFontSize, accentPalette],
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.unifiedOuter}>
        <LinearGradient
          colors={['rgba(248,250,252,0.97)', 'rgba(241,245,249,0.98)', 'rgba(224,242,254,0.35)']}
          locations={[0, 0.55, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.unifiedGradient}
        >
          <View style={styles.unifiedInner}>
            <Text style={[styles.eyebrow, { color: accentColor }]}>MENTORSHIP PROGRAM</Text>

            <Text style={styles.title}>
              Learn from{' '}
              <Text style={[styles.titleAccent, { color: accentColor }]}>industry experts</Text>
            </Text>

            <Text style={styles.subtitle}>
              1:1 guidance across industries — scale, grow and innovate faster.
            </Text>

            <View style={styles.heroPills}>
              <View style={styles.heroPill}>
                <Text style={[styles.heroPillText, { color: accentColor }]}>Startup growth</Text>
              </View>
              <View style={[styles.heroPill, styles.heroPillMuted]}>
                <Text style={styles.heroPillTextMuted}>1:1 sessions</Text>
              </View>
            </View>

            <View style={styles.seamDivider} />

            <View style={styles.statsHeaderRow}>
              <Text style={styles.statsHeaderTitle}>Program stats</Text>
              <Text style={[styles.statsHeaderEdp, { color: accentColor }]}>EDP</Text>
            </View>

            <FlatList
              data={statList}
              keyExtractor={(item) => item.label}
              renderItem={renderStat}
              numColumns={GRID_COLUMNS}
              scrollEnabled={false}
              contentContainerStyle={styles.statsListContent}
            />
          </View>
        </LinearGradient>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contentContainer: {
    paddingBottom: THEME.spacing[12],
  },

  unifiedOuter: {
    marginHorizontal: THEME.spacing[12],
    marginTop: THEME.spacing[8],
  },

  unifiedGradient: {
    borderRadius: THEME.radius[16],
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.surface,
  },

  unifiedInner: {
    paddingHorizontal: THEME.spacing[12],
    paddingTop: THEME.spacing[12],
    paddingBottom: THEME.spacing[12],
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.85,
    marginBottom: THEME.spacing[8],
    opacity: 0.88,
  },

  title: {
    fontSize: 21,
    lineHeight: 26,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.4,
  },

  titleAccent: {
    fontWeight: '600',
  },

  subtitle: {
    marginTop: THEME.spacing[10],
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '400',
    color: THEME.colors.textSecondary,
  },

  heroPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing[8],
    marginTop: THEME.spacing[10],
  },

  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.white,
    paddingHorizontal: THEME.spacing[10],
    paddingVertical: 6,
    borderRadius: THEME.radius[12],
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },

  heroPillMuted: {
    backgroundColor: THEME.colors.surface,
    borderColor: THEME.colors.border,
  },

  heroPillText: {
    fontSize: 11,
    fontWeight: '600',
  },

  heroPillTextMuted: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },

  seamDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: THEME.colors.border,
    marginTop: THEME.spacing[14],
    marginBottom: THEME.spacing[10],
  },

  statsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing[10],
  },

  statsHeaderTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
    letterSpacing: 0.2,
  },

  statsHeaderEdp: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2.4,
    opacity: 0.92,
  },

  statsListContent: {
    paddingTop: 0,
    paddingBottom: 0,
  },

  cellWrap: {
    flex: 1,
    minWidth: 0,
    marginBottom: CARD_GAP,
  },

  cellLeft: {
    paddingRight: CARD_GAP / 2,
  },

  cellRight: {
    paddingLeft: CARD_GAP / 2,
  },

  statCell: {
    backgroundColor: THEME.colors.white,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: THEME.radius[12],
    minHeight: CARD_MIN_HEIGHT,
    overflow: 'hidden',
  },

  statAccentRail: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: ACCENT_RAIL_WIDTH,
  },

  statCellInner: {
    paddingHorizontal: THEME.spacing[10],
    paddingTop: THEME.spacing[10],
    paddingBottom: THEME.spacing[10],
    paddingLeft: THEME.spacing[10] + ACCENT_RAIL_WIDTH,
    gap: THEME.spacing[4],
    justifyContent: 'center',
  },

  statLabel: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 15,
  },

  statValue: {
    color: THEME.colors.textPrimary,
    fontWeight: '700',
    letterSpacing: -0.35,
    includeFontPadding: false,
    fontVariant: ['tabular-nums'],
  },

  statTag: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    opacity: 0.88,
  },
});
