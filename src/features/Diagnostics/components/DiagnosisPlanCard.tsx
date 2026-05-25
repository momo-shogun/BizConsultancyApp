import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { DIAGNOSIS_THEME, getPlanTierVisual, hexToRgba } from '../constants/diagnosisTheme';
import type { DiagnosisPlanViewModel } from '../types/diagnostics.types';

export const DIAGNOSIS_PLAN_CARD_WIDTH = 272;

export interface DiagnosisPlanCardProps {
  plan: DiagnosisPlanViewModel;
  onPress: (planId: number) => void;
}

export function DiagnosisPlanCard({ plan, onPress }: DiagnosisPlanCardProps): React.ReactElement {
  const tier = useMemo(() => getPlanTierVisual(plan.title), [plan.title]);
  const isDisabled = plan.ctaMode === 'active' || plan.ctaMode === 'disabled_lower';
  const isPrimary = plan.ctaMode === 'purchase' || plan.ctaMode === 'upgrade';
  const tagBg = useMemo(() => hexToRgba(tier.accent, 0.1), [tier.accent]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={plan.ctaLabel}
      disabled={isDisabled}
      onPress={() => onPress(plan.id)}
      style={({ pressed }) => [
        styles.card,
        plan.isPopular && styles.cardPopular,
        pressed && !isDisabled ? styles.cardPressed : null,
        isDisabled ? styles.cardDisabled : null,
      ]}
    >
      <View style={styles.heroWrap}>
        <LinearGradient
          colors={[tier.gradient[0], tier.gradient[1]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        >
          <Ionicons
            name={tier.icon as React.ComponentProps<typeof Ionicons>['name']}
            size={32}
            color="rgba(255,255,255,0.95)"
          />
        </LinearGradient>

        <LinearGradient
          colors={['transparent', 'rgba(15,23,42,0.45)']}
          style={styles.heroOverlay}
        />

        {plan.isPopular ? (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>Most popular</Text>
          </View>
        ) : null}

        {plan.ctaMode === 'active' ? (
          <View style={styles.activeBadge}>
            <Ionicons name="checkmark-circle" size={12} color="#FFFFFF" />
            <Text style={styles.activeBadgeText}>Active</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.body}>
        <Text style={styles.packName}>{plan.title}</Text>
        <Text style={[styles.price, { color: tier.accent }]}>{plan.priceLabel}</Text>
        {plan.idealFor != null && plan.idealFor.length > 0 ? (
          <Text style={styles.idealFor} numberOfLines={2}>
            {plan.idealFor}
          </Text>
        ) : null}

        <View style={styles.features}>
          {plan.features.slice(0, 4).map((feature) => (
            <View key={feature} style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={14} color={tier.accent} />
              <Text style={styles.featureText} numberOfLines={1}>
                {feature}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <View style={[styles.tierTag, { backgroundColor: tagBg }]}>
            <Text style={[styles.tierTagText, { color: tier.accent }]}>Diagnostic pack</Text>
          </View>
          <View
            style={[
              styles.ctaCircle,
              isPrimary ? { backgroundColor: tier.accent } : styles.ctaCircleMuted,
              isDisabled && styles.ctaCircleDisabled,
            ]}
          >
            <Text style={styles.ctaArrow}>{isDisabled ? '✓' : '→'}</Text>
          </View>
        </View>

        <Text
          style={[
            styles.ctaLabel,
            isPrimary ? { color: tier.accent } : styles.ctaLabelMuted,
          ]}
        >
          {plan.ctaLabel}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: DIAGNOSIS_PLAN_CARD_WIDTH,
    marginRight: 12,
    borderRadius: 16,
    backgroundColor: DIAGNOSIS_THEME.contentBg,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: DIAGNOSIS_THEME.border,
    shadowColor: DIAGNOSIS_THEME.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 14,
    elevation: 3,
  },
  cardPopular: {
    borderWidth: 2,
    borderColor: DIAGNOSIS_THEME.heroAccentBorder,
  },
  cardPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.98 }],
  },
  cardDisabled: {
    opacity: 0.88,
  },
  heroWrap: {
    height: 96,
    position: 'relative',
  },
  heroGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  popularBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255,255,255,0.94)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  popularText: {
    fontSize: 9,
    fontWeight: '800',
    color: DIAGNOSIS_THEME.heroAccent,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  activeBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: DIAGNOSIS_THEME.brandPrimary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  activeBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  body: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 14,
  },
  packName: {
    fontSize: 18,
    fontWeight: '800',
    color: DIAGNOSIS_THEME.textPrimary,
    letterSpacing: -0.2,
  },
  price: {
    fontSize: 24,
    fontWeight: '900',
    marginTop: 2,
    marginBottom: 6,
  },
  idealFor: {
    fontSize: 12,
    color: DIAGNOSIS_THEME.textSecondary,
    lineHeight: 17,
    marginBottom: 10,
  },
  features: {
    gap: 6,
    marginBottom: 12,
    minHeight: 88,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    flex: 1,
    fontSize: 12,
    color: '#334155',
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tierTag: {
    flex: 1,
    marginRight: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tierTagText: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  ctaCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaCircleMuted: {
    backgroundColor: '#E2E8F0',
  },
  ctaCircleDisabled: {
    backgroundColor: '#CBD5E1',
  },
  ctaArrow: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  ctaLabel: {
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  ctaLabelMuted: {
    color: DIAGNOSIS_THEME.textSecondary,
  },
});
