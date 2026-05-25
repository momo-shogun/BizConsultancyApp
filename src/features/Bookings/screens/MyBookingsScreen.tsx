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
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useMyBookingsScreen } from '@/features/Bookings/hooks/useMyBookingsScreen';
import type { MyConsultantBooking } from '@/features/Bookings/types/myConsultantBooking.types';
import { formatBookingDate } from '@/features/Bookings/utils/bookingDateTime';
import {
  canShowCallAction,
  getBookingStatusTone,
  getPaymentLabel,
} from '@/features/Bookings/utils/bookingDisplay';
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

interface BookingCardProps {
  booking: MyConsultantBooking;
  filter: 'upcoming' | 'past';
  onCallPress: () => void;
}

function BookingCard(props: BookingCardProps): React.ReactElement {
  const { booking, filter, onCallPress } = props;
  const showCall = canShowCallAction(booking, filter);
  const isVideo = booking.consultationType.toLowerCase() === 'video';

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.cardLeft}>
          <Text style={styles.consultantName} numberOfLines={1}>
            {booking.consultantName ?? 'Consultant'}
          </Text>
          <Text style={styles.meta}>
            {formatBookingDate(booking.bookingDate)} · {booking.slotTime}
          </Text>
          <Text style={styles.meta}>
            {booking.consultationType} · {getPaymentLabel(booking)}
          </Text>
          <StatusBadge status={booking.status} />
        </View>
        {booking.amount != null && booking.amount > 0 ? (
          <Text style={styles.amount}>₹{booking.amount.toLocaleString('en-IN')}</Text>
        ) : null}
      </View>

      {showCall ? (
        <View style={styles.callRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isVideo ? 'Video call coming soon' : 'Call coming soon'}
            onPress={onCallPress}
            style={({ pressed }) => [styles.callBtn, pressed ? { opacity: 0.88 } : null]}
          >
            <Ionicons
              name={isVideo ? 'videocam-outline' : 'call-outline'}
              size={16}
              color="#64748B"
            />
            <Text style={styles.callBtnText}>
              {isVideo ? 'Video call' : 'Call'} · Coming soon
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

export function MyBookingsScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const screen = useMyBookingsScreen();

  const handleCallPress = useCallback((): void => {
    showGlobalToast({
      message: 'Video and phone calls will be available in a future app update.',
      variant: 'info',
    });
  }, []);

  const browseConsultants = useCallback((): void => {
    navigationRef.navigate(ROUTES.Root.ConsultantsList);
  }, []);

  const openWorkshopBookings = useCallback((): void => {
    navigation.navigate(ROUTES.Account.WorkshopBookings);
  }, [navigation]);

  if (screen.isLoading) {
    return (
      <SafeAreaWrapper edges={['top', 'bottom']} bgColor={BOOKINGS_CANVAS}>
        <ScreenHeader title="My Bookings" onBackPress={() => navigation.goBack()} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0F5132" />
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper edges={['top', 'bottom']} bgColor={BOOKINGS_CANVAS}>
      <ScreenHeader title="My Bookings" onBackPress={() => navigation.goBack()} />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={screen.isRefreshing}
            onRefresh={screen.refresh}
            tintColor="#0F5132"
          />
        }
      >
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Consultation bookings</Text>
          <View style={styles.tabRow}>
            {(['upcoming', 'past'] as const).map((tab) => {
              const active = screen.filter === tab;
              return (
                <Pressable
                  key={tab}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() => screen.setFilter(tab)}
                  style={[styles.tab, active ? styles.tabActive : null]}
                >
                  <Text style={[styles.tabText, active ? styles.tabTextActive : null]}>
                    {tab === 'upcoming' ? 'Upcoming' : 'Past'}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={18} color="#64748B" />
          <TextInput
            value={screen.search}
            onChangeText={screen.setSearch}
            placeholder="Search by consultant or email"
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {screen.errorMessage != null ? (
          <Text style={styles.errorText}>{screen.errorMessage}</Text>
        ) : null}

        {screen.visibleBookings.length === 0 && screen.errorMessage == null ? (
          <View style={styles.card}>
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Ionicons name="calendar-outline" size={28} color="#0F5132" />
              </View>
              <Text style={styles.emptyTitle}>You don't have any bookings</Text>
              <Pressable style={styles.linkBtn} onPress={browseConsultants}>
                <Text style={styles.linkBtnText}>Browse consultants</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          screen.visibleBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              filter={screen.filter}
              onCallPress={handleCallPress}
            />
          ))
        )}

        {screen.totalPages > 1 ? (
          <View style={styles.pagination}>
            <Pressable
              accessibilityRole="button"
              disabled={screen.page <= 1}
              onPress={() => screen.setPage(screen.page - 1)}
              style={[styles.pageBtn, screen.page <= 1 ? styles.pageBtnDisabled : null]}
            >
              <Text style={styles.pageBtnText}>Previous</Text>
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
              <Text style={styles.pageBtnText}>Next</Text>
            </Pressable>
          </View>
        ) : null}

        <Pressable style={styles.sectionLinkCard} onPress={openWorkshopBookings}>
          <Text style={styles.sectionLinkTitle}>Workshop bookings</Text>
          <Text style={styles.sectionLinkAction}>View all</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaWrapper>
  );
}
