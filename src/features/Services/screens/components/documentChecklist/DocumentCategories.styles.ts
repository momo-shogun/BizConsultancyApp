import { StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

const BLUE = '#1D4ED8';
const SLATE_600 = '#475569';
const SLATE_900 = '#0F172A';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: THEME.spacing[16],
    paddingBottom: THEME.spacing[8],
    gap: THEME.spacing[10],
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: THEME.spacing[10],
    paddingVertical: THEME.spacing[4],
    borderRadius: 999,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  badgeText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.bold as '700',
    letterSpacing: 0.8,
    color: BLUE,
  },
  titleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    gap: 4,
  },
  title: {
    fontSize: THEME.typography.size[18],
    fontWeight: THEME.typography.weight.bold as '700',
    color: SLATE_900,
    lineHeight: 24,
  },
  titleHighlight: {
    fontSize: THEME.typography.size[18],
    fontWeight: THEME.typography.weight.bold as '700',
    color: BLUE,
    lineHeight: 24,
  },
  card: {
    borderRadius: 14,
    backgroundColor: THEME.colors.white,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  categoryBlock: {
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[10],
  },
  categoryBlockBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
    marginBottom: THEME.spacing[8],
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryTitle: {
    flex: 1,
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: SLATE_900,
  },
  countPill: {
    paddingHorizontal: THEME.spacing[8],
    paddingVertical: 2,
    borderRadius: 999,
  },
  countText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.bold as '700',
  },
  docList: {
    gap: 6,
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: THEME.spacing[8],
  },
  docIcon: {
    marginTop: 2,
  },
  docText: {
    flex: 1,
    fontSize: THEME.typography.size[12],
    lineHeight: 18,
    color: SLATE_600,
    fontWeight: THEME.typography.weight.medium as '500',
  },
  emptyContainer: {
    paddingHorizontal: THEME.spacing[16],
    paddingVertical: THEME.spacing[20],
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.bold as '700',
    color: SLATE_900,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: THEME.typography.size[12],
    color: SLATE_600,
    textAlign: 'center',
    lineHeight: 18,
  },
});
