import { StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

export const WORKSHOP_CANVAS = '#F4F7FB';
const SLATE_LINE = '#E2E8F0';
const SLATE_MUTED = '#64748B';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: WORKSHOP_CANVAS,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[4],
    paddingBottom: THEME.spacing[20],
    gap: THEME.spacing[10],
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: THEME.spacing[20],
  },
  heroGradient: {
    borderRadius: 16,
    padding: THEME.spacing[14],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[10],
    flex: 1,
  },
  heroTitle: {
    fontSize: THEME.typography.size[17],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.white,
  },
  heroMeta: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.88)',
    marginTop: 2,
  },
  browseLink: {
    fontSize: 11,
    fontWeight: THEME.typography.weight.semibold as '600',
    color: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
    backgroundColor: THEME.colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: SLATE_LINE,
    paddingHorizontal: THEME.spacing[12],
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: THEME.typography.size[14],
    color: THEME.colors.textPrimary,
  },
  listBlock: {
    backgroundColor: THEME.colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: SLATE_LINE,
    overflow: 'hidden',
  },
  listHeader: {
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[10],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: SLATE_LINE,
    backgroundColor: '#FAFBFC',
  },
  listHeaderTitle: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
  },
  listHeaderMeta: {
    fontSize: 11,
    color: SLATE_MUTED,
    marginTop: 2,
  },
  workshopRow: {
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[10],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: SLATE_LINE,
    gap: 8,
  },
  workshopRowLast: {
    borderBottomWidth: 0,
  },
  workshopTitle: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textPrimary,
  },
  metaLine: {
    fontSize: 11,
    color: SLATE_MUTED,
    lineHeight: 15,
  },
  metaTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  metaTag: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  metaTagText: {
    fontSize: 10,
    fontWeight: THEME.typography.weight.medium as '500',
    color: '#475569',
    textTransform: 'capitalize',
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  actionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
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
    fontSize: 10,
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.white,
  },
  actionBtnTextMuted: {
    color: SLATE_MUTED,
  },
  actionBtnTextWarning: {
    color: '#B45309',
  },
  emptyBlock: {
    padding: THEME.spacing[24],
    alignItems: 'center',
    gap: THEME.spacing[10],
  },
  detailLine: {
    fontSize: THEME.typography.size[12],
    color: SLATE_MUTED,
    textAlign: 'center',
    lineHeight: 17,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing[10],
  },
  pageBtn: {
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: SLATE_LINE,
    backgroundColor: THEME.colors.white,
  },
  pageBtnDisabled: {
    opacity: 0.45,
  },
  pageBtnText: {
    fontSize: 11,
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textPrimary,
  },
  pageLabel: {
    fontSize: 11,
    color: SLATE_MUTED,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.5)',
    justifyContent: 'center',
    padding: THEME.spacing[16],
  },
  modalCard: {
    backgroundColor: THEME.colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: SLATE_LINE,
    padding: THEME.spacing[20],
    gap: THEME.spacing[12],
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: THEME.typography.size[17],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
    textAlign: 'center',
  },
  certBox: {
    borderWidth: 1,
    borderColor: SLATE_LINE,
    borderRadius: 12,
    padding: THEME.spacing[16],
    backgroundColor: '#FFFBEB',
    gap: THEME.spacing[10],
  },
  certLine: {
    fontSize: THEME.typography.size[13],
    color: THEME.colors.textPrimary,
    lineHeight: 20,
    textAlign: 'center',
  },
  certHighlight: {
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.primary,
  },
  certNumber: {
    fontSize: 11,
    color: SLATE_MUTED,
    textAlign: 'center',
  },
  modalCloseBtn: {
    alignSelf: 'center',
    paddingHorizontal: THEME.spacing[18],
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: THEME.colors.primary,
  },
  modalCloseText: {
    fontSize: THEME.typography.size[13],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.white,
  },
});
