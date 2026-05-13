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

export interface TestimonialItem {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatarUri?: string;
  accentStyleIndex?: 0 | 1;
}

export interface TestimonialCardProps {
  item: TestimonialItem;
  cardWidth?: DimensionValue;
  onPress?: () => void;
}

const FALLBACK_AVATAR =
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=256&auto=format&fit=crop&q=80';

const ACCENT_PRESETS: readonly { blob: readonly string[]; haze: readonly string[] }[] = [
  { blob: ['#FFF2B3', '#FFD98A'], haze: ['rgba(255, 220, 120, 0.95)', 'rgba(255, 220, 120, 0.0)'] },
  { blob: ['#C7E1FF', '#9BC8FF'], haze: ['rgba(140, 195, 255, 0.95)', 'rgba(140, 195, 255, 0.0)'] },
];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}

function presetIndexForItem(item: TestimonialItem): 0 | 1 {
  if (item.accentStyleIndex != null) return item.accentStyleIndex;
  const code = item.id.charCodeAt(0) || 0;
  return (code % 2) as 0 | 1;
}

export function TestimonialCard({
  item,
  cardWidth = 260,
  onPress,
}: TestimonialCardProps): React.ReactElement {
  const preset = ACCENT_PRESETS[presetIndexForItem(item)];

  const a11y = useMemo(
    () => `Testimonial from ${item.name}, ${item.role}. ${item.quote}`,
    [item.name, item.quote, item.role],
  );

  const initialUri = useMemo(() => {
    const uri = item.avatarUri?.trim();
    if (!uri) return FALLBACK_AVATAR;
    return uri.startsWith('http') ? uri : FALLBACK_AVATAR;
  }, [item.avatarUri]);

  const [avatarUri, setAvatarUri] = useState(initialUri);
  const showAvatarImage = Boolean(initialUri);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11y}
      accessibilityHint={onPress ? 'Opens testimonial details' : undefined}
      onPress={onPress}
      disabled={onPress == null}
      style={({ pressed }) => [
        styles.root,
        { width: cardWidth },
        pressed && onPress != null ? styles.pressed : null,
      ]}
    >
      <View style={styles.accentLayer} pointerEvents="none">
        <LinearGradient
          colors={preset.haze as unknown as string[]}
          start={{ x: 0.25, y: 1 }}
          end={{ x: 0.7, y: 0.1 }}
          style={styles.haze}
        />
        <LinearGradient
          colors={preset.blob as unknown as string[]}
          start={{ x: 0.1, y: 0.9 }}
          end={{ x: 0.9, y: 0.1 }}
          style={styles.blob}
        />
      </View>

      <Text style={styles.quote} numberOfLines={7} ellipsizeMode="tail">
        “{item.quote}”
      </Text>

      <View style={styles.personRow}>
        {showAvatarImage ? (
          <Image
            source={{ uri: avatarUri }}
            style={styles.avatar}
            accessibilityIgnoresInvertColors
            onError={() => setAvatarUri(FALLBACK_AVATAR)}
          />
        ) : (
          <View style={styles.avatarFallback} accessibilityElementsHidden>
            <Text style={styles.avatarInitials}>{initials(item.name)}</Text>
          </View>
        )}
        <View style={styles.personMeta}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.role} numberOfLines={1}>
            {item.role}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

TestimonialCard.displayName = 'TestimonialCard';

const CARD_RADIUS = 28;
const CARD_HEIGHT = 220;

const styles = StyleSheet.create({
  root: {
    height: CARD_HEIGHT,
    borderRadius: CARD_RADIUS,
    backgroundColor: THEME.colors.white,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    overflow: 'hidden',
    marginRight: THEME.spacing[12],
    padding: THEME.spacing[16],
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 18,
      },
      default: {
        elevation: 3,
      },
    }),
  },
  pressed: {
    opacity: 0.94,
  },
  accentLayer: {
    ...StyleSheet.absoluteFill,
  },
  haze: {
    position: 'absolute',
    left: -36,
    bottom: -46,
    width: 240,
    height: 240,
    borderRadius: 999,
    opacity: 0.9,
  },
  blob: {
    position: 'absolute',
    left: -20,
    bottom: -64,
    width: 220,
    height: 220,
    borderRadius: 999,
    opacity: 0.7,
  },
  quote: {
    fontSize: THEME.typography.size[18],
    lineHeight: 26,
    letterSpacing: -0.25,
    fontWeight: THEME.typography.weight.medium as '500',
    color: THEME.colors.textPrimary,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[10],
    paddingTop: THEME.spacing[8],
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: THEME.colors.surface,
  },
  avatarFallback: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: THEME.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
  },
  personMeta: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textPrimary,
  },
  role: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
    marginTop: 1,
  },
});

