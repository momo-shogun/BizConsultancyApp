import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useGetCallHistoryQuery } from '@/features/Calls/api/callsApi';
import { CallsHistoryHeader } from '@/features/Calls/components/CallsHistoryHeader';
import { CallsHistoryRow } from '@/features/Calls/components/CallsHistoryRow';
import { CALLS_TAB_THEME } from '@/features/Calls/constants/callsTabTheme';
import { CallController } from '@/features/Calls/controllers/CallController';
import type { CallHistoryItem } from '@/features/Calls/types/callApi.types';
import {
  buildCallsTabRows,
  type CallsTabFilter,
  type CallsTabRowModel,
} from '@/features/Calls/utils/callsTabHistoryDisplay';
import { Dialog } from '@/shared/components/dialog';
import { SafeAreaWrapper } from '@/shared/components';
import { showGlobalToast } from '@/shared/components/toast';

import { styles } from './CallsTabScreen.styles';

const CALL_HISTORY_PAGE_SIZE = 50;
const TAB_BAR_CONTENT_INSET = 96;

export function CallsTabScreen(): React.ReactElement {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<CallsTabFilter>('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { data, isLoading, isFetching, isError, refetch } = useGetCallHistoryQuery({
    page: 1,
    limit: CALL_HISTORY_PAGE_SIZE,
  });

  const allItems = useMemo((): CallHistoryItem[] => data?.data ?? [], [data?.data]);
  const rows = useMemo((): CallsTabRowModel[] => buildCallsTabRows(allItems, filter), [allItems, filter]);

  const handleToggleEdit = useCallback((): void => {
    setIsEditing((prev) => {
      if (prev) {
        setSelectedIds([]);
      }
      return !prev;
    });
  }, []);

  const handlePressRow = useCallback(
    (row: CallsTabRowModel): void => {
      if (!isEditing) {
        return;
      }
      setSelectedIds((prev) => {
        if (prev.includes(row.item.id)) {
          return prev.filter((id) => id !== row.item.id);
        }
        return [...prev, row.item.id];
      });
    },
    [isEditing],
  );

  const handleCallBack = useCallback(async (row: CallsTabRowModel): Promise<void> => {
    if (!Number.isFinite(row.otherUserId) || row.otherUserId <= 0) {
      showGlobalToast({ message: 'Unable to start call', variant: 'error' });
      return;
    }

    const error = await CallController.startOutgoingWithType(
      row.otherUserId,
      row.item.callType,
      row.displayName,
    );
    if (error != null) {
      showGlobalToast({ message: error, variant: 'error' });
    }
  }, []);

  const listBottomPad = TAB_BAR_CONTENT_INSET + Math.max(insets.bottom, 8);

  const renderItem = useCallback(
    ({ item, index }: { item: CallsTabRowModel; index: number }): React.ReactElement => (
      <CallsHistoryRow
        row={item}
        isLast={index === rows.length - 1}
        isEditing={isEditing}
        isSelected={selectedIds.includes(item.item.id)}
        onPressRow={() => handlePressRow(item)}
        onPressAction={() => {
          void handleCallBack(item);
        }}
      />
    ),
    [handleCallBack, handlePressRow, isEditing, rows.length, selectedIds],
  );

  const keyExtractor = useCallback((item: CallsTabRowModel): string => item.key, []);

  return (
    <SafeAreaWrapper
      bgColor={CALLS_TAB_THEME.bg}
      contentBgColor={CALLS_TAB_THEME.bg}
      statusBarStyle="light-content"
      edges={['top', 'left', 'right']}
    >
      <View style={styles.screen}>
        <CallsHistoryHeader
          isEditing={isEditing}
          onToggleEdit={handleToggleEdit}
          onPressFilter={() => setFilterOpen(true)}
        />

        {filter === 'missed' ? (
          <View style={styles.filterChipRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear missed filter"
              onPress={() => setFilter('all')}
              style={styles.filterChip}
            >
              <Text style={styles.filterChipText}>Missed</Text>
              <Ionicons name="close" size={14} color={CALLS_TAB_THEME.accent} />
            </Pressable>
          </View>
        ) : null}

        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={CALLS_TAB_THEME.accent} />
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
          <FlatList
            data={rows}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            style={styles.list}
            contentContainerStyle={[
              styles.listContent,
              rows.length === 0 ? styles.listContentEmpty : null,
              { paddingBottom: listBottomPad },
            ]}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isFetching && !isLoading}
                onRefresh={() => void refetch()}
                tintColor={CALLS_TAB_THEME.accent}
              />
            }
            ListEmptyComponent={
              <View style={styles.empty}>
                <View style={styles.emptyIcon}>
                  <Ionicons name="call-outline" size={26} color={CALLS_TAB_THEME.textSecondary} />
                </View>
                <Text style={styles.emptyTitle}>
                  {filter === 'missed' ? 'No missed calls' : 'No calls yet'}
                </Text>
                <Text style={styles.emptyBody}>
                  {filter === 'missed'
                    ? 'Missed calls will show up here.'
                    : 'Your recent voice and video calls will appear here.'}
                </Text>
              </View>
            }
          />
        )}
      </View>

      <Dialog
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
        title="Filter"
        description="Choose which calls to show."
        actions={[
          {
            label: filter === 'all' ? 'All ✓' : 'All',
            onPress: () => {
              setFilter('all');
              setFilterOpen(false);
            },
            variant: filter === 'all' ? 'default' : 'outline',
          },
          {
            label: filter === 'missed' ? 'Missed ✓' : 'Missed',
            onPress: () => {
              setFilter('missed');
              setFilterOpen(false);
            },
            variant: filter === 'missed' ? 'default' : 'outline',
          },
          {
            label: 'Cancel',
            onPress: () => setFilterOpen(false),
            variant: 'ghost',
          },
        ]}
      />
    </SafeAreaWrapper>
  );
}
