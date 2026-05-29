import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  ACCOUNT_HUB_GREEN_HEADER_GRADIENT,
  ACCOUNT_HUB_GREEN_HEADER_STATUS_BAR,
  ACCOUNT_HUB_LIST_CANVAS,
} from '@/constants/accountScreenTheme';
import { ROUTES } from '@/navigation/routeNames';
import { navigationRef } from '@/navigation/navigationContainerRef';
import type { AccountStackParamList } from '@/navigation/types';
import { AccountHubScreenShell, AnimatedHeaderSearchBar } from '@/shared/components';

import { MyServiceCard } from '../components/MyServiceCard';
import { MyServiceCardSkeleton } from '../components/MyServiceCardSkeleton';
import { MyServiceDetailSheet } from '../components/MyServiceDetailSheet';
import { MyServicesFilterTabs } from '../components/MyServicesFilterTabs';
import { useMyServicesScreen } from '../hooks/useMyServicesScreen';
import type { MyOnboardingSubmission } from '../types/myServices.types';

type Nav = NativeStackNavigationProp<AccountStackParamList, typeof ROUTES.Account.MyServices>;

function matchesMyServiceSearch(item: MyOnboardingSubmission, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (q.length === 0) {
    return true;
  }
  const haystack = [
    item.serviceName,
    item.status,
    item.paymentMode,
    item.orderId,
    item.name,
    item.email,
  ]
    .filter((part) => part != null && String(part).trim().length > 0)
    .join(' ')
    .toLowerCase();
  return haystack.includes(q);
}

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
  const searchInputRef = useRef<TextInput>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const openSearch = useCallback((): void => {
    setSearchOpen(true);
  }, []);

  const closeSearch = useCallback((): void => {
    setSearchOpen(false);
    setSearchQuery('');
  }, []);

  const displayItems = useMemo(
    () => screen.filteredItems.filter((item) => matchesMyServiceSearch(item, searchQuery)),
    [screen.filteredItems, searchQuery],
  );

  const hasSearchQuery = searchQuery.trim().length > 0;

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

  const headerAccessory = (
    <View style={styles.headerAccessoryStack}>
      <AnimatedHeaderSearchBar
        visible={searchOpen}
        value={searchQuery}
        onChangeText={setSearchQuery}
        inputRef={searchInputRef}
        placeholder="Service name, status, payment…"
        accessibilityLabel="Search my services"
        embeddedInHeader
      />
      <MyServicesFilterTabs
        activeTab={screen.activeTab}
        allCount={screen.tabCounts.all}
        actionCount={screen.tabCounts.action}
        activeCount={screen.tabCounts.active}
        onTabChange={screen.setActiveTab}
      />
    </View>
  );

  return (
    <AccountHubScreenShell
      title="My Services"
      onBackPress={() => navigation.goBack()}
      canvasColor={ACCOUNT_HUB_LIST_CANVAS}
      headerColor={ACCOUNT_HUB_GREEN_HEADER_STATUS_BAR}
      headerGradientColors={ACCOUNT_HUB_GREEN_HEADER_GRADIENT}
      onSearchPress={searchOpen ? undefined : openSearch}
      headerRightAction={
        searchOpen ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close search"
            onPress={closeSearch}
            hitSlop={8}
            style={styles.headerIconBtn}
          >
            <Ionicons name="close" size={22} color="#FFFFFF" />
          </Pressable>
        ) : undefined
      }
      headerAccessory={headerAccessory}
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
          {[1, 2, 3, 4].map((k) => (
            <View key={k} style={styles.cardGap}>
              <MyServiceCardSkeleton />
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          data={displayItems}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          ListEmptyComponent={
            screen.items.length === 0 ? (
              <MyServicesEmpty onBrowse={navigateToBrowse} />
            ) : (
              <View style={styles.filterEmpty}>
                <Text style={styles.filterEmptyText}>
                  {hasSearchQuery
                    ? 'No services match your search.'
                    : 'No services in this filter.'}
                </Text>
              </View>
            )
          }
          contentContainerStyle={styles.listPad}
          ItemSeparatorComponent={() => <View style={styles.cardGap} />}
          refreshControl={
            <RefreshControl
              refreshing={screen.isRefreshing}
              onRefresh={screen.refresh}
              tintColor="#128C7E"
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
  headerAccessoryStack: {
    gap: 8,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listPad: {
    paddingHorizontal: 16,
    paddingTop: 12,
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
