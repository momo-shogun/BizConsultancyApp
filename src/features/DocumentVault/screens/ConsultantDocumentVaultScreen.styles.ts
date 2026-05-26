import { StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

export const CONSULTANT_VAULT_CANVAS = '#F4F7FB';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing[16],
    paddingBottom: THEME.spacing[28],
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroGradient: {
    borderRadius: 20,
    padding: THEME.spacing[16],
    marginBottom: THEME.spacing[14],
    overflow: 'hidden',
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: THEME.spacing[12],
  },
  heroText: {
    flex: 1,
  },
  heroEyebrow: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  heroTitle: {
    marginTop: 4,
    fontSize: THEME.typography.size[20],
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    marginTop: 6,
    fontSize: THEME.typography.size[12],
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 18,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[10],
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  uploadBtnText: {
    fontSize: THEME.typography.size[12],
    fontWeight: '700',
    color: '#047857',
  },
  statsRow: {
    flexDirection: 'row',
    gap: THEME.spacing[10],
    marginTop: THEME.spacing[14],
  },
  statCard: {
    flex: 1,
    padding: THEME.spacing[12],
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.78)',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  statValue: {
    marginTop: 4,
    fontSize: THEME.typography.size[18],
    fontWeight: '800',
    color: '#FFFFFF',
  },
  errorBanner: {
    marginBottom: THEME.spacing[12],
    padding: THEME.spacing[12],
    borderRadius: 14,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[10],
  },
  errorText: {
    flex: 1,
    fontSize: THEME.typography.size[12],
    color: THEME.colors.danger,
  },
  retryText: {
    fontSize: THEME.typography.size[12],
    fontWeight: '700',
    color: '#059669',
  },
  section: {
    marginBottom: THEME.spacing[14],
    padding: THEME.spacing[16],
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8EEF4',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: THEME.typography.size[16],
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: THEME.spacing[10],
  },
  sectionEmpty: {
    fontSize: THEME.typography.size[13],
    color: '#64748B',
    lineHeight: 19,
  },
  groupBlock: {
    marginBottom: THEME.spacing[12],
  },
  groupTitle: {
    fontSize: THEME.typography.size[13],
    fontWeight: '700',
    color: '#334155',
    marginBottom: THEME.spacing[8],
  },
  rowGap: {
    gap: THEME.spacing[8],
  },
  skeletonCard: {
    height: 72,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
    marginBottom: THEME.spacing[8],
  },
});
