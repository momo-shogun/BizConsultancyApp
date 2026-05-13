import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View, type DimensionValue } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';

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
//   background. Curated presets use deliberate palette stops — the bg, icon
//   color, add-button border, and dot all come from the same ramp at
//   harmonious stops, giving each card a distinct identity while staying
//   cohesive as a set.
// ─────────────────────────────────────────────────────────────────────────────
const VISUAL_PRESETS = [
  // Green
  { visualBg: '#EAF3DE', iconColor: '#3B6D11', accentBorder: '#3B6D11', dotColor: '#3B6D11' },
  // Blue
  { visualBg: '#E6F1FB', iconColor: '#185FA5', accentBorder: '#185FA5', dotColor: '#185FA5' },
  // Purple
  { visualBg: '#EEEDFE', iconColor: '#534AB7', accentBorder: '#534AB7', dotColor: '#534AB7' },
  // Amber
  { visualBg: '#FAEEDA', iconColor: '#854F0B', accentBorder: '#854F0B', dotColor: '#854F0B' },
  // Teal
  { visualBg: '#E1F5EE', iconColor: '#0F6E56', accentBorder: '#0F6E56', dotColor: '#0F6E56' },
  // Coral
  { visualBg: '#FAECE7', iconColor: '#993C1D', accentBorder: '#993C1D', dotColor: '#993C1D' },
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

          {/* Add / inquire button — bottom-right corner */}
          <View style={[styles.addBtn, { borderColor: preset.accentBorder }]}>
            <Ionicons name="add" size={16} color={preset.accentBorder} />
          </View>
        </View>

        {/* ── Meta strip ────────────────────────────────────────────────── */}
        <View style={styles.meta}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
            {title}
          </Text>
          <View style={styles.hintRow}>
            {/* Tiny color dot ties the meta strip back to the visual palette */}
            <View style={[styles.dot, { backgroundColor: preset.dotColor }]} />
            <Text style={styles.hint} numberOfLines={1}>
              Expert-assisted
            </Text>
          </View>
        </View>
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
    position: 'relative',
    height: 104,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Add button — bottom-right, white bg so it lifts off the tinted visual
  addBtn: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.white,
  },

  // ── Meta strip ───────────────────────────────────────────────────────
  meta: {
    paddingHorizontal: THEME.spacing[10],
    paddingTop: THEME.spacing[10],
    paddingBottom: THEME.spacing[12],
    gap: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: THEME.colors.border,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
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
  },
  hint: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    lineHeight: 14,
  },
});