import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';

import {
  useUserProfileMembershipSection,
  type ProfileMembershipLine,
} from '../hooks/useUserProfileMembershipSection';

import { styles } from './UserProfileMembershipSection.styles';

function BenefitStatusIcon(props: { statusLabel: string | null }): React.ReactElement {
  const label = props.statusLabel?.toLowerCase() ?? '';
  if (label === 'delivered' || label === 'active' || label === 'used') {
    return <Ionicons name="checkmark-circle" size={18} color="#059669" />;
  }
  if (label === 'not available') {
    return <Ionicons name="close-circle" size={18} color="#EF4444" />;
  }
  return <Ionicons name="time-outline" size={18} color="#D97706" />;
}

export interface UserProfileMembershipSectionProps {
  membershipLine?: ProfileMembershipLine;
}

export function UserProfileMembershipSection(
  props: UserProfileMembershipSectionProps = {},
): React.ReactElement {
  const membershipLine = props.membershipLine ?? 'users';
  const model = useUserProfileMembershipSection({ enabled: true, membershipLine });

  if (model.isLoading) {
    return (
      <View style={[styles.card, styles.loadingCard]}>
        <ActivityIndicator size="small" color={THEME.colors.primary} />
      </View>
    );
  }

  if (model.isError) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Membership</Text>
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
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Membership</Text>
            <Text style={styles.subtitle}>
              You do not have an active plan yet. Compare tiers and choose one that fits your
              stage.
            </Text>
          </View>
          <Ionicons name="ribbon-outline" size={22} color="#059669" />
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={model.upgradeCtaLabel}
          onPress={model.onMembershipPress}
          style={({ pressed }) => [styles.upgradeBtn, pressed ? styles.upgradeBtnPressed : null]}
        >
          <Text style={styles.upgradeBtnText}>{model.upgradeCtaLabel}</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.title}>{model.planName}</Text>
          {model.validityText != null ? (
            <Text style={styles.subtitle}>{model.validityText}</Text>
          ) : null}
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

      {model.isActive ? (
        <View style={styles.progressBlock}>
          <View style={styles.progressMeta}>
            <Text style={styles.progressLabel}>Membership period</Text>
            {model.daysRemaining != null ? (
              <Text style={styles.progressLabel}>{model.daysRemaining} days left</Text>
            ) : null}
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${model.progressPercent}%` }]} />
          </View>
        </View>
      ) : null}

      {model.upgradeHint != null ? (
        <View style={styles.hintBox}>
          <Ionicons name="sparkles" size={16} color="#B45309" />
          <Text style={styles.hintText}>{model.upgradeHint}</Text>
        </View>
      ) : null}

      <View style={styles.benefitsBlock}>
        <Text style={styles.benefitsTitle}>Plan benefits</Text>
        {model.benefits.length === 0 ? (
          <Text style={styles.emptyBenefits}>Benefit details will appear here for your plan.</Text>
        ) : (
          model.benefits.map((benefit) => (
            <View key={benefit.id} style={styles.benefitRow}>
              <BenefitStatusIcon statusLabel={benefit.statusLabel} />
              <View style={styles.benefitTextBlock}>
                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                {benefit.statusLabel != null ? (
                  <Text style={styles.benefitStatus}>{benefit.statusLabel}</Text>
                ) : null}
              </View>
            </View>
          ))
        )}
      </View>

      {model.showUpgradeCta ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={model.upgradeCtaLabel}
          onPress={model.onMembershipPress}
          style={({ pressed }) => [styles.upgradeBtn, pressed ? styles.upgradeBtnPressed : null]}
        >
          <Text style={styles.upgradeBtnText}>{model.upgradeCtaLabel}</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </Pressable>
      ) : null}
    </View>
  );
}
