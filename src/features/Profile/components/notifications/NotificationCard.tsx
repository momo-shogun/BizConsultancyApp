import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type { NotificationItem } from '@/features/Profile/types/notifications.types';

import { styles } from '../../screens/NotificationsScreen.styles';

interface NotificationCardProps {
  item: NotificationItem;
}

export function NotificationCard(props: NotificationCardProps): React.ReactElement {
  const { item } = props;
  const iconName = item.icon as React.ComponentProps<typeof Ionicons>['name'];

  return (
    <View style={styles.card}>
      {item.accentColor != null ? (
        <View style={[styles.accentBar, { backgroundColor: item.accentColor }]} />
      ) : null}

      <View style={styles.cardBody}>
        <View style={styles.cardTopRow}>
          <View style={[styles.iconWrap, { backgroundColor: item.iconBgColor }]}>
            <Ionicons name={iconName} size={18} color={item.iconColor} />
          </View>

          <View style={styles.cardMain}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <View style={styles.timeWrap}>
                {item.live ? (
                  <Text style={styles.liveText}>LIVE</Text>
                ) : item.timeLabel.length > 0 ? (
                  <Text style={styles.timeText}>{item.timeLabel}</Text>
                ) : null}
                {item.unread && item.accentColor != null ? (
                  <View style={[styles.unreadDot, { backgroundColor: item.accentColor }]} />
                ) : null}
              </View>
            </View>
            <Text style={styles.cardDesc}>{item.body}</Text>

            {item.showActions ? (
              <View style={styles.actionsRow}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Accept"
                  style={[
                    styles.acceptBtn,
                    item.actionTone === 'teal' ? styles.acceptBtnTeal : styles.acceptBtnOrange,
                  ]}
                >
                  <Text style={styles.acceptBtnText}>Accept</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Decline"
                  style={styles.declineBtn}
                >
                  <Text style={styles.declineBtnText}>Decline</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}
