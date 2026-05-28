import { StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

export const CANVAS = '#F4F7FB';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },


  topChrome: {
    width: '100%',
    backgroundColor: THEME.colors.primary,
  },

  
  flex: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[16],
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: THEME.spacing[10],
    borderRadius: 14,
    padding: THEME.spacing[14],
    marginBottom: THEME.spacing[16],
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  bannerText: {
    flex: 1,
    fontSize: 13,
    color: '#065F46',
    lineHeight: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: THEME.spacing[8],
  },
  card: {
    backgroundColor: THEME.colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8EEF4',
    padding: THEME.spacing[16],
    gap: THEME.spacing[14],
    marginBottom: THEME.spacing[16],
  },
  fieldBlock: {
    gap: THEME.spacing[8],
  },
  fieldLabel: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.medium as '500',
    color: THEME.colors.textPrimary,
  },
  fieldError: {
    fontSize: THEME.typography.size[12],
    lineHeight: 16,
    color: THEME.colors.danger,
    fontWeight: THEME.typography.weight.medium as '500',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: -THEME.spacing[8],
  },
  errorText: {
    flex: 1,
    fontSize: THEME.typography.size[12],
    color: THEME.colors.danger,
    fontWeight: THEME.typography.weight.medium as '500',
  },
  helperText: {
    fontSize: THEME.typography.size[12],
    color: '#64748B',
    lineHeight: 18,
    marginTop: -6,
  },
  readOnlyInputText: {
    color: THEME.colors.textPrimary,
    fontWeight: THEME.typography.weight.semibold as '600',
  },
  footer: {
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[12],
    backgroundColor: CANVAS,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E2E8F0',
  },
  submitBtn: {
    width: '100%',
  },
});
