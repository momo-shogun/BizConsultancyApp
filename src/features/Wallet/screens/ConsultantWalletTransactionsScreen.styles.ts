import { StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

const HAIRLINE = '#F0F0F0';
const SLATE_MUTED = '#878787';
const TEXT_PRIMARY = '#1C1C1C';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  listSheet: {
    flex: 1,
    backgroundColor: THEME.colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  listContent: {
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[16],
    paddingBottom: THEME.spacing[24],
    flexGrow: 1,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing[14],
  },
  listHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_PRIMARY,
  },
  listHeaderMeta: {
    fontSize: 12,
    fontWeight: '600',
    color: SLATE_MUTED,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: SLATE_MUTED,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: THEME.spacing[8],
    marginTop: THEME.spacing[12],
  },
  sectionTitleFirst: {
    marginTop: 0,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: THEME.spacing[24],
    gap: THEME.spacing[12],
    backgroundColor: THEME.colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  loadingText: {
    fontSize: THEME.typography.size[14],
    color: SLATE_MUTED,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: THEME.spacing[36],
    paddingHorizontal: THEME.spacing[20],
    gap: THEME.spacing[8],
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F7F8FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing[4],
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 21,
    color: SLATE_MUTED,
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: THEME.spacing[8],
    minHeight: 44,
    paddingHorizontal: THEME.spacing[20],
    borderRadius: 8,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing[16],
    marginTop: THEME.spacing[20],
    paddingTop: THEME.spacing[16],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: HAIRLINE,
  },
  pageBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F7F8FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageBtnDisabled: {
    opacity: 0.45,
  },
  pageLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    minWidth: 56,
    textAlign: 'center',
  },
  footerSpace: {
    height: THEME.spacing[8],
  },
});
