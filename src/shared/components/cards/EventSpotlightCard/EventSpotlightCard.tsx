import React, { useMemo, useState } from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View, type DimensionValue } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';

/** Accent used for pills & favorite control (warm yellow, high contrast). */
export const EVENT_SPOTLIGHT_ACCENT = '#FFD60A';
const TAG_TEXT = '#0A0A0A';

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

export interface EventSpotlightCardProps {
  item: EventSpotlightItem;
  cardWidth?: DimensionValue;
  onPress?: () => void;
}

export function EventSpotlightCard({
  item,
  cardWidth = 280,
  onPress,
}: EventSpotlightCardProps): React.ReactElement {
  const FALLBACK_THUMB =
    'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=80';

  const tags = useMemo(() => {
    const raw = (item.highlightPoints ?? '').trim();
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      const arr = typeof parsed === 'string' ? JSON.parse(parsed) : parsed;
      return Array.isArray(arr) ? (arr as string[]).filter(Boolean).slice(0, 2) : [];
    } catch {
      return [];
    }
  }, [item.highlightPoints]);

  const initialThumbUri = useMemo(() => {
    const thumb = item.thumbnail?.trim();
    if (!thumb) return FALLBACK_THUMB;
    if (thumb.startsWith('http://') || thumb.startsWith('https://')) return thumb;
    return FALLBACK_THUMB;
  }, [item.thumbnail]);

  const [thumbUri, setThumbUri] = useState<string>(initialThumbUri);

  const imageSource = useMemo<React.ComponentProps<typeof Image>['source']>(() => {
    return { uri: thumbUri };
  }, [thumbUri]);

  const dateLabel = useMemo(() => {
    const start = item.startDate;
    const end = item.endDate;
    if (start && end && end !== start) return `${start} → ${end}`;
    return start || '';
  }, [item.endDate, item.startDate]);

  const timeLabel = useMemo(() => {
    const st = item.startTime?.slice(0, 5);
    const et = item.endTime?.slice(0, 5);
    if (st && et) return `${st}–${et}`;
    return st || et || '';
  }, [item.endTime, item.startTime]);

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
        { width: cardWidth },
        pressed && onPress != null ? styles.cardPressed : null,
      ]}
    >
      <View style={styles.imageWrap}>
        <Image
          source={imageSource}
          style={styles.image}
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
            {tags.map((t) => (
              <View key={t} style={styles.tagPill}>
                <Text style={styles.tagText} numberOfLines={1}>
                  {t}
                </Text>
              </View>
            ))}
          </View>
        </View>

      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.metaRow}>
          <Ionicons
            name={placeLabel === 'Online' ? 'globe-outline' : 'location-outline'}
            size={14}
            color="#6B7280"
          />
          <Text style={styles.meta} numberOfLines={1}>
            {placeLabel}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={14} color="#6B7280" />
          <Text style={styles.meta} numberOfLines={1}>
            {[dateLabel, timeLabel].filter(Boolean).join(' • ')}
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
  image: {
    width: '100%',
    aspectRatio: 1.05,
    backgroundColor: '#E5E7EB',
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
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'flex-end',
  },
  tagPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: EVENT_SPOTLIGHT_ACCENT,
    maxWidth: '100%',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    color: TAG_TEXT,
  },
  body: {
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[12],
    gap: THEME.spacing[8],
  },
  title: {
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
    lineHeight: 22,
    letterSpacing: -0.2,
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
