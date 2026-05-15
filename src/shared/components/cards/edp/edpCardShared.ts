import { StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

/** Flat card — no shadow, no border (grid tiles, nested groups). */
export const edpCardBase = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.white,
    borderRadius: 20,
    overflow: 'hidden',
  },
  /** Bordered card — separation on white page background (lists, key blocks). */
  cardBordered: {
    backgroundColor: THEME.colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: THEME.colors.border,
  },
  /** Soft fill without border — metric tiles on white sections. */
  cardSurface: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 20,
    overflow: 'hidden',
  },
});

export function accentAlpha(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '');
  const value = Number.parseInt(normalized, 16);
  if (Number.isNaN(value)) {
    return hex;
  }
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}
