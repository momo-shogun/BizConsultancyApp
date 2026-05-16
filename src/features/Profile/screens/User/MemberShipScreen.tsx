import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { THEME } from '@/constants/theme';
import { SafeAreaWrapper, ScreenHeader, ScreenWrapper } from '@/shared/components';

import { styles } from './MembershipScreen.styles';

// ── Types ─────────────────────────────────────────────────────────────────────
type PlanNameStyle = 'white' | 'blue' | 'amber';
type FeatureIconVariant = 'pill' | 'tag' | 'glyph';

interface FeatureIcon {
  variant: FeatureIconVariant;
  content: string;
}

interface FeatureChip {
  icon: FeatureIcon;
  label: string;
}

interface PriceOption {
  id: string;
  duration: string;
  totalPrice: number;
  perMonth: number;
}

interface Plan {
  id: string;
  name: string;
  nameStyle: PlanNameStyle;
  /** hex for card background */
  cardBgColor: string;
  /** optional gradient overlay color at 0.35 opacity layered on top */
  gradientOverlayColor?: string;
  adsLabel?: string;
  features: FeatureChip[];
  priceOptions: PriceOption[];
  hollywoodNote?: string;
  defaultCollapsed?: boolean;
}

// ── Static config ─────────────────────────────────────────────────────────────
const PLANS: Plan[] = [
  {
    id: 'mobile',
    name: 'Mobile',
    nameStyle: 'white',
    cardBgColor: '#fdf8f3',
    features: [
      { icon: { variant: 'pill', content: 'x1' }, label: '1 device' },
      { icon: { variant: 'glyph', content: '▭' }, label: 'Mobile Only' },
      { icon: { variant: 'glyph', content: '▶🔒' }, label: 'No\nHollywood' },
      { icon: { variant: 'tag', content: 'Ads' }, label: 'With Ads' },
      { icon: { variant: 'tag', content: 'HD' }, label: 'HD 720p' },
    ],
    priceOptions: [
      { id: '3m', duration: '3 MONTHS', totalPrice: 149, perMonth: 50 },
      { id: '1y', duration: '1 YEAR', totalPrice: 499, perMonth: 42 },
    ],
    hollywoodNote: 'Excludes Hollywood',
    defaultCollapsed: false,
  },
  {
    id: 'super',
    name: 'Super',
    nameStyle: 'blue',
    cardBgColor: '#FFFDF0',

    features: [
      { icon: { variant: 'pill', content: 'x2' }, label: '2 devices' },
      { icon: { variant: 'glyph', content: '🖥' }, label: 'TV, Laptop\n& Mobile' },
      { icon: { variant: 'glyph', content: '▶✓' }, label: 'All Content\nIncluded' },
      { icon: { variant: 'tag', content: 'Ads' }, label: 'With Ads' },
      { icon: { variant: 'tag', content: 'FHD' }, label: 'Full HD\n1080p' },
    ],
    priceOptions: [
      { id: '1m', duration: '1 MONTH', totalPrice: 149, perMonth: 149 },
      { id: '3m', duration: '3 MONTHS', totalPrice: 349, perMonth: 116 },
      { id: '1y', duration: '1 YEAR', totalPrice: 999, perMonth: 83 },
    ],
    defaultCollapsed: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    nameStyle: 'amber',
    cardBgColor: '#FAF7F0',
    adsLabel: 'ADS FREE',
    features: [
      { icon: { variant: 'pill', content: 'x4' }, label: '4 devices' },
      { icon: { variant: 'glyph', content: '🖥' }, label: 'TV, Laptop\n& Mobile' },
      { icon: { variant: 'glyph', content: '▶✓' }, label: 'All Content\nIncluded' },
      { icon: { variant: 'glyph', content: '🚫' }, label: 'Ad-Free' },
      { icon: { variant: 'tag', content: '4K' }, label: '4K UHD' },
    ],
    priceOptions: [
      { id: '1m', duration: '1 MONTH', totalPrice: 299, perMonth: 299 },
      { id: '3m', duration: '3 MONTHS', totalPrice: 799, perMonth: 266 },
      { id: '1y', duration: '1 YEAR', totalPrice: 1999, perMonth: 167 },
    ],
    defaultCollapsed: true,
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function buildInitialSelections(plans: Plan[]): Record<string, string> {
  const map: Record<string, string> = {};
  plans.forEach((plan) => {
    if (plan.priceOptions.length > 0) {
      map[plan.id] = plan.priceOptions[0].id;
    }
  });
  return map;
}

function buildInitialCollapsed(plans: Plan[]): Record<string, boolean> {
  const map: Record<string, boolean> = {};
  plans.forEach((plan) => {
    map[plan.id] = plan.defaultCollapsed ?? false;
  });
  return map;
}

function formatFooterLabel(planName: string, duration: string): string {
  const parts = duration.split(' ');
  const count = parts[0] ?? '';
  const unit =
    (parts[1] ?? '').charAt(0).toUpperCase() +
    (parts[1] ?? '').slice(1).toLowerCase();
  return `${planName} x ${count} ${unit}`;
}

function planNameStyle(style: PlanNameStyle) {
  if (style === 'blue') return styles.planNameBlue;
  if (style === 'amber') return styles.planNameAmber;
  return styles.planNameWhite;
}

// ── Sub-components ────────────────────────────────────────────────────────────
function FeatureIconContent({ icon }: { icon: FeatureIcon }): React.ReactElement {
  if (icon.variant === 'pill') {
    return (
      <View style={styles.featurePill}>
        <Text style={styles.featurePillText}>{icon.content}</Text>
      </View>
    );
  }
  if (icon.variant === 'tag') {
    return (
      <View style={styles.featureTagBox}>
        <Text style={styles.featureTagText}>{icon.content}</Text>
      </View>
    );
  }
  // glyph
  return <Text style={styles.featureGlyph}>{icon.content}</Text>;
}

function FeatureChipItem({ chip }: { chip: FeatureChip }): React.ReactElement {
  return (
    <View style={styles.featureChip}>
      <View style={styles.featureIconBox}>
        <FeatureIconContent icon={chip.icon} />
      </View>
      <Text style={styles.featureLabel}>{chip.label}</Text>
    </View>
  );
}

function PriceOptionButton({
  option,
  isSelected,
  onPress,
}: {
  option: PriceOption;
  isSelected: boolean;
  onPress: () => void;
}): React.ReactElement {
  return (
    <TouchableOpacity
      style={isSelected ? styles.priceOptionSelected : styles.priceOption}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {isSelected ? (
        <View style={styles.priceOptionCheckmark}>
          <Text style={styles.priceOptionCheckmarkText}>✓</Text>
        </View>
      ) : (
        <View style={styles.priceOptionRadio} />
      )}

      <Text style={styles.priceDuration}>{option.duration}</Text>
      <Text style={styles.priceAmount}>₹{option.totalPrice}</Text>
      <Text style={isSelected ? styles.pricePerMonthAmber : styles.pricePerMonth}>
        ₹{option.perMonth} per month
      </Text>
    </TouchableOpacity>
  );
}

function PlanCard({
  plan,
  selectedOptionId,
  isCollapsed,
  onSelectOption,
  onToggleCollapse,
  onHollywoodInfo,
}: {
  plan: Plan;
  selectedOptionId: string;
  isCollapsed: boolean;
  onSelectOption: (optionId: string) => void;
  onToggleCollapse: () => void;
  onHollywoodInfo?: () => void;
}): React.ReactElement {
  return (
    <View style={[styles.planCard, { backgroundColor: plan.cardBgColor }]}>
      {/* Gradient tint overlay for Super/Premium */}
      {plan.gradientOverlayColor ? (
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: plan.gradientOverlayColor, opacity: 0.28 },
          ]}
        />
      ) : null}

      <View style={styles.planCardInner}>
        {/* ── Header ── */}
        <TouchableOpacity
          style={styles.planCardHeader}
          onPress={onToggleCollapse}
          activeOpacity={0.8}
        >
          <View style={styles.planHeaderLeft}>
            <Text style={planNameStyle(plan.nameStyle)}>{plan.name}</Text>

            {plan.adsLabel ? (
              <View style={styles.adsFreeTag}>
                <Text style={styles.adsFreeText}>{plan.adsLabel}</Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.planChevronIcon}>{isCollapsed ? '∨' : '∧'}</Text>
        </TouchableOpacity>

        {/* ── Expanded body ── */}
        {!isCollapsed ? (
          <>
            <View style={styles.headerDivider} />

            {/* Feature chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featureRow}
            >
              {plan.features.map((chip, index) => (
                <FeatureChipItem key={index} chip={chip} />
              ))}
            </ScrollView>

            {/* Price options */}
            <View style={styles.priceOptionsRow}>
              {plan.priceOptions.map((option) => (
                <PriceOptionButton
                  key={option.id}
                  option={option}
                  isSelected={option.id === selectedOptionId}
                  onPress={() => onSelectOption(option.id)}
                />
              ))}
            </View>

            {/* Hollywood note */}
            {plan.hollywoodNote ? (
              <TouchableOpacity style={styles.hollywoodBanner} onPress={onHollywoodInfo}>
                <View style={styles.hollywoodLeft}>
                  <View style={styles.hollywoodIconBox}>
                    <Text style={styles.hollywoodGlyph}>▶</Text>
                    <View style={styles.hollywoodLockBadge}>
                      <Text style={styles.hollywoodLockGlyph}>🔒</Text>
                    </View>
                  </View>
                  <View style={styles.hollywoodTextGroup}>
                    <Text style={styles.hollywoodTitle}>{plan.hollywoodNote}</Text>
                    <Text style={styles.hollywoodSubtitle}>
                      Subscribe to Super / Premium for full access
                    </Text>
                  </View>
                </View>
                <Text style={styles.hollywoodChevron}>›</Text>
              </TouchableOpacity>
            ) : null}
          </>
        ) : null}
      </View>
    </View>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function MembershipScreen(): React.ReactElement {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    () => buildInitialSelections(PLANS),
  );
  const [collapsedPlans, setCollapsedPlans] = useState<Record<string, boolean>>(
    () => buildInitialCollapsed(PLANS),
  );
  const [activePlanId, setActivePlanId] = useState<string>(PLANS[0]?.id ?? '');

  function handleSelectOption(planId: string, optionId: string): void {
    setActivePlanId(planId);
    setSelectedOptions((prev) => ({ ...prev, [planId]: optionId }));
  }

  function handleToggleCollapse(planId: string): void {
    setCollapsedPlans((prev) => ({ ...prev, [planId]: !prev[planId] }));
  }

  const activePlan = PLANS.find((p) => p.id === activePlanId) ?? PLANS[0];
  const activeOptionId = selectedOptions[activePlan?.id ?? ''] ?? '';
  const activeOption = activePlan?.priceOptions.find((o) => o.id === activeOptionId);
  const footerLabel = activeOption
    ? formatFooterLabel(activePlan.name, activeOption.duration)
    : '';

  return (
    <SafeAreaWrapper edges={['top', 'bottom']}>
      <ScreenHeader title="Membership" />
      <ScreenWrapper style={styles.screen}>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
         <View style={styles.titleWrapper}>
  <Text style={styles.pageTitle}>
    Upgrade to get more out of{'\n'}
    your subscription
  </Text>

  <View style={styles.titleUnderline} />
</View>

          {PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              selectedOptionId={selectedOptions[plan.id] ?? plan.priceOptions[0]?.id ?? ''}
              isCollapsed={collapsedPlans[plan.id] ?? false}
              onSelectOption={(optionId) => handleSelectOption(plan.id, optionId)}
              onToggleCollapse={() => handleToggleCollapse(plan.id)}
              onHollywoodInfo={() => {}}
            />
          ))}
        </ScrollView>

        {/* Sticky upgrade footer */}
        <View style={styles.stickyFooter}>
          <View style={styles.stickyPriceGroup}>
            <Text style={styles.stickyPrice}>₹{activeOption?.totalPrice ?? 0}</Text>
            <Text style={styles.stickyPriceLabel}>{footerLabel}</Text>
          </View>

          <TouchableOpacity style={styles.upgradeCta} activeOpacity={0.85}>
            <Text style={styles.upgradeCtaText}>Upgrade</Text>
            <Text style={styles.upgradeCtaChevron}> ›</Text>
          </TouchableOpacity>
        </View>

      </ScreenWrapper>
    </SafeAreaWrapper>
  );
}