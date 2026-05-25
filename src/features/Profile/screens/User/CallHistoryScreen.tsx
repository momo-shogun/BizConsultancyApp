import React, { memo, useMemo, useState } from 'react';
import {
  FlatList,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { styles } from './CallHistoryScreen.styles';
import { THEME } from '@/constants/theme';
import { SafeAreaWrapper, ScreenHeader } from '@/shared/components';
import { useNavigation } from '@react-navigation/native';

interface CallHistoryScreenProps {}

interface CallItem {
  id: string;
  type: 'Outgoing video';
  consultant: string;
  time: string;
  duration: string;
  status: 'declined' | 'ended';
}

const STATUS_CONFIG = {
  declined: {
    accent: '#A78BFA',
    label: 'declined',
  },
  ended: {
    accent: '#34D399',
    label: 'ended',
  },
};



const CARD_BACKGROUND = {
  declined: THEME.colors.white,
  ended: THEME.colors.white,
};

const CALLS: CallItem[] = [
  {
    id: '#157',
    type: 'Outgoing video',
    consultant: 'BIVASH',
    time: '07 Apr 2026, 05:24 pm',
    duration: '00:00',
    status: 'declined',
  },
  {
    id: '#156',
    type: 'Outgoing video',
    consultant: 'BIVASH',
    time: '07 Apr 2026, 05:24 pm',
    duration: '00:00',
    status: 'declined',
  },
  {
    id: '#155',
    type: 'Outgoing video',
    consultant: 'BIVASH',
    time: '07 Apr 2026, 05:22 pm',
    duration: '01:31',
    status: 'ended',
  },
];

function Header({
  total,
}: {
  total: number;
}) {
  return (
    <View style={styles.headerRow}>
      <View style={styles.headerLeft}>
        <View style={styles.headerAccent} />

        <Text style={styles.headerTitle}>
          Call History
        </Text>

        <View style={styles.countBadge}>
          <Text style={styles.countText}>
            {total}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.refreshButton}>
        <Text style={styles.refreshText}>
          Refresh
        </Text>
      </TouchableOpacity>
    </View>
  );
}



const CallCard = memo(
  ({ item }: { item: CallItem }) => {
    const status = STATUS_CONFIG[item.status];

    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor:
              CARD_BACKGROUND[item.status],
          },
        ]}
      >
        <View
          style={[
            styles.cardShimmerEdge,
            {
              backgroundColor:
                status.accent,
            },
          ]}
        />

        <View style={styles.cardContent}>
          <View style={styles.leftBlock}>
            <View
              style={[
                styles.iconOuter,
                {
                  borderColor:
                    `${status.accent}55`,
                },
              ]}
            >
              <View
                style={[
                  styles.iconInner,
                  {
                    backgroundColor:
                      `${status.accent}22`,
                  },
                ]}
              >
                <Text style={styles.videoIcon}>
                  ↗
                </Text>
              </View>
            </View>

            <View style={styles.info}>
              <Text style={styles.type}>
                {item.type}
              </Text>

              <Text style={styles.meta}>
                {item.time} • duration{' '}
                {item.duration}
              </Text>

              <Text style={styles.consultant}>
                Consultant:{' '}
                {item.consultant}
              </Text>
            </View>
          </View>

          <View style={styles.rightBlock}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    `${status.accent}38`,
                  borderColor:
                    `${status.accent}55`,
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      status.accent,
                  },
                ]}
              >
                {status.label}
              </Text>
            </View>

            <Text style={styles.callId}>
              {item.id}
            </Text>

            {item.status === 'ended' && (
              <TouchableOpacity
                style={
                  styles.rateButton
                }
              >
                <Text
                  style={
                    styles.rateText
                  }
                >
                  ☆ Rate consultant
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  }
);

function CallHistoryScreen(
  {}: CallHistoryScreenProps,
) {
  const navigation =
    useNavigation();

  const [search] =
    useState('');

  const filtered =
    useMemo(() => {
      return CALLS.filter((i) =>
        `${i.id}${i.type}${i.status}`
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
      );
    }, [search]);

  return (
    <SafeAreaWrapper
      edges={['top', 'bottom']}
      bgColor="white"
    >
      <StatusBar
        barStyle="dark-content"
      />

      <ScreenHeader
        title="Call History"
        onBackPress={() =>
          navigation.goBack()
        }
      />

      <View style={styles.container}>
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.id}
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.listContent
          }
          renderItem={({ item }) => (
            <CallCard item={item} />
          )}
        />
      </View>
    </SafeAreaWrapper>
  );
}



export default CallHistoryScreen;