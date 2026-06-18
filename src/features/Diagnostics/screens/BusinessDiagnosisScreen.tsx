import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  useGetMyDiagnosisPurchaseStateQuery,
  useGetPublicDiagnosticsMembershipsQuery,
} from '@/features/Diagnostics/api/diagnosticsApi';
import { BusinessDiagnosisHero } from '@/features/Diagnostics/components/BusinessDiagnosisHero';
import { DiagnosisActivePackBanner } from '@/features/Diagnostics/components/DiagnosisActivePackBanner';
import { DiagnosisFeatureCard } from '@/features/Diagnostics/components/DiagnosisFeatureCard';
import { DiagnosisPaymentModal } from '@/features/Diagnostics/components/DiagnosisPaymentModal';
import { DiagnosisPlanCard } from '@/features/Diagnostics/components/DiagnosisPlanCard';
import { DiagnosisSectionHeader } from '@/features/Diagnostics/components/DiagnosisSectionHeader';
import { DIAGNOSIS_THEME } from '@/features/Diagnostics/constants/diagnosisTheme';
import { useDiagnosisPurchase } from '@/features/Diagnostics/hooks/useDiagnosisPurchase';
import { mapToDiagnosisPlanViewModels } from '@/features/Diagnostics/utils/diagnosticsMappers';
import { selectHasVerifiedLogin } from '@/features/Auth/store/authSelectors';
import { THEME } from '@/constants/theme';
import { navigationRef } from '@/navigation/RootNavigator';
import { ROUTES } from '@/navigation/routeNames';
import { SafeAreaWrapper } from '@/shared/components';
import { useAppSelector } from '@/store/typedHooks';

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

const TRUST_ITEMS = [
  { icon: 'wallet-outline' as const, label: 'Wallet pay' },
  { icon: 'card-outline' as const, label: 'Razorpay' },
  { icon: 'document-text-outline' as const, label: 'Expert review' },
] as const;

export function BusinessDiagnosisScreen(): React.ReactElement {
  const scrollRef = useRef<ScrollView>(null);
  const [packsScrollY, setPacksScrollY] = useState(0);
  const hasVerifiedLogin = useAppSelector(selectHasVerifiedLogin);

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

  return (
    <SafeAreaWrapper edges={['top', 'bottom']} bgColor={DIAGNOSIS_THEME.heroBg}>
      {purchase.diagnosisPurchaseLoginDialog}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={() => navigationRef.goBack()}
        style={({ pressed }) => [styles.backFab, pressed && styles.backFabPressed]}
      >
        <Ionicons name="chevron-back" size={22} color={DIAGNOSIS_THEME.brandPrimary} />
      </Pressable>

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <BusinessDiagnosisHero
          backgroundColor={DIAGNOSIS_THEME.heroBg}
          accentColor={DIAGNOSIS_THEME.heroAccent}
          showStats
          topPadding={52}
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
            {FEATURES.map((feature) => (
              <DiagnosisFeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                accentColor={feature.accent}
              />
            ))}
          </View>

          <LinearGradient
            colors={['rgba(15, 81, 50, 0.06)', 'rgba(37, 99, 235, 0.05)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.trustStrip}
          >
            {TRUST_ITEMS.map((item) => (
              <View key={item.label} style={styles.trustItem}>
                <Ionicons name={item.icon} size={16} color={DIAGNOSIS_THEME.brandPrimary} />
                <Text style={styles.trustLabel}>{item.label}</Text>
              </View>
            ))}
          </LinearGradient>

          <View onLayout={(event) => setPacksScrollY(event.nativeEvent.layout.y)}>
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
                showsHorizontalScrollIndicator={false}
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
  backFab: {
    position: 'absolute',
    top: 12,
    left: 14,
    zIndex: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderWidth: 1,
    borderColor: 'rgba(15, 81, 50, 0.12)',
    shadowColor: DIAGNOSIS_THEME.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  backFabPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  scrollContent: {
    // paddingTop: THEME.spacing[4],
    paddingBottom: THEME.spacing[32],
  },
  contentShell: {
    marginTop: -22,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: DIAGNOSIS_THEME.pageBg,
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[20],
    paddingBottom: THEME.spacing[12],
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    shadowColor: DIAGNOSIS_THEME.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 6,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
    marginBottom: THEME.spacing[16],
  },
  trustStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: THEME.spacing[20],
    borderWidth: 1,
    borderColor: 'rgba(15, 81, 50, 0.08)',
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: DIAGNOSIS_THEME.textPrimary,
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
    color: DIAGNOSIS_THEME.textSecondary,
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
  },
  plansList: {
    paddingRight: THEME.spacing[4],
    paddingBottom: THEME.spacing[8],
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
    color: DIAGNOSIS_THEME.textSecondary,
  },
});

export default BusinessDiagnosisScreen;
