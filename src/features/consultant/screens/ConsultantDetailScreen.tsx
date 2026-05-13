import React, { useCallback, useMemo } from 'react';
import {
  Image,
  ImageBackground,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { THEME } from '@/constants/theme';
import { getConsultantDetail } from '@/features/consultant/data/consultantDetailDemo';
import type { ConsultantDetail, ConsultantExpertTalk } from '@/features/consultant/types/consultantDetail.types';
import { ROUTES } from '@/navigation/routeNames';
import type { RootStackParamList } from '@/navigation/types';
import { SafeAreaWrapper, ScreenHeader, ScreenWrapper } from '@/shared/components';
import { youtubeEmbedToWatchUrl } from '@/utils/youtubeUrl';

const H_PADDING = THEME.spacing[12];
const HERO_HEIGHT = 268;

function isMeaningfulText(value: string | null | undefined): boolean {
  if (value == null || value.trim().length === 0) {
    return false;
  }
  const t = value.trim().toLowerCase();
  return t !== 'none' && t !== 'null';
}

function formatRupee(amount: number): string {
  if (amount <= 0) {
    return '—';
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

function openExternalUrl(url: string): void {
  const trimmed = url.trim();
  if (trimmed.length === 0) {
    return;
  }
  void Linking.openURL(trimmed);
}

type ConsultantDetailRoute = RouteProp<RootStackParamList, typeof ROUTES.Root.ConsultantDetail>;

export function ConsultantDetailScreen(): React.ReactElement {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<ConsultantDetailRoute>();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const slug = route.params.slug;
  const detail = useMemo((): ConsultantDetail => getConsultantDetail(slug), [slug]);

  const talkCardWidth = useMemo((): number => Math.min(280, Math.round(width * 0.72)), [width]);

  const locationLine = useMemo((): string => {
    const parts: string[] = [];
    if (isMeaningfulText(detail.city)) parts.push(detail.city);
    if (isMeaningfulText(detail.state)) parts.push(detail.state);
    if (isMeaningfulText(detail.pincode)) parts.push(detail.pincode);
    return parts.join(' · ');
  }, [detail.city, detail.pincode, detail.state]);

  const onOpenIntroVideo = useCallback((): void => {
    openExternalUrl(youtubeEmbedToWatchUrl(detail.expertVideoUrl));
  }, [detail.expertVideoUrl]);

  const onOpenTalk = useCallback((talk: ConsultantExpertTalk): void => {
    openExternalUrl(youtubeEmbedToWatchUrl(talk.url));
  }, []);

  const onOpenWebsite = useCallback((): void => {
    const w = detail.profile.websiteUrl;
    if (isMeaningfulText(w)) {
      openExternalUrl(w ?? '');
    }
  }, [detail.profile.websiteUrl]);

  const showRates = detail.audioRate > 0 || detail.videoRate > 0;
  const isKnownProfile = detail.slug === 'r-k-saxena';

  return (
    <SafeAreaWrapper edges={['top']}>
      <ScreenHeader title="Consultant" onBackPress={() => navigation.goBack()} />

      <ScreenWrapper style={styles.screenBg}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: THEME.spacing[20] + insets.bottom + 72 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroWrap}>
            <ImageBackground
              source={{ uri: detail.image }}
              style={styles.heroImage}
              resizeMode="cover"
            >
              <LinearGradient
                colors={['rgba(11,15,25,0.05)', 'rgba(11,15,25,0.55)', 'rgba(11,15,25,0.92)']}
                locations={[0, 0.45, 1]}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.heroInner}>
                <View style={styles.heroTitleRow}>
                  <Text style={styles.heroName} numberOfLines={2}>
                    {detail.name}
                  </Text>
                  {detail.verified ? (
                    <View style={styles.verifiedPill} accessibilityLabel="Verified consultant">
                      <Ionicons name="checkmark-circle" size={18} color={THEME.colors.accentGreen} />
                      <Text style={styles.verifiedText}>Verified</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={styles.heroRole} numberOfLines={2}>
                  {detail.title}
                  {detail.expertise ? ` · ${detail.expertise}` : ''}
                </Text>
                {locationLine.length > 0 ? (
                  <View style={styles.heroMetaRow}>
                    <Ionicons name="location-outline" size={16} color="rgba(255,255,255,0.88)" />
                    <Text style={styles.heroMeta} numberOfLines={1}>
                      {locationLine}
                    </Text>
                  </View>
                ) : null}
              </View>
            </ImageBackground>
          </View>

          <View style={[styles.sheet, { marginTop: -THEME.spacing[16] }]}>
            {showRates ? (
              <View style={styles.rateRow}>
                <View style={styles.ratePill}>
                  <Text style={styles.rateLabel}>Audio</Text>
                  <Text style={styles.rateValue}>{formatRupee(detail.audioRate)}</Text>
                </View>
                <View style={styles.ratePill}>
                  <Text style={styles.rateLabel}>Video</Text>
                  <Text style={styles.rateValue}>{formatRupee(detail.videoRate)}</Text>
                </View>
                <View style={styles.ratePill}>
                  <Text style={styles.rateLabel}>Experience</Text>
                  <Text style={styles.rateValue} numberOfLines={1}>
                    {detail.experience}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.stubBanner}>
                <Ionicons name="information-circle-outline" size={20} color={THEME.colors.primary} />
                <Text style={styles.stubBannerText}>
                  Demo data: full rates appear for featured profiles. API wiring will populate this screen.
                </Text>
              </View>
            )}

            {isMeaningfulText(detail.profile.profileSummary) ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>About</Text>
                <Text style={styles.bodyText}>{detail.profile.profileSummary}</Text>
              </View>
            ) : null}

            {detail.skills.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Skills</Text>
                <View style={styles.chipWrap}>
                  {detail.skills.map((s) => (
                    <View key={s} style={styles.chip}>
                      <Text style={styles.chipText}>{s}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}

            {detail.industries.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Industries</Text>
                <View style={styles.chipWrap}>
                  {detail.industries.map((s) => (
                    <View key={s} style={[styles.chip, styles.chipMuted]}>
                      <Text style={styles.chipTextMuted}>{s}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}

            {detail.segments.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Segments</Text>
                <View style={styles.chipWrap}>
                  {detail.segments.map((s) => (
                    <View key={s} style={[styles.chip, styles.chipOutline]}>
                      <Text style={styles.chipTextOutline}>{s}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Professional profile</Text>
              <View style={styles.factsCard}>
                {isMeaningfulText(detail.profile.highestQualification) ? (
                  <FactRow icon="school-outline" label="Qualification" value={detail.profile.highestQualification ?? ''} />
                ) : null}
                {isMeaningfulText(detail.profile.speakIn) ? (
                  <FactRow icon="chatbubbles-outline" label="Speaks" value={detail.profile.speakIn ?? ''} />
                ) : null}
                {isMeaningfulText(detail.gender) ? (
                  <FactRow icon="person-outline" label="Gender" value={detail.gender} />
                ) : null}
                {isMeaningfulText(detail.category) ? (
                  <FactRow icon="briefcase-outline" label="Focus" value={detail.category} />
                ) : null}
                {isMeaningfulText(detail.profile.address) ? (
                  <FactRow icon="home-outline" label="Address" value={detail.profile.address ?? ''} />
                ) : null}
                {isMeaningfulText(detail.profile.websiteUrl) ? (
                  <Pressable
                    onPress={onOpenWebsite}
                    style={({ pressed }) => [styles.websiteRow, pressed && styles.websiteRowPressed]}
                    accessibilityRole="link"
                    accessibilityLabel="Open website"
                  >
                    <Ionicons name="globe-outline" size={20} color={THEME.colors.primary} />
                    <View style={styles.websiteTextCol}>
                      <Text style={styles.factLabel}>Website</Text>
                      <Text style={styles.websiteUrl} numberOfLines={2}>
                        {detail.profile.websiteUrl}
                      </Text>
                    </View>
                    <Ionicons name="open-outline" size={18} color={THEME.colors.textSecondary} />
                  </Pressable>
                ) : null}
                {!isKnownProfile && !isMeaningfulText(detail.profile.highestQualification) ? (
                  <Text style={styles.factsEmpty}>More fields will appear when the API is connected.</Text>
                ) : null}
              </View>
            </View>

            {isMeaningfulText(detail.expertVideoUrl) ? (
              <Pressable
                onPress={onOpenIntroVideo}
                style={({ pressed }) => [styles.introCard, pressed && styles.introCardPressed]}
                accessibilityRole="button"
                accessibilityLabel="Watch expert introduction on YouTube"
              >
                <LinearGradient
                  colors={['#0F5132', '#146E5C', '#0B3D2C']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.introGradient}
                >
                  <View style={styles.introIconWrap}>
                    <Ionicons name="play" size={22} color={THEME.colors.white} />
                  </View>
                  <View style={styles.introTextCol}>
                    <Text style={styles.introTitle}>Expert introduction</Text>
                    <Text style={styles.introSubtitle}>Watch on YouTube</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={22} color="rgba(255,255,255,0.85)" />
                </LinearGradient>
              </Pressable>
            ) : null}

            {detail.expertTalks.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Expert talks</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.talksScroll}
                >
                  {detail.expertTalks.map((talk) => (
                    <Pressable
                      key={talk.id}
                      onPress={() => onOpenTalk(talk)}
                      style={({ pressed }) => [
                        styles.talkCard,
                        { width: talkCardWidth },
                        pressed && styles.talkCardPressed,
                      ]}
                      accessibilityRole="button"
                      accessibilityLabel={`Play talk: ${talk.title}`}
                    >
                      <View style={styles.talkMedia}>
                        <Image source={{ uri: talk.thumbnail }} style={styles.talkThumb} resizeMode="cover" />
                        <LinearGradient
                          colors={['transparent', 'rgba(11,15,25,0.88)']}
                          style={styles.talkThumbGrad}
                        />
                        <View style={styles.talkDuration}>
                          <Ionicons name="time-outline" size={12} color={THEME.colors.white} />
                          <Text style={styles.talkDurationText}>{talk.duration} min</Text>
                        </View>
                        <Text style={styles.talkTitle} numberOfLines={2}>
                          {talk.title}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            ) : null}
          </View>
        </ScrollView>

        <View
          style={[
            styles.footer,
            {
              paddingBottom: Math.max(insets.bottom, THEME.spacing[12]),
              paddingTop: THEME.spacing[10],
            },
          ]}
        >
          <Pressable
            onPress={() => undefined}
            style={({ pressed }) => [styles.bookBtn, pressed && styles.bookBtnPressed]}
            accessibilityRole="button"
            accessibilityLabel="Book consultation"
          >
            <LinearGradient
              colors={[THEME.colors.primary, '#146E5C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.bookGradient}
            >
              <Text style={styles.bookLabel}>Book consultation</Text>
              <Ionicons name="arrow-forward" size={20} color={THEME.colors.white} />
            </LinearGradient>
          </Pressable>
        </View>
      </ScreenWrapper>
    </SafeAreaWrapper>
  );
}

interface FactRowProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
}

function FactRow(props: FactRowProps): React.ReactElement {
  return (
    <View style={styles.factRow}>
      <Ionicons name={props.icon} size={20} color={THEME.colors.textSecondary} />
      <View style={styles.factTextCol}>
        <Text style={styles.factLabel}>{props.label}</Text>
        <Text style={styles.factValue}>{props.value}</Text>
      </View>
    </View>
  );
}

export default ConsultantDetailScreen;

const styles = StyleSheet.create({
  screenBg: {
    backgroundColor: THEME.colors.surface,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: THEME.spacing[16],
  },
  heroWrap: {
    width: '100%',
    height: HERO_HEIGHT,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  heroInner: {
    paddingHorizontal: H_PADDING,
    paddingBottom: THEME.spacing[20],
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: THEME.spacing[8],
  },
  heroName: {
    flex: 1,
    fontSize: THEME.typography.size[28],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.onImageTextPrimary,
    letterSpacing: -0.3,
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: THEME.spacing[8],
    paddingVertical: 4,
    borderRadius: THEME.radius[16],
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  verifiedText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.onImageTextSecondary,
  },
  heroRole: {
    marginTop: THEME.spacing[8],
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.medium as '500',
    color: THEME.colors.onImageTextSecondary,
  },
  heroMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: THEME.spacing[8],
  },
  heroMeta: {
    flex: 1,
    fontSize: THEME.typography.size[14],
    color: 'rgba(255,255,255,0.88)',
  },
  sheet: {
    marginHorizontal: H_PADDING,
    borderRadius: THEME.radius[16],
    backgroundColor: THEME.colors.white,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    padding: THEME.spacing[14],
    paddingTop: THEME.spacing[16],
  },
  rateRow: {
    flexDirection: 'row',
    gap: THEME.spacing[8],
    marginBottom: THEME.spacing[4],
  },
  ratePill: {
    flex: 1,
    minWidth: 0,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius[12],
    paddingVertical: THEME.spacing[10],
    paddingHorizontal: THEME.spacing[8],
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  rateLabel: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium as '500',
    color: THEME.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  rateValue: {
    marginTop: 4,
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
  },
  stubBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: THEME.spacing[8],
    padding: THEME.spacing[10],
    borderRadius: THEME.radius[12],
    backgroundColor: 'rgba(15,81,50,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(15,81,50,0.12)',
    marginBottom: THEME.spacing[4],
  },
  stubBannerText: {
    flex: 1,
    fontSize: THEME.typography.size[14],
    lineHeight: 19,
    color: THEME.colors.textSecondary,
  },
  section: {
    marginTop: THEME.spacing[16],
  },
  sectionTitle: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: THEME.spacing[8],
  },
  bodyText: {
    fontSize: THEME.typography.size[16],
    lineHeight: 23,
    color: THEME.colors.textPrimary,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing[8],
  },
  chip: {
    paddingHorizontal: THEME.spacing[10],
    paddingVertical: 6,
    borderRadius: THEME.radius[12],
    backgroundColor: 'rgba(15,81,50,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(15,81,50,0.14)',
  },
  chipText: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.medium as '500',
    color: THEME.colors.primary,
  },
  chipMuted: {
    backgroundColor: THEME.colors.surface,
    borderColor: THEME.colors.border,
  },
  chipTextMuted: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.medium as '500',
    color: THEME.colors.textPrimary,
  },
  chipOutline: {
    backgroundColor: THEME.colors.white,
    borderColor: THEME.colors.border,
  },
  chipTextOutline: {
    fontSize: THEME.typography.size[14],
    color: THEME.colors.textSecondary,
  },
  factsCard: {
    borderRadius: THEME.radius[12],
    backgroundColor: THEME.colors.surface,
    padding: THEME.spacing[12],
    gap: THEME.spacing[12],
  },
  factRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: THEME.spacing[10],
  },
  factTextCol: {
    flex: 1,
    minWidth: 0,
  },
  factLabel: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium as '500',
    color: THEME.colors.textSecondary,
  },
  factValue: {
    marginTop: 2,
    fontSize: THEME.typography.size[16],
    color: THEME.colors.textPrimary,
    lineHeight: 21,
  },
  websiteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[10],
    paddingVertical: THEME.spacing[4],
  },
  websiteRowPressed: {
    opacity: 0.85,
  },
  websiteTextCol: {
    flex: 1,
    minWidth: 0,
  },
  websiteUrl: {
    marginTop: 2,
    fontSize: THEME.typography.size[14],
    color: THEME.colors.primary,
    fontWeight: THEME.typography.weight.medium as '500',
  },
  factsEmpty: {
    fontSize: THEME.typography.size[14],
    color: THEME.colors.textSecondary,
    lineHeight: 19,
  },
  introCard: {
    marginTop: THEME.spacing[16],
    borderRadius: THEME.radius[16],
    overflow: 'hidden',
  },
  introCardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.992 }],
  },
  introGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: THEME.spacing[14],
    paddingHorizontal: THEME.spacing[14],
    gap: THEME.spacing[12],
  },
  introIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  introTextCol: {
    flex: 1,
    minWidth: 0,
  },
  introTitle: {
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.white,
  },
  introSubtitle: {
    marginTop: 2,
    fontSize: THEME.typography.size[14],
    color: 'rgba(255,255,255,0.85)',
  },
  talksScroll: {
    gap: THEME.spacing[10],
    paddingRight: H_PADDING,
  },
  talkCard: {
    borderRadius: THEME.radius[16],
    overflow: 'hidden',
    backgroundColor: THEME.colors.black,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginRight: THEME.spacing[10],
  },
  talkCardPressed: {
    opacity: 0.92,
  },
  talkMedia: {
    width: '100%',
    aspectRatio: 16 / 10,
    position: 'relative',
  },
  talkThumb: {
    ...StyleSheet.absoluteFill,
  },
  talkThumbGrad: {
    ...StyleSheet.absoluteFill,
  },
  talkDuration: {
    position: 'absolute',
    top: THEME.spacing[8],
    right: THEME.spacing[8],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.radius[8],
  },
  talkDurationText: {
    fontSize: 11,
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.white,
  },
  talkTitle: {
    position: 'absolute',
    left: THEME.spacing[10],
    right: THEME.spacing[10],
    bottom: THEME.spacing[10],
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.white,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: H_PADDING,
    backgroundColor: THEME.colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: THEME.colors.border,
  },
  bookBtn: {
    borderRadius: THEME.radius[16],
    overflow: 'hidden',
  },
  bookBtnPressed: {
    opacity: 0.92,
  },
  bookGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing[8],
    paddingVertical: THEME.spacing[14],
  },
  bookLabel: {
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.white,
  },
});
