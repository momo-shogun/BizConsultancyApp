import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';
import { useGetPublicMembershipsQuery } from '@/features/Home/api/homePublicApi';
import type { AccountStackParamList } from '@/navigation/types';
import { SafeAreaWrapper, ScreenHeader, ScreenWrapper } from '@/shared/components';

import type { MembershipPlan, MembershipPlansScreenConfig } from '../../types/membershipPlan.types';
import { mapPublicMembershipsToMembershipPlans } from '../../utils/membershipScreenMappers';
import { styles } from './MembershipPlansScreen.styles';

function formatRupee(value: number): string {
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

function formatValidity(days: number): string {
  if (days <= 0) {
    return 'Validity as per plan';
  }
  return `${days} days validity`;
}

function membershipIconName(
  icon: string | null,
): React.ComponentProps<typeof Ionicons>['name'] {
  const key = icon?.trim().toLowerCase() ?? '';
  if (key === 'users' || key === 'user') {
    return 'people-outline';
  }
  if (key === 'briefcase' || key === 'business') {
    return 'briefcase-outline';
  }
  if (key === 'star' || key === 'premium') {
    return 'star-outline';
  }
  if (key === 'diamond' || key === 'crown') {
    return 'diamond-outline';
  }
  return 'ribbon-outline';
}

function ScopeRow({
  scope,
  accent,
}: {
  scope: MembershipPlan['scopes'][number];
  accent: string;
}): React.ReactElement {
  return (
    <View style={styles.scopeRow}>
      <Ionicons name="checkmark-circle" size={18} color={accent} />
      <View style={styles.scopeTextBlock}>
        <Text style={styles.scopeTitle}>{scope.title}</Text>
        {scope.amountLabel != null ? (
          <Text style={styles.scopeAmount}>Value {scope.amountLabel}</Text>
        ) : null}
      </View>
    </View>
  );
}

function TermsSection({
  terms,
  accent,
}: {
  terms: string[];
  accent: string;
}): React.ReactElement | null {
  const [expanded, setExpanded] = useState(false);

  if (terms.length === 0) {
    return null;
  }

  return (
    <View>
      <Pressable
        style={styles.termsToggle}
        onPress={() => setExpanded((value) => !value)}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
      >
        <Text style={styles.termsToggleText}>
          Terms & conditions ({terms.length})
        </Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={accent}
        />
      </Pressable>
      {expanded ? (
        <View style={styles.termsList}>
          {terms.map((term, index) => (
            <View key={`term-${index}`} style={styles.termItem}>
              <View style={[styles.termBullet, { backgroundColor: accent }]} />
              <Text style={styles.termText}>{term}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function PlanCard({
  plan,
  isSelected,
  onPress,
}: {
  plan: MembershipPlan;
  isSelected: boolean;
  onPress: () => void;
}): React.ReactElement {
  const { theme } = plan;
  const showStrike =
    plan.basePrice != null && plan.basePrice > plan.amount && plan.amount > 0;
  const inclusionItems =
    plan.scopes.length > 0
      ? plan.scopes
      : plan.features.map((title, index) => ({
          id: index,
          title,
          amountLabel: null as string | null,
        }));

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.planCard,
        {
          backgroundColor: theme.cardBg,
          borderColor: isSelected ? theme.accent : theme.softBorder,
          borderWidth: isSelected ? 2 : 1,
          shadowColor: theme.accent,
        },
        isSelected ? styles.planCardSelected : null,
      ]}
    >
      <View style={[styles.cardBlob, { backgroundColor: theme.accent }]} />

      <View style={styles.planCardBody}>
        <View style={styles.planHeaderRow}>
          <View style={styles.planTitleBlock}>
            <View style={styles.badgeRow}>
              {plan.badge != null ? (
                <View style={[styles.badge, { backgroundColor: theme.badgeBg }]}>
                  <Text style={[styles.badgeText, { color: theme.badgeText }]}>
                    {plan.badge}
                  </Text>
                </View>
              ) : null}
              {plan.isMostPopular ? (
                <View style={[styles.popularBadge, { borderColor: theme.accent }]}>
                  <Text style={[styles.popularBadgeText, { color: theme.accentDark }]}>
                    Most popular
                  </Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.planName, { color: theme.accentDark }]}>{plan.name}</Text>
            {plan.description != null ? (
              <Text style={styles.planDescription}>{plan.description}</Text>
            ) : null}
          </View>
          <View style={styles.planHeaderTrailing}>
            {isSelected ? (
              <View style={[styles.selectedCheckInline, { backgroundColor: theme.accent }]}>
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              </View>
            ) : null}
            {plan.icon != null ? (
              <View style={[styles.iconCircle, { backgroundColor: theme.iconBg }]}>
                <Ionicons
                  name={membershipIconName(plan.icon)}
                  size={22}
                  color="#FFFFFF"
                />
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.priceRow}>
          {showStrike ? (
            <Text style={styles.priceStrike}>{formatRupee(plan.basePrice ?? 0)}</Text>
          ) : null}
          <Text style={[styles.priceAmount, { color: theme.accentDark }]}>
            {formatRupee(plan.amount)}
          </Text>
        </View>
        <Text style={styles.metaText}>
          {formatValidity(plan.days)} • {plan.gstLabel}
        </Text>
        {plan.walletTransferLabel != null ? (
          <Text style={[styles.walletText, { color: theme.accent }]}>
            {plan.walletTransferLabel}
          </Text>
        ) : null}

        {inclusionItems.length > 0 ? (
          <>
            <View style={[styles.divider, { backgroundColor: theme.softBorder }]} />
            <Text style={[styles.sectionTitle, { color: theme.accentDark }]}>
              {"What's included"}
            </Text>
            {inclusionItems.map((item) => (
              <ScopeRow
                key={`${plan.id}-scope-${item.id}`}
                scope={item}
                accent={theme.accent}
              />
            ))}
          </>
        ) : null}

        {plan.termConditions.length > 0 ? (
          <>
            <View style={[styles.divider, { backgroundColor: theme.softBorder }]} />
            <TermsSection terms={plan.termConditions} accent={theme.accent} />
          </>
        ) : null}
      </View>
    </Pressable>
  );
}

function StickyFooter({
  plan,
}: {
  plan: MembershipPlan;
}): React.ReactElement {
  const { theme } = plan;

  return (
    <View
      style={[
        styles.stickyFooter,
        {
          backgroundColor: theme.footerTint,
          borderTopColor: theme.softBorder,
        },
      ]}
    >
      <View style={styles.stickyPriceGroup}>
        <View style={styles.stickyTitleRow}>
          {plan.badge != null ? (
            <View style={[styles.stickyBadge, { backgroundColor: theme.badgeBg }]}>
              <Text style={[styles.stickyBadgeText, { color: theme.badgeText }]}>
                {plan.badge}
              </Text>
            </View>
          ) : null}
          <Text
            style={[styles.stickyPlanName, { color: theme.accentDark }]}
            numberOfLines={1}
          >
            {plan.name}
          </Text>
        </View>
        <Text style={[styles.stickyPrice, { color: theme.accentDark }]}>
          {formatRupee(plan.amount)}
        </Text>
        <Text style={styles.stickyMeta}>{formatValidity(plan.days)}</Text>
      </View>

      <TouchableOpacity
        style={[styles.upgradeCta, { backgroundColor: theme.accent }]}
        activeOpacity={0.85}
      >
        <Text style={styles.upgradeCtaText}>{plan.ctaLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

export interface MembershipPlansScreenProps {
  config: MembershipPlansScreenConfig;
}

export function MembershipPlansScreen({ config }: MembershipPlansScreenProps): React.ReactElement {
  const navigation = useNavigation<NavigationProp<AccountStackParamList>>();
  const { data, isLoading, isError, refetch } = useGetPublicMembershipsQuery({
    type: config.membershipApiType,
  });

  const plans = useMemo(
    () => mapPublicMembershipsToMembershipPlans(data ?? []),
    [data],
  );

  const [activePlanId, setActivePlanId] = useState<string>('');

  useEffect(() => {
    if (plans.length === 0) {
      return;
    }
    setActivePlanId((current) =>
      plans.some((plan) => plan.id === current) ? current : plans[0].id,
    );
  }, [plans]);

  const activePlan = plans.find((plan) => plan.id === activePlanId) ?? plans[0];

  return (
    <SafeAreaWrapper edges={['top', 'bottom']} bgColor="white">
      <ScreenHeader title={config.headerTitle} onBackPress={() => navigation.goBack()} />
      <ScreenWrapper style={styles.screen}>
        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={THEME.colors.primary} />
          </View>
        ) : isError ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>Could not load membership plans.</Text>
            <Pressable onPress={() => void refetch()} style={styles.retryButton}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : plans.length === 0 ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>No membership plans available right now.</Text>
          </View>
        ) : (
          <>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.intro}>
                <Text style={styles.pageTitle}>{config.pageTitle}</Text>
                <Text style={styles.pageSubtitle}>{config.pageSubtitle}</Text>
              </View>

              {plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  isSelected={plan.id === activePlanId}
                  onPress={() => setActivePlanId(plan.id)}
                />
              ))}
            </ScrollView>

            {activePlan != null ? <StickyFooter plan={activePlan} /> : null}
          </>
        )}
      </ScreenWrapper>
    </SafeAreaWrapper>
  );
}
