import { StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

export const SLOT_TIME_CANVAS = '#F4F7FB';

export const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
  },
  topChrome: {
    width: '100%',
  },
  scrollView: {
    flex: 1,
    backgroundColor: SLOT_TIME_CANVAS,
  },
  tabBarWrap: {
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[10],
    paddingBottom: THEME.spacing[4],
    backgroundColor: SLOT_TIME_CANVAS,
  },
  tabPanel: {
    gap: THEME.spacing[14],
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[8],
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
  daysOffCard: {
    backgroundColor: THEME.colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: THEME.spacing[16],
    gap: THEME.spacing[12],
  },
  daysOffEmpty: {
    padding: THEME.spacing[14],
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    gap: THEME.spacing[8],
  },
  daysOffEmptyTitle: {
    fontSize: THEME.typography.size[14],
    fontWeight: '700',
    color: THEME.colors.textPrimary,
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
  tipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: THEME.spacing[8],
    padding: THEME.spacing[12],
    borderRadius: 12,
    backgroundColor: 'rgba(5,150,105,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(5,150,105,0.15)',
  },
  tipText: {
    flex: 1,
    fontSize: THEME.typography.size[12],
    color: '#334155',
    lineHeight: 17,
  },
  emptyHint: {
    fontSize: THEME.typography.size[12],
    color: '#64748B',
    lineHeight: 18,
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
  emptyScheduleBox: {
    padding: THEME.spacing[20],
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: THEME.spacing[10],
    alignItems: 'center',
  },
  emptyScheduleIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(5,150,105,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyScheduleTitle: {
    fontSize: THEME.typography.size[16],
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    textAlign: 'center',
  },
  emptyScheduleText: {
    fontSize: THEME.typography.size[12],
    color: '#64748B',
    lineHeight: 18,
    textAlign: 'center',
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
  primaryBtnFull: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: THEME.spacing[14],
    borderRadius: 14,
    backgroundColor: '#059669',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: THEME.typography.size[14],
    fontWeight: '700',
  },
  saveBtnFull: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: THEME.spacing[14],
    borderRadius: 14,
    backgroundColor: '#059669',
  },
  saveBtnText: {
    fontSize: THEME.typography.size[14],
    fontWeight: '700',
    color: '#FFFFFF',
  },
  weeklySection: {
    gap: THEME.spacing[14],
  },
  weeklyDaysList: {
    backgroundColor: THEME.colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  daysList: {
    gap: THEME.spacing[10],
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
});
