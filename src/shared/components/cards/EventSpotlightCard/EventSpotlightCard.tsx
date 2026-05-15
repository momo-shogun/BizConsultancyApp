import React, { useMemo, useState } from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View, type DimensionValue } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';

/** Accent used for pills & favorite control (warm yellow, high contrast). */
export const EVENT_SPOTLIGHT_ACCENT = '#FFD60A';
const TAG_TEXT = '#0A0A0A';
const MAX_TAG_COUNT = 2;
const MAX_TAG_CHARS_DEFAULT = 34;
const MAX_TAG_CHARS_COMPACT = 22;

function truncateTagLabel(label: string, maxChars: number): string {
  const trimmed = label.trim();
  if (trimmed.length <= maxChars) {
    return trimmed;
  }
  return `${trimmed.slice(0, maxChars - 1).trimEnd()}…`;
}

export type EventSpotlightItem = {
  /** From API: numeric id. */
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  slug: string;
  type: string;
  thumbnail: string;
  description: string;
  highlightPoints?: string;
  keywords?: string;
  startDate: string; // yyyy-mm-dd
  endDate?: string; // yyyy-mm-dd
  startTime?: string; // hh:mm:ss
  endTime?: string; // hh:mm:ss
  place?: string;
  mapLocation?: string;
  contactNumber?: string;
  segmentId?: number;
  industryId?: number;
  onlineFee?: string;
  offlineFee?: string;
  isOnlineAvailable?: number;
  isLiveWorkshop?: number;
  externalUrlOnline?: string;
  externalUrlOffline?: string;
  workshopUrl?: string;
  status?: number;
  createdBy?: unknown | null;
  updatedBy?: unknown | null;
  deletedBy?: unknown | null;
  isDeleted?: number;
};

export type EventSpotlightCardVariant = 'default' | 'compact';

export interface EventSpotlightCardProps {
  item: EventSpotlightItem;
  cardWidth?: DimensionValue;
  variant?: EventSpotlightCardVariant;
  onPress?: () => void;
}

const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

function parseYyyyMmDd(value?: string): { y: number; m: number; d: number } | null {
  if (!value) return null;
  const [yRaw, mRaw, dRaw] = value.split('-');
  const y = Number(yRaw);
  const m = Number(mRaw);
  const d = Number(dRaw);
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return null;
  if (m < 1 || m > 12) return null;
  if (d < 1 || d > 31) return null;
  return { y, m, d };
}

function formatDateRange(start?: string, end?: string): string {
  const s = parseYyyyMmDd(start);
  if (!s) return '';
  const e = parseYyyyMmDd(end);
  const sMonth = MONTHS_SHORT[s.m - 1];
  if (!e || !end || end === start) return `${s.d} ${sMonth}`;

  const eMonth = MONTHS_SHORT[e.m - 1];
  if (s.y === e.y && s.m === e.m) return `${s.d}–${e.d} ${sMonth}`;
  return `${s.d} ${sMonth} – ${e.d} ${eMonth}`;
}

function formatTimeRange(startTime?: string, endTime?: string): string {
  const st = startTime?.slice(0, 5);
  const et = endTime?.slice(0, 5);
  if (st && et) return `${st}–${et}`;
  return st || et || '';
}

export function EventSpotlightCard({
  item,
  cardWidth = 280,
  variant = 'default',
  onPress,
}: EventSpotlightCardProps): React.ReactElement {
  const isCompact = variant === 'compact';
  const FALLBACK_THUMB =
    'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=80';

  const tags = useMemo(() => {
    const raw = (item.highlightPoints ?? '').trim();
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      const arr = typeof parsed === 'string' ? JSON.parse(parsed) : parsed;
      return Array.isArray(arr)
        ? (arr as string[]).filter(Boolean).slice(0, MAX_TAG_COUNT)
        : [];
    } catch {
      return [];
    }
  }, [item.highlightPoints]);

  const initialThumbUri = useMemo(() => {
    const thumb = item.thumbnail?.trim();
    if (!thumb) return FALLBACK_THUMB;
    if (thumb.startsWith('http://') || thumb.startsWith('https://')) {
      // Some backends send URLs with unescaped characters; RN Image can fail silently.
      try {
        return encodeURI(thumb);
      } catch {
        return thumb;
      }
    }
    return FALLBACK_THUMB;
  }, [item.thumbnail]);

  const [thumbUri, setThumbUri] = useState<string>(initialThumbUri);

  const imageSource = useMemo<React.ComponentProps<typeof Image>['source']>(() => {
    return { uri: thumbUri };
  }, [thumbUri]);

  const dateLabel = useMemo(
    () => formatDateRange(item.startDate, item.endDate),
    [item.endDate, item.startDate],
  );

  const timeLabel = useMemo(
    () => formatTimeRange(item.startTime, item.endTime),
    [item.endTime, item.startTime],
  );

  const scheduleLabel = useMemo(() => {
    const parts = [dateLabel, timeLabel].filter(Boolean);
    return parts.length ? parts.join(' • ') : 'Schedule TBA';
  }, [dateLabel, timeLabel]);

  const feeLabel = useMemo(() => {
    const online = Number(item.onlineFee ?? '0');
    const offline = Number(item.offlineFee ?? '0');
    const fee = online > 0 ? online : offline;
    if (!Number.isFinite(fee) || fee <= 0) return 'Free';
    return `₹${fee.toFixed(0)}`;
  }, [item.offlineFee, item.onlineFee]);

  const placeLabel = item.place?.trim() ? item.place.trim() : 'Online';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.name}. ${placeLabel}. ${dateLabel} ${timeLabel}`.trim()}
      accessibilityHint={onPress != null ? 'Opens details' : undefined}
      onPress={onPress}
      style={({ pressed }) => [
        styles.root,
        isCompact ? styles.rootCompact : null,
        { width: cardWidth },
        pressed && onPress != null ? styles.cardPressed : null,
      ]}
    >
      <View style={[styles.imageWrap, isCompact ? styles.imageWrapCompact : null]}>
        <Image
          source={imageSource}
          style={[styles.image, isCompact ? styles.imageCompact : null]}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
          onError={(e) => {
            // Network image failed (common during dev / flaky connections) → fall back.
            console.log('Workshop thumbnail failed', e.nativeEvent?.error, item.thumbnail);
            setThumbUri(FALLBACK_THUMB);
          }}
        />
        <View style={styles.imageOverlayBottom}>
          <View style={styles.tagRow}>
            {tags.map((tag, index) => {
              const label = truncateTagLabel(
                tag,
                isCompact ? MAX_TAG_CHARS_COMPACT : MAX_TAG_CHARS_DEFAULT,
              );
              return (
                <View
                  key={`${tag}-${index}`}
                  style={[styles.tagPill, isCompact ? styles.tagPillCompact : null]}
                >
                  <Text
                    style={styles.tagText}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

      </View>

      <View style={[styles.body, isCompact ? styles.bodyCompact : null]}>
        <Text style={[styles.title, isCompact ? styles.titleCompact : null]} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.metaRow}>
          <Ionicons
            name={placeLabel === 'Online' ? 'globe-outline' : 'location-outline'}
            size={isCompact ? 12 : 14}
            color="#6B7280"
          />
          <Text style={styles.meta} numberOfLines={1}>
            {placeLabel}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={isCompact ? 12 : 14} color="#6B7280" />
          <Text style={styles.meta} numberOfLines={1}>
            {scheduleLabel}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.typePill}>
            <Text style={styles.typeText} numberOfLines={1}>
              {item.type?.toUpperCase() || 'WORKSHOP'}
            </Text>
          </View>
          <View style={styles.feePill}>
            <Text style={styles.feeText} numberOfLines={1}>
              {feeLabel}
            </Text>
          </View>
        </View>

      </View>
    </Pressable>
  );
}

EventSpotlightCard.displayName = 'EventSpotlightCard';

const IMAGE_RADIUS = 20;
const IMAGE_RADIUS_COMPACT = 14;
const IMAGE_HEIGHT = 124;
const IMAGE_HEIGHT_COMPACT = 88;

const styles = StyleSheet.create({
  root: {
    marginRight: THEME.spacing[12],
    backgroundColor: THEME.colors.background,
    borderRadius: IMAGE_RADIUS + 4,
    ...Platform.select({
      ios: {
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      default: {
        elevation: 3,
      },
    }),
  },
  rootCompact: {
    marginRight: 0,
    borderRadius: IMAGE_RADIUS_COMPACT + 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: THEME.colors.border,
    ...Platform.select({
      ios: {
        shadowOpacity: 0,
      },
      default: {
        elevation: 0,
      },
    }),
  },
  cardPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.99 }],
  },
  imageWrap: {
    borderTopLeftRadius: IMAGE_RADIUS,
    borderTopRightRadius: IMAGE_RADIUS,
    overflow: 'hidden',
    position: 'relative',
  },
  imageWrapCompact: {
    borderTopLeftRadius: IMAGE_RADIUS_COMPACT,
    borderTopRightRadius: IMAGE_RADIUS_COMPACT,
  },
  image: {
    width: '100%',
    height: IMAGE_HEIGHT,
    backgroundColor: '#E5E7EB',
  },
  imageCompact: {
    height: IMAGE_HEIGHT_COMPACT,
  },
  imageOverlayBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 24,
    backgroundColor: 'rgba(15,23,42,0.06)',
    justifyContent: 'flex-end',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 6,
    justifyContent: 'flex-end',
    width: '100%',
  },
  tagPill: {
    flexShrink: 1,
    maxWidth: '48%',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: EVENT_SPOTLIGHT_ACCENT,
  },
  tagPillCompact: {
    maxWidth: '47%',
    paddingHorizontal: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    color: TAG_TEXT,
    flexShrink: 1,
  },
  body: {
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[12],
    gap: THEME.spacing[8],
  },
  bodyCompact: {
    paddingHorizontal: THEME.spacing[10],
    paddingVertical: THEME.spacing[10],
    gap: THEME.spacing[6],
  },
  title: {
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  titleCompact: {
    fontSize: THEME.typography.size[14],
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  meta: {
    fontSize: THEME.typography.size[12],
    color: '#6B7280',
    flex: 1,
    flexShrink: 1,
    lineHeight: 18,
  },
  typePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(37, 99, 235, 0.10)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(37, 99, 235, 0.22)',
  },
  typeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#1D4ED8',
  },
  feePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(4, 120, 87, 0.22)',
  },
  feeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#047857',
  },
});
