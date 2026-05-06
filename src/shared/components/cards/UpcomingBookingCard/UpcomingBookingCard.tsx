import React, { useMemo } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, type DimensionValue } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';

export interface UpcomingBookingItem {
  id: string;
  dateLabel: string;
  timeLabel: string;
  consultantName: string;
  consultantTitle?: string;
  callType: 'video' | 'audio';
  statusLabel?: string;
}

export interface UpcomingBookingCardProps {
  item: UpcomingBookingItem;
  cardWidth?: DimensionValue;
  onPress?: () => void;
  onJoinCallPress?: () => void;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : '';
  return (first + last).toUpperCase();
}

export function UpcomingBookingCard({
  item,
  cardWidth = 300,
  onPress,
  onJoinCallPress,
}: UpcomingBookingCardProps): React.ReactElement {
  const a11y = useMemo(() => {
    const type = item.callType === 'video' ? 'Video call' : 'Audio call';
    return `${item.consultantName}. ${type}. ${item.dateLabel} ${item.timeLabel}.`;
  }, [item.callType, item.consultantName, item.dateLabel, item.timeLabel]);

  const callTypeLabel = item.callType === 'video' ? 'Video call' : 'Audio call';
  const callIcon = item.callType === 'video' ? 'videocam-outline' : 'call-outline';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11y}
      accessibilityHint={onPress != null ? 'Opens booking details' : undefined}
      onPress={onPress}
      style={({ pressed }) => [
        styles.root,
        { width: cardWidth },
        pressed && onPress != null ? styles.pressed : null,
      ]}
    >
      <View style={styles.topBar}>
        {/* <Text style={styles.topLeft} numberOfLines={1}>
          {item.id}
        </Text> */}
        <Text style={styles.topRight} numberOfLines={1}>
          {item.dateLabel}
        </Text>
      </View>

      <View style={styles.body}>
        <View style={styles.rowBetween}>
          <View style={styles.consultantBlock}>
            <Text style={styles.consultantTitleSmall} numberOfLines={1}>
              {item.consultantTitle ?? 'Consultation'}
            </Text>
            <Text style={styles.headline} numberOfLines={1}>
              {item.consultantName}
            </Text>
          </View>

          <View style={styles.statusPill}>
            <Text style={styles.statusText} numberOfLines={1}>
              {item.statusLabel ?? 'Upcoming'}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.bottomRow}>
          <View style={styles.metaLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials(item.consultantName)}</Text>
            </View>
            <View style={styles.metaText}>
              <View style={styles.metaLine}>
                <Ionicons name="time-outline" size={14} color={THEME.colors.textSecondary} />
                <Text style={styles.meta} numberOfLines={1}>
                  {item.timeLabel}
                </Text>
              </View>
              <View style={styles.metaLine}>
                <Ionicons name={callIcon} size={14} color={THEME.colors.primary} />
                <Text style={styles.metaStrong} numberOfLines={1}>
                  {callTypeLabel}
                </Text>
              </View>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Join call"
            onPress={onJoinCallPress}
            disabled={onJoinCallPress == null}
            hitSlop={8}
            style={({ pressed }) => [
              styles.joinBtn,
              pressed && onJoinCallPress != null ? styles.joinBtnPressed : null,
              onJoinCallPress == null ? styles.joinBtnDisabled : null,
            ]}
          >
            <Text style={styles.joinText}>Join call</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

UpcomingBookingCard.displayName = 'UpcomingBookingCard';

const TOP_BAR_HEIGHT = 44;
const RADIUS = 20;

const styles = StyleSheet.create({
  root: {
    marginRight: THEME.spacing[12],
    borderRadius: RADIUS,
    backgroundColor: THEME.colors.white,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 14,
      },
      default: {
        elevation: 3,
      },
    }),
  },
  pressed: {
    opacity: 0.96,
    transform: [{ scale: 0.995 }],
  },
  topBar: {
    height: TOP_BAR_HEIGHT,
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: THEME.spacing[16],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topLeft: {
    color: THEME.colors.white,
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    letterSpacing: 0.6,
    opacity: 0.95,
  },
  topRight: {
    color: THEME.colors.white,
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    opacity: 0.95,
  },
  body: {
    padding: THEME.spacing[16],
    gap: THEME.spacing[12],
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: THEME.spacing[12],
  },
  consultantBlock: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  consultantTitleSmall: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
  },
  headline: {
    fontSize: THEME.typography.size[20],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.25,
  },
  statusPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(37, 99, 235, 0.10)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(37, 99, 235, 0.18)',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
    color: '#2563EB',
  },
  divider: {
    height: 1,
    backgroundColor: THEME.colors.border,
    opacity: 0.8,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: THEME.spacing[12],
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[12],
    flex: 1,
    minWidth: 0,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: THEME.colors.textPrimary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  metaText: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  metaLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  meta: {
    color: THEME.colors.textSecondary,
    fontSize: THEME.typography.size[12],
    lineHeight: 18,
    flex: 1,
  },
  metaStrong: {
    color: THEME.colors.textPrimary,
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    lineHeight: 18,
    flex: 1,
  },
  joinBtn: {
    flexShrink: 0,
    paddingHorizontal: 16,
    height: 40,
    borderRadius: 999,
    backgroundColor: '#0B1220',
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinBtnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  joinBtnDisabled: {
    opacity: 0.6,
  },
  joinText: {
    color: THEME.colors.white,
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
  },
});

