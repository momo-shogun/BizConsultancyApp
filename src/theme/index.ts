export const colors = {
  background: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceHover: '#F1F5F9',

  border: '#E2E8F0',
  borderFocus: '#22C55E',

  text: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#64748B',
  textInverse: '#FFFFFF',

  accent: '#15803D',
  accentHover: '#166534',
  accentSoft: '#ECFDF5',

  /** Hero / login band — slightly cooler mint than accentSoft for depth */
  heroWash: '#EFF8F4',

  /** Primary action surfaces (e.g. sign-in CTA) — high contrast on light UI */
  ctaBackground: '#0F172A',
  ctaBackgroundPressed: '#1E293B',

  /** Soft input well / mint wash */
  inputMuted: '#F0FDF4',

  /** Decorative hero blobs — desaturated for a premium calm hero */
  blobSage: '#C5ECD6',
  blobTeal: '#C9F3EE',
  blobSky: '#DCECF8',
  /** Extra accent orb (cyan-green, ties to eco + clarity) */
  blobMist: '#E0F7FA',

  success: '#059669',
  successSoft: '#ECFDF5',

  warning: '#D97706',
  warningSoft: '#FFFBEB',

  error: '#DC2626',
  errorSoft: '#FEF2F2',

  overlay: 'rgba(15, 23, 42, 0.04)',
} as const;

/** Base rhythm: use `xs` (5) for tight stacks between related blocks app-wide. */
export const spacing = {
  xs: 5,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
} as const;

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
    letterSpacing: -0.5,
    color: colors.text,
  },
  h2: {
    fontSize: 22,
    fontWeight: '600' as const,
    lineHeight: 28,
    letterSpacing: -0.3,
    color: colors.text,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
    color: colors.text,
  },
  bodyMedium: {
    fontSize: 15,
    fontWeight: '500' as const,
    lineHeight: 22,
    color: colors.text,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
    color: colors.textMuted,
  },
  label: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
    color: colors.textSecondary,
  },
} as const;

export const shadows = {
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
} as const;
