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

import { ROUTES } from '@/navigation/routeNames';
import { navigationRef } from '@/navigation/navigationContainerRef';
import type { AccountStackParamList } from '@/navigation/types';
import { AccountHubScreenShell } from '@/shared/components';

import { MyServiceCard } from '../components/MyServiceCard';
import { MyServiceCardSkeleton } from '../components/MyServiceCardSkeleton';
import { MyServiceDetailSheet } from '../components/MyServiceDetailSheet';
import { MyServicesFilterBar } from '../components/MyServicesFilterBar';
import { useMyServicesScreen } from '../hooks/useMyServicesScreen';
import type { MyOnboardingSubmission } from '../types/myServices.types';

type Nav = NativeStackNavigationProp<AccountStackParamList, typeof ROUTES.Account.MyServices>;

function MyServicesEmpty({ onBrowse }: { onBrowse: () => void }): React.ReactElement {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Ionicons name="briefcase-outline" size={36} color="#0F5132" />
      </View>
      <Text style={styles.emptyTitle}>No services yet</Text>
      <Text style={styles.emptyBody}>
        When you complete onboarding and payment for a service, it will appear here with
        status and payment details.
      </Text>
      <Pressable style={styles.browseBtn} onPress={onBrowse}>
        <Text style={styles.browseBtnText}>Browse services</Text>
      </Pressable>
    </View>
  );
}

export function MyServicesScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const screen = useMyServicesScreen();

  const selectedItem = useMemo((): MyOnboardingSubmission | null => {
    if (screen.selectedDetailId == null) {
      return null;
    }
    return screen.items.find((i) => i.id === screen.selectedDetailId) ?? null;
  }, [screen.items, screen.selectedDetailId]);

  const navigateToOnboarding = useCallback((item: MyOnboardingSubmission): void => {
    const slug = item.serviceSlug?.trim();
    if (!slug) {
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
        colors={['#0B3B66', '#146E9A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <Text style={styles.heroTitle}>My services</Text>
        <Text style={styles.heroSubtitle}>
          Track registrations, payments, and application progress.
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Services</Text>
            <Text style={styles.statValue}>{screen.statsCount}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total paid</Text>
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
    <AccountHubScreenShell
      title="My Services"
      onBackPress={() => navigation.goBack()}
      canvasColor="#F4F7FA"
    >
      {screen.errorMessage != null && !screen.isLoading ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{screen.errorMessage}</Text>
          <Pressable onPress={screen.refresh}>
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      ) : null}

      {screen.isLoading ? (
        <View style={styles.listPad}>
          {listHeader}
          {[1, 2, 3, 4].map((k) => (
            <View key={k} style={styles.cardGap}>
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
              <MyServicesEmpty onBrowse={navigateToBrowse} />
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
              tintColor="#0B3B66"
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
    </AccountHubScreenShell>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    overflow: 'hidden',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  statCard: {
    flex: 1,
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  statValue: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  listPad: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  cardGap: {
    height: 12,
  },
  errorBanner: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: '#B91C1C',
  },
  retryText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B3B66',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0B3258',
  },
  emptyBody: {
    marginTop: 8,
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  browseBtn: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#0F5132',
  },
  browseBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  filterEmpty: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  filterEmptyText: {
    fontSize: 14,
    color: '#64748B',
  },
});
