import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CommonActions, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  useGetMyDiagnosisPurchaseStateQuery,
  useGetPublicDiagnosticsMembershipsQuery,
} from '@/features/Diagnostics/api/diagnosticsApi';
import { BusinessDiagnosisHero } from '@/features/Diagnostics/components/BusinessDiagnosisHero';
import { DiagnosisActivePackBanner } from '@/features/Diagnostics/components/DiagnosisActivePackBanner';
import { DiagnosisFeatureCard } from '@/features/Diagnostics/components/DiagnosisFeatureCard';
import { DiagnosisPaymentModal } from '@/features/Diagnostics/components/DiagnosisPaymentModal';
import {
  DIAGNOSIS_PLAN_CARD_GAP,
  DIAGNOSIS_PLAN_CARD_WIDTH,
  DiagnosisPlanCard,
} from '@/features/Diagnostics/components/DiagnosisPlanCard';
import { DiagnosisSectionHeader } from '@/features/Diagnostics/components/DiagnosisSectionHeader';
import { DIAGNOSIS_THEME } from '@/features/Diagnostics/constants/diagnosisTheme';
import { useDiagnosisPurchase } from '@/features/Diagnostics/hooks/useDiagnosisPurchase';
import { mapToDiagnosisPlanViewModels } from '@/features/Diagnostics/utils/diagnosticsMappers';
import {
  selectEffectiveAccountRole,
  selectHasVerifiedLogin,
} from '@/features/Auth/store/authSelectors';
import { THEME } from '@/constants/theme';
import { navigationRef } from '@/navigation/RootNavigator';
import { ROUTES } from '@/navigation/routeNames';
import type { RootStackParamList } from '@/navigation/types';
import { SafeAreaWrapper } from '@/shared/components';
import { useAppSelector } from '@/store/typedHooks';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  typeof ROUTES.Root.BusinessDiagnosis
>;

const FEATURES = [
  {
    icon: 'search-outline' as const,
    title: 'Structured Assessment',
    description:
      'Review financials, compliance, and operations so you know exactly where you stand.',
    accent: DIAGNOSIS_THEME.heroAccent,
  },
  {
    icon: 'shield-checkmark' as const,
    title: 'Compliance Readiness',
    description:
      'Identify gaps in registrations and filings before they become a problem.',
    accent: DIAGNOSIS_THEME.brandPrimary,
  },
  {
    icon: 'trending-up-outline' as const,
    title: 'Growth Roadmap',
    description: 'Get a prioritized plan for scaling, funding, and industry opportunities.',
    accent: '#0D9488',
  },
  {
    icon: 'people-outline' as const,
    title: 'Expert-Backed',
    description: 'Designed with CAs, CS, and domain experts for actionable advice.',
    accent: '#7C3AED',
  },
] as const;

const FEATURE_ROW_SIZE = 2;

const TRUST_ITEMS = [
  { icon: 'wallet-outline' as const, label: 'Wallet pay' },
  { icon: 'card-outline' as const, label: 'Razorpay' },
  { icon: 'document-text-outline' as const, label: 'Expert review' },
] as const;

export function BusinessDiagnosisScreen(): React.ReactElement {
  const navigation = useNavigation<NavigationProp>();
  const scrollRef = useRef<ScrollView>(null);
  const [packsScrollY, setPacksScrollY] = useState(0);
  const hasVerifiedLogin = useAppSelector(selectHasVerifiedLogin);
  const accountRole = useAppSelector(selectEffectiveAccountRole);

  const {
    data: packs = [],
    isLoading: packsLoading,
    isError: packsError,
    refetch: refetchPacks,
  } = useGetPublicDiagnosticsMembershipsQuery();

  const { data: purchaseState } = useGetMyDiagnosisPurchaseStateQuery(undefined, {
    skip: !hasVerifiedLogin,
  });

  const purchase = useDiagnosisPurchase();
  const { purchaseSuccessCount } = purchase;

  /**
   * Clear Root overlays (diagnosis plans) so Back from My Diagnostic Pack
   * does not return here. Account stack starts at MyDiagnosticPack only.
   */
  useEffect(() => {
    if (purchaseSuccessCount === 0) {
      return;
    }
    const showEdp = accountRole !== 'consultant';
    const tabRoutes = [
      { name: ROUTES.App.Home },
      { name: ROUTES.App.Services },
      { name: ROUTES.App.Calls },
      ...(showEdp ? [{ name: ROUTES.App.Edp }] : []),
      {
        name: ROUTES.App.Account,
        state: {
          routes: [{ name: ROUTES.Account.MyDiagnosticPack }],
          index: 0,
        },
      },
    ];

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: ROUTES.Root.App,
            state: {
              routes: tabRoutes,
              index: tabRoutes.length - 1,
            },
          },
        ],
      }),
    );
  }, [accountRole, navigation, purchaseSuccessCount]);

  const plans = useMemo(
    () => mapToDiagnosisPlanViewModels(packs, purchaseState ?? null),
    [packs, purchaseState],
  );

  const activePack =
    purchaseState != null && purchaseState.packDeliveryStatus === 'active'
      ? purchaseState
      : null;

  const priceById = useMemo(() => {
    const map = new Map<number, number>();
    for (const pack of packs) {
      map.set(pack.id, pack.priceExclGst);
    }
    return map;
  }, [packs]);

  const onPlanPress = useCallback(
    (planId: number): void => {
      const plan = plans.find((p) => p.id === planId);
      const amount = priceById.get(planId) ?? 0;
      if (plan != null) {
        purchase.openPaymentForPlan(plan, amount);
      }
    },
    [plans, priceById, purchase],
  );

  const onTalkToExpertPress = useCallback((): void => {
    if (navigationRef.isReady()) {
      navigationRef.navigate(ROUTES.Root.ConsultantsList);
    }
  }, []);

  const scrollToPacks = useCallback((): void => {
    scrollRef.current?.scrollTo({ y: Math.max(packsScrollY - 16, 0), animated: true });
  }, [packsScrollY]);

  const featureRows = useMemo((): (typeof FEATURES)[number][][] => {
    const rows: (typeof FEATURES)[number][][] = [];
    for (let index = 0; index < FEATURES.length; index += FEATURE_ROW_SIZE) {
      rows.push([...FEATURES.slice(index, index + FEATURE_ROW_SIZE)]);
    }
    return rows;
  }, []);

  return (
    <SafeAreaWrapper edges={['top', 'bottom']} bgColor={DIAGNOSIS_THEME.heroBg}>
      {purchase.diagnosisPurchaseLoginDialog}
      <View style={styles.headerBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => navigationRef.goBack()}
          hitSlop={8}
          style={({ pressed }) => [styles.backFab, pressed && styles.backFabPressed]}
        >
          <Ionicons name="chevron-back" size={22} color={DIAGNOSIS_THEME.brandPrimary} />
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        contentInsetAdjustmentBehavior="never"
        automaticallyAdjustContentInsets={false}
      >
        <BusinessDiagnosisHero
          backgroundColor={DIAGNOSIS_THEME.heroBg}
          accentColor={DIAGNOSIS_THEME.heroAccent}
          showStats
          topPadding={8}
          onTalkToExpertPress={onTalkToExpertPress}
          onSecondaryPress={scrollToPacks}
          secondaryPillLabel="View packs"
          secondaryPillIcon="📦"
        />

        <View style={styles.contentShell}>
          <DiagnosisSectionHeader
            eyebrow="Why choose us"
            title="Why BIZ Diagnostics"
            subtitle="A clear picture of your business health and a practical roadmap for growth, compliance, and funding."
            accentColor={DIAGNOSIS_THEME.heroAccent}
          />

          <View style={styles.featureGrid}>
            {featureRows.map((row) => (
              <View key={row.map((item) => item.title).join('-')} style={styles.featureRow}>
                {row.map((feature) => (
                  <DiagnosisFeatureCard
                    key={feature.title}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    accentColor={feature.accent}
                  />
                ))}
              </View>
            ))}
          </View>

          <View style={styles.trustStrip}>
            <LinearGradient
              colors={['rgba(15, 81, 50, 0.06)', 'rgba(37, 99, 235, 0.05)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
            {TRUST_ITEMS.map((item) => (
              <View key={item.label} style={styles.trustItem}>
                <Ionicons name={item.icon} size={16} color={DIAGNOSIS_THEME.brandPrimary} />
                <Text style={styles.trustLabel} numberOfLines={1}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>

          <View
            style={styles.packsSection}
            onLayout={(event) => setPacksScrollY(event.nativeEvent.layout.y)}
          >
            <DiagnosisSectionHeader
              eyebrow="Pricing"
              title="Diagnostic packs"
              subtitle="Pick a tier that matches your stage. Upgrade anytime as your business grows."
              accentColor={DIAGNOSIS_THEME.brandPrimary}
            />

            {activePack != null ? <DiagnosisActivePackBanner purchaseState={activePack} /> : null}

            {packsLoading ? (
              <ActivityIndicator
                size="large"
                color={DIAGNOSIS_THEME.brandPrimary}
                style={styles.loader}
              />
            ) : null}

            {packsError && !packsLoading ? (
              <View style={styles.errorBox}>
                <Ionicons name="cloud-offline-outline" size={32} color={DIAGNOSIS_THEME.textSecondary} />
                <Text style={styles.errorText}>Could not load diagnostic packs.</Text>
                <Pressable onPress={() => void refetchPacks()} style={styles.retryButton}>
                  <Text style={styles.retryText}>Try again</Text>
                </Pressable>
              </View>
            ) : null}

            {!packsLoading && !packsError && plans.length > 0 ? (
              <ScrollView
                horizontal
                nestedScrollEnabled
                directionalLockEnabled
                removeClippedSubviews={false}
                decelerationRate="fast"
                snapToAlignment="start"
                snapToInterval={DIAGNOSIS_PLAN_CARD_WIDTH + DIAGNOSIS_PLAN_CARD_GAP}
                disableIntervalMomentum
                showsHorizontalScrollIndicator={false}
                contentInsetAdjustmentBehavior="never"
                style={styles.plansCarousel}
                contentContainerStyle={styles.plansList}
              >
                {plans.map((plan) => (
                  <DiagnosisPlanCard key={plan.id} plan={plan} onPress={onPlanPress} />
                ))}
              </ScrollView>
            ) : null}

            {!packsLoading && !packsError && plans.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>No diagnostic packs available right now.</Text>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>

      <DiagnosisPaymentModal
        visible={purchase.paymentModalVisible}
        packTitle={purchase.selectedPlan?.title ?? 'Diagnostic pack'}
        amountRupees={purchase.amountRupees}
        walletBalanceRupees={purchase.walletBalanceRupees}
        canPayWithWallet={purchase.canPayWithWallet}
        showRazorpayOption={purchase.showRazorpayOption}
        payingWith={purchase.payingWith}
        isBusy={purchase.isBusy}
        onClose={purchase.closePaymentModal}
        onPayRazorpay={() => void purchase.payWithRazorpay()}
        onPayWallet={() => void purchase.payWithWallet()}
      />
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    paddingHorizontal: 14,
    paddingTop: 4,
    paddingBottom: 4,
    zIndex: 20,
  },
  backFab: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderWidth: 1,
    borderColor: 'rgba(15, 81, 50, 0.12)',
    ...Platform.select({
      ios: {
        shadowColor: DIAGNOSIS_THEME.shadow,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
      default: {},
    }),
  },
  backFabPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  scrollContent: {
    paddingBottom: THEME.spacing[40],
  },
  contentShell: {
    marginTop: -12,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: DIAGNOSIS_THEME.pageBg,
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[20],
    paddingBottom: THEME.spacing[24],
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    overflow: 'visible',
    ...Platform.select({
      ios: {
        shadowColor: DIAGNOSIS_THEME.shadow,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.6,
        shadowRadius: 12,
      },
      android: { elevation: 6 },
      default: {},
    }),
  },
  featureGrid: {
    gap: 10,
    marginBottom: THEME.spacing[16],
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 10,
  },
  trustStrip: {
    position: 'relative',
    overflow: 'hidden',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: THEME.spacing[20],
    borderWidth: 1,
    borderColor: 'rgba(15, 81, 50, 0.08)',
    minHeight: 44,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
    minWidth: 0,
  },
  trustLabel: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
    color: DIAGNOSIS_THEME.textPrimary,
    flexShrink: 1,
  },
  loader: {
    marginVertical: 28,
  },
  errorBox: {
    alignItems: 'center',
    paddingVertical: 28,
    gap: 12,
    backgroundColor: DIAGNOSIS_THEME.contentBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: DIAGNOSIS_THEME.border,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 14,
    lineHeight: 20,
    color: DIAGNOSIS_THEME.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  retryButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: DIAGNOSIS_THEME.brandPrimary,
  },
  retryText: {
    color: DIAGNOSIS_THEME.contentBg,
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 20,
  },
  packsSection: {
    overflow: 'visible',
  },
  plansCarousel: {
    marginHorizontal: -THEME.spacing[16],
    overflow: 'visible',
  },
  plansList: {
    paddingLeft: THEME.spacing[16],
    paddingRight: THEME.spacing[16],
    paddingTop: THEME.spacing[8],
    paddingBottom: THEME.spacing[24],
    alignItems: 'flex-start',
  },
  emptyBox: {
    paddingVertical: 24,
    alignItems: 'center',
    backgroundColor: DIAGNOSIS_THEME.contentBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: DIAGNOSIS_THEME.border,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    color: DIAGNOSIS_THEME.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});

export default BusinessDiagnosisScreen;
