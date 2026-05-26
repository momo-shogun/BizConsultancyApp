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

import { ConsultantBookingCard } from '@/features/Bookings/components/ConsultantBookingCard';
import { CustomerProfileSheet } from '@/features/Bookings/components/CustomerProfileSheet';
import { useConsultantBookingsScreen } from '@/features/Bookings/hooks/useConsultantBookingsScreen';
import type { ConsultantSelfBooking } from '@/features/Bookings/types/consultantSelfBooking.types';
import { CallController } from '@/features/Calls/controllers/CallController';
import { PROFILE_HEADER_GRADIENT } from '@/features/Profile/constants/profileScreenTheme';
import { THEME } from '@/constants/theme';
import { ROUTES } from '@/navigation/routeNames';
import type { AccountStackParamList } from '@/navigation/types';
import { SafeAreaWrapper, ScreenHeader } from '@/shared/components';
import { showGlobalToast } from '@/shared/components/toast';

import { CONSULTANT_BOOKINGS_CANVAS, styles } from './ConsultantBookingsScreen.styles';

type Nav = NativeStackNavigationProp<
  AccountStackParamList,
  typeof ROUTES.Account.ConsultantBookings
>;

function BookingSkeleton(): React.ReactElement {
  return (
    <View style={styles.skeletonCard}>
      <View style={[styles.skeletonLine, { width: '55%' }]} />
      <View style={[styles.skeletonLine, { width: '80%' }]} />
      <View style={[styles.skeletonLine, { width: '40%' }]} />
    </View>
  );
}

export function ConsultantBookingsScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const screen = useConsultantBookingsScreen();

  const handleStartCall = useCallback(
    async (booking: ConsultantSelfBooking): Promise<void> => {
      if (screen.callingBookingId != null) {
        return;
      }
      screen.setCallingBookingId(booking.id);
      const error = await CallController.startOutgoingFromBooking(booking.id, booking.name);
      screen.setCallingBookingId(null);
      if (error != null) {
        showGlobalToast({ message: error, variant: 'error' });
      }
    },
    [screen],
  );

  if (screen.isLoading) {
    return (
      <SafeAreaWrapper edges={['top', 'bottom']} bgColor={CONSULTANT_BOOKINGS_CANVAS}>
        <ScreenHeader title="Bookings" onBackPress={() => navigation.goBack()} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={THEME.colors.primary} />
        </View>
      </SafeAreaWrapper>
    );
  }

  const isUpcoming = screen.filter === 'upcoming';

  return (
    <SafeAreaWrapper edges={['top', 'bottom']} bgColor={CONSULTANT_BOOKINGS_CANVAS}>
      <ScreenHeader title="Bookings" onBackPress={() => navigation.goBack()} />

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
          colors={[...PROFILE_HEADER_GRADIENT]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        >
          <View style={styles.heroTop}>
            <View style={styles.heroIconWrap}>
              <Ionicons name="calendar-outline" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.heroTextBlock}>
              <Text style={styles.heroTitle}>Your bookings</Text>
              <Text style={styles.heroMeta}>
                Manage client sessions, view details, and start confirmed calls.
              </Text>
            </View>
          </View>

          <View style={styles.tabRow}>
            {(['upcoming', 'past'] as const).map((tab) => {
              const active = screen.filter === tab;
              const label = tab === 'upcoming' ? 'Upcoming' : 'Past';
              const count = tab === 'upcoming' ? screen.upcomingCount : screen.pastCount;
              return (
                <Pressable
                  key={tab}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() => screen.setFilter(tab)}
                  style={[styles.tab, active ? styles.tabActive : null]}
                >
                  <Text style={[styles.tabText, active ? styles.tabTextActive : null]}>
                    {label}
                  </Text>
                  <Text style={[styles.tabCount, active ? styles.tabCountActive : null]}>
                    {count}
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

        <View style={styles.listBlock}>
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
        </View>

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
