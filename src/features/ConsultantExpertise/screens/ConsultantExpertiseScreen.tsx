import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Image,
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

import { AddExpertiseModal } from '@/features/ConsultantExpertise/components/AddExpertiseModal';
import {
  useGetMyConsultantIndustriesQuery,
  useSetMyConsultantIndustriesMutation,
} from '@/features/ConsultantSelf/api/consultantSelfApi';
import type { ConsultantIndustryItem } from '@/features/ConsultantSelf/types/consultantSelf.types';
import { PROFILE_HEADER_GRADIENT } from '@/features/Profile/constants/profileScreenTheme';
import { ROUTES } from '@/navigation/routeNames';
import type { AccountStackParamList } from '@/navigation/types';
import { SafeAreaWrapper, ScreenHeader } from '@/shared/components';
import { showGlobalToast } from '@/shared/components/toast';
import { THEME } from '@/constants/theme';
import { resolveAwsImageUrl } from '@/utils/awsImageUrl';
import { getApiErrorMessage } from '@/utils/apiError';

const CANVAS = '#F4F7FB';

type Nav = NativeStackNavigationProp<
  AccountStackParamList,
  typeof ROUTES.Account.ConsultantExpertise
>;

export function ConsultantExpertiseScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const [addOpen, setAddOpen] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const {
    data: industries = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetMyConsultantIndustriesQuery();
  const [setIndustries, { isLoading: isSaving }] = useSetMyConsultantIndustriesMutation();

  const errorMessage =
    error != null ? getApiErrorMessage(error, 'Failed to load expertise') : null;

  const handleAdd = useCallback(
    async (payload: {
      categoryId: number;
      segmentId: number;
      industryId: number;
    }): Promise<void> => {
      if (industries.some((row) => row.industryId === payload.industryId)) {
        showGlobalToast({
          variant: 'error',
          message: 'This industry is already in your expertise.',
        });
        return;
      }

      const items = [
        ...industries.map((row) => ({
          industryId: row.industryId,
          segmentId: row.segmentId ?? row.segment?.id ?? undefined,
        })),
        { industryId: payload.industryId, segmentId: payload.segmentId },
      ];

      try {
        await setIndustries(items).unwrap();
        setAddOpen(false);
        showGlobalToast('Industry added to your expertise');
      } catch (err: unknown) {
        showGlobalToast(getApiErrorMessage(err, 'Failed to add industry'));
      }
    },
    [industries, setIndustries],
  );

  const handleRemove = useCallback(
    async (item: ConsultantIndustryItem): Promise<void> => {
      setRemovingId(item.id);
      const next = industries
        .filter((row) => row.id !== item.id)
        .map((row) => ({
          industryId: row.industryId,
          segmentId: row.segmentId ?? row.segment?.id ?? undefined,
        }));
      try {
        await setIndustries(next).unwrap();
        showGlobalToast('Industry removed');
      } catch (err: unknown) {
        showGlobalToast(getApiErrorMessage(err, 'Failed to remove industry'));
      } finally {
        setRemovingId(null);
      }
    },
    [industries, setIndustries],
  );

  if (isLoading) {
    return (
      <SafeAreaWrapper edges={['top', 'bottom']} bgColor={CANVAS}>
        <ScreenHeader title="Expertise" onBackPress={() => navigation.goBack()} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#DB2777" />
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper edges={['top', 'bottom']} bgColor={CANVAS}>
      <ScreenHeader title="Expertise" onBackPress={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isFetching && !isLoading} onRefresh={refetch} tintColor="#DB2777" />
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
              <Text style={styles.heroTitle}>Expertise</Text>
              <Text style={styles.heroSubtitle}>
                Showcase the industries and segments you consult on.
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => setAddOpen(true)}
              style={({ pressed }) => [styles.addBtn, pressed ? styles.pressed : null]}
            >
              <Ionicons name="add" size={18} color="#DB2777" />
              <Text style={styles.addBtnText}>Add</Text>
            </Pressable>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Industries</Text>
            <Text style={styles.statValue}>{industries.length}</Text>
          </View>
        </LinearGradient>

        {errorMessage != null ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <Pressable onPress={refetch}>
              <Text style={styles.retry}>Retry</Text>
            </Pressable>
          </View>
        ) : null}

        {industries.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name="ribbon-outline" size={28} color="#DB2777" />
            </View>
            <Text style={styles.emptyTitle}>No industries yet</Text>
            <Text style={styles.emptyBody}>
              Add expertise areas so clients can find you for the right topics.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => setAddOpen(true)}
              style={({ pressed }) => [styles.emptyCta, pressed ? styles.pressed : null]}
            >
              <Text style={styles.emptyCtaText}>Add industry</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.list}>
            {industries.map((item) => {
              const thumb = item.industry?.thumbnail;
              const imageUri = thumb != null ? resolveAwsImageUrl(thumb) : null;
              return (
                <View key={item.id} style={styles.card}>
                  <View style={styles.thumb}>
                    {imageUri != null && imageUri.length > 0 ? (
                      <Image source={{ uri: imageUri }} style={styles.thumbImage} />
                    ) : (
                      <Ionicons name="briefcase-outline" size={22} color="#059669" />
                    )}
                  </View>
                  <View style={styles.cardBody}>
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {item.industry?.name ?? `Industry #${item.industryId}`}
                    </Text>
                    <Text style={styles.cardSub} numberOfLines={1}>
                      {item.segment?.name ?? 'Segment'}
                    </Text>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    disabled={removingId === item.id || isSaving}
                    onPress={() => void handleRemove(item)}
                    style={({ pressed }) => [
                      styles.removeBtn,
                      pressed ? styles.pressed : null,
                      removingId === item.id ? styles.disabled : null,
                    ]}
                  >
                    <Text style={styles.removeText}>
                      {removingId === item.id ? '…' : 'Remove'}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      <AddExpertiseModal
        visible={addOpen}
        isBusy={isSaving}
        onClose={() => setAddOpen(false)}
        onSubmit={(payload) => void handleAdd(payload)}
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
    marginBottom: THEME.spacing[14],
    overflow: 'hidden',
  },
  heroRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  heroText: { flex: 1 },
  heroEyebrow: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  heroTitle: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
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
  addBtnText: { fontSize: 13, fontWeight: '700', color: '#DB2777' },
  statCard: {
    marginTop: 14,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 10,
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
  statValue: { marginTop: 2, fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
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
  empty: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 20 },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: 'rgba(219,39,119,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  emptyBody: {
    marginTop: 8,
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyCta: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: '#DB2777',
  },
  emptyCtaText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  list: { gap: 10 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8EEF4',
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbImage: { width: '100%', height: '100%' },
  cardBody: { flex: 1, minWidth: 0 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  cardSub: { marginTop: 2, fontSize: 12, color: '#64748B' },
  removeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  removeText: { fontSize: 12, fontWeight: '700', color: '#DC2626' },
  pressed: { opacity: 0.9 },
  disabled: { opacity: 0.5 },
});
