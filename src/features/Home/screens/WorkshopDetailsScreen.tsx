import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { API_ORIGIN } from '@/constants/api';
import { THEME } from '@/constants/theme';
import { usePublicWorkshopDetail } from '@/features/Home/hooks/usePublicWorkshopDetail';
import { WorkshopBookingPaymentModal } from '@/features/Home/components/WorkshopBookingPaymentModal';
import { useWorkshopBooking } from '@/features/Home/hooks/useWorkshopBooking';
import {
  formatWorkshopDateRange,
  formatWorkshopTimeRange,
  formatWorkshopTypeLabel,
  isWorkshopBookable,
  isWorkshopOnlineAvailable,
  isWorkshopUpcoming,
  parseWorkshopHighlightPoints,
  parseWorkshopKeywords,
  resolveWorkshopFee,
  resolveWorkshopJoinUrl,
  resolveWorkshopMapsUrl,
} from '@/features/Home/utils/workshopDetailUtils';
import { ROUTES } from '@/navigation/routeNames';
import type { RootStackParamList } from '@/navigation/types';
import { RemoteImage, SafeAreaWrapper, ScreenWrapper } from '@/shared/components';
import { resolveAwsImageUrl } from '@/utils/awsImageUrl';

// ─── Constants ───────────────────────────────────────────────────────────────

const H_PADDING = 16;
const HERO_HEIGHT = 340;

const COLORS = {
  white: '#FFFFFF',
  black: '#0F172A',
  screenBg: '#F8FAFC',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  border: '#E2E8F0',
  surfaceBg: '#F1F5F9',
  green: '#10B981',
  greenLight: '#ECFDF5',
  heroOverlay: 'rgba(10,20,40,0.55)',
} as const;

const TAG_PALETTES = [
  { bg: '#DBEAFE', text: '#1D4ED8' },
  { bg: '#DCFCE7', text: '#15803D' },
  { bg: '#F3E8FF', text: '#7E22CE' },
  { bg: '#FEF3C7', text: '#B45309' },
] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

type WorkshopDetailRoute = RouteProp<RootStackParamList, typeof ROUTES.Root.WorkshopsDetail>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function openPhoneDialer(phone: string): void {
  const digits = phone.replace(/\s/g, '');
  if (digits.length === 0) return;
  void Linking.openURL(`tel:${digits}`);
}

function openExternalUrl(url: string): void {
  const trimmed = url.trim();
  if (trimmed.length === 0) return;
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  void Linking.openURL(withScheme);
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function WorkshopDetailsScreen(): React.ReactElement {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<WorkshopDetailRoute>();
  const insets = useSafeAreaInsets();

  const slug = route.params.slug;
  const { workshop, isLoading, isFetching, isError, refetch } = usePublicWorkshopDetail(slug);
  const [refreshing, setRefreshing] = useState(false);

  const heroUri = useMemo(
    () => resolveAwsImageUrl(workshop?.thumbnail ?? null),
    [workshop?.thumbnail],
  );

  const highlights = useMemo(
    () => parseWorkshopHighlightPoints(workshop?.highlightPoints),
    [workshop?.highlightPoints],
  );

  const keywordTags = useMemo(
    () => parseWorkshopKeywords(workshop?.keywords),
    [workshop?.keywords],
  );

  const fee = useMemo(
    () => (workshop != null ? resolveWorkshopFee(workshop) : null),
    [workshop],
  );

  const dateLabel = useMemo((): string => {
    if (workshop == null) return '';
    return formatWorkshopDateRange(workshop.startDate, workshop.endDate);
  }, [workshop]);

  const timeLabel = useMemo((): string => {
    if (workshop == null) return '';
    return formatWorkshopTimeRange(workshop.startTime, workshop.endTime);
  }, [workshop]);

  const locationLine = useMemo((): string => {
    if (workshop == null) return '—';
    const place = workshop.place?.trim();
    const map = workshop.mapLocation?.trim();
    if (place && map) return `${place} — ${map}`;
    return place ?? map ?? 'Online';
  }, [workshop]);

  const onBackToList = useCallback((): void => {
    navigation.navigate(ROUTES.Root.WorkshopsList);
  }, [navigation]);

  const onContactPress = useCallback((): void => {
    const phone = workshop?.contactNumber?.trim();
    if (phone) openPhoneDialer(phone);
  }, [workshop?.contactNumber]);

  const onSharePress = useCallback((): void => {
    if (workshop == null) return;
    const link = `${API_ORIGIN}/workshop/${workshop.slug}`;
    void Share.share({
      title: workshop.name,
      message: `${workshop.name}\n${link}`,
    });
  }, [workshop]);

  const onRefresh = useCallback((): void => {
    setRefreshing(true);
    void refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  const {
    isBooked,
    isBooking,
    bookAmountRupees,
    paymentModalVisible,
    walletBalanceRupees,
    canPayWithWallet,
    payingWith,
    onBookPress,
    closePaymentModal,
    onPayRazorpay,
    onPayWallet,
    workshopLoginDialog,
  } = useWorkshopBooking(workshop);

  const isUpcoming = workshop != null ? isWorkshopUpcoming(workshop) : true;
  const isOnlineAvailable = workshop != null ? isWorkshopOnlineAvailable(workshop) : false;
  const isBookable = workshop != null ? isWorkshopBookable(workshop) : false;
  const joinUrl = workshop != null ? resolveWorkshopJoinUrl(workshop) : null;
  const mapsUrl = workshop != null ? resolveWorkshopMapsUrl(workshop) : null;

  const bookCtaLabel = isBooked
    ? 'Booked'
    : !isBookable
      ? 'Session ended'
      : isBooking
        ? 'Booking…'
        : !isUpcoming && isOnlineAvailable
          ? 'Book access'
          : 'Book now';
  const canBook =
    isBookable && !isBooked && !isBooking && workshop != null && fee != null;

  // ── Guard states ────────────────────────────────────────────────────────────

  if (slug.trim().length === 0) {
    return (
      <SafeAreaWrapper edges={['top']}>
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={48} color={COLORS.textTertiary} />
          <Text style={styles.errorTitle}>Invalid workshop</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to workshops"
            onPress={onBackToList}
            style={({ pressed }) => [styles.outlineButton, pressed && styles.pressed]}
          >
            <Text style={styles.outlineButtonText}>Back to workshops</Text>
          </Pressable>
        </View>
      </SafeAreaWrapper>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaWrapper edges={['top']}>
        <WorkshopDetailsSkeleton />
      </SafeAreaWrapper>
    );
  }

  if (isError || workshop == null || fee == null) {
    return (
      <SafeAreaWrapper edges={['top']}>
        <View style={styles.centered}>
          <Ionicons name="cloud-offline-outline" size={48} color={COLORS.textTertiary} />
          <Text style={styles.errorTitle}>Workshop not found</Text>
          <Text style={styles.errorBody}>
            This workshop may have been removed or is unavailable.
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Retry loading workshop"
            onPress={refetch}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
          >
            <Text style={styles.primaryButtonText}>Retry</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to workshops"
            onPress={onBackToList}
            style={({ pressed }) => [styles.outlineButton, pressed && styles.pressed]}
          >
            <Text style={styles.outlineButtonText}>Back to workshops</Text>
          </Pressable>
        </View>
      </SafeAreaWrapper>
    );
  }

  const showLiveBadge = workshop.isLiveWorkshop === 1;
  const contactNumber = workshop.contactNumber?.trim() ?? '';
  const descriptionText = workshop.description?.trim() ?? '';
  const isOnlinePlace = (workshop.place?.trim().toLowerCase() ?? '') === 'online';

  // ── Main render ─────────────────────────────────────────────────────────────

  return (
    <SafeAreaWrapper edges={['top']} bgColor='transparent'>
      {workshopLoginDialog}
      <ScreenWrapper style={styles.screenBg}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing || (isFetching && workshop != null)}
              onRefresh={onRefresh}
              tintColor={THEME.colors.primary}
            />
          }
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: 24 + insets.bottom + 88 },
          ]}
        >
          {/* ── Hero ── */}
          <View style={styles.heroWrap}>
            <RemoteImage
              uri={heroUri}
              placeholderVariant="media"
              placeholderName={workshop.name}
              style={styles.heroImage}
              imageStyle={styles.heroImage}
              resizeMode="cover"
              accessibilityLabel={workshop.name}
            />

            {/* Gradient overlay */}
            <LinearGradient
              colors={['transparent', COLORS.heroOverlay]}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />

            {/* Floating back button */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={() => navigation.goBack()}
              style={({ pressed }) => [
                styles.fab,
                { top: insets.top + 10, left: 14 },
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="arrow-back" size={20} color={COLORS.white} />
            </Pressable>

            {/* Floating share button */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Share workshop"
              onPress={onSharePress}
              style={({ pressed }) => [
                styles.fab,
                { top: insets.top + 10, right: 14 },
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="share-outline" size={18} color={COLORS.white} />
            </Pressable>

            {/* Hero content */}
            <View style={styles.heroContent}>
              {/* Badges */}
              <View style={styles.badgeRow}>
                {showLiveBadge && (
                  <View style={styles.liveBadge}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveText}>Live workshop</Text>
                  </View>
                )}
                {workshop.type.trim().length > 0 ? (
                  <View style={styles.typeBadge}>
                    <Ionicons
                      name={workshop.type.toLowerCase() === 'webinar' ? 'videocam-outline' : 'school-outline'}
                      size={13}
                      color="rgba(255,255,255,0.95)"
                    />
                    <Text style={styles.typeBadgeText}>
                      {formatWorkshopTypeLabel(workshop.type)}
                    </Text>
                  </View>
                ) : null}
              </View>

              <LinearGradient
                colors={['rgba(15,23,42,0.16)', 'rgba(15,23,42,0.48)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroTitleBackdrop}
              >
                <Text style={styles.heroTitle} numberOfLines={3}>
                  {workshop.name}
                </Text>
              </LinearGradient>
            </View>
          </View>

          {descriptionText.length > 0 ? (
            <View style={styles.descriptionBelowHero}>
              <Text style={styles.descriptionBelowHeroLabel}>About</Text>
              <Text style={styles.descriptionBelowHeroText}>{descriptionText}</Text>
            </View>
          ) : null}

          {!isUpcoming ? (
            <View style={styles.pastBanner}>
              <Ionicons name="information-circle-outline" size={18} color="#92400E" />
              <Text style={styles.pastBannerText}>
                {isOnlineAvailable
                  ? 'This session has ended. You can still book online access.'
                  : 'This session has already taken place.'}
              </Text>
            </View>
          ) : null}

          {/* {isBooked ? (
            <View style={styles.bookedBanner}>
              <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
              <Text style={styles.bookedBannerText}>You have a seat for this workshop.</Text>
            </View>
          ) : null} */}

          {/* ── Body ── */}
          <View style={styles.body}>

            {/* Price card — floats over hero */}
            <View style={styles.priceCard}>
              {/* <View style={styles.priceMain}>
                <Text style={styles.priceLabel}>Workshop fee</Text>
                <Text style={[styles.priceValue, fee.isFree && styles.priceValueFree]}>
                  {fee.label}
                </Text>
                {fee.detailLine != null ? (
                  <Text style={styles.priceDetailLine}>{fee.detailLine}</Text>
                ) : null}
              </View> */}
              <View style={styles.priceScheduleWrap}>
                {dateLabel.length > 0 && dateLabel !== '—' ? (
                  <View style={styles.priceScheduleRow}>
                    <View style={[styles.priceScheduleIcon, styles.priceScheduleIconDate]}>
                      <Ionicons name="calendar-outline" size={15} color="#2563EB" />
                    </View>
                    <View style={styles.priceScheduleTextWrap}>
                      <Text style={styles.priceScheduleLabel}>Date</Text>
                      <Text style={styles.priceScheduleValue} numberOfLines={2}>
                        {dateLabel}
                      </Text>
                    </View>
                  </View>
                ) : null}
                {timeLabel.length > 0 && timeLabel !== '—' ? (
                  <View style={[styles.priceScheduleRow, styles.priceScheduleRowLast]}>
                    <View style={[styles.priceScheduleIcon, styles.priceScheduleIconTime]}>
                      <Ionicons name="time-outline" size={15} color="#16A34A" />
                    </View>
                    <View style={styles.priceScheduleTextWrap}>
                      <Text style={styles.priceScheduleLabel}>Time</Text>
                      <Text style={styles.priceScheduleValue} numberOfLines={1}>
                        {timeLabel}
                      </Text>
                    </View>
                  </View>
                ) : null}
              </View>
            </View>

            {/* Tags */}
            {keywordTags.length > 0 && (
              <View style={styles.tagsRow}>
                {keywordTags.map((tag, i) => {
                  const palette = TAG_PALETTES[i % TAG_PALETTES.length];
                  return (
                    <View key={`${tag}-${i}`} style={[styles.tag, { backgroundColor: palette.bg }]}>
                      <Text style={[styles.tagText, { color: palette.text }]} numberOfLines={1}>
                        {tag}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}

            {/* What you'll learn */}
            {highlights.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>What you'll learn</Text>
                <View style={styles.learnList}>
                  {highlights.map((item, i) => (
                    <View key={`${item}-${i}`} style={styles.learnItem}>
                      <View style={styles.learnIcon}>
                        <Ionicons name="checkmark" size={14} color={COLORS.green} />
                      </View>
                      <Text style={styles.learnText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.scheduleCard}>
              <Text style={styles.cardTitle}>Venue</Text>
              <ScheduleRow
                icon={isOnlinePlace ? 'globe-outline' : 'location-outline'}
                iconColor="#F97316"
                iconBg="#FFF7ED"
                label="Location"
                value={locationLine}
                isLast={joinUrl == null && mapsUrl == null}
              />
              {joinUrl != null ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Join online"
                  onPress={() => openExternalUrl(joinUrl)}
                  style={({ pressed }) => [styles.actionLink, pressed && styles.pressed]}
                >
                  <Ionicons name="videocam-outline" size={16} color={THEME.colors.primary} />
                  <Text style={styles.actionLinkText}>Join online</Text>
                </Pressable>
              ) : null}
              {mapsUrl != null ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Open in maps"
                  onPress={() => openExternalUrl(mapsUrl)}
                  style={({ pressed }) => [styles.actionLink, pressed && styles.pressed]}
                >
                  <Ionicons name="map-outline" size={16} color={THEME.colors.primary} />
                  <Text style={styles.actionLinkText}>Open in Maps</Text>
                </Pressable>
              ) : null}
            </View>

            {/* Contact */}
            {contactNumber.length > 0 && (
              <View style={styles.contactCard}>
                <View style={styles.contactLeft}>
                  <View style={styles.contactIconWrap}>
                    <Ionicons name="call-outline" size={20} color={COLORS.white} />
                  </View>
                  <View style={styles.contactTextWrap}>
                    <Text style={styles.contactTitle}>Need help?</Text>
                    <Text style={styles.contactNumber} numberOfLines={1}>
                      {contactNumber}
                    </Text>
                  </View>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Call ${contactNumber}`}
                  onPress={onContactPress}
                  style={({ pressed }) => [styles.callButton, pressed && styles.pressed]}
                >
                  <Ionicons name="call" size={15} color={COLORS.black} style={styles.callIcon} />
                  <Text style={styles.callButtonText}>Call</Text>
                </Pressable>
              </View>
            )}
          </View>
        </ScrollView>

        {/* ── Sticky bottom bar ── */}
        <View
          style={[
            styles.bottomBar,
            { paddingBottom: Math.max(insets.bottom, 16) },
          ]}
        >
          <View style={styles.bottomBarLeft}>
            <Text style={styles.bottomPriceLabel}>Workshop fee</Text>
            <Text style={[styles.bottomPrice, fee.isFree && styles.priceValueFree]}>
              {fee.label}
            </Text>
            {/* {bottomMeta.length > 0 ? (
              <Text style={styles.bottomMeta} numberOfLines={1}>
                {bottomMeta}
              </Text>
            ) : null} */}
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={bookCtaLabel}
            disabled={!canBook}
            onPress={onBookPress}
            style={({ pressed }) => [
              styles.bookButton,
              !canBook && styles.bookButtonDisabled,
              pressed && canBook ? styles.pressed : null,
            ]}
          >
            {isBooking ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <>
                <Ionicons
                  name={isBooked ? 'checkmark-circle' : 'calendar'}
                  size={17}
                  color={COLORS.white}
                  style={styles.bookButtonIcon}
                />
                <Text style={styles.bookButtonText}>{bookCtaLabel}</Text>
              </>
            )}
          </Pressable>
        </View>

        <WorkshopBookingPaymentModal
          visible={paymentModalVisible}
          workshopName={workshop.name}
          amountRupees={bookAmountRupees}
          walletBalanceRupees={walletBalanceRupees}
          canPayWithWallet={canPayWithWallet}
          payingWith={payingWith}
          isBusy={isBooking}
          onClose={closePaymentModal}
          onPayRazorpay={onPayRazorpay}
          onPayWallet={onPayWallet}
        />
      </ScreenWrapper>
    </SafeAreaWrapper>
  );
}

// ─── ScheduleRow ──────────────────────────────────────────────────────────────

interface ScheduleRowProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  iconBg: string;
  label: string;
  value: string;
  isLast?: boolean;
}

function WorkshopDetailsSkeleton(): React.ReactElement {
  return (
    <View style={styles.skeletonRoot}>
      <View style={styles.skeletonHero} />
      <View style={styles.skeletonBody}>
        <View style={styles.skeletonLineWide} />
        <View style={styles.skeletonCard} />
        <View style={styles.skeletonLine} />
        <View style={styles.skeletonLine} />
        <View style={styles.skeletonCardTall} />
      </View>
    </View>
  );
}

function ScheduleRow({
  icon,
  iconColor,
  iconBg,
  label,
  value,
  isLast = false,
}: ScheduleRowProps): React.ReactElement {
  return (
    <View style={[styles.infoRow, !isLast && styles.infoRowBorder]}>
      <View style={[styles.infoIconWrap, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <View style={styles.infoTextWrap}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screenBg: {
    flex: 1,
    backgroundColor: COLORS.screenBg,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // ── Guard states ────────────────────────────────
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: H_PADDING,
    gap: 12,
    backgroundColor: COLORS.white,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  errorBody: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  outlineButton: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  outlineButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.colors.primary,
  },
  primaryButton: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: THEME.colors.primary,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.colors.white,
  },
  pressed: {
    opacity: 0.82,
  },
  skeletonRoot: {
    flex: 1,
    backgroundColor: COLORS.screenBg,
  },
  skeletonHero: {
    height: HERO_HEIGHT,
    backgroundColor: '#E2E8F0',
  },
  skeletonBody: {
    padding: H_PADDING,
    gap: 12,
    marginTop: 12,
  },
  skeletonLineWide: {
    height: 72,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
  },
  skeletonCard: {
    height: 88,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  },
  skeletonLine: {
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
    width: '80%',
  },
  skeletonCardTall: {
    height: 120,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  },

  // ── Hero ────────────────────────────────────────
  heroWrap: {
    height: HERO_HEIGHT,
    backgroundColor: '#1E3A5F',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },

  // Floating action buttons
  fab: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.25)',
    // Subtle backdrop blur on iOS
    ...Platform.select({
      ios: {
        backdropFilter: 'blur(8px)',
      },
      default: {},
    }),
  },

  heroContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: H_PADDING,
    paddingBottom: 22,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#22C55E',
    marginRight: 7,
  },
  liveText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.28)',
  },
  typeBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'capitalize',
  },
  heroTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600',
    color: COLORS.white,
    letterSpacing: -0.3,
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  heroTitleBackdrop: {
    alignSelf: 'stretch',
    paddingHorizontal: H_PADDING,
    paddingTop: 10,
    paddingBottom: 22,
    marginHorizontal: -H_PADDING,
    marginBottom: -22,
  },
  // ── Body ────────────────────────────────────────
  body: {
    paddingHorizontal: H_PADDING,
    marginTop: 5,
  },
  descriptionBelowHero: {
    marginHorizontal: H_PADDING,
    marginTop: 12,
    marginBottom: 4,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
  },
  descriptionBelowHeroLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  descriptionBelowHeroText: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.textSecondary,
  },
  pastBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: H_PADDING,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FFFBEB',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#FDE68A',
  },
  pastBannerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#92400E',
  },
  bookedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: H_PADDING,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.greenLight,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#A7F3D0',
  },
  bookedBannerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#166534',
  },

  // Price card
  priceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    gap: 12,
    marginBottom: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.07,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 4 },
      },
      default: { elevation: 3 },
    }),
  },
  priceMain: {
    flexShrink: 0,
    justifyContent: 'center',
  },
  priceLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  priceValue: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  priceValueFree: {
    color: '#16A34A',
  },
  priceDetailLine: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  priceScheduleWrap: {
    flex: 1,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: COLORS.border,
    paddingLeft: 12,
    gap: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceScheduleRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 8,
  },
  priceScheduleRowLast: {
    marginBottom: 0,
  },
  priceScheduleIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceScheduleIconDate: {
    backgroundColor: '#EFF6FF',
  },
  priceScheduleIconTime: {
    backgroundColor: COLORS.greenLight,
  },
  priceScheduleTextWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  priceScheduleLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  priceScheduleValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    lineHeight: 18,
  },

  // Sections
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 10,
  },

  // Tags
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
  },

  // Learn list
  learnList: {
    gap: 12,
  },
  learnItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  learnIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.greenLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 1,
    flexShrink: 0,
  },
  learnText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
    lineHeight: 22,
  },

  // Schedule card
  scheduleCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  infoIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  infoTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  infoLabel: {
    fontSize: 11,
    color: COLORS.textTertiary,
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },

  // Contact card
  actionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceBg,
  },
  actionLinkText: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  contactCard: {
    backgroundColor: COLORS.black,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  contactTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  callIcon: {
    marginRight: 5,
  },
  contactIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  contactTitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 3,
  },
  contactNumber: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginLeft: 10,
    flexShrink: 0,
  },
  callButtonText: {
    color: COLORS.black,
    fontSize: 14,
    fontWeight: '700',
  },

  // Bottom bar
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.white,
    paddingHorizontal: H_PADDING,
    paddingTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: -3 },
      },
      default: { elevation: 8 },
    }),
  },
  bottomBarLeft: {
    flex: 1,
    minWidth: 0,
    marginRight: 12,
  },
  bottomPriceLabel: {
    fontSize: 11,
    color: COLORS.textTertiary,
    marginBottom: 3,
  },
  bottomPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  bottomMeta: {
    marginTop: 2,
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    paddingHorizontal: 24,
    borderRadius: 14,
    backgroundColor: THEME.colors.primary,
    justifyContent: 'center',
  },
  bookButtonIcon: {
    marginRight: 7,
  },
  bookButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  bookButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});