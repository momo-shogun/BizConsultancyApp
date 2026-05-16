import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { THEME } from '@/constants/theme';
import { SafeAreaWrapper, ScreenHeader, ScreenWrapper } from '@/shared/components';

import { styles } from './UserMembershipScreen.styles';
import { AccountStackParamList } from '@/navigation/types';
import { NavigationProp, useNavigation } from '@react-navigation/native';

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
  cardBgColor: string;
  gradientOverlayColor?: string;
  adsLabel?: string;
  features: FeatureChip[];
  priceOptions: PriceOption[];
  hollywoodNote?: string;
  defaultCollapsed?: boolean;
  icon: string;
  gstNote: string;
  featureList: string[];
  ctaLabel: string;
}

// ── Static config ─────────────────────────────────────────────────────────────
const PLANS: Plan[] = [
  {
    id: 'BASIC',
    name: 'Executive',
    nameStyle: 'white',
    cardBgColor: '#F0F4FF',
    icon: '⭐',
    gstNote: 'GST Inclusive • 365 Days',
    ctaLabel: 'Start with Executive',
    features: [
      { icon: { variant: 'glyph', content: '✓' },  label: 'Verified\nConsultant' },
      { icon: { variant: 'glyph', content: '📁' }, label: 'Document\nLocker' },
      { icon: { variant: 'glyph', content: '🎙' }, label: 'Webinar &\nWorkshop' },
      { icon: { variant: 'glyph', content: '🎬' }, label: 'Expert\nTalk Shoot' },
      { icon: { variant: 'glyph', content: '▶' },  label: 'Intro\nVideo' },
    ],
    featureList: [
      'Verified Consultant Status',
      'Document Locker Facility',
      'Webinar & Workshop',
      'Expert Talk shoot',
      'One Intro Video for Biz Profile',
      'Verified Consultant Status',
    ],
    priceOptions: [
      { id: '1y', duration: '365 DAYS', totalPrice: 5900, perMonth: 492 },
    ],
    defaultCollapsed: false,
  },
  {
    id: 'PRO',
    name: 'Silver',
    nameStyle: 'blue',
    cardBgColor: '#F0FFF8',
    icon: '🎯',
    gstNote: 'GST Inclusive • 365 Days',
    ctaLabel: 'Start with Silver',
    features: [
      { icon: { variant: 'glyph', content: '✓' },  label: 'Verified\nConsultant' },
      { icon: { variant: 'pill', content: '1K' },   label: 'Wallet\nCredit' },
      { icon: { variant: 'glyph', content: '🎬' }, label: 'Biz Profile\nVideo' },
      { icon: { variant: 'glyph', content: '🔥' }, label: 'Hot\nLeads' },
      { icon: { variant: 'tag', content: '5' },     label: 'Subject\nVideos' },
    ],
    featureList: [
      'Verified Consultant Status',
      'Executive Member Status (1K wallet credit for business support services)',
      'Professional Biz Profile Video Creation',
      'Participation as Expert in Webinar',
      'Enhanced Social Media promotion (Webinar) — Personalized creative with expert name, FB, YT and Insta Marketing Campaign',
      'Access to Hot Leads',
      'Five Subject Videos Uploading on Biz Platform',
      'Dedicated Relationship Executive',
    ],
    priceOptions: [
      { id: '1y', duration: '365 DAYS', totalPrice: 11800, perMonth: 983 },
    ],
    defaultCollapsed: false,
  },
  {
    id: 'ADVANCE',
    name: 'Gold',
    nameStyle: 'amber',
    cardBgColor: '#FFFBF0',
    adsLabel: 'TOP TIER',
    icon: '🚀',
    gstNote: 'GST Inclusive • 730 Days',
    ctaLabel: 'Start with Gold',
    features: [
      { icon: { variant: 'pill', content: '2K' },   label: 'Wallet\nCredit' },
      { icon: { variant: 'glyph', content: '🎯' }, label: 'Workshop\n& Events' },
      { icon: { variant: 'tag', content: '10' },    label: 'Subject\nVideos' },
      { icon: { variant: 'glyph', content: '📸' }, label: 'Product\nShoot (10)' },
      { icon: { variant: 'glyph', content: '💼' }, label: 'CRM\nFacility' },
    ],
    featureList: [
      'Verified Consultant Status',
      'Associate Member Status (2K wallet credit for business support services)',
      'Professional Biz Profile Video Creation',
      'Participation as Expert in Workshop, Webinar and Other Events',
      'Social Media promotion (Webinar & Workshop) — Personalized creative with expert name, FB, YT and Insta Marketing Campaign',
      'Access to Hot Leads',
      'Ten Subject Videos Uploading on Biz Platform',
      'Dedicated Relationship Executive',
      'Expert Talk Show or Success Story Video Shoot',
      'Product Shoot (10)',
      'CRM Facility',
    ],
    priceOptions: [
      { id: '2y', duration: '730 DAYS', totalPrice: 23600, perMonth: 983 },
    ],
    defaultCollapsed: false,
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

function formatFooterLabel(planName: string, duration: string): string {
  const parts = duration.split(' ');
  const count = parts[0] ?? '';
  const unit =
    (parts[1] ?? '').charAt(0).toUpperCase() +
    (parts[1] ?? '').slice(1).toLowerCase();
  return `${planName} x ${count} ${unit}`;
}

function accentColor(nameStyle: PlanNameStyle): string {
  if (nameStyle === 'blue') return '#2563EB';
  if (nameStyle === 'amber') return '#D97706';
  return '#6366F1';
}

function badgeBgColor(nameStyle: PlanNameStyle): string {
  if (nameStyle === 'blue') return '#DBEAFE';
  if (nameStyle === 'amber') return '#FEF3C7';
  return '#E0E7FF';
}

function planNameColor(nameStyle: PlanNameStyle): string {
  if (nameStyle === 'blue') return '#2563EB';
  if (nameStyle === 'amber') return '#B45309';
  return '#4F46E5';
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

function FeatureListItem({
  text,
  accent,
}: {
  text: string;
  accent: string;
}): React.ReactElement {
  return (
    <View style={styles.featureListItem}>
      <View style={[styles.featureListDot, { backgroundColor: accent }]}>
        <Text style={styles.featureListDotText}>✓</Text>
      </View>
      <Text style={styles.featureListText}>{text}</Text>
    </View>
  );
}

function PriceOptionButton({
  option,
  isSelected,
  accent,
  onPress,
}: {
  option: PriceOption;
  isSelected: boolean;
  accent: string;
  onPress: () => void;
}): React.ReactElement {
  return (
    <TouchableOpacity
      style={[
        isSelected ? styles.priceOptionSelected : styles.priceOption,
        isSelected && { borderColor: accent },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {isSelected ? (
        <View style={[styles.priceOptionCheckmark, { backgroundColor: accent }]}>
          <Text style={styles.priceOptionCheckmarkText}>✓</Text>
        </View>
      ) : (
        <View style={styles.priceOptionRadio} />
      )}
      <Text style={styles.priceDuration}>{option.duration}</Text>
      <Text style={styles.priceAmount}>₹{option.totalPrice.toLocaleString('en-IN')}</Text>
      <Text style={[styles.pricePerMonth, isSelected && { color: accent }]}>
        ₹{option.perMonth.toLocaleString('en-IN')} per month
      </Text>
    </TouchableOpacity>
  );
}

function PlanCard({
  plan,
  selectedOptionId,
  isActive,
  onSelectOption,
  onCardPress,
}: {
  plan: Plan;
  selectedOptionId: string;
  isActive: boolean;
  onSelectOption: (optionId: string) => void;
  onCardPress: () => void;
}): React.ReactElement {
  const accent = accentColor(plan.nameStyle);
  const nameColor = planNameColor(plan.nameStyle);
  const bgBadge = badgeBgColor(plan.nameStyle);

  return (
    <TouchableOpacity
      activeOpacity={0.97}
      onPress={onCardPress}
      style={[
        styles.planCard,
        { backgroundColor: plan.cardBgColor },
        isActive && {
          borderColor: accent,
          borderWidth: 2,
          shadowColor: accent,
          shadowOpacity: 0.22,
          shadowRadius: 16,
          elevation: 8,
        },
      ]}
    >
      <View style={styles.planCardInner}>

        {/* ── Selected checkmark badge (top-left) ── */}
        {isActive && (
          <View
            style={{
              position: 'absolute',
              top: 14,
              left: 14,
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: accent,
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700', lineHeight: 14 }}>✓</Text>
          </View>
        )}

        {/* ── Top blob decoration ── */}
        <View style={[styles.cardBlob, { backgroundColor: accent }]} />

        {/* ── Icon ── */}
        <View style={[styles.cardIconWrapper, { backgroundColor: accent }]}>
          <Text style={styles.cardIconEmoji}>{plan.icon}</Text>
        </View>

        {/* ── Badge (BASIC / PRO / ADVANCE) ── */}
        <View style={[styles.cardBadge, { backgroundColor: accent }]}>
          <Text style={styles.cardBadgeText}>{plan.id}</Text>
        </View>

        {/* ── Plan name ── */}
        <Text style={[styles.cardPlanName, { color: nameColor }]}>{plan.name}</Text>

        {/* ── Price ── */}
        <Text style={styles.cardPrice}>
          ₹{plan.priceOptions[0]?.totalPrice.toLocaleString('en-IN') ?? '—'}
        </Text>
        <Text style={styles.cardGstNote}>{plan.gstNote}</Text>

        {/* ── ADS / TOP TIER label ── */}
        {plan.adsLabel ? (
          <View style={[styles.adsFreeTag, { backgroundColor: bgBadge, borderColor: accent }]}>
            <Text style={[styles.adsFreeText, { color: accent }]}>{plan.adsLabel}</Text>
          </View>
        ) : null}

        <View style={styles.headerDivider} />

        {/* ── Feature chips (horizontal scroll) ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featureRow}
        >
          {plan.features.map((chip, index) => (
            <FeatureChipItem key={index} chip={chip} />
          ))}
        </ScrollView>

        {/* ── Full feature list ── */}
        <View style={styles.featureListContainer}>
          {plan.featureList.map((text, index) => (
            <FeatureListItem key={index} text={text} accent={accent} />
          ))}
        </View>

        {/* ── Price options ── */}
        <View style={styles.priceOptionsRow}>
          {plan.priceOptions.map((option) => (
            <PriceOptionButton
              key={option.id}
              option={option}
              isSelected={option.id === selectedOptionId}
              accent={accent}
              onPress={() => onSelectOption(option.id)}
            />
          ))}
        </View>


      </View>
    </TouchableOpacity>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function UserMembershipScreen(): React.ReactElement {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    () => buildInitialSelections(PLANS),
  );
  const [activePlanId, setActivePlanId] = useState<string>(PLANS[0]?.id ?? '');

  function handleSelectOption(planId: string, optionId: string): void {
    setActivePlanId(planId);
    setSelectedOptions((prev) => ({ ...prev, [planId]: optionId }));
  }

  function handleCardPress(planId: string): void {
    setActivePlanId(planId);
  }
const navigation = useNavigation<NavigationProp<AccountStackParamList>>();
  const activePlan = PLANS.find((p) => p.id === activePlanId) ?? PLANS[0];
  const activeOptionId = selectedOptions[activePlan?.id ?? ''] ?? '';
  const activeOption = activePlan?.priceOptions.find((o) => o.id === activeOptionId);
  const footerLabel = activeOption
    ? formatFooterLabel(activePlan.name, activeOption.duration)
    : '';

  const footerAccent = accentColor(activePlan.nameStyle);

  return (
       <SafeAreaWrapper edges={['top', 'bottom']} bgColor="white">
         <ScreenHeader
           title="Membership"
           onBackPress={() => navigation.goBack()}
         />
      <ScreenWrapper style={styles.screen}>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Page title ── */}
          <View style={styles.titleWrapper}>
            <Text style={styles.pageTitle}>
              Built for{'\n'}
              <Text style={styles.pageTitleAccent}>professional consultants</Text>
            </Text>
            <View style={styles.titleUnderline} />
            <Text style={styles.pageSubtitle}>
              Unlock unlimited sessions, advanced analytics, and a Stripe-level client
              experience with our consultant plans.
            </Text>
          </View>

          {PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isActive={plan.id === activePlanId}
              selectedOptionId={selectedOptions[plan.id] ?? plan.priceOptions[0]?.id ?? ''}
              onSelectOption={(optionId) => handleSelectOption(plan.id, optionId)}
              onCardPress={() => handleCardPress(plan.id)}
            />
          ))}
        </ScrollView>

        {/* ── Sticky upgrade footer ── */}
        <View style={styles.stickyFooter}>
          <View style={styles.stickyPriceGroup}>

            {/* ── Plan badge + name ── */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <View
                style={{
                  backgroundColor: footerAccent,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 999,
                }}
              >
                <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700', letterSpacing: 0.8 }}>
                  {activePlan.id}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: planNameColor(activePlan.nameStyle),
                }}
              >
                {activePlan.name}
              </Text>
            </View>

            {/* ── Price ── */}
            <Text style={styles.stickyPrice}>
              ₹{activeOption?.totalPrice.toLocaleString('en-IN') ?? 0}
            </Text>
            <Text style={styles.stickyPriceLabel}>{footerLabel}</Text>
          </View>

          <TouchableOpacity
            style={[styles.upgradeCta, { backgroundColor: footerAccent }]}
            activeOpacity={0.85}
          >
            <Text style={styles.upgradeCtaText}>{activePlan.ctaLabel}</Text>
            <Text style={styles.upgradeCtaChevron}> ›</Text>
          </TouchableOpacity>
        </View>

      </ScreenWrapper>
    </SafeAreaWrapper>
  );
}