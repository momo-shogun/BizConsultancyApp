import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import { THEME } from '@/constants/theme';
import { useGetPublicMembershipsQuery } from '@/features/Home/api/homePublicApi';
import type { AccountStackParamList } from '@/navigation/types';
import { SafeAreaWrapper, ScreenHeader, ScreenWrapper } from '@/shared/components';

import type {
  FeatureChip,
  FeatureIcon,
  MembershipPlan,
  MembershipPlansScreenConfig,
  PlanNameStyle,
  PriceOption,
} from '../../types/membershipPlan.types';
import { mapPublicMembershipsToMembershipPlans } from '../../utils/membershipScreenMappers';
import { styles } from '../User/UserMembershipScreen.styles';

function buildInitialSelections(plans: MembershipPlan[]): Record<string, string> {
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
  if (nameStyle === 'blue') {
    return '#2563EB';
  }
  if (nameStyle === 'amber') {
    return '#D97706';
  }
  return '#6366F1';
}

function badgeBgColor(nameStyle: PlanNameStyle): string {
  if (nameStyle === 'blue') {
    return '#DBEAFE';
  }
  if (nameStyle === 'amber') {
    return '#FEF3C7';
  }
  return '#E0E7FF';
}

function planNameColor(nameStyle: PlanNameStyle): string {
  if (nameStyle === 'blue') {
    return '#2563EB';
  }
  if (nameStyle === 'amber') {
    return '#B45309';
  }
  return '#4F46E5';
}

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
        isSelected ? { borderColor: accent } : null,
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
      <Text style={[styles.pricePerMonth, isSelected ? { color: accent } : null]}>
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
  plan: MembershipPlan;
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
        isActive
          ? {
              borderColor: accent,
              borderWidth: 2,
              shadowColor: accent,
              shadowOpacity: 0.22,
              shadowRadius: 16,
              elevation: 8,
            }
          : null,
      ]}
    >
      <View style={styles.planCardInner}>
        {isActive ? (
          <View style={[localStyles.selectedCheck, { backgroundColor: accent }]}>
            <Text style={localStyles.selectedCheckText}>✓</Text>
          </View>
        ) : null}

        <View style={[styles.cardBlob, { backgroundColor: accent }]} />

        <View style={[styles.cardIconWrapper, { backgroundColor: accent }]}>
          <Text style={styles.cardIconEmoji}>{plan.icon}</Text>
        </View>

        <View style={[styles.cardBadge, { backgroundColor: accent }]}>
          <Text style={styles.cardBadgeText}>{plan.tierBadge}</Text>
        </View>

        <Text style={[styles.cardPlanName, { color: nameColor }]}>{plan.name}</Text>

        <Text style={styles.cardPrice}>
          ₹{plan.priceOptions[0]?.totalPrice.toLocaleString('en-IN') ?? '—'}
        </Text>
        <Text style={styles.cardGstNote}>{plan.gstNote}</Text>

        {plan.adsLabel ? (
          <View style={[styles.adsFreeTag, { backgroundColor: bgBadge, borderColor: accent }]}>
            <Text style={[styles.adsFreeText, { color: accent }]}>{plan.adsLabel}</Text>
          </View>
        ) : null}

        <View style={styles.headerDivider} />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featureRow}
        >
          {plan.features.map((chip, index) => (
            <FeatureChipItem key={`${plan.id}-chip-${index}`} chip={chip} />
          ))}
        </ScrollView>

        <View style={styles.featureListContainer}>
          {plan.featureList.map((text, index) => (
            <FeatureListItem key={`${plan.id}-feature-${index}`} text={text} accent={accent} />
          ))}
        </View>

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

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [activePlanId, setActivePlanId] = useState<string>('');

  useEffect(() => {
    if (plans.length === 0) {
      return;
    }
    setSelectedOptions(buildInitialSelections(plans));
    setActivePlanId((current) =>
      plans.some((plan) => plan.id === current) ? current : plans[0].id,
    );
  }, [plans]);

  const activePlan = plans.find((plan) => plan.id === activePlanId) ?? plans[0];
  const activeOptionId = activePlan != null ? selectedOptions[activePlan.id] ?? '' : '';
  const activeOption = activePlan?.priceOptions.find((option) => option.id === activeOptionId);
  const footerLabel =
    activePlan != null && activeOption != null
      ? formatFooterLabel(activePlan.name, activeOption.duration)
      : '';
  const footerAccent = activePlan != null ? accentColor(activePlan.nameStyle) : '#6366F1';

  return (
    <SafeAreaWrapper edges={['top', 'bottom']} bgColor="white">
      <ScreenHeader title={config.headerTitle} onBackPress={() => navigation.goBack()} />
      <ScreenWrapper style={styles.screen}>
        {isLoading ? (
          <View style={localStyles.centered}>
            <ActivityIndicator size="large" color={THEME.colors.primary} />
          </View>
        ) : isError ? (
          <View style={localStyles.centered}>
            <Text style={localStyles.errorText}>Could not load membership plans.</Text>
            <Pressable onPress={() => void refetch()} style={localStyles.retryButton}>
              <Text style={localStyles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : plans.length === 0 ? (
          <View style={localStyles.centered}>
            <Text style={localStyles.errorText}>No membership plans available right now.</Text>
          </View>
        ) : (
          <>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.titleWrapper}>
                <Text style={styles.pageTitle}>
                  {config.pageTitle}
                  {'\n'}
                  <Text style={styles.pageTitleAccent}>{config.pageTitleAccent}</Text>
                </Text>
                <View style={styles.titleUnderline} />
                <Text style={styles.pageSubtitle}>{config.pageSubtitle}</Text>
              </View>

              {plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  isActive={plan.id === activePlanId}
                  selectedOptionId={selectedOptions[plan.id] ?? plan.priceOptions[0]?.id ?? ''}
                  onSelectOption={(optionId) => {
                    setActivePlanId(plan.id);
                    setSelectedOptions((prev) => ({ ...prev, [plan.id]: optionId }));
                  }}
                  onCardPress={() => setActivePlanId(plan.id)}
                />
              ))}
            </ScrollView>

            {activePlan != null ? (
              <View style={styles.stickyFooter}>
                <View style={styles.stickyPriceGroup}>
                  <View style={localStyles.footerBadgeRow}>
                    <View style={[localStyles.footerBadge, { backgroundColor: footerAccent }]}>
                      <Text style={localStyles.footerBadgeText}>{activePlan.tierBadge}</Text>
                    </View>
                    <Text style={[localStyles.footerPlanName, { color: planNameColor(activePlan.nameStyle) }]}>
                      {activePlan.name}
                    </Text>
                  </View>
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
            ) : null}
          </>
        )}
      </ScreenWrapper>
    </SafeAreaWrapper>
  );
}

const localStyles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: THEME.spacing[24],
  },
  errorText: {
    fontSize: THEME.typography.size[14],
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    marginBottom: THEME.spacing[12],
  },
  retryButton: {
    paddingHorizontal: THEME.spacing[16],
    paddingVertical: THEME.spacing[10],
    borderRadius: 10,
    backgroundColor: THEME.colors.primary,
  },
  retryText: {
    color: THEME.colors.white,
    fontWeight: '600',
  },
  selectedCheck: {
    position: 'absolute',
    top: 14,
    left: 14,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  selectedCheckText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 14,
  },
  footerBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  footerBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  footerBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  footerPlanName: {
    fontSize: 13,
    fontWeight: '600',
  },
});
