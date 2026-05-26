import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useGetConsultantReviewsQuery } from '@/features/ConsultantSelf/api/consultantSelfApi';
import type { ConsultantReview } from '@/features/ConsultantSelf/types/consultantSelf.types';
import {
  PROFILE_HEADER_GRADIENT,
  PROFILE_HEADER_STATUS_BAR,
} from '@/features/Profile/constants/profileScreenTheme';
import { ROUTES } from '@/navigation/routeNames';
import type { AccountStackParamList } from '@/navigation/types';
import { SafeAreaWrapper, ScreenHeader } from '@/shared/components';
import { THEME } from '@/constants/theme';
import { getApiErrorMessage } from '@/utils/apiError';

const CANVAS = '#F4F7FB';
const PAGE_SIZE = 10;

type Nav = NativeStackNavigationProp<
  AccountStackParamList,
  typeof ROUTES.Account.ConsultantReviews
>;

function StarRating({ rating }: { rating: number }): React.ReactElement {
  const rounded = Math.min(5, Math.max(0, Math.round(rating)));
  return (
    <View style={styles.stars} accessibilityLabel={`${rounded} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Ionicons
          key={star}
          name={star <= rounded ? 'star' : 'star-outline'}
          size={14}
          color={star <= rounded ? '#F59E0B' : '#CBD5E1'}
        />
      ))}
    </View>
  );
}

function formatReviewDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function ReviewCard({ review }: { review: ConsultantReview }): React.ReactElement {
  const name = review.userName ?? review.bookingName ?? 'Anonymous';
  const initial = name.charAt(0).toUpperCase();
  const bookingMeta = [review.bookingDate, review.slotTime].filter(Boolean).join(' • ');

  return (
    <View style={styles.reviewCard}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>
      <View style={styles.reviewBody}>
        <View style={styles.reviewTop}>
          <Text style={styles.reviewerName} numberOfLines={1}>
            {name}
          </Text>
          <StarRating rating={review.rating} />
        </View>
        <Text style={styles.reviewDate}>{formatReviewDate(review.createdAt)}</Text>
        {bookingMeta.length > 0 ? (
          <Text style={styles.bookingMeta} numberOfLines={2}>
            Booking: {bookingMeta}
          </Text>
        ) : null}
        {review.comment != null && review.comment.trim().length > 0 ? (
          <Text style={styles.comment}>{review.comment}</Text>
        ) : null}
      </View>
    </View>
  );
}

export function ConsultantReviewsScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounced(searchTerm);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isFetching, error, refetch } = useGetConsultantReviewsQuery({
    page,
    limit: PAGE_SIZE,
    search: searchDebounced,
  });

  const reviews = data?.data ?? [];
  const meta = data?.meta;
  const errorMessage =
    error != null ? getApiErrorMessage(error, 'Failed to load reviews') : null;

  const topChrome = (
    <LinearGradient
      colors={[...PROFILE_HEADER_GRADIENT]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.topChrome, { paddingTop: insets.top }]}
    >
      <ScreenHeader
        title="Reviews"
        onBackPress={() => navigation.goBack()}
        headerColor="transparent"
      />
    </LinearGradient>
  );

  if (isLoading && reviews.length === 0) {
    return (
      <SafeAreaWrapper
        edges={['bottom']}
        bgColor={PROFILE_HEADER_STATUS_BAR}
        contentBgColor={CANVAS}
        statusBarStyle="light-content"
        style={styles.screen}
      >
        {topChrome}
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#059669" />
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper
      edges={['bottom']}
      bgColor={PROFILE_HEADER_STATUS_BAR}
      contentBgColor={CANVAS}
      statusBarStyle="light-content"
      style={styles.screen}
    >
      {topChrome}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            tintColor="#059669"
          />
        }
      >

        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={18} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Search reviews..."
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {errorMessage != null ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <Pressable onPress={refetch}>
              <Text style={styles.retry}>Retry</Text>
            </Pressable>
          </View>
        ) : null}

        {reviews.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name="chatbubble-ellipses-outline" size={28} color="#059669" />
            </View>
            <Text style={styles.emptyTitle}>No reviews yet</Text>
            <Text style={styles.emptyBody}>
              {searchDebounced.trim().length > 0
                ? 'Try a different search term.'
                : 'Reviews from your clients will appear here.'}
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </View>
        )}

        {meta != null && meta.totalPages > 1 ? (
          <View style={styles.pagination}>
            <Text style={styles.pageInfo}>
              Page {meta.page} of {meta.totalPages} · {meta.total} total
            </Text>
            <View style={styles.pageBtns}>
              <Pressable
                accessibilityRole="button"
                disabled={meta.page <= 1 || isFetching}
                onPress={() => setPage((p) => Math.max(1, p - 1))}
                style={[styles.pageBtn, meta.page <= 1 ? styles.pageBtnDisabled : null]}
              >
                <Text style={styles.pageBtnText}>Previous</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                disabled={meta.page >= meta.totalPages || isFetching}
                onPress={() => setPage((p) => p + 1)}
                style={[
                  styles.pageBtn,
                  meta.page >= meta.totalPages ? styles.pageBtnDisabled : null,
                ]}
              >
                <Text style={styles.pageBtnText}>Next</Text>
              </Pressable>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  topChrome: {
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: THEME.spacing[16],
    paddingBottom: THEME.spacing[28],
  },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  hero: {
    borderRadius: 20,
    padding: THEME.spacing[16],
    marginBottom: THEME.spacing[14],
    overflow: 'hidden',
  },
  heroEyebrow: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  heroTitle: { marginTop: 4, fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  heroSubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 18,
  },
  statCard: {
    marginTop: 14,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.78)',
    textTransform: 'uppercase',
  },
  statValue: { marginTop: 2, fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    marginTop: THEME.spacing[12],
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: 12,
  },
  errorText: { flex: 1, fontSize: 13, color: '#B91C1C' },
  retry: { fontSize: 13, fontWeight: '700', color: '#059669' },
  empty: { alignItems: 'center', paddingVertical: 36 },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: 'rgba(5,150,105,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  emptyBody: {
    marginTop: 6,
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  list: { gap: 10 },
  reviewCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8EEF4',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 16, fontWeight: '800', color: '#047857' },
  reviewBody: { flex: 1, minWidth: 0 },
  reviewTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  reviewerName: { flex: 1, fontSize: 15, fontWeight: '700', color: '#0F172A' },
  stars: { flexDirection: 'row', gap: 2 },
  reviewDate: { marginTop: 4, fontSize: 12, color: '#94A3B8' },
  bookingMeta: { marginTop: 4, fontSize: 12, color: '#64748B' },
  comment: {
    marginTop: 8,
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
  pagination: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 12,
  },
  pageInfo: { fontSize: 13, color: '#64748B', textAlign: 'center' },
  pageBtns: { flexDirection: 'row', gap: 10 },
  pageBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#059669',
    alignItems: 'center',
  },
  pageBtnDisabled: { opacity: 0.45 },
  pageBtnText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
});
