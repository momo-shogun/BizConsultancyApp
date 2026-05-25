import { THEME } from '@/constants/theme';

/** Diagnosis tab shell + brand forest green accents. */
export const DIAGNOSIS_THEME = {
  heroBg: '#E0F2FE',
  heroAccent: '#2563EB',
  heroAccentSoft: 'rgba(37, 99, 235, 0.12)',
  heroAccentBorder: 'rgba(37, 99, 235, 0.22)',
  pageBg: THEME.colors.surface,
  contentBg: THEME.colors.white,
  textPrimary: THEME.colors.textPrimary,
  textSecondary: THEME.colors.textSecondary,
  border: THEME.colors.border,
  brandPrimary: THEME.colors.primary,
  brandGreen: THEME.colors.accentGreen,
  brandGreenSoft: 'rgba(15, 81, 50, 0.08)',
  shadow: 'rgba(11, 61, 44, 0.10)',
} as const;

export interface PlanTierVisual {
  gradient: readonly [string, string];
  accent: string;
  accentSoft: string;
  icon: string;
}

export function getPlanTierVisual(packTitle: string): PlanTierVisual {
  const title = packTitle.toLowerCase();
  if (title.includes('strategy')) {
    return {
      gradient: ['#3D8F55', '#0F5132'],
      accent: THEME.colors.primary,
      accentSoft: 'rgba(15, 81, 50, 0.12)',
      icon: 'rocket-outline',
    };
  }
  if (title.includes('growth')) {
    return {
      gradient: ['#60A5FA', '#2563EB'],
      accent: '#2563EB',
      accentSoft: 'rgba(37, 99, 235, 0.12)',
      icon: 'trending-up-outline',
    };
  }
  return {
    gradient: ['#2DD4BF', '#0D9488'],
    accent: '#0D9488',
    accentSoft: 'rgba(13, 148, 136, 0.12)',
    icon: 'leaf-outline',
  };
}

export function hexToRgba(hex: string, alpha: number): string {
  const raw = hex.replace('#', '').trim();
  if (raw.length !== 6) return `rgba(15, 81, 50, ${alpha})`;
  const r = Number.parseInt(raw.slice(0, 2), 16);
  const g = Number.parseInt(raw.slice(2, 4), 16);
  const b = Number.parseInt(raw.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return `rgba(15, 81, 50, ${alpha})`;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
