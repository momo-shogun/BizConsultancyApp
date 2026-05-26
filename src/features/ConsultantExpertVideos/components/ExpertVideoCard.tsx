import React, { memo } from 'react';
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type { ConsultantExpertVideo } from '@/features/ConsultantSelf/types/consultantSelf.types';
import { resolveAwsImageUrl } from '@/utils/awsImageUrl';

export interface ExpertVideoCardProps {
  video: ConsultantExpertVideo;
  isBusy: boolean;
  onToggleStatus: () => void;
  onDelete: () => void;
}

function ExpertVideoCardComponent({
  video,
  isBusy,
  onToggleStatus,
  onDelete,
}: ExpertVideoCardProps): React.ReactElement {
  const thumbUri = resolveAwsImageUrl(video.thumbnail);
  const isActive = video.status === 1;
  const isPaid = video.type === 'paid';

  return (
    <View style={styles.card}>
      <View style={styles.thumbWrap}>
        {thumbUri != null ? (
          <Image source={{ uri: thumbUri }} style={styles.thumb} resizeMode="cover" />
        ) : (
          <View style={styles.thumbPlaceholder}>
            <Ionicons name="videocam-outline" size={22} color="#EA580C" />
          </View>
        )}
        <View style={[styles.typePill, isPaid ? styles.typePaid : styles.typeFree]}>
          <Text style={[styles.typeText, isPaid ? styles.typePaidText : styles.typeFreeText]}>
            {isPaid ? 'Paid' : 'Free'}
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {video.title}
        </Text>
        <Pressable accessibilityRole="link" onPress={() => void Linking.openURL(video.url)}>
          <Text style={styles.url} numberOfLines={1}>
            {video.url}
          </Text>
        </Pressable>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>{video.duration || 0}m</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.meta} numberOfLines={1}>
            {video.segment?.name ?? '—'}
          </Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.meta}>{isPaid ? `₹${Number(video.amount).toFixed(0)}` : 'Free'}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          disabled={isBusy}
          onPress={onToggleStatus}
          style={({ pressed }) => [
            styles.statusBtn,
            isActive ? styles.statusActive : styles.statusInactive,
            pressed ? styles.pressed : null,
          ]}
        >
          <Text style={[styles.statusText, isActive ? styles.statusActiveText : styles.statusInactiveText]}>
            {isActive ? 'Active' : 'Inactive'}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          disabled={isBusy}
          onPress={onDelete}
          style={({ pressed }) => [styles.deleteBtn, pressed ? styles.pressed : null]}
        >
          <Ionicons name="trash-outline" size={16} color="#DC2626" />
        </Pressable>
      </View>
    </View>
  );
}

export const ExpertVideoCard = memo(ExpertVideoCardComponent);

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8EEF4',
    padding: 12,
    gap: 12,
  },
  thumbWrap: { position: 'relative' },
  thumb: { width: '100%', height: 120, borderRadius: 12 },
  thumbPlaceholder: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typePill: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeFree: { backgroundColor: '#D1FAE5' },
  typePaid: { backgroundColor: '#EDE9FE' },
  typeText: { fontSize: 11, fontWeight: '700' },
  typeFreeText: { color: '#047857' },
  typePaidText: { color: '#6D28D9' },
  body: { gap: 4 },
  title: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  url: { fontSize: 12, color: '#059669', fontWeight: '600' },
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 4 },
  meta: { fontSize: 12, color: '#64748B' },
  metaDot: { fontSize: 12, color: '#CBD5E1' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  statusActive: { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' },
  statusInactive: { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' },
  statusText: { fontSize: 13, fontWeight: '700' },
  statusActiveText: { color: '#047857' },
  statusInactiveText: { color: '#64748B' },
  deleteBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.88 },
});
