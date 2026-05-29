import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';
import { getMembershipPlanTheme } from '@/features/Profile/utils/membershipPlanTheme';

import type {
  ProfilePlanTeaser,
  UserProfileMembershipSectionModel,
} from '../hooks/useUserProfileMembershipSection';
import type { UserProfileMembershipBenefit } from '../types/membershipDashboard.types';

import { styles } from './UserProfileMembershipSection.styles';

type BenefitTone = 'success' | 'danger' | 'pending' | 'neutral';

function benefitTone(statusLabel: string | null): BenefitTone {
  const label = statusLabel?.toLowerCase() ?? '';
  if (label === 'delivered' || label === 'active' || label === 'used') {
    return 'success';
  }
  if (label === 'not available') {
    return 'danger';
  }
  if (label.length > 0) {
    return 'pending';
  }
  return 'neutral';
}

function BenefitStatusIcon(props: { tone: BenefitTone }): React.ReactElement {
  if (props.tone === 'success') {
    return <Ionicons name="checkmark-circle" size={17} color="#059669" />;
  }
  if (props.tone === 'danger') {
    return <Ionicons name="close-circle" size={17} color="#EF4444" />;
  }
  if (props.tone === 'pending') {
    return <Ionicons name="time-outline" size={17} color="#D97706" />;
  }
  return <Ionicons name="ellipse-outline" size={17} color="#94A3B8" />;
}

function planIconName(index: number): React.ComponentProps<typeof Ionicons>['name'] {
  if (index % 3 === 1) {
    return 'diamond-outline';
  }
  if (index % 3 === 2) {
    return 'rocket-outline';
  }
  return 'ribbon-outline';
}

function BenefitChip(props: { benefit: UserProfileMembershipBenefit }): React.ReactElement {
  const tone = benefitTone(props.benefit.statusLabel);

  return (
    <View
      style={[
        styles.benefitChip,
        tone === 'success' ? styles.benefitChipSuccess : null,
        tone === 'danger' ? styles.benefitChipDanger : null,
        tone === 'pending' ? styles.benefitChipPending : null,
      ]}
    >
      <View style={styles.benefitIconWrap}>
        <BenefitStatusIcon tone={tone} />
      </View>
      <View style={styles.benefitTextBlock}>
        <Text style={styles.benefitTitle} numberOfLines={2}>
          {props.benefit.title}
        </Text>
        {props.benefit.statusLabel != null ? (
          <Text style={styles.benefitStatus}>{props.benefit.statusLabel}</Text>
        ) : null}
      </View>
    </View>
  );
}

function PlanTeaserCard(props: {
  teaser: ProfilePlanTeaser;
  onPress: () => void;
}): React.ReactElement {
  const theme = getMembershipPlanTheme(props.teaser.themeIndex);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${props.teaser.name}, ${props.teaser.priceLabel}`}
      onPress={props.onPress}
      style={({ pressed }) => [
        styles.teaserCard,
        {
          backgroundColor: theme.cardBg,
          borderColor: theme.softBorder,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      {props.teaser.isPopular ? (
        <View style={[styles.teaserPopular, { backgroundColor: theme.badgeBg }]}>
          <Text style={[styles.teaserPopularText, { color: theme.badgeText }]}>POPULAR</Text>
        </View>
      ) : null}
      <View style={[styles.teaserIconWrap, { backgroundColor: `${theme.accent}18` }]}>
        <Ionicons name={planIconName(props.teaser.themeIndex)} size={18} color={theme.accent} />
      </View>
      <Text style={styles.teaserName} numberOfLines={2}>
        {props.teaser.name}
      </Text>
      <Text style={[styles.teaserPrice, { color: theme.accentDark }]}>{props.teaser.priceLabel}</Text>
      {props.teaser.durationLabel != null ? (
        <Text style={styles.teaserMeta}>{props.teaser.durationLabel}</Text>
      ) : null}
      <View style={styles.teaserPerks}>
        <Ionicons name="gift-outline" size={13} color="#475569" />
        <Text style={styles.teaserPerksText}>
          {props.teaser.perkCount > 0
            ? `${props.teaser.perkCount} benefits`
            : 'View plan details'}
        </Text>
      </View>
    </Pressable>
  );
}

function MembershipCta(props: {
  label: string;
  onPress: () => void;
}): React.ReactElement {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={props.label}
      onPress={props.onPress}
      style={({ pressed }) => [styles.upgradeBtn, pressed ? styles.upgradeBtnPressed : null]}
    >
      <Text style={styles.upgradeBtnText}>{props.label}</Text>
      <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
    </Pressable>
  );
}

export interface UserProfileMembershipSectionProps {
  model: UserProfileMembershipSectionModel;
}

export function UserProfileMembershipSection(
  props: UserProfileMembershipSectionProps,
): React.ReactElement {
  const { model } = props;
  const activeTheme = getMembershipPlanTheme(model.planThemeIndex);

  if (model.isLoading) {
    return (
      <View style={[styles.card, styles.loadingCard]}>
        <ActivityIndicator size="small" color={THEME.colors.primary} />
      </View>
    );
  }

  if (model.isError) {
    return (
      <View style={[styles.card, styles.body]}>
        <Text style={styles.emptyTitle}>Membership</Text>
        <Text style={styles.errorText}>Could not load your membership details.</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Retry loading membership"
          onPress={model.refetch}
          style={styles.retryBtn}
        >
          <Text style={styles.retryBtnText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  if (!model.hasPlan) {
    return (
      <View style={styles.card}>
        <View style={styles.emptyHero}>
          <Text style={styles.emptyTitle}>Choose your membership</Text>
          <Text style={styles.emptySubtitle}>
            Unlock expert consultations, Biz AI, and business tools tailored to your growth
            stage.
          </Text>
        </View>

        {model.planTeasers.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.teaserScroll}
          >
            {model.planTeasers.map((teaser) => (
              <PlanTeaserCard
                key={teaser.id}
                teaser={teaser}
                onPress={model.onMembershipPress}
              />
            ))}
          </ScrollView>
        ) : null}

        <View style={styles.emptyFooter}>
          <MembershipCta label={model.upgradeCtaLabel} onPress={model.onMembershipPress} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <LinearGradient
        colors={[activeTheme.accent, activeTheme.accentDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.planHero}
      >
        <View style={styles.planHeroTop}>
          <View style={styles.planHeroLeft}>
            <Text style={styles.planEyebrow}>Your plan</Text>
            <Text style={styles.planName} numberOfLines={2}>
              {model.planName}
            </Text>
            <View style={styles.planMetaRow}>
              {model.priceLabel != null ? (
                <View style={styles.planMetaChip}>
                  <Ionicons name="pricetag-outline" size={12} color="#FFFFFF" />
                  <Text style={styles.planMetaChipText}>{model.priceLabel}</Text>
                </View>
              ) : null}
              {model.durationLabel != null ? (
                <View style={styles.planMetaChip}>
                  <Ionicons name="calendar-outline" size={12} color="#FFFFFF" />
                  <Text style={styles.planMetaChipText}>{model.durationLabel}</Text>
                </View>
              ) : null}
            </View>
          </View>
          <View style={[styles.statusPill, !model.isActive ? styles.statusPillExpired : null]}>
            <Text
              style={[
                styles.statusPillText,
                !model.isActive ? styles.statusPillTextExpired : null,
              ]}
            >
              {model.statusLabel}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.body}>
        {model.validityText != null ? (
          <Text style={styles.progressLabel}>{model.validityText}</Text>
        ) : null}

        {model.isActive ? (
          <View style={styles.progressBlock}>
            <View style={styles.progressMeta}>
              <Text style={styles.progressLabel}>Membership period</Text>
              {model.daysRemaining != null ? (
                <Text style={styles.progressLabel}>{model.daysRemaining} days left</Text>
              ) : null}
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${model.progressPercent}%`,
                    backgroundColor: activeTheme.accent,
                  },
                ]}
              />
            </View>
          </View>
        ) : null}

        {model.upgradeHint != null ? (
          <View style={styles.hintBox}>
            <Ionicons name="sparkles" size={16} color="#B45309" />
            <Text style={styles.hintText}>{model.upgradeHint}</Text>
          </View>
        ) : null}

        <View style={styles.sectionLabelRow}>
          <Text style={styles.sectionLabel}>Plan benefits</Text>
          {model.benefits.length > 0 ? (
            <Text style={styles.sectionCount}>{model.benefits.length} included</Text>
          ) : null}
        </View>

        {model.benefits.length === 0 ? (
          <Text style={styles.emptyBenefits}>
            Benefit details will appear here once your plan scopes are active.
          </Text>
        ) : (
          <View style={styles.benefitsGrid}>
            {model.benefits.map((benefit) => (
              <BenefitChip key={benefit.id} benefit={benefit} />
            ))}
          </View>
        )}

        {model.showUpgradeCta ? (
          <MembershipCta label={model.upgradeCtaLabel} onPress={model.onMembershipPress} />
        ) : null}
      </View>
    </View>
  );
}
