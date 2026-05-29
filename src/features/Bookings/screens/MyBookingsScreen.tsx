import React, { useCallback, useRef, useState } from 'react';
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

import { MyBookingCard } from '@/features/Bookings/components/MyBookingCard';
import { MyBookingsAnimatedSearchBar } from '@/features/Bookings/components/MyBookingsAnimatedSearchBar';
import { MyBookingsFilterTabs } from '@/features/Bookings/components/MyBookingsFilterTabs';
import { useMyBookingsScreen } from '@/features/Bookings/hooks/useMyBookingsScreen';
import { useUserBookingCall } from '@/features/Bookings/hooks/useUserBookingCall';
import { THEME } from '@/constants/theme';
import { navigationRef } from '@/navigation/navigationContainerRef';
import { ROUTES } from '@/navigation/routeNames';
import type { AccountStackParamList } from '@/navigation/types';
import { AccountHubScreenShell } from '@/shared/components';

import {
  BOOKINGS_CANVAS,
  BOOKINGS_HEADER_GRADIENT,
  BOOKINGS_HEADER_STATUS_BAR,
  styles,
} from './MyBookingsScreen.styles';

type Nav = NativeStackNavigationProp<AccountStackParamList, typeof ROUTES.Account.MyBookings>;

export function MyBookingsScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const screen = useMyBookingsScreen();
  const { callingBookingId, startCallFromBooking } = useUserBookingCall();
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<TextInput>(null);

  const browseConsultants = useCallback((): void => {
    navigationRef.navigate(ROUTES.Root.ConsultantsList);
  }, []);

  const openSearch = useCallback((): void => {
    setSearchOpen(true);
  }, []);

  const closeSearch = useCallback((): void => {
    setSearchOpen(false);
    screen.setSearch('');
  }, [screen]);

  const headerSearch = (
    <MyBookingsAnimatedSearchBar
      visible={searchOpen}
      value={screen.search}
      onChangeText={screen.setSearch}
      inputRef={searchInputRef}
      placeholder="Search by name or email"
      accessibilityLabel="Search bookings"
      embeddedInHeader
    />
  );

  const shellProps = {
    title: 'My Bookings',
    onBackPress: () => navigation.goBack(),
    canvasColor: BOOKINGS_CANVAS,
    headerColor: BOOKINGS_HEADER_STATUS_BAR,
    headerGradientColors: BOOKINGS_HEADER_GRADIENT,
    onSearchPress: searchOpen ? undefined : openSearch,
    headerRightAction: searchOpen ? (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close search"
        onPress={closeSearch}
        hitSlop={8}
        style={styles.headerIconBtn}
      >
        <Ionicons name="close" size={22} color="#FFFFFF" />
      </Pressable>
    ) : undefined,
    headerAccessory: headerSearch,
  } as const;

  if (screen.isLoading) {
    return (
      <AccountHubScreenShell {...shellProps}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={THEME.colors.primary} />
        </View>
      </AccountHubScreenShell>
    );
  }

  const isUpcoming = screen.filter === 'upcoming';

  return (
    <AccountHubScreenShell {...shellProps}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={screen.isRefreshing}
            onRefresh={screen.refresh}
            tintColor="#128C7E"
          />
        }
      >
        <LinearGradient
          colors={['#075E54', '#128C7E']}
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

          <MyBookingsFilterTabs
            activeFilter={screen.filter}
            upcomingCount={screen.upcomingCount}
            pastCount={screen.pastCount}
            onFilterChange={screen.setFilter}
          />
        </LinearGradient>

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
                <Ionicons name="calendar-outline" size={26} color="#128C7E" />
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
            screen.visibleBookings.map((booking) => (
              <MyBookingCard
                key={booking.id}
                booking={booking}
                filter={screen.filter}
                isCalling={callingBookingId === booking.id}
                onCallPress={() => {
                  void startCallFromBooking(booking, screen.filter);
                }}
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
    </AccountHubScreenShell>
  );
}
