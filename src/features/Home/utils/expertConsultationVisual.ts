const SEGMENT_ICONS = [
  'briefcase-outline',
  'business-outline',
  'construct-outline',
  'globe-outline',
  'layers-outline',
  'people-outline',
  'pie-chart-outline',
  'ribbon-outline',
  'rocket-outline',
  'shield-checkmark-outline',
  'trending-up-outline',
  'wallet-outline',
] as const;

const HERO_PRESETS = [
  { gradient: ['#60A5FA', '#2563EB'] as const, iconColor: '#FFFFFF' },
  { gradient: ['#4ADE80', '#16A34A'] as const, iconColor: '#FFFFFF' },
  { gradient: ['#A78BFA', '#7C3AED'] as const, iconColor: '#FFFFFF' },
  { gradient: ['#FBBF24', '#D97706'] as const, iconColor: '#FFFFFF' },
  { gradient: ['#2DD4BF', '#0D9488'] as const, iconColor: '#FFFFFF' },
  { gradient: ['#FB7185', '#E11D48'] as const, iconColor: '#FFFFFF' },
] as const;

export function iconNameForSegmentSlug(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash + slug.charCodeAt(i) * (i + 1)) % 2_147_483_647;
  }
  return SEGMENT_ICONS[Math.abs(hash) % SEGMENT_ICONS.length] ?? SEGMENT_ICONS[0];
}

export function gradientPresetForSegmentSlug(slug: string): (typeof HERO_PRESETS)[number] {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash += slug.charCodeAt(i);
  }
  return HERO_PRESETS[hash % HERO_PRESETS.length] ?? HERO_PRESETS[0];
}
