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
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { THEME } from '@/constants/theme';
import type { RootStackParamList } from '@/navigation/types';
import {
  getWorkshopSessionFilterLabel,
  useWorkshopListScreen,
} from '@/features/Home/hooks/useWorkshopListScreen';
import {
  filterWorkshopsBySession,
  matchesWorkshopSearch,
  type WorkshopSessionFilter,
} from '@/features/Home/utils/workshopFilters';
import {
  EmptyState,
  EventSpotlightCard,
  type EventSpotlightItem,
  SafeAreaWrapper,
  ScreenHeader,
  ScreenWrapper,
} from '@/shared/components';
import { ROUTES } from '@/navigation/routeNames';

const LIST_GAP = THEME.spacing[10];
const H_PADDING = THEME.spacing[16];

const SESSION_FILTERS: { id: WorkshopSessionFilter; label: string }[] = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'past', label: 'Past sessions' },
];

type WorkshopGridCell =
  | { kind: 'workshop'; item: EventSpotlightItem }
  | { kind: 'spacer'; id: string };

function buildWorkshopGridCells(items: EventSpotlightItem[]): WorkshopGridCell[] {
  const cells: WorkshopGridCell[] = items.map((item) => ({
    kind: 'workshop',
    item,
  }));

  if (cells.length % 2 !== 0) {
    cells.push({ kind: 'spacer', id: 'workshop-grid-spacer' });
  }

  return cells;
}

export function WorkshopListScreen(): React.ReactElement {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sessionFilter, setSessionFilter] = useState<WorkshopSessionFilter>('upcoming');

  const {
    allWorkshopItems,
    upcomingCount,
    pastCount,
    isLoading,
    isLoadingMore,
    isError,
    hasMore,
    loadMore,
  } = useWorkshopListScreen();

  const isFullyLoaded = !hasMore && !isLoading && !isLoadingMore;

  useEffect(() => {
    if (!hasMore || isLoading || isLoadingMore || isError) {
      return;
    }
    loadMore();
  }, [hasMore, isError, isLoading, isLoadingMore, loadMore, sessionFilter]);

  const filteredItems = useMemo((): EventSpotlightItem[] => {
    const bySession = filterWorkshopsBySession(allWorkshopItems, sessionFilter);
    return bySession.filter((item) => matchesWorkshopSearch(item, searchQuery));
  }, [allWorkshopItems, searchQuery, sessionFilter]);

  const gridCells = useMemo(
    (): WorkshopGridCell[] => buildWorkshopGridCells(filteredItems),
    [filteredItems],
  );

  const keyExtractor = useCallback((cell: WorkshopGridCell): string => {
    return cell.kind === 'workshop' ? String(cell.item.id) : cell.id;
  }, []);

  const renderItem = useCallback<ListRenderItem<WorkshopGridCell>>(
    ({ item: cell }) => {
      if (cell.kind === 'spacer') {
        return <View style={styles.cardCell} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" />;
      }

      return (
        <View style={styles.cardCell}>
          <EventSpotlightCard
            item={cell.item}
            variant="compact"
            onPress={() =>
              navigation.navigate(ROUTES.Root.WorkshopsDetail, { slug: cell.item.slug })
            }
          />
        </View>
      );
    },
    [navigation],
  );

  const sessionCounts = useMemo(
    (): Record<WorkshopSessionFilter, number> => ({
      upcoming: upcomingCount,
      past: pastCount,
    }),
    [pastCount, upcomingCount],
  );

  const ListHeader = useCallback(
    (): React.ReactElement => (
      <View style={styles.sessionRow}>
        {SESSION_FILTERS.map((filter) => {
          const selected = sessionFilter === filter.id;
          const label = getWorkshopSessionFilterLabel(
            filter.id,
            sessionCounts[filter.id],
            isFullyLoaded,
          );
          return (
            <Pressable
              key={filter.id}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={label}
              onPress={() => setSessionFilter(filter.id)}
              style={({ pressed }) => [
                styles.sessionChip,
                selected ? styles.sessionChipSelected : null,
                pressed ? styles.sessionChipPressed : null,
              ]}
            >
              <Text style={[styles.sessionChipText, selected ? styles.sessionChipTextSelected : null]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    ),
    [isFullyLoaded, sessionCounts, sessionFilter],
  );

  const ListFooter = useCallback((): React.ReactElement | null => {
    if (!isLoadingMore) {
      return null;
    }
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator color={THEME.colors.primary} size="small" />
        <Text style={styles.footerLoaderText}>Loading more workshops…</Text>
      </View>
    );
  }, [isLoadingMore]);

  const handleEndReached = useCallback((): void => {
    loadMore();
  }, [loadMore]);

  return (
    <SafeAreaWrapper edges={['top', 'bottom']}>
      <ScreenHeader
        title="Workshops"
        onBackPress={() => navigation.goBack()}
        onSearchPress={() => setIsSearchOpen((open) => !open)}
      />

      {isSearchOpen ? (
        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={20} color={THEME.colors.textSecondary} />
          <TextInput
            accessibilityLabel="Search workshops"
            placeholder="Search workshops, topics, location…"
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
              color={searchQuery.length === 0 ? THEME.colors.border : THEME.colors.textSecondary}
            />
          </Pressable>
        </View>
      ) : null}

      <ScreenWrapper>
        <FlatList
          data={gridCells}
          keyExtractor={keyExtractor}
          numColumns={2}
          renderItem={renderItem}
          ListHeaderComponent={ListHeader}
          ListFooterComponent={ListFooter}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.35}
          columnWrapperStyle={styles.columnWrap}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <EmptyState
              title={
                isLoading
                  ? 'Loading workshops…'
                  : isError
                    ? 'Unable to load workshops'
                    : sessionFilter === 'upcoming'
                      ? 'No upcoming workshops'
                      : 'No past sessions'
              }
              description={
                isError
                  ? 'Check your connection and try again.'
                  : isLoadingMore
                    ? 'Fetching more workshops from the server…'
                    : 'Try another filter or adjust your search.'
              }
            />
          }
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
    paddingVertical: THEME.spacing[10],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: THEME.colors.border,
    backgroundColor: THEME.colors.background,
  },
  searchInput: {
    flex: 1,
    minHeight: 40,
    paddingVertical: THEME.spacing[8],
    fontSize: THEME.typography.size[14],
    color: THEME.colors.textPrimary,
  },
  listContent: {
    paddingHorizontal: H_PADDING,
    paddingTop: THEME.spacing[12],
    paddingBottom: THEME.spacing[24],
    flexGrow: 1,
  },
  sessionRow: {
    flexDirection: 'row',
    gap: THEME.spacing[10],
    marginBottom: THEME.spacing[14],
  },
  sessionChip: {
    flex: 1,
    paddingVertical: THEME.spacing[10],
    paddingHorizontal: THEME.spacing[12],
    borderRadius: 100,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.white,
    alignItems: 'center',
  },
  sessionChipSelected: {
    borderColor: THEME.colors.primary,
    backgroundColor: 'rgba(15,81,50,0.08)',
  },
  sessionChipPressed: {
    opacity: 0.88,
  },
  sessionChipText: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textSecondary,
    textAlign: 'center',
  },
  sessionChipTextSelected: {
    color: THEME.colors.primary,
    fontWeight: THEME.typography.weight.bold as '700',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing[8],
    paddingVertical: THEME.spacing[16],
  },
  footerLoaderText: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
  },
});
