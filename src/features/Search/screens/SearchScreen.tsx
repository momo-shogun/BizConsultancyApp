import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Keyboard,
  ListRenderItem,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { THEME } from '@/constants/theme';
import { useGetPublicServicesQuery } from '@/features/Services/api/servicesApi';
import { ROUTES } from '@/navigation/routeNames';
import type { RootStackParamList } from '@/navigation/types';
import { EmptyState } from '@/shared/components';

import { useSearchServicesQuery } from '../api/searchApi';
import { SearchDiscoveryPanel } from '../components/SearchDiscoveryPanel';
import { SearchResultRow } from '../components/SearchResultRow';
import { SearchResultsSkeleton } from '../components/SearchResultsSkeleton';
import { SearchScreenHeader } from '../components/SearchScreenHeader';
import {
  SEARCH_API_LIMIT,
  SEARCH_DEBOUNCE_MS,
  SEARCH_MIN_QUERY_LENGTH,
} from '../constants/searchContent';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useRecentSearches } from '../hooks/useRecentSearches';
import type { SearchScreenParams, ServiceSearchHit } from '../types/search.types';

type SearchRoute = RouteProp<RootStackParamList, typeof ROUTES.Root.Search>;

const DEFAULT_ACCENT = THEME.colors.primary;
const DEFAULT_HEADER_BG = THEME.colors.surface;

export function SearchScreen(): React.ReactElement {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<SearchRoute>();
  const insets = useSafeAreaInsets();

  const params: SearchScreenParams = route.params ?? {};
  const accentColor = params.accentColor ?? DEFAULT_ACCENT;
  const headerBackground = params.headerBackground ?? DEFAULT_HEADER_BG;

  const [query, setQuery] = useState<string>(params.initialQuery?.trim() ?? '');
  const debouncedQuery = useDebouncedValue(query, SEARCH_DEBOUNCE_MS);
  const { recent, recordSearch, clearAll } = useRecentSearches();

  const shouldFetch = debouncedQuery.trim().length >= SEARCH_MIN_QUERY_LENGTH;

  const { data: results = [], isFetching, isLoading } = useSearchServicesQuery(
    { q: debouncedQuery.trim(), limit: SEARCH_API_LIMIT },
    { skip: !shouldFetch },
  );

  const { data: bootstrapServices } = useGetPublicServicesQuery({
    page: 1,
    limit: 24,
    sortBy: 'position',
    sortOrder: 'desc',
  });

  const categoryLabels = useMemo((): string[] => {
    const labels = new Set<string>();
    for (const item of bootstrapServices?.items ?? []) {
      if (item.category.name.trim().length > 0) {
        labels.add(item.category.name.trim());
      }
    }
    return [...labels].slice(0, 8);
  }, [bootstrapServices?.items]);

  const showDiscovery = !shouldFetch;
  const showSkeleton = shouldFetch && (isLoading || isFetching) && results.length === 0;
  const showEmpty = shouldFetch && !isFetching && results.length === 0;
  const showResults = shouldFetch && results.length > 0;

  const close = useCallback((): void => {
    Keyboard.dismiss();
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  const openService = useCallback(
    async (hit: ServiceSearchHit): Promise<void> => {
      const term = query.trim();
      if (term.length >= SEARCH_MIN_QUERY_LENGTH) {
        await recordSearch(term);
      }
      navigation.navigate(ROUTES.Root.App, {
        screen: ROUTES.App.Services,
        params: {
          screen: ROUTES.Services.Detail,
          params: { slug: hit.slug },
        },
      });
    },
    [navigation, query, recordSearch],
  );

  const onSelectQuery = useCallback((term: string): void => {
    setQuery(term);
  }, []);

  const onQuickAction = useCallback(
    (actionId: string): void => {
      if (actionId === 'consultants') {
        navigation.navigate(ROUTES.Root.ConsultantsList);
        return;
      }
      if (actionId === 'services') {
        navigation.navigate(ROUTES.Root.App, {
          screen: ROUTES.App.Services,
          params: { screen: ROUTES.Services.List },
        });
        return;
      }
      if (actionId === 'workshops') {
        navigation.navigate(ROUTES.Root.WorkshopsList);
      }
    },
    [navigation],
  );

  const renderResult = useCallback<ListRenderItem<ServiceSearchHit>>(
    ({ item, index }) => (
      <SearchResultRow
        item={item}
        index={index}
        accentColor={accentColor}
        onPress={() => {
          void openService(item);
        }}
      />
    ),
    [accentColor, openService],
  );

  const keyExtractor = useCallback((item: ServiceSearchHit): string => item.slug, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={headerBackground} />
      <Animated.View
        entering={FadeInDown.duration(220)}
        style={[
          styles.headerBlock,
          {
            paddingTop: insets.top + THEME.spacing[8],
            backgroundColor: headerBackground,
          },
        ]}
      >
        <SearchScreenHeader
          value={query}
          onChangeText={setQuery}
          onClear={() => setQuery('')}
          onCancel={close}
          accentColor={accentColor}
        />
      </Animated.View>

      <View style={[styles.body, { paddingBottom: insets.bottom + THEME.spacing[8] }]}>
        {showDiscovery ? (
          <SearchDiscoveryPanel
            recent={recent}
            categoryLabels={categoryLabels}
            accentColor={accentColor}
            onSelectQuery={onSelectQuery}
            onClearRecent={() => {
              void clearAll();
            }}
            onQuickAction={onQuickAction}
          />
        ) : null}

        {showSkeleton ? <SearchResultsSkeleton /> : null}

        {showEmpty ? (
          <Animated.View entering={FadeIn.duration(240)} style={styles.emptyWrap}>
            <EmptyState
              title="No services found"
              description={`We couldn't find anything for "${debouncedQuery.trim()}". Try another keyword.`}
            />
          </Animated.View>
        ) : null}

        {showResults ? (
          <Animated.View entering={FadeIn.duration(200)} style={styles.resultsWrap}>
            <Text style={styles.resultsMeta}>
              {results.length} result{results.length === 1 ? '' : 's'}
            </Text>
            <FlatList
              data={results}
              keyExtractor={keyExtractor}
              renderItem={renderResult}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          </Animated.View>
        ) : null}
      </View>
    </View>
  );
}

export default SearchScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  headerBlock: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: THEME.colors.border,
  },
  body: {
    flex: 1,
    paddingBottom: THEME.spacing[8],
  },
  resultsWrap: {
    flex: 1,
  },
  resultsMeta: {
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[12],
    paddingBottom: THEME.spacing[4],
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium as '500',
    color: THEME.colors.textSecondary,
  },
  listContent: {
    paddingHorizontal: THEME.spacing[12],
    paddingBottom: THEME.spacing[24],
  },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: THEME.spacing[16],
  },
});
