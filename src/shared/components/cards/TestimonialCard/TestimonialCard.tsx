import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
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

  const avatarUri = useMemo(() => item.avatarUri?.trim() ?? '', [item.avatarUri]);
  const [imageFailed, setImageFailed] = useState<boolean>(false);

  useEffect(() => {
    setImageFailed(false);
  }, [avatarUri]);

  const showAvatarImage = avatarUri.length > 0 && !imageFailed;
  const nameInitials = useMemo(() => initials(item.name), [item.name]);

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

      <ScrollView
        style={styles.quoteScroll}
        contentContainerStyle={styles.quoteScrollContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        <Text style={styles.quote}>
          “{item.quote}”
        </Text>
      </ScrollView>

      <View style={styles.personRow}>
        {showAvatarImage ? (
          <Image
            source={{ uri: avatarUri }}
            style={styles.avatar}
            accessibilityIgnoresInvertColors
            accessibilityLabel={`Photo of ${item.name}`}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <View
            style={styles.avatarFallback}
            accessibilityRole="image"
            accessibilityLabel={`Avatar for ${item.name}`}
          >
            <Text style={styles.avatarInitials}>{nameInitials}</Text>
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
const CARD_MIN_HEIGHT = 200;
const CARD_MAX_HEIGHT = 280;
const QUOTE_SCROLL_MAX_HEIGHT = 188;

const styles = StyleSheet.create({
  root: {
    minHeight: CARD_MIN_HEIGHT,
    maxHeight: CARD_MAX_HEIGHT,
    borderRadius: CARD_RADIUS,
    backgroundColor: THEME.colors.white,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    overflow: 'hidden',
    marginRight: THEME.spacing[12],
    padding: THEME.spacing[16],
    gap: THEME.spacing[12],
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
  quoteScroll: {
    maxHeight: QUOTE_SCROLL_MAX_HEIGHT,
    flexGrow: 1,
    flexShrink: 1,
  },
  quoteScrollContent: {
    flexGrow: 1,
  },
  quote: {
    fontSize: THEME.typography.size[15],
    lineHeight: 22,
    letterSpacing: -0.2,
    fontWeight: THEME.typography.weight.medium as '500',
    color: THEME.colors.textPrimary,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[10],
    flexShrink: 0,
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
    backgroundColor: 'rgba(15,81,50,0.10)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,81,50,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.primary,
    letterSpacing: 0.4,
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

