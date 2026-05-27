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
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { ConsultantBookingCard } from '@/features/Bookings/components/ConsultantBookingCard';
import { ConsultantBookingsFilterTabs } from '@/features/Bookings/components/ConsultantBookingsFilterTabs';
import { CustomerProfileSheet } from '@/features/Bookings/components/CustomerProfileSheet';
import { useConsultantBookingsScreen } from '@/features/Bookings/hooks/useConsultantBookingsScreen';
import type { ConsultantSelfBooking } from '@/features/Bookings/types/consultantSelfBooking.types';
import { CallController } from '@/features/Calls/controllers/CallController';
import {
  PROFILE_HEADER_GRADIENT,
  PROFILE_HEADER_STATUS_BAR,
} from '@/features/Profile/constants/profileScreenTheme';
import { THEME } from '@/constants/theme';
import type { AccountStackParamList } from '@/navigation/types';
import { SafeAreaWrapper, ScreenHeader } from '@/shared/components';
import { showGlobalToast } from '@/shared/components/toast';

import { CONSULTANT_BOOKINGS_CANVAS, styles } from './ConsultantBookingsScreen.styles';

type Nav = NativeStackNavigationProp<
  AccountStackParamList,
  'App/Account/ConsultantBookings'
>;

function BookingSkeleton(): React.ReactElement {
  return (
    <View style={styles.skeletonCard}>
      <View style={[styles.skeletonLine, styles.skeletonLineWide]} />
      <View style={[styles.skeletonLine, styles.skeletonLineFull]} />
      <View style={[styles.skeletonLine, styles.skeletonLineShort]} />
    </View>
  );
}

export function ConsultantBookingsScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const screen = useConsultantBookingsScreen();

  const topChrome = (
    <LinearGradient
      colors={[...PROFILE_HEADER_GRADIENT]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.topChrome, { paddingTop: insets.top }]}
    >
      <ScreenHeader
        title="Bookings"
        onBackPress={() => navigation.goBack()}
        headerColor="transparent"
      />
    </LinearGradient>
  );

  const handleStartCall = useCallback(
    async (booking: ConsultantSelfBooking): Promise<void> => {
      if (screen.callingBookingId != null) {
        return;
      }
      screen.setCallingBookingId(booking.id);
      const error = await CallController.startOutgoingFromBooking(
        booking.id,
        booking.name,
        booking.consultationType,
      );
      screen.setCallingBookingId(null);
      if (error != null) {
        showGlobalToast({ message: error, variant: 'error' });
      }
    },
    [screen],
  );

  if (screen.isLoading) {
    return (
      <SafeAreaWrapper
        edges={['bottom']}
        bgColor={PROFILE_HEADER_STATUS_BAR}
        contentBgColor={CONSULTANT_BOOKINGS_CANVAS}
        statusBarStyle="light-content"
        style={styles.screenRoot}
      >
        {topChrome}
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#059669" />
        </View>
      </SafeAreaWrapper>
    );
  }

  const isUpcoming = screen.filter === 'upcoming';

  return (
    <SafeAreaWrapper
      edges={['bottom']}
      bgColor={PROFILE_HEADER_STATUS_BAR}
      contentBgColor={CONSULTANT_BOOKINGS_CANVAS}
      statusBarStyle="light-content"
      style={styles.screenRoot}
    >
      {topChrome}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={screen.isRefreshing}
            onRefresh={screen.refresh}
            tintColor="#059669"
          />
        }
      >
        <ConsultantBookingsFilterTabs
          filter={screen.filter}
          upcomingCount={screen.upcomingCount}
          pastCount={screen.pastCount}
          onFilterChange={screen.setFilter}
        />

        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={18} color="#64748B" />
          <TextInput
            value={screen.search}
            onChangeText={screen.setSearch}
            placeholder="Search by customer name or email"
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
            <Pressable style={styles.retryBtn} onPress={screen.refresh}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : null}

        <Animated.View
          key={screen.filter}
          entering={FadeIn.duration(220)}
          exiting={FadeOut.duration(160)}
          style={styles.listBlock}
        >
          {screen.isRefreshing && screen.visibleBookings.length === 0 ? (
            <>
              <BookingSkeleton />
              <BookingSkeleton />
            </>
          ) : screen.visibleBookings.length === 0 && screen.errorMessage == null ? (
            <View style={styles.emptyBlock}>
              <View style={styles.emptyIcon}>
                <Ionicons name="calendar-outline" size={28} color="#059669" />
              </View>
              <Text style={styles.emptyTitle}>
                {isUpcoming ? 'No upcoming bookings' : 'No past bookings'}
              </Text>
              <Text style={styles.emptyBody}>
                {isUpcoming
                  ? 'New client bookings will appear here when scheduled.'
                  : 'Completed and cancelled sessions show up here.'}
              </Text>
            </View>
          ) : (
            screen.visibleBookings.map((booking, index) => (
              <ConsultantBookingCard
                key={booking.id}
                booking={booking}
                filter={screen.filter}
                isLast={index === screen.visibleBookings.length - 1}
                isCalling={screen.callingBookingId === booking.id}
                onViewProfile={() => screen.setProfileBooking(booking)}
                onStartCall={() => void handleStartCall(booking)}
              />
            ))
          )}
        </Animated.View>

        {screen.totalPages > 1 ? (
          <View style={styles.pagination}>
            <Pressable
              accessibilityRole="button"
              disabled={screen.page <= 1}
              onPress={() => screen.setPage(screen.page - 1)}
              style={[styles.pageBtn, screen.page <= 1 ? styles.pageBtnDisabled : null]}
            >
              <Ionicons name="chevron-back" size={18} color="#0F172A" />
            </Pressable>
            <Text style={styles.pageLabel}>
              Page {screen.page} of {screen.totalPages}
            </Text>
            <Pressable
              accessibilityRole="button"
              disabled={screen.page >= screen.totalPages}
              onPress={() => screen.setPage(screen.page + 1)}
              style={[styles.pageBtn, screen.page >= screen.totalPages ? styles.pageBtnDisabled : null]}
            >
              <Ionicons name="chevron-forward" size={18} color="#0F172A" />
            </Pressable>
          </View>
        ) : null}
      </ScrollView>

      <CustomerProfileSheet
        booking={screen.profileBooking}
        visible={screen.profileBooking != null}
        onClose={() => screen.setProfileBooking(null)}
      />
    </SafeAreaWrapper>
  );
}
