import React, { useMemo, useState } from 'react';
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type DimensionValue,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { THEME } from '@/constants/theme';

export interface TopConsultantItem {
  id: string;
  /** URL slug for detail screen / API (falls back to `id` when missing). */
  slug?: string;
  name: string;
  role: string;
  bio: string;
  specialty: string;
  experienceLabel: string;
  rateLabel: string;
  photoUri?: string;
}

export interface TopConsultantCardProps {
  item: TopConsultantItem;
  cardWidth?: DimensionValue;
  onPress?: () => void;
  onBookPress?: () => void;
  /** When false, meta line shows only experience + rate (specialty hidden). Default true. */
  showSpecialtyInMeta?: boolean;
  /** Bio clamp lines (dense lists often use 1). Default 2. */
  bioNumberOfLines?: 1 | 2;
}

const FALLBACK_PHOTO =
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80';

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}

function resolveCardHeight(width: DimensionValue): number {
  return typeof width === 'number' ? Math.round(width * 1.52) : 320;
}

export function TopConsultantCard({
  item,
  cardWidth = 192,
  onPress,
  onBookPress,
  showSpecialtyInMeta = true,
  bioNumberOfLines = 2,
}: TopConsultantCardProps): React.ReactElement {
  const a11y = useMemo(
    () =>
      showSpecialtyInMeta
        ? `${item.name}, ${item.role}. ${item.specialty}. ${item.experienceLabel}. ${item.rateLabel}.`
        : `${item.name}, ${item.role}. ${item.experienceLabel}. ${item.rateLabel}.`,
    [item.experienceLabel, item.name, item.rateLabel, item.role, item.specialty, showSpecialtyInMeta],
  );

  const cardHeight = resolveCardHeight(cardWidth);

  const initialUri = useMemo(() => {
    const uri = item.photoUri?.trim();
    if (!uri) return FALLBACK_PHOTO;
    return uri.startsWith('http') ? uri : FALLBACK_PHOTO;
  }, [item.photoUri]);

  const [photoUri, setPhotoUri] = useState(initialUri);
  const hasPhoto = Boolean(initialUri);

  const metaLine = (
    showSpecialtyInMeta
      ? [item.specialty, item.experienceLabel, item.rateLabel]
      : [item.experienceLabel, item.rateLabel]
  )
    .filter(Boolean)
    .join(' · ');

  const photoContent = hasPhoto ? (
    <Image
      source={{ uri: photoUri }}
      style={styles.bgImage}
      resizeMode="cover"
      accessibilityIgnoresInvertColors
      onError={() => setPhotoUri(FALLBACK_PHOTO)}
    />
  ) : (
    <View style={styles.photoFallback}>
      <Text style={styles.photoInitials}>{initials(item.name)}</Text>
    </View>
  );

  return (
    <View style={[styles.root, { width: cardWidth, minHeight: cardHeight }]}>
      {photoContent}

      {/* Soft vignette so the frosted panel blends into the photo */}
      <LinearGradient
        pointerEvents="none"
        colors={['transparent', 'rgba(0,0,0,0.06)', 'rgba(0,0,0,0.18)']}
        locations={[0.35, 0.62, 1]}
        style={styles.vignette}
      />

      <View style={styles.stack}>
        {onPress != null ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={a11y}
            accessibilityHint="Opens consultant profile"
            onPress={onPress}
            style={({ pressed }) => [styles.imageTapZone, pressed ? styles.imageTapPressed : null]}
          />
        ) : (
          <View style={styles.imageTapZone} />
        )}

        {/* Frosted “blur” panel: gradient simulates glass from where copy begins */}
        <LinearGradient
          colors={[
            'rgba(255,255,255,0.14)',
            'rgba(255,255,255,0.52)',
            'rgba(255,255,255,0.88)',
            'rgba(255,255,255,0.96)',
          ]}
          locations={[0, 0.18, 0.55, 1]}
          style={styles.glassPanel}
        >
          <View style={styles.glassInner}>
            <Text style={styles.name} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.role} numberOfLines={2}>
              {item.role}
            </Text>
            <Text style={styles.bio} numberOfLines={bioNumberOfLines} ellipsizeMode="tail">
              {item.bio}
            </Text>
            <Text style={styles.meta} numberOfLines={3}>
              {metaLine}
            </Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Book consultation with ${item.name}`}
              onPress={onBookPress}
              disabled={onBookPress == null}
              hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
              style={({ pressed }) => [
                styles.bookBtn,
                pressed && onBookPress != null ? styles.bookBtnPressed : null,
                onBookPress == null ? styles.bookBtnDisabled : null,
              ]}
            >
              <Text style={styles.bookBtnText} numberOfLines={1}>
                Book
              </Text>
            </Pressable>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}

TopConsultantCard.displayName = 'TopConsultantCard';

const CARD_RADIUS = 18;

const styles = StyleSheet.create({
  root: {
    marginRight: THEME.spacing[12],
    borderRadius: CARD_RADIUS,
    backgroundColor: THEME.colors.black,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    ...Platform.select({
      ios: {
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 18,
      },
      default: {
        elevation: 5,
      },
    }),
  },
  bgImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  photoFallback: {
    ...StyleSheet.absoluteFill,
    backgroundColor: THEME.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoInitials: {
    fontSize: 24,
    fontWeight: '800',
    color: THEME.colors.textSecondary,
    letterSpacing: 2,
  },
  vignette: {
    ...StyleSheet.absoluteFill,
  },
  stack: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageTapZone: {
    flexGrow: 1,
    flexShrink: 1,
    minHeight: 56,
  },
  imageTapPressed: {
    opacity: 0.92,
  },
  glassPanel: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.55)',
  },
  glassInner: {
    paddingHorizontal: THEME.spacing[12],
    paddingTop: THEME.spacing[12],
    paddingBottom: THEME.spacing[8],
    gap: THEME.spacing[4],
  },
  name: {
    color: THEME.colors.textPrimary,
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.bold as '700',
    letterSpacing: -0.2,
    lineHeight: 20,
  },
  role: {
    color: THEME.colors.textSecondary,
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium as '500',
    lineHeight: 18,
    marginTop: -THEME.spacing[4],
  },
  bio: {
    color: THEME.colors.textSecondary,
    fontSize: THEME.typography.size[12],
    lineHeight: 18,
  },
  meta: {
    color: THEME.colors.textPrimary,
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    lineHeight: 18,
  },
  bookBtn: {
    marginTop: THEME.spacing[4],
    minHeight: 34,
    paddingVertical: THEME.spacing[4],
    paddingHorizontal: THEME.spacing[10],
    borderRadius: THEME.radius[12],
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookBtnPressed: {
    opacity: 0.92,
  },
  bookBtnDisabled: {
    opacity: 0.55,
  },
  bookBtnText: {
    color: THEME.colors.white,
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    letterSpacing: 0.2,
  },
});
