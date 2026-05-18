import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, ListRenderItem, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { THEME } from '@/constants/theme';
import { ROUTES } from '@/navigation/routeNames';
import type { ServicesStackParamList } from '@/navigation/types';
import {
  EmptyState,
  FilterChipsBar,
  FilterSheet,
  type FilterSection,
  type FilterSheetValue,
  RecommendedServiceCard,
  type RecommendedServiceItem,
  SafeAreaWrapper,
  ScreenHeader,
  ScreenWrapper,
} from '@/shared/components';

import { useGetPublicServicesQuery } from '@/features/Services/api/servicesApi';
import { mapPublicServiceToCardItem } from '@/features/Services/utils/serviceMappers';

const LIST_SEPARATOR_HEIGHT = THEME.spacing[12];

export function ServicesListingScreen(): React.ReactElement {
  const navigation = useNavigation<NativeStackNavigationProp<ServicesStackParamList>>();
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  const { data, isLoading } = useGetPublicServicesQuery({ limit: 50 });

  const serviceItems = useMemo((): RecommendedServiceItem[] => {
    if (data == null || data.items.length === 0) {
      return [];
    }
    return data.items.map(mapPublicServiceToCardItem);
  }, [data]);

  const filterSections = useMemo<FilterSection[]>(
    () => [
      {
        id: 'category',
        title: 'Category',
        options: [
          { id: 'incorporation', label: 'Business incorporation' },
          { id: 'tax', label: 'Tax & compliance' },
          { id: 'ip', label: 'IP & legal' },
        ],
      },
      {
        id: 'timeline',
        title: 'Timeline',
        options: [
          { id: 'expert', label: 'Expert-led' },
          { id: '2-4w', label: '2–4 weeks' },
          { id: 'mca', label: 'MCA ready' },
        ],
      },
      {
        id: 'price',
        title: 'Price',
        options: [
          { id: 'under-2k', label: 'Under ₹2,000' },
          { id: '2k-7k', label: '₹2,000–₹7,000' },
          { id: '7k-plus', label: '₹7,000+' },
        ],
      },
    ],
    [],
  );

  const [filters, setFilters] = useState<FilterSheetValue>(() => ({
    selected: {
      category: null,
      timeline: null,
      price: null,
    },
  }));

  const goToDetail = useCallback(
    (slug: string): void => {
      navigation.navigate(ROUTES.Services.Detail, { slug });
    },
    [navigation],
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

  return (
    <SafeAreaWrapper edges={['top', 'bottom']}>
      <ScreenHeader title="Services" onSearchPress={() => {}} />
      <ScreenWrapper>
        {isLoading && serviceItems.length === 0 ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={THEME.colors.primary} />
          </View>
        ) : null}
        <FlatList
          data={serviceItems}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={ItemSeparator}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <FilterChipsBar
                onSortPress={() => {
                  console.log('Sort pressed');
                }}
                onFilterPress={() => setIsFilterOpen(true)}
                chips={[
                  { id: 'deals', label: 'Early Bird Deals', leftIconName: 'pricetag-outline' },
                  { id: 'popular', label: 'Popular' },
                  { id: 'verified', label: 'Verified' },
                ]}
              />
            </View>
          }
          ListEmptyComponent={
            !isLoading ? (
              <EmptyState title="No services yet" description="Try adjusting filters or check back later." />
            ) : null
          }
        />

        <FilterSheet
          visible={isFilterOpen}
          title="Filters"
          sections={filterSections}
          value={filters}
          onChange={setFilters}
          onClose={() => setIsFilterOpen(false)}
          onApply={() => console.log('Apply filters', filters.selected)}
          onClear={() => console.log('Clear filters')}
        />
      </ScreenWrapper>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  loadingWrap: {
    paddingVertical: THEME.spacing[24],
    alignItems: 'center',
  },
  content: {
    padding: THEME.spacing[16],
    paddingBottom: THEME.spacing[24],
    flexGrow: 1,
  },
  listHeader: {
    marginBottom: THEME.spacing[12],
  },
  separator: {
    height: LIST_SEPARATOR_HEIGHT,
  },
});
