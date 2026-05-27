import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView, type WebViewProps } from 'react-native-webview';

import { useEdpModuleDetailScreen } from '@/features/Edp/hooks/useEdpModuleDetailScreen';
import { useEdpWatchTimeHeartbeat } from '@/features/Edp/hooks/useEdpWatchTimeHeartbeat';
import { normalizeEdpModuleSlug } from '@/features/Edp/utils/edpCourseDetailsParsing';
import type { EdpModuleLessonRow } from '@/features/Edp/types/edpCourseDetails.types';
import { buildDirectVideoHtml } from '@/features/Edp/utils/edpOverviewVideoHtml';
import { resolveYoutubeThumbnailUrl } from '@/features/Edp/utils/edpMedia';
import { ROUTES } from '@/navigation/routeNames';
import type { EdpStackParamList } from '@/navigation/types';
import { SafeAreaWrapper, ScreenHeader } from '@/shared/components';

import { EdpModuleDetailSkeleton } from '@/features/Edp/components/EdpModuleDetailSkeleton';

import { EDP_HERO_BG } from '../data/edpLandingData';
import { PLAYER_HEIGHT, SCREEN_WIDTH, styles, YT } from './ModuleVideoScreen.styles';

const LOCKED_WEB_VIEW_PROPS: Partial<WebViewProps> = {
  scrollEnabled: false,
  bounces: false,
  showsVerticalScrollIndicator: false,
  showsHorizontalScrollIndicator: false,
  overScrollMode: 'never',
  nestedScrollEnabled: false,
};

function ModuleVideoPlayer(props: {
  videoEmbed: ReturnType<typeof import('@/features/Edp/utils/edpMedia').resolveEdpVideoEmbed>;
  playing: boolean;
  onPlayingChange: (playing: boolean) => void;
  topInset: number;
  onBack: () => void;
}): React.ReactElement {
  const { videoEmbed, playing, onPlayingChange, topInset, onBack } = props;
  const [iframeReady, setIframeReady] = useState(false);

  const directVideoHtml = useMemo(
    () => (videoEmbed.kind === 'video' ? buildDirectVideoHtml(videoEmbed.src) : null),
    [videoEmbed],
  );

  const renderBody = (): React.ReactElement => {
    if (videoEmbed.kind === 'youtube' && videoEmbed.youtubeVideoId != null) {
      return (
        <YoutubePlayer
          height={PLAYER_HEIGHT}
          width={SCREEN_WIDTH}
          play={playing}
          videoId={videoEmbed.youtubeVideoId}
          forceAndroidAutoplay
          allowWebViewZoom={false}
          webViewProps={{
            ...LOCKED_WEB_VIEW_PROPS,
            allowsFullscreenVideo: true,
            allowsInlineMediaPlayback: true,
            mediaPlaybackRequiresUserAction: false,
          }}
          initialPlayerParams={{
            controls: true,
            preventFullScreen: false,
            modestbranding: true,
            rel: false,
          }}
          onChangeState={(next: string) => {
            if (next === 'ended') {
              onPlayingChange(false);
            }
          }}
        />
      );
    }

    if (videoEmbed.kind === 'iframe') {
      return (
        <>
          {!iframeReady ? (
            <View style={styles.videoLoader}>
              <ActivityIndicator color="#FFFFFF" size="large" />
            </View>
          ) : null}
          <WebView
            style={{ width: SCREEN_WIDTH, height: PLAYER_HEIGHT }}
            source={{ uri: videoEmbed.src }}
            allowsFullscreenVideo
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled
            onLoadEnd={() => setIframeReady(true)}
            {...LOCKED_WEB_VIEW_PROPS}
          />
        </>
      );
    }

    if (directVideoHtml != null) {
      return (
        <WebView
          style={{ width: SCREEN_WIDTH, height: PLAYER_HEIGHT }}
          source={{ html: directVideoHtml }}
          allowsFullscreenVideo
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled
          {...LOCKED_WEB_VIEW_PROPS}
        />
      );
    }

    return <Text style={styles.videoEmptyText}>No video available for this module.</Text>;
  };

  return (
    <View style={styles.playerSection}>
      <View style={[styles.statusBarSpacer, { height: topInset }]} />
      <View style={styles.videoWrap}>{renderBody()}</View>
      <Pressable
        style={[styles.playerBackBtn, { top: topInset + 8 }]}
        onPress={onBack}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons name="chevron-back" size={22} color={YT.white} />
      </Pressable>
    </View>
  );
}

function MetaChip(props: {
  icon: string;
  label: string;
  strong?: boolean;
}): React.ReactElement {
  return (
    <View style={styles.metaChip}>
      <Ionicons name={props.icon} size={14} color={YT.textSecondary} />
      <Text style={props.strong ? styles.metaChipTextStrong : styles.metaChipText}>{props.label}</Text>
    </View>
  );
}

function ProgressSection(props: {
  progressPercent: number;
  progressLabel: string;
  videoCount: number;
  pdfCount: number;
  lessonCount: number;
}): React.ReactElement {
  const { progressPercent, progressLabel, videoCount, pdfCount, lessonCount } = props;
  return (
    <View style={styles.progressBlock}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressLabel}>Your progress</Text>
        <Text style={styles.progressValue}>{progressLabel}</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
      </View>
      <Text style={styles.progressMeta}>
        {videoCount} videos · {pdfCount} PDFs · {lessonCount} lessons
      </Text>
    </View>
  );
}

function PlaylistRow(props: {
  lesson: EdpModuleLessonRow;
  index: number;
  onPress: () => void;
  onPdfPress: () => void;
}): React.ReactElement {
  const { lesson, index, onPress, onPdfPress } = props;
  const isActive = lesson.status === 'active';
  const hasPdf = lesson.pdfUrl != null;
  const thumbUri = resolveYoutubeThumbnailUrl(lesson.videoUrl);
  const durationLabel = lesson.duration.length > 0 ? lesson.duration : '';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.playlistRow,
        isActive ? styles.playlistRowActive : null,
        pressed ? styles.playlistRowPressed : null,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
    >
      {isActive ? <View style={styles.activeIndicator} /> : null}

      <View style={styles.thumbWrap}>
        {thumbUri != null ? (
          <Image source={{ uri: thumbUri }} style={styles.thumbImage} resizeMode="cover" />
        ) : (
          <View style={styles.thumbFallback}>
            <Ionicons name="play-circle" size={28} color="rgba(255,255,255,0.85)" />
          </View>
        )}
        {durationLabel.length > 0 ? (
          <View style={styles.thumbDuration}>
            <Text style={styles.thumbDurationText}>{durationLabel}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.rowBody}>
        {lesson.badgeLabel.length > 0 ? (
          <Text style={styles.rowIndex}>{lesson.badgeLabel}</Text>
        ) : (
          <Text style={styles.rowIndex}>{index + 1}</Text>
        )}
        <Text
          style={[styles.rowTitle, isActive ? styles.rowTitleActive : null]}
          numberOfLines={2}
        >
          {lesson.title}
        </Text>
        {isActive ? <Text style={styles.nowPlayingLabel}>Now playing</Text> : null}
      </View>

      <Pressable
        style={[styles.pdfBtn, !hasPdf ? styles.pdfBtnDisabled : null]}
        onPress={hasPdf ? onPdfPress : undefined}
        disabled={!hasPdf}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={hasPdf ? 'Open PDF' : 'PDF not available'}
      >
        <MaterialCommunityIcons
          name={hasPdf ? 'file-pdf-box' : 'file-remove-outline'}
          size={22}
          color={hasPdf ? YT.pdf : YT.textMuted}
        />
      </Pressable>
    </Pressable>
  );
}

function RelatedVideoCard(props: {
  title: string;
  meta: string;
  thumbnailUrl: string | null;
  onPress: () => void;
}): React.ReactElement {
  const { title, meta, thumbnailUrl, onPress } = props;
  return (
    <Pressable
      style={({ pressed }) => [styles.relatedCard, pressed ? styles.playlistRowPressed : null]}
      onPress={onPress}
    >
      {thumbnailUrl != null ? (
        <Image source={{ uri: thumbnailUrl }} style={styles.relatedThumb} resizeMode="cover" />
      ) : (
        <View style={styles.relatedThumbFallback}>
          <Ionicons name="school-outline" size={24} color={YT.textSecondary} />
        </View>
      )}
      <View style={styles.relatedInfo}>
        <Text style={styles.relatedTitle} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.relatedMeta} numberOfLines={1}>
          {meta}
        </Text>
      </View>
    </Pressable>
  );
}

export default function EdpVideoScreen(): React.ReactElement {
  const navigation = useNavigation<NativeStackNavigationProp<EdpStackParamList>>();
  const route = useRoute<RouteProp<EdpStackParamList, typeof ROUTES.Edp.ModuleDetail>>();
  const insets = useSafeAreaInsets();
  const slug = normalizeEdpModuleSlug(route.params?.slug ?? '');
  const lang = route.params?.lang ?? 'en';

  const {
    isLoading,
    isError,
    isNotFound,
    moduleTitle,
    moduleDuration,
    videoCount,
    pdfCount,
    lessonCount,
    progressPercent,
    progressLabel,
    spentLabel,
    remainingLabel,
    lessons,
    videoEmbed,
    relatedModules,
    playing,
    setPlaying,
    watchProgressContext,
    playLessonVideo,
    openLessonPdf,
    refreshProgress,
    refetch,
  } = useEdpModuleDetailScreen({ slug, lang });

  const { reportReadingTime } = useEdpWatchTimeHeartbeat({
    enabled: true,
    context: watchProgressContext,
    isPlaying: playing,
    onProgressRecorded: refreshProgress,
  });

  const handleOpenLessonPdf = useCallback(
    (lesson: EdpModuleLessonRow): void => {
      openLessonPdf(lesson);
      reportReadingTime(60, {
        categoryId: lesson.categoryId,
        subCategoryId: lesson.topicId,
      });
    },
    [openLessonPdf, reportReadingTime],
  );

  const handleBack = useCallback((): void => {
    setPlaying(false);
    navigation.goBack();
  }, [navigation, setPlaying]);

  const openRelatedModule = useCallback(
    (nextSlug: string): void => {
      navigation.push(ROUTES.Edp.ModuleDetail, { slug: nextSlug, lang });
    },
    [lang, navigation],
  );

  if (slug.length === 0) {
    return (
      <SafeAreaWrapper edges={['top']} bgColor={EDP_HERO_BG} isLight>
        <ScreenHeader title="EDP Programme" headerColor={EDP_HERO_BG} onBackPress={handleBack} />
        <View style={styles.centerState}>
          <Text style={styles.centerStateTitle}>Module unavailable</Text>
          <Text style={styles.centerStateSub}>Open this screen from the modules list.</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaWrapper
        edges={['bottom']}
        bgColor={YT.black}
        contentBgColor={YT.bg}
        statusBarStyle="light-content"
      >
        <View style={styles.root}>
          <EdpModuleDetailSkeleton topInset={insets.top} />
          <Pressable
            style={[styles.playerBackBtn, { top: insets.top + 8 }]}
            onPress={handleBack}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={22} color={YT.white} />
          </Pressable>
        </View>
      </SafeAreaWrapper>
    );
  }

  if (isNotFound || isError) {
    return (
      <SafeAreaWrapper edges={['top']} bgColor={YT.bg} isLight>
        <ScreenHeader title="EDP Programme" headerColor={EDP_HERO_BG} onBackPress={handleBack} />
        <View style={styles.centerState}>
          <Text style={styles.centerStateTitle}>
            {isNotFound ? 'Module not found' : 'Could not load module'}
          </Text>
          <Text style={styles.centerStateSub}>Check your connection and try again.</Text>
          <Pressable style={styles.retryBtn} onPress={() => void refetch()}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </Pressable>
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper
      edges={['bottom']}
      bgColor={YT.black}
      contentBgColor={YT.bg}
      statusBarStyle="light-content"
    >
      <View style={styles.root}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          stickyHeaderIndices={undefined}
        >
          <ModuleVideoPlayer
            videoEmbed={videoEmbed}
            playing={playing}
            onPlayingChange={setPlaying}
            topInset={insets.top}
            onBack={handleBack}
          />

          <View style={styles.content}>
            <Text style={styles.videoTitle}>{moduleTitle}</Text>

            <View style={styles.metaRow}>
              <MetaChip icon="time-outline" label={moduleDuration} strong />
              <MetaChip icon="hourglass-outline" label={`${spentLabel} watched`} />
              <MetaChip icon="timer-outline" label={`${remainingLabel} left`} />
            </View>

            <ProgressSection
              progressPercent={progressPercent}
              progressLabel={progressLabel}
              videoCount={videoCount}
              pdfCount={pdfCount}
              lessonCount={lessonCount}
            />

            <View style={styles.sectionDivider} />

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Course content</Text>
              <Text style={styles.sectionCount}>{lessonCount} videos</Text>
            </View>

            <View style={styles.playlist}>
              {lessons.map((lesson, index) => (
                <PlaylistRow
                  key={lesson.id}
                  lesson={lesson}
                  index={index}
                  onPress={() => playLessonVideo(lesson)}
                  onPdfPress={() => handleOpenLessonPdf(lesson)}
                />
              ))}
            </View>

            {relatedModules.length > 0 ? (
              <View style={styles.relatedSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Related modules</Text>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.relatedRow}
                >
                  {relatedModules.map((item) => (
                    <RelatedVideoCard
                      key={item.id}
                      title={item.title}
                      meta={item.meta}
                      thumbnailUrl={item.thumbnailUrl}
                      onPress={() => openRelatedModule(item.slug)}
                    />
                  ))}
                </ScrollView>
              </View>
            ) : null}
          </View>
        </ScrollView>
      </View>
    </SafeAreaWrapper>
  );
}
