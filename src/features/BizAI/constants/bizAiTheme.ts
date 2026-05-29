/** Biz AI feature design tokens — dark assistant surface. */
export const BIZ_AI_THEME = {
  bg: {
    base: '#0B0F19',
    elevated: 'rgba(255,255,255,0.05)',
    surface: 'rgba(255,255,255,0.07)',
    surfaceHover: 'rgba(255,255,255,0.1)',
    glass: 'rgba(15,23,42,0.72)',
    composer: 'rgba(20,28,45,0.96)',
  },
  border: {
    subtle: 'rgba(255,255,255,0.08)',
    default: 'rgba(255,255,255,0.12)',
    strong: 'rgba(148,163,184,0.28)',
    accent: 'rgba(165,180,252,0.35)',
  },
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255,255,255,0.72)',
    muted: 'rgba(255,255,255,0.52)',
    faint: 'rgba(255,255,255,0.4)',
    accent: '#C7D2FE',
    accentBright: '#A5B4FC',
  },
  accent: {
    indigo: '#6366F1',
    sky: '#38BDF8',
    violet: '#A855F7',
    pink: '#EC4899',
    success: '#22C55E',
    error: '#FCA5A5',
  },
  gradient: {
    screen: ['#0B0F19', '#0F172A', '#1E1B4B', '#1E3A5F'],
    screenLocations: [0, 0.4, 0.75, 1] as number[],
    loader: ['rgba(14,165,233,0.14)', 'rgba(59,130,246,0.05)', 'rgba(168,85,247,0.12)'],
    sendActive: ['#38BDF8', '#6366F1', '#EC4899'],
    sendDisabled: ['#334155', '#334155'],
    dockFade: ['transparent', 'rgba(11,15,25,0.85)', 'rgba(11,15,25,0.98)'],
  },
  radius: {
    sm: 10,
    md: 14,
    lg: 18,
    xl: 22,
    pill: 999,
  },
  spacing: {
    screenX: 20,
    section: 28,
    block: 16,
    item: 12,
    tight: 8,
  },
  touch: {
    min: 44,
  },
  shadow: {
    card: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.22,
      shadowRadius: 16,
      elevation: 6,
    },
  },
} as const;
