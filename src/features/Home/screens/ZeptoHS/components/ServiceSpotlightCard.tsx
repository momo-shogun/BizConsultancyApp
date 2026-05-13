import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View, type DimensionValue } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';

/** Darker sibling of spotlight band `#1E3A8A` → `#0D9488` — meta strip bg */
const SERVICE_SPOTLIGHT_META_GRADIENT = ['#172554', '#0F766E'] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Icon pool — maps slugs → Ionicons names deterministically
// ─────────────────────────────────────────────────────────────────────────────
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

function iconNameForServiceSlug(slug: string): string {
  let h = 0;
  for (let i = 0; i < slug.length; i += 1) {
    h = (h + slug.charCodeAt(i) * (i + 1)) % 2_147_483_647;
  }
  return SERVICE_SPOTLIGHT_ICONS[Math.abs(h) % SERVICE_SPOTLIGHT_ICONS.length] ??
    SERVICE_SPOTLIGHT_ICONS[0];
}

// ─────────────────────────────────────────────────────────────────────────────
// Color presets
//
// WHY curated presets instead of hexToRgba(accentColor):
//   A single accentColor tinted at 8% opacity gives a washed-out, generic
//   background. Curated presets use deliberate palette stops for the icon
//   tile so each card stays distinct while the meta strip shares one gradient.
// ─────────────────────────────────────────────────────────────────────────────
const VISUAL_PRESETS = [
  { visualBg: '#EAF3DE', iconColor: '#3B6D11' },
  { visualBg: '#E6F1FB', iconColor: '#185FA5' },
  { visualBg: '#EEEDFE', iconColor: '#534AB7' },
  { visualBg: '#FAEEDA', iconColor: '#854F0B' },
  { visualBg: '#E1F5EE', iconColor: '#0F6E56' },
  { visualBg: '#FAECE7', iconColor: '#993C1D' },
] as const;

function presetForSlug(slug: string) {
  let h = 0;
  for (let i = 0; i < slug.length; i += 1) h += slug.charCodeAt(i);
  return VISUAL_PRESETS[h % VISUAL_PRESETS.length] ?? VISUAL_PRESETS[0];
}

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────
export interface ServiceSpotlightCardProps {
  title: string;
  slug: string;
  /** Still accepted for backwards-compat but no longer drives the palette */
  accentColor: string;
  cardWidth: DimensionValue;
  onPress: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export function ServiceSpotlightCard({
  title,
  slug,
  cardWidth,
  onPress,
}: ServiceSpotlightCardProps): React.ReactElement {
  const iconName = useMemo(() => iconNameForServiceSlug(slug), [slug]);
  const preset   = useMemo(() => presetForSlug(slug), [slug]);

  return (
    <View style={[styles.root, { width: cardWidth }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${title}. Opens service details.`}
        accessibilityHint="Opens this service in the Services tab"
        onPress={onPress}
        style={({ pressed }) => [styles.pressable, pressed && styles.pressablePressed]}
      >
        {/* ── Visual area ───────────────────────────────────────────────── */}
        <View style={[styles.visual, { backgroundColor: preset.visualBg }]}>
          <Ionicons name={iconName} size={34} color={preset.iconColor} />
        </View>

        <LinearGradient
          colors={[SERVICE_SPOTLIGHT_META_GRADIENT[0], SERVICE_SPOTLIGHT_META_GRADIENT[1]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.meta}
        >
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
            {title}
          </Text>
          <View style={styles.hintRow}>
            <View style={styles.dot} />
            <Text style={styles.hint} numberOfLines={1}>
              Expert-assisted
            </Text>
          </View>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    borderRadius: THEME.radius[12],
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.white,
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  pressable: {
    flex: 1,
  },
  pressablePressed: {
    opacity: 0.9,
  },

  // ── Visual area ──────────────────────────────────────────────────────
  visual: {
    height: 104,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Meta strip ───────────────────────────────────────────────────────
  meta: {
    paddingHorizontal: THEME.spacing[10],
    paddingTop: THEME.spacing[10],
    paddingBottom: THEME.spacing[12],
    gap: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.14)',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.white,
    lineHeight: 18,
    letterSpacing: -0.1,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 99,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  hint: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.88)',
    lineHeight: 14,
  },
});