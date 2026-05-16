import React, { useMemo } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';

export type ImagePlaceholderVariant = 'card' | 'avatar' | 'media';

export interface ImagePlaceholderProps {
  variant?: ImagePlaceholderVariant;
  /** Optional label for initials (e.g. consultant name). */
  name?: string;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  const letters = (first + last).toUpperCase();
  return letters.length > 0 ? letters : '?';
}

const VARIANT_CONFIG: Record<
  ImagePlaceholderVariant,
  { icon: React.ComponentProps<typeof Ionicons>['name']; iconSize: number; showInitials: boolean }
> = {
  card: { icon: 'person-outline', iconSize: 40, showInitials: true },
  avatar: { icon: 'person-outline', iconSize: 28, showInitials: true },
  media: { icon: 'image-outline', iconSize: 32, showInitials: false },
};

/**
 * Production placeholder when remote media is missing or failed to load.
 * No stock-photo fallbacks — neutral gradient + icon (+ optional initials).
 */
export function ImagePlaceholder({
  variant = 'card',
  name,
  style,
  accessibilityLabel = 'Image unavailable',
}: ImagePlaceholderProps): React.ReactElement {
  const config = VARIANT_CONFIG[variant];
  const initials = useMemo(
    () => (name != null && name.trim().length > 0 ? initialsFromName(name) : null),
    [name],
  );

  const gradientColors =
    variant === 'media'
      ? (['#1E293B', '#334155'] as const)
      : (['#E8EEF4', '#CBD5E1'] as const);

  const iconColor = variant === 'media' ? 'rgba(255,255,255,0.72)' : '#64748B';
  const initialsColor = variant === 'media' ? THEME.colors.white : '#475569';

  return (
    <View
      style={[styles.root, style]}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
    >
      <LinearGradient
        colors={[...gradientColors]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>
        <View
          style={[
            styles.iconWrap,
            variant === 'avatar' ? styles.iconWrapAvatar : null,
            variant === 'media' ? styles.iconWrapMedia : null,
          ]}
        >
          <Ionicons name={config.icon} size={config.iconSize} color={iconColor} />
        </View>
        {config.showInitials && initials != null ? (
          <Text style={[styles.initials, { color: initialsColor }]}>{initials}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: THEME.spacing[12],
    gap: THEME.spacing[8],
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,23,42,0.08)',
  },
  iconWrapAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  iconWrapMedia: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.2)',
  },
  initials: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
});
