import React, { useCallback, useMemo } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { PROFILE_HEADER_GRADIENT } from '@/features/Profile/constants/profileScreenTheme';
import { ROUTES } from '@/navigation/routeNames';
import { navigationRef } from '@/navigation/navigationContainerRef';
import type { AccountStackParamList } from '@/navigation/types';
import { SafeAreaWrapper, ScreenHeader } from '@/shared/components';
import { THEME } from '@/constants/theme';

import { MyServiceCard } from '../components/MyServiceCard';
import { MyServiceCardSkeleton } from '../components/MyServiceCardSkeleton';
import { MyServiceDetailSheet } from '../components/MyServiceDetailSheet';
import { MyServicesFilterBar } from '../components/MyServicesFilterBar';
import { useMyServicesScreen } from '../hooks/useMyServicesScreen';
import type { MyOnboardingSubmission } from '../types/myServices.types';

const CANVAS = '#F4F7FB';

type Nav = NativeStackNavigationProp<
  AccountStackParamList,
  typeof ROUTES.Account.ConsultantMyServices
>;

function EmptyState({ onBrowse }: { onBrowse: () => void }): React.ReactElement {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Ionicons name="briefcase-outline" size={32} color="#059669" />
      </View>
      <Text style={styles.emptyTitle}>No services yet</Text>
      <Text style={styles.emptyBody}>
        When you complete onboarding and payment for a service, it will appear here with
        status and payment details.
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={onBrowse}
        style={({ pressed }) => [styles.browseBtn, pressed ? { opacity: 0.92 } : null]}
      >
        <Text style={styles.browseBtnText}>Explore services</Text>
        <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

export function ConsultantMyServicesScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const screen = useMyServicesScreen();

  const selectedItem = useMemo((): MyOnboardingSubmission | null => {
    if (screen.selectedDetailId == null) {
      return null;
    }
    return screen.items.find((item) => item.id === screen.selectedDetailId) ?? null;
  }, [screen.items, screen.selectedDetailId]);

  const navigateToOnboarding = useCallback((item: MyOnboardingSubmission): void => {
    const slug = item.serviceSlug?.trim();
    if (slug == null || slug.length === 0) {
      return;
    }
    navigationRef.navigate(ROUTES.Root.App, {
      screen: ROUTES.App.Services,
      params: {
        screen: ROUTES.Services.Onboarding,
        params: { slug, submissionId: item.id },
      },
    });
  }, []);

  const navigateToBrowse = useCallback((): void => {
    navigationRef.navigate(ROUTES.Root.App, {
      screen: ROUTES.App.Services,
      params: { screen: ROUTES.Services.List },
    });
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: MyOnboardingSubmission }) => {
      const flags = screen.getCardFlags(item);
      return (
        <MyServiceCard
          item={item}
          showContinue={flags.showContinue}
          showApply={flags.showApply}
          isContinueLoading={flags.isContinueLoading}
          onPressDetails={() => screen.setSelectedDetailId(item.id)}
          onPressContinue={() => navigateToOnboarding(item)}
          onPressApply={() =>
            navigation.navigate(ROUTES.Account.ApplyService, {
              submissionId: item.id,
            })
          }
        />
      );
    },
    [navigation, navigateToOnboarding, screen],
  );

  const listHeader = (
    <>
      <LinearGradient
        colors={[...PROFILE_HEADER_GRADIENT]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <Text style={styles.heroEyebrow}>Consultant dashboard</Text>
        <Text style={styles.heroTitle}>My Services</Text>
        <Text style={styles.heroSubtitle}>
          Services purchased through onboarding submissions. Track payments, continue intake, and
          submit applications.
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total services</Text>
            <Text style={styles.statValue}>{screen.statsCount}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total amount</Text>
            <Text style={styles.statValue} numberOfLines={1}>
              {screen.statsTotal}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <MyServicesFilterBar
        tabs={screen.filterTabs}
        activeTab={screen.activeTab}
        counts={screen.tabCounts}
        onTabChange={screen.setActiveTab}
      />
    </>
  );

  return (
    <SafeAreaWrapper edges={['top', 'bottom']} bgColor={CANVAS}>
      <ScreenHeader title="My Services" onBackPress={() => navigation.goBack()} />

      {screen.errorMessage != null && !screen.isLoading ? (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle-outline" size={18} color={THEME.colors.danger} />
          <Text style={styles.errorText}>{screen.errorMessage}</Text>
          <Pressable accessibilityRole="button" onPress={screen.refresh}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : null}

      {screen.isLoading ? (
        <View style={styles.listPad}>
          {listHeader}
          {[1, 2, 3].map((key) => (
            <View key={key} style={styles.cardGap}>
              <MyServiceCardSkeleton />
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          data={screen.filteredItems}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={
            screen.items.length === 0 ? (
              <EmptyState onBrowse={navigateToBrowse} />
            ) : (
              <View style={styles.filterEmpty}>
                <Text style={styles.filterEmptyText}>No services in this filter.</Text>
              </View>
            )
          }
          contentContainerStyle={styles.listPad}
          ItemSeparatorComponent={() => <View style={styles.cardGap} />}
          refreshControl={
            <RefreshControl
              refreshing={screen.isRefreshing}
              onRefresh={screen.refresh}
              tintColor="#059669"
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      <MyServiceDetailSheet
        item={selectedItem}
        visible={screen.selectedDetailId != null}
        onClose={() => screen.setSelectedDetailId(null)}
      />
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: 20,
    padding: THEME.spacing[16],
    marginBottom: THEME.spacing[14],
    overflow: 'hidden',
  },
  heroEyebrow: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.82)',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  heroTitle: {
    marginTop: 4,
    fontSize: THEME.typography.size[20],
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  heroSubtitle: {
    marginTop: 6,
    fontSize: THEME.typography.size[12],
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: 'row',
    gap: THEME.spacing[10],
    marginTop: THEME.spacing[14],
  },
  statCard: {
    flex: 1,
    padding: THEME.spacing[12],
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.78)',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  statValue: {
    marginTop: 4,
    fontSize: THEME.typography.size[18],
    fontWeight: '800',
    color: '#FFFFFF',
  },
  listPad: {
    paddingHorizontal: THEME.spacing[16],
    paddingBottom: THEME.spacing[28],
  },
  cardGap: {
    height: THEME.spacing[12],
  },
  errorBanner: {
    marginHorizontal: THEME.spacing[16],
    marginBottom: THEME.spacing[8],
    padding: THEME.spacing[12],
    borderRadius: 14,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[10],
  },
  errorText: {
    flex: 1,
    fontSize: THEME.typography.size[12],
    color: THEME.colors.danger,
  },
  retryText: {
    fontSize: THEME.typography.size[12],
    fontWeight: '700',
    color: '#059669',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: THEME.spacing[20],
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: 'rgba(5,150,105,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing[16],
  },
  emptyTitle: {
    fontSize: THEME.typography.size[18],
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  emptyBody: {
    marginTop: THEME.spacing[8],
    fontSize: THEME.typography.size[14],
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 21,
  },
  browseBtn: {
    marginTop: THEME.spacing[20],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: THEME.spacing[16],
    paddingVertical: THEME.spacing[12],
    borderRadius: 999,
    backgroundColor: '#059669',
  },
  browseBtnText: {
    fontSize: THEME.typography.size[14],
    fontWeight: '700',
    color: '#FFFFFF',
  },
  filterEmpty: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  filterEmptyText: {
    fontSize: THEME.typography.size[14],
    color: '#64748B',
  },
});
