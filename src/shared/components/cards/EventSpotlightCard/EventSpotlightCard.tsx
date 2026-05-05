import React, { useState } from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View, type DimensionValue } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';

/** Accent used for pills & favorite control (warm yellow, high contrast). */
export const EVENT_SPOTLIGHT_ACCENT = '#FFD60A';
const TAG_TEXT = '#0A0A0A';

export type EventSpotlightOrganizer = {
  name: string;
  /** `@/assets/...` or `{ uri }` */
  avatarSource?: React.ComponentProps<typeof Image>['source'];
};

export type EventSpotlightParticipants = {
  /** Up to ~3 overlapping avatars shown */
  avatarSources?: Array<NonNullable<React.ComponentProps<typeof Image>['source']>>;
  extraCount?: number;
};

export type EventSpotlightItem = {
  id: string;
  title: string;
  locationLabel: string;
  scheduleLabel: string;
  tags?: string[];
  imageSource: React.ComponentProps<typeof Image>['source'];
  organizer: EventSpotlightOrganizer;
  participants?: EventSpotlightParticipants;
};

export interface EventSpotlightCardProps {
  item: EventSpotlightItem;
  cardWidth?: DimensionValue;
  initialFavorite?: boolean;
  onFavoritePress?: () => void;
  onPress?: () => void;
}

const AVATAR = 26;
const ORG_ICON = 24;

export function EventSpotlightCard({
  item,
  cardWidth = 280,
  initialFavorite = false,
  onFavoritePress,
  onPress,
}: EventSpotlightCardProps): React.ReactElement {
  const [fav, setFav] = useState(initialFavorite);

  const tags = item.tags ?? [];
  const p = item.participants;
  const avatars = p?.avatarSources?.slice(0, 4) ?? [];
  const extra = p?.extraCount ?? 0;

  const toggleFavorite = (): void => {
    setFav((v) => !v);
    onFavoritePress?.();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.title}. ${item.locationLabel}. ${item.scheduleLabel}`}
      accessibilityHint={onPress != null ? 'Opens details' : undefined}
      onPress={onPress}
      style={({ pressed }) => [
        styles.root,
        { width: cardWidth },
        pressed && onPress != null ? styles.cardPressed : null,
      ]}
    >
      <View style={styles.imageWrap}>
        <Image source={item.imageSource} style={styles.image} accessibilityIgnoresInvertColors />
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

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={fav ? 'Remove from favourites' : 'Add to favourites'}
          accessibilityState={{ selected: fav }}
          onPress={() => toggleFavorite()}
          hitSlop={10}
          style={({ pressed: pFavorite }) => [styles.favBtn, pFavorite ? styles.hitPressed : null]}
        >
          <Ionicons
            name={fav ? 'heart' : 'heart-outline'}
            size={18}
            color={TAG_TEXT}
          />
        </Pressable>
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={14} color="#6B7280" />
          <Text style={styles.meta} numberOfLines={1}>
            {item.locationLabel}
          </Text>
        </View>
        <Text style={styles.meta} numberOfLines={2}>
          {item.scheduleLabel}
        </Text>

        <View style={styles.footer}>
          <View style={styles.orgRow}>
            {item.organizer.avatarSource ? (
              <Image source={item.organizer.avatarSource} style={styles.orgAvatar} />
            ) : (
              <View style={[styles.orgAvatar, styles.orgAvatarFallback]}>
                <Text style={styles.orgInitial}>{item.organizer.name.charAt(0).toUpperCase()}</Text>
              </View>
            )}
            <Text style={styles.orgName} numberOfLines={1}>
              {item.organizer.name}
            </Text>
          </View>

          <View style={styles.participants}>
            <View style={styles.avatarStack}>
              {avatars.map((src, idx) => (
                <Image
                  key={idx}
                  source={src}
                  style={[styles.stackAvatar, { marginLeft: idx === 0 ? 0 : -10 }]}
                />
              ))}
            </View>
            {extra > 0 ? (
              <Text style={styles.participantsSuffix} numberOfLines={1}>
                + {extra} others
              </Text>
            ) : null}
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
  favBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: EVENT_SPOTLIGHT_ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  hitPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.96 }],
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
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: THEME.spacing[8],
    marginTop: 4,
  },
  orgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
    flex: 1,
    minWidth: 0,
  },
  orgAvatar: {
    width: ORG_ICON,
    height: ORG_ICON,
    borderRadius: ORG_ICON / 2,
    backgroundColor: '#E5E7EB',
  },
  orgAvatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#CBD5F5',
  },
  orgInitial: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3730A3',
  },
  orgName: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
    fontWeight: '600',
  },
  participants: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stackAvatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    borderWidth: 2,
    borderColor: THEME.colors.background,
    backgroundColor: '#D1D5DB',
  },
  participantsSuffix: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    maxWidth: 72,
  },
});
