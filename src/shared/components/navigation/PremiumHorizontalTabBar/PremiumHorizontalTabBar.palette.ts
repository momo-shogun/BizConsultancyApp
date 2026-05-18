/** Fintech-forward palette — complements app forest-green hero. */
export const premiumTabPalette = {
  light: {
    shellBg: 'rgba(255,255,255,0.92)',
    shellBorder: 'rgba(226,232,240,0.95)',
    trackBg: '#F1F5F9',
    inactiveText: '#64748B',
    inactiveIcon: '#94A3B8',
    activeText: '#FFFFFF',
    activeIcon: '#FFFFFF',
    glow: 'rgba(79,70,229,0.22)',
    pillGradient: ['#4F46E5', '#6366F1', '#7C3AED'] as const,
    shadow: '#0F172A',
  },
  dark: {
    shellBg: 'rgba(15,23,42,0.88)',
    shellBorder: 'rgba(51,65,85,0.9)',
    trackBg: 'rgba(30,41,59,0.65)',
    inactiveText: '#94A3B8',
    inactiveIcon: '#64748B',
    activeText: '#FFFFFF',
    activeIcon: '#FFFFFF',
    glow: 'rgba(129,140,248,0.35)',
    pillGradient: ['#6366F1', '#8B5CF6', '#A855F7'] as const,
    shadow: '#000000',
  },
} as const;
