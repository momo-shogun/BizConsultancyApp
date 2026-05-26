import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { CreateExpertVideoModal } from '@/features/ConsultantExpertVideos/components/CreateExpertVideoModal';
import { ExpertVideoCard } from '@/features/ConsultantExpertVideos/components/ExpertVideoCard';
import {
  useCreateMyExpertVideoMutation,
  useDeleteMyExpertVideoMutation,
  useGetMyExpertVideosQuery,
  useUpdateMyExpertVideoStatusMutation,
} from '@/features/ConsultantSelf/api/consultantSelfApi';
import type { ConsultantExpertVideo, ExpertVideoFilterTab } from '@/features/ConsultantSelf/types/consultantSelf.types';
import { PROFILE_HEADER_GRADIENT } from '@/features/Profile/constants/profileScreenTheme';
import { ROUTES } from '@/navigation/routeNames';
import type { AccountStackParamList } from '@/navigation/types';
import { SafeAreaWrapper, ScreenHeader } from '@/shared/components';
import { showGlobalToast } from '@/shared/components/toast';
import { THEME } from '@/constants/theme';
import { getApiErrorMessage } from '@/utils/apiError';

const CANVAS = '#F4F7FB';

const FILTER_TABS: Array<{ id: ExpertVideoFilterTab; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'free', label: 'Free' },
  { id: 'paid', label: 'Paid' },
];

type Nav = NativeStackNavigationProp<
  AccountStackParamList,
  typeof ROUTES.Account.ExpertVideosScreen
>;

export function ConsultantExpertVideosScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const [activeTab, setActiveTab] = useState<ExpertVideoFilterTab>('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [busyVideoId, setBusyVideoId] = useState<number | null>(null);

  const {
    data: videos = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetMyExpertVideosQuery();
  const [createVideo, { isLoading: isCreating }] = useCreateMyExpertVideoMutation();
  const [updateStatus] = useUpdateMyExpertVideoStatusMutation();
  const [deleteVideo] = useDeleteMyExpertVideoMutation();

  const errorMessage =
    error != null ? getApiErrorMessage(error, 'Failed to load expert videos') : null;

  const filtered = useMemo(() => {
    if (activeTab === 'all') {
      return videos;
    }
    return videos.filter((video) => video.type === activeTab);
  }, [activeTab, videos]);

  const tabCounts = useMemo(
    () => ({
      all: videos.length,
      free: videos.filter((v) => v.type === 'free').length,
      paid: videos.filter((v) => v.type === 'paid').length,
    }),
    [videos],
  );

  const handleCreate = useCallback(
    async (payload: Parameters<typeof createVideo>[0]): Promise<void> => {
      const normalized = payload.title.trim().toLowerCase();
      if (
        videos.some((video) => video.title.trim().toLowerCase() === normalized)
      ) {
        showGlobalToast({ variant: 'error', message: 'A video with this title already exists.' });
        return;
      }
      try {
        await createVideo(payload).unwrap();
        setCreateOpen(false);
        showGlobalToast('Expert video added');
      } catch (err: unknown) {
        showGlobalToast(getApiErrorMessage(err, 'Failed to add video'));
      }
    },
    [createVideo, videos],
  );

  const handleToggleStatus = useCallback(
    async (video: ConsultantExpertVideo): Promise<void> => {
      setBusyVideoId(video.id);
      const nextStatus = video.status === 1 ? 0 : 1;
      try {
        await updateStatus({ id: video.id, status: nextStatus }).unwrap();
      } catch (err: unknown) {
        showGlobalToast(getApiErrorMessage(err, 'Failed to update status'));
      } finally {
        setBusyVideoId(null);
      }
    },
    [updateStatus],
  );

  const handleDelete = useCallback(
    (video: ConsultantExpertVideo): void => {
      Alert.alert('Delete video?', 'This cannot be undone.', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setBusyVideoId(video.id);
            void (async (): Promise<void> => {
              try {
                await deleteVideo(video.id).unwrap();
                showGlobalToast('Video deleted');
              } catch (err: unknown) {
                showGlobalToast(getApiErrorMessage(err, 'Failed to delete video'));
              } finally {
                setBusyVideoId(null);
              }
            })();
          },
        },
      ]);
    },
    [deleteVideo],
  );

  if (isLoading) {
    return (
      <SafeAreaWrapper edges={['top', 'bottom']} bgColor={CANVAS}>
        <ScreenHeader title="Expert Video" onBackPress={() => navigation.goBack()} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#EA580C" />
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper edges={['top', 'bottom']} bgColor={CANVAS}>
      <ScreenHeader title="Expert Video" onBackPress={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            tintColor="#EA580C"
          />
        }
      >
        <LinearGradient
          colors={[...PROFILE_HEADER_GRADIENT]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroRow}>
            <View style={styles.heroText}>
              <Text style={styles.heroEyebrow}>Consultant dashboard</Text>
              <Text style={styles.heroTitle}>Expert videos</Text>
              <Text style={styles.heroSubtitle}>
                Publish free or paid sessions linked to your expertise industries.
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => setCreateOpen(true)}
              style={({ pressed }) => [styles.addBtn, pressed ? styles.pressed : null]}
            >
              <Ionicons name="add" size={18} color="#EA580C" />
              <Text style={styles.addBtnText}>Add</Text>
            </Pressable>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Total</Text>
              <Text style={styles.statValue}>{tabCounts.all}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Free</Text>
              <Text style={styles.statValue}>{tabCounts.free}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Paid</Text>
              <Text style={styles.statValue}>{tabCounts.paid}</Text>
            </View>
          </View>
        </LinearGradient>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsRow}
        >
          {FILTER_TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <Pressable
                key={tab.id}
                accessibilityRole="button"
                onPress={() => setActiveTab(tab.id)}
                style={[styles.tab, active ? styles.tabActive : null]}
              >
                <Text style={[styles.tabText, active ? styles.tabTextActive : null]}>
                  {tab.label} ({tabCounts[tab.id]})
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {errorMessage != null ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <Pressable onPress={refetch}>
              <Text style={styles.retry}>Retry</Text>
            </Pressable>
          </View>
        ) : null}

        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name="videocam-outline" size={28} color="#EA580C" />
            </View>
            <Text style={styles.emptyTitle}>No videos yet</Text>
            <Text style={styles.emptyBody}>
              {activeTab === 'all'
                ? 'Add your first expert video to showcase your knowledge.'
                : 'No videos match this filter.'}
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {filtered.map((video) => (
              <ExpertVideoCard
                key={video.id}
                video={video}
                isBusy={busyVideoId === video.id}
                onToggleStatus={() => void handleToggleStatus(video)}
                onDelete={() => handleDelete(video)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <CreateExpertVideoModal
        visible={createOpen}
        isBusy={isCreating}
        onClose={() => setCreateOpen(false)}
        onSubmit={(payload) => void handleCreate(payload)}
      />
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: THEME.spacing[16],
    paddingBottom: THEME.spacing[28],
  },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  hero: {
    borderRadius: 20,
    padding: THEME.spacing[16],
    marginBottom: THEME.spacing[12],
    overflow: 'hidden',
  },
  heroRow: { flexDirection: 'row', gap: 12 },
  heroText: { flex: 1 },
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
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  addBtnText: { fontSize: 13, fontWeight: '700', color: '#EA580C' },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  statCard: {
    flex: 1,
    padding: 10,
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
  statValue: { marginTop: 2, fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  tabsRow: { gap: 8, paddingBottom: 14 },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabActive: { backgroundColor: '#EA580C', borderColor: '#EA580C' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  tabTextActive: { color: '#FFFFFF' },
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
    backgroundColor: 'rgba(234,88,12,0.10)',
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
  list: { gap: 12 },
  pressed: { opacity: 0.9 },
});
