import { StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

const CANVAS_FOOTER = '#F4F7FB';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  topChrome: {
    width: '100%',
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
  },
  bannerText: {
    flex: 1,
    fontSize: 13,
    color: '#065F46',
    lineHeight: 20,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: 12,
  },
  errorText: {
    flex: 1,
    fontSize: THEME.typography.size[12],
    color: '#EF4444',
    fontWeight: THEME.typography.weight.medium,
  },
  retry: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8EEF4',
    padding: THEME.spacing[16],
    gap: THEME.spacing[14],
    marginBottom: THEME.spacing[16],
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: -THEME.spacing[8],
  },
  helperText: {
    fontSize: THEME.typography.size[12],
    color: '#64748B',
    lineHeight: 18,
    marginTop: -6,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: THEME.spacing[8],
    paddingHorizontal: THEME.spacing[4],
    marginBottom: THEME.spacing[8],
  },
  securityText: {
    flex: 1,
    fontSize: THEME.typography.size[12],
    color: '#64748B',
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[12],
    backgroundColor: CANVAS_FOOTER,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E2E8F0',
  },
  saveBtn: {
    width: '100%',
  },
});
