import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';

export const SERVICE_SPOTLIGHT_CARD_WIDTH = 168;
const CARD_HEIGHT = 196;
const HERO_HEIGHT = 80;
const TITLE_BLOCK_HEIGHT = 36;
const DESCRIPTION_BLOCK_HEIGHT = 32;

const SERVICE_SPOTLIGHT_ICONS = [
  'document-text-outline',
  'shield-checkmark-outline',
  'briefcase-outline',
  'ribbon-outline',
  'trending-up-outline',
  'layers-outline',
  'file-tray-full-outline',
  'rocket-outline',
  'construct-outline',
  'globe-outline',
] as const;

const HERO_PRESETS = [
  { gradient: ['#4ADE80', '#16A34A'] as const, iconColor: '#FFFFFF' },
  { gradient: ['#60A5FA', '#2563EB'] as const, iconColor: '#FFFFFF' },
  { gradient: ['#A78BFA', '#7C3AED'] as const, iconColor: '#FFFFFF' },
  { gradient: ['#FBBF24', '#D97706'] as const, iconColor: '#FFFFFF' },
  { gradient: ['#2DD4BF', '#0D9488'] as const, iconColor: '#FFFFFF' },
  { gradient: ['#FB7185', '#E11D48'] as const, iconColor: '#FFFFFF' },
] as const;

function hexToRgba(hex: string, alpha: number): string {
  const raw = hex.replace('#', '').trim();
  if (raw.length !== 6) return `rgba(22, 163, 74, ${alpha})`;
  const r = Number.parseInt(raw.slice(0, 2), 16);
  const g = Number.parseInt(raw.slice(2, 4), 16);
  const b = Number.parseInt(raw.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return `rgba(22, 163, 74, ${alpha})`;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function iconNameForServiceSlug(slug: string): string {
  let h = 0;
  for (let i = 0; i < slug.length; i += 1) {
    h = (h + slug.charCodeAt(i) * (i + 1)) % 2_147_483_647;
  }
  return SERVICE_SPOTLIGHT_ICONS[Math.abs(h) % SERVICE_SPOTLIGHT_ICONS.length] ??
    SERVICE_SPOTLIGHT_ICONS[0];
}

function presetForSlug(slug: string) {
  let h = 0;
  for (let i = 0; i < slug.length; i += 1) h += slug.charCodeAt(i);
  return HERO_PRESETS[h % HERO_PRESETS.length] ?? HERO_PRESETS[0];
}

function serviceDescription(title: string): string {
  const trimmed = title.trim();
  if (trimmed.length === 0) {
    return 'Expert-assisted filing and compliance support for your business.';
  }
  return `End-to-end support for ${trimmed.toLowerCase()} — guided by specialists.`;
}

export interface ServiceSpotlightCardProps {
  title: string;
  slug: string;
  accentColor: string;
  categoryLabel: string;
  onPress: () => void;
}

export function ServiceSpotlightCard({
  title,
  slug,
  accentColor,
  categoryLabel,
  onPress,
}: ServiceSpotlightCardProps): React.ReactElement {
  const iconName = useMemo(() => iconNameForServiceSlug(slug), [slug]);
  const preset = useMemo(() => presetForSlug(slug), [slug]);
  const description = useMemo(() => serviceDescription(title), [title]);
  const tagBg = useMemo(() => hexToRgba(accentColor, 0.08), [accentColor]);
  const tagSlug = useMemo(
    () => categoryLabel.trim().toLowerCase().replace(/\s+/g, '-').slice(0, 20),
    [categoryLabel],
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. Opens service details.`}
      accessibilityHint="Opens this service in the Services tab"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.imageWrap}>
        <LinearGradient
          colors={[preset.gradient[0], preset.gradient[1]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        >
          <Ionicons name={iconName} size={28} color={preset.iconColor} />
        </LinearGradient>

        <LinearGradient
          colors={['transparent', 'rgba(15,23,42,0.55)']}
          style={styles.imageOverlay}
        />

        <View style={styles.floatingBadge}>
          <Text style={styles.floatingBadgeText}>Service</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={styles.cardTitle}
        >
          {title}
        </Text>

        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={styles.cardDescription}
        >
          {description}
        </Text>

        <View style={styles.cardFooter}>
          <View style={[styles.tag, { backgroundColor: tagBg }]}>
            <Text
              style={[styles.tagText, { color: accentColor }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {tagSlug}
            </Text>
          </View>
          <View style={styles.arrowWrap}>
            <Text style={styles.arrow}>→</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: SERVICE_SPOTLIGHT_CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: THEME.spacing[8],
    borderRadius: 14,
    backgroundColor: THEME.colors.white,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: THEME.colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    // shadowOffset: { width: 0, height: 3 },
    elevation: 1.5,
  },
  cardPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.98 }],
  },
  imageWrap: {
    height: HERO_HEIGHT,
    position: 'relative',
  },
  heroGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFill,
  },
  floatingBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 999,
  },
  floatingBadgeText: {
    fontSize: 8,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    letterSpacing: 0.15,
  },
  cardBody: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 8,
    justifyContent: 'space-between',
  },
  cardTitle: {
    height: TITLE_BLOCK_HEIGHT,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.12,
  },
  cardDescription: {
    height: DESCRIPTION_BLOCK_HEIGHT,
    marginTop: 4,
    fontSize: 11,
    lineHeight: 14,
    color: THEME.colors.textSecondary,
  },
  cardFooter: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 26,
  },
  tag: {
    flex: 1,
    marginRight: 6,
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
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: THEME.colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    color: THEME.colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
});
