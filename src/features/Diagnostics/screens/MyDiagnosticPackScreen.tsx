import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { DiagnosisApplyDocumentsModal } from '@/features/Diagnostics/components/DiagnosisApplyDocumentsModal';
import { getPlanTierVisual } from '@/features/Diagnostics/constants/diagnosisTheme';
import { useMyDiagnosticPackScreen } from '@/features/Diagnostics/hooks/useMyDiagnosticPackScreen';
import type { DiagnosisDashboardFeature } from '@/features/Diagnostics/types/diagnostics.types';
import {
  diagnosisFeatureRequestLabel,
  getDiagnosisStatusVisual,
  isDiagnosisFeatureRequestDisabled,
} from '@/features/Diagnostics/utils/diagnosisStatus';
import { THEME } from '@/constants/theme';
import { navigationRef } from '@/navigation/navigationContainerRef';
import { ROUTES } from '@/navigation/routeNames';
import type { AccountStackParamList } from '@/navigation/types';
import { AccountHubScreenShell } from '@/shared/components';
import { useTabBarOverlayHeight } from '@/shared/hooks/useTabHostedScreenInsets';

import { PACK_CANVAS, styles } from './MyDiagnosticPackScreen.styles';

type Nav = NativeStackNavigationProp<
  AccountStackParamList,
  typeof ROUTES.Account.MyDiagnosticPack
>;

interface FeatureStats {
  queued: number;
  active: number;
  done: number;
}

function countFeatureStats(features: DiagnosisDashboardFeature[]): FeatureStats {
  let queued = 0;
  let active = 0;
  let done = 0;

  for (const feature of features) {
    if (feature.userStatus === 'delivered') {
      done += 1;
      continue;
    }
    if (feature.userStatus === 'in_progress' || feature.userStatus === 'requested') {
      active += 1;
      continue;
    }
    queued += 1;
  }

  return { queued, active, done };
}

interface ServiceRowProps {
  feature: DiagnosisDashboardFeature;
  index: number;
  isLast: boolean;
  requesting: boolean;
  onRequest: (featureId: number) => void;
}

function ServiceRow(props: ServiceRowProps): React.ReactElement {
  const visual = getDiagnosisStatusVisual(props.feature.userStatus);
  const disabled = isDiagnosisFeatureRequestDisabled(props.feature.adminStatus);
  const canRequest = !disabled && !props.requesting;
  const requestLabel = diagnosisFeatureRequestLabel(props.feature.adminStatus);
  const hasRemarks =
    props.feature.remarks != null && props.feature.remarks.trim().length > 0;

  return (
    <View style={[styles.serviceRow, props.isLast ? styles.serviceRowLast : null]}>
      <View style={[styles.serviceStep, { backgroundColor: `${visual.color}16` }]}>
        {props.feature.userStatus === 'delivered' ? (
          <Ionicons name="checkmark" size={16} color={visual.color} />
        ) : (
          <Text style={[styles.serviceStepText, { color: visual.color }]}>
            {props.index + 1}
          </Text>
        )}
      </View>

      <View style={styles.serviceText}>
        <Text style={styles.serviceTitle} numberOfLines={2}>
          {props.feature.title}
        </Text>
        <View style={[styles.statusPill, { backgroundColor: `${visual.color}14` }]}>
          <Ionicons name={visual.icon} size={11} color={visual.color} />
          <Text style={[styles.statusPillText, { color: visual.color }]}>{visual.label}</Text>
        </View>
        {hasRemarks ? (
          <Text style={styles.serviceRemarks} numberOfLines={2}>
            {props.feature.remarks}
          </Text>
        ) : null}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${requestLabel} ${props.feature.title}`}
        disabled={!canRequest}
        onPress={() => props.onRequest(props.feature.id)}
        hitSlop={4}
        style={({ pressed }) => [
          styles.requestBtn,
          canRequest ? styles.requestBtnPrimary : null,
          !canRequest ? styles.requestBtnDisabled : null,
          pressed && canRequest ? styles.requestBtnPressed : null,
        ]}
      >
        {props.requesting ? (
          <ActivityIndicator size="small" color={THEME.colors.primary} />
        ) : (
          <Text
            style={[styles.requestBtnText, canRequest ? styles.requestBtnTextPrimary : null]}
          >
            {requestLabel}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

interface StatCardProps {
  value: number;
  label: string;
  color: string;
}

function StatCard(props: StatCardProps): React.ReactElement {
  return (
    <View style={styles.statCard}>
      <Text style={[styles.statValue, { color: props.color }]}>{props.value}</Text>
      <Text style={styles.statLabel}>{props.label}</Text>
    </View>
  );
}

interface EmptyStatePanelProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  body: string;
  actionLabel: string;
  onAction: () => void;
}

function EmptyStatePanel(props: EmptyStatePanelProps): React.ReactElement {
  return (
    <View style={styles.statePanel}>
      <View style={styles.emptyIconRing}>
        <Ionicons name={props.icon} size={28} color="#0D9488" />
      </View>
      <Text style={styles.emptyTitle}>{props.title}</Text>
      <Text style={styles.emptyBody}>{props.body}</Text>
      <Pressable
        style={styles.primaryBtn}
        onPress={props.onAction}
        accessibilityRole="button"
        accessibilityLabel={props.actionLabel}
      >
        <Text style={styles.primaryBtnText}>{props.actionLabel}</Text>
        <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

export function MyDiagnosticPackScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const tabBarHeight = useTabBarOverlayHeight();
  const screen = useMyDiagnosticPackScreen();
  const packName = screen.dashboard?.current?.packName ?? '';
  const packVisual = useMemo(() => getPlanTierVisual(packName), [packName]);
  const features = screen.dashboard?.features ?? [];
  const featureStats = useMemo(() => countFeatureStats(features), [features]);

  const navigateToPackages = useCallback((): void => {
    navigationRef.navigate(ROUTES.Root.BusinessDiagnosis);
  }, []);

  const navigateToLogin = useCallback((): void => {
    navigationRef.navigate(ROUTES.Root.Auth, {
      screen: ROUTES.Auth.Login,
    });
  }, []);

  const onBackPress = useCallback((): void => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigationRef.navigate(ROUTES.Root.App, { screen: ROUTES.App.Home });
  }, [navigation]);

  const scrollBottomPad = tabBarHeight + THEME.spacing[20];

  if (!screen.isAuthenticated) {
    return (
      <AccountHubScreenShell
        title="My Diagnostic Pack"
        onBackPress={onBackPress}
        canvasColor={PACK_CANVAS}
      >
        <View style={styles.centered}>
          <EmptyStatePanel
            icon="lock-closed-outline"
            title="Sign in required"
            body="Sign in to view your pack and service delivery status."
            actionLabel="Log in"
            onAction={navigateToLogin}
          />
        </View>
      </AccountHubScreenShell>
    );
  }

  if (screen.isLoading) {
    return (
      <AccountHubScreenShell
        title="My Diagnostic Pack"
        onBackPress={onBackPress}
        canvasColor={PACK_CANVAS}
      >
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={THEME.colors.primary} />
        </View>
      </AccountHubScreenShell>
    );
  }

  if (screen.errorMessage != null) {
    return (
      <AccountHubScreenShell
        title="My Diagnostic Pack"
        onBackPress={onBackPress}
        canvasColor={PACK_CANVAS}
      >
        <View style={styles.centered}>
          <View style={styles.statePanel}>
            <Ionicons name="cloud-offline-outline" size={36} color="#94A3B8" />
            <Text style={styles.errorText}>{screen.errorMessage}</Text>
            <Pressable style={styles.retryBtn} onPress={screen.refresh}>
              <Text style={styles.retryBtnText}>Retry</Text>
            </Pressable>
          </View>
        </View>
      </AccountHubScreenShell>
    );
  }

  const dashboard = screen.dashboard;
  const current = dashboard?.current ?? null;

  if (current == null) {
    return (
      <AccountHubScreenShell
        title="My Diagnostic Pack"
        onBackPress={onBackPress}
        canvasColor={PACK_CANVAS}
      >
        <ScrollView
          style={styles.screen}
          contentContainerStyle={[
            styles.scrollContent,
            styles.scrollContentCentered,
            { paddingBottom: scrollBottomPad },
          ]}
        >
          <EmptyStatePanel
            icon="analytics-outline"
            title="No diagnostic pack yet"
            body="Purchase a BIZ Diagnostic pack to unlock analysis and delivery tracking."
            actionLabel="View packages"
            onAction={navigateToPackages}
          />
        </ScrollView>
      </AccountHubScreenShell>
    );
  }

  const progressVal = dashboard?.serviceProgressPercent ?? 0;
  const featureCount = features.length;

  const purchasedLabel =
    current.startDate != null
      ? new Date(current.startDate).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : null;

  return (
    <AccountHubScreenShell
      title="My Diagnostic Pack"
      onBackPress={onBackPress}
      canvasColor={PACK_CANVAS}
    >
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: scrollBottomPad }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={screen.isRefreshing}
            onRefresh={screen.refresh}
            tintColor={THEME.colors.primary}
          />
        }
      >
        <LinearGradient
          colors={[packVisual.gradient[0], packVisual.gradient[1]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        >
          <View style={styles.heroDecorLayer} pointerEvents="none">
            <View style={styles.heroDecor} />
            <View style={styles.heroDecorSmall} />
          </View>

          <View style={styles.heroInner}>
            <View style={styles.heroTopRow}>
              <View style={styles.heroIconWrap}>
                <Ionicons name={packVisual.icon} size={24} color="#FFFFFF" />
              </View>
              <View style={styles.heroTitleBlock}>
                <Text style={styles.heroEyebrow}>Active pack</Text>
                <Text style={styles.heroTitle} numberOfLines={3}>
                  {current.packName ?? 'Diagnostic pack'}
                </Text>
                {purchasedLabel != null ? (
                  <Text style={styles.heroSubtitle}>Started {purchasedLabel}</Text>
                ) : null}
              </View>
            </View>

            <View style={styles.heroMetaRow}>
              {dashboard?.displayStatus != null && dashboard.displayStatus.length > 0 ? (
                <View style={styles.statusBadge}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusBadgeText}>{dashboard.displayStatus}</Text>
                </View>
              ) : null}
              <Text style={styles.heroStatText}>
                {featureCount} services · {Math.round(progressVal)}% complete
              </Text>
            </View>

            <View style={styles.progressBlock}>
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabel}>Delivery progress</Text>
                <Text style={styles.progressValue}>{Math.round(progressVal)}%</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${Math.min(100, progressVal)}%` }]} />
              </View>
            </View>
          </View>
        </LinearGradient>

        {featureCount > 0 ? (
          <View style={styles.statsRow}>
            <StatCard value={featureStats.queued} label="Queued" color="#64748B" />
            <StatCard value={featureStats.active} label="In progress" color="#D97706" />
            <StatCard value={featureStats.done} label="Delivered" color="#059669" />
          </View>
        ) : null}

        {dashboard?.nextServiceTitle != null && dashboard.displayStatus === 'Active' ? (
          <View style={[styles.callout, styles.calloutNext]}>
            <View style={[styles.calloutIconWrap, styles.calloutIconWrapNext]}>
              <Ionicons name="arrow-forward-circle-outline" size={20} color="#D97706" />
            </View>
            <View style={styles.calloutContent}>
              <Text style={styles.calloutTitle}>Up next</Text>
              <Text style={styles.calloutBody}>{dashboard.nextServiceTitle}</Text>
            </View>
          </View>
        ) : null}

        {dashboard?.upgradeHint != null && dashboard.displayStatus === 'Active' ? (
          <View style={[styles.callout, styles.calloutUpgrade]}>
            <View style={[styles.calloutIconWrap, styles.calloutIconWrapUpgrade]}>
              <Ionicons name="sparkles-outline" size={18} color="#0D9488" />
            </View>
            <View style={styles.calloutContent}>
              <Text style={styles.calloutBody}>{dashboard.upgradeHint}</Text>
              <Pressable style={styles.upgradeLink} onPress={navigateToPackages}>
                <Text style={styles.upgradeLinkText}>Upgrade options</Text>
                <Ionicons name="chevron-forward" size={14} color="#0D9488" />
              </Pressable>
            </View>
          </View>
        ) : null}

        <View style={styles.servicesBlock}>
          <View style={styles.servicesHeader}>
            <View>
              <Text style={styles.servicesTitle}>Services</Text>
              <Text style={styles.servicesCount}>{featureCount} deliverables</Text>
            </View>
          </View>

          {features.length === 0 ? (
            <Text style={styles.emptyServices}>No services listed for this pack yet.</Text>
          ) : (
            features.map((feature: DiagnosisDashboardFeature, index: number) => (
              <ServiceRow
                key={feature.id}
                feature={feature}
                index={index}
                isLast={index === features.length - 1}
                requesting={screen.requestingFeatureId === feature.id}
                onRequest={(id) => void screen.requestService(id)}
              />
            ))
          )}
        </View>
      </ScrollView>

      <DiagnosisApplyDocumentsModal
        visible={screen.applyModalVisible}
        items={screen.docItems}
        saving={screen.savingDocs}
        onClose={screen.closeApplyModal}
        onToggle={screen.toggleDocument}
        onApply={() => void screen.applyDocuments()}
      />
    </AccountHubScreenShell>
  );
}
