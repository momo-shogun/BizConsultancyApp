import React, { useCallback, useMemo } from 'react';
import {
  Image,
  Linking,
  Platform,
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
/** Cool neutral canvas with a hint of mint (pairs with hero gradient). */
const SCREEN_CANVAS = '#F4F8F6';
const SLATE_LINE = '#E2E8F0';
const SLATE_MUTED = '#64748B';
/** Max hero photo height so tablets do not get an oversized portrait block. */
const HERO_PHOTO_MAX = 420;

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

type ProfileFactItem =
  | {
      kind: 'row';
      id: string;
      icon: React.ComponentProps<typeof Ionicons>['name'];
      label: string;
      value: string;
    }
  | { kind: 'website'; id: string; url: string };

function collectProfileFacts(detail: ConsultantDetail): ProfileFactItem[] {
  const out: ProfileFactItem[] = [];
  if (isMeaningfulText(detail.profile.highestQualification)) {
    out.push({
      kind: 'row',
      id: 'qualification',
      icon: 'school-outline',
      label: 'Qualification',
      value: detail.profile.highestQualification as string,
    });
  }
  if (isMeaningfulText(detail.profile.speakIn)) {
    out.push({
      kind: 'row',
      id: 'speak',
      icon: 'chatbubbles-outline',
      label: 'Speaks',
      value: detail.profile.speakIn as string,
    });
  }
  if (isMeaningfulText(detail.gender)) {
    out.push({
      kind: 'row',
      id: 'gender',
      icon: 'person-outline',
      label: 'Gender',
      value: detail.gender,
    });
  }
  if (isMeaningfulText(detail.category)) {
    out.push({
      kind: 'row',
      id: 'focus',
      icon: 'briefcase-outline',
      label: 'Focus',
      value: detail.category,
    });
  }
  if (isMeaningfulText(detail.profile.address)) {
    out.push({
      kind: 'row',
      id: 'address',
      icon: 'home-outline',
      label: 'Address',
      value: detail.profile.address as string,
    });
  }
  if (isMeaningfulText(detail.profile.websiteUrl)) {
    out.push({ kind: 'website', id: 'website', url: detail.profile.websiteUrl as string });
  }
  return out;
}

interface ProfileFactsListProps {
  items: ProfileFactItem[];
  isKnownProfile: boolean;
  onOpenWebsite: () => void;
}

function SectionHeading(props: { children: string }): React.ReactElement {
  return (
    <View style={styles.sectionHeadingRow}>
      <View style={styles.sectionHeadingAccent} accessibilityElementsHidden />
      <Text style={styles.sectionTitle}>{props.children}</Text>
    </View>
  );
}

function ProfileFactsList(props: ProfileFactsListProps): React.ReactElement | null {
  const { items } = props;

  if (items.length === 0) {
    if (!props.isKnownProfile) {
      return <Text style={styles.factsEmpty}>More fields will appear when the API is connected.</Text>;
    }
    return null;
  }

  return (
    <View style={styles.factsCardInner}>
      {items.map((item, index) => {
        const showDivider = index < items.length - 1;
        const dividerStyle = showDivider ? styles.factRowDivider : null;
        if (item.kind === 'website') {
          return (
            <View key={item.id} style={dividerStyle}>
              <Pressable
                onPress={props.onOpenWebsite}
                style={({ pressed }) => [styles.websiteRow, pressed && styles.websiteRowPressed]}
                accessibilityRole="link"
                accessibilityLabel="Open website"
              >
                <Ionicons name="globe-outline" size={18} color={THEME.colors.primary} />
                <View style={styles.websiteTextCol}>
                  <Text style={styles.factLabel}>Website</Text>
                  <Text style={styles.websiteUrl} numberOfLines={2}>
                    {item.url}
                  </Text>
                </View>
                <Ionicons name="open-outline" size={16} color={THEME.colors.textSecondary} />
              </Pressable>
            </View>
          );
        }
        return (
          <View key={item.id} style={dividerStyle}>
            <FactRow icon={item.icon} label={item.label} value={item.value} />
          </View>
        );
      })}
    </View>
  );
}

export function ConsultantDetailScreen(): React.ReactElement {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<ConsultantDetailRoute>();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const slug = route.params.slug;
  const detail = useMemo((): ConsultantDetail => getConsultantDetail(slug), [slug]);

  const talkCardWidth = useMemo((): number => Math.min(252, Math.round(width * 0.66)), [width]);

  /** Portrait-friendly height: full image fits inside with `resizeMode="contain"`. */
  const heroPhotoHeight = useMemo((): number => Math.min(Math.round(width * 1.12), HERO_PHOTO_MAX), [width]);

  const expertiseCount =
    detail.skills.length + detail.industries.length + detail.segments.length;

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

  const profileFactItems = useMemo(() => collectProfileFacts(detail), [detail]);
  const showCredentialsSection = profileFactItems.length > 0 || !isKnownProfile;

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
          <View style={styles.heroBlock}>
            <LinearGradient
              colors={['#DCFCE7', '#E0E7FF', '#F8FAFC']}
              locations={[0, 0.45, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={[styles.heroPhotoFrame, { height: heroPhotoHeight }]}>
              <Image
                source={{ uri: detail.image }}
                style={styles.heroPhoto}
                resizeMode="contain"
                accessibilityLabel={`Portrait of ${detail.name}`}
              />
            </View>
            <View style={styles.heroIdentity}>
              <View style={styles.heroTitleRow}>
                <Text style={styles.heroNameDark} numberOfLines={2}>
                  {detail.name}
                </Text>
                {detail.verified ? (
                  <View style={styles.verifiedPillDark} accessibilityLabel="Verified consultant">
                    <Ionicons name="checkmark-circle" size={16} color={THEME.colors.primary} />
                    <Text style={styles.verifiedTextDark}>Verified</Text>
                  </View>
                ) : null}
              </View>
              <Text style={styles.heroRoleDark} numberOfLines={2}>
                {detail.title}
                {detail.expertise ? ` · ${detail.expertise}` : ''}
              </Text>
              {detail.type ? (
                <View style={styles.heroTrustRowDark}>
                  <Ionicons name="ribbon-outline" size={14} color={THEME.colors.primary} />
                  <Text style={styles.heroTrustTextDark} numberOfLines={1}>
                    {detail.type === 'professional' ? 'Professional expert' : detail.type}
                  </Text>
                </View>
              ) : null}
              {locationLine.length > 0 ? (
                <View style={styles.heroMetaRowDark}>
                  <Ionicons name="location-outline" size={16} color="#0D9488" />
                  <Text style={styles.heroMetaDark} numberOfLines={1}>
                    {locationLine}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          <View style={[styles.sheet, { marginTop: -THEME.spacing[12] }]}>
            <View style={styles.sheetAccentWrap} accessibilityElementsHidden>
              <LinearGradient
                colors={[THEME.colors.primary, '#1D6B4A', '#0B3D2C']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.sheetAccentBar}
              />
            </View>
            {showRates ? (
              <View style={styles.rateStrip}>
                <View style={[styles.rateCell, styles.rateCellAudio]}>
                  <Ionicons name="mic-outline" size={14} color="#166534" style={styles.rateIcon} />
                  <Text style={styles.rateLabelAudio}>Audio</Text>
                  <Text style={styles.rateValueAudio}>{formatRupee(detail.audioRate)}</Text>
                </View>
                <View style={styles.rateSep} />
                <View style={[styles.rateCell, styles.rateCellVideo]}>
                  <Ionicons name="videocam-outline" size={14} color="#1D4ED8" style={styles.rateIcon} />
                  <Text style={styles.rateLabelVideo}>Video</Text>
                  <Text style={styles.rateValueVideo}>{formatRupee(detail.videoRate)}</Text>
                </View>
                <View style={styles.rateSep} />
                <View style={[styles.rateCell, styles.rateCellExp]}>
                  <Ionicons name="time-outline" size={14} color="#B45309" style={styles.rateIcon} />
                  <Text style={styles.rateLabelExp}>Exp.</Text>
                  <Text style={styles.rateValueExp} numberOfLines={1}>
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
                <SectionHeading>About</SectionHeading>
                <View style={styles.aboutCard}>
                  <Text style={styles.bodyText}>{detail.profile.profileSummary}</Text>
                </View>
              </View>
            ) : null}

            {expertiseCount > 0 ? (
              <View style={styles.section}>
                <SectionHeading>Expertise & coverage</SectionHeading>
                <View style={styles.expertiseCard}>
                  {detail.skills.length > 0 ? (
                    <View style={styles.expertiseRow}>
                      <Text style={styles.expertiseRowLabel}>Skills</Text>
                      <View style={styles.chipWrapTight}>
                        {detail.skills.map((s) => (
                          <View key={s} style={styles.chip}>
                            <Text style={styles.chipText}>{s}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  ) : null}
                  {detail.industries.length > 0 ? (
                    <View style={[styles.expertiseRow, detail.skills.length > 0 ? styles.expertiseRowSpaced : null]}>
                      <Text style={styles.expertiseRowLabel}>Industries</Text>
                      <View style={styles.chipWrapTight}>
                        {detail.industries.map((s) => (
                          <View key={s} style={[styles.chip, styles.chipMuted]}>
                            <Text style={styles.chipTextMuted}>{s}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  ) : null}
                  {detail.segments.length > 0 ? (
                    <View
                      style={[
                        styles.expertiseRow,
                        detail.skills.length + detail.industries.length > 0 ? styles.expertiseRowSpaced : null,
                      ]}
                    >
                      <Text style={styles.expertiseRowLabel}>Segments</Text>
                      <View style={styles.chipWrapTight}>
                        {detail.segments.map((s) => (
                          <View key={s} style={[styles.chip, styles.chipOutline]}>
                            <Text style={styles.chipTextOutline}>{s}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  ) : null}
                </View>
              </View>
            ) : null}

            {showCredentialsSection ? (
              <View style={styles.section}>
                <SectionHeading>Credentials</SectionHeading>
                <View style={styles.factsCard}>
                  <ProfileFactsList
                    items={profileFactItems}
                    isKnownProfile={isKnownProfile}
                    onOpenWebsite={onOpenWebsite}
                  />
                </View>
              </View>
            ) : null}

            {isMeaningfulText(detail.expertVideoUrl) ? (
              <Pressable
                onPress={onOpenIntroVideo}
                style={({ pressed }) => [styles.introCard, pressed && styles.introCardPressed]}
                accessibilityRole="button"
                accessibilityLabel="Watch expert introduction on YouTube"
              >
                <LinearGradient
                  colors={['#0F5132', '#0D9488', '#134E4A']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.introGradient}
                >
                  <View style={styles.introIconWrap}>
                    <Ionicons name="play" size={20} color={THEME.colors.white} />
                  </View>
                  <View style={styles.introTextCol}>
                    <Text style={styles.introTitle}>Introduction video</Text>
                    <Text style={styles.introSubtitle}>Opens in YouTube</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.85)" />
                </LinearGradient>
              </Pressable>
            ) : null}

            {detail.expertTalks.length > 0 ? (
              <View style={styles.section}>
                <SectionHeading>Expert talks</SectionHeading>
                <Text style={styles.sectionHint}>Tap a card to watch</Text>
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
              colors={[THEME.colors.primary, '#0D9488', '#0F5132']}
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
      <Ionicons name={props.icon} size={18} color={SLATE_MUTED} />
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
    flex: 1,
    backgroundColor: SCREEN_CANVAS,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: THEME.spacing[12],
  },
  heroBlock: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    paddingBottom: THEME.spacing[8],
  },
  heroPhotoFrame: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.spacing[8],
    paddingHorizontal: THEME.spacing[12],
  },
  heroPhoto: {
    width: '100%',
    height: '100%',
  },
  heroIdentity: {
    marginHorizontal: H_PADDING,
    marginTop: -THEME.spacing[14],
    paddingHorizontal: THEME.spacing[14],
    paddingTop: THEME.spacing[14],
    paddingBottom: THEME.spacing[16],
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius[16],
    borderWidth: 1,
    borderColor: 'rgba(15,81,50,0.12)',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      },
      android: { elevation: 3 },
      default: {},
    }),
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: THEME.spacing[8],
  },
  heroNameDark: {
    flex: 1,
    fontSize: THEME.typography.size[24],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.4,
  },
  verifiedPillDark: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15,81,50,0.08)',
    paddingHorizontal: THEME.spacing[8],
    paddingVertical: 3,
    borderRadius: THEME.radius[12],
    borderWidth: 1,
    borderColor: 'rgba(15,81,50,0.16)',
  },
  verifiedTextDark: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.primary,
  },
  heroRoleDark: {
    marginTop: THEME.spacing[8],
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.medium as '500',
    color: THEME.colors.textSecondary,
    lineHeight: 20,
  },
  heroTrustRowDark: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: THEME.spacing[8],
  },
  heroTrustTextDark: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.primary,
    letterSpacing: 0.2,
  },
  heroMetaRowDark: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: THEME.spacing[8],
  },
  heroMetaDark: {
    flex: 1,
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium as '500',
    color: '#0F766E',
  },
  sheet: {
    marginHorizontal: H_PADDING,
    borderRadius: THEME.radius[16],
    backgroundColor: THEME.colors.white,
    borderWidth: 1,
    borderColor: SLATE_LINE,
    paddingHorizontal: THEME.spacing[12],
    paddingBottom: THEME.spacing[12],
    paddingTop: THEME.spacing[10],
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.06,
        shadowRadius: 20,
      },
      android: { elevation: 2 },
      default: {},
    }),
  },
  sheetAccentWrap: {
    alignItems: 'center',
    marginBottom: THEME.spacing[10],
  },
  sheetAccentBar: {
    width: 56,
    height: 4,
    borderRadius: 3,
  },
  rateStrip: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: THEME.radius[12],
    borderWidth: 1,
    borderColor: SLATE_LINE,
    overflow: 'hidden',
    marginBottom: THEME.spacing[4],
    backgroundColor: THEME.colors.white,
  },
  rateSep: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(148,163,184,0.45)',
  },
  rateCell: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.spacing[10],
    paddingHorizontal: THEME.spacing[4],
  },
  rateCellAudio: {
    backgroundColor: 'rgba(22,101,52,0.09)',
  },
  rateCellVideo: {
    backgroundColor: 'rgba(37,99,235,0.10)',
  },
  rateCellExp: {
    backgroundColor: 'rgba(217,119,6,0.11)',
  },
  rateIcon: {
    marginBottom: 4,
  },
  rateLabelAudio: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: '#166534',
    textTransform: 'uppercase',
    letterSpacing: 0.55,
  },
  rateLabelVideo: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: '#1D4ED8',
    textTransform: 'uppercase',
    letterSpacing: 0.55,
  },
  rateLabelExp: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: '#B45309',
    textTransform: 'uppercase',
    letterSpacing: 0.55,
  },
  rateValueAudio: {
    marginTop: 2,
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.bold as '700',
    color: '#14532D',
  },
  rateValueVideo: {
    marginTop: 2,
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.bold as '700',
    color: '#1E3A8A',
  },
  rateValueExp: {
    marginTop: 2,
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.bold as '700',
    color: '#92400E',
  },
  stubBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: THEME.spacing[8],
    paddingVertical: THEME.spacing[8],
    paddingHorizontal: THEME.spacing[10],
    borderRadius: THEME.radius[12],
    backgroundColor: 'rgba(13,148,136,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(13,148,136,0.22)',
    marginBottom: THEME.spacing[4],
  },
  stubBannerText: {
    flex: 1,
    fontSize: THEME.typography.size[12],
    lineHeight: 17,
    color: THEME.colors.textSecondary,
  },
  section: {
    marginTop: THEME.spacing[12],
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
    marginBottom: THEME.spacing[8],
  },
  sectionHeadingAccent: {
    width: 3,
    height: 16,
    borderRadius: 2,
    backgroundColor: THEME.colors.primary,
  },
  sectionTitle: {
    flex: 1,
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.bold as '700',
    color: '#1E293B',
    textTransform: 'uppercase',
    letterSpacing: 0.85,
  },
  sectionHint: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
    marginTop: -THEME.spacing[4],
    marginBottom: THEME.spacing[8],
  },
  aboutCard: {
    borderRadius: THEME.radius[12],
    backgroundColor: THEME.colors.white,
    borderWidth: 1,
    borderColor: SLATE_LINE,
    borderLeftWidth: 3,
    borderLeftColor: THEME.colors.primary,
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[10],
  },
  bodyText: {
    fontSize: THEME.typography.size[14],
    lineHeight: 21,
    color: THEME.colors.textPrimary,
  },
  expertiseCard: {
    borderRadius: THEME.radius[12],
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    paddingHorizontal: THEME.spacing[10],
    paddingVertical: THEME.spacing[10],
  },
  expertiseRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: THEME.spacing[8],
  },
  expertiseRowSpaced: {
    marginTop: THEME.spacing[10],
    paddingTop: THEME.spacing[10],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#BBF7D0',
  },
  expertiseRowLabel: {
    width: 76,
    flexShrink: 0,
    paddingTop: 5,
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  chipWrapTight: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing[8],
  },
  chip: {
    paddingHorizontal: THEME.spacing[8],
    paddingVertical: 5,
    borderRadius: THEME.radius[8],
    backgroundColor: 'rgba(15,81,50,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(15,81,50,0.22)',
  },
  chipText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium as '500',
    color: THEME.colors.primary,
  },
  chipMuted: {
    backgroundColor: THEME.colors.white,
    borderColor: '#BFDBFE',
  },
  chipTextMuted: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium as '500',
    color: THEME.colors.textPrimary,
  },
  chipOutline: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FCD34D',
  },
  chipTextOutline: {
    fontSize: THEME.typography.size[12],
    color: '#92400E',
  },
  factsCard: {
    borderRadius: THEME.radius[12],
    backgroundColor: '#F8FAFF',
    borderWidth: 1,
    borderColor: '#E0E7FF',
    overflow: 'hidden',
  },
  factsCardInner: {
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[4],
  },
  factRowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: SLATE_LINE,
    paddingBottom: THEME.spacing[8],
  },
  factRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: THEME.spacing[10],
    paddingVertical: THEME.spacing[8],
  },
  factTextCol: {
    flex: 1,
    minWidth: 0,
  },
  factLabel: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium as '500',
    color: SLATE_MUTED,
  },
  factValue: {
    marginTop: 2,
    fontSize: THEME.typography.size[14],
    color: THEME.colors.textPrimary,
    lineHeight: 20,
  },
  websiteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[10],
    paddingVertical: THEME.spacing[8],
  },
  websiteRowPressed: {
    opacity: 0.88,
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
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
    lineHeight: 17,
    paddingVertical: THEME.spacing[8],
    paddingHorizontal: THEME.spacing[12],
  },
  introCard: {
    marginTop: THEME.spacing[12],
    borderRadius: THEME.radius[12],
    overflow: 'hidden',
  },
  introCardPressed: {
    opacity: 0.9,
  },
  introGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: THEME.spacing[12],
    paddingHorizontal: THEME.spacing[12],
    gap: THEME.spacing[10],
  },
  introIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  introTextCol: {
    flex: 1,
    minWidth: 0,
  },
  introTitle: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.white,
  },
  introSubtitle: {
    marginTop: 2,
    fontSize: THEME.typography.size[12],
    color: 'rgba(255,255,255,0.82)',
  },
  talksScroll: {
    gap: THEME.spacing[8],
    paddingRight: H_PADDING,
  },
  talkCard: {
    borderRadius: THEME.radius[12],
    overflow: 'hidden',
    backgroundColor: THEME.colors.black,
    borderWidth: 2,
    borderColor: 'rgba(45,212,191,0.55)',
    marginRight: THEME.spacing[8],
  },
  talkCardPressed: {
    opacity: 0.9,
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: THEME.radius[8],
  },
  talkDurationText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.white,
  },
  talkTitle: {
    position: 'absolute',
    left: THEME.spacing[10],
    right: THEME.spacing[10],
    bottom: THEME.spacing[8],
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.white,
    lineHeight: 16,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: H_PADDING,
    backgroundColor: THEME.colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: SLATE_LINE,
  },
  bookBtn: {
    borderRadius: THEME.radius[12],
    overflow: 'hidden',
  },
  bookBtnPressed: {
    opacity: 0.9,
  },
  bookGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing[8],
    paddingVertical: THEME.spacing[12],
  },
  bookLabel: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.white,
  },
});
