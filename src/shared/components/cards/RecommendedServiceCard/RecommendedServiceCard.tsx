import React, { useMemo } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, type DimensionValue } from 'react-native';

import { THEME } from '@/constants/theme';

export interface RecommendedServiceItem {
  id: string;
  slug: string;
  /** Short label top-right (e.g. Expert-led, 2–4 weeks) */
  headerRight: string;
  /** Shown in the colored header strip (left) */
  categoryLabel: string;
  title: string;
  summary: string;
  /** Pill on the right of the title row */
  badgeLabel?: string;
  /** Footer left, e.g. From ₹9,999 */
  priceLabel?: string;
  /** Rotates header pastel (0–2) */
  headerStyleIndex?: 0 | 1 | 2;
}

export interface RecommendedServiceCardProps {
  item: RecommendedServiceItem;
  cardWidth?: DimensionValue;
  onPress?: () => void;
  onCtaPress?: () => void;
  /** Removes carousel trailing gutter when the card spans the full content width */
  fullWidth?: boolean;
  /** Overrides default hint on the top pressable (e.g. on detail where `onPress` is disabled) */
  upperPressableAccessibilityHint?: string;
}

const HEADER_PRESETS: readonly { bg: string; fg: string }[] = [
  { bg: THEME.colors.chooseAccountBg3, fg: THEME.colors.textPrimary },
  { bg: THEME.colors.splashGreen1, fg: THEME.colors.textPrimary },
  { bg: THEME.colors.chooseAccountBg1, fg: THEME.colors.textPrimary },
];

const DASH_SEGMENTS = 28;

function DashDivider(): React.ReactElement {
  return (
    <View style={styles.dashRow}>
      {Array.from({ length: DASH_SEGMENTS }, (_, i) => (
        <View key={i} style={styles.dashSeg} />
      ))}
    </View>
  );
}

function presetIndexForItem(item: RecommendedServiceItem): 0 | 1 | 2 {
  if (item.headerStyleIndex != null) return item.headerStyleIndex;
  let h = 0;
  for (let i = 0; i < item.id.length; i += 1) h += item.id.charCodeAt(i);
  return (h % 3) as 0 | 1 | 2;
}

export function RecommendedServiceCard({
  item,
  cardWidth = 320,
  onPress,
  onCtaPress,
  fullWidth = false,
  upperPressableAccessibilityHint,
}: RecommendedServiceCardProps): React.ReactElement {
  const a11y = useMemo(
    () =>
      `${item.title}. ${item.categoryLabel}. ${item.summary}. ${item.priceLabel ?? ''}. ${item.badgeLabel ?? ''}.`,
    [item.badgeLabel, item.categoryLabel, item.priceLabel, item.summary, item.title],
  );

  const preset = HEADER_PRESETS[presetIndexForItem(item)];

  const handleCta = (): void => {
    (onCtaPress ?? onPress)?.();
  };

  const upperHint =
    upperPressableAccessibilityHint != null
      ? upperPressableAccessibilityHint
      : onPress != null
        ? 'Opens service details'
        : undefined;

  return (
    <View style={[styles.root, fullWidth ? styles.rootFullWidth : null, { width: cardWidth }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={a11y}
        accessibilityHint={upperHint}
        onPress={onPress}
        disabled={onPress == null}
        style={({ pressed }) => [pressed && onPress != null ? styles.upperPressed : null]}
      >
        <View style={[styles.header, { backgroundColor: preset.bg }]}>
          <Text style={[styles.headerText, { color: preset.fg }]} numberOfLines={1}>
            {item.categoryLabel}
          </Text>
          <Text style={[styles.headerText, { color: preset.fg }]} numberOfLines={1}>
            {item.headerRight}
          </Text>
        </View>

        <View style={styles.bodyUpper}>
          <View style={styles.titleBlock}>
            <View style={styles.titleLeft}>
              <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
                {item.title}
              </Text>
            </View>
            {item.badgeLabel ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText} numberOfLines={1}>
                  {item.badgeLabel}
                </Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.summary} numberOfLines={2} ellipsizeMode="tail">
            {item.summary}
          </Text>

          <DashDivider />
        </View>
      </Pressable>

      <View style={styles.footer}>
        <Text style={styles.price} numberOfLines={1}>
          {item.priceLabel != null && item.priceLabel.length > 0 ? item.priceLabel : '—'}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Get started with ${item.title}`}
          onPress={handleCta}
          disabled={onCtaPress == null && onPress == null}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          style={({ pressed }) => [
            styles.cta,
            pressed ? styles.ctaPressed : null,
            onCtaPress == null && onPress == null ? styles.ctaDisabled : null,
          ]}
        >
          <Text style={styles.ctaText}>Get started</Text>
        </Pressable>
      </View>
    </View>
  );
}

RecommendedServiceCard.displayName = 'RecommendedServiceCard';

const CARD_RADIUS = 20;
/** Kept fixed so card vertical rhythm stays predictable when width changes */
const HEADER_HEIGHT = 44;

const styles = StyleSheet.create({
  root: {
    marginRight: THEME.spacing[12],
    borderRadius: CARD_RADIUS,
    backgroundColor: THEME.colors.white,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.09,
        shadowRadius: 14,
      },
      default: {
        elevation: 3,
      },
    }),
  },
  rootFullWidth: {
    marginRight: 0,
  },
  upperPressed: {
    opacity: 0.96,
  },
  header: {
    height: HEADER_HEIGHT,
    paddingHorizontal: THEME.spacing[12],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: THEME.spacing[8],
  },
  headerText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    letterSpacing: 0.3,
    flexShrink: 1,
  },
  bodyUpper: {
    paddingHorizontal: THEME.spacing[12],
    paddingTop: THEME.spacing[8],
    paddingBottom: THEME.spacing[4],
    backgroundColor: THEME.colors.white,
  },
  titleBlock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: THEME.spacing[8],
    marginBottom: THEME.spacing[4],
  },
  titleLeft: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.2,
    lineHeight: 22,
  },
  badge: {
    flexShrink: 0,
    marginTop: 0,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(37, 99, 235, 0.10)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(37, 99, 235, 0.2)',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: '#2563EB',
    textTransform: 'uppercase',
  },
  summary: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
    lineHeight: 17,
    marginBottom: THEME.spacing[8],
  },
  dashRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  dashSeg: {
    width: 6,
    height: 1,
    borderRadius: 0.5,
    backgroundColor: THEME.colors.border,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: THEME.spacing[8],
    paddingHorizontal: THEME.spacing[12],
    paddingTop: THEME.spacing[4],
    paddingBottom: THEME.spacing[8],
    backgroundColor: THEME.colors.white,
  },
  price: {
    flex: 1,
    minWidth: 0,
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.3,
  },
  cta: {
    flexShrink: 0,
    paddingHorizontal: THEME.spacing[12],
    height: 36,
    borderRadius: 999,
    backgroundColor: '#0B1220',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaPressed: {
    opacity: 0.9,
  },
  ctaDisabled: {
    opacity: 0.55,
  },
  ctaText: {
    color: THEME.colors.white,
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
  },
});
