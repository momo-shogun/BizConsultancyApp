import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
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
import { usePublicConsultantDetail } from '@/features/consultant/hooks/usePublicConsultantDetail';
import type { ConsultantDetail, ConsultantExpertTalk } from '@/features/consultant/types/consultantDetail.types';
import { ROUTES } from '@/navigation/routeNames';
import type { RootStackParamList } from '@/navigation/types';
import { RemoteImage, SafeAreaWrapper, ScreenHeader, ScreenWrapper } from '@/shared/components';
import { youtubeEmbedToWatchUrl } from '@/utils/youtubeUrl';

const H_PADDING = THEME.spacing[16];
const SCREEN_CANVAS = '#F1F5F3';
const SLATE_LINE = '#E2E8F0';
const SLATE_MUTED = '#64748B';

const METRIC_PALETTES = {
  green: {
    bg: '#ECFDF5',
    border: '#A7F3D0',
    iconBg: 'rgba(15,81,50,0.12)',
    icon: '#0F5132',
    label: '#166534',
    value: '#14532D',
  },
  blue: {
    bg: '#EFF6FF',
    border: '#BFDBFE',
    iconBg: 'rgba(37,99,235,0.12)',
    icon: '#1D4ED8',
    label: '#1E40AF',
    value: '#1E3A8A',
  },
  amber: {
    bg: '#FFFBEB',
    border: '#FDE68A',
    iconBg: 'rgba(217,119,6,0.14)',
    icon: '#B45309',
    label: '#92400E',
    value: '#78350F',
  },
} as const;

type MetricAccent = keyof typeof METRIC_PALETTES;
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
      <Text style={styles.sectionTitle}>{props.children}</Text>
    </View>
  );
}

interface SectionCardProps {
  title: string;
  hint?: string;
  children: React.ReactNode;
}

function SectionCard(props: SectionCardProps): React.ReactElement {
  return (
    <View style={styles.sectionCard}>
      <SectionHeading>{props.title}</SectionHeading>
      {props.hint != null && props.hint.length > 0 ? (
        <Text style={styles.sectionHint}>{props.hint}</Text>
      ) : null}
      {props.children}
    </View>
  );
}

interface MetricPillProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
  accent: MetricAccent;
}

function MetricPill(props: MetricPillProps): React.ReactElement {
  const palette = METRIC_PALETTES[props.accent];
  return (
    <View style={[styles.metricPill, { backgroundColor: palette.bg, borderColor: palette.border }]}>
      <View style={[styles.metricIconWrap, { backgroundColor: palette.iconBg }]}>
        <Ionicons name={props.icon} size={16} color={palette.icon} />
      </View>
      <Text style={[styles.metricLabel, { color: palette.label }]}>{props.label}</Text>
      <Text style={[styles.metricValue, { color: palette.value }]} numberOfLines={1}>
        {props.value}
      </Text>
    </View>
  );
}

interface TagChipProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  text: string;
}

function TagChip(props: TagChipProps): React.ReactElement {
  return (
    <View style={styles.tagChip}>
      <Ionicons name={props.icon} size={12} color="#0F766E" />
      <Text style={styles.tagChipText} numberOfLines={1}>
        {props.text}
      </Text>
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
    <View style={styles.factsGrid}>
      {items.map((item) => {
        if (item.kind === 'website') {
          return (
            <Pressable
              key={item.id}
              onPress={props.onOpenWebsite}
              style={({ pressed }) => [
                styles.factTile,
                styles.factTileWide,
                pressed && styles.factTilePressed,
              ]}
              accessibilityRole="link"
              accessibilityLabel="Open website"
            >
              <View style={styles.factTileIcon}>
                <Ionicons name="globe-outline" size={18} color={THEME.colors.primary} />
              </View>
              <Text style={styles.factTileLabel}>Website</Text>
              <Text style={styles.factTileLink} numberOfLines={2}>
                {item.url}
              </Text>
              <Ionicons
                name="arrow-forward"
                size={14}
                color={THEME.colors.primary}
                style={styles.factTileArrow}
              />
            </Pressable>
          );
        }
        return (
          <View key={item.id} style={styles.factTile}>
            <View style={styles.factTileIcon}>
              <Ionicons name={item.icon} size={18} color={THEME.colors.primary} />
            </View>
            <Text style={styles.factTileLabel}>{item.label}</Text>
            <Text style={styles.factTileValue} numberOfLines={3}>
              {item.value}
            </Text>
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
  const { detail, isLoading } = usePublicConsultantDetail(slug);

  const talkCardWidth = useMemo((): number => Math.min(252, Math.round(width * 0.66)), [width]);

  const expertiseCount =
    detail != null
      ? detail.skills.length + detail.industries.length + detail.segments.length
      : 0;

  const locationLine = useMemo((): string => {
    if (detail == null) {
      return '';
    }
    const parts: string[] = [];
    if (isMeaningfulText(detail.city)) parts.push(detail.city);
    if (isMeaningfulText(detail.state)) parts.push(detail.state);
    if (isMeaningfulText(detail.pincode)) parts.push(detail.pincode);
    return parts.join(' · ');
  }, [detail]);

  const onOpenIntroVideo = useCallback((): void => {
    if (detail == null) {
      return;
    }
    openExternalUrl(youtubeEmbedToWatchUrl(detail.expertVideoUrl));
  }, [detail]);

  const onOpenTalk = useCallback((talk: ConsultantExpertTalk): void => {
    openExternalUrl(youtubeEmbedToWatchUrl(talk.url));
  }, []);

  const onOpenWebsite = useCallback((): void => {
    if (detail == null) {
      return;
    }
    const w = detail.profile.websiteUrl;
    if (isMeaningfulText(w)) {
      openExternalUrl(w ?? '');
    }
  }, [detail]);

  const showRates = (detail?.audioRate ?? 0) > 0 || (detail?.videoRate ?? 0) > 0;
  const isKnownProfile = detail?.slug === 'r-k-saxena';

  const profileFactItems = useMemo(
    () => (detail != null ? collectProfileFacts(detail) : []),
    [detail],
  );
  const showCredentialsSection = profileFactItems.length > 0 || !isKnownProfile;

  if (isLoading || detail == null) {
    return (
      <SafeAreaWrapper edges={['top']}>
        <ScreenHeader title="Consultant" onBackPress={() => navigation.goBack()} />
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={THEME.colors.primary} />
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper edges={['top']}>
      <ScreenHeader
        title="Consultant"
        onBackPress={() => navigation.goBack()}
        showConsultantActions
        onCallPress={() => {}}
        onMessagePress={() => {}}
      />

      <ScreenWrapper style={styles.screenBg}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: THEME.spacing[20] + insets.bottom + 72 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroSection}>
            <LinearGradient
              colors={['#0B3D2C', '#0F5132', '#146E5C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroGradient}
            />
            <View style={styles.profileCard}>
              <View style={styles.profileRow}>
                <View style={styles.avatarOuter}>
                  <LinearGradient
                    colors={['#34D399', '#0F5132', '#0B3D2C']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.avatarRing}
                  >
                    <View style={styles.avatarInner}>
                      <RemoteImage
                        uri={detail.image}
                        placeholderVariant="avatar"
                        placeholderName={detail.name}
                        style={styles.avatarImage}
                        resizeMode="cover"
                        accessibilityLabel={`Portrait of ${detail.name}`}
                      />
                    </View>
                  </LinearGradient>
                  {detail.verified ? (
                    <View style={styles.avatarBadge} accessibilityLabel="Verified consultant">
                      <Ionicons name="checkmark" size={11} color={THEME.colors.white} />
                    </View>
                  ) : null}
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName} numberOfLines={2}>
                    {detail.name}
                  </Text>
                  <Text style={styles.profileTitle} numberOfLines={2}>
                    {detail.title}
                  </Text>
                  {isMeaningfulText(detail.expertise) ? (
                    <Text style={styles.profileExpertise} numberOfLines={1}>
                      {detail.expertise}
                    </Text>
                  ) : null}
                  {detail.verified ? (
                    <View style={styles.verifiedRow}>
                      <Ionicons name="shield-checkmark" size={14} color={THEME.colors.primary} />
                      <Text style={styles.verifiedLabel}>Verified expert</Text>
                    </View>
                  ) : null}
                  {detail.type != null || locationLine.length > 0 ? (
                    <View style={styles.tagRow}>
                      {detail.type ? (
                        <TagChip
                          icon="ribbon-outline"
                          text={
                            detail.type === 'professional' ? 'Professional expert' : detail.type
                          }
                        />
                      ) : null}
                      {locationLine.length > 0 ? (
                        <TagChip icon="location-outline" text={locationLine} />
                      ) : null}
                    </View>
                  ) : null}
                </View>
              </View>
            </View>

            {showRates ? (
              <View style={styles.metricsRow}>
                <MetricPill
                  icon="mic-outline"
                  label="Audio"
                  value={formatRupee(detail.audioRate)}
                  accent="green"
                />
                <MetricPill
                  icon="videocam-outline"
                  label="Video"
                  value={formatRupee(detail.videoRate)}
                  accent="blue"
                />
                <MetricPill
                  icon="briefcase-outline"
                  label="Experience"
                  value={detail.experience}
                  accent="amber"
                />
              </View>
            ) : (
              <View style={styles.stubCard}>
                <Ionicons name="information-circle-outline" size={18} color={THEME.colors.primary} />
                <Text style={styles.stubCardText}>
                  Rates and experience appear for featured profiles once API data is connected.
                </Text>
              </View>
            )}
          </View>

          <View style={styles.contentStack}>
            {isMeaningfulText(detail.profile.profileSummary) ? (
              <SectionCard title="About">
                <View style={styles.aboutCard}>
                  <Ionicons
                    name="chatbox-ellipses-outline"
                    size={18}
                    color={THEME.colors.primary}
                    style={styles.aboutQuoteIcon}
                  />
                  <Text style={styles.bodyText}>{detail.profile.profileSummary}</Text>
                </View>
              </SectionCard>
            ) : null}

            {expertiseCount > 0 ? (
              <SectionCard title="Expertise & coverage">
                {detail.skills.length > 0 ? (
                  <View style={styles.expertiseBlock}>
                    <Text style={styles.expertiseLabel}>Skills</Text>
                    <View style={styles.chipWrap}>
                      {detail.skills.map((s) => (
                        <View key={s} style={styles.chipPrimary}>
                          <Text style={styles.chipPrimaryText}>{s}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ) : null}
                {detail.industries.length > 0 ? (
                  <View
                    style={[styles.expertiseBlock, detail.skills.length > 0 ? styles.expertiseBlockSpaced : null]}
                  >
                    <Text style={styles.expertiseLabel}>Industries</Text>
                    <View style={styles.chipWrap}>
                      {detail.industries.map((s) => (
                        <View key={s} style={styles.chipNeutral}>
                          <Text style={styles.chipNeutralText}>{s}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ) : null}
                {detail.segments.length > 0 ? (
                  <View
                    style={[
                      styles.expertiseBlock,
                      detail.skills.length + detail.industries.length > 0
                        ? styles.expertiseBlockSpaced
                        : null,
                    ]}
                  >
                    <Text style={styles.expertiseLabel}>Segments</Text>
                    <View style={styles.chipWrap}>
                      {detail.segments.map((s) => (
                        <View key={s} style={styles.chipAccent}>
                          <Text style={styles.chipAccentText}>{s}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ) : null}
              </SectionCard>
            ) : null}

            {showCredentialsSection ? (
              <SectionCard title="Credentials & details">
                <ProfileFactsList
                  items={profileFactItems}
                  isKnownProfile={isKnownProfile}
                  onOpenWebsite={onOpenWebsite}
                />
              </SectionCard>
            ) : null}

            {isMeaningfulText(detail.expertVideoUrl) ? (
              <SectionCard title="Media">
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
                    <View style={styles.introPlayWrap}>
                      <Ionicons name="play" size={22} color={THEME.colors.white} />
                    </View>
                    <View style={styles.introTextCol}>
                      <Text style={styles.introTitle}>Watch introduction</Text>
                      <Text style={styles.introSubtitle}>Expert overview on YouTube</Text>
                    </View>
                    <View style={styles.introChevron}>
                      <Ionicons name="chevron-forward" size={18} color={THEME.colors.white} />
                    </View>
                  </LinearGradient>
                </Pressable>
              </SectionCard>
            ) : null}

            {detail.expertTalks.length > 0 ? (
              <SectionCard title="Expert talks" hint="Tap a card to watch on YouTube">
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
                        <RemoteImage
                          uri={talk.thumbnail}
                          placeholderVariant="media"
                          style={styles.talkThumb}
                          resizeMode="cover"
                          accessibilityLabel={`Thumbnail for ${talk.title}`}
                        />
                        <LinearGradient
                          colors={['transparent', 'rgba(11,15,25,0.92)']}
                          style={styles.talkThumbGrad}
                        />
                        <View style={styles.talkPlayBadge}>
                          <Ionicons name="play" size={14} color={THEME.colors.white} />
                        </View>
                        <View style={styles.talkDuration}>
                          <Ionicons name="time-outline" size={11} color={THEME.colors.white} />
                          <Text style={styles.talkDurationText}>{talk.duration} min</Text>
                        </View>
                        <Text style={styles.talkTitle} numberOfLines={2}>
                          {talk.title}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </ScrollView>
              </SectionCard>
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

export default ConsultantDetailScreen;

const styles = StyleSheet.create({
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.spacing[32],
  },
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
  heroSection: {
    position: 'relative',
    overflow: 'hidden',
    paddingHorizontal: H_PADDING,
    paddingTop: THEME.spacing[8],
    paddingBottom: THEME.spacing[12],
  },
  heroGradient: {
    ...StyleSheet.absoluteFill,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  profileCard: {
    backgroundColor: THEME.colors.white,
    borderRadius: 20,
    padding: THEME.spacing[16],
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.65)',
    ...Platform.select({
      ios: {
        shadowColor: '#0B3D2C',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.18,
        shadowRadius: 24,
      },
      android: { elevation: 6 },
      default: {},
    }),
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: THEME.spacing[14],
  },
  avatarOuter: {
    position: 'relative',
  },
  avatarRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 41,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
    borderWidth: 2,
    borderColor: THEME.colors.white,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: THEME.colors.primary,
    borderWidth: 2,
    borderColor: THEME.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
    minWidth: 0,
    paddingTop: 2,
  },
  profileName: {
    fontSize: THEME.typography.size[20],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.4,
    lineHeight: 26,
  },
  profileTitle: {
    marginTop: THEME.spacing[4],
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: '#1E293B',
    lineHeight: 20,
  },
  profileExpertise: {
    marginTop: THEME.spacing[4],
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium as '500',
    color: THEME.colors.textSecondary,
    lineHeight: 17,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: THEME.spacing[8],
  },
  verifiedLabel: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.primary,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing[8],
    marginTop: THEME.spacing[10],
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    maxWidth: '100%',
    paddingHorizontal: THEME.spacing[10],
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  tagChipText: {
    flexShrink: 1,
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium as '500',
    color: '#0F766E',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: THEME.spacing[8],
    marginTop: THEME.spacing[12],
  },
  metricPill: {
    flex: 1,
    minWidth: 0,
    borderRadius: THEME.radius[12],
    borderWidth: 1,
    paddingVertical: THEME.spacing[10],
    paddingHorizontal: THEME.spacing[8],
    alignItems: 'center',
  },
  metricIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing[8],
  },
  metricLabel: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricValue: {
    marginTop: 2,
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.bold as '700',
  },
  stubCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: THEME.spacing[8],
    marginTop: THEME.spacing[12],
    padding: THEME.spacing[12],
    borderRadius: THEME.radius[12],
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  stubCardText: {
    flex: 1,
    fontSize: THEME.typography.size[12],
    lineHeight: 17,
    color: 'rgba(255,255,255,0.92)',
  },
  contentStack: {
    paddingHorizontal: H_PADDING,
    gap: THEME.spacing[12],
    marginTop: -THEME.spacing[4],
  },
  sectionCard: {
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius[16],
    borderWidth: 1,
    borderColor: SLATE_LINE,
    paddingHorizontal: THEME.spacing[14],
    paddingVertical: THEME.spacing[14],
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: { elevation: 2 },
      default: {},
    }),
  },
  sectionHeadingRow: {
    marginBottom: THEME.spacing[10],
  },
  sectionTitle: {
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.2,
  },
  sectionHint: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
    marginTop: -THEME.spacing[8],
    marginBottom: THEME.spacing[10],
  },
  aboutCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: THEME.spacing[10],
    borderRadius: THEME.radius[12],
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: SLATE_LINE,
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[12],
  },
  aboutQuoteIcon: {
    marginTop: 2,
  },
  bodyText: {
    flex: 1,
    fontSize: THEME.typography.size[14],
    lineHeight: 22,
    color: '#334155',
  },
  expertiseBlock: {},
  expertiseBlockSpaced: {
    marginTop: THEME.spacing[14],
    paddingTop: THEME.spacing[14],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: SLATE_LINE,
  },
  expertiseLabel: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: SLATE_MUTED,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: THEME.spacing[8],
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing[8],
  },
  chipPrimary: {
    paddingHorizontal: THEME.spacing[10],
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(15,81,50,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(15,81,50,0.2)',
  },
  chipPrimaryText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium as '500',
    color: THEME.colors.primary,
  },
  chipNeutral: {
    paddingHorizontal: THEME.spacing[10],
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipNeutralText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium as '500',
    color: '#334155',
  },
  chipAccent: {
    paddingHorizontal: THEME.spacing[10],
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  chipAccentText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium as '500',
    color: '#92400E',
  },
  factsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing[8],
  },
  factTile: {
    width: '48%',
    minHeight: 96,
    padding: THEME.spacing[10],
    borderRadius: THEME.radius[12],
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: SLATE_LINE,
  },
  factTileWide: {
    width: '100%',
    minHeight: 88,
  },
  factTilePressed: {
    opacity: 0.88,
  },
  factTileIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(15,81,50,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing[8],
  },
  factTileLabel: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium as '500',
    color: SLATE_MUTED,
  },
  factTileValue: {
    marginTop: 4,
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textPrimary,
    lineHeight: 17,
  },
  factTileLink: {
    marginTop: 4,
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.primary,
    lineHeight: 17,
  },
  factTileArrow: {
    position: 'absolute',
    right: THEME.spacing[10],
    top: THEME.spacing[10],
  },
  factsEmpty: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
    lineHeight: 17,
  },
  introCard: {
    borderRadius: THEME.radius[12],
    overflow: 'hidden',
  },
  introCardPressed: {
    opacity: 0.9,
  },
  introGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: THEME.spacing[14],
    paddingHorizontal: THEME.spacing[14],
    gap: THEME.spacing[12],
  },
  introPlayWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  introChevron: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.14)',
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
    fontSize: THEME.typography.size[12],
    color: 'rgba(255,255,255,0.82)',
  },
  talksScroll: {
    gap: THEME.spacing[10],
    paddingRight: THEME.spacing[4],
  },
  talkCard: {
    borderRadius: THEME.radius[16],
    overflow: 'hidden',
    backgroundColor: THEME.colors.black,
    borderWidth: 1,
    borderColor: SLATE_LINE,
    marginRight: THEME.spacing[4],
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
      },
      android: { elevation: 4 },
      default: {},
    }),
  },
  talkPlayBadge: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -18,
    marginLeft: -18,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(15,81,50,0.85)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
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
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
      default: {},
    }),
  },
  bookBtn: {
    borderRadius: 14,
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
    paddingVertical: THEME.spacing[14],
  },
  bookLabel: {
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.white,
    letterSpacing: 0.2,
  },
});
