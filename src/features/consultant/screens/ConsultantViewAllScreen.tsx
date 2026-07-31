import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { skipToken } from '@reduxjs/toolkit/query';
import { useFocusEffect, useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { THEME } from '@/constants/theme';
import {
  useGetMasterCategoriesQuery,
  useGetMasterIndustriesQuery,
  useGetMasterSegmentsQuery,
  useGetPublicConsultantsQuery,
} from '@/features/consultant/api/consultantApi';
import { CONSULTANT_LIST_PAGE_SIZE } from '@/features/consultant/constants/pagination';
import {
  isRenderableConsultantCard,
  mapConsultantDetailToCardItem,
} from '@/features/consultant/utils/consultantMappers';
import { useConsultantBookingLoginGate } from '@/features/Consultation/hooks/useConsultantBookingLoginGate';
import {
  buildConsultantFilterSections,
  buildConsultantListFiltersFromMasterIds,
  buildPublicConsultantsListQuery,
  CONSULTANT_LIST_FILTER_KEYS,
  CONSULTANT_SEARCH_DEBOUNCE_MS,
  CONSULTANT_SEARCH_MIN_API_LENGTH,
  countActiveConsultantFilters,
  EMPTY_CONSULTANT_LIST_FILTERS,
  findFilterOptionLabel,
  mapMasterToFilterOptions,
} from '@/features/consultant/utils/consultantListFilters';
import { getApiErrorMessage } from '@/utils/apiError';
import { ROUTES } from '@/navigation/routeNames';
import { navigationRef } from '@/navigation/navigationContainerRef';
import type { RootStackParamList } from '@/navigation/types';
import {
  ContentPlaceholder,
  EmptyState,
  FilterChipsBar,
  FilterSheet,
  type FilterChipItem,
  type FilterSection,
  type FilterSheetValue,
  SafeAreaWrapper,
  ScreenHeader,
  ScreenWrapper,
  TopConsultantCard,
  type TopConsultantItem,
} from '@/shared/components';
import { showGlobalError } from '@/shared/components/toast';

const LIST_GAP = THEME.spacing[10];
const H_PADDING = THEME.spacing[12];

const PLACEHOLDER_CARD_COUNT = 6;
const PLACEHOLDER_KEYS = Array.from({ length: PLACEHOLDER_CARD_COUNT }, (_, i) => `placeholder-${i}`);

type ConsultantsListRouteProp = RouteProp<
  RootStackParamList,
  typeof ROUTES.Root.ConsultantsList
>;

type SortMode = 'recommended' | 'name' | 'rate_low' | 'rate_high';

function resolveConsultantListRouteFilters(
  params: ConsultantsListRouteProp['params'],
): FilterSheetValue {
  if (params?.categoryId == null && params?.segmentId == null) {
    return EMPTY_CONSULTANT_LIST_FILTERS;
  }
  return buildConsultantListFiltersFromMasterIds(params?.categoryId, params?.segmentId);
}

function parseRateRupee(label: string): number {
  const normalized = label.replace(/[₹,\s]/g, '');
  const m = normalized.match(/(\d+)/);
  return m ? Number.parseInt(m[1], 10) : 0;
}

function sortConsultants(items: TopConsultantItem[], mode: SortMode): TopConsultantItem[] {
  const next = [...items];
  if (mode === 'name') {
    next.sort((a, b) => a.name.localeCompare(b.name));
  } else if (mode === 'rate_low') {
    next.sort((a, b) => parseRateRupee(a.rateLabel) - parseRateRupee(b.rateLabel));
  } else if (mode === 'rate_high') {
    next.sort((a, b) => parseRateRupee(b.rateLabel) - parseRateRupee(a.rateLabel));
  }
  return next;
}

export function ConsultantViewAllScreen(): React.ReactElement {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<ConsultantsListRouteProp>();
  const { width } = useWindowDimensions();
  const { ensureVerifiedLogin, consultantBookingLoginDialog } = useConsultantBookingLoginGate();

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [sortMode, setSortMode] = useState<SortMode>('recommended');
  const [filters, setFilters] = useState<FilterSheetValue>(() =>
    resolveConsultantListRouteFilters(route.params),
  );
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(searchQuery.trim()), CONSULTANT_SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [searchQuery]);

  useEffect(() => {
    const nextFilters = resolveConsultantListRouteFilters(route.params);
    const hasRouteFilters =
      route.params?.categoryId != null || route.params?.segmentId != null;
    if (!hasRouteFilters) {
      return;
    }
    setFilters(nextFilters);
    setPage(1);
  }, [route.params]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters]);

  const selectedCategoryId = filters.selected[CONSULTANT_LIST_FILTER_KEYS.category];
  const selectedSegmentId = filters.selected[CONSULTANT_LIST_FILTER_KEYS.segment];

  const { data: masterCategories = [] } = useGetMasterCategoriesQuery();
  const { data: masterSegments = [] } = useGetMasterSegmentsQuery(
    selectedCategoryId != null ? { categoryId: selectedCategoryId } : skipToken,
  );
  const { data: masterIndustries = [] } = useGetMasterIndustriesQuery(
    selectedCategoryId != null || selectedSegmentId != null
      ? {
          ...(selectedCategoryId != null ? { categoryId: selectedCategoryId } : {}),
          ...(selectedSegmentId != null ? { segmentId: selectedSegmentId } : {}),
        }
      : skipToken,
  );

  const categoryOptions = useMemo(
    () => mapMasterToFilterOptions(masterCategories),
    [masterCategories],
  );
  const segmentOptions = useMemo(
    () => mapMasterToFilterOptions(masterSegments),
    [masterSegments],
  );
  const industryOptions = useMemo(
    () => mapMasterToFilterOptions(masterIndustries),
    [masterIndustries],
  );

  const filterSections = useMemo<FilterSection[]>(
    () => buildConsultantFilterSections(categoryOptions, segmentOptions, industryOptions),
    [categoryOptions, industryOptions, segmentOptions],
  );

  const listQuery = useMemo(
    () => buildPublicConsultantsListQuery(filters, debouncedSearch, page, CONSULTANT_LIST_PAGE_SIZE),
    [debouncedSearch, filters, page],
  );

  const {
    data: consultantsPage,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetPublicConsultantsQuery(listQuery);

  const lastToastErrorRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isError) {
      lastToastErrorRef.current = null;
      return;
    }
    const message = getApiErrorMessage(error, 'Could not load consultants. Please try again.');
    if (lastToastErrorRef.current === message) {
      return;
    }
    lastToastErrorRef.current = message;
    showGlobalError(message, 'Unable to load consultants');
  }, [error, isError]);

  const consultantItems = useMemo((): TopConsultantItem[] => {
    const rows = consultantsPage?.items ?? [];
    return rows.map(mapConsultantDetailToCardItem).filter(isRenderableConsultantCard);
  }, [consultantsPage?.items]);

  const hasMore = consultantsPage?.hasMore ?? false;
  /** Server-side search is active once debounced query meets API min length. */
  const isApiSearchActive = debouncedSearch.length >= CONSULTANT_SEARCH_MIN_API_LENGTH;
  const hasSearchDraft = searchQuery.trim().length > 0;
  const isSearchPending =
    hasSearchDraft &&
    searchQuery.trim() !== debouncedSearch &&
    searchQuery.trim().length >= CONSULTANT_SEARCH_MIN_API_LENGTH;
  const isInitialLoading =
    (isLoading || isFetching || isSearchPending) && page === 1 && consultantItems.length === 0;
  const isLoadingMore = isFetching && page > 1 && consultantItems.length > 0;
  const isRefreshingSearch =
    isApiSearchActive && (isFetching || isSearchPending) && page === 1 && consultantItems.length > 0;
  const showPlaceholders = isInitialLoading;
  const activeFilterCount = useMemo(() => countActiveConsultantFilters(filters), [filters]);

  const displayItems = useMemo((): TopConsultantItem[] => {
    // Search/filter results come from `GET public/consultants` — no client-side filter.
    return sortConsultants(consultantItems, sortMode);
  }, [consultantItems, sortMode]);

  const loadMore = useCallback((): void => {
    if (!hasMore || isFetching) {
      return;
    }
    setPage((prev) => prev + 1);
  }, [hasMore, isFetching]);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({ headerShown: false });
    }, [navigation]),
  );

  const cardWidth = useMemo((): number => {
    const gutter = LIST_GAP + 14;
    const inner = width - H_PADDING * 2 - gutter;
    return Math.max(148, Math.floor(inner / 2));
  }, [width]);

  const handleFilterChange = useCallback((next: FilterSheetValue): void => {
    const prevCategory = filters.selected[CONSULTANT_LIST_FILTER_KEYS.category];
    const nextCategory = next.selected[CONSULTANT_LIST_FILTER_KEYS.category];
    const prevSegment = filters.selected[CONSULTANT_LIST_FILTER_KEYS.segment];
    const nextSegment = next.selected[CONSULTANT_LIST_FILTER_KEYS.segment];

    if (nextCategory !== prevCategory) {
      setFilters({
        selected: {
          ...next.selected,
          [CONSULTANT_LIST_FILTER_KEYS.segment]: null,
          [CONSULTANT_LIST_FILTER_KEYS.industry]: null,
        },
      });
      return;
    }

    if (nextSegment !== prevSegment) {
      setFilters({
        selected: {
          ...next.selected,
          [CONSULTANT_LIST_FILTER_KEYS.industry]: null,
        },
      });
      return;
    }

    setFilters(next);
  }, [filters.selected]);

  const clearFilterKey = useCallback((key: string): void => {
    setFilters((prev) => ({
      selected: {
        ...prev.selected,
        [key]: null,
        ...(key === CONSULTANT_LIST_FILTER_KEYS.category
          ? {
              [CONSULTANT_LIST_FILTER_KEYS.segment]: null,
              [CONSULTANT_LIST_FILTER_KEYS.industry]: null,
            }
          : {}),
        ...(key === CONSULTANT_LIST_FILTER_KEYS.segment
          ? { [CONSULTANT_LIST_FILTER_KEYS.industry]: null }
          : {}),
      },
    }));
  }, []);

  const onSortPress = useCallback((): void => {
    setSortMode((prev) => {
      if (prev === 'recommended') return 'name';
      if (prev === 'name') return 'rate_low';
      if (prev === 'rate_low') return 'rate_high';
      return 'recommended';
    });
  }, []);

  const sortLabel = useMemo((): string => {
    if (sortMode === 'name') return 'Name A–Z';
    if (sortMode === 'rate_low') return 'Fee · Low';
    if (sortMode === 'rate_high') return 'Fee · High';
    return 'Recommended';
  }, [sortMode]);

  const chipItems = useMemo((): FilterChipItem[] => {
    const chips: FilterChipItem[] = [];

    const categoryId = filters.selected[CONSULTANT_LIST_FILTER_KEYS.category];
    const segmentId = filters.selected[CONSULTANT_LIST_FILTER_KEYS.segment];
    const industryId = filters.selected[CONSULTANT_LIST_FILTER_KEYS.industry];

    const categoryLabel = findFilterOptionLabel(categoryOptions, categoryId);
    if (categoryLabel != null) {
      chips.push({
        id: 'active-category',
        label: categoryLabel,
        isSelected: true,
        onPress: () => clearFilterKey(CONSULTANT_LIST_FILTER_KEYS.category),
      });
    }

    const segmentLabel = findFilterOptionLabel(segmentOptions, segmentId);
    if (segmentLabel != null) {
      chips.push({
        id: 'active-segment',
        label: segmentLabel,
        isSelected: true,
        onPress: () => clearFilterKey(CONSULTANT_LIST_FILTER_KEYS.segment),
      });
    }

    const industryLabel = findFilterOptionLabel(industryOptions, industryId);
    if (industryLabel != null) {
      chips.push({
        id: 'active-industry',
        label: industryLabel,
        isSelected: true,
        onPress: () => clearFilterKey(CONSULTANT_LIST_FILTER_KEYS.industry),
      });
    }

    const quickCategories = categoryOptions.slice(0, 3);
    for (const option of quickCategories) {
      if (option.id === categoryId) {
        continue;
      }
      chips.push({
        id: `quick-${option.id}`,
        label: option.label,
        isSelected: false,
        onPress: () => {
          setFilters({
            selected: {
              ...filters.selected,
              [CONSULTANT_LIST_FILTER_KEYS.category]: option.id,
              [CONSULTANT_LIST_FILTER_KEYS.segment]: null,
              [CONSULTANT_LIST_FILTER_KEYS.industry]: null,
            },
          });
        },
      });
    }

    return chips;
  }, [
    categoryOptions,
    clearFilterKey,
    filters.selected,
    industryOptions,
    segmentOptions,
  ]);

  const handleBackPress = useCallback((): void => {
    if (route.params?.returnTo === 'services-list' && navigationRef.isReady()) {
      navigationRef.navigate(ROUTES.Root.App, {
        screen: ROUTES.App.Services,
        params: { screen: ROUTES.Services.List },
      });
      return;
    }
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation, route.params?.returnTo]);

  const keyExtractor = useCallback((item: TopConsultantItem): string => item.id, []);

  const renderConsultantItem = useCallback<ListRenderItem<TopConsultantItem>>(
    ({ item }) => (
      <View style={styles.cardCell}>
        <TopConsultantCard
          item={item}
          cardWidth={cardWidth}
          showSpecialtyInMeta={false}
          bioNumberOfLines={1}
          onPress={() =>
            navigation.navigate(ROUTES.Root.ConsultantDetail, {
              slug: item.slug ?? item.id,
            })
          }
          onBookPress={() => {
            if (!ensureVerifiedLogin()) {
              return;
            }
            const parsedId = Number(item.id);
            const consultationType = 'video' as const;
            navigation.navigate(ROUTES.Root.ConsultationOnboarding, {
              consultantId: Number.isFinite(parsedId) && parsedId > 0 ? parsedId : undefined,
              consultantSlug: item.slug ?? item.id,
              consultantName: item.name,
              consultationType,
              price: parseRateRupee(item.rateLabel) || undefined,
            });
          }}
        />
      </View>
    ),
    [cardWidth, ensureVerifiedLogin, navigation],
  );

  const renderPlaceholderItem = useCallback<ListRenderItem<string>>(
    () => (
      <View style={styles.cardCell}>
        <ContentPlaceholder variant="consultant-card" cardWidth={cardWidth} />
      </View>
    ),
    [cardWidth],
  );

  const toggleSearch = useCallback((): void => {
    setIsSearchOpen((open) => {
      if (open) {
        setSearchQuery('');
        Keyboard.dismiss();
      }
      return !open;
    });
  }, []);

  const clearSearch = useCallback((): void => {
    setSearchQuery('');
  }, []);

  const ListHeader = useCallback(
    (): React.ReactElement => (
      <View style={styles.listHeader}>
        <FilterChipsBar
          onSortPress={onSortPress}
          onFilterPress={() => setIsFilterOpen(true)}
          chips={chipItems}
        />
        <View style={styles.sortHint}>
          {activeFilterCount > 0 ? (
            <Text style={styles.sortHintText}>
              {activeFilterCount} filter{activeFilterCount === 1 ? '' : 's'} active
            </Text>
          ) : null}
          {isApiSearchActive ? (
            <Text style={styles.sortHintText}>Search: “{debouncedSearch}”</Text>
          ) : null}
          <Text style={styles.sortHintText}>Sort: {sortLabel}</Text>
          {(isFetching || isSearchPending) && !isLoading ? (
            <ActivityIndicator size="small" color={THEME.colors.primary} style={styles.fetchingIndicator} />
          ) : null}
        </View>
      </View>
    ),
    [
      activeFilterCount,
      chipItems,
      debouncedSearch,
      isApiSearchActive,
      isFetching,
      isLoading,
      isSearchPending,
      onSortPress,
      sortLabel,
    ],
  );

  const ListFooter = useCallback((): React.ReactElement | null => {
    if (!isLoadingMore) {
      return null;
    }
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={THEME.colors.primary} />
        <Text style={styles.footerLoaderText}>Loading more…</Text>
      </View>
    );
  }, [isLoadingMore]);

  return (
    <SafeAreaWrapper edges={['top', 'bottom']}>
      {consultantBookingLoginDialog}
      <ScreenHeader
        title="Consultants"
        onBackPress={handleBackPress}
        onSearchPress={toggleSearch}
      />

      {isSearchOpen ? (
        <View style={styles.searchBlock}>
          <View style={styles.searchField}>
            <Ionicons name="search-outline" size={18} color={THEME.colors.primary} />
            <TextInput
              accessibilityLabel="Search consultants"
              placeholder="Name, designation, skills…"
              placeholderTextColor={THEME.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
              returnKeyType="search"
              clearButtonMode="while-editing"
              autoFocus
              autoCorrect={false}
              autoCapitalize="none"
              onSubmitEditing={() => Keyboard.dismiss()}
              selectionColor={THEME.colors.primary}
            />
            {isRefreshingSearch || isSearchPending ? (
              <ActivityIndicator size="small" color={THEME.colors.primary} />
            ) : null}
            {searchQuery.length > 0 ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Clear search"
                onPress={clearSearch}
                hitSlop={8}
              >
                <Ionicons name="close-circle" size={20} color={THEME.colors.textSecondary} />
              </Pressable>
            ) : null}
          </View>
          {hasSearchDraft && !isApiSearchActive && !isSearchPending ? (
            <Text style={styles.searchHint}>
              Type at least {CONSULTANT_SEARCH_MIN_API_LENGTH} characters to search
            </Text>
          ) : null}
        </View>
      ) : null}

      <ScreenWrapper>
        {showPlaceholders ? (
          <FlatList
            data={PLACEHOLDER_KEYS}
            keyExtractor={(key) => key}
            numColumns={2}
            renderItem={renderPlaceholderItem}
            ListHeaderComponent={ListHeader}
            columnWrapperStyle={styles.columnWrap}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        ) : (
          <FlatList
            data={displayItems}
            keyExtractor={keyExtractor}
            numColumns={2}
            renderItem={renderConsultantItem}
            ListHeaderComponent={ListHeader}
            ListFooterComponent={ListFooter}
            columnWrapperStyle={styles.columnWrap}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onEndReached={loadMore}
            onEndReachedThreshold={0.35}
            ListEmptyComponent={
              <EmptyState
                title={
                  isError
                    ? 'Consultants unavailable'
                    : isApiSearchActive || activeFilterCount > 0
                      ? 'No consultants match'
                      : 'No consultants yet'
                }
                description={
                  isError
                    ? 'Pull to refresh or check your connection.'
                    : isApiSearchActive
                      ? `No experts matched “${debouncedSearch}”. Try another keyword.`
                      : activeFilterCount > 0
                        ? 'Try adjusting filters.'
                        : 'New experts will appear here once they are onboarded.'
                }
              />
            }
          />
        )}

        <FilterSheet
          visible={isFilterOpen}
          title="Filters"
          sections={filterSections}
          value={filters}
          onChange={handleFilterChange}
          onClose={() => setIsFilterOpen(false)}
          onApply={() => setIsFilterOpen(false)}
          onClear={() => setFilters(EMPTY_CONSULTANT_LIST_FILTERS)}
        />
      </ScreenWrapper>
    </SafeAreaWrapper>
  );
}

export default ConsultantViewAllScreen;

const styles = StyleSheet.create({
  searchBlock: {
    backgroundColor: THEME.colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: THEME.colors.border,
    paddingHorizontal: H_PADDING,
    paddingTop: THEME.spacing[8],
    paddingBottom: THEME.spacing[10],
  },
  searchField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
    minHeight: 44,
    paddingHorizontal: THEME.spacing[12],
    borderRadius: THEME.radius[12],
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.surface,
  },
  searchHint: {
    marginTop: THEME.spacing[4],
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
  },
  searchInput: {
    flex: 1,
    paddingVertical: THEME.spacing[10],
    fontSize: THEME.typography.size[14],
    color: THEME.colors.textPrimary,
  },
  listContent: {
    paddingHorizontal: H_PADDING,
    paddingTop: THEME.spacing[10],
    paddingBottom: THEME.spacing[20],
    flexGrow: 1,
  },
  listHeader: {
    width: '100%',
    marginBottom: THEME.spacing[10],
  },
  sortHint: {
    marginTop: THEME.spacing[8],
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: THEME.spacing[8],
  },
  sortHintText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium as '500',
    color: THEME.colors.textSecondary,
  },
  fetchingIndicator: {
    marginLeft: THEME.spacing[4],
  },
  columnWrap: {
    justifyContent: 'space-between',
    marginBottom: LIST_GAP,
    gap: LIST_GAP,
  },
  cardCell: {
    flex: 1,
    minWidth: 0,
    maxWidth: '50%',
  },
  footerLoader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing[8],
    paddingVertical: THEME.spacing[16],
  },
  footerLoaderText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium as '500',
    color: THEME.colors.textSecondary,
  },
});
