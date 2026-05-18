import React, { useState } from 'react';
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { THEME } from '@/constants/theme';
import { SafeAreaWrapper, ScreenHeader, ScreenWrapper } from '@/shared/components';

import { styles } from './ExpertVideosScreen.styles';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AccountStackParamList } from '@/navigation/types';

// ── Types ─────────────────────────────────────────────────────────────────────
type VideoType = 'free' | 'paid';
type VideoStatus = 'active' | 'inactive';
type FilterKey = 'all' | 'free' | 'paid' | 'active' | 'inactive';

interface ExpertVideo {
  id: number;
  title: string;
  subject: string;
  url: string;
  duration: string;
  type: VideoType;
  status: VideoStatus;
  views: string;
  rating: string;
}

// ── Config ────────────────────────────────────────────────────────────────────
// Light theme — accent color + soft tinted background per card
const CARD_ACCENTS: string[] = ['#6366F1', '#10B981', '#F59E0B', '#3B82F6'];
const CARD_LIGHT_BG: string[] = ['#F0F0FF', '#F0FFF8', '#FFFBEB', '#EFF6FF'];

const FILTER_OPTIONS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'free', label: 'Free' },
  { key: 'paid', label: 'Paid' },
];

const MOCK_VIDEOS: ExpertVideo[] = [
  {
    id: 1,
    title: 'Retail Funding Basics',
    subject: 'Retail Funding (House, Mortgage & Education Loan etc)',
    url: 'youtu.be/MJY29woYe-U',
    duration: '25m',
    type: 'free',
    status: 'active',
    views: '1.2k',
    rating: '4.8',
  },
  {
    id: 2,
    title: 'Investment Strategies 2024',
    subject: 'Equity & Mutual Funds',
    url: 'youtu.be/abc123xyz',
    duration: '42m',
    type: 'paid',
    status: 'inactive',
    views: '876',
    rating: '4.6',
  },
  {
    id: 3,
    title: 'Tax Planning for Salaried',
    subject: 'Tax & Compliance',
    url: 'youtu.be/tax2024',
    duration: '18m',
    type: 'free',
    status: 'active',
    views: '2.1k',
    rating: '4.9',
  },
  {
    id: 4,
    title: 'Insurance Decoded',
    subject: 'Life & Health Insurance',
    url: 'youtu.be/insure101',
    duration: '31m',
    type: 'paid',
    status: 'active',
    views: '543',
    rating: '4.5',
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────
function SectionHeader({ count }: { count: number }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionAccentBar} />
      <Text style={styles.sectionTitle}>Expert Videos</Text>
      <View style={styles.sectionCountBadge}>
        <Text style={styles.sectionCountText}>{count}</Text>
      </View>
    </View>
  );
}

function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[styles.filterChip, active && styles.filterChipActive]}
    >
      <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function VideoCard({
  video,
  index,
  statusMap,
  onToggleStatus,
  onDelete,
  onEdit,
}: {
  video: ExpertVideo;
  index: number;
  statusMap: Record<number, VideoStatus>;
  onToggleStatus: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}) {
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];
  const lightBg = CARD_LIGHT_BG[index % CARD_LIGHT_BG.length];
  const isActive = statusMap[video.id] === 'active';

  return (
    <View style={[styles.videoCard, { backgroundColor: lightBg }]}>
      {/* top accent edge */}
      <View style={[styles.cardShimmerEdge, { backgroundColor: accent }]} />

      {/* thumbnail area */}
      <View style={styles.thumbArea}>
        <View style={[styles.iconContainer, { borderColor: `${accent}44` }]}>
          <View style={[styles.iconInner, { backgroundColor: `${accent}18` }]}>
            <Text style={[styles.thumbIcon, { color: accent }]}>▶</Text>
          </View>
        </View>

        <View style={styles.thumbMeta}>
          <View
            style={[
              styles.typePill,
              {
                backgroundColor: video.type === 'free' ? '#D1FAE5' : '#EDE9FE',
                borderColor: video.type === 'free' ? '#6EE7B7' : '#C4B5FD',
              },
            ]}
          >
            <Text
              style={[
                styles.typePillText,
                { color: video.type === 'free' ? '#059669' : '#7C3AED' },
              ]}
            >
              {video.type === 'free' ? 'Free' : 'Paid'}
            </Text>
          </View>

          <View style={[styles.durationChip, { backgroundColor: `${accent}14` }]}>
            <Text style={[styles.durationText, { color: accent }]}>{video.duration}</Text>
          </View>
        </View>
      </View>

      {/* title */}
      <Text style={styles.cardTitle} numberOfLines={2}>
        {video.title}
      </Text>

      {/* subject */}
      <Text style={styles.cardSubject} numberOfLines={1}>
        {video.subject}
      </Text>

      {/* stats */}
      <View style={styles.cardStatsRow}>
        <View style={styles.cardStatItem}>
          <Text style={[styles.cardStatIcon, { color: accent }]}>👁</Text>
          <Text style={styles.cardStatText}>{video.views}</Text>
        </View>
        <View style={styles.cardStatItem}>
          <Text style={[styles.cardStatIcon, { color: accent }]}>★</Text>
          <Text style={styles.cardStatText}>{video.rating}</Text>
        </View>
      </View>

      {/* divider */}
      <View style={[styles.cardDivider, { backgroundColor: `${accent}22` }]} />

      {/* footer */}
      <View style={styles.cardFooter}>
        <TouchableOpacity
          onPress={() => onToggleStatus(video.id)}
          activeOpacity={0.8}
          style={[
            styles.statusBadge,
            {
              backgroundColor: isActive ? '#D1FAE5' : '#F3F4F6',
              borderColor: isActive ? '#6EE7B7' : '#E5E7EB',
            },
          ]}
        >
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isActive ? '#10B981' : '#9CA3AF' },
            ]}
          />
          <Text
            style={[
              styles.statusText,
              { color: isActive ? '#059669' : '#6B7280' },
            ]}
          >
            {isActive ? 'Active' : 'Inactive'}
          </Text>
        </TouchableOpacity>

        <View style={styles.cardActionRow}>
          <TouchableOpacity
            onPress={() => onEdit(video.id)}
            activeOpacity={0.8}
            style={[styles.actionBtn, { borderColor: `${accent}44`, backgroundColor: `${accent}10` }]}
          >
            <Text style={[styles.actionBtnIcon, { color: accent }]}>✏</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDelete(video.id)}
            activeOpacity={0.8}
            style={styles.actionBtnDanger}
          >
            <Text style={styles.actionBtnDangerIcon}>🗑</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function ExpertVideosScreen(): React.ReactElement {
  const [videos, setVideos] = useState<ExpertVideo[]>(MOCK_VIDEOS);
  const [statusMap, setStatusMap] = useState<Record<number, VideoStatus>>(
    () => Object.fromEntries(MOCK_VIDEOS.map((v) => [v.id, v.status])),
  );
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  function handleToggleStatus(id: number) {
    setStatusMap((prev) => ({
      ...prev,
      [id]: prev[id] === 'active' ? 'inactive' : 'active',
    }));
  }

  function handleDelete(id: number) {
    setVideos((prev) => prev.filter((v) => v.id !== id));
  }

  function handleEdit(_id: number) {
    // navigate to edit screen
  }

  const filtered = videos.filter((v) => {
    if (activeFilter === 'free') return v.type === 'free';
    if (activeFilter === 'paid') return v.type === 'paid';
    return true;
  });

  const freeCount = videos.filter((v) => v.type === 'free').length;
  const paidCount = videos.filter((v) => v.type === 'paid').length;

  const pairs: (ExpertVideo | null)[][] = [];
  for (let i = 0; i < filtered.length; i += 2) {
    pairs.push([filtered[i] ?? null, filtered[i + 1] ?? null]);
  }
  const navigation = useNavigation<NavigationProp<AccountStackParamList>>();

  return (
    <SafeAreaWrapper edges={['top', 'bottom']} bgColor="white">
      <ScreenHeader
        title="Expert Video"
        onBackPress={() => navigation.goBack()}
      />
      <ScreenWrapper style={styles.screen}>
        <FlatList
          data={pairs}
          keyExtractor={(_, i) => String(i)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <>
              <TouchableOpacity style={styles.addBtn} activeOpacity={0.85}>
                <Text style={styles.addBtnPlus}>+</Text>
                <Text style={styles.addBtnText}>Add Expert Video</Text>
              </TouchableOpacity>

              <SectionHeader count={videos.length} />

              <View style={styles.statsRow}>
                <StatCard label="Total" value={videos.length} />
                <StatCard label="Free" value={freeCount} />
                <StatCard label="Paid" value={paidCount} />
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterRow}
              >
                {FILTER_OPTIONS.map((f) => (
                  <FilterChip
                    key={f.key}
                    label={f.label}
                    active={activeFilter === f.key}
                    onPress={() => setActiveFilter(f.key)}
                  />
                ))}
              </ScrollView>
            </>
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📹</Text>
              <Text style={styles.emptyText}>No videos found</Text>
              <Text style={styles.emptySubText}>Try a different filter</Text>
            </View>
          }
          renderItem={({ item: pair }) => (
            <View style={styles.gridRow}>
              {pair.map((video, colIdx) =>
                video ? (
                  <View key={video.id} style={styles.gridCell}>
                    <VideoCard
                      video={video}
                      index={filtered.indexOf(video)}
                      statusMap={statusMap}
                      onToggleStatus={handleToggleStatus}
                      onDelete={handleDelete}
                      onEdit={handleEdit}
                    />
                  </View>
                ) : (
                  <View key={`empty-${colIdx}`} style={styles.gridCell} />
                ),
              )}
            </View>
          )}
        />
      </ScreenWrapper>
    </SafeAreaWrapper>
  );
}