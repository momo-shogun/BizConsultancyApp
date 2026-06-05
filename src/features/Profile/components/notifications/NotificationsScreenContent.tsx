import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { ACCOUNT_SUBSCREEN_HEADER_COLOR } from '@/constants/accountScreenTheme';
import { AccountHubScreenShell } from '@/shared/components';

import { NotificationCard } from './NotificationCard';
import { NOTIFICATIONS_CANVAS, styles } from '../../screens/NotificationsScreen.styles';
import type {
  ConsultantNotificationFilter,
  NotificationItem,
  NotificationSection,
  NotificationSectionKey,
  UserNotificationFilter,
} from '../../types/notifications.types';

const SECTION_TITLES: Record<NotificationSectionKey, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  earlier: 'Earlier',
};

const SECTION_ORDER: NotificationSectionKey[] = ['today', 'yesterday', 'earlier'];

type NotificationsVariant = 'user' | 'consultant';

type FilterValue = UserNotificationFilter | ConsultantNotificationFilter;

interface NotificationsScreenContentProps {
  variant: NotificationsVariant;
  items: NotificationItem[];
}

function matchesFilter(item: NotificationItem, filter: FilterValue): boolean {
  if (filter === 'all') {
    return true;
  }
  if (filter === 'bookings') {
    return item.filterCategory === 'bookings';
  }
  if (filter === 'payments') {
    return item.filterCategory === 'payments';
  }
  if (filter === 'payouts') {
    return item.filterCategory === 'payouts';
  }
  return true;
}

function groupBySection(items: NotificationItem[]): NotificationSection[] {
  return SECTION_ORDER.map((key) => ({
    key,
    title: SECTION_TITLES[key],
    items: items.filter((item) => item.section === key),
  })).filter((section) => section.items.length > 0);
}

export function NotificationsScreenContent(
  props: NotificationsScreenContentProps,
): React.ReactElement {
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all');
  const [readIds, setReadIds] = useState<Set<string>>(() => new Set());

  const filters = useMemo((): { id: FilterValue; label: string }[] => {
    if (props.variant === 'consultant') {
      return [
        { id: 'all', label: 'All' },
        { id: 'bookings', label: 'Bookings' },
        { id: 'payouts', label: 'Payouts' },
      ];
    }
    return [
      { id: 'all', label: 'All' },
      { id: 'bookings', label: 'Bookings' },
      { id: 'payments', label: 'Payments' },
    ];
  }, [props.variant]);

  const visibleItems = useMemo((): NotificationItem[] => {
    return props.items
      .filter((item) => matchesFilter(item, activeFilter))
      .map((item) => ({
        ...item,
        unread: item.unread === true && !readIds.has(item.id),
      }));
  }, [activeFilter, props.items, readIds]);

  const sections = useMemo((): NotificationSection[] => groupBySection(visibleItems), [visibleItems]);

  const handleMarkAllRead = useCallback((): void => {
    setReadIds(new Set(props.items.map((item) => item.id)));
  }, [props.items]);

  const headerRightAction = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Mark all as read"
      onPress={handleMarkAllRead}
      style={styles.markAllReadBtn}
    >
      <Text style={styles.markAllReadText}>Mark all as read</Text>
    </Pressable>
  );

  return (
    <AccountHubScreenShell
      title="Notifications"
      onBackPress={() => navigation.goBack()}
      canvasColor={NOTIFICATIONS_CANVAS}
      headerColor={ACCOUNT_SUBSCREEN_HEADER_COLOR}
      headerRightAction={headerRightAction}
    >
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.filterRow}>
          {filters.map((chip) => {
            const isActive = chip.id === activeFilter;
            return (
              <Pressable
                key={chip.id}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                onPress={() => setActiveFilter(chip.id)}
                style={[styles.filterChip, isActive ? styles.filterChipActive : null]}
              >
                <Text style={[styles.filterChipText, isActive ? styles.filterChipTextActive : null]}>
                  {chip.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {sections.map((section) => (
          <View key={section.key} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item) => (
              <NotificationCard key={item.id} item={item} />
            ))}
          </View>
        ))}
      </ScrollView>
    </AccountHubScreenShell>
  );
}
