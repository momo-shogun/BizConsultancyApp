import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { THEME } from '@/constants/theme';
import { usePublicWorkshopDetail } from '@/features/Home/hooks/usePublicWorkshopDetail';
import {
  formatWorkshopDateRange,
  formatWorkshopLongDate,
  formatWorkshopTimeRange,
  formatWorkshopTypeLabel,
  parseWorkshopHighlightPoints,
  parseWorkshopKeywords,
  resolveWorkshopFee,
} from '@/features/Home/utils/workshopDetailUtils';
import { ROUTES } from '@/navigation/routeNames';
import type { RootStackParamList } from '@/navigation/types';
import { RemoteImage, SafeAreaWrapper, ScreenHeader, ScreenWrapper } from '@/shared/components';
import { resolveAwsImageUrl } from '@/utils/awsImageUrl';

const H_PADDING = THEME.spacing[16];
const SCREEN_BG = '#F8FAFC';
const HERO_HEIGHT = 320;

type WorkshopDetailRoute = RouteProp<RootStackParamList, typeof ROUTES.Root.WorkshopsDetail>;

const TAG_PALETTES = [
  { bg: '#DBEAFE', text: '#2563EB' },
  { bg: '#DCFCE7', text: '#16A34A' },
  { bg: '#F3E8FF', text: '#9333EA' },
  { bg: '#FEF3C7', text: '#D97706' },
] as const;

function openPhoneDialer(phone: string): void {
  const digits = phone.replace(/\s/g, '');
  if (digits.length === 0) {
    return;
  }
  void Linking.openURL(`tel:${digits}`);
}

export default function WorkshopDetailsScreen(): React.ReactElement {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<WorkshopDetailRoute>();
  const insets = useSafeAreaInsets();

  const slug = route.params.slug;
  const { workshop, isLoading, isError } = usePublicWorkshopDetail(slug);

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

  const scheduleMeta = useMemo((): string => {
    if (workshop == null) {
      return '';
    }
    const parts = [
      formatWorkshopDateRange(workshop.startDate, workshop.endDate),
      workshop.place?.trim() ?? 'Online',
      formatWorkshopTimeRange(workshop.startTime, workshop.endTime),
    ].filter((part) => part !== '—' && part.length > 0);
    return parts.join(' · ');
  }, [workshop]);

  const locationLine = useMemo((): string => {
    if (workshop == null) {
      return '—';
    }
    const place = workshop.place?.trim();
    const map = workshop.mapLocation?.trim();
    if (place != null && place.length > 0 && map != null && map.length > 0) {
      return `${place} — ${map}`;
    }
    return place ?? map ?? 'Online';
  }, [workshop]);

  const onBackToList = useCallback((): void => {
    navigation.navigate(ROUTES.Root.WorkshopsList);
  }, [navigation]);

  const onContactPress = useCallback((): void => {
    const phone = workshop?.contactNumber?.trim();
    if (phone != null && phone.length > 0) {
      openPhoneDialer(phone);
    }
  }, [workshop?.contactNumber]);

  if (slug.trim().length === 0) {
    return (
      <SafeAreaWrapper edges={['top']}>
        <ScreenHeader title="Workshop" onBackPress={() => navigation.goBack()} />
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>Invalid workshop</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to workshops"
            onPress={onBackToList}
            style={({ pressed }) => [styles.retryButton, pressed ? styles.pressed : null]}
          >
            <Text style={styles.retryButtonText}>Back to workshops</Text>
          </Pressable>
        </View>
      </SafeAreaWrapper>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaWrapper edges={['top']}>
        <ScreenHeader title="Workshop" onBackPress={() => navigation.goBack()} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={THEME.colors.primary} />
          <Text style={styles.loadingText}>Loading workshop…</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  if (isError || workshop == null || fee == null) {
    return (
      <SafeAreaWrapper edges={['top']}>
        <ScreenHeader title="Workshop" onBackPress={() => navigation.goBack()} />
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>Workshop not found</Text>
          <Text style={styles.errorBody}>This workshop may have been removed or is unavailable.</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to workshops"
            onPress={onBackToList}
            style={({ pressed }) => [styles.retryButton, pressed ? styles.pressed : null]}
          >
            <Text style={styles.retryButtonText}>Back to workshops</Text>
          </Pressable>
        </View>
      </SafeAreaWrapper>
    );
  }

  const showLiveBadge = workshop.isLiveWorkshop === 1;
  const contactNumber = workshop.contactNumber?.trim() ?? '';

  return (
    <SafeAreaWrapper edges={['top']}>
      <ScreenHeader title="Workshop" onBackPress={() => navigation.goBack()} />

      <ScreenWrapper style={styles.screenBg}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: THEME.spacing[24] + insets.bottom + 88 },
          ]}
        >
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
            <LinearGradient
              colors={['transparent', 'rgba(15,23,42,0.75)']}
              style={styles.heroGradient}
              pointerEvents="none"
            />
            <View style={styles.heroContent}>
              {showLiveBadge ? (
                <View style={styles.liveBadge}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>Live workshop</Text>
                </View>
              ) : null}
              {workshop.type.trim().length > 0 ? (
                <View style={styles.typeBadge}>
                  <Text style={styles.typeBadgeText}>{formatWorkshopTypeLabel(workshop.type)}</Text>
                </View>
              ) : null}
              {scheduleMeta.length > 0 ? (
                <Text style={styles.heroMeta} numberOfLines={2}>
                  {scheduleMeta}
                </Text>
              ) : null}
              <Text style={styles.heroTitle}>{workshop.name}</Text>
              {workshop.description != null && workshop.description.trim().length > 0 ? (
                <Text style={styles.heroSubtitle} numberOfLines={3}>
                  {workshop.description.trim()}
                </Text>
              ) : null}
            </View>
          </View>

          <View style={styles.body}>
            <View style={styles.priceCard}>
              <View>
                <Text style={styles.priceLabel}>Workshop fee</Text>
                <Text style={[styles.priceValue, fee.isFree ? styles.priceValueFree : null]}>
                  {fee.label}
                </Text>
              </View>
              <View style={styles.priceIcon}>
                <Ionicons name="flash-outline" size={22} color="#0F172A" />
              </View>
            </View>

            {workshop.description != null && workshop.description.trim().length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>About this workshop</Text>
                <Text style={styles.description}>{workshop.description.trim()}</Text>
              </View>
            ) : null}

            {keywordTags.length > 0 ? (
              <View style={styles.tagsRow}>
                {keywordTags.map((tag, index) => {
                  const palette = TAG_PALETTES[index % TAG_PALETTES.length];
                  return (
                    <View key={`${tag}-${index}`} style={[styles.tag, { backgroundColor: palette.bg }]}>
                      <Text style={[styles.tagText, { color: palette.text }]} numberOfLines={1}>
                        {tag}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ) : null}

            {highlights.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>What you'll learn</Text>
                <View style={styles.learnList}>
                  {highlights.map((item, index) => (
                    <View key={`${item}-${index}`} style={styles.learnItem}>
                      <View style={styles.learnIcon}>
                        <Ionicons name="checkmark" size={14} color="#10B981" />
                      </View>
                      <Text style={styles.learnText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}

            <View style={styles.scheduleCard}>
              <Text style={styles.cardTitle}>Venue & schedule</Text>
              <ScheduleRow
                icon="calendar-outline"
                iconColor="#2563EB"
                label="Date"
                value={formatWorkshopLongDate(workshop.startDate)}
              />
              <ScheduleRow
                icon="time-outline"
                iconColor="#10B981"
                label="Time"
                value={formatWorkshopTimeRange(workshop.startTime, workshop.endTime)}
              />
              <ScheduleRow
                icon="location-outline"
                iconColor="#F97316"
                label="Location"
                value={locationLine}
              />
            </View>

            {contactNumber.length > 0 ? (
              <View style={styles.contactCard}>
                <View style={styles.contactLeft}>
                  <View style={styles.contactIcon}>
                    <Ionicons name="call-outline" size={20} color={THEME.colors.white} />
                  </View>
                  <View>
                    <Text style={styles.contactTitle}>Need help?</Text>
                    <Text style={styles.contactNumber}>{contactNumber}</Text>
                  </View>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Call ${contactNumber}`}
                  onPress={onContactPress}
                  style={({ pressed }) => [styles.chatButton, pressed ? styles.pressed : null]}
                >
                  <Text style={styles.chatButtonText}>Call</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        </ScrollView>

        <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, THEME.spacing[16]) }]}>
          <View>
            <Text style={styles.bottomPriceLabel}>Workshop fee</Text>
            <Text style={[styles.bottomPrice, fee.isFree ? styles.priceValueFree : null]}>
              {fee.label}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Book workshop"
            style={({ pressed }) => [styles.bookButton, pressed ? styles.pressed : null]}
          >
            <Text style={styles.bookButtonText}>Book now</Text>
          </Pressable>
        </View>
      </ScreenWrapper>
    </SafeAreaWrapper>
  );
}

interface ScheduleRowProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  label: string;
  value: string;
}

function ScheduleRow({ icon, iconColor, label, value }: ScheduleRowProps): React.ReactElement {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <View style={styles.infoTextWrap}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenBg: {
    flex: 1,
    backgroundColor: SCREEN_BG,
  },
  scrollContent: {
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: H_PADDING,
    gap: THEME.spacing[12],
  },
  loadingText: {
    fontSize: THEME.typography.size[14],
    color: THEME.colors.textSecondary,
  },
  errorTitle: {
    fontSize: THEME.typography.size[18],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
    textAlign: 'center',
  },
  errorBody: {
    fontSize: THEME.typography.size[14],
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
    marginTop: THEME.spacing[8],
    paddingHorizontal: THEME.spacing[16],
    paddingVertical: THEME.spacing[10],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.white,
  },
  retryButtonText: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.primary,
  },
  pressed: {
    opacity: 0.88,
  },
  heroWrap: {
    height: HERO_HEIGHT,
    backgroundColor: '#0F172A',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: H_PADDING,
    paddingBottom: THEME.spacing[20],
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: 7,
    borderRadius: 30,
    marginBottom: THEME.spacing[10],
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
    marginRight: THEME.spacing[8],
  },
  liveText: {
    color: THEME.colors.white,
    fontSize: 13,
    fontWeight: THEME.typography.weight.semibold as '600',
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: THEME.spacing[8],
  },
  typeBadgeText: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 11,
    fontWeight: THEME.typography.weight.semibold as '600',
    textTransform: 'capitalize',
  },
  heroMeta: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: THEME.spacing[6],
  },
  heroTitle: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.white,
    marginBottom: THEME.spacing[8],
  },
  heroSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.88)',
  },
  body: {
    paddingHorizontal: H_PADDING,
    marginTop: -THEME.spacing[20],
  },
  priceCard: {
    backgroundColor: THEME.colors.white,
    borderRadius: 20,
    padding: THEME.spacing[16],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing[20],
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
      },
      default: { elevation: 3 },
    }),
  },
  priceLabel: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 6,
  },
  priceValue: {
    fontSize: 26,
    fontWeight: THEME.typography.weight.bold as '700',
    color: '#0F172A',
  },
  priceValueFree: {
    color: '#388E3C',
  },
  priceIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: THEME.spacing[20],
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: THEME.typography.weight.bold as '700',
    color: '#0F172A',
    marginBottom: THEME.spacing[10],
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: '#64748B',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing[8],
    marginBottom: THEME.spacing[20],
  },
  tag: {
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[8],
    borderRadius: 12,
  },
  tagText: {
    fontSize: 13,
    fontWeight: THEME.typography.weight.bold as '700',
  },
  learnList: {
    gap: THEME.spacing[12],
  },
  learnItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  learnIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.spacing[12],
    marginTop: 1,
  },
  learnText: {
    flex: 1,
    fontSize: 15,
    fontWeight: THEME.typography.weight.semibold as '600',
    color: '#334155',
    lineHeight: 22,
  },
  scheduleCard: {
    backgroundColor: THEME.colors.white,
    borderRadius: 20,
    padding: THEME.spacing[16],
    marginBottom: THEME.spacing[16],
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: THEME.typography.weight.bold as '700',
    color: '#0F172A',
    marginBottom: THEME.spacing[16],
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing[14],
  },
  infoIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.spacing[12],
  },
  infoTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  infoLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: THEME.typography.weight.bold as '700',
    color: '#0F172A',
  },
  contactCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: THEME.spacing[16],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.spacing[12],
  },
  contactTitle: {
    color: '#CBD5E1',
    fontSize: 13,
    marginBottom: 4,
  },
  contactNumber: {
    color: THEME.colors.white,
    fontSize: 16,
    fontWeight: THEME.typography.weight.bold as '700',
  },
  chatButton: {
    backgroundColor: THEME.colors.white,
    paddingHorizontal: THEME.spacing[16],
    paddingVertical: 10,
    borderRadius: 12,
    marginLeft: THEME.spacing[8],
  },
  chatButtonText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: THEME.typography.weight.bold as '700',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: THEME.colors.white,
    paddingHorizontal: H_PADDING,
    paddingTop: THEME.spacing[12],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E2E8F0',
  },
  bottomPriceLabel: {
    fontSize: 12,
    color: '#94A3B8',
  },
  bottomPrice: {
    fontSize: 24,
    fontWeight: THEME.typography.weight.bold as '700',
    color: '#0F172A',
  },
  bookButton: {
    minHeight: 52,
    paddingHorizontal: THEME.spacing[24],
    borderRadius: 14,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonText: {
    color: THEME.colors.white,
    fontSize: 16,
    fontWeight: THEME.typography.weight.bold as '700',
  },
});
