import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { THEME } from '@/constants/theme';
import type { RootStackParamList } from '@/navigation/types';
import {
  DEMO_WORKSHOPS,
  filterWorkshopsBySession,
  matchesWorkshopSearch,
  type WorkshopSessionFilter,
} from '@/features/Home/data/demoWorkshops';
import {
  EmptyState,
  EventSpotlightCard,
  type EventSpotlightItem,
  SafeAreaWrapper,
  ScreenHeader,
  ScreenWrapper,
} from '@/shared/components';

const LIST_GAP = THEME.spacing[10];
const H_PADDING = THEME.spacing[16];

const SESSION_FILTERS: { id: WorkshopSessionFilter; label: string }[] = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'past', label: 'Past sessions' },
];

export function WorkshopListScreen(): React.ReactElement {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sessionFilter, setSessionFilter] = useState<WorkshopSessionFilter>('upcoming');

  const cardWidth = useMemo((): number => {
    const inner = width - H_PADDING * 2 - LIST_GAP;
    return Math.max(140, Math.floor(inner / 2));
  }, [width]);

  const filteredItems = useMemo((): EventSpotlightItem[] => {
    const bySession = filterWorkshopsBySession(DEMO_WORKSHOPS, sessionFilter);
    return bySession.filter((item) => matchesWorkshopSearch(item, searchQuery));
  }, [searchQuery, sessionFilter]);

  const keyExtractor = useCallback((item: EventSpotlightItem): string => String(item.id), []);

  const renderItem = useCallback<ListRenderItem<EventSpotlightItem>>(
    ({ item }) => (
      <View style={styles.cardCell}>
        <EventSpotlightCard
          item={item}
          cardWidth={cardWidth}
          variant="compact"
          onPress={() => console.log('Workshop detail', item.id, item.slug)}
        />
      </View>
    ),
    [cardWidth],
  );

  const ListHeader = useCallback(
    (): React.ReactElement => (
      <View style={styles.sessionRow}>
        {SESSION_FILTERS.map((filter) => {
          const selected = sessionFilter === filter.id;
          return (
            <Pressable
              key={filter.id}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={filter.label}
              onPress={() => setSessionFilter(filter.id)}
              style={({ pressed }) => [
                styles.sessionChip,
                selected ? styles.sessionChipSelected : null,
                pressed ? styles.sessionChipPressed : null,
              ]}
            >
              <Text style={[styles.sessionChipText, selected ? styles.sessionChipTextSelected : null]}>
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    ),
    [sessionFilter],
  );

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
          data={filteredItems}
          keyExtractor={keyExtractor}
          numColumns={2}
          renderItem={renderItem}
          ListHeaderComponent={ListHeader}
          columnWrapperStyle={styles.columnWrap}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <EmptyState
              title={sessionFilter === 'upcoming' ? 'No upcoming workshops' : 'No past sessions'}
              description="Try another filter or adjust your search."
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
});
