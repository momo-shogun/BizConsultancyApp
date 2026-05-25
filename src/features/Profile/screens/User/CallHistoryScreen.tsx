import React, { memo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useGetCallHistoryQuery } from '@/features/Calls/api/callsApi';
import { SafeAreaWrapper, ScreenHeader } from '@/shared/components';
import { THEME } from '@/constants/theme';

import { styles } from './CallHistoryScreen.styles';
import {
  mapCallHistoryItem,
  type CallHistoryCardModel,
  type CallCardTone,
} from '../../utils/callHistoryDisplay';

const STATUS_CONFIG: Record<
  CallCardTone,
  { accent: string; label: string }
> = {
  declined: {
    accent: '#A78BFA',
    label: 'declined',
  },
  ended: {
    accent: '#34D399',
    label: 'ended',
  },
};

const CARD_BACKGROUND: Record<CallCardTone, string> = {
  declined: THEME.colors.white,
  ended: THEME.colors.white,
};

const CALL_HISTORY_PAGE_SIZE = 50;

function Header({
  total,
  onRefresh,
  isRefreshing,
}: {
  total: number;
  onRefresh: () => void;
  isRefreshing: boolean;
}): React.ReactElement {
  return (
    <View style={styles.headerRow}>
      <View style={styles.headerLeft}>
        <View style={styles.headerAccent} />
        <Text style={styles.headerTitle}>Call History</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{total}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.refreshButton}
        onPress={onRefresh}
        disabled={isRefreshing}
        accessibilityRole="button"
        accessibilityLabel="Refresh call history"
      >
        <Text style={styles.refreshText}>
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const CallCard = memo(({ item }: { item: CallHistoryCardModel }) => {
  const statusStyle = STATUS_CONFIG[item.tone];

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: CARD_BACKGROUND[item.tone] },
      ]}
    >
      <View
        style={[
          styles.cardShimmerEdge,
          { backgroundColor: statusStyle.accent },
        ]}
      />

      <View style={styles.cardContent}>
        <View style={styles.leftBlock}>
          <View
            style={[
              styles.iconOuter,
              { borderColor: `${statusStyle.accent}55` },
            ]}
          >
            <View
              style={[
                styles.iconInner,
                { backgroundColor: `${statusStyle.accent}22` },
              ]}
            >
              <Text style={styles.videoIcon}>↗</Text>
            </View>
          </View>

          <View style={styles.info}>
            <Text style={styles.type}>{item.type}</Text>
            <Text style={styles.meta}>
              {item.time} • duration {item.duration}
            </Text>
            <Text style={styles.consultant}>Consultant: {item.consultant}</Text>
          </View>
        </View>

        <View style={styles.rightBlock}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: `${statusStyle.accent}38`,
                borderColor: `${statusStyle.accent}55`,
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: statusStyle.accent },
              ]}
            >
              {item.statusLabel}
            </Text>
          </View>

          <Text style={styles.callId}>{item.displayId}</Text>

          {item.canReview ? (
            <TouchableOpacity
              style={styles.rateButton}
              accessibilityRole="button"
              accessibilityLabel="Rate consultant"
            >
              <Text style={styles.rateText}>☆ Rate consultant</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
});

CallCard.displayName = 'CallCard';

function CallHistoryScreen(): React.ReactElement {
  const navigation = useNavigation();

  const { data, isLoading, isFetching, isError, refetch } = useGetCallHistoryQuery({
    page: 1,
    limit: CALL_HISTORY_PAGE_SIZE,
  });

  const callItems = data?.data.map(mapCallHistoryItem) ?? [];
  const totalCount = data?.meta.total ?? callItems.length;

  return (
    <SafeAreaWrapper edges={['top', 'bottom']} bgColor="white">
      <StatusBar barStyle="dark-content" />

      <ScreenHeader
        title="Call History"
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.container}>
        <Header
          total={totalCount}
          onRefresh={() => {
            void refetch();
          }}
          isRefreshing={isFetching}
        />

        {isLoading ? (
          <View style={styles.centeredState}>
            <ActivityIndicator size="large" color={THEME.colors.primary} />
            <Text style={styles.stateText}>Loading call history...</Text>
          </View>
        ) : isError ? (
          <View style={styles.centeredState}>
            <Text style={styles.errorText}>
              Unable to load call history. Please try again.
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                void refetch();
              }}
              accessibilityRole="button"
              accessibilityLabel="Retry loading call history"
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={callItems}
            keyExtractor={(item) => String(item.sessionId)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => <CallCard item={item} />}
            ListEmptyComponent={
              <Text style={styles.stateText}>No call history found.</Text>
            }
          />
        )}
      </View>
    </SafeAreaWrapper>
  );
}

export default CallHistoryScreen;
