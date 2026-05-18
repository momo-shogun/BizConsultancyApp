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
    backgroundColor: '#F5F3FF',
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  badgeText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.bold as '700',
    letterSpacing: 0.8,
    color: '#6D28D9',
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
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: THEME.spacing[12],
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[12],
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  thumbWrap: {
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  rowBody: {
    flex: 1,
    gap: 4,
    paddingTop: 2,
  },
  rowIndex: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.bold as '700',
    color: '#7C3AED',
    marginBottom: 2,
  },
  rowTitle: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: SLATE_900,
    lineHeight: 20,
  },
  rowDescription: {
    fontSize: THEME.typography.size[12],
    lineHeight: 18,
    color: SLATE_600,
  },
});
