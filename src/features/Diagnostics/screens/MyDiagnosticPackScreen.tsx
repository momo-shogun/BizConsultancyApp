import React, { useCallback } from 'react';
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
import Ionicons from 'react-native-vector-icons/Ionicons';

import { DiagnosisApplyDocumentsModal } from '@/features/Diagnostics/components/DiagnosisApplyDocumentsModal';
import { useMyDiagnosticPackScreen } from '@/features/Diagnostics/hooks/useMyDiagnosticPackScreen';
import type { DiagnosisDashboardFeature } from '@/features/Diagnostics/types/diagnostics.types';
import {
  diagnosisFeatureRequestLabel,
  getDiagnosisStatusVisual,
  isDiagnosisFeatureRequestDisabled,
} from '@/features/Diagnostics/utils/diagnosisStatus';
import { navigationRef } from '@/navigation/navigationContainerRef';
import { ROUTES } from '@/navigation/routeNames';
import type { AccountStackParamList } from '@/navigation/types';
import { SafeAreaWrapper, ScreenHeader } from '@/shared/components';

import { PACK_CANVAS, styles } from './MyDiagnosticPackScreen.styles';

type Nav = NativeStackNavigationProp<
  AccountStackParamList,
  typeof ROUTES.Account.MyDiagnosticPack
>;

function StatusBadge(props: { label: string }): React.ReactElement {
  const normalized = props.label.toLowerCase();
  const isActive = normalized === 'active';
  const isCompleted = normalized === 'completed';

  return (
    <View
      style={[
        styles.statusBadge,
        isActive
          ? styles.statusBadgeActive
          : isCompleted
            ? styles.statusBadgeCompleted
            : styles.statusBadgeDefault,
      ]}
    >
      <Text
        style={[
          styles.statusBadgeText,
          isActive
            ? styles.statusBadgeTextActive
            : isCompleted
              ? styles.statusBadgeTextCompleted
              : styles.statusBadgeTextDefault,
        ]}
      >
        {props.label}
      </Text>
    </View>
  );
}

interface ServiceRowProps {
  feature: DiagnosisDashboardFeature;
  isFirst: boolean;
  requesting: boolean;
  onRequest: (featureId: number) => void;
}

function ServiceRow(props: ServiceRowProps): React.ReactElement {
  const visual = getDiagnosisStatusVisual(props.feature.userStatus);
  const disabled = isDiagnosisFeatureRequestDisabled(props.feature.adminStatus);

  return (
    <View style={[styles.serviceRow, props.isFirst ? styles.serviceRowFirst : null]}>
      <Ionicons name={visual.icon} size={20} color={visual.color} />
      <View style={styles.serviceText}>
        <Text style={styles.serviceTitle}>{props.feature.title}</Text>
        <Text style={styles.serviceMeta} numberOfLines={2}>
          {visual.label}
          {props.feature.remarks != null && props.feature.remarks.length > 0
            ? ` · ${props.feature.remarks}`
            : ''}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Request ${props.feature.title}`}
        disabled={disabled || props.requesting}
        onPress={() => props.onRequest(props.feature.id)}
        style={({ pressed }) => [
          styles.requestBtn,
          (disabled || props.requesting) && styles.requestBtnDisabled,
          pressed && !disabled ? { opacity: 0.88 } : null,
        ]}
      >
        {props.requesting ? (
          <ActivityIndicator size="small" color="#0F172A" />
        ) : (
          <Text style={styles.requestBtnText}>
            {diagnosisFeatureRequestLabel(props.feature.adminStatus)}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

export function MyDiagnosticPackScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const screen = useMyDiagnosticPackScreen();

  const navigateToPackages = useCallback((): void => {
    navigationRef.navigate(ROUTES.Root.BusinessDiagnosis);
  }, []);

  const navigateToLogin = useCallback((): void => {
    navigationRef.navigate(ROUTES.Root.Auth, {
      screen: ROUTES.Auth.Login,
    });
  }, []);

  if (!screen.isAuthenticated) {
    return (
      <SafeAreaWrapper edges={['top', 'bottom']} bgColor={PACK_CANVAS}>
        <ScreenHeader title="My Diagnostic Pack" onBackPress={() => navigation.goBack()} />
        <View style={styles.centered}>
          <View style={styles.card}>
            <View style={styles.emptyCard}>
              <View style={styles.emptyIcon}>
                <Ionicons name="pulse-outline" size={28} color="#0D9488" />
              </View>
              <Text style={styles.emptyTitle}>Sign in required</Text>
              <Text style={styles.emptyBody}>
                Sign in to view your pack and service delivery status.
              </Text>
              <Pressable style={styles.primaryBtn} onPress={navigateToLogin}>
                <Text style={styles.primaryBtnText}>Log in</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaWrapper>
    );
  }

  if (screen.isLoading) {
    return (
      <SafeAreaWrapper edges={['top', 'bottom']} bgColor={PACK_CANVAS}>
        <ScreenHeader title="My Diagnostic Pack" onBackPress={() => navigation.goBack()} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0D9488" />
        </View>
      </SafeAreaWrapper>
    );
  }

  if (screen.errorMessage != null) {
    return (
      <SafeAreaWrapper edges={['top', 'bottom']} bgColor={PACK_CANVAS}>
        <ScreenHeader title="My Diagnostic Pack" onBackPress={() => navigation.goBack()} />
        <View style={styles.centered}>
          <Text style={styles.errorText}>{screen.errorMessage}</Text>
          <Pressable style={styles.retryBtn} onPress={screen.refresh}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </Pressable>
        </View>
      </SafeAreaWrapper>
    );
  }

  const dashboard = screen.dashboard;
  const current = dashboard?.current ?? null;

  if (current == null) {
    return (
      <SafeAreaWrapper edges={['top', 'bottom']} bgColor={PACK_CANVAS}>
        <ScreenHeader title="My Diagnostic Pack" onBackPress={() => navigation.goBack()} />
        <ScrollView
          style={styles.screen}
          contentContainerStyle={[styles.scrollContent, { flexGrow: 1, justifyContent: 'center' }]}
        >
          <View style={styles.card}>
            <View style={styles.emptyCard}>
              <View style={styles.emptyIcon}>
                <Ionicons name="pulse-outline" size={28} color="#0D9488" />
              </View>
              <Text style={styles.emptyTitle}>No diagnostic pack yet</Text>
              <Text style={styles.emptyBody}>
                Purchase a BIZ Diagnostic pack to unlock structured analysis and expert-backed
                delivery tracking.
              </Text>
              <Pressable style={styles.primaryBtn} onPress={navigateToPackages}>
                <Text style={styles.primaryBtnText}>View diagnostic packages</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaWrapper>
    );
  }

  const progressVal = dashboard?.serviceProgressPercent ?? 0;
  const purchasedLabel =
    current.startDate != null
      ? `Purchased ${new Date(current.startDate).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })}`
      : null;

  return (
    <SafeAreaWrapper edges={['top', 'bottom']} bgColor={PACK_CANVAS}>
      <ScreenHeader title="My Diagnostic Pack" onBackPress={() => navigation.goBack()} />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={screen.isRefreshing}
            onRefresh={screen.refresh}
            tintColor="#0D9488"
          />
        }
      >
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconWrap}>
              <Ionicons name="pulse-outline" size={22} color="#0D9488" />
            </View>
            <View style={styles.cardTitleBlock}>
              <View style={styles.cardTitleRow}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {current.packName ?? 'Diagnostic pack'}
                </Text>
                {dashboard?.displayStatus != null && dashboard.displayStatus.length > 0 ? (
                  <StatusBadge label={dashboard.displayStatus} />
                ) : null}
              </View>
              {purchasedLabel != null ? (
                <Text style={styles.cardSubtitle}>{purchasedLabel}</Text>
              ) : null}
            </View>
          </View>

          <View style={styles.progressBlock}>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabel}>Service delivery progress</Text>
              <Text style={styles.progressValue}>{Math.round(progressVal)}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progressVal}%` }]} />
            </View>
          </View>

          {dashboard?.nextServiceTitle != null &&
          dashboard.displayStatus === 'Active' ? (
            <View style={[styles.callout, styles.calloutNext]}>
              <Ionicons name="arrow-forward-circle-outline" size={20} color="#D97706" />
              <View style={{ flex: 1 }}>
                <Text style={styles.calloutTitle}>Next service</Text>
                <Text style={styles.calloutBody}>{dashboard.nextServiceTitle}</Text>
              </View>
            </View>
          ) : null}

          {dashboard?.upgradeHint != null && dashboard.displayStatus === 'Active' ? (
            <View style={[styles.callout, styles.calloutUpgrade]}>
              <Ionicons name="sparkles-outline" size={20} color="#0D9488" />
              <View style={{ flex: 1 }}>
                <Text style={styles.calloutBody}>{dashboard.upgradeHint}</Text>
                <Pressable style={styles.upgradeBtn} onPress={navigateToPackages}>
                  <Text style={styles.upgradeBtnText}>Upgrade options</Text>
                </Pressable>
              </View>
            </View>
          ) : null}
        </View>

        <View style={styles.card}>
          <View style={styles.servicesHeader}>
            <Text style={styles.servicesTitle}>Services</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Apply documents"
              disabled={screen.docItems.length === 0}
              onPress={screen.openApplyModal}
              style={({ pressed }) => [
                styles.applyBtn,
                screen.docItems.length === 0 ? styles.applyBtnDisabled : null,
                pressed && screen.docItems.length > 0 ? { opacity: 0.9 } : null,
              ]}
            >
              <Text style={styles.applyBtnText}>Apply</Text>
            </Pressable>
          </View>
          <Text style={styles.servicesDesc}>
            Status updates when our team progresses your diagnostic deliverables. Pull down to
            refresh.
          </Text>

          {(dashboard?.features ?? []).length === 0 ? (
            <Text style={styles.emptyServices}>No service rows yet for this pack.</Text>
          ) : (
            (dashboard?.features ?? []).map((feature: DiagnosisDashboardFeature, index: number) => (
              <ServiceRow
                key={feature.id}
                feature={feature}
                isFirst={index === 0}
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
    </SafeAreaWrapper>
  );
}
