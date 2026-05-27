import { Dimensions, StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

const { width: screenWidth } = Dimensions.get('window');
const horizontalPadding = THEME.spacing[16];
const cardGap = THEME.spacing[12];
const cardWidth = (screenWidth - horizontalPadding * 2 - cardGap) / 2;

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: THEME.spacing[24],
  },
  heroCard: {
    marginTop: THEME.spacing[8],
    marginHorizontal: horizontalPadding,
    padding: THEME.spacing[16],
    borderRadius: 16,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    gap: THEME.spacing[8],
  },
  heroEyebrow: {
    fontSize: THEME.typography.size[12],
    color: '#047857',
    fontWeight: THEME.typography.weight.bold as '700',
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 18,
    color: THEME.colors.textPrimary,
    fontWeight: THEME.typography.weight.bold as '700',
  },
  heroSubtitle: {
    fontSize: 11,
    lineHeight: 16,
    color: THEME.colors.textSecondary,
  },
  searchWrap: {
    marginHorizontal: horizontalPadding,
    marginTop: THEME.spacing[14],
    paddingHorizontal: THEME.spacing[12],
    height: 46,
    borderRadius: 14,
    backgroundColor: THEME.colors.white,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: THEME.colors.textPrimary,
    paddingVertical: 0,
  },
  countText: {
    minWidth: 24,
    textAlign: 'right',
    fontSize: 11,
    color: THEME.colors.textSecondary,
    fontWeight: THEME.typography.weight.semibold as '600',
  },
  grid: {
    marginTop: THEME.spacing[16],
    paddingHorizontal: horizontalPadding,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: cardGap,
  },
  cardPressable: {
    width: cardWidth,
    borderRadius: 18,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  card: {
    borderRadius: 18,
    backgroundColor: THEME.colors.white,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 3,
  },
  imageWrap: {
    height: 92,
    backgroundColor: '#E2E8F0',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageFallback: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  cornerCta: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(15,23,42,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    padding: THEME.spacing[10],
    minHeight: 132,
  },
  cardTitle: {
    fontSize: 13,
    lineHeight: 16,
    color: THEME.colors.textPrimary,
    fontWeight: THEME.typography.weight.bold as '700',
    minHeight: 34,
  },
  metaRow: {
    marginTop: THEME.spacing[10],
    paddingHorizontal: THEME.spacing[10],
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.70)',
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.10)',
  },
  metaText: {
    fontSize: 11,
    color: THEME.colors.textPrimary,
    fontWeight: THEME.typography.weight.semibold as '600',
  },
  progressBlock: {
    marginTop: THEME.spacing[10],
    gap: THEME.spacing[8],
  },
  progressTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    fontWeight: THEME.typography.weight.semibold as '600',
  },
  progressBadge: {
    paddingHorizontal: THEME.spacing[8],
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(15,81,50,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(15,81,50,0.18)',
  },
  progressBadgeText: {
    fontSize: 11,
    color: THEME.colors.primary,
    fontWeight: THEME.typography.weight.bold as '700',
  },
  progressTrack: {
    height: 6,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: 'rgba(15,23,42,0.08)',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: THEME.colors.primary,
  },
  cardFooter: {
    marginTop: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: THEME.spacing[12],
  },
  cardMeta: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
  },
  openLabel: {
    fontSize: 11,
    color: '#0F766E',
    fontWeight: THEME.typography.weight.bold as '700',
  },
  messageCard: {
    marginTop: THEME.spacing[16],
    marginHorizontal: horizontalPadding,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: THEME.colors.white,
    padding: THEME.spacing[14],
    gap: THEME.spacing[6],
  },
  messageTitle: {
    fontSize: 13,
    color: THEME.colors.textPrimary,
    fontWeight: THEME.typography.weight.bold as '700',
  },
  messageBody: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
  },
});