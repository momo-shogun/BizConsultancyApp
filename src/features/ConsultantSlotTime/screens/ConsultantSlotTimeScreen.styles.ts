import { StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

export const SLOT_TIME_CANVAS = '#F4F7FB';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: SLOT_TIME_CANVAS,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[4],
    paddingBottom: THEME.spacing[32],
    gap: THEME.spacing[14],
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: THEME.spacing[24],
    backgroundColor: SLOT_TIME_CANVAS,
  },
  hero: {
    borderRadius: 20,
    padding: THEME.spacing[16],
    gap: THEME.spacing[8],
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[12],
  },
  heroIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: THEME.typography.size[18],
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  heroTextBlock: {
    flex: 1,
    gap: 4,
  },
  heroMeta: {
    fontSize: THEME.typography.size[12],
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 18,
  },
  sectionCard: {
    backgroundColor: THEME.colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: THEME.spacing[16],
    gap: THEME.spacing[14],
  },
  sectionHeader: {
    gap: 4,
  },
  sectionTitle: {
    fontSize: THEME.typography.size[16],
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: THEME.typography.size[12],
    color: '#64748B',
    lineHeight: 17,
  },
  scheduleNameInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: THEME.spacing[14],
    paddingVertical: THEME.spacing[12],
    fontSize: THEME.typography.size[14],
    color: THEME.colors.textPrimary,
    backgroundColor: '#F8FAFC',
  },
  emptyScheduleBox: {
    padding: THEME.spacing[16],
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  emptyScheduleTitle: {
    fontSize: THEME.typography.size[14],
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  emptyScheduleText: {
    fontSize: THEME.typography.size[12],
    color: '#64748B',
    lineHeight: 17,
  },
  primaryBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: THEME.spacing[16],
    paddingVertical: THEME.spacing[12],
    borderRadius: 999,
    backgroundColor: '#059669',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: THEME.typography.size[14],
    fontWeight: '700',
  },
  scheduleActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing[10],
    justifyContent: 'flex-end',
  },
  secondaryBtn: {
    paddingHorizontal: THEME.spacing[16],
    paddingVertical: THEME.spacing[12],
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  secondaryBtnText: {
    fontSize: THEME.typography.size[14],
    fontWeight: '700',
    color: '#334155',
  },
  saveBtn: {
    paddingHorizontal: THEME.spacing[18],
    paddingVertical: THEME.spacing[12],
    borderRadius: 999,
    backgroundColor: '#059669',
    minWidth: 120,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: THEME.typography.size[14],
    fontWeight: '700',
    color: '#FFFFFF',
  },
  daysList: {
    gap: THEME.spacing[10],
  },
  overridesHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: THEME.spacing[12],
  },
  overrideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: THEME.spacing[10],
    padding: THEME.spacing[12],
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  overrideText: {
    flex: 1,
    fontSize: THEME.typography.size[14],
    color: '#334155',
    fontWeight: '500',
  },
  overrideActions: {
    flexDirection: 'row',
    gap: 4,
  },
  iconBtn: {
    padding: 6,
  },
  tipCard: {
    flexDirection: 'row',
    gap: THEME.spacing[10],
    padding: THEME.spacing[12],
    borderRadius: 14,
    backgroundColor: 'rgba(5,150,105,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(5,150,105,0.14)',
  },
  tipText: {
    flex: 1,
    fontSize: THEME.typography.size[12],
    lineHeight: 18,
    color: '#047857',
    fontWeight: '500',
  },
});
