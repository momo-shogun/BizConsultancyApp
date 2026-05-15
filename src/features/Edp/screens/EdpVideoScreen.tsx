
import { useNavigation } from '@react-navigation/native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
import { styles, THEME } from './ModuleVideoScreen.styles';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '@/constants/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaWrapper } from '@/shared/components/wrappers/SafeAreaWrapper';

// ─── Types ────────────────────────────────────────────────────────────────────

type LessonStatus = 'done' | 'active' | 'locked';

interface Lesson {
  id: string;
  title: string;
  duration?: string;
  status: LessonStatus;
  badgeLabel?: string;
  description?: string;
  thumbnail?: string;
}

interface ModuleVideoScreenProps {
  moduleTitle?: string;
  moduleSub?: string;
  currentTime?: string;
  remainingTime?: string;
  completedCount?: number;
  totalCount?: number;
  seekPercent?: number;
  progressPercent?: number;
  lessons?: Lesson[];
  onBack?: () => void;
  onDownload?: () => void;
  onLessonPress?: (lesson: Lesson) => void;
  onPlayInPlayer?: (lesson: Lesson) => void;
  onViewPDF?: (lesson: Lesson) => void;
  onPlayPause?: () => void;
  onSeekBack?: () => void;
  onSeekForward?: () => void;
}

// ─── Default Data ─────────────────────────────────────────────────────────────

const DEFAULT_LESSONS: Lesson[] = [
  {
    id: '1',
    title: 'Entrepreneurship what, why and how',
    duration: '11:24',
    status: 'done',
    badgeLabel: '1.1',
    description:
      'Understand the core meaning of entrepreneurship, why it matters in today\'s world, and how to begin your journey as an entrepreneur.',
  },
  {
    id: '2',
    title: 'History & Definition of Entrepreneurship',
    duration: '09:48',
    status: 'done',
    badgeLabel: '1.2',
    description:
      'Explore the rich history of entrepreneurship from early traders to modern disruptors, and get a clear definition of the term.',
  },
  {
    id: '3',
    title: 'Various Model of Entrepreneurship',
    duration: '13:09',
    status: 'active',
    badgeLabel: '1.3',
    description:
      'Dive into the different entrepreneurship models — social, scalable startup, small business — and find out which fits your vision best.',
  },
  {
    id: '4',
    title: 'Social Entrepreneurship',
    duration: '12:49',
    status: 'locked',
    badgeLabel: '1.4',
    description:
      'Learn how entrepreneurs create social value and drive change in communities while building sustainable business models.',
  },
  {
    id: '5',
    title: 'The Basic Characteristic of Entrepreneur',
    duration: '15:54',
    status: 'locked',
    badgeLabel: '1.5',
    description:
      'Discover the essential traits — risk-taking, creativity, persistence — that define successful entrepreneurs across industries.',
  },
  {
    id: '6',
    title: 'Business model canvas',
    duration: '26:52',
    status: 'locked',
    badgeLabel: '1.6',
    description:
      'Master the Business Model Canvas framework and learn how to map out value proposition, customer segments, and revenue streams.',
  },
  {
    id: '7',
    title: 'Market sizing',
    duration: '18:30',
    status: 'locked',
    badgeLabel: '1.7',
    description:
      'Learn TAM, SAM, and SOM concepts and how to size your market to attract investors and validate your idea effectively.',
  },
  {
    id: '8',
    title: 'Final assessment',
    duration: '22:15',
    status: 'locked',
    badgeLabel: '1.8',
    description:
      'Test your understanding of the entire module with a comprehensive assessment covering all key entrepreneurship concepts.',
  },
];

// ─── Status Bar ───────────────────────────────────────────────────────────────

function StatusBarRow() {
  return (
    <View style={styles.statusBar}>
      <Text style={styles.statusTime}>9:41</Text>
      <View style={styles.statusIcons}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 2 }}>
          {[8, 11, 14].map((h, i) => (
            <View
              key={i}
              style={{ width: 3, height: h, borderRadius: 1.5, backgroundColor: 'rgba(255,255,255,0.8)' }}
            />
          ))}
        </View>
        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>WiFi</Text>
        <View
          style={{
            width: 22, height: 11, borderRadius: 2, borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.6)', padding: 1.5, flexDirection: 'row',
          }}>
          <View style={{ flex: 0.8, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 1 }} />
        </View>
      </View>
    </View>
  );
}

// ─── Video Player ─────────────────────────────────────────────────────────────


import { WebView } from 'react-native-webview';

function VideoPlayer({ onBack }: { onBack?: () => void }) {
  const videoHtml = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { background: #000; width: 100vw; height: 100vh; }
          video {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
          video::-webkit-media-controls {
            transform: scale(1);
            transform-origin: bottom center;
          }
          video::-webkit-media-controls-panel {
            padding: 0 6px 6px 6px;
          }
          video::-webkit-media-controls-play-button {
           // width: 28px;
           // height: 28px;
          }
          video::-webkit-media-controls-timeline {
            height: 6px;
          }
          video::-webkit-media-controls-volume-slider {
            width: 18px;
          }
          video::-webkit-media-controls-current-time-display,
          video::-webkit-media-controls-time-remaining-display {
            font-size: 18px;
          }
          video::-webkit-media-controls-fullscreen-button,
          video::-webkit-media-controls-mute-button {
            width: 10px;
            height: 10px;
          }
        </style>
      </head>
      <body>
        <video
          controls
          autoplay
          playsinline
          src="https://www.w3schools.com/html/mov_bbb.mp4">
        </video>
      </body>
    </html>
  `;

  return (
    <View style={styles.videoWrap}>
      <WebView
        style={{ width: '100%', height: SCREEN_WIDTH * 9 / 16 }}
        source={{ html: videoHtml }}
        allowsFullscreenVideo={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled={true}
        scrollEnabled={false}
      />
      <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
        <Text style={{ color: '#fff', fontSize: 10, fontWeight: '200' }}>←</Text>
      </TouchableOpacity>
    </View>
  );
}



// ─── Supporting Materials ─────────────────────────────────────────────────────

function SupportingMaterials({ onDownload }: { onDownload?: () => void }) {
  return (
    <TouchableOpacity style={styles.supportCard} onPress={onDownload} activeOpacity={0.8}>
      <View style={styles.supportIconWrap}>
        <Text style={{ color: THEME.colors.white, fontSize: 18 }}>📄</Text>
      </View>
      <View style={styles.supportInfo}>
        <Text style={styles.supportTitle}>Supporting materials</Text>
        <Text style={styles.supportSub}>Download notes before watching the video</Text>
      </View>
      <View style={styles.downloadBtn}>
        <Text style={{ color: THEME.colors.textSecondary, fontSize: 15 }}>↓</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Progress Ring ────────────────────────────────────────────────────────────

function ProgressRing({ completed, total }: { completed: number; total: number }) {
  const progress = completed / total;
  return (
    <View style={styles.progressRingWrap}>
      <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2.5, borderColor: THEME.colors.border, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <View style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: `${progress * 100}%` as any, backgroundColor: THEME.colors.brandGreen, opacity: 0.6 }} />
      </View>
    </View>
  );
}

// ─── Module Progress Bar ──────────────────────────────────────────────────────

function ModuleProgressBar({ progressPercent, videoCount, pdfCount, lessonCount }: {
  progressPercent: number; videoCount?: number; pdfCount?: number; lessonCount?: number;
}) {
  return (
    <View style={styles.moduleProgressWrap}>
      <Text style={styles.moduleProgressMeta}>
        {videoCount ?? 6} videos · {pdfCount ?? 6} PDFs · {lessonCount ?? 6} lessons
      </Text>
      <View style={styles.moduleProgressRow}>
        <Text style={styles.moduleProgressLabel}>Progress</Text>
        <View style={styles.moduleProgressTrack}>
          <View style={[styles.moduleProgressFill, { width: `${progressPercent}%` as any }]} />
        </View>
        <Text style={styles.moduleProgressPct}>{progressPercent}%</Text>
      </View>
    </View>
  );
}

// ─── Lesson Thumbnail ─────────────────────────────────────────────────────────

function LessonThumbnail({ status, thumbnail }: { status: LessonStatus; thumbnail?: string }) {
  const bgColor = status === 'done' ? '#1a3d2b' : status === 'active' ? THEME.colors.brandGreen : '#d1d8e0';

  return (
    <View style={styles.thumbWrap}>
      {thumbnail ? (
        <Image source={{ uri: thumbnail }} style={styles.thumbImage} resizeMode="cover" />
      ) : (
        <View style={[styles.thumbPlaceholder, { backgroundColor: bgColor }]}>
          {/* film reel dots */}
          <View style={{ flexDirection: 'row', gap: 3 }}>
            {[0, 1, 2].map(i => (
              <View key={i} style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.35)' }} />
            ))}
          </View>
          <View style={{ width: 22, height: 14, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.18)', marginTop: 4 }} />
        </View>
      )}

      {/* Play button overlay */}
      {status !== 'locked' && (
        <View style={styles.thumbPlayOverlay}>
          <View style={[styles.thumbPlayBtn, status === 'active' && styles.thumbPlayBtnActive]}>
            <Text style={{ color: '#fff', fontSize: status === 'active' ? 11 : 9, marginLeft: 2 }}>▶</Text>
          </View>
        </View>
      )}

      {/* Lock overlay */}
      {status === 'locked' && (
        <View style={styles.thumbLockOverlay}>
          <Text style={{ fontSize: 14 }}>🔒</Text>
        </View>
      )}

      {/* Done green tick corner */}
      {status === 'done' && (
        <View style={styles.thumbDoneBadge}>
          <Text style={{ color: '#fff', fontSize: 8, fontWeight: '700' }}>✓</Text>
        </View>
      )}
    </View>
  );
}

// ─── OTT-Style Lesson Card ────────────────────────────────────────────────────

function LessonCard({
  lesson, isLast, onPress, onDownload,
}: {
  lesson: Lesson; isLast: boolean; onPress?: () => void; onDownload?: () => void;
}) {
  const isLocked = lesson.status === 'locked';
  const isActive = lesson.status === 'active';

  return (
    <View style={[
      styles.lessonCard,
      isLast && styles.lessonCardLast,
      isActive && styles.lessonCardActive,
    ]}>

      {/* Now playing pill */}
      {isActive && (
        <View style={styles.nowPlayingPill}>
          <View style={styles.nowPlayingDot} />
          <Text style={styles.nowPlayingText}>Now playing</Text>
        </View>
      )}

      {/* Top row: thumbnail + title + download */}
      <TouchableOpacity
        style={styles.lessonCardRow}
        onPress={isLocked ? undefined : onPress}
        activeOpacity={isLocked ? 1 : 0.75}>

        <LessonThumbnail status={lesson.status} thumbnail={lesson.thumbnail} />

        <View style={styles.lessonCardInfo}>
          <Text
            style={[
              styles.lessonCardTitle,
              isLocked && styles.lessonCardTitleLocked,
              isActive && styles.lessonCardTitleActive,
            ]}
            numberOfLines={2}>
            {lesson.title}
          </Text>
          <Text style={styles.lessonCardMeta}>
            {lesson.badgeLabel}
            {lesson.badgeLabel && lesson.duration ? '  ·  ' : ''}
            {lesson.duration ?? ''}
          </Text>
        </View>

    <TouchableOpacity
  style={styles.lessonCardActionBtn}
  onPress={isLocked ? undefined : onDownload}
  activeOpacity={isLocked ? 1 : 0.7}
  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
  {isLocked ? (
    <MaterialCommunityIcons name="lock" size={18} color="#A0A8B8" />
  ) : (
    <View style={styles.downloadCircle}>
      <MaterialCommunityIcons name="file-pdf-box" size={22} color="#E53935" />
    </View>
  )}
</TouchableOpacity>
      </TouchableOpacity>

      {/* Description */}
      {lesson.description ? (
        <Text
          style={[styles.lessonCardDesc, isLocked && styles.lessonCardDescLocked]}
          numberOfLines={3}>
          {lesson.description}
        </Text>
      ) : null}

      {/* Bottom divider */}
      {!isLast && <View style={styles.lessonCardDivider} />}
    </View>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function ModuleVideoScreen({
  moduleTitle = 'Business Idea Generation',
  moduleSub = 'Validate ideas and explore business models for your venture',
  currentTime = '03:04',
  remainingTime = '-10:09',
  completedCount = 2,
  totalCount = 10,
  seekPercent = 23,
  progressPercent = 2,
  lessons = DEFAULT_LESSONS,  onDownload,
  onLessonPress,
  onPlayInPlayer,
  onViewPDF,
  onPlayPause,
  onSeekBack,
  onSeekForward,
}: ModuleVideoScreenProps) {
  const [isPlaying, setIsPlaying] = useState(true);
const navigation = useNavigation();
  const handlePlayPause = () => {
    setIsPlaying(prev => !prev);
    onPlayPause?.();
  };
  const onBack = () => {
    navigation.goBack();
  };

  return (
     <SafeAreaWrapper edges={['top']} bgColor='black' isLight = {true}>
  
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}>

        <VideoPlayer
          currentTime={currentTime}
          remainingTime={remainingTime}
          seekPercent={seekPercent}
          isPlaying={isPlaying}
          onBack={onBack}
          onPlayPause={handlePlayPause}
          onSeekBack={onSeekBack}
          onSeekForward={onSeekForward}
        />

        <View style={styles.body}>

          <Text style={styles.moduleTitle}>{moduleTitle}</Text>
          <Text style={styles.moduleSub}>{moduleSub}</Text>

          {/* Stat cards */}
          <View style={styles.statRow}>
            <LinearGradient colors={['#fbf8cc', '#ede0d4']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={styles.box}>
              <Text style={styles.boxLabel}>Time &amp; focus</Text>
              <Text style={styles.boxValue}>02:07:04</Text>
            </LinearGradient>
            <LinearGradient colors={['#f7f4ea', '#ded9e2']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={styles.box}>
              <View style={styles.boxRow}>
                <Text style={styles.boxLabel}>Spent  </Text>
                <Text style={styles.boxValue}>20m</Text>
              </View>
              <View style={styles.boxRow}>
                <Text style={styles.boxLabel}>Left  </Text>
                <Text style={styles.boxValue}>120m</Text>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.divider} />

          <SupportingMaterials onDownload={onDownload} />

          <ModuleProgressBar
            progressPercent={progressPercent}
            videoCount={6}
            pdfCount={6}
            lessonCount={lessons.length}
          />

          {/* Section header */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionLeft}>
              <View style={styles.sectionAccentBar} />
              <Text style={styles.sectionTitle}>All lessons</Text>
            </View>
            <View style={styles.sectionRight}>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{completedCount} / {totalCount}</Text>
              </View>
              <ProgressRing completed={completedCount} total={totalCount} />
            </View>
          </View>

          {/* OTT lesson list */}
          <View style={styles.lessonList}>
            {lessons.map((lesson, index) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                isLast={index === lessons.length - 1}
                onPress={() => onLessonPress?.(lesson)}
                onDownload={() => onDownload?.()}
              />
            ))}
          </View>

        </View>
      </ScrollView>
  
    </SafeAreaWrapper>
  );
}