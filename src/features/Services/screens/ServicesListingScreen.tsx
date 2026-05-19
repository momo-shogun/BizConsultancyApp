import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';
import { ROUTES } from '@/navigation/routeNames';
import type { ServicesStackParamList } from '@/navigation/types';
import {
  ContentPlaceholder,
  EmptyState,
  FilterChipsBar,
  FilterSheet,
  type FilterChipItem,
  type FilterSection,
  type FilterSheetValue,
  RecommendedServiceCard,
  type RecommendedServiceItem,
  SafeAreaWrapper,
  ScreenHeader,
  ScreenWrapper,
} from '@/shared/components';

import { useBizAIScrollReporter } from '@/features/BizAI/hooks/useBizAIScrollReporter';
import { useGetPublicServicesQuery } from '@/features/Services/api/servicesApi';
import { mapPublicServiceToCardItem } from '@/features/Services/utils/serviceMappers';
import {
  buildPublicServicesListQuery,
  buildServiceFilterSections,
  countActiveServiceFilters,
  EMPTY_SERVICE_LIST_FILTERS,
  extractCategoryOptions,
  extractSubCategoryOptions,
  findFilterOptionLabel,
  matchesServiceSearch,
  SERVICE_LIST_FILTER_KEYS,
  SERVICE_SEARCH_DEBOUNCE_MS,
  SERVICE_SEARCH_MIN_API_LENGTH,
} from '@/features/Services/utils/servicesListFilters';

const LIST_SEPARATOR_HEIGHT = THEME.spacing[12];
const CATEGORY_BOOTSTRAP_LIMIT = 100;
const H_PADDING = THEME.spacing[16];
const PLACEHOLDER_CARD_COUNT = 5;
const PLACEHOLDER_KEYS = Array.from(
  { length: PLACEHOLDER_CARD_COUNT },
  (_, index) => `service-placeholder-${index}`,
);

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<RecommendedServiceItem>);
const AnimatedPlaceholderFlatList = Animated.createAnimatedComponent(FlatList<string>);

export function ServicesListingScreen(): React.ReactElement {
  const navigation = useNavigation<NativeStackNavigationProp<ServicesStackParamList>>();
  const onBizAiScroll = useBizAIScrollReporter();
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterSheetValue>(EMPTY_SERVICE_LIST_FILTERS);

  useEffect(() => {
    const handle = setTimeout(
      () => setDebouncedSearch(searchQuery.trim()),
      SERVICE_SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(handle);
  }, [searchQuery]);

  const listQuery = useMemo(
    () => buildPublicServicesListQuery(filters, debouncedSearch),
    [debouncedSearch, filters],
  );

  const bootstrapQuery = useMemo(
    () => ({
      page: 1,
      limit: CATEGORY_BOOTSTRAP_LIMIT,
      sortBy: 'position' as const,
      sortOrder: 'desc' as const,
    }),
    [],
  );

  const { data: bootstrapData } = useGetPublicServicesQuery(bootstrapQuery);
  const { data, isLoading, isFetching } = useGetPublicServicesQuery(listQuery);

  const categoryOptions = useMemo(
    () => extractCategoryOptions(bootstrapData?.items ?? []),
    [bootstrapData?.items],
  );

  const subCategoryOptions = useMemo(
    () =>
      extractSubCategoryOptions(
        bootstrapData?.items ?? [],
        filters.selected[SERVICE_LIST_FILTER_KEYS.category],
      ),
    [bootstrapData?.items, filters.selected],
  );

  const filterSections = useMemo<FilterSection[]>(
    () => buildServiceFilterSections(categoryOptions, subCategoryOptions),
    [categoryOptions, subCategoryOptions],
  );

  const serviceItems = useMemo((): RecommendedServiceItem[] => {
    if (data == null || data.items.length === 0) {
      return [];
    }
    return data.items.map(mapPublicServiceToCardItem);
  }, [data]);

  const displayItems = useMemo((): RecommendedServiceItem[] => {
    const useLocalSearch = debouncedSearch.length < SERVICE_SEARCH_MIN_API_LENGTH;
    if (!useLocalSearch) {
      return serviceItems;
    }
    return serviceItems.filter((item) => matchesServiceSearch(item, searchQuery));
  }, [debouncedSearch, searchQuery, serviceItems]);

  const activeFilterCount = useMemo(() => countActiveServiceFilters(filters), [filters]);
  const hasSearchQuery = searchQuery.trim().length > 0;
  const isInitialLoading =
    (isLoading || isFetching) && displayItems.length === 0;

  const handleFilterChange = useCallback((next: FilterSheetValue): void => {
    const prevCategory = filters.selected[SERVICE_LIST_FILTER_KEYS.category];
    const nextCategory = next.selected[SERVICE_LIST_FILTER_KEYS.category];
    if (nextCategory !== prevCategory) {
      setFilters({
        selected: {
          ...next.selected,
          [SERVICE_LIST_FILTER_KEYS.subCategory]: null,
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
        ...(key === SERVICE_LIST_FILTER_KEYS.category
          ? { [SERVICE_LIST_FILTER_KEYS.subCategory]: null }
          : {}),
      },
    }));
  }, []);

  const chipItems = useMemo((): FilterChipItem[] => {
    const chips: FilterChipItem[] = [];
    const categoryId = filters.selected[SERVICE_LIST_FILTER_KEYS.category];
    const subCategoryId = filters.selected[SERVICE_LIST_FILTER_KEYS.subCategory];
    const priceId = filters.selected[SERVICE_LIST_FILTER_KEYS.price];

    const categoryLabel = findFilterOptionLabel(categoryOptions, categoryId);
    if (categoryLabel != null) {
      chips.push({
        id: 'active-category',
        label: categoryLabel,
        isSelected: true,
        onPress: () => clearFilterKey(SERVICE_LIST_FILTER_KEYS.category),
      });
    }

    const subCategoryLabel = findFilterOptionLabel(subCategoryOptions, subCategoryId);
    if (subCategoryLabel != null) {
      chips.push({
        id: 'active-subcategory',
        label: subCategoryLabel,
        isSelected: true,
        onPress: () => clearFilterKey(SERVICE_LIST_FILTER_KEYS.subCategory),
      });
    }

    if (priceId != null) {
      const priceLabel = findFilterOptionLabel(
        filterSections.find((s) => s.id === SERVICE_LIST_FILTER_KEYS.price)?.options ?? [],
        priceId,
      );
      if (priceLabel != null) {
        chips.push({
          id: 'active-price',
          label: priceLabel,
          isSelected: true,
          onPress: () => clearFilterKey(SERVICE_LIST_FILTER_KEYS.price),
        });
      }
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
              [SERVICE_LIST_FILTER_KEYS.category]: option.id,
              [SERVICE_LIST_FILTER_KEYS.subCategory]: null,
            },
          });
        },
      });
    }

    return chips;
  }, [
    categoryOptions,
    clearFilterKey,
    filterSections,
    filters.selected,
    subCategoryOptions,
  ]);

  const goToDetail = useCallback(
    (slug: string): void => {
      navigation.navigate(ROUTES.Services.Detail, { slug });
    },
    [navigation],
  );

  const renderPlaceholderItem = useCallback<ListRenderItem<string>>(
    () => <ContentPlaceholder variant="service-card" />,
    [],
  );

  const renderItem = useCallback<ListRenderItem<RecommendedServiceItem>>(
    ({ item }) => {
      return (
        <RecommendedServiceCard
          item={item}
          cardWidth="100%"
          fullWidth
          onPress={() => {
            goToDetail(item.slug);
          }}
          onCtaPress={() => {
            goToDetail(item.slug);
          }}
        />
      );
    },
    [goToDetail],
  );

  const keyExtractor = useCallback((i: RecommendedServiceItem): string => i.id, []);

  const ItemSeparator = useCallback((): React.ReactElement => {
    return <View style={styles.separator} />;
  }, []);

  const ListHeader = useCallback((): React.ReactElement => {
    return (
      <View style={styles.listHeader}>
        <FilterChipsBar
          onFilterPress={() => setIsFilterOpen(true)}
          chips={chipItems}
        />
        <View style={styles.metaRow}>
          {activeFilterCount > 0 ? (
            <Text style={styles.metaText}>
              {activeFilterCount} filter{activeFilterCount === 1 ? '' : 's'} active
            </Text>
          ) : null}
          {isFetching && !isLoading ? (
            <ActivityIndicator size="small" color={THEME.colors.primary} />
          ) : null}
        </View>
      </View>
    );
  }, [activeFilterCount, chipItems, isFetching, isLoading]);

  return (
    <SafeAreaWrapper edges={['top', 'bottom']}>
      <ScreenHeader
        title="Services"
        onSearchPress={() => setIsSearchOpen((v) => !v)}
      />

      {isSearchOpen ? (
        <View style={styles.searchRow}>
          <TextInput
            accessibilityLabel="Search services"
            placeholder="Service name, category…"
            placeholderTextColor={THEME.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            returnKeyType="search"
            clearButtonMode="while-editing"
            autoFocus
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            onPress={() => setSearchQuery('')}
            disabled={searchQuery.length === 0}
            hitSlop={8}
          >
            <Ionicons
              name="close-circle"
              size={22}
              color={
                searchQuery.length === 0
                  ? THEME.colors.border
                  : THEME.colors.textSecondary
              }
            />
          </Pressable>
        </View>
      ) : null}

      <ScreenWrapper>
        {isInitialLoading ? (
          <AnimatedPlaceholderFlatList
            data={PLACEHOLDER_KEYS}
            keyExtractor={(key) => key}
            renderItem={renderPlaceholderItem}
            ItemSeparatorComponent={ItemSeparator}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            ListHeaderComponent={ListHeader}
            onScroll={onBizAiScroll}
            scrollEventThrottle={16}
          />
        ) : (
          <AnimatedFlatList
            data={displayItems}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ItemSeparatorComponent={ItemSeparator}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            ListHeaderComponent={ListHeader}
            onScroll={onBizAiScroll}
            scrollEventThrottle={16}
            ListEmptyComponent={
              <EmptyState
                title={hasSearchQuery ? 'No services match' : 'No services found'}
                description={
                  hasSearchQuery
                    ? 'Try different keywords or adjust filters.'
                    : 'Try adjusting filters or check back later.'
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
          onClear={() => setFilters(EMPTY_SERVICE_LIST_FILTERS)}
        />
      </ScreenWrapper>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
    paddingHorizontal: H_PADDING,
    paddingVertical: THEME.spacing[8],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: THEME.colors.border,
    backgroundColor: THEME.colors.background,
  },
  searchInput: {
    flex: 1,
    minHeight: 40,
    paddingVertical: THEME.spacing[8],
    paddingHorizontal: THEME.spacing[10],
    borderRadius: THEME.radius[12],
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.white,
    fontSize: THEME.typography.size[14],
    color: THEME.colors.textPrimary,
  },
  content: {
    padding: THEME.spacing[16],
    paddingBottom: THEME.spacing[24],
    flexGrow: 1,
  },
  listHeader: {
    marginBottom: THEME.spacing[12],
  },
  metaRow: {
    marginTop: THEME.spacing[8],
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: THEME.spacing[12],
  },
  metaText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium as '500',
    color: THEME.colors.textSecondary,
  },
  separator: {
    height: LIST_SEPARATOR_HEIGHT,
  },
});
