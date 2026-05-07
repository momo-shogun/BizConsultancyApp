import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';

export interface MembershipPlanItem {
  id: string;
  audienceLabel?: string;
  title: string;
  subtitle?: string;
  priceLabel: string;
  periodLabel?: string;
  badgeLabel?: string;
  ctaLabel?: string;
  features: string[];
  gradientColors: readonly [string, string];
}

export interface MembershipPlanCardProps {
  item: MembershipPlanItem;
  cardWidth?: number;
  onPress?: () => void;
  onCtaPress?: () => void;
}

export function MembershipPlanCard(props: MembershipPlanCardProps): React.ReactElement {
  const { item, cardWidth = 320, onPress, onCtaPress } = props;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.title} membership plan`}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed, { width: cardWidth }]}
    >
      <LinearGradient colors={[...item.gradientColors]} style={styles.card}>
        <View style={styles.topRow}>
          {item.audienceLabel ? (
            <View style={styles.audienceRow}>
              <View style={styles.dot} />
              <Text style={styles.audienceLabel}>{item.audienceLabel}</Text>
            </View>
          ) : (
            <View />
          )}
          {item.badgeLabel ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.badgeLabel}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroText}>
            <Text style={styles.title}>{item.title}</Text>
            {item.subtitle ? <Text style={styles.subtitle}>{item.subtitle}</Text> : null}
          </View>

          <View style={styles.priceAndCtaRow}>
            <View style={styles.priceRow}>
              <Text style={styles.price}>{item.priceLabel}</Text>
              <Text style={styles.period}>{item.periodLabel ?? '/mo'}</Text>
            </View>

            {item.ctaLabel ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={item.ctaLabel}
                hitSlop={8}
                onPress={onCtaPress}
                style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
              >
                <Text style={styles.ctaText}>{item.ctaLabel}</Text>
              </Pressable>
            ) : null}
          </View>
        </View>

        <View style={styles.featuresGrid}>
          {item.features.map((feature) => (
            <View key={feature} style={styles.featureItem}>
              <View style={styles.check}>
                <Ionicons name="checkmark" size={14} color={THEME.colors.white} />
              </View>
              <Text style={styles.featureText} numberOfLines={2}>
                {feature}
              </Text>
            </View>
          ))}
        </View>
      </LinearGradient>
    </Pressable>
  );
}

MembershipPlanCard.displayName = 'MembershipPlanCard';

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 24,
  },
  pressed: {
    opacity: 0.92,
  },
  card: {
    borderRadius: 24,
    padding: THEME.spacing[16],
    gap: THEME.spacing[16],
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: THEME.spacing[12],
  },
  audienceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
    flexShrink: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  audienceLabel: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: 'rgba(255,255,255,0.92)',
    letterSpacing: 0.2,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.86)',
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[8],
    borderRadius: 999,
  },
  badgeText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.primary,
  },
  heroCard: {
    backgroundColor: THEME.colors.white,
    borderRadius: 18,
    padding: THEME.spacing[16],
    marginHorizontal: THEME.spacing[8],
    alignSelf: 'stretch',
    shadowColor: THEME.colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 6,
  },
  heroText: {
    gap: THEME.spacing[4],
  },
  title: {
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.35,
    lineHeight: 26,
  },
  subtitle: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textSecondary,
    lineHeight: 22,
  },
  priceAndCtaRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: THEME.spacing[12],
    gap: THEME.spacing[12],
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: THEME.spacing[4],
  },
  price: {
    fontSize: 18,
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.8,
  },
  period: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textSecondary,
    marginBottom: 4,
  },
  cta: {
    backgroundColor: THEME.colors.black,
    borderRadius: 999,
    paddingVertical: THEME.spacing[12],
    paddingHorizontal: THEME.spacing[16],
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
  },
  ctaPressed: {
    opacity: 0.9,
  },
  ctaText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.white,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: THEME.spacing[12],
    columnGap: THEME.spacing[12],
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '47%',
    gap: THEME.spacing[8],
  },
  check: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  featureText: {
    flex: 1,
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: 'rgba(255,255,255,0.92)',
    lineHeight: 16,
  },
});

