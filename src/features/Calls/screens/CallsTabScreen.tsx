import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  RefreshControl,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import RNDatePicker from 'react-native-date-picker';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  ACCOUNT_HUB_GREEN_HEADER_GRADIENT,
  ACCOUNT_HUB_GREEN_HEADER_STATUS_BAR,
  ACCOUNT_HUB_LIST_CANVAS,
} from '@/constants/accountScreenTheme';
import { THEME } from '@/constants/theme';
import { useGetCallHistoryQuery } from '@/features/Calls/api/callsApi';
import { CallsHistoryRow } from '@/features/Calls/components/CallsHistoryRow';
import { CALLS_TAB_THEME } from '@/features/Calls/constants/callsTabTheme';
import { CallController } from '@/features/Calls/controllers/CallController';
import type { CallHistoryItem } from '@/features/Calls/types/callApi.types';
import {
  buildCallsFilterChipItems,
  buildCallsFilterSections,
  CALLS_DATE_PICK_OPTION_ID,
  CALLS_FILTER_KEYS,
  countActiveCallsFilters,
  EMPTY_CALLS_FILTERS,
  encodeCallsDayFilter,
  filterCallHistoryItems,
  getCallsDatePickerBounds,
  resolveCallsDateFilter,
  resolveCallsStatusFilter,
} from '@/features/Calls/utils/callsTabFilters';
import {
  buildCallsTabRows,
  groupCallsTabRowsByDate,
  toCallsTabSectionListSections,
  type CallsTabRowModel,
  type CallsTabSectionListSection,
} from '@/features/Calls/utils/callsTabHistoryDisplay';
import {
  AccountHubScreenShell,
  AnimatedHeaderSearchBar,
  FilterChipsBar,
  FilterSheet,
  type FilterSheetValue,
} from '@/shared/components';
import { showGlobalToast } from '@/shared/components/toast';
import { useAppSelector } from '@/store/typedHooks';

import { styles } from './CallsTabScreen.styles';

const CALL_HISTORY_PAGE_SIZE = 50;

export function CallsTabScreen(): React.ReactElement {
  const tabBarHeight = useBottomTabBarHeight();
  const currentUserId = useAppSelector((state) => {
    const parsed = Number(state.auth.user?.id ?? '');
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  });
  const searchInputRef = useRef<TextInput>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [datePickerDraft, setDatePickerDraft] = useState<Date>(() => new Date());
  const [filters, setFilters] = useState<FilterSheetValue>(EMPTY_CALLS_FILTERS);
  const [startingRowKey, setStartingRowKey] = useState<string | null>(null);

  const datePickerBounds = useMemo(() => getCallsDatePickerBounds(), []);
  const filterSections = useMemo(() => buildCallsFilterSections(), []);

  const { data, isLoading, isFetching, isError, refetch } = useGetCallHistoryQuery({
    page: 1,
    limit: CALL_HISTORY_PAGE_SIZE,
  });

  const allItems = useMemo((): CallHistoryItem[] => data?.data ?? [], [data?.data]);

  const filteredItems = useMemo((): CallHistoryItem[] => {
    return filterCallHistoryItems(allItems, {
      searchQuery,
      status: resolveCallsStatusFilter(filters),
      dateFilter: resolveCallsDateFilter(filters),
    });
  }, [allItems, filters, searchQuery]);

  const rows = useMemo(
    (): CallsTabRowModel[] => buildCallsTabRows(filteredItems, currentUserId),
    [currentUserId, filteredItems],
  );

  const sections = useMemo(
    (): CallsTabSectionListSection[] =>
      toCallsTabSectionListSections(groupCallsTabRowsByDate(rows)),
    [rows],
  );

  const activeFilterCount = useMemo(() => countActiveCallsFilters(filters), [filters]);
  const hasSearchQuery = searchQuery.trim().length > 0;
  const hasActiveCriteria = activeFilterCount > 0 || hasSearchQuery;
  const isEmpty = sections.length === 0;

  const chipItems = useMemo(
    () =>
      buildCallsFilterChipItems(
        filters,
        () =>
          setFilters((prev) => ({
            selected: { ...prev.selected, [CALLS_FILTER_KEYS.status]: null },
          })),
        () =>
          setFilters((prev) => ({
            selected: { ...prev.selected, [CALLS_FILTER_KEYS.date]: null },
          })),
      ),
    [filters],
  );

  useEffect(() => {
    if (filters.selected[CALLS_FILTER_KEYS.date] !== CALLS_DATE_PICK_OPTION_ID) {
      return;
    }
    setIsFilterOpen(false);
    setDatePickerDraft(datePickerBounds.maximumDate);
    setIsDatePickerOpen(true);
  }, [datePickerBounds.maximumDate, filters.selected]);

  const handleFilterChange = useCallback((next: FilterSheetValue): void => {
    setFilters(next);
  }, []);

  const handleDatePickerConfirm = useCallback((date: Date): void => {
    setIsDatePickerOpen(false);
    setFilters((prev) => ({
      selected: {
        ...prev.selected,
        [CALLS_FILTER_KEYS.date]: encodeCallsDayFilter(date),
      },
    }));
  }, []);

  const handleDatePickerCancel = useCallback((): void => {
    setIsDatePickerOpen(false);
    setFilters((prev) => {
      if (prev.selected[CALLS_FILTER_KEYS.date] !== CALLS_DATE_PICK_OPTION_ID) {
        return prev;
      }
      return {
        selected: {
          ...prev.selected,
          [CALLS_FILTER_KEYS.date]: null,
        },
      };
    });
  }, []);

  const openSearch = useCallback((): void => {
    setIsSearchOpen(true);
  }, []);

  const closeSearch = useCallback((): void => {
    setIsSearchOpen(false);
    setSearchQuery('');
  }, []);

  const handleCallBack = useCallback(async (row: CallsTabRowModel): Promise<void> => {
    if (startingRowKey != null) {
      return;
    }
    if (!row.canCallBack) {
      showGlobalToast({ message: 'You cannot call yourself', variant: 'error' });
      return;
    }
    if (!Number.isFinite(row.otherUserId) || row.otherUserId <= 0) {
      showGlobalToast({ message: 'Unable to start call', variant: 'error' });
      return;
    }

    setStartingRowKey(row.key);
    const error = await CallController.startOutgoingWithType(
      row.otherUserId,
      row.item.callType,
      row.displayName,
    );
    setStartingRowKey(null);
    if (error != null) {
      showGlobalToast({ message: error, variant: 'error' });
    }
  }, [startingRowKey]);

  const listBottomPad = tabBarHeight + THEME.spacing[16];

  const renderItem = useCallback(
    ({ item }: { item: { key: string; rows: CallsTabRowModel[] } }): React.ReactElement => (
      <View style={styles.sectionCard}>
        {item.rows.map((row, index) => (
          <CallsHistoryRow
            key={row.key}
            row={row}
            isLast={index === item.rows.length - 1}
            isStarting={startingRowKey === row.key}
            onPressAction={() => {
              void handleCallBack(row);
            }}
          />
        ))}
      </View>
    ),
    [handleCallBack, startingRowKey],
  );

  const keyExtractor = useCallback(
    (item: { key: string; rows: CallsTabRowModel[] }): string => item.key,
    [],
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: CallsTabSectionListSection }): React.ReactElement => {
      const isFirst = sections[0]?.title === section.title;
      return (
        <Text style={[styles.sectionTitle, isFirst ? styles.sectionTitleFirst : null]}>
          {section.title}
        </Text>
      );
    },
    [sections],
  );

  const renderSectionFooter = useCallback((): React.ReactElement => {
    return <View style={styles.sectionGap} />;
  }, []);

  const ListHeader = useCallback((): React.ReactElement => {
    return (
      <View style={styles.listHeader}>
        <FilterChipsBar onFilterPress={() => setIsFilterOpen(true)} chips={chipItems} />
        {activeFilterCount > 0 || isFetching ? (
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
        ) : null}
      </View>
    );
  }, [activeFilterCount, chipItems, isFetching, isLoading]);

  const emptyTitle = hasActiveCriteria ? 'No matching calls' : 'No calls yet';
  const emptyBody = hasActiveCriteria
    ? 'Try a different name, clear filters, or pick another date.'
    : 'Your recent voice and video calls with consultants will appear here.';

  return (
    <>
      <AccountHubScreenShell
        title="Calls"
        edges={[]}
        canvasColor={ACCOUNT_HUB_LIST_CANVAS}
        headerColor={ACCOUNT_HUB_GREEN_HEADER_STATUS_BAR}
        headerGradientColors={ACCOUNT_HUB_GREEN_HEADER_GRADIENT}
        onSearchPress={isSearchOpen ? undefined : openSearch}
        headerRightAction={
          isSearchOpen ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close search"
              onPress={closeSearch}
              hitSlop={8}
              style={headerStyles.headerIconBtn}
            >
              <Ionicons name="close" size={22} color="#FFFFFF" />
            </Pressable>
          ) : undefined
        }
        headerAccessory={
          <AnimatedHeaderSearchBar
            visible={isSearchOpen}
            value={searchQuery}
            onChangeText={setSearchQuery}
            inputRef={searchInputRef}
            placeholder="Search by name…"
            accessibilityLabel="Search calls"
            embeddedInHeader
          />
        }
      >
        <View style={styles.screen}>
          {isLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={THEME.colors.primary} />
              <Text style={styles.stateText}>Loading calls…</Text>
            </View>
          ) : isError ? (
            <View style={styles.centered}>
              <Text style={styles.errorText}>Unable to load calls. Pull down to retry.</Text>
              <Pressable style={styles.retryBtn} onPress={() => void refetch()}>
                <Text style={styles.retryText}>Retry</Text>
              </Pressable>
            </View>
          ) : (
            <SectionList
              sections={sections}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              renderSectionHeader={renderSectionHeader}
              renderSectionFooter={renderSectionFooter}
              style={styles.list}
              contentContainerStyle={[
                styles.listContent,
                isEmpty ? styles.listContentEmpty : null,
                { paddingBottom: listBottomPad },
              ]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="always"
              stickySectionHeadersEnabled={false}
              ListHeaderComponent={ListHeader}
              refreshControl={
                <RefreshControl
                  refreshing={isFetching && !isLoading}
                  onRefresh={() => void refetch()}
                  tintColor={THEME.colors.primary}
                />
              }
              ListEmptyComponent={
                <View style={styles.empty}>
                  <View style={styles.emptyIcon}>
                    <Ionicons name="call-outline" size={28} color={CALLS_TAB_THEME.textSecondary} />
                  </View>
                  <Text style={styles.emptyTitle}>{emptyTitle}</Text>
                  <Text style={styles.emptyBody}>{emptyBody}</Text>
                </View>
              }
            />
          )}
        </View>
      </AccountHubScreenShell>

      <FilterSheet
        visible={isFilterOpen}
        title="Filters"
        sections={filterSections}
        value={filters}
        onChange={handleFilterChange}
        onClose={() => setIsFilterOpen(false)}
        onApply={() => setIsFilterOpen(false)}
        onClear={() => setFilters(EMPTY_CALLS_FILTERS)}
      />

      <RNDatePicker
        modal
        open={isDatePickerOpen}
        date={datePickerDraft}
        mode="date"
        minimumDate={datePickerBounds.minimumDate}
        maximumDate={datePickerBounds.maximumDate}
        locale="en-IN"
        title="Filter by date"
        confirmText="Apply"
        cancelText="Cancel"
        theme={Platform.OS === 'ios' ? 'light' : 'auto'}
        onConfirm={handleDatePickerConfirm}
        onCancel={handleDatePickerCancel}
      />
    </>
  );
}

const headerStyles = StyleSheet.create({
  headerIconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
