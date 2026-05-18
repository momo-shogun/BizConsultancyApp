import { StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

const BLUE = '#1D4ED8';
const BLUE_SOFT = '#EFF6FF';
const BLUE_BORDER = '#BFDBFE';
const SLATE_600 = '#475569';
const SLATE_900 = '#0F172A';

export const eligibilityColors = {
  blue: BLUE,
  blueSoft: BLUE_SOFT,
  blueBorder: BLUE_BORDER,
  slate600: SLATE_600,
  slate900: SLATE_900,
} as const;

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: THEME.spacing[16],
    paddingBottom: THEME.spacing[8],
    gap: THEME.spacing[16],
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[8],
    borderRadius: 999,
    backgroundColor: BLUE_SOFT,
    borderWidth: 1,
    borderColor: BLUE_BORDER,
  },
  badgeText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.bold as '700',
    letterSpacing: 1.2,
    color: BLUE,
  },
  titleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    gap: 4,
  },
  title: {
    fontSize: THEME.typography.size[20],
    fontWeight: THEME.typography.weight.bold as '700',
    color: SLATE_900,
    lineHeight: 30,
  },
  titleHighlight: {
    fontSize: THEME.typography.size[20],
    fontWeight: THEME.typography.weight.bold as '700',
    color: BLUE,
    lineHeight: 30,
  },
  descriptionCard: {
    padding: THEME.spacing[14],
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  description: {
    fontSize: THEME.typography.size[14],
    lineHeight: 22,
    color: SLATE_600,
  },
  listCard: {
    borderRadius: 16,
    backgroundColor: THEME.colors.white,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing[14],
    paddingVertical: THEME.spacing[14],
    gap: THEME.spacing[12],
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: BLUE_SOFT,
    borderWidth: 1,
    borderColor: BLUE_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIndex: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.bold as '700',
    color: BLUE,
  },
  rowContent: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: SLATE_900,
    lineHeight: 20,
  },
  rowDesc: {
    fontSize: THEME.typography.size[12],
    lineHeight: 18,
    color: SLATE_600,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing[16],
    paddingTop: THEME.spacing[4],
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: THEME.typography.size[12],
    color: SLATE_600,
    fontWeight: THEME.typography.weight.medium as '500',
  },
});
