import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useGetCallHistoryQuery } from '@/features/Calls/api/callsApi';
import type { CallHistoryItem, CallStatus } from '@/features/Calls/types/callApi.types';
import { ROUTES } from '@/navigation/routeNames';
import type { AccountStackParamList } from '@/navigation/types';
import { SafeAreaWrapper, ScreenHeader } from '@/shared/components';
import { THEME } from '@/constants/theme';

import { CALL_HISTORY_CANVAS, styles } from './CallHistoryScreen.styles';
import {
  mapCallHistoryItem,
  type CallHistoryCardModel,
  type CallCardTone,
} from '../../utils/callHistoryDisplay';

type Nav = NativeStackNavigationProp<AccountStackParamList, typeof ROUTES.Account.userCallHis>;

type StatusFilter = 'all' | 'completed' | 'missed';

const CALL_HISTORY_PAGE_SIZE = 50;

const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'completed', label: 'Completed' },
  { id: 'missed', label: 'Missed' },
];

const COMPLETED_STATUSES: CallStatus[] = ['ended', 'connected'];
const MISSED_STATUSES: CallStatus[] = ['declined', 'missed', 'failed'];

interface StatusVisual {
  bg: string;
  border: string;
  text: string;
  iconBg: string;
  iconColor: string;
}

function getStatusVisual(tone: CallCardTone): StatusVisual {
  if (tone === 'declined') {
    return {
      bg: 'rgba(245,158,11,0.12)',
      border: 'rgba(245,158,11,0.28)',
      text: '#B45309',
      iconBg: 'rgba(245,158,11,0.12)',
      iconColor: '#D97706',
    };
  }
  return {
    bg: 'rgba(5,150,105,0.10)',
    border: 'rgba(5,150,105,0.22)',
    text: '#047857',
    iconBg: 'rgba(5,150,105,0.10)',
    iconColor: THEME.colors.primary,
  };
}

function matchesStatusFilter(item: CallHistoryItem, filter: StatusFilter): boolean {
  if (filter === 'all') {
    return true;
  }
  if (filter === 'completed') {
    return COMPLETED_STATUSES.includes(item.status);
  }
  return MISSED_STATUSES.includes(item.status);
}

function CallDirectionIcon(props: {
  direction: CallHistoryItem['direction'];
  callType: CallHistoryItem['callType'];
  color: string;
}): React.ReactElement {
  const name =
    props.callType === 'video'
      ? 'videocam-outline'
      : props.direction === 'outgoing'
        ? 'arrow-up-outline'
        : 'arrow-down-outline';

  return <Ionicons name={name} size={18} color={props.color} />;
}

interface CallCardProps {
  item: CallHistoryCardModel;
  raw: CallHistoryItem;
  onRate: () => void;
}

const CallCard = memo(function CallCard(props: CallCardProps): React.ReactElement {
  const { item, raw, onRate } = props;
  const visual = getStatusVisual(item.tone);

  return (
    <View style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: visual.iconBg }]}>
        <CallDirectionIcon
          direction={raw.direction}
          callType={raw.callType}
          color={visual.iconColor}
        />
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {item.type}
          </Text>
        </View>
        <Text style={styles.meta} numberOfLines={1}>
          {item.time} · {item.duration}
        </Text>
        <Text style={styles.consultant} numberOfLines={1}>
          {item.consultant}
        </Text>
        {item.canReview ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Rate consultant"
            onPress={onRate}
            style={({ pressed }) => [styles.rateBtn, pressed ? { opacity: 0.88 } : null]}
          >
            <Ionicons name="star-outline" size={12} color="#B45309" />
            <Text style={styles.rateText}>Rate</Text>
          </Pressable>
        ) : null}
        {raw.reviewedByMe === true ? (
          <Text style={styles.reviewedText}>Review submitted</Text>
        ) : null}
      </View>

      <View style={styles.trailing}>
        <View
          style={[
            styles.statusPill,
            { backgroundColor: visual.bg, borderColor: visual.border },
          ]}
        >
          <Text style={[styles.statusText, { color: visual.text }]}>{item.statusLabel}</Text>
        </View>
        <Text style={styles.sessionId}>{item.displayId}</Text>
      </View>
    </View>
  );
});

function FilterBar(props: {
  active: StatusFilter;
  onChange: (filter: StatusFilter) => void;
}): React.ReactElement {
  return (
    <View style={styles.filterRow}>
      {STATUS_FILTERS.map((chip) => {
        const isActive = props.active === chip.id;
        return (
          <Pressable
            key={chip.id}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            onPress={() => props.onChange(chip.id)}
            style={[styles.filterChip, isActive ? styles.filterChipActive : null]}
          >
            <Text style={[styles.filterChipText, isActive ? styles.filterChipTextActive : null]}>
              {chip.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function CallHistoryScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const { data, isLoading, isFetching, isError, refetch } = useGetCallHistoryQuery({
    page: 1,
    limit: CALL_HISTORY_PAGE_SIZE,
  });

  const rows = useMemo((): { raw: CallHistoryItem; card: CallHistoryCardModel }[] => {
    const list = data?.data ?? [];
    return list
      .filter((item) => matchesStatusFilter(item, statusFilter))
      .map((raw) => ({ raw, card: mapCallHistoryItem(raw) }));
  }, [data?.data, statusFilter]);

  const totalLoaded = data?.data.length ?? 0;

  const handleRate = useCallback((): void => {
    navigation.navigate(ROUTES.Account.addReview);
  }, [navigation]);

  const listHeader = useMemo((): React.ReactElement => {
    return (
      <>
        <FilterBar active={statusFilter} onChange={setStatusFilter} />
        {totalLoaded > 0 ? (
          <Text style={styles.resultMeta}>
            {rows.length} call{rows.length === 1 ? '' : 's'}
            {statusFilter !== 'all' ? ` · ${STATUS_FILTERS.find((f) => f.id === statusFilter)?.label}` : ''}
          </Text>
        ) : null}
      </>
    );
  }, [rows.length, statusFilter, totalLoaded]);

  return (
    <SafeAreaWrapper edges={['top']} bgColor={CALL_HISTORY_CANVAS} contentBgColor={CALL_HISTORY_CANVAS}>
      <ScreenHeader title="Call History" onBackPress={() => navigation.goBack()} />

      {isLoading ? (
        <View style={styles.centeredState}>
          <ActivityIndicator size="large" color={THEME.colors.primary} />
          <Text style={styles.stateText}>Loading calls…</Text>
        </View>
      ) : isError ? (
        <View style={styles.centeredState}>
          <Text style={styles.errorText}>Unable to load calls. Pull down to retry.</Text>
          <Pressable style={styles.retryBtn} onPress={() => void refetch()}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          style={styles.screen}
          data={rows}
          keyExtractor={(item) => String(item.raw.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            rows.length === 0 ? [styles.listContent, { flexGrow: 1 }] : styles.listContent
          }
          ListHeaderComponent={listHeader}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !isLoading}
              onRefresh={() => void refetch()}
              tintColor={THEME.colors.primary}
            />
          }
          renderItem={({ item }) => (
            <CallCard item={item.card} raw={item.raw} onRate={handleRate} />
          )}
          ListEmptyComponent={
            <View style={styles.centeredState}>
              <View style={styles.emptyIcon}>
                <Ionicons name="call-outline" size={24} color={THEME.colors.primary} />
              </View>
              <Text style={styles.stateText}>
                {statusFilter === 'all'
                  ? 'No calls yet.'
                  : `No ${statusFilter} calls found.`}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaWrapper>
  );
}

export default CallHistoryScreen;
