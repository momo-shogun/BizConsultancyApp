import React, { memo } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type { ConsultantExpertVideo } from '@/features/ConsultantSelf/types/consultantSelf.types';
import { resolveAwsImageUrl } from '@/utils/awsImageUrl';

export interface ExpertVideoCardProps {
  video: ConsultantExpertVideo;
  displayActive: boolean;
  isStatusUpdating: boolean;
  isDeleting: boolean;
  isLocked: boolean;
  onToggleStatus: (nextActive: boolean) => void;
  onDelete: () => void;
}

function formatDuration(minutes: number): string {
  if (minutes <= 0) {
    return '0:00';
  }
  if (minutes < 60) {
    return `${minutes}:00`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}:${mins.toString().padStart(2, '0')}:00`;
}

function ExpertVideoCardComponent({
  video,
  displayActive,
  isStatusUpdating,
  isDeleting,
  isLocked,
  onToggleStatus,
  onDelete,
}: ExpertVideoCardProps): React.ReactElement {
  const thumbUri = resolveAwsImageUrl(video.thumbnail);
  const isPaid = video.type === 'paid';
  const segmentLabel = video.segment?.name ?? video.industry?.name ?? 'Expertise';
  const controlsDisabled = isStatusUpdating || isDeleting || isLocked;

  const statusHint = isStatusUpdating
    ? 'Saving visibility…'
    : displayActive
      ? 'Active — clients can discover this video'
      : 'Inactive — video is hidden from clients';

  return (
    <View
      style={[
        styles.card,
        !displayActive && !isStatusUpdating ? styles.cardInactive : null,
        controlsDisabled && !isStatusUpdating ? styles.cardLocked : null,
      ]}
    >
      <View style={styles.mainRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Open video ${video.title}`}
          disabled={isStatusUpdating || isDeleting}
          onPress={() => void Linking.openURL(video.url)}
          style={({ pressed }) => [styles.thumbPressable, pressed ? styles.pressed : null]}
        >
          <View style={styles.thumbWrap}>
            {thumbUri != null ? (
              <Image source={{ uri: thumbUri }} style={styles.thumb} resizeMode="cover" />
            ) : (
              <View style={styles.thumbPlaceholder}>
                <Ionicons name="play" size={22} color="#FFFFFF" />
              </View>
            )}
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>{formatDuration(video.duration || 0)}</Text>
            </View>
            {!displayActive && !isStatusUpdating ? (
              <View style={styles.hiddenOverlay}>
                <Ionicons name="eye-off-outline" size={14} color="#FFFFFF" />
                <Text style={styles.hiddenText}>Hidden</Text>
              </View>
            ) : null}
          </View>
        </Pressable>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {video.title}
          </Text>
          <Text style={styles.channelLine} numberOfLines={1}>
            {segmentLabel}
            {video.industry?.name != null && video.segment?.name != null
              ? ` · ${video.industry.name}`
              : ''}
          </Text>
          <View style={styles.metaRow}>
            <View style={[styles.typeChip, isPaid ? styles.typeChipPaid : styles.typeChipFree]}>
              <Text style={[styles.typeChipText, isPaid ? styles.typeChipPaidText : styles.typeChipFreeText]}>
                {isPaid ? 'Paid' : 'Free'}
              </Text>
            </View>
            {isPaid ? (
              <Text style={styles.priceText}>₹{Number(video.amount).toFixed(0)}</Text>
            ) : null}
            <Text style={styles.metaDot}>·</Text>
            <Pressable
              accessibilityRole="link"
              disabled={isStatusUpdating || isDeleting}
              onPress={() => void Linking.openURL(video.url)}
              hitSlop={6}
            >
              <Text style={styles.linkText} numberOfLines={1}>
                Watch link
              </Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Delete video"
          disabled={controlsDisabled}
          onPress={onDelete}
          hitSlop={8}
          style={({ pressed }) => [
            styles.moreBtn,
            controlsDisabled ? styles.moreBtnDisabled : null,
            pressed && !controlsDisabled ? styles.pressed : null,
          ]}
        >
          {isDeleting ? (
            <ActivityIndicator size="small" color="#94A3B8" />
          ) : (
            <Ionicons name="trash-outline" size={20} color={controlsDisabled ? '#CBD5E1' : '#606060'} />
          )}
        </Pressable>
      </View>

      <View style={[styles.statusBar, isStatusUpdating ? styles.statusBarPending : null]}>
        <View style={styles.statusCopy}>
          <Text style={styles.statusHeading}>Visibility</Text>
          <Text style={[styles.statusHint, isStatusUpdating ? styles.statusHintPending : null]}>
            {statusHint}
          </Text>
        </View>

        <View style={styles.statusControl}>
          <View
            style={[
              styles.statusBadge,
              isStatusUpdating
                ? styles.statusBadgePending
                : displayActive
                  ? styles.statusBadgeOn
                  : styles.statusBadgeOff,
            ]}
          >
            {isStatusUpdating ? (
              <ActivityIndicator size="small" color="#15803D" style={styles.badgeSpinner} />
            ) : null}
            <Text
              style={[
                styles.statusBadgeText,
                isStatusUpdating
                  ? styles.statusBadgeTextPending
                  : displayActive
                    ? styles.statusBadgeTextOn
                    : styles.statusBadgeTextOff,
              ]}
            >
              {isStatusUpdating ? 'Updating' : displayActive ? 'Active' : 'Inactive'}
            </Text>
          </View>

          <View style={styles.switchWrap}>
            {isStatusUpdating ? (
              <View style={styles.switchOverlay} pointerEvents="none" />
            ) : null}
            <Switch
              accessibilityRole="switch"
              accessibilityLabel={
                displayActive ? 'Set video inactive' : 'Set video active'
              }
              accessibilityState={{
                checked: displayActive,
                disabled: controlsDisabled,
                busy: isStatusUpdating,
              }}
              value={displayActive}
              disabled={controlsDisabled}
              onValueChange={onToggleStatus}
              trackColor={{ false: '#D1D5DB', true: '#86EFAC' }}
              thumbColor={displayActive ? '#16A34A' : '#F9FAFB'}
              ios_backgroundColor="#D1D5DB"
            />
          </View>
        </View>
      </View>
    </View>
  );
}

export const ExpertVideoCard = memo(ExpertVideoCardComponent);

const THUMB_WIDTH = 128;
const THUMB_HEIGHT = 72;

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5E5',
  },
  cardInactive: {
    opacity: 0.92,
  },
  cardLocked: {
    opacity: 0.72,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 12,
    paddingHorizontal: 12,
    gap: 10,
  },
  thumbPressable: {
    flexShrink: 0,
  },
  thumbWrap: {
    width: THUMB_WIDTH,
    height: THUMB_HEIGHT,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#0F0F0F',
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  thumbPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#272727',
  },
  durationBadge: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.82)',
  },
  durationText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  hiddenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15,23,42,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  hiddenText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  content: {
    flex: 1,
    minWidth: 0,
    paddingTop: 2,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F0F0F',
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  channelLine: {
    fontSize: 12,
    color: '#606060',
    lineHeight: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  typeChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeChipFree: {
    backgroundColor: '#E8F5E9',
  },
  typeChipPaid: {
    backgroundColor: '#F3E8FF',
  },
  typeChipText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  typeChipFreeText: {
    color: '#2E7D32',
  },
  typeChipPaidText: {
    color: '#6D28D9',
  },
  priceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F0F0F',
  },
  metaDot: {
    fontSize: 12,
    color: '#909090',
  },
  linkText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#065FD4',
    maxWidth: 100,
  },
  moreBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -2,
  },
  moreBtnDisabled: {
    opacity: 0.5,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F9F9F9',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5E5',
    gap: 12,
  },
  statusBarPending: {
    backgroundColor: '#F0FDF4',
    borderTopColor: '#BBF7D0',
  },
  statusCopy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  statusHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F0F0F',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  statusHint: {
    fontSize: 11,
    color: '#606060',
    lineHeight: 15,
  },
  statusHintPending: {
    color: '#15803D',
    fontWeight: '600',
  },
  statusControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 84,
    justifyContent: 'center',
  },
  statusBadgeOn: {
    backgroundColor: '#DCFCE7',
  },
  statusBadgeOff: {
    backgroundColor: '#F1F5F9',
  },
  statusBadgePending: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  badgeSpinner: {
    transform: [{ scale: 0.85 }],
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusBadgeTextOn: {
    color: '#166534',
  },
  statusBadgeTextOff: {
    color: '#64748B',
  },
  statusBadgeTextPending: {
    color: '#15803D',
  },
  switchWrap: {
    position: 'relative',
  },
  switchOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  pressed: {
    opacity: 0.88,
  },
});
