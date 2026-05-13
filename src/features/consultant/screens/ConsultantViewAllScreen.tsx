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
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { THEME } from '@/constants/theme';
import { ROUTES } from '@/navigation/routeNames';
import type { RootStackParamList } from '@/navigation/types';
import {
  EmptyState,
  FilterChipsBar,
  FilterSheet,
  type FilterSection,
  type FilterSheetValue,
  SafeAreaWrapper,
  ScreenHeader,
  ScreenWrapper,
  TopConsultantCard,
  type TopConsultantItem,
} from '@/shared/components';

const LIST_GAP = THEME.spacing[10];
const H_PADDING = THEME.spacing[12];

const DEMO_CONSULTANTS: TopConsultantItem[] = [
  {
    id: '3',
    slug: 'r-k-saxena',
    name: 'R K Saxena',
    role: 'Project Manager',
    bio: 'Textile & apparel · business mentorship.',
    specialty: 'Agriculture',
    experienceLabel: '48+ years',
    rateLabel: '₹354',
    photoUri:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'consultant-lata-moorjani',
    name: 'CA Lata Moorjani',
    role: 'Business Analyst',
    bio: 'Compliance, GST & growth for SMEs.',
    specialty: 'Startup Nurturing & Funding',
    experienceLabel: '5+ years',
    rateLabel: '₹354',
    photoUri:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'consultant-aman-verma',
    name: 'Aman Verma',
    role: 'Funding & Pitch Advisor',
    bio: 'Seed rounds, decks & investor prep.',
    specialty: 'Funding & Pitch',
    experienceLabel: '8+ years',
    rateLabel: '₹499',
    photoUri:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'consultant-priya-nair',
    name: 'Priya Nair',
    role: 'Tax & Compliance Lead',
    bio: 'Direct tax, TP & MCA filings.',
    specialty: 'Tax & compliance',
    experienceLabel: '12+ years',
    rateLabel: '₹650',
    photoUri:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'consultant-rohit-khanna',
    name: 'Rohit Khanna',
    role: 'IP & Legal Counsel',
    bio: 'Trademarks, contracts & product legal.',
    specialty: 'IP & legal',
    experienceLabel: '9+ years',
    rateLabel: '₹720',
    photoUri:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'consultant-sneha-pillai',
    name: 'Sneha Pillai',
    role: 'Operations Consultant',
    bio: 'SOPs, vendors & cost control.',
    specialty: 'Business incorporation',
    experienceLabel: '6+ years',
    rateLabel: '₹420',
    photoUri:
      'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'consultant-vikram-seth',
    name: 'Vikram Seth',
    role: 'MCA & Secretarial',
    bio: 'Board papers, ROC & governance.',
    specialty: 'MCA ready',
    experienceLabel: '11+ years',
    rateLabel: '₹580',
    photoUri:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'consultant-ananya-roy',
    name: 'Ananya Roy',
    role: 'Growth Marketing Advisor',
    bio: 'GTM, funnels & retention.',
    specialty: 'Expert-led growth',
    experienceLabel: '4+ years',
    rateLabel: '₹1,850',
    photoUri:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'consultant-karan-mehra',
    name: 'Karan Mehra',
    role: 'Financial Modelling',
    bio: 'Models, scenarios & unit economics.',
    specialty: '₹7,000+ advisory',
    experienceLabel: '7+ years',
    rateLabel: '₹7,200',
    photoUri:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
  },
];

type SortMode = 'recommended' | 'name' | 'rate_low' | 'rate_high';

function parseExperienceYears(label: string): number {
  const m = label.match(/(\d+)\s*\+/);
  return m ? Number.parseInt(m[1], 10) : 0;
}

function parseRateRupee(label: string): number {
  const normalized = label.replace(/[₹,\s]/g, '');
  const m = normalized.match(/(\d+)/);
  return m ? Number.parseInt(m[1], 10) : 0;
}

function matchesCategoryFilter(item: TopConsultantItem, categoryId: string | null): boolean {
  if (categoryId == null) return true;
  const hay = `${item.specialty} ${item.role} ${item.bio}`.toLowerCase();
  if (categoryId === 'incorporation') {
    return hay.includes('incorporation') || hay.includes('startup') || hay.includes('mca');
  }
  if (categoryId === 'tax') {
    return hay.includes('tax') || hay.includes('compliance') || hay.includes('gst');
  }
  if (categoryId === 'ip') {
    return hay.includes('ip') || hay.includes('legal') || hay.includes('trademark');
  }
  return true;
}

function matchesTimelineFilter(item: TopConsultantItem, timelineId: string | null): boolean {
  if (timelineId == null) return true;
  const years = parseExperienceYears(item.experienceLabel);
  if (timelineId === 'expert') return years >= 8;
  if (timelineId === '2-4w') return years >= 4 && years <= 7;
  if (timelineId === 'mca') {
    return (
      item.specialty.toLowerCase().includes('mca') || item.role.toLowerCase().includes('secretarial')
    );
  }
  return true;
}

function matchesPriceFilter(item: TopConsultantItem, priceId: string | null): boolean {
  if (priceId == null) return true;
  const r = parseRateRupee(item.rateLabel);
  if (priceId === 'under-2k') return r < 2_000;
  if (priceId === '2k-7k') return r >= 2_000 && r <= 7_000;
  if (priceId === '7k-plus') return r > 7_000;
  return true;
}

function matchesSearch(item: TopConsultantItem, q: string): boolean {
  const s = q.trim().toLowerCase();
  if (s.length === 0) return true;
  return (
    item.name.toLowerCase().includes(s) ||
    item.role.toLowerCase().includes(s) ||
    item.specialty.toLowerCase().includes(s) ||
    item.bio.toLowerCase().includes(s)
  );
}

function matchesChips(
  item: TopConsultantItem,
  selected: ReadonlySet<string>,
): boolean {
  if (selected.size === 0) return true;
  let ok = true;
  if (selected.has('popular')) {
    ok = ok && parseExperienceYears(item.experienceLabel) >= 8;
  }
  if (selected.has('verified')) {
    ok = ok && item.id.length > 0;
  }
  if (selected.has('deals')) {
    ok = ok && parseRateRupee(item.rateLabel) < 2_000;
  }
  return ok;
}

export function ConsultantViewAllScreen(): React.ReactElement {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [sortMode, setSortMode] = useState<SortMode>('recommended');
  const [selectedChips, setSelectedChips] = useState<ReadonlySet<string>>(() => new Set());
  const [filters, setFilters] = useState<FilterSheetValue>(() => ({
    selected: {
      category: null,
      timeline: null,
      price: null,
    },
  }));

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({ headerShown: false });
    }, [navigation]),
  );

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

  const cardWidth = useMemo((): number => {
    const gutter = LIST_GAP + 14;
    const inner = width - H_PADDING * 2 - gutter;
    return Math.max(148, Math.floor(inner / 2));
  }, [width]);

  const filteredSorted = useMemo((): TopConsultantItem[] => {
    const { category, timeline, price } = filters.selected;
    let rows = DEMO_CONSULTANTS.filter((item) => matchesSearch(item, searchQuery));
    rows = rows.filter((item) => matchesCategoryFilter(item, category));
    rows = rows.filter((item) => matchesTimelineFilter(item, timeline));
    rows = rows.filter((item) => matchesPriceFilter(item, price));
    rows = rows.filter((item) => matchesChips(item, selectedChips));

    const next = [...rows];
    if (sortMode === 'name') {
      next.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortMode === 'rate_low') {
      next.sort((a, b) => parseRateRupee(a.rateLabel) - parseRateRupee(b.rateLabel));
    } else if (sortMode === 'rate_high') {
      next.sort((a, b) => parseRateRupee(b.rateLabel) - parseRateRupee(a.rateLabel));
    }
    return next;
  }, [filters.selected, searchQuery, selectedChips, sortMode]);

  const toggleChip = useCallback((id: string): void => {
    setSelectedChips((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
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

  const chipItems = useMemo(
    () => [
      {
        id: 'deals',
        label: 'Early Bird Deals',
        leftIconName: 'pricetag-outline' as const,
        isSelected: selectedChips.has('deals'),
        onPress: () => toggleChip('deals'),
      },
      {
        id: 'popular',
        label: 'Popular',
        isSelected: selectedChips.has('popular'),
        onPress: () => toggleChip('popular'),
      },
      {
        id: 'verified',
        label: 'Verified',
        isSelected: selectedChips.has('verified'),
        onPress: () => toggleChip('verified'),
      },
    ],
    [selectedChips, toggleChip],
  );

  const keyExtractor = useCallback((item: TopConsultantItem): string => item.id, []);

  const renderItem = useCallback<ListRenderItem<TopConsultantItem>>(
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
          onBookPress={() =>
            navigation.navigate(ROUTES.Root.ConsultantDetail, {
              slug: item.slug ?? item.id,
            })
          }
        />
      </View>
    ),
    [cardWidth, navigation],
  );

  const ListHeader = useCallback(
    (): React.ReactElement => (
      <View style={styles.listHeader}>
        <FilterChipsBar
          onSortPress={onSortPress}
          onFilterPress={() => setIsFilterOpen(true)}
          chips={chipItems}
        />
        <View style={styles.sortHint}>
          <Text style={styles.sortHintText}>Sort: {sortLabel}</Text>
        </View>
      </View>
    ),
    [chipItems, onSortPress, sortLabel],
  );

  return (
    <SafeAreaWrapper edges={['top', 'bottom']}>
      <ScreenHeader
        title="Consultants"
        onBackPress={() => navigation.goBack()}
        onSearchPress={() => setIsSearchOpen((v) => !v)}
      />

      {isSearchOpen ? (
        <View style={styles.searchRow}>
          <TextInput
            accessibilityLabel="Search consultants"
            placeholder="Name, role, specialty…"
            placeholderTextColor={THEME.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            returnKeyType="search"
            clearButtonMode="while-editing"
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
          data={filteredSorted}
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
              title="No consultants match"
              description="Try adjusting filters or search keywords."
            />
          }
        />

        <FilterSheet
          visible={isFilterOpen}
          title="Filters"
          sections={filterSections}
          value={filters}
          onChange={setFilters}
          onClose={() => setIsFilterOpen(false)}
          onApply={() => setIsFilterOpen(false)}
          onClear={() =>
            setFilters({
              selected: { category: null, timeline: null, price: null },
            })
          }
        />
      </ScreenWrapper>
    </SafeAreaWrapper>
  );
}

export default ConsultantViewAllScreen;

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
  },
  sortHintText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium as '500',
    color: THEME.colors.textSecondary,
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
