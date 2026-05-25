import { Platform, StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

export const WORKSHOP_CANVAS = '#F8FAFC';
const SLATE_LINE = '#E2E8F0';

const CARD_SHADOW = Platform.select({
  ios: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  android: { elevation: 3 },
  default: {},
});

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: WORKSHOP_CANVAS,
  },
  scrollContent: {
    padding: THEME.spacing[16],
    paddingBottom: THEME.spacing[24],
    gap: THEME.spacing[12],
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: THEME.spacing[24],
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: THEME.radius[16],
    padding: THEME.spacing[16],
    backgroundColor: '#0D9488',
    ...CARD_SHADOW,
  },
  heroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[10],
    flex: 1,
  },
  heroTitle: {
    fontSize: THEME.typography.size[18],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.white,
  },
  browseLink: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: 'rgba(255,255,255,0.95)',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius[12],
    borderWidth: 1,
    borderColor: SLATE_LINE,
    paddingHorizontal: THEME.spacing[12],
    ...CARD_SHADOW,
  },
  searchInput: {
    flex: 1,
    paddingVertical: THEME.spacing[12],
    fontSize: THEME.typography.size[14],
    color: THEME.colors.textPrimary,
  },
  resultCount: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
    marginLeft: THEME.spacing[4],
  },
  card: {
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius[16],
    borderWidth: 1,
    borderColor: SLATE_LINE,
    padding: THEME.spacing[14],
    gap: THEME.spacing[10],
    ...CARD_SHADOW,
  },
  cardTitle: {
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing[8],
  },
  metaChip: {
    paddingHorizontal: THEME.spacing[8],
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  metaChipText: {
    fontSize: 11,
    fontWeight: THEME.typography.weight.medium as '500',
    color: '#475569',
    textTransform: 'capitalize',
  },
  detailLine: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
    lineHeight: 17,
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing[8],
    marginTop: THEME.spacing[4],
  },
  actionBtn: {
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[8],
    borderRadius: THEME.radius[12],
  },
  actionBtnPrimary: {
    backgroundColor: THEME.colors.primary,
  },
  actionBtnSky: {
    backgroundColor: '#0284C7',
  },
  actionBtnMuted: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: SLATE_LINE,
  },
  actionBtnWarning: {
    backgroundColor: 'rgba(245,158,11,0.15)',
  },
  actionBtnText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.white,
  },
  actionBtnTextMuted: {
    color: '#64748B',
  },
  actionBtnTextWarning: {
    color: '#B45309',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: THEME.spacing[28],
    gap: THEME.spacing[12],
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(13,148,136,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing[12],
    marginTop: THEME.spacing[4],
  },
  pageBtn: {
    paddingHorizontal: THEME.spacing[14],
    paddingVertical: THEME.spacing[8],
    borderRadius: THEME.radius[12],
    borderWidth: 1,
    borderColor: SLATE_LINE,
    backgroundColor: THEME.colors.white,
  },
  pageBtnDisabled: {
    opacity: 0.45,
  },
  pageBtnText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textPrimary,
  },
  pageLabel: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.5)',
    justifyContent: 'center',
    padding: THEME.spacing[16],
  },
  modalCard: {
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius[16],
    padding: THEME.spacing[20],
    gap: THEME.spacing[12],
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: THEME.typography.size[18],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
    textAlign: 'center',
  },
  certBox: {
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderRadius: THEME.radius[12],
    padding: THEME.spacing[20],
    backgroundColor: '#FFFBEB',
    gap: THEME.spacing[12],
  },
  certLine: {
    fontSize: THEME.typography.size[14],
    color: THEME.colors.textPrimary,
    lineHeight: 22,
    textAlign: 'center',
  },
  certHighlight: {
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.primary,
  },
  certNumber: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
    textAlign: 'center',
  },
  modalCloseBtn: {
    alignSelf: 'center',
    paddingHorizontal: THEME.spacing[20],
    paddingVertical: THEME.spacing[10],
    borderRadius: THEME.radius[12],
    backgroundColor: THEME.colors.primary,
  },
  modalCloseText: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.white,
  },
});
