import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useMyBookingsScreen } from '@/features/Bookings/hooks/useMyBookingsScreen';
import type { MyConsultantBooking } from '@/features/Bookings/types/myConsultantBooking.types';
import { formatBookingDate } from '@/features/Bookings/utils/bookingDateTime';
import {
  canShowCallAction,
  getBookingStatusTone,
  getPaymentLabel,
} from '@/features/Bookings/utils/bookingDisplay';
import { THEME } from '@/constants/theme';
import { navigationRef } from '@/navigation/navigationContainerRef';
import { ROUTES } from '@/navigation/routeNames';
import type { AccountStackParamList } from '@/navigation/types';
import { SafeAreaWrapper, ScreenHeader } from '@/shared/components';
import { showGlobalToast } from '@/shared/components/toast';

import { BOOKINGS_CANVAS, styles } from './MyBookingsScreen.styles';

type Nav = NativeStackNavigationProp<AccountStackParamList, typeof ROUTES.Account.MyBookings>;

function StatusBadge(props: { status: string }): React.ReactElement {
  const tone = getBookingStatusTone(props.status);
  const toneStyle =
    tone === 'pending'
      ? styles.statusPending
      : tone === 'confirmed'
        ? styles.statusConfirmed
        : tone === 'completed'
          ? styles.statusCompleted
          : tone === 'cancelled'
            ? styles.statusCancelled
            : styles.statusDefault;
  const textStyle =
    tone === 'pending'
      ? styles.statusPendingText
      : tone === 'confirmed'
        ? styles.statusConfirmedText
        : tone === 'completed'
          ? styles.statusCompletedText
          : tone === 'cancelled'
            ? styles.statusCancelledText
            : styles.statusDefaultText;

  return (
    <View style={[styles.statusBadge, toneStyle]}>
      <Text style={[styles.statusText, textStyle]}>{props.status}</Text>
    </View>
  );
}

interface BookingRowProps {
  booking: MyConsultantBooking;
  filter: 'upcoming' | 'past';
  isLast: boolean;
  onCallPress: () => void;
}

function BookingRow(props: BookingRowProps): React.ReactElement {
  const { booking, filter, isLast, onCallPress } = props;
  const showCall = canShowCallAction(booking, filter);
  const isVideo = booking.consultationType.toLowerCase() === 'video';
  const consultationIcon = isVideo ? 'videocam-outline' : 'chatbubbles-outline';

  return (
    <View style={[styles.bookingRow, isLast ? styles.bookingRowLast : null]}>
      <View style={styles.bookingMain}>
        <View style={styles.bookingContent}>
          <View style={styles.titleRow}>
            <Text style={styles.consultantName} numberOfLines={1}>
              {booking.consultantName ?? 'Consultant'}
            </Text>
            <StatusBadge status={booking.status} />
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={13} color="#94A3B8" />
            <Text style={styles.meta} numberOfLines={1}>
              {formatBookingDate(booking.bookingDate)} · {booking.slotTime}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name={consultationIcon} size={13} color="#94A3B8" />
            <Text style={styles.meta} numberOfLines={1}>
              {booking.consultationType} · {getPaymentLabel(booking)}
            </Text>
          </View>
        </View>
        {booking.amount != null && booking.amount > 0 ? (
          <View style={styles.amountChip}>
            <Text style={styles.amount}>₹{booking.amount.toLocaleString('en-IN')}</Text>
          </View>
        ) : null}
      </View>
      {showCall ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Call option coming soon"
          onPress={onCallPress}
          style={({ pressed }) => [styles.callBtn, pressed ? { opacity: 0.88 } : null]}
        >
          <Ionicons
            name={isVideo ? 'videocam-outline' : 'call-outline'}
            size={14}
            color={THEME.colors.primary}
          />
          <Text style={styles.callBtnText}>
            {isVideo ? 'Video session' : 'Phone call'} — coming soon
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function MyBookingsScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const screen = useMyBookingsScreen();

  const handleCallPress = useCallback((): void => {
    showGlobalToast({
      message: 'In-app calls will be available in a future update.',
      variant: 'info',
    });
  }, []);

  const browseConsultants = useCallback((): void => {
    navigationRef.navigate(ROUTES.Root.ConsultantsList);
  }, []);

  if (screen.isLoading) {
    return (
      <SafeAreaWrapper edges={['top', 'bottom']} bgColor={BOOKINGS_CANVAS}>
        <ScreenHeader title="My Bookings" onBackPress={() => navigation.goBack()} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={THEME.colors.primary} />
        </View>
      </SafeAreaWrapper>
    );
  }

  const isUpcoming = screen.filter === 'upcoming';

  return (
    <SafeAreaWrapper edges={['top', 'bottom']} bgColor={BOOKINGS_CANVAS}>
      <ScreenHeader title="My Bookings" onBackPress={() => navigation.goBack()} />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={screen.isRefreshing}
            onRefresh={screen.refresh}
            tintColor={THEME.colors.primary}
          />
        }
      >
        <LinearGradient
          colors={[THEME.colors.primary, '#166534']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        >
          <View style={styles.heroTop}>
            <View style={styles.heroIconWrap}>
              <Ionicons name="calendar-outline" size={22} color="#FFFFFF" />
            </View>
            <View style={styles.heroTextBlock}>
              <Text style={styles.heroTitle}>Your consultant sessions</Text>
              <Text style={styles.heroMeta}>
                {isUpcoming
                  ? 'Upcoming appointments and pending confirmations.'
                  : 'Completed and past sessions.'}
                {' '}
                Pull down to refresh.
              </Text>
            </View>
          </View>

          <View style={styles.tabRow}>
            {(['upcoming', 'past'] as const).map((tab) => {
              const active = screen.filter === tab;
              const tabLabel = tab === 'upcoming' ? 'Upcoming' : 'Past';
              return (
                <Pressable
                  key={tab}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() => screen.setFilter(tab)}
                  style={[styles.tab, active ? styles.tabActive : null]}
                >
                  <Text style={[styles.tabText, active ? styles.tabTextActive : null]}>
                    {tabLabel}
                  </Text>
                  <Text
                    style={[styles.tabCount, active ? styles.tabCountActive : null]}
                  >
                    {tab === 'upcoming' ? screen.upcomingCount : screen.pastCount}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </LinearGradient>

        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={18} color="#64748B" />
          <TextInput
            value={screen.search}
            onChangeText={screen.setSearch}
            placeholder="Search by name or email"
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            accessibilityLabel="Search bookings"
          />
          {screen.search.length > 0 ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              onPress={() => screen.setSearch('')}
              hitSlop={8}
            >
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </Pressable>
          ) : null}
        </View>

        {screen.errorMessage != null ? (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle-outline" size={18} color={THEME.colors.danger} />
            <Text style={styles.errorText}>{screen.errorMessage}</Text>
          </View>
        ) : null}

        <View style={styles.listBlock}>
          {screen.visibleBookings.length === 0 && screen.errorMessage == null ? (
            <View style={styles.emptyBlock}>
              <View style={styles.emptyIcon}>
                <Ionicons name="calendar-outline" size={26} color={THEME.colors.primary} />
              </View>
              <Text style={styles.emptyTitle}>
                {isUpcoming ? 'No upcoming bookings' : 'No past bookings'}
              </Text>
              <Text style={styles.emptyBody}>
                {isUpcoming
                  ? 'Book a consultant to schedule your next session.'
                  : 'Your completed sessions will appear here.'}
              </Text>
              {isUpcoming ? (
                <Pressable style={styles.linkBtn} onPress={browseConsultants}>
                  <Text style={styles.linkBtnText}>Find a consultant</Text>
                  <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
                </Pressable>
              ) : null}
            </View>
          ) : (
            screen.visibleBookings.map((booking, index) => (
              <BookingRow
                key={booking.id}
                booking={booking}
                filter={screen.filter}
                isLast={index === screen.visibleBookings.length - 1}
                onCallPress={handleCallPress}
              />
            ))
          )}
        </View>

        {screen.totalPages > 1 ? (
          <View style={styles.pagination}>
            <Pressable
              accessibilityRole="button"
              disabled={screen.page <= 1}
              onPress={() => screen.setPage(screen.page - 1)}
              style={[styles.pageBtn, screen.page <= 1 ? styles.pageBtnDisabled : null]}
            >
              <Ionicons name="chevron-back" size={16} color={THEME.colors.textPrimary} />
            </Pressable>
            <Text style={styles.pageLabel}>
              Page {screen.page} of {screen.totalPages}
            </Text>
            <Pressable
              accessibilityRole="button"
              disabled={screen.page >= screen.totalPages}
              onPress={() => screen.setPage(screen.page + 1)}
              style={[
                styles.pageBtn,
                screen.page >= screen.totalPages ? styles.pageBtnDisabled : null,
              ]}
            >
              <Ionicons name="chevron-forward" size={16} color={THEME.colors.textPrimary} />
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaWrapper>
  );
}
