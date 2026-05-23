export interface MembershipPlanTheme {
  accent: string;
  accentDark: string;
  cardBg: string;
  badgeBg: string;
  badgeText: string;
  iconBg: string;
  softBorder: string;
  footerTint: string;
}

const PLAN_THEMES: readonly MembershipPlanTheme[] = [
  {
    accent: '#6366F1',
    accentDark: '#4F46E5',
    cardBg: '#F0F4FF',
    badgeBg: '#6366F1',
    badgeText: '#FFFFFF',
    iconBg: '#6366F1',
    softBorder: 'rgba(99,102,241,0.35)',
    footerTint: '#EEF2FF',
  },
  {
    accent: '#10B981',
    accentDark: '#059669',
    cardBg: '#F0FFF8',
    badgeBg: '#10B981',
    badgeText: '#FFFFFF',
    iconBg: '#10B981',
    softBorder: 'rgba(16,185,129,0.35)',
    footerTint: '#ECFDF5',
  },
  {
    accent: '#D97706',
    accentDark: '#B45309',
    cardBg: '#FFFBF0',
    badgeBg: '#D97706',
    badgeText: '#FFFFFF',
    iconBg: '#D97706',
    softBorder: 'rgba(217,119,6,0.35)',
    footerTint: '#FFFBEB',
  },
  {
    accent: '#8B5CF6',
    accentDark: '#7C3AED',
    cardBg: '#F5F3FF',
    badgeBg: '#8B5CF6',
    badgeText: '#FFFFFF',
    iconBg: '#8B5CF6',
    softBorder: 'rgba(139,92,246,0.35)',
    footerTint: '#EDE9FE',
  },
  {
    accent: '#0EA5E9',
    accentDark: '#0284C7',
    cardBg: '#F0F9FF',
    badgeBg: '#0EA5E9',
    badgeText: '#FFFFFF',
    iconBg: '#0EA5E9',
    softBorder: 'rgba(14,165,233,0.35)',
    footerTint: '#E0F2FE',
  },
  {
    accent: '#F43F5E',
    accentDark: '#E11D48',
    cardBg: '#FFF1F2',
    badgeBg: '#F43F5E',
    badgeText: '#FFFFFF',
    iconBg: '#F43F5E',
    softBorder: 'rgba(244,63,94,0.35)',
    footerTint: '#FFE4E6',
  },
] as const;

export function getMembershipPlanTheme(index: number): MembershipPlanTheme {
  return PLAN_THEMES[index % PLAN_THEMES.length] ?? PLAN_THEMES[0];
}
