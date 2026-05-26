import React, { useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type { MasterDataItem } from '@/features/consultant/types/masterData.types';
import {
  gradientPresetForSegmentSlug,
  iconNameForSegmentSlug,
} from '@/features/Home/utils/expertConsultationVisual';
import { THEME } from '@/constants/theme';
import { resolveAwsImageUrl } from '@/utils/awsImageUrl';

import {
  EXPERT_SEGMENT_CARD_WIDTH,
  EXPERT_SEGMENT_IMAGE_HEIGHT,
} from './expertConsultationCardMetrics';

export interface ExpertConsultationSegmentCardProps {
  item: MasterDataItem;
  accentColor: string;
  categorySlug: string;
  categoryId: number;
  onPress?: (segment: MasterDataItem, categoryId: number) => void;
}

function hexToRgba(hex: string, alpha: number): string {
  const raw = hex.replace('#', '').trim();
  if (raw.length !== 6) {
    return `rgba(37, 99, 235, ${alpha})`;
  }
  const r = Number.parseInt(raw.slice(0, 2), 16);
  const g = Number.parseInt(raw.slice(2, 4), 16);
  const b = Number.parseInt(raw.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) {
    return `rgba(37, 99, 235, ${alpha})`;
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function ExpertConsultationSegmentCard(
  props: ExpertConsultationSegmentCardProps,
): React.ReactElement {
  const { item, accentColor, categorySlug, categoryId, onPress } = props;
  const slug = item.slug?.trim() ?? String(item.id);
  const imageUri = useMemo(
    () => resolveAwsImageUrl(item.thumbnail ?? null),
    [item.thumbnail],
  );
  const iconName = useMemo(() => iconNameForSegmentSlug(slug), [slug]);
  const preset = useMemo(() => gradientPresetForSegmentSlug(slug), [slug]);
  const tagBg = useMemo(() => hexToRgba(accentColor, 0.08), [accentColor]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.name}. Consult now.`}
      onPress={onPress != null ? () => onPress(item, categoryId) : undefined}
      disabled={onPress == null}
      style={({ pressed }) => [styles.card, pressed ? styles.cardPressed : null]}
    >
      <View style={styles.imageWrap}>
        {imageUri != null ? (
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
        ) : (
          <LinearGradient
            colors={[preset.gradient[0], preset.gradient[1]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconHero}
          >
            <Ionicons name={iconName} size={24} color={preset.iconColor} />
          </LinearGradient>
        )}
        <LinearGradient
          colors={['transparent', 'rgba(15,23,42,0.35)']}
          style={styles.imageOverlay}
        />
      </View>

      <View style={styles.cardBody}>
        <Text numberOfLines={2} ellipsizeMode="tail" style={styles.cardTitle}>
          {item.name}
        </Text>
        <View style={styles.cardFooter}>
          <View style={[styles.tag, { backgroundColor: tagBg }]}>
            <Text style={[styles.tagText, { color: accentColor }]} numberOfLines={1}>
              {categorySlug}
            </Text>
          </View>
          <View style={styles.arrowWrap}>
            <Ionicons name="arrow-forward" size={12} color={THEME.colors.white} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: EXPERT_SEGMENT_CARD_WIDTH,
    marginRight: THEME.spacing[8],
    borderRadius: 14,
    backgroundColor: THEME.colors.white,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: THEME.colors.border,
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1.5,
  },
  cardPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.98 }],
  },
  imageWrap: {
    height: EXPERT_SEGMENT_IMAGE_HEIGHT,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  iconHero: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  cardBody: {
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 8,
    gap: 6,
  },
  cardTitle: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 999,
  },
  tagText: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  arrowWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: THEME.colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
