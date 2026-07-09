import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';
import { diagnosisIconName, getDiagnosisPlanTheme } from '../constants/diagnosisPlanTheme';
import { DIAGNOSIS_THEME } from '../constants/diagnosisTheme';
import type { DiagnosisPlanViewModel } from '../types/diagnostics.types';

export const DIAGNOSIS_PLAN_CARD_WIDTH = 300;

export interface DiagnosisPlanCardProps {
  plan: DiagnosisPlanViewModel;
  onPress: (planId: number) => void;
}

function InclusionRow({
  title,
  accent,
}: {
  title: string;
  accent: string;
}): React.ReactElement {
  return (
    <View style={styles.scopeRow}>
      <Ionicons name="checkmark-circle" size={18} color={accent} />
      <View style={styles.scopeTextBlock}>
        <Text style={styles.scopeTitle} numberOfLines={2}>
          {title}
        </Text>
      </View>
    </View>
  );
}

export function DiagnosisPlanCard({ plan, onPress }: DiagnosisPlanCardProps): React.ReactElement {
  const theme = useMemo(
    () => getDiagnosisPlanTheme(plan.id, plan.title),
    [plan.id, plan.title],
  );
  const iconName = useMemo(() => diagnosisIconName(plan.title), [plan.title]);

  const isDisabled = plan.ctaMode === 'active' || plan.ctaMode === 'disabled_lower';
  const isPrimary = plan.ctaMode === 'purchase' || plan.ctaMode === 'upgrade';
  const isActive = plan.ctaMode === 'active';
  const borderWidth = plan.isPopular || isActive ? 2 : 1;
  const borderColor = isActive
    ? theme.accent
    : plan.isPopular
      ? theme.accent
      : theme.softBorder;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={plan.ctaLabel}
      disabled={isDisabled}
      onPress={() => onPress(plan.id)}
      style={({ pressed }) => [
        styles.planCard,
        {
          backgroundColor: theme.cardBg,
          borderColor,
          borderWidth,
          shadowColor: theme.accent,
        },
        (plan.isPopular || isActive) ? styles.planCardHighlighted : null,
        pressed && !isDisabled ? styles.planCardPressed : null,
        isDisabled ? styles.planCardDisabled : null,
      ]}
    >
      <View style={[styles.cardBlob, { backgroundColor: theme.accent }]} />

      <View style={styles.planCardBody}>
        <View style={styles.planHeaderRow}>
          <View style={styles.planTitleBlock}>
            <View style={styles.badgeRow}>
              <View style={[styles.badge, { backgroundColor: theme.badgeBg }]}>
                <Text style={[styles.badgeText, { color: theme.badgeText }]}>Diagnostic</Text>
              </View>
              {plan.isPopular ? (
                <View style={[styles.popularBadge, { borderColor: theme.accent }]}>
                  <Text style={[styles.popularBadgeText, { color: theme.accentDark }]}>
                    Most popular
                  </Text>
                </View>
              ) : null}
              {isActive ? (
                <View style={[styles.activeBadge, { backgroundColor: DIAGNOSIS_THEME.brandPrimary }]}>
                  <Text style={styles.activeBadgeText}>Active</Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.planName, { color: theme.accentDark }]}>{plan.title}</Text>
            {plan.idealFor != null && plan.idealFor.length > 0 ? (
              <Text style={styles.planDescription} numberOfLines={2}>
                {plan.idealFor}
              </Text>
            ) : null}
          </View>

          <View style={styles.planHeaderTrailing}>
            {isActive ? (
              <View style={[styles.selectedCheckInline, { backgroundColor: theme.accent }]}>
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              </View>
            ) : null}
            <View style={[styles.iconCircle, { backgroundColor: theme.iconBg }]}>
              <Ionicons name={iconName} size={22} color="#FFFFFF" />
            </View>
          </View>
        </View>

        <View style={styles.priceRow}>
          <Text style={[styles.priceAmount, { color: theme.accentDark }]}>{plan.priceLabel}</Text>
        </View>
        <Text style={styles.metaText}>Excl. GST · Pay via wallet or Razorpay</Text>

        {plan.features.length > 0 ? (
          <>
            <View style={[styles.divider, { backgroundColor: theme.softBorder }]} />
            <Text style={[styles.sectionTitle, { color: theme.accentDark }]}>
              {"What's included"}
            </Text>
            {plan.features.map((feature) => (
              <InclusionRow key={feature} title={feature} accent={theme.accent} />
            ))}
          </>
        ) : null}

        <View
          style={[
            styles.upgradeCta,
            {
              backgroundColor: isPrimary ? theme.accent : '#E2E8F0',
            },
            isDisabled && styles.upgradeCtaDisabled,
          ]}
        >
          <Text
            style={[
              styles.upgradeCtaText,
              !isPrimary && styles.upgradeCtaTextMuted,
            ]}
          >
            {plan.ctaLabel}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  planCard: {
    width: DIAGNOSIS_PLAN_CARD_WIDTH,
    marginRight: THEME.spacing[12],
    borderRadius: 18,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 5,
  },
  planCardHighlighted: {
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 8,
  },
  planCardPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.99 }],
  },
  planCardDisabled: {
    opacity: 0.88,
  },
  cardBlob: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 96,
    height: 76,
    borderBottomLeftRadius: 56,
    borderTopRightRadius: 18,
    opacity: 0.2,
  },
  planCardBody: {
    padding: THEME.spacing[16],
  },
  planHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: THEME.spacing[12],
  },
  planTitleBlock: {
    flex: 1,
    minWidth: 0,
  },
  planHeaderTrailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 5,
    marginBottom: THEME.spacing[8],
  },
  badge: {
    paddingHorizontal: THEME.spacing[10],
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: THEME.typography.size[12],
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  popularBadge: {
    paddingHorizontal: THEME.spacing[10],
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
  },
  popularBadgeText: {
    fontSize: THEME.typography.size[12],
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  activeBadge: {
    paddingHorizontal: THEME.spacing[10],
    paddingVertical: 4,
    borderRadius: 999,
  },
  activeBadgeText: {
    fontSize: THEME.typography.size[12],
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  selectedCheckInline: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planName: {
    fontSize: THEME.typography.size[20],
    fontWeight: '700',
  },
  planDescription: {
    marginTop: 4,
    fontSize: THEME.typography.size[12],
    color: DIAGNOSIS_THEME.textSecondary,
    lineHeight: 18,
  },
  priceRow: {
    marginTop: THEME.spacing[14],
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: THEME.spacing[8],
  },
  priceAmount: {
    fontSize: THEME.typography.size[28],
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  metaText: {
    marginTop: 6,
    fontSize: THEME.typography.size[12],
    color: DIAGNOSIS_THEME.textSecondary,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    marginVertical: THEME.spacing[16],
  },
  sectionTitle: {
    fontSize: THEME.typography.size[12],
    fontWeight: '700',
    marginBottom: THEME.spacing[10],
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  scopeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: THEME.spacing[10],
    marginBottom: THEME.spacing[10],
  },
  scopeTextBlock: {
    flex: 1,
    minWidth: 0,
  },
  scopeTitle: {
    fontSize: THEME.typography.size[14],
    color: DIAGNOSIS_THEME.textPrimary,
    lineHeight: 20,
  },
  upgradeCta: {
    marginTop: THEME.spacing[4],
    paddingVertical: THEME.spacing[14],
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  upgradeCtaDisabled: {
    opacity: 0.65,
  },
  upgradeCtaText: {
    fontSize: THEME.typography.size[16],
    fontWeight: '700',
    color: THEME.colors.white,
  },
  upgradeCtaTextMuted: {
    color: DIAGNOSIS_THEME.textSecondary,
  },
});
