import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type DimensionValue,
  type ImageLoadEventData,
  type NativeSyntheticEvent,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { THEME } from '@/constants/theme';
import { ImagePlaceholder } from '@/shared/components/media/ImagePlaceholder';
import { resolveAwsImageUrl } from '@/utils/awsImageUrl';

/** Accent used for pills on the image overlay. */
export const EVENT_SPOTLIGHT_ACCENT = '#FFD60A';
const MAX_TAG_COUNT = 2;
const MAX_TAG_CHARS_DEFAULT = 34;
const MAX_TAG_CHARS_COMPACT = 22;
const DEFAULT_IMAGE_ASPECT = 16 / 9;
const COMPACT_IMAGE_ASPECT = 4 / 3;
const COMPACT_TITLE_LINE_HEIGHT = 17;
const COMPACT_META_LINE_HEIGHT = 15;

function resolveImageAspectRatio(width: number, height: number): number {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return DEFAULT_IMAGE_ASPECT;
  }
  return width / height;
}

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
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
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

function formatTime12h(value?: string): string {
  const raw = value?.slice(0, 5);
  if (raw == null || raw.length < 4) {
    return '';
  }
  const [hourRaw, minuteRaw] = raw.split(':');
  const hour = Number(hourRaw);
  const minute = minuteRaw ?? '00';
  if (!Number.isFinite(hour)) {
    return raw;
  }
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minute} ${period}`;
}

function formatTimeRange(startTime?: string, endTime?: string): string {
  const st = startTime?.slice(0, 5);
  const et = endTime?.slice(0, 5);
  if (st && et) return `${st}–${et}`;
  return st || et || '';
}

function formatCompactTimeRange(startTime?: string, endTime?: string): string {
  const start = formatTime12h(startTime);
  const end = formatTime12h(endTime);
  if (start.length > 0 && end.length > 0) {
    return `${start} – ${end}`;
  }
  return start || end || '';
}

function resolveThumbnailUri(thumbnail: string | undefined): string | null {
  const trimmed = thumbnail?.trim();
  if (trimmed == null || trimmed.length === 0) {
    return null;
  }
  return resolveAwsImageUrl(trimmed);
}

export function EventSpotlightCard({
  item,
  cardWidth = 280,
  variant = 'default',
  onPress,
}: EventSpotlightCardProps): React.ReactElement {
  const isCompact = variant === 'compact';

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

  const resolvedThumbUri = useMemo(
    () => resolveThumbnailUri(item.thumbnail),
    [item.thumbnail],
  );

  const [thumbUri, setThumbUri] = useState<string | null>(resolvedThumbUri);
  const [imageFailed, setImageFailed] = useState(false);
  const [imageAspectRatio, setImageAspectRatio] = useState<number>(DEFAULT_IMAGE_ASPECT);

  useEffect(() => {
    setThumbUri(resolvedThumbUri);
    setImageFailed(false);
    setImageAspectRatio(DEFAULT_IMAGE_ASPECT);
  }, [resolvedThumbUri]);

  useEffect(() => {
    if (isCompact || thumbUri == null || thumbUri.length === 0) {
      return undefined;
    }

    let cancelled = false;
    Image.getSize(
      thumbUri,
      (width, height) => {
        if (!cancelled) {
          setImageAspectRatio(resolveImageAspectRatio(width, height));
        }
      },
      () => undefined,
    );

    return () => {
      cancelled = true;
    };
  }, [isCompact, thumbUri]);

  const handleImageLoad = (event: NativeSyntheticEvent<ImageLoadEventData>): void => {
    const { width, height } = event.nativeEvent.source;
    setImageAspectRatio(resolveImageAspectRatio(width, height));
  };

  const showImage = thumbUri != null && thumbUri.length > 0 && !imageFailed;

  const dateLabel = useMemo(
    () => formatDateRange(item.startDate, item.endDate),
    [item.endDate, item.startDate],
  );

  const timeLabel = useMemo(
    () =>
      isCompact
        ? formatCompactTimeRange(item.startTime, item.endTime)
        : formatTimeRange(item.startTime, item.endTime),
    [isCompact, item.endTime, item.startTime],
  );

  const scheduleLabel = useMemo(() => {
    const parts = [dateLabel, timeLabel].filter(Boolean);
    return parts.length ? parts.join(' • ') : 'Schedule TBA';
  }, [dateLabel, timeLabel]);

  const resolvedImageAspect = isCompact ? COMPACT_IMAGE_ASPECT : imageAspectRatio;

  const { feeLabel, isFree } = useMemo(() => {
    const online = Number(item.onlineFee ?? '0');
    const offline = Number(item.offlineFee ?? '0');
    const fee = online > 0 ? online : offline;
    if (!Number.isFinite(fee) || fee <= 0) {
      return { feeLabel: 'Free', isFree: true };
    }
    return {
      feeLabel: `₹${Math.round(fee).toLocaleString('en-IN')}`,
      isFree: false,
    };
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
        isCompact ? styles.rootCompactSizing : { width: cardWidth },
        pressed && onPress != null ? styles.cardPressed : null,
      ]}
    >
      <View style={[styles.imageWrap, isCompact ? styles.imageWrapCompact : null, { aspectRatio: resolvedImageAspect }]}>
        {showImage ? (
          <>
            <Image
              source={{ uri: thumbUri }}
              style={styles.image}
              resizeMode={isCompact ? 'cover' : 'contain'}
              accessibilityIgnoresInvertColors
              onLoad={handleImageLoad}
              onError={() => {
                setImageFailed(true);
              }}
            />
            {tags.length > 0 ? (
              <LinearGradient
                colors={['transparent', 'rgba(15,23,42,0.45)']}
                style={styles.imageGradient}
                pointerEvents="none"
              />
            ) : null}
            {tags.length > 0 ? (
              <View style={styles.tagOverlay} pointerEvents="none">
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
                        <Text style={styles.tagText} numberOfLines={1} ellipsizeMode="tail">
                          {label}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            ) : null}
          </>
        ) : (
          <ImagePlaceholder
            variant="media"
            message="Image not available"
            style={styles.imageFill}
            accessibilityLabel="Image not available"
          />
        )}
      </View>

      <View style={[styles.body, isCompact ? styles.bodyCompact : null]}>
        <Text style={[styles.title, isCompact ? styles.titleCompact : null]} numberOfLines={2}>
          {item.name}
        </Text>
        {isCompact ? (
          <View style={styles.compactMetaBlock}>
            <Text style={styles.compactMetaLine} numberOfLines={1} ellipsizeMode="tail">
              {placeLabel}
            </Text>
            <Text style={styles.compactMetaLine} numberOfLines={1} ellipsizeMode="tail">
              {dateLabel.length > 0 ? dateLabel : 'Date TBA'}
            </Text>
            <Text style={styles.compactMetaLine} numberOfLines={1} ellipsizeMode="tail">
              {timeLabel.length > 0 ? timeLabel : 'Time TBA'}
            </Text>
          </View>
        ) : (
          <Text style={styles.metaLine} numberOfLines={2}>
            {placeLabel}
            {scheduleLabel.length > 0 ? ` · ${scheduleLabel}` : ''}
          </Text>
        )}

        <View style={[styles.offerStrip, isCompact ? styles.offerStripCompact : null]}>
          <Text style={styles.offerCaption}>Registration fee</Text>
          {isFree ? (
            <Text style={styles.freeBadgeText}>FREE</Text>
          ) : (
            <View style={styles.paidPriceRow}>
              <Text style={styles.paidPrice}>{feeLabel}</Text>
              <Text style={styles.paidPriceSuffix}>/-</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

EventSpotlightCard.displayName = 'EventSpotlightCard';

const CARD_RADIUS = 14;

const styles = StyleSheet.create({
  root: {
    marginRight: THEME.spacing[12],
    backgroundColor: THEME.colors.white,
    borderRadius: CARD_RADIUS,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      default: {
        elevation: 2,
      },
    }),
  },
  rootCompact: {
    marginRight: 0,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      default: {
        elevation: 2,
      },
    }),
  },
  rootCompactSizing: {
    flex: 1,
    alignSelf: 'stretch',
    width: '100%',
  },
  imageWrapCompact: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.99 }],
  },
  imageWrap: {
    width: '100%',
    backgroundColor: '#F7F7F7',
    overflow: 'hidden',
    position: 'relative',
    borderTopLeftRadius: CARD_RADIUS,
    borderTopRightRadius: CARD_RADIUS,
  },
  imageFill: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  tagOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: THEME.spacing[12],
    paddingBottom: THEME.spacing[12],
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
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: THEME.colors.primary,
  },
  tagPillCompact: {
    maxWidth: '47%',
    paddingHorizontal: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'white',
    flexShrink: 1,
  },
  body: {
    paddingHorizontal: THEME.spacing[14],
    paddingTop: THEME.spacing[12],
    paddingBottom: THEME.spacing[12],
    gap: THEME.spacing[6],
    backgroundColor: THEME.colors.white,
  },
  bodyCompact: {
    flex: 1,
    paddingHorizontal: THEME.spacing[12],
    paddingTop: THEME.spacing[10],
    paddingBottom: THEME.spacing[10],
    gap: THEME.spacing[4],
  },
  compactMetaBlock: {
    gap: 2,
    minHeight: COMPACT_META_LINE_HEIGHT * 3 + 4,
  },
  compactMetaLine: {
    fontSize: 11,
    color: '#757575',
    lineHeight: COMPACT_META_LINE_HEIGHT,
    fontWeight: THEME.typography.weight.regular as '400',
  },
  title: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.bold as '700',
    color: '#1A1A1A',
    lineHeight: 20,
    letterSpacing: -0.15,
  },
  titleCompact: {
    fontSize: 13,
    lineHeight: COMPACT_TITLE_LINE_HEIGHT,
    minHeight: COMPACT_TITLE_LINE_HEIGHT * 2,
  },
  metaLine: {
    fontSize: 11,
    color: '#757575',
    lineHeight: 16,
    fontWeight: THEME.typography.weight.regular as '400',
  },
  offerStrip: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: THEME.spacing[4],
    paddingTop: THEME.spacing[10],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#EEEEEE',
    gap: THEME.spacing[8],
  },
  offerStripCompact: {
    marginTop: 'auto',
    paddingTop: THEME.spacing[8],
    minHeight: 34,
  },
  offerCaption: {
    flex: 1,
    minWidth: 0,
    fontSize: 11,
    fontWeight: THEME.typography.weight.regular as '400',
    color: '#757575',
    lineHeight: 18,
  },
  freeBadgeText: {
    flexShrink: 0,
    fontSize: 15,
    fontWeight: THEME.typography.weight.bold as '700',
    color: '#388E3C',
    lineHeight: 18,
  },
  paidPriceRow: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  paidPrice: {
    fontSize: 15,
    fontWeight: THEME.typography.weight.bold as '700',
    color: '#1A1A1A',
    letterSpacing: -0.2,
    lineHeight: 18,
  },
  paidPriceSuffix: {
    fontSize: 11,
    fontWeight: THEME.typography.weight.medium as '500',
    color: '#757575',
    marginLeft: 1,
  },
});
