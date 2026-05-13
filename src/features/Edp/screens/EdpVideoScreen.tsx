import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';

// ─── If you don't have react-native-svg, replace Svg/Circle with a View ─────
// import Svg, { Circle } from 'react-native-svg';

import { styles, THEME } from './ModuleVideoScreen.styles';

// ─── Types ────────────────────────────────────────────────────────────────────

type LessonStatus = 'done' | 'active' | 'locked';

interface Lesson {
  id: string;
  title: string;
  duration?: string;
  status: LessonStatus;
}

interface ModuleVideoScreenProps {
  moduleTitle?: string;
  moduleSub?: string;
  currentTime?: string;
  remainingTime?: string;
  completedCount?: number;
  totalCount?: number;
  seekPercent?: number;
  lessons?: Lesson[];
  onBack?: () => void;
  onDownload?: () => void;
  onLessonPress?: (lesson: Lesson) => void;
  onPlayPause?: () => void;
  onSeekBack?: () => void;
  onSeekForward?: () => void;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const DEFAULT_LESSONS: Lesson[] = [
  { id: '1', title: 'Introduction', status: 'done' },
  { id: '2', title: 'First steps', status: 'done' },
  { id: '3', title: 'Business idea generation', duration: '13:09', status: 'active' },
  { id: '4', title: 'Selling and Negotiating', duration: '12:49', status: 'locked' },
  { id: '5', title: 'Validation techniques', duration: '15:54', status: 'locked' },
  { id: '6', title: 'Business model canvas', duration: '26:52', status: 'locked' },
  { id: '7', title: 'Market sizing', duration: '18:30', status: 'locked' },
  { id: '8', title: 'Final assessment', duration: '22:15', status: 'locked' },
];

const SEEK_FILL_MAP: Record<string, string> = {};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBarRow() {
  return (
    <View style={styles.statusBar}>
      <Text style={styles.statusTime}>9:41</Text>
      <View style={styles.statusIcons}>
        {/* Signal bars */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 2 }}>
          {[8, 11, 14].map((h, i) => (
            <View
              key={i}
              style={{
                width: 3,
                height: h,
                borderRadius: 1.5,
                backgroundColor: 'rgba(255,255,255,0.8)',
              }}
            />
          ))}
        </View>
        {/* WiFi arc */}
        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>WiFi</Text>
        {/* Battery */}
        <View
          style={{
            width: 22,
            height: 11,
            borderRadius: 2,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.6)',
            padding: 1.5,
            flexDirection: 'row',
          }}>
          <View
            style={{
              flex: 0.8,
              backgroundColor: 'rgba(255,255,255,0.8)',
              borderRadius: 1,
            }}
          />
        </View>
      </View>
    </View>
  );
}

function VideoPlayer({
  currentTime,
  remainingTime,
  seekPercent,
  isPlaying,
  onBack,
  onPlayPause,
  onSeekBack,
  onSeekForward,
}: {
  currentTime: string;
  remainingTime: string;
  seekPercent: number;
  isPlaying: boolean;
  onBack?: () => void;
  onPlayPause?: () => void;
  onSeekBack?: () => void;
  onSeekForward?: () => void;
}) {
  return (
    <View style={styles.videoWrap}>
      {/* Thumbnail placeholder */}
      <View style={styles.videoPlaceholder}>
        <View
          style={{
            width: 54,
            height: 40,
            borderRadius: 6,
            backgroundColor: '#2a2a2a',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={{ width: 28, height: 20, backgroundColor: '#3a3a3a', borderRadius: 3 }} />
        </View>
      </View>

      {/* Overlay */}
      <View style={styles.videoOverlay} />

      {/* Top bar */}
      <View style={styles.videoTopBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Text style={{ color: THEME.colors.white, fontSize: 16, fontWeight: '600' }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.videoTimestamp}>
          {currentTime} &nbsp;–&nbsp; {remainingTime}
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14 }}>⤢</Text>
      </View>

      {/* Playback controls */}
      <View style={styles.videoControls}>
        <TouchableOpacity style={styles.controlBtn} onPress={onSeekBack} activeOpacity={0.7}>
          <Text style={{ color: THEME.colors.white, fontSize: 12 }}>↺</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlBtnLg} onPress={onPlayPause} activeOpacity={0.7}>
          <Text style={{ color: THEME.colors.white, fontSize: 18 }}>{isPlaying ? '⏸' : '▶'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlBtn} onPress={onSeekForward} activeOpacity={0.7}>
          <Text style={{ color: THEME.colors.white, fontSize: 12 }}>↻</Text>
        </TouchableOpacity>
      </View>

      {/* Seek bar */}
      <View style={styles.seekContainer}>
        <View style={styles.seekTrack}>
          <View style={[styles.seekFill, { width: `${seekPercent}%` }]}>
            <View style={styles.seekDot} />
          </View>
        </View>
        <View style={styles.seekLabels}>
          <Text style={styles.seekLabelText}>{currentTime}</Text>
          <Text style={styles.seekLabelText}>{remainingTime}</Text>
        </View>
      </View>
    </View>
  );
}

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

function ProgressRing({ completed, total }: { completed: number; total: number }) {
  const radius = 7;
  const circumference = 2 * Math.PI * radius;
  const progress = completed / total;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={styles.progressRingWrap}>
      {/* Fallback plain view if react-native-svg not available */}
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          borderWidth: 2.5,
          borderColor: THEME.colors.border,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
        <View
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            height: `${progress * 100}%`,
            backgroundColor: THEME.colors.brandGreen,
            opacity: 0.6,
          }}
        />
      </View>
    </View>
  );
}

function LessonItem({
  lesson,
  isLast,
  onPress,
}: {
  lesson: Lesson;
  isLast: boolean;
  onPress?: () => void;
}) {
  if (lesson.status === 'active') {
    return (
      <View style={styles.activeRowWrap}>
        <View style={[styles.lessonRow, { borderBottomWidth: 0, paddingVertical: THEME.spacing[8] }]}>
          <View style={styles.lessonIconActive}>
            <Text style={{ color: THEME.colors.white, fontSize: 12 }}>▶</Text>
          </View>
          <Text style={styles.lessonTitleActive}>{lesson.title}</Text>
          <Text style={styles.lessonDuration}>{lesson.duration}</Text>
        </View>
      </View>
    );
  }

  if (lesson.status === 'done') {
    return (
      <TouchableOpacity
        style={[styles.lessonRow, isLast && styles.lessonRowLast]}
        onPress={onPress}
        activeOpacity={0.7}>
        <View style={styles.lessonIconDone}>
          <Text style={{ color: THEME.colors.brandGreen, fontSize: 12 }}>▶</Text>
        </View>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        <View style={styles.checkBadge}>
          <Text style={{ color: THEME.colors.white, fontSize: 10 }}>✓</Text>
        </View>
      </TouchableOpacity>
    );
  }

  // locked
  return (
    <View style={[styles.lessonRow, styles.lockedRow, isLast && styles.lessonRowLast]}>
      <View style={styles.lessonIconLocked}>
        <Text style={{ color: THEME.colors.textMuted, fontSize: 12 }}>🔒</Text>
      </View>
      <Text style={styles.lessonTitleMuted}>{lesson.title}</Text>
      <Text style={styles.lessonDuration}>{lesson.duration}</Text>
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
  lessons = DEFAULT_LESSONS,
  onBack,
  onDownload,
  onLessonPress,
  onPlayPause,
  onSeekBack,
  onSeekForward,
}: ModuleVideoScreenProps) {
  const [isPlaying, setIsPlaying] = useState(true);

  const handlePlayPause = () => {
    setIsPlaying(prev => !prev);
    onPlayPause?.();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.brandDark} />

      <StatusBarRow />

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
          <View style={styles.divider} />

          <SupportingMaterials onDownload={onDownload} />

          {/* Section Header */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionLeft}>
              <View style={styles.sectionAccentBar} />
              <Text style={styles.sectionTitle}>All lessons</Text>
            </View>
            <View style={styles.sectionRight}>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>
                  {completedCount} / {totalCount}
                </Text>
              </View>
              <ProgressRing completed={completedCount} total={totalCount} />
            </View>
          </View>

          {/* Lesson list */}
          {lessons.map((lesson, index) => (
            <LessonItem
              key={lesson.id}
              lesson={lesson}
              isLast={index === lessons.length - 1}
              onPress={() => onLessonPress?.(lesson)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}